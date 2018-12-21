# 单体内置对象

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

ECMA-262对内置对象的定义是：“由ECMAScript实现提供的、不依赖于宿主环境的对象，这些对象在ECMAScript程序执行之前就已经存在了。”意思就是说，开发人员不必显式地实例化内置对象，例如：Object、Array和String。

ECMA-262还定义了两个单体内置对象：Global和Math。

## Global对象

Global(全局)对象可以说是ECMAScript中最特别的一个对象了，因为不管从什么角度上看，这个对象是存在的。

ECMAScript中的Global对象在某种意义上是作为一个终极的“兜底儿对象”来定义的。

换句话说，不属于任何其他对象的属性和方法，最终都是它的属性和方法。

所以在全局作用域中定义的属性和函数，都属于Global对象。

诸如：isNaN()、isFinite()、parseInt()以及parseFloat()等等，实际上全都是Global对象的方法。

1. URI编码方法

Global对象的encodeURI()和encodeURIComponent()方法可以对URI(Uniform Resourse Identifiers，通用资源标识符)进行编码，以便发送给浏览器。有效的URI中不能包含某些字符，例如空格。而这两个URI编码方法就可以对URI进行编码，它们用特殊的UTF-8编码替换所有无效的字符，从而让浏览器能够接受和理解。

