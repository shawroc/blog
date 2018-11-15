# 函数

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

函数对任何语言来说都是一个核心的概念。通过函数可以封装任意多条语句，而且可以在任何时候调用调用。ECMAScript中的函数使用function关键字来声明，后跟一组参数以及函数体。

函数的基本语法：

```
function functionName(arg0, arg1, arg2,...,argN) {
    statements
}
```

函数示例：

```
function sayHi(name, message) {
    console.log("hello " + name + message);
}
```

这个函数可以通过其函数名来调用，后面还要加上一对圆括号和参数（圆括号中的参数如果有多个，可以用逗号隔开）。调用sayHi()函数的代码如下所示：

```
sayHi("Shaw", "How are you today?"); //"hello Shaw,How are you today?"
```

函数中定义中的命名参数name和message被用作了字符串拼接的两个操作数，而最终结果通过控制台输出了。

**ECMAScript中的函数在定义时不必指定是否返回值。**实际上，任何函数在任何时候都可以通过return语句后跟要返回的值实现返回值。

```
function sum(num1, num2) {
    return num1 + num2;
}

```

这个sum()函数的作用是把两个值加起来返回一个结果。需要注意的是，除了return语句之外，没有任何声表示该函数会返回一个值。

```
var result = sum(5, 10);

console.log(result); //15
```

这个函数会在执行完return语句之后停止并立即退出。因此，位于return语句之后的任何代码都永远不会执行。

```
function sum(num1, num2) {
    return num1 + num2;
    console.log("hello world"); //不会执行。
}
```

在这个例子中，由于调用alert()函数的语句位于return语句之后，因此控制台永远不会输出内容。

当然，一个函数中也可以包含多个return语句。

```
function diff(num1, num2) {
    if ( num1 < num2) {
        return num2 -num1;
    } else {
        return num1 - num2;
    }
}
```

这个例子中定义的diff()函数用于计算两个数值的差。如果第一个数比第二个小，则用第二个数减第一个数。否则，用第一个数减第二个数。代码中的两个分支都具有自己的return语句执行正确的计算。

**另外，return语句也可以不带有任何返回值。在这种情况下，函数在停止执行后将返回undefined值。这种方法一般用在需要提前停止函数执行而又不需要返回值的情况下。**

```

function sayName(name, message) {
    return;
    console.log("Hello " + name + message);
}
```

**推荐的做法是要么让函数始终都返回一个值，要么永远都不要返回值。否则，如果函数有时候有返回值，有时候不返回值，会给调试代码带来不便。**

严格模式对函数有一些限制：

- 不能把函数命名为eval或arguments；

- 不能把参数命名为eval或arguments；

- 不能出现两个命名参数同名的情况；

如果发生以上情况，就会导致语法错误，代码无法执行。

## 理解参数

ECMAScript函数的参数与大多数其他语言中函数的参数有所不同。

**ECMAScript函数不介意传递进来多少个参数，也不在乎传进来参数是什么数据类型。**

也就是说，即便你定义的函数只接收两个参数在调用这个函数时也未必一定要传递两个参数。

可以传递一个、三个甚至不传递参数，而解析器永远不会有什么怨言。

**之所以会这样，原因始ECMAScript中的参数在内部是用一个数组来表示的。函数接收到的始终都是这个数组，而不关心数组中包含哪些参数（如果有参数的话）。**

如果这个数组中不包含任何元素，无所谓；如果包含多个元素，也没有问题。

**实际上，在函数体内可以通过arguments对象来访问这个参数数组，从而获取传递给函数的每一个参数。**

其中，arguments对象只是与数组类似（它并不是Array的实例），因此可以使用方括号语法访问它的每一个元素（即第一个元素时arguments[0]），第二个元素时arguments[1]，以此类推），使用length属性来确定传递进来多少个参数。

前面的例子中，sayHi()函数的第一个参数的名字叫name，而该参数的值也可以通过访问arguments][0]来获取。因此，那个函数也可以像下面这样重写，即不显式地使用命名参数。

