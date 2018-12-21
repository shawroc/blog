## 私有变量

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

严格来讲，JavaScript中没有私有成员的概念。

所有对象属性都是公有的。

**不过，倒是有一个私有变量的概念。**

**任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量。**

**私有变量包括函数的参数、局部变量和在函数内部定义的其他函数。**

```

function add(num1, num2) {
    var sum = num1 + num2;
    return sum;
}

```

在这个函数内部，有3个私有变量：num1、num2和sum。
在函数内部可以访问这几个变量，但在函数外部则不能访问它们。


如果在这个函数内部创建一个闭包，那么闭包通过自己的作用域链也可以访问这些变量。
而利用这一点，就可以创建用于访问私有变量的公有方法。


有权访问私有变量和私有函数的公有方法称为特权方法（privileged method）。

有两种在对象上创建特权方法的方式。

第一种是在构造函数中定义特权方法，基本模式如下：

```
function MyObject() {

    //私有变量和私有函数
    var privateVariable = 10;

    function privateMethod() {
        return false;
    }

    //其实还是叫公有方法比较符合逻辑。当然也可以叫特权方法，privileged method
    this.publicMethod = function() {
        privateVariable ++;
        return privateMethod();
    }
}

```

这个模式在构造函数内部定义了所有私有变量和函数。
然后，又继续创建了能够访问这些私有变量的特权方法。

能够在构造函数中定义特权方法，是因为特权方法作为闭包有权访问在构造函数中定义的所有变量和函数。

对这个例子而言，变量privateVarible和函数privateMethod()只能通过特权方法publicMethod()来访问。

**在创建MyObject的实例后，除了使用publicMethod()这一个途径外，没有任何方法可以直接访问privateVariable和privateMethod()。**

利用私有变量和特权方法，可以隐藏那些不应该被直接修改的数据。

```

function Person(name) {
    //引用着构造函数里面的私有变量name

    this.getName = function(){
        return name;
    };

    this.setName = function(value){
        name = value;
    };

}

var person = new Person("Shaw");
console.log(person.getName()); // "Shaw"

person.setName("Roc");
console.log(person.getName()); // "Roc"


```

以上代码，在Person()构造函数中定义了两个特权方法：getName()和setName()。
这两个方法都可以在构造函数外部使用，而且都有权访问私有变量name。
但在Person构造函数外部，没有任何办法访问name。
由于这两个方法是在构造函数内部定义的，它们作为闭包都能够通过作用域链访问name。
私有变量name在Person的每一个实例对象中都有不同，因为每次调用构造函数都会重新创建这两个方法。

在构造函数中定义特权方法也有一个缺点，那就是你必须使用构造函数模式来达到这个目的。

构造函数模式的缺点是针对每个实例对象都会创建同样一组新方法，而使用静态私有变量来实现特权方法可以避免这个问题。

## 静态私有变量

通过在私有作用域中定义私有变量或函数，同样也可以创建特权方法：

```
(function(){

    //私有变量和私有函数
    var privateVariable = 10;

    function privateFunction() {
        return false;
    }

    //构造函数
    MyObject = function(){
    };

    //特权/公有方法
    MyObject.prototype.publicMethod = function() {
        privateVariable++;
        return privateFunction();
    };

})()
```

这个模式创建了一个私有作用域，并在其中封装了一个构造函数及相应的方法。

在私有作用域中，首先定义了私有变量和私有函数，然后又定义了构造函数及公有方法。

公有方法是在原型上定义的，这一点体现了典型的原型模式。

需要注意的是，**这个模式在定义构造函数时并没有使用函数声明，而是使用了函数表达式。**
**函数声明只能创建局部函数，但那不是我们想要的。出于同样的原因，我们也没有在声明MyObject时使用var关键字。**

**记住： 初始化未经声明的变量，总是会创建一个全局变量。**

因此，MyObject就成了一个全局变量，能够在私有作用域之外被访问到（window.MyObject)。
也要知道，在严格模式下给未经声明的变量赋值会导致错误。

这个模式与在构造函数中定义特权方法的主要区别，就在于私有变量和函数是由实例对象共享的。

由于特权方法是在原型上定义的，因此所有实例对象都使用同一个函数。

而这个特权方法，作为一个闭包，总是保存着对包含作用域的引用。

```

(function(){

    var name = "";

    Person = function(value) {
        name = value;
    }

    Person.prototype.getName = function(){
        return name;
    }

    Person.prototype.setName = function(value) {
        name = value;
    }

})();

var person1 = new Person("Shaw");
console.log(person1.getName()); // "Shaw"

person1.setName("Roc");
console.log(person1.getName()); // "Roc"

var person2 = new Person("Sandy");

console.log(person1.getName()); // "Sandy"
console.log(person2.getName()); // "Sandy"

```

这个例子中的Person构造函数与getName()和setName()方法一样，都有权访问私有变量name。
在这种模式下，变量name就变成了一个静态的、由所有实例共享的属性。
也就是说，在一个实例上调用setName()会影响所有实例。
而调用setName()或新建一个Person实例都会赋予name属性一个新值。

结果就是所有实例都会返回相同的值。

以这种方式创建静态私有变量会因为使用原型而增进代码复用，但每个实例都没有自己的私有变量。
到底是使用实例变量，还是静态私有变量，最终还是要视需求而定。

**多查找作用域链中的一个层次，就会在一定程度上影响查找速度。而这正是使用闭包和私有变量的一个明显不足之处。**