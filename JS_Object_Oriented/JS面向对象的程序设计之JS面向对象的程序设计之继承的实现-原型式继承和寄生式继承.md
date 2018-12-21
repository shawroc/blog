# JS面向对象的程序设计之继承的实现-原型式继承和寄生式继承

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 原型式继承

道格拉斯 克劳克福德在2006年写了一篇文章，题为Prototypal Inhertitance in JavaScript(JavaScript中的原型式继承)。

在这篇文章中，他介绍了一种实现继承的方法，这种方法并没有使用严格意义上的构造函数。

他的想法是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

为了达到这个目的，他给出了如下函数。

```
function object(o) {
    function F(){};
    F.prototype = o;
    return new F();
}
```

在object()函数内部，先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例对象。

从本质上讲，object()对传入的对象执行了一次浅复制。

```

function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}

var person = {
    name: "Shaw",
    friends: ["Sharon", "Sandy", "Van"]
}

var person1 = object(person);

/*
person1 = function object(person){
    function F(){};
    F.prototype = person1;
    return new F();
}()

person1 = function object({
    name: "Shaw",
    friends: ["Sharon", "Sandy", "Van"]
}){
    function F(){};
    F.prototype = {
        name: "Shaw",
        friends: ["Sharon", "Sandy", "Van"]
    }
    return {
    }
}

person1 = {

};

{}.__proto__ = {
    name: "Shaw",
    friends: ["Sharon", "Sandy", "Van"]
}
*/

person1.name = "Roc";
person1.friends.push("Roster");

var person2 = object(person);

person2.name = "Linda";
person2.friends.push("Jobs");

console.log(person.friends); //["Sharon", "Sandy", "Van", "Roster", "Jobs"]
console.log(person1.friends); //["Sharon", "Sandy", "Van", "Roster", "Jobs"]
console.log(person2.friends); //["Sharon", "Sandy", "Van", "Roster", "Jobs"]

```

克罗克福德主张的这种原型式继承，要求你必须有一个对象可以作为另一个对象的基础。

如果有这么一个对象的话，可以把它传给object()函数，然后再根据具体需求对得到的对象加以修改即可。

ECMAscript5通过新增Object.create()方法规范了原型式继承。
这个方法接收两个参数： 一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。

在传入一个参数的情况下，Object.create()与object()方法的行为相同。

```
var person = {
    name: "Shaw",
    friends: ["Sharon", "Sandy", "Van"]
}

var person1 = Object.create(person);
person1.name = "Roc";
person1.friends.push("Roster");

var person2 = Object.create(person);
person2.name = "Linda";
person2.friends.push("Messi");

console.log(person.friends); //["Sharon", "Sandy", "Van", "Roster", "Messi"]
console.log(person1.friends); //["Sharon", "Sandy", "Van", "Roster", "Messi"]
console.log(person2.friends); //["Sharon", "Sandy", "Van", "Roster", "Messi"]
```

Object.create()方法的第二个参数与Object.defienProperties()方法的第二个参数格式相同：

每个属性都是通过自己的描述符定义的。

以这种方式指定的任何属性都会覆盖原型对象上的同名属性。

```
var person = {
    name: "Shaw",
    friends: ["Sharon", "Sandy", "Selina"]
}

var person1 = Object.create(person, {
    name: {
        value: "Roc"
    }
})

console.log(person1.name); //"Roc"
```

支持Object.create()方法的浏览器有IE9+, Firefox 4+, Opera 12+ 和 Chrome。

适用场景：

在没有必要兴师动众地创建构造函数，而只想让一个对象与另外一个对象保持类似的情况下，原型式继承是完全可以胜任的。

千万要记住，包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。

## 寄生式继承

寄生式（parasitic）继承是与原型式继承紧密相关的一种思路，并且也是由大神克劳克福推而广之的。

寄生式继承的思路与寄生构造函数和工厂模式类似。

创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```

function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}

function createAnother(original) {
    var clone = object(original); //通过调用函数创建一个新对象
    clone.sayHi = function(){ //以某种方式来增强这个对象
        console.log("hi");
    }
    return clone; //返回这个对象
}
```

在这个例子中， createAnother()函数接收了换一个参数，也就是将要作为新对象基础的对象。
然后，把这个对象参数(original)传递给object()函数， 将返回的结果赋值给clone。

再为clone对象添加一个新方法sayHi()，最后返回clone对象。

可以像下面这样来使用createAnother()函数：

```
function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}

function createAnother(original) {
    var clone = object(original); //通过调用函数创建一个新对象
    clone.sayHi = function(){ //以某种方式来增强这个对象
        console.log("hi");
    }
    return clone; //返回这个对象
}

var person = {
    name: "Shaw",
    friends: ["Sandy", "Sharon", "Van"]
}

var anotherPerson = createAnother(person);

anotherPerson.sayHi(); //"hi"
```

这个例子中的代码基于person返回一个新对象——anotherPerson。新对象不仅具有person的所有属性和方法，而且还有还有自己的sayHi()方法。

在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。

前面示范继承模式时使用的object()函数不是必需的，任何能够返回新对象的函数都适用于此模式。