```
function sayHi() {
    console.log("Hello " + arguments[0] + arguments[1]);
}

sayHi("Shaw,"," how are you today?"); //"Hello Shaw, how are you today?"

```

这个重写后的函数中不包含命名的参数。虽然没有使用name和message标识符，但函数的功能依旧。

这个事实说明了ECMAScript函数的一个重要特点：命名的参数只提供便利，但不是必需的。

另外，在命名参数方面，其他语言可能需要实现创建一个函数签名，而将来的调用必须与该签名一致。

但在ECMAScript中，没有这些条条框框，解析器不会验证命名参数。

**通过访问arguments对象的length属性可以获知有多少个参数传递给函数。下面这个函数会在每次调用时，输出传入其中的参数个数。**

```
function howManyArgs() {
    console.log(arguments.length);
}

howManyArgs(1); //1
howManyArgs(1,2); //2
howManyArgs(); //0
```

执行以上代码会依次出现3个警告框，分别显示2，0和1。

**由此可见，开发人员可以利用这一点让函数能够接收任意个参数并分别实现适当的功能。**

```
function doAdd() {
    if(arguments.length == 1) {
        console.log(arguments[0] + 10);
    } else if (arguments.length == 2) {
        console.log(arguments[0] + arguments[1]);
    }
}

doAdd(10); //20
doAdd(10,20); //30
```

虽然这个特性算不上完美的重载，但也足够弥补ECMAScript的这一缺憾了。

**另一个与参数相关的重要方面，就是arguments对象可以与命名参数一起使用。**

```
function doAdd(num1, num2) {
    if(arguments.length == 1) {
        console.log(num1 + 10); 
    } else if(arguments.length == 2) {
        console.log(arguments[0] + num2);
    }
}
```

在重写后的这个doAdd()函数中，两个命名参数都与arguments对象一起使用。由于num1的值与arguments[0]的值相同，因此它们可以互换使用（当然，num2和arguments[1]也是如此）。

**关于arguments的行为，还有一点比较有意思。那就是它的值永远与对应命名参数的值保持同步。**

```

function doAdd(num1, num2) {
    arguments[0] = 10;
    console.log(arguments[0] + num2);
}

doAdd(20,20); //30
```

每次执行这个doAdd()函数都会重写第二个参数，将第二个参数的值修改为10。
因此arguments对象中的值会自动反映到对应的命名参数，所以修改arguments[1]，也就修改了num2，结果它们的值都会变成10。

**这并不是说读取这两个值会访问相同的内存空间；它们的内存空间是独立的， 但它们的值会同步。**

另外还要记住，如果只传入一个参数，那么为arguments[1]设置的值不会反映到命名参数中。

这是因为arguments对象的长度是由传入的参数个数决定的，不是由定义函数时的命名参数的个数决定的。

**没有传递值的命名参数将自动被赋予undefined值。这就跟定义了变量但又没有初始化一样。**

例如，如果只给doAdd()函数传递了一个参数，则num2中就会保存undefined值。

严格模式对如何使用arguments对象做出了一些限制。

首先，像前面例子中那样的赋值会无效。其次，重写arguments的值会导致语法错误。


## 没有重载

ECMAScript函数不能像传统意义上那样实现重载。

而在其他语言（如Java）中国，可以为一个函数编写两个定义，只要这两个定义的签名（接收的参数的类型和数量）不同即可。

ECMAScript函数没有签名，因为其参数是由包含零或多个值的类数组来表示的。而没有函数签名，真正的重载是不可能做到的。

**如果在ECMAScript中定义了两个名字相同的函数，则该名字只属于后定义的函数。**

```
function addSomeNumber(num) {
    return num + 100;
}

function addSomeNumber(num) {
    return num + 200;
}

var result = addSomeNumber(100); //300
```

在此，函数addSomeNumber()被定义了两次。第一个版本给参数加100，而第二个版本给参数加200。
由于后定义的函数覆盖了先定义的函数，因此当执行最后一行代码中调用这个函数时，返回的结果是300。

**通过检查传入函数中参数的类型和数量并作出不同的反应，可以模仿方法的重载。**