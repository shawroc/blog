# JS面向对象的程序设计之继承的实现-寄生组合式继承

## 寄生组合式继承

组合继承是JavaScript最常用的继承模式。

不过，它也有自己的不足。

组合继承最大的问题就是无论在什么情况下，都会调用两次超类型构造函数：

一次是在创建子类型原型的时候。

另外一次是在子类型构造函数内部。

子类型最终会包含超类型对象的全部实例属性，但我们不得不在调用子类型构造函数时重写这些属性。

```
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "green", "blue"];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name); //第二次调用父类型
    this.age = age;
}

SubType.prototype = new SuperType(); // 第一次调用父类型

/*
//到这里SubType的原型
SubType.prototye = {
    name: undefined,
    colors: ["red", "green", "blue"],
    __proto__: {
        constructor: SuperType,
        sayName: function(){
            console.log(this.name);
        }
    }

*/

SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
    console.log(this.age);
}

/*
//到这里SubType的原型
SubType.prototye = {
    name: undefined,
    colors: ["red", "green", "blue"],
    constructor: SubType,
    sayAge: function() {
        console.log(this.age);
    },
    __proto__: {
        constructor: SuperType,
        sayName: function(){
            console.log(this.name);
        }
    }
*/

var sub = new SubType();

/*
// SubType的实例对象sub，其实是这样的
sub = {
    name: undefined,
    colors: ["red", "green", "blue"],
    age: undefined,
    __proto__: {
        name: undefined,
        colors: ["red", "green", "blue"],
        constructor: SubType,
        sayAge: function() {
            console.log(this.age);
        },
        __proto__: {
            constructor: SuperType,
            sayName: function(){
                console.log(this.name);
            }
        }
    }
}

*/
```

在第一次调用SuperType构造函数时，SubType.prototype会得到两个属性：name和colors；它们都是SuperType的实例属性， 只不过现在位于SubType的原型中。

如果我们调用SubType构造函数时，又会调用一次SuperType构造函数，这一次有在新对象上创建了实例属性name和colors。于是，这两个属性就屏蔽了原型中的两个同名属性。

有两组name和colors属性: 一组在实例上，一组在SubType原型中。
这就是调用两次SuperType函数的结果。


**好在，我们已经找到了解决这个问题方法——寄生组合式继承**

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。

其背后的基本思路：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。**本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。**

```
function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}

function SuperType(name) {
    this.name = name;
    this.colors = ["red", "green", "blue"];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
}

function inheritPrototype(SubType, SuperType){
    var prototype = object(SuperType.prototype);
    prototype.constructor = SubType;
    SubType.prototype = prototype;
}


inheritPrototype(SubType, SuperType);

var instance  =  new SubType("Shaw", 18);

instance.sayName(); //"Shaw"

```

这个实例中的inheritPrototype()函数实现了寄生组合式继承的最简单形式。

这个函数接收两个参数： 子类型构造函数和超类型构造函数。

在函数内部，第一步是创建超类型原型的一个副本。第二步是为创建的副本添加constructor属性，从而弥补因为重写原型而失去的默认的constructor属性。 最后一步，将新创建的对象（副本）赋值给子类型的原型。

这样，我们就可以调用inheritPrototype()函数的语句，去替换前面例子中为子类型原型赋值的语句了。

这个例子的高效率体现在它只调用了一次SuperType()构造函数，并且因此避免了在SubType.prototype上面创建不必要的、多余的属性。与此同时，原型链还能保持不变。

因此，还能够正常使用instanceof和isPrototypeOf()。

开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。
