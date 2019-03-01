# JS面向对象的程序设计_创建对象_工厂模式，构造函数模式，原型模式——1（未完待续）

## 前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

2.  原型对象与in操作符

有两种方式使用in操作符： 单独使用和在for-in循环中使用。

单独使用时，in操作符会通过对象能够访问给定属性时返回true。

==无论该属性存在实例中还是原型中。==

请看下下面的例子

```
function Person(){
}
Person.prototype.name = "Shaw";
Person.prototype.age = 18;
Person.prototype.sayName = function(){
    console.log(this.name);
}
var person1 = new Person();
var person2 = new Person();

console.log(person1.hasOwnProperty("name")); // false , 实例对象person1没有name属性
console.log("name" in person1); // true, "name"属性存在于构造函数的原型对象中，所以返回true

person1.name = "Roc";
console.log(person1.name); // "Roc"
console.log(person1.hasOwnProperty("name")); // true
console.log("name" in person1); // true

console.log(person2.name); // "Shaw"
console.log(person2.hasOwnProperty("name")); // false;
console.log("name" in person2); // true

delete person1.name
console.log(person1.hasOwnProperty("name")); //false
console.log(person1.name); // "Shaw"
console.log("name" in person1); //true
```

在以上代码执行的整个过程中， name属性要么是直接在实例对象上访问到的，要么是通过构造函数的原型对象访问到的。 

因此， 调用“name” in person1 始终返回true，无论该属性存在于实例对象中还是存在于构造函数的原型对象中。

同时使用hasOwnProperty()方法和in操作符，就可以确定该属性到底是存在于对象中，还是存在于原型对象中。

``` 
//确定属性是否只存在于原型对象中。

function isPrototypeProperty(object, property) {
    return !object.hasOwnProperty(property) && (property in object);
}

```

由于in操作符只要通过对象能够访问到属性就返回true，因此只要in操作符返回true而实例对象的hasOwnProperty()方法返回false，就可以确定属性是原型中的属性。

```
function Person(){   
}
Person.prototype.name = "Shaw";
Person.prototype.age = 19;
Person.prototype.job = "Designer";
Person.prototype.sayName = function(){
    console.log(this.name);
}

var person1 = new Person();
console.log(isPrototypeProperty(person1, "name")); // true;

person1.name = "Roc";
console.log(isPrototypeProperty("person1", "name")); false;

```

在这里，name属性存在于Person.prototype中，因此isPrototypeProperty()方法返回true。

当在实例中重写name属性后，该属性就存在于实例中，因此isPrototypeProperty()返回false。

在使用for-in循环时，返回的是所有能够通过对象访问 且 可枚举的（enumerated) 属性，其中既包括存在于实例中对象的属性，也包括存在于原型中的属性。

==回想下，in操作符的定义， 只要属性存在于对象中，就会返回true。==

属性的枚举特性（即将属性的特性[[Enumerable]]的值标记为false）标记为false的话，就不可被枚举了！！

要取得对象上所有可枚举的属性，可以使用ECMAScript 5的Object.keys()方法。 这个方法接收一个对象作为参数， 返回一个包含所有可枚举属性的字符窜数组。

```
function Person(){
}
Person.prototype.name = "Shaw";
Person.prototype.age = 19;
Person.prototype.job = "Soft Engineer";
Person.prototype.sayName = function() {
    console.log(this.name);
}

console.log(Object.keys(Person.prototype)); // ["name", "age", "job", "sayName"]

Object.defineProperty(Person.prototype, "name", {
    enumerable: false
})

Object.getOwnPropertyDescriptor(Person.prototype, "name").enumerable; //false

console.log(Object.keys(Person.prototype));  //name属性的枚举特性变为false了，所以 [ "age", "job", "sayName"];

var keys = Object.keys(Person.prototype); //[ "age", "job", "sayName"]

for(var prop in Person.prototype) {
    console.log(prop); // "age", "job", "sayName"
}

```

这里，变量keys将保存一个数组，数组中是字符窜“age”，“job” 和“sayName”。 这个顺序也是他们在for-in循环出现的顺序。 

如果是通过Person的实例对象调用，则返回的实例对象属性。

如果想要得到所有实例属性， 无论它是否枚举，可以使用方法Object.getOwnPropertyNames()。

```

Object.getOwnPropertyNames(Person.prototype);  //["constructor", "name", "age", "job", "sayName"]

```

注意结果中包含了不可枚举的constructor和name属性。