其中，encodeURI()主要用于整个URI(例如：http://www.worx.com/illegal value.htm)，而encodeURIComponent()主要用于对URI中的某一段（例如前面URI中的illegal value.htm）进行编码。

它们的主要区别在于：encodeURI不会对本身属于URI的特殊字符进行编码，例如冒号、正斜杆、问号和井号；而encodeURIComponent()则会对它发现的任何非标准字符进行编码。

```
var uri = "http://www.worx.com/illegal value.htm#start";

console.log(encodeURI(uri)); //http://www.worx.com/illegal%20value.htm#start

console.log(encodeURIComponent(uri)); //http%3A%2F%2Fwww.worx.com%2Fillegal%20value.htm%23start

```

使用encodeURI()编码后的结果是除了空格之外的其他字符都原封不动，只有空格被替换成了%20。
而encodeURIComponent()方法则会使用对应的编码替换所有非字母数字字符。

这也正是可以对整个URI使用encodeURI()，而只能对附加在现有URI后面的字符串使用encodeURIComponent()的原因所在。


**一般来说，我们使用encodeURIComponent()方法的时候要比使用encodeURI()更多，因为在时间中更常见的是对查询字符串参数而不是对基础URI进行编码。**

与encodeURI()和encodeURIComponent()方法对应的两个方法分别是decodeURI()和decodeURIComponent()。

**其中，decodeURI()只能对使用encodeURI()替换的字符进行解码。**

例如，它可将%20替换成一个空格，但不会对%23表示(#)，而井号不是使用encodeURI()替换的。
同样地，decodeURIComponent()能够解码使用encodeURIComponent()编码的所有字符，即它可以解码任何特殊字符的编码。

```

var uri = "http%3A%2F%2Fwww.worx.com%2Filleagal%20value.htm%23start";

console.log(decodeURI(uri)); //http%3A%2F%2Fwww.worx.com%2Filleagal value.htm%23start

console.log(decodeURIComponent(uri)); //http://www.worx.com/illeagal value.htm#start

```

这里，变量uri包含着一个由encodeURIComponent()编码的字符串。在第一次调用decodeURI()输出的结果中，只有%20被替换成了空格。而在第二次调用decodeURIComponent()输出的结果中，所有特殊字符的编码都被替换成了原来的字符，得到了一个未经转译的字符串（但这个字符串并不是个有效的URI）。

URI方法encodeURI()、encodeURIComponent()、decodeURI()和decodeURIComponent()用于替换已经被ECMA-262第三版废弃的escape()和unescape()方法。URI方法能够编码所有Unicode字符，而原来的方法只能只能正确地编码ASCII码。因此在开发实践中，特别是在产品级的代码中，一定要使用URI方法，不要使用escape()和unescape()方法。

2. eval()

eval()方法大概是真个ECMAS语言中最强大的一个方法:eval()。eval()方法就像是一个完整的ECMAScript解析器，它只接受一个参数，即要执行的ECMAScript（或JavaScript)字符串。

```
eval("alert('hi')");
```
等价于

```
alert('hi');
```

**当解析器发现代码中调用eval()方法时，它会将传入的参数当做实际的ECMAScript语句来解析，然后把执行结果插入到原位置。通过eval()执行的代码被认为是包含该次调用的执行环境的一部分，因此被执行的代码具有与该执行环境相同的作用域链。**

这意味着通过eval()执行的代码可以引用在包含环境中定义的变量。

```
var msg = "hello world";
eval("alert(msg)"); //"hello world"
```

变量msg是在eval()调用的环境之外定义的，但其中调用的alert()仍然能够显示"hello world"。**这是因为第二行代码最终被替换成了一行真正的代码。**同样地，我们也可以在eval()调用中定义一个函数，然后再在该调用的外部代码中引用这个函数：

```
eval("function sayHi(){alert(\"hi\")}")

sayHi();

```

显然，函数sayHi()是在eval()内部定义的。对eval()的调用最终会被替换成定义函数的实际代码，因此可以在下一行调用sayHi()。

对于变量也一样。

```
eval("var msg = \"hello world\"");

alert(msg);
```

**在eval()中创建的任何变量或函数都不会提升，因为在解析代码的时候，它们都被包含在一个字符串中；它们值在eval()执行的时候创建。**

严格模式下，在外部访问不到eval()中创建的任何变量或函数，因此前面两个例子都会导致错误。同样，在严格模式下，eval赋值也会导致错误。

```
"use strict"

eval = "hi"; //causes error
```

**能够解释代码字符串的能力非常强大，但也非常危险。因此在使用eval()时必须极为谨慎，特别是在用它执行用户输入数据的情况下。否则，可能会有恶意用户输入威胁站点或应用程序安全的代码（code injection）。**

3. Global对象属性
   
Global对象还包含一些属性。例如，特殊的值undefined、NaN以及Infinity都是Global对象的属性。此外，所有原生引用类型的构造函数，像Object和Function，也是Global对象的属性。

|属性|说明|
|:-:|:-:|
|undefined|特殊值undefined|
|NaN|特殊值NaN|
|Infinity|特殊值Infinity|
|Object|构造函数Object|
|String|构造函数String|
|Number|构造函数Number|
|Boolean|构造函数Boolean|
|Object|构造函数Object|
|Array|构造函数Array|
|Function|构造函数Function|
|Date|构造函数Date|
|RegExp|构造函数RegExp|
|Error|构造函数Error|
|EvalError|构造函数EvalError|
|RangeError|构造函数RangeError|
|ReferenceError|构造函数ReferenceError|
|SyntaxError|构造函数SyntaxError|
|TypeError|构造函数TypeError|
|URIError|构造函数URIError|


**ECMAScript 5明确禁止给undefined、NaN和Infinity赋值，这样做即使在非严格模式下也会导致错误。**

4. window对象

ECMAScript虽然没有指出如何直接访问Global对象，但Web浏览器都是将这个全局对象作为window对象的一部分加以实现的。因此，在全局作用域中声明的所有变量和函数，就都成为了window对象的属性。

因此，在全局作用域中声明的所有变量和函数，都成为了window对象的属性。

```

var color = "red";

function sayColor() {
    console.log(window.color);
}

window.sayColor(); //"red"
```

JavaScript中的window对象除了扮演ECMAScript规定的Global对象的角色外，还承担了很多别的任务。

想取得Global对象的方法，可以使用如下代码

```

var global = function() {
    return this;
}();

```

以上代码创建了一个立即调用的函数表达式，返回this的值。如前所述，在没有给函数明确指定this值的情况下（无论是通过函数添加为对象的方法，还是通过调用call()或apply()），this值等于Global对象。而像着这样通过简单地返回this来取得Global对象，在任何执行环境下都是可行的。


## Math对象

ECMAScript还为保存数学公式和信息提供了一个公共位置，即Math对象。与我们在JavaScript直接编写的计算功能相比，Math对象提供的计算功能执行起来要快得多。Math对象中还提供辅助完成这些计算的属性和方法。

1. Math对象的属性

Math对象包含的属性大都是数学计算中可能会用到的一些特殊值。

|属性|说明|
|:-:|:-:|
|Math.E|自然对数的底数，即常量e的值|
|Math.LN10|10的自然对数|
|Math.LN2|2的自然对数|
|Math.LOG2E|以2为底e的对数|
|Math.LOG10E|以10为底e的对数|
|Math.PI|π的值|
|Math.SQRT1_2|1/2的平方根（即2的平方根的倒数|
|Math.SQRT2|2的平方根|

虽然讨论这些值的含义与用途超出了本书的范围，但你确实可随时使用它们。

2. min()和max()方法

Math对象还包含许多方法，用于辅助完成简单和复杂的数学计算。

其中，min()和max()方法用于确定一组数组中的最小值和最大值。这两个方法都可以接收任意多个数值参数。

```
var max = Math.max(1,4,5,6);
console.log(max); //6

var min = Math.min(3,56,23,16);
console.log(min); //3
```

**要找到数组中的最大或最小的值，可以像下面这样使用apply()方法。**

```
var values = [2,4,24,5,6,8];

var max = Math.max.apply(Math, values);

var min = Math.min.apply(Math, values);

console.log(max); //24

maxIdx = values.indexOf(max);
console.log(maxIdx); //2
 
console.log(min); //2

minIdx = values.indexOf(min);
console.log(minIdx); //0
```

3. 舍入方法

小数值舍入为整数的几个方法：Math.ceil()、Math.floor()和Math.round()。

- Math.ceil()执行向上舍入，即它总是将数值向上舍入为最接近的整数。
- Math.floor()执行向下舍入，即它总是将数值向下舍入为最接近的整数。
- Math.round()执行标准舍入，即它总是将数值四舍五入为最接近的整数。

```

console.log( Math.ceil(11.1) ); //12

console.log( Math.floor(11.9) ); //11

console.log( Math.round(11.4) ); //11

```

4. random()方法

Math.random()方法返回大于等0小于1的一个随机数。

对于某些站点来说，这个方法非常实用，因为可以利用它来随机显示一些名人名言和新闻事件。

```

value = Math.floor(Math.random()* arr.length + minValue);

```

公式中用到了Math.floor()方法，这是因为Math.random()总返回一个小数值。而用这个小数值乘以一个整数，然后再加上一个整数，最终结果仍然是一个小数。

如果你想得到一个1到10之间的数值，可以像下面这样编写代码。

```

var num = Math.floor(Math.random() * 10 + 1);

```

而如果想要得到一个介于2到10的数值，就可以像下面这样编写代码。

```

var num =  Math.floor(Math.random() * 9 + 2 );

```

多数情况下，可以通过一个函数计算可能值的总数和第一个可能的值。

```

function selectFrom(minValue, maxValue) {
    var range = maxValue - minValue + 1;
    return Math.floor( Math.random() * range + minValue);
}

var num = selectFrom(2,10); 

console.log(num);

```

函数selectFrom()接受两个参数：应该返回的最小值和最大值。

而用最大值减最小值加1得到可能值的总数，然后它又把这些数值套用到了前面的公式中。

利用这个函数，可以方便地从数组中随机去除一项。

```
var colors = ["red", "green", "blue", "yellow", "black", "purple"];

function selectFrom(minValue, maxValue) {
    var range = maxValue - minValue + 1;
    return Math.floor(Math.random()*range + minValue);
}

var color = colors[selectFrom(0, colors.length-1)];

console.log(color);
```

5. 其他方法

Math对象中还包含其他一些与完成各种简单或复杂有关的方法。

|方法|说明|
|:-:|:-:|
|Math.abs(num)|返回num的绝对值|
|Math.exp(num)|返回Math.e的num次幂|
|Math.log(num)|返回num的自然对数|
|Math.pow(num, power)|返回num的power次幂|
|Math.sqrt(num)|返回num的平方根|
|Math.acos(x)|返回x的反余弦|
|Math.asin(x)|返回x的反正弦|
|Math.atan(x)|返回x的反正切|
|Math.atan2(y, x)|返回y/x的反正切值|
|Math.cos(x)|返回x的余弦值|
|Math.sin(x)|返回x的正弦值|
|Math.tan(x)|返回x的正切值|


**引用类型小结**



 















