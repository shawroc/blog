# JS面向对象的程序设计_创建对象_工厂模式，构造函数模式，原型模式——0（未完待续）

## 前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

虽然可以通过Object构造函数或对象字面量来创建单个对象。
但是这些方式有明显的缺点\: 使用同一个接口创建很多对象，会产生大量重复的代码，从性能角度来讲，也会占用大量的内存。 为了解决这个问题，人们开始解决使用工厂模式。那什么是工厂模式呢?

### 工厂模式

工厂模式是计算机领域一种广为人知的设计模式，这种设计模式抽象了创建具体对象的过程。考虑到在ECMAScript中无法创建类，开发者们就发明了一种函数，用函数来封装以特定接口创建对象的细节。

```
function createPerson(name, age, gender, job) {
    var o = new Object();
    o.name  =  name;
    o.age = age;
    o.gender = gender;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    }
    return o; 
}
```

函数createPerson能够根据接受的参数来构建一个包含所有必要信息的Person对象。 可以无数次地调用这个函数，而每次都会返回带有四个属性和一个方法的对象。

就像工厂里生产产品的模具一样，使用模具，就会生产出一个产品。

工厂模式，虽然解决了创建多个类似对象的问题，但却没有解决对象识别的问题， 别人没看到你的源码之前，怎么知道创建对象的类型呢？（即怎么知道一个对象的类型）。 随着javaScript的发展，又一个新设计模式出现。

### 构造函数模式

ECMAScript中的构造函数可以创建特定类型的对象。像Object和Array这样的原生构造函数， 在运行时会自动出现在执行环境中。

我们也可以创建自定义的构造函数，从而定义 \- 自定义对象类型的属性和方法。

例如\: 我们可使用构造函数模式将前面的例子重写如下。
```
function Person(name, age, gender, job) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    }
}

var person1 = new Person("Shaw", "Secret, "Male", "Designer");
var person2 = new Person("Roc", 18, "Female", "Engineer");

```

在这个例子中， Person函数取代了createPerson函数。 Person函数里面的代码除了和createPerson函数中相同的部分外，还存在以下不同之处：

- 没有显式地创建对象
- 直接将属性和方法赋予==this对象==
- 没有return语句

此外，还应该注意到函数名Person使用的是大写字母P。 这又是一种约定俗成，构造函数始终都应该以一个大写字母开头， 而非构造函数则应该以一个小写字母开头。

这种做法借鉴了其他OO语言， 主要是为了区别于ECCMAScript中的其他函数。

==构造函数本身也是函数，只是可以用来创建对象而已。==

要创建Person的新实例对象，必须使用new操作符。以这种方式调用构造函数实际上会经历一下4个步骤:

1. 创建一个新对象，new操作符的作用。
2. 将构造函数的作用域赋予给新对象this。
3. 执行构造函数中的代码（为这个对象添加属性，this对象就指向了这个新对象)。
4. 返回新对象。

```
//实例过程伪代码
var person = new Person(name, age, job);

person = function Person(name, age, job) {
    this = new Object()// this是对象！！
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        return this.name;
    }
    return this;
}()

// this = {
//   name: name;
//   age: age;
//   job: job;
//   sayName: function() {
//      return this.name  
//}
//}

person = this = {
    name: name;
    age: age;
    job: job;
    sayName: function() {
    return this.name  }
}

```

在前面例子的最后，person1和person2分别保存着Person的一个不同的实例对象。 这两个实例对象都有着一个constructor（构造函数属性）属性，该属性指向Person。

```
console.log(person1.constructor == Person); // true
console.log(person2.constructor == Person); // true
```

==对象的constructor属性最初是用来标识对象类型的。==

提到检测对象类型，还是instanceof操作符更可靠一些。 我们在这个例子中创建的所有对象既是Object的实例对象，也是Person的实例对象，这一点可以通过instanceof操作符得到验证。

```
console.log(person1 instanceof Person); // true
console.log(person2 instanceof Person); // true
console.log(person1 instanceof Object); // true
console.log(person2 instanceof Object); // true
```

