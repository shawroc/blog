# this对象

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

**this对象是在运行时基于函数的执行环境绑定：**

**在全局环境中， this等于window，而当函数被作为某个对象的方法调用时，this就指向了那个对象。**

**不过匿名函数的执行环境具有全局性，因此其this对象通常指向window。**

在闭包中使用this对象可能会导致一些问题。

有时候由于编写闭包的方式不同，这一点可能不会那么明显。

```

// 在全局环境中，this等于window
function thisBoundForWindow(){
    console.log(this);
    console.log(this.name);
}

thisBoundForWindow(); // Window

var o = new Object();

o.name = "Shaw";

//当函数被作为某个对象的方法调用时，this就指向了那个对象。
thisBoundForWindow.apply(o); // {name: "Shaw"}; "Shaw" ;

```

```
//在闭包中使用this对象可能会导致一些问题。
//有时候由于编写闭包的方式不同，这一点可能不会那么明显。

var name = "The Window";

var object = {
    name: "My Object",
    getNameFunc: function() {
        return function() {
            console.log(this.name);
        }
    }
}

object.getNameFunc()(); // "The Window"

/*
object.getNameFunc return=> function() {
        return function() {
            console.log(this.name);
        }
    }  => ()调用，还是在全局环境下调用的，所以this.name = window.name => "The Window"
*/
```

以上代码先创建了一个全局变量name，又创建了一个包含name属性的对象。

这个对象还包含一个方法——getNameFunc(), 它返回一个匿名函数，而匿名函数又返回this.name，这个匿名函数就是闭包。

再来回顾一下“闭包”的定义：

**有权访问另外一个作用域中的变量的函数就是闭包。**

由于getNameFunc()返回一个函数，因此调用object.getNameFunc()()就会调用它返回的函数，结果就是控制台打印出一个字符窜。

然而，这个例子返回的字符窜是"The Window"，即全局name变量的值。

那么，如何把this指向例子中的object呢？

**把外部作用域的this对象保存在一个闭包能够访问到的变量里，就可以让闭包访问该对象了。（注意，这种手法，在使用回调函数的时候也经常用到）**

```
var name = "The Window";

var object = {
    name: "My Object",
    getNameFunc: function(){
        var that = this;
        return function() {
            console.log(that.name);
        }
    }
}

object.getNameFunc()(); // "My Object"


/*
// 伪代码过程
object.getNameFunc  execute
=> this = object = that 
=>function() {console.log(that.name);}  
=> ()
=> that.name = object.name 
=> "My Object" 
*/
```

在定义匿名函数之前，把this对象赋值给了一个名叫that的变量。 

而在定义了闭包之后，闭包也可以访问这个变量，因为它是我们在包含函数中特意声明的一个变量。

即使在函数返回之后，that也仍然引用着object， 所以调用Object.getNameFunc()就返回了"My Object"。


**在几种特殊情况下，this的值可能会意外地改变。比如，下面的代码时修改前面例子的结果。**

```

var name = "The Window";

var object = {

    name: "My Object",

    getName: function() {
        console.log(this.name);
    }
};

object.getName(); // "My Object"
(object.getName)(); // "My Object"
(object.getName = object.getName)(); // "The Window"

```

第一行代码跟平常一样调用了object.getName()，返回时"My Object"，因为this.name就是object.name。

第二行代码在调用这个方法前给它加上了括号，虽然加上括号之后，就好像是在引用一个函数，但this的值得到了维持，因为object.getName和(object.getName)的定义是相同的。

第三行代码先执行了一条赋值语句，然后再调用赋值后的结果。因为这个赋值表达式是函数本身，所以this的值得不到维持，结果就返回了"The Window"。

```
//第三个例子伪代码
//理解此段代码，首先要明确一个知识点：赋值语句是有返回值的，返回值就是所赋的值（也就是‘=’右边的值）。

(object.getName = object.getName)(); // "The Window"

(object.getName = function(){ console.log(this.name)})();

(function(){console.log(this.name)})();
//所以this指向window

```

当然，我们不太可能会像第二行和第三行代码一样调用这个方法。暂时理解不了也没事，这个例子有助于说明即使是语法的细微变化，都有可能意外地改变this值。