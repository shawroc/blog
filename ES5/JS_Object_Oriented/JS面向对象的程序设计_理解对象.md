# JS面向对象的程序设计_理解对象

##### 前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

面向对象(Object-Oriented, OO)的计算机语言有一个标志，就是它们都有一个类class的概念，通过类可以创建任意多个具有相同属性和方法的对象。ECMAScript中没有类的概念，因而它的对象也与基于类的计算机语言中的对象不同。

ECMA-262把对象定义为： “无序属性的集合，其属性可以包含基本值、对象或者函数。”  也就是说对象是一组没有特定顺序的值。对象的每个属性或方法都有一个名字，而每个名字都映射（map）到一个值。所以我们可以把ECMAScript中的对象想象成散列表，换句话说，就是名值对，其中值可以是数据或者函数。每个对象都是基于引用类型创建的，这个值可以是原生类型，也可以是开发人员定义的类型。

## 理解对象

如果我们要创建自定义对象，最简单的方式就是创建一个Object类型的实例对象，然后再为它添加属性和方法。

```
//使用new关键字从Object类型中实例化出一个对象。

var person = new Object();
person.name = "Shaw";
person.age = "Secret";
person.job = "Front-end Engineer";
person.sayName = function(){
    console.log(this.name);
    // 这里的this指向person，call调用它的就是person
}
```

上述代码，创建了一个person对象，并为它添加了三个属性（name, age, job）和一个方法 sayName()。其中，sayName\(\) 方法用于显示this\.name\(被解析为person.name\)的值。 

现在，对象字面量成为创建这种对象的首选模式。

```
// 之前的例子，可以写成这样

var person = {
    name: "Shaw",
    age: "Secret",
    job: "Front-end Engineer",
    sayName: function(){
        console.log(this.name)
    }
}

```

这些属性在创建时都带有一些特性值（attribute ), Javascript通过特性来定义属性（property）的行为。描述特性的字符叫做descriptor。

### 属性特性 PropertyAttribute

特性（attribute）描述了属性（property）的各种特征（也可以理解为特性值），ECMA-262第5版定义这些特性是为了实现JavaScript引擎用的，因此在JavaScript中不能直接访问到它们。为了表示特性是内部值， 该规范把它们放在两对方括号中，[[Enumerable]]。

ECMAScript定义对象的属性分为两种：数据属性和访问器属性。

1. 对象属性的数据特性

数据特性包含一个数据值的位置。在这个位置可以读取和写入值（I/O)。

数据特性的描述符（property attribute descriptor)

- [[Configurable]], 可配置的: 表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性或能否把属性修改为访问器属性。像上面例子那样直接在对象上定义的属性，这些属性的这个特性默认值为true（可以删改定义属性)。
  
- [[Enumerable]], 枚举： 表示能否通过for-in循环返回属性。像上面例子那样直接在对象上定义的属性，对象的属性的这个Enumerable特性值默认为true。

- [[Writable]], 改写: 表示能否修改属性的值。像上面例子那样直接在对象上定义的属性，对象的属性的这个writable特性值默认为true。

- [[value]], 输入读取属性值：读取属性值的时候，从这个位置开始读； 写入属性的时候，把新值保存在这个位置。这个特性的默认值为undefined。

对于上面的那个例子中直接在对象上定义的属性， 属性们的特性值[[Configurable]]、[[Enumberable]]、[[Writable]]的默认值都为true，而[[value]]特性被设置为指定的值。

```
//例子
var person = {
    name: "Shaw"
    //伪代码
    //name: { value: "Shaw"}
};

//这里创建一个名为name的属性，为它指定的值是"Shaw"
//也就是说， [[value]]特性被设置为“Shaw”，而对这个值的任何修改都将反应在这个位置。
```

要修改属性默认的特性，必须使用ECMAScript5的Object.defineProperty()方法。 这个方法接收三个参数： 属性所在的对象、属性的名字和一个描述符对象。 其中， 描述符（descriptor)对象的属性必须是: configurable、enumerable、writable和value。 设置其中的一或多个值，可以修改对应的特性值。请看下面的例子：

```
var person = {};

Object.defineProperty(person, "name", {
    writable: false,
    value: "Shaw"
});

console.log(person.name); //"Shaw"
person.name = "roc";
console.log(person.name); // 还是"Shaw"， 因为通过Object.defineProperty()方法，设置该属性的特性writable的值为false，即不可改写。

```

