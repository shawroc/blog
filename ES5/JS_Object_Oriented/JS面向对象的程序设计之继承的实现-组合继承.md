# JS面向对象的程序设计之继承的实现-组合继承

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 组合继承（Combination Inheritance）

组合继承（Combination Inheritance）， 有时候也叫做伪经典继承，指的是：将原型链和借用构造函数的技术组合到一块，从而发两者之长的一种继承模式。

实现思路: 使用原型链实现对原型方法和方法的继承，而通过借用构造函数来实现对实例属性的继承。

这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例对象都有它自己的属性。

```
function SuperType(name){
    this.name = name;
    this.colors = ["red","green","blue"];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name, age) {
    
    //继承属性
    SuperType.call(this, name);

    this.age = age;
}

//继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType();
SubType.prototype.sayAge = function(){
    console.log(this.age);
}

var instance1 = new SubType("Shaw", 18);
instance1.colors.push("black");
console.log(instance1.colors); //["red","green","blue","black"]
instance1.sayName(); // "Shaw"
instance1.sayAge(); // 18

var instance2 = new SubType("Roc", 19);
console.log(instance2.colors); // ["red", "green", "blue"]
instance2.sayName(); // "Roc"
instance2.sayAge(); // 19

```

以上代码，SuperType构造函数定义了两个属性：name和colors。

在SuperType的原型上定义了一个sayName()方法。

SubType构造函数在调用SuperType构造函数时传入了name参数，紧接着又定义了它自己的属性age。

然后，将SuperType的实例对象赋值给SubType的原型，然后又在该新原型上定义了sayAge()方法、

这样一来，就可以让两个不同的SubType实例对象既分别拥有自己的属性——包括colors属性，又可以使用相同的方法了。

**组合避免了原型链和借用构造函数的缺陷，融合了他们的优点。成为JavaScript中最常用的继承模式。而且, 操作符 instanceof 和 isPrototypeOf()方法也能够用于识别基于组合继承创建的对象。**