创建自定义的构造函数意味着将来可以将它的实例标识为一种特定的类型； 而这正是构造函数模式胜过工厂模式的地方。在这个例子中， person1和person2之所以同时是Object的实例，是因为所有对象均继承自Object。

以这种方式定义的构造函数， 是定义在Global对象（在浏览器中是window对象）中的。


1. 将构造函数当做普通函数

构造函数与其他函数的唯一区别，就在于调用它们的方式不同。

==构造函数就是函数，不存在定义构造函数的特殊语法。==

==任何函数， 只要通过new操作符来调用，那它就可以作为构造函数。==

==而任何函数，只要不通过new操作符来调用，那它就是普通的函数。==

```
//当做构造函数使用
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName =  function() {
        console.log(this.name);
    }
}

var person1 = new Person('xxx', 18, 'Soft Engineer');
person1.sayName // "xxx"

//作为普通函数调用
Person("Roc", 27, "Doctor");
window.sayName(); // "Greg"

// 在另外一个对象的作用域中调用
var o = new Object();
Person.call(o,"Kris", 25, "Nurse");
o.sayName(); //"Kris";
```

这个例子的前两行代码展示了构造函数的典型用法，即使用new操作符来创建一个新对象。接下来的两行代码展示了不使用new操作符调用Person()会出现什么结果\:属性和方法都被添加给window对象了。当在全局作用中调用一个函数时，this对象总是指向Global对象（浏览器中就是window对象）。因此，在调用完函数之后，可以通过window对象来调用sayName()方法，并且返回了“Greg”。最后，也可以使用call()(或者apply())在某个特殊对象的作用域调用Person()函数。 这里是在对象o的作用中调用的，因此调用后o就拥有了所有属性和sayName()方法。


2. 构造函数的问题

构造函数模式虽然好用，但也并非没有缺点。使用构造函数的主要问题在于， 就是每个方法都要在每个实例上重新创建一遍。在前面的例子中， person1和person2都有一个名为sayName()方法，但那两个方法不是同一个Function的实例。 不要忘了，ECMAScript中的函数是对象，因此每定义一个函数，也就是实例化了一个对象。 从逻辑角度讲，此时的构造函数也可以这样定义。

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = new Function("alert(this.name)");
    // 与声明函数在逻辑上是等价的。
}
```

从这个角度上来看构造函数，更容易明白每个Person实例化对象的sayName()方法，都包含一个不同的Function实例的本质。换句话说，以这种话方式创建函数，会导致不同的作用域链和标识符解析，但创建Function新实例的机制仍然是相同的。 

==不同实例上的同名函数是不相等的，一下代码可以证明这一点\:==

```
alert(person1.sayName == person2.sayName); // false
```

然而，创建两个完成同样任务的Function实例的确没有必要; 况且有this对象在，根本不用在执行代码前就把函数绑定到特定对象上面。因此，大可像下面那样，通过把函数定义转移到构造函数外部解决这个问题。

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}
function sayName(){
    console.log(this.name);
}
var person1 = new Person("Nancy", 29, "Soft Engineer");
var person2 = new Person("Nanth",27, "Doctor");
```

在这个例子中， 我们把sayName函数的定义转移到了构造函数外部。

而在构造函数内部，我们将sayName属性设置为全局的sayName函数。 这样一来，sayName属性都包含一个指向函数的指针， 因此person1和person2对象就共享了在全局作用中定义的同一个sayName()函数。 这样做确实解决了两个函数做同一件事的问题，可是新问题来了\： 在全局定义的函数，实际上只能被某个对象调用，这样全局作用域有点名不副实。而更让人无法接受的是： 如果对象需要定义很多方法，那么就要定义很多个全局函数，玉石我们这个自定义的引用类型就丝毫没有封装性可言了。

==好在，这些问题可以通过使用原型模式解决==

那么原型模式是什么呢？


### 原型模式

