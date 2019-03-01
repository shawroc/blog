# JS面向对象的程序设计_创建对象之组合使用模式

## 前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

### 1. 组合使用构造函数模式和原型模式

创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。 

构造函数，用于定义实例对象的属性。

原型模式，用于定义方法和共享的属性。

这样的话， 每个实例对象都有属于自己属性的一份副本， 但同时又共享着对方法的引用，最大程度地节省了内存。

这种混合模式还支持向构造函数传递参数， 可谓集两种模式之长。

```
//构造函数模式与原型模式， 应用示例

function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["Sharon", "Sandy"];
}

Person.prototype = {
    constructor: Person,
    sayName: function(){
        console.log(this.name);
    }
}

var person1 = new Person("Shaw", 28, "Designer");
var person2 = new Person("Roc", 27, "Doctor");

console.log(person1.sayName()); // "Shaw"
console.log(person2.sayName()); // "Roc"

person1.friends.push("Vans");

console.log(person1.friends); // ["Sharon", "Sandy", "Vans"]
console.log(person2.friends); // ["Sharon", "Sandy"]

console.log(person1.friends === person2.friends); // false
console.log(person1.sayName === person2.sayName); // true

```

在这个例子中，实例对象的属性都是在构造函数中定义的， 所有实例对象共享的属性constructor和sayName()方法则是在原型中定义的。 修改person1.friends并不会影响到person2.friends, 因为person1和person2实例对象分别引用不同的数组。

==这种构造函数与原型模式混合使用的模式，是目前在ECMAScript中使用最广泛、认同度最高的一种创建自定义类型的方法。 可以说， 这是定义引用类型的一种默认模式。==

### 2. 动态原型模式

有其他OO语言经验的开发人员在看到独立的构造函数和原型时，很可能会感觉到困惑。

动态原型模式正是致力于解决这个问题的一个方案，它把所有信息都封装在了构造函数中。

通过在构造函数中初始化原型（在一些必要的情况下），又保持了同时使用构造函数和原型的优点。

==换句话说，可以通过检查某个存在的方法是否有效， 来决定是否需要初始化原型。== 

```
//动态原型模式示例代码

function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    if(typeof this.sayName != 'function') {
        Person.prototype.sayName = function() {
            console.log(this.name);
        }
    }
}
4
var person1 = new Person("Shaw", 18, "Designer");
person1.sayName(); // "Shaw"

```

注意构造函数代码中的这一部分。

```

if(typeof this.sayName != 'function') {
    Person.prototype.sayName = function() {
        console.log(this.name);
    }
}

```

没有像原型模式一样，显式的定义原型的属性和方法。而是调用构造函数时才会完全原型的初始化。

如：
```
function Person(){
}

Person.prototype.sayName = function() {
    console.log(this.name);
}

```

这段代码只会在初次调用构造函数时才会执行。此后，原型完成初始化，不需要在做什么修改了。
不够要记住，这里对原型所做的修改，能够立即在所有实例对象中得到反映。
因此，这种做法可以说非常完美。
其中if语句检查的可以是初始化之后，应该存在的任何属性或方法\- 不必用一大堆if语句检查每个属性和方法；
只需要检查其中一个即可。

对于采用这种模式创建的对象，还可以使用instanceof操作符确定它的类型。

注意： 使用动态原型模式，不能使用对象字面量重写原型。
如果在已经创建了实例对象的情况重写原型，那么会切断已经创建的实例对象与新原型之间的联系。

### 3. 寄生构造函数模式（不建议使用）

通常，在前述的几种模式都不适用的情况下，可以使用(parasitic)构造函数模式。

这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后返回新创建的对象。

从表面上看，这个函数又很像是典型的构造函数。

```

function Person(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    }
    return o;
}

var friend = new Person("Shaw", 18, "Engineer");

friend.sayName(); // "Shaw"

```

在这个例子中，Person函数创建了一个新对象，并以相应的属性和方法初始化该对象，然后返回了这个对象。

除了使用new操作符，并把使用的包装函数叫做构造函数之外，这个模式跟工厂模式是一模一样的。

构造函数在不返回值的情况下，使用new操作符，默认返回一个实例对象。

而通过在构造函数的末尾添加一个return语句， new操作符 + 构造函数 可以重写返回的值。

---
这个模式可以在特殊的情况下用来为对象创建构造函数。

假设我们想创建一个具有额外方法的特殊数组。

由于不能直接修改Array构造函数， 因此可以使用这个模式。

```
function SpecialArray() {

    var values = new Array();

    values.push.apply(values, arguments);

    values.toPipedString = function() {
        return this.join("|");
    }

    return values;

}

var colors = new SpecialArray("red", "blue", "green");

console.log(colors.toPipedString()); //red|blue|green

```

在这个例子中，我们创建了一个名叫SpecialArray的构造函数。

在这个构造函数内部，首先创建了一个数组，然后push()方法（用构造函数接收到的所有参数）初始化了数组的值。

虽然又给数组添加了一个toPipedString()方法， 该方法返回以竖线分隔的数组值。

最后返回整个数组。（ [arguments, toPipedString: ƒ]

接着，我们调用了SpecialArray构造函数，向其中传入了用于初始化数组的参数。（["red", "blue", "green", toPipedString: ƒ]）。

最后，调用了toPipedString()方法。

==关于寄生构造函数模式，需要注意：==

返回的对象与构造函数或构造函数的原型没有关系。 也就是说，寄生构造函数模式下，构造函数创建的对象与在构造函数外创建的对象没有什么不同。 

所以不能依赖instanceof操作符来确定对象的类型。

由于存在上述问题，我们建议在可以使用其他模式的情况下，不要使用这种模式。


### 4. 稳妥构造函数模式

道格拉斯 克罗克福德（Douglas Crockford）famine了JavaScript中的稳妥对象（durable objects）这一概念。

所谓稳妥对象， 指的是没有公共属性，而且其方法也不引用this的对象。

稳妥对象最适合在一些安全的环境中（这些环境中会禁止使用this和new），或者在防止数据被其他应用程序（如Mashup 程序）改动时使用。

稳妥构造函数，遵循与寄生构造函数类似的模式，但有两点不同：

- 新创建对象的实例方法不引用this；
- 不使用new操作符调用构造函数。

按照稳妥构造函数的要求，可以将前面的Person构造函数重写如下

```
function Person(name, age, job) {
    //创建要返回的对象
    var o = new Object();

    //可以在这里定义私有变量和函数

    //添加方法
    o.sayName = function() {
        console.log(name);
    }

    //返回对象
    return o;
}

var friend = Person("Shaw", 18, "Designer");

friend.sayName(); // "Shaw"

```

注意，以这种模式创建的对象中，除了使用sayName()方法之外，没有其他方法访问name的值。

这样，变量friend中保存的是一个稳妥对象。

即使有其他代码会给这个对象添加方法或数据成员，但也不可能有别的办法访问传入到构造函数中的原始数据。

稳妥构造函数模式提供的这种安全性，使得他非常适合在某些安全执行环境-例如，ADsafe(www.adsafe.org)和Caja (http://code.google.com/p/google-caja/\) 提供的环境下使用。

与寄生构造函数模式类似，使用稳妥构造函数模式创建的对象与构造函数之间也没有什么关系，因此instanceof操作符对这种对象也没有意义。
