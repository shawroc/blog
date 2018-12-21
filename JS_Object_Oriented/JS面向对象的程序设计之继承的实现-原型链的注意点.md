# JS面向对象的程序设计之继承的实现 - 原型链的注意点

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

接上篇

[JS面向对象的程序设计之继承的实现 - 原型链](https://segmentfault.com/a/1190000016693470)

## 1. 别忘记默认的原型

事实上，前面例子中展示的原型链还少一环。

我们都知道， 所有引用类型默认都继承了Object，而这个继承也是通过原型链实现的。

**所有函数的默认原型是Object的实例。因为函数的原型对象也是对象嘛！ 对象当然是Object的实例咯！**

**因此函数的原型都会包含一个内部指针（\_\_proto__), 指向Object.prototype。**

**这也是所有自定义类型都会继承toString()、valueOf()等默认方法的根本原因。**

所以，上篇例子中展示的原型的原型链中还应该包括另外一个继承层次。

以下代码展示了这个完整的原型链。

```

//完整原型链的伪代码

function Object() {
}

Object.prototype = {
    constructor: f Object(),
    hasOwnProperty: f hasOwnProperty(),
    isPrototypeOf: f isPrototypeOf(),
    propertyIsEnumerable: f propertyIsEnumerable(),
    toLocaleString: f toLocaleString(),
    toString: f toString(),
    valueOf: f valueOf()
}

//SuperType 父类型
function SuperType(){
    this.property = true;
}

SuperType.prototype.getSuperProperty = function() {
    console.log(this.property);
    return this.property;
}

/*

SuperType.prototype = {
    constructor: f SuperType(),
    getSuperProperty: function() {
    console.log(this.property);
    return this.property;
    }, 
    __proto__ : {
        constructor: f Object(),
        hasOwnProperty: f hasOwnProperty(),
        isPrototypeOf: f isPrototypeOf(),
        propertyIsEnumerable: f propertyIsEnumerable(),
        toLocaleString: f toLocaleString(),
        toString: f toString(),
        valueOf: f valueOf()
    }
}
*/


//SubType 子类型
function SubType() {
    this.subproperty = false;
}


//子类型 继承 父类型
SubType.prototype = new SuperType();


//实际上子类型的原型是这样的。
/*SubType.prototype = {
    property: true,
    __proto__:  {
        constructor : SuperType,
        getSuperProperty：function() {
            console.log(this.property);
            return this.property;
        }
    }
}
*/

SubType.prototype.getSubProperty = function(){
    console.log(this.subproperty);
    return this.subproperty;
}


//那么现在子类型的原型对象是这样的
/*SubType.prototype = {
    property: true,
    getSubProperty: function()  {
    console.log(this.subproperty);
    return this.subproperty;
    },
    __proto__:  {
        constructor : SuperType,
        getSuperProperty：function() {
            console.log(this.property);
            return this.property;
        }
    }
}
*/

var subInstanceObject = new SubType();
console.log(subInstanceObject.getSuperProperty()); // true

```

一句话，SubType（子类型）继承了SuperType（父类型），

而SuperType（父类型）继承了Object（祖先）。

当调用subInstanceObject.toString()时，实际上调用的是在保存在Object.prototype中的那个方法。


## 2. 确定原型和实例对象关系

 可以通过两种方式来确定原型和实例之间的关系。

 第一种方式是使用instanceof操作符，只要检测的实例对象中的原型链包含出现过的构造函数，结果就会返回true。
 因为，这说明他们都参与了,实例对象的创建。

```
console.log(subInstanceObject instanceof Object); // true
console.log(subInstanceObject instanceof SuperType); // true
console.log(subInstanceObject instanceof SubType); // true
```

由于原型链的关系， 我们可以说subIntanceObject是Object、SuperType或SubType中任何一个类型的实例。

第二种方式是使用isPrototypeOf()方法。同样，只要是原型链中出现过的原型，都可以说该原型链所派生的实例对象的原型。