==简而言之，每个函数都有一个prototype（原型）属性，这个属性指向一个对象，prototype属性是一个对象!==

而这个对象的用途是可以包含由特定类型的所有实例对象所共享的属性和方法。

==按照字面意思去理解，prototype就是通过调用构造函数而创建的那个实例对象的原型对象。==

==使用原型对象的优点，可以让所有的实例对象共享prototype上所包含的属性和方法。

==换句话说，不必在构造函数上定义所有实例对象的属性和方法，而是可以把这些信息直接添加到函数的原型对象中。==

==记住，ECMAScript中，函数也是对象。==

```
function Person(){
}

Person.prototype.name = "Shaw";
Person.prototype.age = 18;
Person.prototype.job = "Soft Engineer";
Person.prototype.sayName = function(){
    console.log(this.name);
}

var person1 = new Person();
person1.sayName(); // "Shaw"
var person2 = new Person();
person2.sayName(); // "Shaw"

console.log(person1.sayName == person2.sayName); // true

```

1. 理解原型对象

无论什么时候，只要创建一个新函数，就会根据一组特定的规则为该函数创建一个prototype属性，这个属性的值是一个对象，所以也可以称作函数的原型对象。默认情况下，所有的函数原型对象都会自动获得一个constructor（构造函数）属性， 该属性指向prototype属性所在函数。 就拿前面的例子来说，Person.property.constructor指向Person。 而通过这个构造属性，我们还可以继续为原型对象添加其他属性和方法。

==创建自定义的构造函数之后，其原型对象默认只会取得constructor属性；至于其他方法，则都是从Object继承而来。==

==这也侧面反映出， 函数在ECMAScript中是个对象。==

当调用构造函数创建一个新实例对象之后，该实例对象的内部将包含一个指针（__proto__内部属性），指向构造函数的原型对象。

ECMAScript-262第五版中管这个指针叫[[Prototype]]。虽然在脚本中没有标准的方式访问[[Prototype]], 但Firefox、Safari和Chrome在每个对象上都支持一个属性__proto__；而在其他实现中，这个属性对脚本是完全不可见的。

==要明确的一点，这个连接存在于实例对象与构造函数的原型对象之间， 而不是存在于实例对象与构造函数之间。==

以使用Person构造函数和Person.prototype创建实例的代码为例:

```
//伪代码
Person.prototype = {
    constructor: function Person(arguments){native code},
    name: "Shaw",
    age: "18",
    job: "Soft Engineer",
    sayName: function() {
        console.log(this.name);
        //这里的this指向prototype
    }
}

Person.prototype.constructor => function Person(..){native code}
//=> 指向的意思。
person1.__proto__ => Person.prototype
person2.__proto__ => Person.prototype

```

以上伪代码展示构造函数以及它的原型对象，与它的两个实例对象之间的关系。

在此， Person.prototype 构造函数的原型属性指向原型对象， 而Person.prototype.constructor又指回了Person。

原型对象中除了包含constructor属性，还包括后来添加的其他属性。

Person的每个实例对象\-person1和person2都有一个内部属性，该属性仅仅指向了Person.prototype；

换句话说：调用谁创造了实例对象， 实例对象的__proto__就指向创造者的原型。 很像造人~~

至此，说的都是与构造函数的prototype打交道，和构造函数本身没有任何关系。

此外，要格外注意的是， 虽然这两个实例都不包含属性和方法，但我们可以调用person1.sayName()。这是通过查找对象属性的过程来实现的。

我们可以通过isPrototypeOf()方法来确定对象之间是否存在这种关系。 

从本质上讲，如果实例对象的__proto__属性指向调用isPrototype()方法的原型对象（Person.prototype)， 那么这个方法就返回true。

```
//示例代码

function Person(){}
var person1 = new Person();
var person2 = new Person();
console.log(Person.prototype.isPrototypeOf(person1)); // true, 实例化对象的原型链是否指向构造函数的原型对象
console.log(Person.prototype.isPrototypeOf(person2)); // true。
```

