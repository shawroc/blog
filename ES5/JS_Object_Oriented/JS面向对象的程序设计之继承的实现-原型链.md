# JS面向对象的程序设计之继承的实现 - 原型链

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

继承是OO（Object Oriented， 面向对象）语言中的一个最为人津津乐道的概念。

许多OO语言都支持两种继承方式：接口继承和实现继承。

接口继承只继承签名，而实现继承则继承实际的方法。

如前所述， 由于函数没有签名，在ECMAScript中无法实现接口继承。

前面暂时看不懂没关系，可以学学一些Java基础知识，这样回过来看，就明白说啥了！！

**记住这句就行，ECMAScript只支持实现继承，而且其实现继承主要是依靠原型链来实现的。**

## 原型链

ECMAScript中描述了原型链的概念，并将原型链作为实现继承的主要方法。

其基本思想是利用原型，让一个引用类型继承另一个引用类型的属性和方法。

简单回顾一下构造函数、原型和实例对象之间的关系：

- 每个构造函数都有一个原型对象。
- 原型对象都包含一个指向构造函数的指针。
- 实例对象都包含一个指向原型对象的内部指针。

```
//伪代码

//构造函数
function Person(){
}

//构造函数的原型对象中constructor指向构造函数自身
Person.prototype.constructor => 指向 function Person(){}

var person1 = new Person();

//实例对象指向原型对象的内部指针。
person1.__proto__ => 指向 Person.prototype

```

这部分，文字描述有些晦涩！看不懂的话，先看代码例子。

假如，我们让原型对象等于另一个类型的实例对象， 结果会怎么样呢？

显然，此时原型对象将包含一个指向另一个原型的指针。

相应地， 另一个原型中也包含着一个指向另一个构造函数原型的指针。

假如，另一个原型又是另一个类型的实例对象，还是包含一个指针指向另外一个构造函数的原型，所以上述关系依然成立。

如此层层递进，就构成了实例与原型的链条。

这就是所谓原型链的基本概念。

你可以想象成 “不断认祖归宗”的过程，认祖归宗的路径连接起来，就形成了一个“血缘链”。

实现原型链的基本模式

```
//实现原型链的示例代码

//SuperType 父类型
function SuperType(){
    this.property = true;
}

SuperType.prototype.getSuperProperty = function() {
    console.log(this.property);
    return this.property;
}

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

以上代码定义了两个类型（构造函数）：

SuperType（父类型）和 SubType（子类型）。

每个类型分别有一个属性和方法。

它们主要的区别是SubType继承了SuperType（子类继承父类），而继承是通过创建SuperType的实例对象， 然后将实例对象赋予SubType.prototype（子类的原型）实现的。

**实现的本质是重写原型，改写为另外一个类型的实例对象，**

**生成另外一个类型的实例对象的过程中，实例对象中的所有属性和方法，赋予给重写的原型，**

**重点，这个实例对象的内部有个属性__proto__指向，构造这个实例对象的构造函数原型，**

**从而实现继承，**

**属性__proto__，确实很像一条链子！**


实现原型链，本质上扩展了原型搜索机制。

当读取或者访问一个实例属性时，首先会在实例中搜索该属性，如果没有找到该属性，则会沿着去搜索实例对象内部的__proto__指向的原型。

通过原型链实现继承，搜索过程，就像沿着一条链子不断向上搜寻。

就上面的示例代码来说，subInstanceObject.getSuperProperty()会经历三次查找！

查找过程

1. 搜索实例对象自身， 没找到该方法，沿着__proto__找。

2. 找到（构造）实例对象的构造函数的原型对象，还是没找到该方法，继续沿着原型对象的__proto__的指向寻找。

3. 找到生成构造函数的原型对象的构造函数，搜索其原型对象，找到了。

在找不到属性或方法的情况下，搜索过程总是要一环一环地前行到原型链末端才会停下来。