```
console.log(Object.prototype.isPrototypeOf(subInstanceObject)); //true
console.log(SuperType.prototype.isPrototypeOf(subIntanceObject)); // true
console.log(SubType.prototype.isPrototypeOf(subIntanceObject)); //true
```

## 3. 谨慎地定义方法

子类型有时候需要覆盖父类型的某个方法，或者需要添加父类型中不存在的某个方法。

但不管怎么样，给原型添加方法的代码一定要放在替换原型的语句之后。

```

function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
}

function SubType() {
    this.subproperty = false;
}

//继承了SuperType
SubType.prototype = new SuperType();

//给原型添加方法的代码一定要放在替换原型的语句之后
//添加新方法
SubType.prototype.getSubValue = function() {
    return this.subproperty;
}

//重写 超类型中 的 方法
SubType.prototype.getSuperValue = function() {
    return false;
}

var instance = new SubType();
console.log(instance.getSuperValue())
```

以上代码中，第一个方法getSubValue()被添加到了SubType中。
第二个方法getSuperValue()是原型中已经存在的一个方法。
重写这个方法将会子类的原型会查找到属于自己的getSuperValue()方法。
当通过SuperType的实例对象调用getSuperValue()时， 还会继续调用原来的那个方法。

再次强调，必须在用SuperType的实例对象替换原型之后，再定义两个方法。

**还有一点需要提醒，即在通过原型链实现继承时，不能使用对象字面量创建原型方法。这样会重写原型链的。**

```

function SuperType(){
    this.property = true;
}

SuperType.prototype.getSuperValue = function(){
    return this.property;
}

function SubType(){
    this.subproperty = false;
}

//继承SuperType
SubType.prototype = new SuperType();

/* 
现在的原型
SubType.prototype = {

    property: true,
    __proto__: {
        constructor: SuperType,
        getSuperValue: function() {
            return this.property;
        }
    }
}
*/

//使用对象字面量语法会改写原型，导致上一行代码无效
// SubType.prototype = new Object();
SubType.prototype = {

    getSubValue: function() {
        return this.subproperty;
    },

    someOtherMethod: function () {
        return false;
    }

    /*,
    __proto__ : {
        constructor: fn Object(),
        .......
    }
    */

}

var instance =  new SubType();
console.log(instance.getSuperValue()); // error: instance.getSuperValue is not a function

```

以上代码展示了刚刚把SuperType的实例对象赋值给原型，紧接着又将原型替换成一个对象字面量而导致的问题。

因为SubType的原型其实保存的是一个Object的实例，而非SuperType的实例对象，因此这条链子断了。

## 4. 原型链的问题

原型链虽然很强大，可以用它来实现继承，但是总有缺点，世界上不存在万全法。

最主要的问题来自包含引用类型值的原型。

包含引用类型值的原型属性会被所有实例对象共享。

而这也正是组合使用原型模式和构造函数模式的原因。
在构造函数模式中定义属性，在原型模式中定义共享的方法。

在通过原型来实现原型继承时，原型实际上会变成另一个类型的实例对象。

原先的实例对象属性，也就变成了现在的原型属性了。

```

function SuperType() {
    this.colors = ['red', 'green', 'blue'];
}

function SubType() {
}

// 子类型继承父类型
SubType.prototype = new SuperType();

/*
SubType.prototype = {
    colors: ['red', 'green', 'blue'],
    __proto__: {
        constructor: fn SuperType(),
        .....
    }
}
*/

var instance1 = new SubType();

instance1.colors.push('black');

console.log(instance1.colors); // ['red', 'green', 'blue', 'black']

var instance2 = new SubType();

console.log(instance2.colors); // ['red', 'green', 'blue', 'black']

```

**原型链的第二个问题在于， 没有办法在不影响所有实例对象的情况下，给父类型的构造函数传递参数。**

由于上述两个问题的存在，事件中很少会单独使用原型链。