我们用原型对象的isPrototypeOf()方法测试了person1和person2。因为实例化对象内部都有一个指向Person.prototype的指针，因此都返回了true。

吐槽- 这个方法有点难记~

==还好，ECMAScript 5 新增一个方法，叫Object.getPrototypeOf(), 这个方法比较直观好记理解。
在所有的支持的实现中，这个返回[[Prototype]]的值。==

```
function Person(){};
var person1 = new Person();
var person2 = new Person();

var PersonConstructorProto = Object.getPrototypeOf(person1); //获取实例对象指向的构造函数的原型对象。
console.log(PersonConstructorProto);
console.log(PersonConstructorProto == Person.prototype);// true
```

这里的第一行代码返回的是Object.getPrototypeOf(实例对象)方法得到实例对象的原型对象。

==使用Object.getPrototypeOf()可以方便地获取实例对象的原型对象，而这在利用原型实现继承的情况下是非常重要的。==

支持这个方法的浏览器有IE9+、Firefox 3.5+、Safari 5+、Opera 12+和Chrome。

插一条： 查兼容 可以使用这个网站 [caniuse.com](caniuse.com)。

每当代码读取某个对象的属性的时候，都会执行一次搜索， 目标是具有给定名字的属性。 搜索首先从实例对象本身开始。 

如果在实例对象中找到了具有给定名字的属性，则返回实例对象属性的值。

如果没有找到，则沿着实例对象内部的指针，搜索实例对象指向的构造函数的原型对象， 如果在构造函数的原型对象中找到了这个属性，则返回该属性的值。

```
//实例对象搜索属性的过程
//也就是说， 我们调用person1.sayName()的时候，会先后执行两次搜索。
//首先，解析器会问：“实例对象person1有sayName属性吗？”； 答：“没有”。
//然后，它继续搜索，在问：“person1的原型上有sayName属性吗？”; 答：“有”。
//于是，它就读取那个保存在原型对象中的函数。
//同理，当我们调用person2.sayName()时，将会出现相同的搜索过程，得到相同的结果。
//而这正是多个实例对象共享原型所保存的属性和方法的基本原理。

function Person(){}
Person.prototype.name = "Shaw";
Person.prototype.sayName = function(){
    alert(this.name);
}
var person1 = new Person();
var person2 = new Person();
person1.sayName(); // "Shaw"
person2.sayName(); // "Shaw"

```

==函数的原型对象，最初只包含constructor属性， 而该属性也是共享的， 因此可以通过对象实例访问。==

== 虽然可以通过实例对象访问保存在原型中的值，但不能通过实例对象重写原型中的值。如果我们在实例对象中添加了一个属性， 该属性与实例对象的原型对象的一个属性同名，那我们就在实例中创造该属性，该属性将会屏蔽原型中的那个属性。==

```
function Person(){}
Person.prototype.name = "Shaw";
Person.prototype.age = 28;
Person.prototype.job = "Designer";
Person.prototype.sayName = function(){
    console.log(this.name);
}

var person1 = new Person();
var person2 = new Person();
person1.name = "Roc";
console.log(person1.name); //"Roc" 来自person1实例
console.log(person2.name); //"Shaw" 来自 Person.prototype
```

在这个例子中， person1的name属性值就是实例对象属性name的值。无论访问person1.name还是person2.name都能返回响应的值，分别是实例对象自身的name属性值：person1.name = "Roc" 和 person2.name = "Shaw", person2在自身实例对象上找不到name属性，所以只能通过__proto__指针的指向，找到构造函数原型对象的name属性值。

当为对象实例添加一个属性时，这个属性就会屏蔽原型对象中保存的同名属性；

==换句话说。添加这个属性只会阻止我们访问构造函数原型对象的那个属性， 但不会修改那个属性。==

不过，可以使用delete操作符则可以完全去除实例属性，从而能够重新访问原型中的属性。