这个例子创建一个名为name的属性，它的值“Shaw"是不可改写的，即只能读取。如果尝试为它指定新值，赋值操作会被忽略；在严格模式下，赋值操作会抛出错误。

类似的规则也适用于属性的可配置特性。例如：

```
var person = {};
Object.defineProperty(person, "name", {
    configurable: false,
    value: "Shaw"
});
delete person.name; // false， 因为configurable为false； 
console.log(person.name);
```

把属性的特性configurable设置为false，意味着该属性是不可配置的，也就是不能从对象中删除这个属性。如果对这个属性调用delete, 在非严格模式下什么都不会发生， 在严格模式下， 会抛出一个错误。  ==注意==, 一旦把属性的特性定义为不可配置的，就不能再把它变回可配置了。此时，再调用Object.defineProperty()方法，会抛出错误。

```
var person = {};
Object.defineProperty(person, "name", {
    configurable: false,
    value: "Shaw"
    //不指定的话， 其余的特性值为默认值，也就是说特性writable的默认值为 false,
    //特性 enumerable的默认值为 false
})

//Uncaught TypeError: Cannot redefine property: name
Object.defineProperty(person, "name", {
    configurable: true,
    value: "Shaw"
})
```

换句说，可以多次调用Object.defineProperty()方法来修改该属性， 但是设置属性的特性configurable的值为false（不可配置）后，其结果是不可逆的， 就会有限制了。

在调用Object.defineProperty()方法来创建一个新的属性时候，如果不指定，configurable、writable、enumerable特性的默认值都为false。 

如果调用Object.defineProperty()方法只是修改已定义的属性的特性， 则无此限制。 因为已经定义的属性的特性configurable、enumerable、writable默认都为true。比如之前的那个例子：

```
var person = {
    name: "Shaw"
    // 伪代码 
    /*propertyAttribute = {
        configurable(descriptor): true,
        enumerable(descriptor): true,
        writable(descriptor): true,
        value(descriptor): "Shaw"*/
    }
}
```

多数情况下， 我们可能都用不到Object.defineProperty()提供的这些高级功能。

不过，理解这些概念对理解JavaScript对象有很大的帮助。

2. 对象属性的访问器特性

顾名思义就是定义了对象内部，该属性的特性是有权限访问或设置对象内部其他属性。
访问器属性不包含数据值；它们包含一对儿getter和setter函数。

在读取访问器属性时，会调用getter函数，这个函数负责返回有效的值； 在写入访问器属性时，会调用setter函数并传入新值，这个函数负责如何处理数据。 访问器属性有如下4个特性：

- [[configurable]]，是否可配置。 表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性。或者能否把属性修改为数据属性。对于直接在对象上定义的属性， 这个属性的该特性的默认值为true。
  
- [[Enumerable]], 是否可枚举。 表示能否通过for-in循环返回属性。 对于直接在对象上定义的属性，这个属性的该特性的默认值为true。
  
- [[Get]], 读取属性函数。 读取属性时调用的函数。默认值为undefined。

- [[Set]], 设置属性函数。 设置属性时调用的函数。默认值为undefined。

属性的访问器特性不能直接定义, 必须使用Object.defineProperty()来定义。 

```
var cat = {
    _age: 1, 
    adoptionYear: 2016
};

Object.defineProperty(cat, 'age', {
    get: function() {
        return this._age;
    },
    set: function(newAge) {
        if(newAge>1) {
            this._age = newAge; //5
            this.adoptionYear +=  newAge - 1;
        }
    }
});

window.alert(cat.age); //1
cat.age = 5;
window.alert(cat.age); //5
window.alert(cat.adoptionYear); // 2020
```

以上代码创建了一个cat对象，并给它定义两个默认的属性: _age和adoptionYear。 _age 是一种约定俗成的记号，表示只能通过对象属性的访问器特性方法才能访问到的属性(可以想象成对象的成员属性)。 而属性year的访问器特性则包含一个get函数和set函数。get函数返回_age的值， set函数通过计算来确定猫咪的收养年份。因此，把age的属性值修改为5，而adoptionYear变为2020，即已经收养了四年。这是使用访问器属性的常见方法，即设置一个属性的值然后改变另外一个属性的值。

