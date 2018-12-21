# JS面向对象的程序设计之继承-继承的实现-借用构造函数

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 借用构造函数

为了解决原型中包含引用类型值所带来问题，开发人员开始使用一种叫做**借用构造函数(constructor stealing)的技术。**

有时候也叫伪造对象或者经典继承。

这种技术的基本思想非常简单，即在子类型构造函数内部调用超类型构造函数。

函数只不过是在特定环境中的执行代码的对象，因此通过使用apply()和call()方法也可以在新创造的对象上执行构造函数。

```

function SuperType() {
    this.colors = ["red","blue","green"];
}

function SubType() {
    //继承了SuperType
    SuperType.call(this);
}

var instance1 = new SubType();

instance1.colors.push("black");
console.log(instance1.colors); //["red","blue","green","black"]

var instance2 = new SubType();
console.log(instance2.colors); //["red","blue","green"]

```

注意，这一段代码“借调”了超类型的构造函数。

```
function SubType() {
    //继承了SuperType
    SuperType.call(this);
}
```

通过使用call()方法（或apply()方法也可以），实际上是在将要创建的SubType实例对象的环境下调用了SuperType构造函数。

这样一来，就会在新SubType对象上，执行SuperType()函数中定义的所有对象初始化代码。

所以，SubType的每个实例对象都有具有自己的colors属性的副本了。

### 传递参数

相对于原型链而言，借用构造函数有一个很大的优势，就是可以在子类型构造函数中向超类型构造函数传递参数。

```
function SuperType(name) {
    this.name = name;
}

function SubType(){
    //继承了SuperType，同时还传递了参数
    SuperType.call(this, "Shaw");

    //实例属性
    this.age = 18;
}

var instance = new SubType();

console.log(instance.name); // "Shaw"
console.log(instance.age); // 18

```

以上代码中的SuperType只接受一个参数name，该参数会直接赋值给一个属性。

在SubType构造函数内部调用SuperType构造函数时，实际上是为SubType的实例对象设置了name属性（this的指向，跟执行上下文有关）。

为了确保SuperType构造函数不会重写子类型的属性，可以在调用超类型的构造函数后，再添加应该在子类型中定义的属性。

### 借用构造函数的问题

如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题。

方法都在构造函数中定义，函数的复用就无从说起了，每实例化一个对象，实质上都在每个实例对象上重新创建了一遍方法， 造成内存和资源的浪费。

而且，在超类型的原型中定义的方法，对子类型而言也是不可见的（因为这里没用原型对象，实际上子类型的原型链指向了Object）， 结果所有类型都只能使用构造函数模式。

考虑到这些问题，借用构造函数的技术也是很少单独使用的。