```

function Person(){

}

Person.prototype.name = "Shaw";
Person.prototype.age = 28;
Person.prototype.job = "Designer";
Person.prototype.sayName = function() {
    console.log(this.name)
}

var person1 = new Person();
var person2 = new Person();
person1.name = "Roc";
console.log(person1.name); // "Roc" 来自实例对象person1
console.log(person2.name); // "Shaw" 来自构造函数的原型对象prototype.name
delete person1.name; // 删除实例对象上的name属性, 还记得之前的章节，说对象的属性数据特性中的configurable, enumerable,writable默认都为true吗？ 所以这里可以通过delete操作符，删除实例对象的属性。
console.log(person1.name); // "Shaw" 只能去构造函数的原型对象prototype找name属性，找到了~~

```

在这个修改后的例子，我们使用delete操作符删除了实例对象的person1的name属性，把它删除后，就恢复了实例对象对构造函数原型对象中的name属性连接。 再调用person1.name, 返回的就是原型中name属性的值了。

使用hasOwnProperty()方法可以检测一个属性是存在于实例对象中，还是存在于构造函数的原型中。

这个方法是从Object原生引用类型中继承而来的，只在给定属性存在于对象实例中时，才会返回true。

```
function Person(){

}
Person.prototype.name = "Shaw";
Person.prototype.age = 28;
Person.prototype.job = "Designer";
Person.prototype.sayName = function(){
    console.log(this.name);
}
var person1 = new Person();
var person2 = new Person();

console.log(person1.hasOwnProperty("name")); // false

person1.name = "Roc";
console.log(person1.name); // "Roc"
console.log(person1.hasOwnProperty("name")); // true

console.log(person2.name); //"Shaw"
console.log(person2.hasOwnProperty("name")); // false

delete person1.name;
console.log(person1.hasOwnProperty("name")); // false
console.log(person1.name); // "Shaw"
```

通过使用Object.getOwnProperty()方法，就能很清楚地知道，访问到的是实例对象属性，还是实例对象的构造函数原型对象。

调用person1.hasOwnProperty("name")时， 只有当person1重写name属性后才会返回true，因为只有这个时候name才是一个实例对象属性，而非构造函数的原型对象。

```
//伪代码 实例对象访问属性或方法过程。

Person.prototype = {
    constructor: function Person(arguments){native code},
    name: "Shaw",
    age: 28,
    job: "Designer",
    sayName: function(){
        console.log(this.name);
    }
}

object person1 <= new from Person;
object person2 <= new from Person;

person1.__proto__ => Person.prototype;
person2.__proto__ => Person.prototype;

object person1.name = "Roc";

so person1.name, it is from object person1, the value it is "Roc"
the "name" from object person1, so getOwnProperty, it is true.

object person2.name, object person2 self not has "name" property, searching for  => Person.prototype.name => find the "name" property, the value is "Shaw", get it.

person2.name = " Shaw";

object person2 not has own Property "name", so person2.getOwnProperty("name"), it is false;

Alright, let us delete object person1.name. 
Okay, object person1 do not has property "name".
He only can find it from Person.prototype, is it has "name" property in Person.prototype.

Yes, it did have.
Okay~, the object person1.name => Person.prototype.name => "Shaw".

Because we delete the "name" property of object person1.
So object person1 not has Own Property.

person1.hasOwnProperty("name"), it is false;

```

ECMAScript 5的 Object.getOwnPropertyDescriptor()方法可用于实例对象的属性，当然也可用于构造函数。

==一定要记住函数也是对象啊~只不过它是一个特殊的对象~ 要不然原型对象上怎么继承那么多Object的方法呢？==

```
var people = {
    name: "Shaw"
}

function Person(){

}

Person.prototype.name = "Roc";
var PersonProp = Person.prototype;

var peoplePropDes = Object.getOwnPropertyDescriptor(people, "name");
console.log(peoplePropDes.value); // "Shaw"

var PersonPropDes = Object.getOwnPropertyDescriptor(PersonProp, "name");
console.log(PersonPropDes.value); //"Roc"

```