在这个定义对象属性的访问器特性之前，Object.defineProperty(object, 'property', { get: function() {} , set: function(){}}) 。 要创建对象属性的访问器特性，一般都使用两个非标准方法\: \_\_defineGetter\_\_() 和 \_\_defineSetter\_\_(), ==注意这里是双下划线==。 这两个方法最初是由Firefox引入的，后来Safari 3，Chrome 1和Opera9.5也给出相同的实现。 使用这两个遗留的方法，也可以实现对象属性的访问器特性设置。

```
// 使用例子如下
var cat = {
    _age: 1,
    adoptionYear: 2016
}

cat.__defineGetter__('age', function(){
    return this._age;
});

cat.__defineSetter__('age', function(newAge){
    if(newAge > 1) {
        this._age = newAge;
        this.adoptionYear += this._age - 1;
    }
})

alert(cat.age); //1
alert(cat.adoptionYear); //2016
cat.age = 5;
alert(cat.age); //5
alert(cat.adoptionYear); //2020

```

### 同时定义对象多个属性的特性的方法

为对象同时定义多个属性特性的可能性很大，ECMAScript5又定义了一个Object.defineProperties(object, ObjectDescriptor)方法，用这个方法可以通过一次性定义对象的多个属性特性。 该方法接收两个对象参数\: 第一个对象参数是要添加和修改属性特性值的对象，第二个对象参数的属性与第一个对象中要添加或修改的属性一一对应。

```
// 还是代码比较直观

var cat = {};
Object.defineProperties(cat, {
    _name: {
        writable: true,
        value: 'Meow'
    },
    _age: {
        writable: true,
        value: 1
    },
    adoptionYear: {
        writable: true,
        value: 1
    },
    age: {
        get: function() {
            return this._age;
        },
        set: function(newAge) {
            if(newAge <= 1) {
                this._age = 1;
            };
            this._age = newAge;
            this.adoptionYear += newAge -1;
        }
    }
})

alert(cat.age); // 1
cat.age = 3;
alert(cat.age); // 3
alert(cat.adoptionYear); // 3 从小就收养了。

```

### 读取属性的特性

ECMAScript5定义了Object.getOwnPropertyDescriptor(object, 'property')方法， 该方法取得给定属性的特性描述符。 

这个方法接收两个参数\: 

1. 第一个参数为\: 属性所在的对象。
2. 第二个参数为\: 需要读取其特性值（PropertyAttribute) 的对象属性。

该方法的返回值是一个对象，所以可以通过.语法读取到值，如果是属性的访问器特性，返回的这个对象的属性有：configurable、enumerable、get, set; 如果是数据属性， 这个对象的属性有configurable、enumerable、writable和value。

```

var person = {};
Object.defineProperties(person, {
    _name: {
        writable: true,
        value: '请使用person.name = ?，给我定义一个名字呀！'
    },
    _age: {
        writable: true,
        value: '请使用person.age = ?，给我定义一个年龄呀！'
    },
    _gender: {
        writable: true,
        value: '请使用person.gender = ?，给我定义一个性别呀！'
    },
    name: {
        get: function(){
            return this._name;
        },
        set: function(newName) {
            this._name = newName;
        }
    },
    age: {
        get: function(){
            return this._age;
        },
        set: function(newAge) {
            this._age = newAge;
        }
    },
    gender: {
        get: function(){
            return this._gender;
        },
        set: function(newGender) {
            this._gender = newGender;
        }
    }
});

var objPropAttrDescriptor = Object.getOwnPropertyDescriptor(person, '_age');
alert(objPropAttrDescriptor.value); //请使用person.gender = ?，给我定义一个性别呀！
alert(objPropAttrDescriptor.configurable); //false;
alert(typeof objPropAttrDescriptor.get); // undefined;

var objPropAttrDescriptor = Object.getOwnPropertyDescriptor(person, 'age');
alert(objPropAttrDescriptor.value);// undefined;
alert(objPropAttrDescriptor.configurable); //false;
alert(typeof objPropAttrDescriptor.get); // function

```

在JavaScript中，可以针对任何对象 \- 包括DOM和BOM对象，使用Object.getOwnPropertyDescript(object, 'objProperty')方法，。


### 总结

如果英语水平足够好的话，建议看英文原版书籍或者国外大师的博客。毕竟翻译过来的文字，很多东西都变了味， 而且看英文，会让你注意力更加集中，不容易跑神。

接下来我会定期翻译一些国外的精品博客。 立个Flag，促使自己进步。