Object.keys()和Object.getOwnPropertyNames()都可以用来代替for-in循环。

区别在于Object.keys(), 只会返回参数（对象）的可枚举属性，而Object.getOwnPropertyNames()返回所有传入对象参数的所有属性。

3. 更简单的原型语法

可以注意到，前面例子中每添加一个属性和方法就要敲一遍 Person.prototype。

为减少不必要的输入，也为了从视觉上更好地封装原型的功能， 更常见的做法是用一个包含属性和方法的对象字面量来重写整个原型对象。

```

function Person(){
}
Person.prototype = {
    name: "Shaw",
    age: 25,
    job: "Designer",
    sayName : function(){
        console.log(this.name);
    }
}

```

在上面的代码中，我们将Person.prototype赋值为一个以对象字面量形式创建的新对象。

最终结果一样，==但有一个例外: constructor属性不再指向Person了。==

==前面提到过，每创建一个函数，就会创建它的prototye属性（该属性是一个对象），这个对象也会自动获得一个constructor属性指向函数本身。==

==而我们在这里使用的语法（对象字面量形式），本质上完全重写了默认的prototype对象，==

==变成一个全新的对象，因此constructor属性也就变成了新对象的constructor属性（指向Object构造函数）， 不再指向Person函数了。==

==此时，尽管instanceof操作符还能返回正确的结果，但通过constructor已经无法确定对象的类型了。==

```

function Person(){
}

//字面量赋值给prototype属性的伪代码过程
//Person.prototype = new Object(); 改写了prototype
//Person.prototype.__proto__.constructor = function Object(){}
//Person.prototype.name
//....
//
//所以prototype此时的constructor指向了Object;
//不再指向Person了。

Person.prototype = {
    name: "Shaw",
    age: 19,
    job: "Designer",
    sayName: function(){
        console.log(this.name);
    }
}

var person1 = new Person();

console.log(person1 instanceof Person); // true
console.log(person1 instanceof Object); // true

console.log(person1.constructor == Person); // false
console.log(person1.constructor == Object); // true

```

在此，用instanceof操作符，测试Object和Person仍然返回true，但constructor属性则等于Object而不等于Person了。

如果constructor的值真的很重要，可以像下面这样特意将它设置回适当的值。

```
function Person(){
}

// Person.prototype还是被改写了！
Person.prototype = {
    constructor: Person,
    name: "Shaw",
    age: 25,
    job: "Designer",
    sayName: function(){
        console.log(this.name);
    }
}
```

以上代码特意包含了一个constructor属性，并将它的值设置为Person，从而确保了通过概述性能够访问到适当的值。

==注意， 以这种方式重设constructor属性会导致它的[[Enumerable]]特性被设置为true。默认情况下，原生的constructor属性是不可枚举的。因此，如果你使用兼容ECMAScript 5的JavaScrpt引擎， 可以试一试Object.defineProperty()。

```

function Person(){
}

Person.prototype = {
    name: "Shaw",
    age: 28,
    job: "Designer",
    sayName: function () {
        console.log(this.name);
    }
}; 

Object.defineProperty(Person.prototype, "constructor", {
    enumerable: false,
    value: Person
})

```

4. 原型的动态性

由于在函数的原型对象中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反应出来\- 即使是先创建了实例后修改原型对象也照样如此。

```

function Person(){
}

var friend1 = new Person();

Person.prototype.name = "Shaw";
Person.prototype.sayName = function(){
    console.log(this.name);
}

friend1.sayName(); // "Shaw", no problem.

```

以上代码创建了Person的一个实例对象， 并将其保存在变量friend1中,下一条语句在Person的prototype中添加一个方法sayName()。

即使friend1实例对象是在添加新方法之前创建的，但它仍然可以访问这个新方法。

其原因可以归结为实例与原型之间松散连接关系。 当我们调用friend1.sayName()时，首先会在实例对象中搜索名为sayHi的属性，没有找到的话，会计算搜索原型对象。

==因为实例对象与原型之间的连接只不过是一个指针，而非一个副本。==

因此可以在原型对象中找到新的sayName属性并返回保存在原型中的函数。

---

尽管可以随时为原型添加属性和方法，并且修改能够立即在所有实例中反映出来，但如果是重写整个原型对象，那么情况就不一样了。 

