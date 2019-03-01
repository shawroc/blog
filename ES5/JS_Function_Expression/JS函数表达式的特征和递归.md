## 函数表达式

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

函数表达式是JavaScript中的一个既强大又容易令人困惑的特性。

定义函数的方式有两种： 一种是函数声明，另外一种就是函数表达式。

函数声明的语法是这样的。

```
function functionName(arg0, arg1, arg2) {
    //函数体
}
```

语法：首先是function关键字，然后是函数的名字，这就是指定函数名的方式。

Firefox、Safari、Chrome和Opera都给函数定义了一个非标准的name属性，通过这个属性可以访问到给函数指定的名字。
这个属性的值永远等于跟在function关键字后面的标识符。

```
//只在Firefox、Safari、Chrome和Opera有效

function functionName(arg0, arg1, arg2) {

}

console.log(functionName.name); // "functionName"

```

**关于函数声明，它的一个重要特征就是函数声明提升（function declaration hoisting），意思是在执行代码之前会先读取函数声明。这就意味着可以把函数声明放在调用它的语句后面。**

```
sayName(); // "Shaw"

function sayName(){
    console.log("Shaw");
}

```

**这个例子不会抛出错误，因为在代码执行之前会先读取函数声明**


第二种创建函数的方式是使用函数表达式。

函数表达式有几种不同的语法形式。
下面是最常见的一种形式。

```

var functionName =  function(arg0, arg1, arg2) {
    //functionBody
};

```

这种形式看起来好像是常规的变量赋值语句，即创建一个函数并将它赋值给变量functionName。

这种情况下创建的函数叫做 **匿名函数（anonymous function）**， 因为function关键字后面没有标识符。
匿名函数也叫拉姆达函数。匿名函数的name属性是空字符窜。

函数表达式与其他表达式一样，在使用前必须先赋值。

```
sayHi(); // error : sayHi is not a function
var sayHi = function(){
    console.log("Hi");
}

// var sayHi //此时sayHi是undefined
// sayHi() // error : sayHi is not a function
// sayHi = function() { console.log("Hi");}

```

理解函数提升的关键，就是理解函数声明与函数表达式之间的区别。


能够创建函数再赋值给变量，也就能够把函数作为其他函数的值返回。

```
function createComparisonFunction(propertyName) {

    return function(object1, object2) {

        var value1 = object1[propertyName];
        var value2 = object2[propertyName];

        if(value1 < value2) {
            return -1
        }else if(value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }
}

```

createComparisonFunction()返回了一个匿名函数。
返回的函数可能会被赋值给一个变量， 或者以其他方式被调用。
不过，在createComparisonFunction()函数内部，它是匿名的。
在把函数当成值使用的情况下，都可以使用匿名函数。
不过，这并不是匿名函数唯一的用途。

## 递归

递归函数就是一个函数通过函数名调用自身的情况下构成的。

```
function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}

factorial(4); // 4*3*2*1 = 24

//4* factorial(3) => 4*3*factorial(2) => 4*3*2*factorial(1) => 4*3*2*1 => 24

```

这是一个经典的递归阶乘函数。虽然这个函数表面看来没什么问题，但下面的代码却可能导致它出错。

```
function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}

var anotherFactorial = factorial;
factorial = null;
//注意这里，其实函数factorial指向一个空对象。
console.log(anotherFactorial(4));  //Error: anotherFactorial is not a function

```

以上代码先把factorial()函数保存在变量anotherFactorial中，然后将factorial变量设置为null，结果指向原始函数的引用只剩下一个。
但在接下来调用anotherFactorial()时，必须执行factorial()，而factorial已经不是函数， 所以就会导致错误。

**Google Chrome测试了上述代码，是不行的, 建议不用深入了解这部分的内容。**
在这种情况下，使用arguments.callee可以解决这个问题。

arguments.callee是一个指向正在执行的函数的指针，因此可以用它来实现对函数的递归调用。

```
function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num-1);
    }
}

```

“return num * arguments.callee(num-1);”  通过使用arguments.callee代替函数名，可以确保无论怎么调用函数都不出问题。
因此，在编写递归函数时，使用arguments.callee总比使用函数名更保险。

但在严格模式下，不能通过脚本访问arguments.callee, 访问这个属性会导致错误。 

不过我们可以使用命名函数表达式来达成相同的成果。

```
var factorial = function f(num){
    if(num <= 1) {
        return 1;
    } else {
        return num * f(num-1);
    }
}

//factorial 指向了函数f

var anotherFactorial = factorial;
//anotherFactorial 指向了函数f

factorial = null;
//factorial 指向了一个空对象。

anotherFactorial(4); //24
////anotherFactorial 指向了函数f, 所以还可以正常调用。

```

以上代码创建了创建了一个名为f()的命名函数表达式，然后将它赋值给变量factorial。
即便把函数赋值给另一个变量，函数的名字f仍然有效，所以递归调用照样能正确完成。
这种方式在严格模式和非严格模式下都行得通。