==调用构造函数时会为实例对象添加一个指针\[[prototype]\(_\_proto__)， 这个指针指向构造函数最初的原型对象。而把原型修改为另外一个对象，实例对象的指针理所当然的指向了新对象。==

==一定要记住： 实例对象的[[prototype]]\(_\_proto__)指向的是构造函数的原型对象。==

```
function Person(){
}

var friend = new Person(); // friend.__proto__ => Person.prototype 指向没改写之前的原型对象

console.log(Person.prototype); //{constructor: ƒ}

Person.prototype = {
    constructor: "Person",
    name: "Shaw",
    age: "19",
    job: "Designer",
    sayName: function(){
        console.log(this,name);
    }
}

console.log(Person.prototype); //{constructor: "Person", name: "Shaw", age: "19", job: "Designer", sayName: ƒ}
// Person.prototype => new Object(); 改写了， 指向一个新对象。


friend.sayName(); // 还是指向没改成之前的原型对象，里面没有sayName属性，Uncaught TypeError: friend.sayName is not a function

```

重写原型对象切断了与任何之前已经存在的实例对象之间的联系。它们仍然引用的是最初的原型。


5. Javascript原生对象的原型

原型模式的重要性不仅体现在创建自定义类型方面，就连所有原生的原生引用类型，都是采用这种模式创建的。 

所有原生引用类型（object、Array、String等等）都在其构造函数的原型上定义了方法。

例如， 在Array.prototype中可以找到sort()方法，而在String.prototype中可以找到substring()方法。

```

// 伪代码

function Array(arguments) {
}
Array.prototype.sort = function(){};

var arr = new Array(1,3,2);

arr.sort();



function String(arguments) {
}
String.prototype.substring = function(){};

var str = new String('abc');

str.substring();


console.log(typeof Array.prototype.sort); // function
console.log(typeof String.prototype.substring); // function

```

通过原生引用对象的原型，不仅可以取得所有默认方法的引用，而且也可以定义新方法。

可以像修改自定义对象的原型一样修改原生对象的原型，因此可以随时添加方法。 下面的代码就给基本包装类型String添加一个名为startWith()的方法。

```

String.prototype.startsWith = function(text) {
    return this.indexOf(text) == 0;
}

var str = "Hello World";
console.log(str.startsWith("Hello")); // true

```

这里新定义的startsWith()会在传入的文本位于一个字符窜开始时，返回true。既然方法被添加给了String.prototype， 那么当前环境中的所有字符窜都可以调用它。 由于str是字符窜，而且后台会调用String基本包装函数创建这个字符窜，因此通过str是可以调用startsWith()放的。

== 尽管可以这样做，但是不推荐这种方法（修改原生对象的原型）==

如果实现中缺少某个方法，就在原生对象的原型上添加这个方法，那么当在另一个支持该方法的实现中运行代码时，就可能会导致命名冲突。 而且这样做也可能会意外的重写原生方法。

6. 原型模式的问题

任何模式都有优缺点， 那么原型模式的缺点呢？

首先，它省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将获得相同的属性值。 虽然这会在某种程度上带来一些不方便，但还不是原型模式的最大问题，原型模式的最大问题是由其共享的本性导致的。

原型中所有属性是被很多实例共享的，这种共享对函数非常适合。

对于那些包含基本值的属性也说得过去，毕竟通过在实例上添加一个同名属性，可以隐藏原型中的对应属性。

==然而对于包含引用类型值的属性来说， 问题就比较突出了。==

```
function Person() {
}

Person.prototype = {
    constructor: Person,
    name: "Shaw",
    job: "Designer",
    friends: ["Roc", "Van"],
    sayName: function(){
        console.log(this.name);
    }
}

var person1 = new Person();
var person2 = new Person();
person1.friends.push("Avich");

console.log(person1.friends); //["Roc", "Van", "Avich"]
console.log(person2.friends); //["Roc", "Van", "Avich"]

console.log(person1.friends == person2.friends); // true

```

在此，Person.prototype对象有一个friends属性，该属性的值为一个字符窜数组。
然后创建了两个Person的实例对象。 接着，修改person1.friends引用的数组，向数组添加了一个字符窜。
由于friends数组存在于Person.prototype而非person1当中，所以刚刚提到的修改也会通过person2.friends(与person1.friends指向同一个数组)反映出来。

假如我们的初衷是在所有实例中共享一个数组，那么是适用的。

但是一般情况下，实例对象都是要有属于自己的全部属性的。 而这个问题，正是我们很少看到有人单独使用原型模式的原因所在。