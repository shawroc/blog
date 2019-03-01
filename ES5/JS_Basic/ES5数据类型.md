# 数据类型

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---


**ECMAScript中有5中简单数据类型（也成为基本数据类型）：String, Number, Boolean, Undefined, null。还有一种复杂数据类型——Object，Object本质上是由一组无序的名值对组成的。**

ECMAScript不支持任何创建自定义类型的机制，而所有值最终都是上述6种数据类型之一。

由于ECMAScript数据类型具有动态性，因此的确没有再定义其他数据类型的必要了。

## typeof操作符

鉴于ES是松散类型的，因此需要有一种手段来检测给定变量的数据类型——typeof就是负责提供这方面信息的操作符。

对一个值使用typeof操作符可能返回下列某个**字符串：**

- "undefined" —— 如果这个值未定义。
- "boolean" —— 如果这个值是布尔值。
- "string" —— 如果这个值是字符串。
- "number" —— 如果这个值是数值。
- "object" —— 如果这个值是对象或null。
- "function" —— 如果这个值是函数。

```
var underfinedValue;

var sum = function(){};

var trueBoolean = true;

var emptyObject = null;

var str = "str";

var obj = {};

var num = 1;

typeof underfinedValue; //"undefined"

typeof sum; //"function"

typeof trueBoolean; //"boolean"

typeof emptyObject; //"object"

typeof str; //"string"

typeof obj; //"object"

typeof num; //"number"

```

**typeof操作符的操作数可以是变量，也可以是数值字面量。**
**注意，typeof是一个操作符而不是一个函数，因此typeof()，后面的圆括号尽管可以用，但不是必须的。**

有些时候，typeof操作符会返回一些令人迷惑但技术上却正确的值。比如，调用typeof null会返回"object"，**因为特殊值null被认为是一个空的对象引用。**

**Safari5及之前的版本、Chrome7及之前版本在对正则表达式调用typeof操作符时会返回"function"（现在也返回“object”），而其他浏览器在这种情况下会返回“object”。

**从技术角度讲，函数在ECMAScript中是对象，不是一种数据类型。然而，函数也确实有一些特殊的属性，因此通过typeof操作符来区分函数和其他对象是有必要的。**

## Undefined

Undefined只有一个值，即特殊的undefined。

在使用var声明变量但未对其加以初始化时，这个变量的值就是undefined。

```
var message;

console.log(message === undefined); //true

```

以上代码声明了变量message，但未对其进行初始化。比较这个变量与undefined字面量，结果表明它们是相等的。

```
var message = undefined;

console.log(message === undefined); //true
```

这个例子使用undefined值显式初始化了变量message。但没必要这么做，未经初始化的值默认就会取得undefined值。

**一般而言，不存在需要显式地把一个变量设置为undefined值的情况。字面值undefined的主要目的是用于比较，而ECMA-262第3版之前的版本中并没有规定这个值。第3版引入这个值是为了正式区分空对象指针与未经初始化的变量。**

不过，包含undefined值的变量与尚未定义的变量还是不一样的。

```
var message; // 这个变量声明之后默认取得了undefined值

//下面这个变量并没有声明
//var age

console.log(message); //"undefined"

console.log(age); // error, age is not defined.
```

运行以上代码，第一个console会打印出变量message的值，即"undefined"。
而第二个console会报错，由于传递给console.log()方法的是尚未声明的变量age。

对于尚未声明过的变量，只能执行一项操作，即使用typeof操作符检测其数据类型。

**然后，令人困惑的是：对未初始化的变量执行typeof操作符会返回undefined值，而对未声明的变量执行typeof操作符同样也会返回undefined值。**

```
var message; //这个变量声明之后默认取得了undefined值

//下面这个变量没有声明
//var age

typeof message; //"undefined"
typeof age; //"undefined"
```

结果表明，对未经初始化和未声明的变量执行typeof操作符都返回了undefined值，这个结果有其逻辑上的合理性。

**即便未初始化的变量会自动被赋予undefined值，但显式地初始化变量依然是明智的选择。如果能够做到这一点，那么当typeof操作符返回“undefined”值时，我们就知道被检测的变量还有被声明，而不是尚未初始化。**


## Null

Null类型是第二个只有一个值的数据类型，这个特殊的值是null。
**从逻辑角度来看，null值表示一个空对象指针，而这也正是使用typeof操作符检测null时会返回“object”的原因。

```
var car =  null;

console.log(typeof car); //"object"
```

如果定义的变量准备在将来用于保存对象，那么最好将该变量初始化为null而不是其他值。

这样一来，只要直接检查null值就可以知道相应的变量是否已经保存了一个对象的引用。

```
if(car != null) {
    //对car对象执行某些操作
}
```

**实际上，undefined值是派生自null值的，因此EMCA-262规定对它们的相等性测试要返回true。**

```
console.log(undefined ===  null ); // 注意全等于是false。

console.log(undefined == null); //true

```

这里，位于null和undefined之间的相等操作符（==）总是返回true，不过要注意的是，这个操作符处于比较的目的会转化其操作数。

尽管null和undefined有这样的关系，但它们的用途完全不同。

无论在什么情况下，都没有不要把一个变量的值显式地设置为undefined，**可是同样的规则对null却不适用。**

**只要意在保存对象的变量还没有真正保存对象，就应该明确地让该变量保存null值。这样不仅可以体现null作为空对象指针的惯例，而且也有助于进一步区分null和undefined。**


## Boolean

Boolean类型是ECMAScript使用得最多的一种类型，该类型只有两个字面值：true和false。

**切记，这两个值与数字值不是一回事，因此true不一定等于1，而false也不一定等于0。**

```
var found = true;
var lost = false;
```

Boolean类型的字面值true和false是区分大小写的。也就是说，True和False（以及其他的混合大小写形式）都不是Boolean值，只是标识符。

虽然，Boolean类型的字面值只有两个，但ECMAScript中所有类型的值都有与这两个Boolean值等价的值。要将一个值转化为其对应的Boolean值，可以调用转型函数Boolean()。

```
var message = "hello world";
var messageAsBoolean = Boolean(message);

console.log(messageAsBoolean); // true

```

以上代码，字符串message被转换成了一个Boolean值，该值被保存在messageAsBoolean变量中。
可以对任何数据类型的值调用Boolean()函数，而且总会返回一个Boolean值。至于返回的这个值是true还是false，取决于要转换值的数据类型及其实际值。

下表为各种数据类型及其对应的转换规则。

|数据类型|转换为true的值|转换为false的值|
|:-:|:-:|:-:|
|Boolean|true|false|
|String|任何非空字符串|""（空字符串）|
|Number|任何非零数字值（包括无穷大）|0和NaN|
|Object|任何对象|null|
|Undefined|转换不了true|undefined|

**这些转换规则对理解流程控制语句（如if语句）自动执行相应的Boolean转换非常重要。**

```
var message = "hello world";

if(message) {
    console.log("I said: hello world!!")
}

//"I said: hello world!!"
```

浏览器的控制台会打印出 "I said: hello world!!" ，因为字符串message被自动转换成了对应的Boolean值（true）。**由于存在这种自动执行的Boolean转换，因此确切地知道在流程控制语句中使用的是什么变量至关重要。错误地使用一个对象而不是一个Boolean值，就有可能彻底改变应用程序的流程。**

## Number

Number类型应该是ECMAScript中最令人关注的数据类型了，这种类型使用IEEE754格式来表示整数和浮点数值（浮点数值在某些语言中也被称为**双精度数值**）。为支持各种数值类型，ECMA-262定义了不同的数值字面量格式。

最基本的数值字面量格式是十进制整数，十进制整数可以像下面这样直接在代码中输入：

```
var integerNum = 55; //整数
```

除了以十进制表示外，整数还可以通过八进制（以8为基数）或十六进制（以16为基数）的字面值来表示。

**其中，八进制字面值的第一位必须是零（0），然后是八进制数字序列（0~7）。**

如果字面值中的数值超出了范围，那么前导零将被忽略，后面的数值将被当做十进制数值解析。

```
var octalNum0 = 070; //八进制的56
var octalNum1 = 079; //无效的八进制数值——解析为79
var octalNum2 = 08; //无效的八进制数值——解析为8
```

**八进制字面量在严格模式下是无效的，会导致支持该模式的JavaScript引擎抛出错误。**

十六进制字面量的前两位必须是0x，后跟任何十六进制数字（0~9及A-F）。其中，字母A~F可以大写，也可以小写。

```
var hexNum1 = 0xA; //十六进制的10
var hexNum2 = 0x1f; //十六进制的31
```

**在进行算术计算时，所有以八进制和十六进制表示的数值都将被转换成十进制数值。**

**鉴于JavaScript中保存数值的方法，可以保存正零（+0）和负零（-0）。正零和负零被认为是相等的。**

1. 浮点数值

所谓浮点数值，就是该数值中必须包含一个小数点，并且小数点后面必须至少有一位数字。虽然小数点前面可以没有整数，但不推荐这种写法。

```
var floatNum1 = 1.1;
var floatNum2 = 0.1;
var floatNum3 = .1;  //有效，但不推荐。
```

**由于保存浮点数值的内存空间是保存整数值的两倍，因此ECMAScript会不失时机地将浮点数值转换为整数值。**显然，如果小数点后面没有跟任何数字，那么这个数值就可以作为整数值来保存。同样地，如果浮点数值本身表示的就是一个整数（如1.0），那么该值也会被转换为整数。

```
var floatNum1 = 1.; //小数点后面没有数字——解析为1
var floatNum2 = 10.0; //整数——解析为10
```

对于那些极大或极小的数值，可以用e表示法（即科学表示法）表示的浮点数值表示。
用e表示法表示的数值等于e前面的数值乘以10的指数次幂。ECMAScript中e表示法的格式也是如此，即前面是一个数值（可以是整数也可以是浮点数），中间是一个大写或小写的字母E，后面是10的幂中的指数，该幂值将用来与前面的数相乘。

```
car floatNum = 3.125e7; //等于31250000;
```

在这个例子中，使用e表示法表示的变量floatNum的形式虽然简洁，但它的实际值则是31250000。在此，e表示法的实际含义就是“3.125乘以10的7次方”。

也可以使用e表示法表示极小的数值，如0.00000000000000003，这个数值可以使用更简洁的3e-17表示。在默认情况下，ECMAScript会将那些小数点后面带有6个零以上的浮点数值转换为以e表示法表示的数值。(例如，0.0000003会被转换成3e-7)。

浮点数值的最高精度是17位小数吗，**但在进行算术时其精确度远远不如整数。**
**例如，0.1加0.2的结果不是0.3，而是0.30000000000000004。这个小小的舍入误差会导致无法测试特定的浮点数值。**

```
if(a + b == 0.3) { //不要做这样的测试
    console.log("You got 0.3"); 
}
```

在这个例子中，我们测试的是两个数的和是不是等于0.3。如果这两个数是0.05和0.25，或者是0.15和0.15都不会有问题。

**而如果这两个数是0.1和0.2，那么测试将无法通过。因此，永远不要测试某个特定的浮点数值。**

**关于浮点数值计算会产生舍入误差的问题，有一点需要明确：这是使用基于IEEE754数值的浮点计算的通病，ECMAScript并非独此一家，其他使用相同数值格式的语言也存在这个问题。**


2. 数值范围

由于内存的限制，ECMAScript并不能保存世界上所有的数值。

ECMAScript能够表示的最小数值保存在Number.MIN_VALUE中——在大多数浏览器中，这个值是5e-324;

能够欧表示的最大数值保存在Number.MAX_VALUE中——在大多数浏览器中，这个值是1.7976931348623157e+308。

如果某次计算的结果得到了一个超出JavaScript数值范围的值，那么这个数值将被自动转换成特殊的Infinity值。

如果这个数值时负数，则会转换成-Infinity（负无穷），如果这个数值是正数，则会被转换成Infinity（正无穷）。

**如果某次计算返回了正或负的Infinity值，那么该值将无法继续参与下一次的计算，因为Infinity不是能够参与计算的数值。**要想确定一个数值是不是有穷的，可以使用isFinite()函数。这个函数爱参数位于最小与最大数值之间时会返回true。

```
var result = Number.MAX_VALUE + Number.MAX_VALUE;

console.log(isFinite(result)); //false;
```

尽管在计算中很少出现某些值超出表示范围的情况，但在执行极小或极大数值的计算时，检测监控这些值是可能的，也是必需的。

**访问Number.NEGATIVE_INFINITY和Number.POSITIVE_INFINITY也可以得到负和正Infinity的值。可以想见，这两个属性中分别保存着-Infinity和Infinity。**

3. NaN

NaN，即非数值(Not a Number)是一个特殊的数值，这个数值用于表示一个本来要返回数值的操作数未返回数值的情况（这样就不会抛出错误了）。例如，在其他编程语言中，任何数值除以非数值都会导致错误，从而停止代码执行。**但在ECMAScript中，任何数值除以非数值会返回NaN，因此不会影响其他代码的执行。**

**NaN本身有两个非同寻常的特点。**

**首先，任何涉及NaN的操作（例如 NaN/10）都会返回NaN，这个特点在多部计算有可能导致问题。**

**其次，NaN与任何值都不相等，包括NaN本身。**

```
console.log(NaN == NaN); //false
```

针对NaN的这两个特点，ECMAScript定义了isNaN()函数。
这个函数接受一个参数，该参数可以是任何类型，在参数不是数值的情况下返回true。
**isNaN()在接收到一个值之后，会尝试将这个值转换为数值。**
某些不是数值的值也会直接转换为数值，例如字符串"10"或Boolean值。

而任何不能被转换为数值的值都会导致这个函数返回true。

```
console.log(isNaN(NaN)); //true

console.log(isNaN(10)); //false (10是一个数值)

console.log(isNaN("10")); //false (可以被转换成数值10)

console.log(isNaN(false)); //false （可以被转换成数值0）

console.log(isNaN("BLUE")); //true （不能被转换成数值）

```

4. 数值转换

有3个函数可以把非数值转换为数值：Number()、parseInt()和parseFloat()。第一个函数，即转型函数Number()可以用于任何数据类型，而另两个函数则专门把字符串转换成数值。这3个函数对于同样的输入会有返回不同的结果。

Number()函数的转换规则如下：

- 如果是Boolean值，true和false将分别被转换为1和0。
- 如果是数字值，只是简单的传入和返回。
- 如果是null值，返回0。
- 如果是undefined，返回NaN。
- 如果是字符串，遵循下列规则：

1. 如果字符串中包含数字（包括前面带正号或负号的情况），则将其转换为十进制数值，即1变为1，"123"会变成123，而"011"会变成11（注意：前导的零被忽略了）。
2. 如果字符串中包含有效的浮点格式，如"1.1"，则将其转换为对应的浮点数值（同样，也会忽略前导零）。
3. 如果字符串是空的（不包含任何字符），则将其转换为0；
4. 如果字符串包含除上述格式之外的字符，则将其转换为NaN；
   
- 如果是对象，则调用对象的valueOf()方法，然后依照前面的规则转换返回的值。如果转换的结果是NaN，则调用对象的toString()方法，然后再次依照前面的规则转换返回的字符串值。

根据这么多的规则使用Number()把各种数据类型转换为数值确实有点复杂。

```
var num1 = Number("Hello World"); //NaN

var num2 = Number(""); //0

var num3 = Number("0100"); //100

var num4 = Number(true); //1
```

由于Number()函数在转换字符串时比较复杂而且不够合理。

**因此在处理整数的时候更常用的是parseInt()函数。**

parseInt()函数在转换字符串时，更多的是看其是否符合数值模式。它会忽略字符串前面的空格，直到找到第一个非空格字符。如果第一个字符不是数字字符或负号，parseInt()就会返回NaN。这也说明了，用parseInt()转换空字符串会返回NaN。

如果第一个字符是数字字符，parseInt()会继续解析第二个字符，直到解析完所有后续字符或者遇到了一个非数字字符。

例如: "1234blue" 会被转换为1234，blue被完全忽略。类似地，"22.5"会被转换为22，因为小数点并不是有效的数字字符。

如果字符串中的第一个字符是数字字符，parseInt()也能够识别出各种整数格式（十进制、八进制和十六进制）。也就是说，如果字符串以“0x”开头且后跟数字字符，就会将其当做一个十六进制整数；如果字符串以“0”开头且后跟数字字符，则会将其当做一个八进制来解析。

```

var num1 = parseInt("1234blue"); //1234

var num2 = parseInt(""); //NaN

var num3 = parseInt("0xA"); //10 (十六进制转化成十进制)

var num4 = parseInt(22.5); //22

var num5 = parseInt(070); //56(八进制转化成十进制)

var num6 = parseInt("070"); //70

```

**在使用parseInt()解析像八进制字面量的字符串时，ES3和ES5存在分歧。**

```
//ES3认为是56（八进制），ES5认为是70（十进制）
var num = parseInt("070"); //chrome现在是70
```

**为了消除在使用parseInt()函数时可能导致的上述困惑，可以为这个函数提供第二个参数：转换时使用的基数（即多少进制）。如果知道要解析的值是十六进制格式的字符串，那么指定基数15作为第二个参数，可以保证得到正确的结果。**

```
var num = parseInt("0xAF", 16);  //175
```

实际上，如果指定了16作为第二个参数，字符串可以前面的“0x”。

```
var num1 = parseInt("AF", 16); //175

var num2 = parseInt("AF"); //NaN;
```

这个例子中的第一个转换成功了，而第二个则失败了。差别在于第一个转换传入了基数，明确告诉parseInt()要解析一个十六进制格式的字符串。而第二个转换发现第一个字符不是数字字符，因此就返回了NaN（Not a Number)。

指定基数会影响到转换的输出结果。

```
var num1 = parseInt(10, 2);  //2

var num2 = parseInt(10, 8);  //8

var num3 = parseInt(10, 10); //10

var num4 = parseInt(10, 16); //16

```

**不指定基数意味着让parseInt()决定如何解析输入的字符串，因此为了避免错误的解析，无论在什么情况下都明确指定基数。**

**多数情况下，我们要解析的都是十进制数值，因此始终将10作为第二个参数是非常必要的。**

与parseInt()函数类似，parseFloat()也是从第一个字符（位置0）开始解析每个字符。而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止。也就是说，字符串中只有一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略。

例如：“22.34.5”将被转化为22.34。

**除了第一个小数点有效之外，parseFloat()与parseInt()的第二个区别在于它之中都会忽略前导的零。**

parseFloat()可以识别前面讨论过的所有浮点数值格式，也包括十进制整数格式。

但十六进制格式的字符串之中会被转换成0。由于parseFloat()只解析十进制值，因此它没有用第二个参数指定基数的用法。

**如果字符串包含的是一个可解析为整数的数（没有小数点，或者小数点后面都是零），parseFloat()会返回整数。**

```
var num1 = parseFloat("1245blue"); //1234整数
var num2 = parseFloat("0xA"); //0
var num3 = parseFloat("22.5"); //22.5
var num4 = parseFloat("22.34.5"); //22.34
var num5 = parseFloat("0908.5"); //908.5
var num6 = parseFloat("3.125e7"); //31250000
```

## String

String类型用于表示由零活多个16位Unicode字符组成的字符序列，即字符串。字符串可以由双引号（"）或单引号（'）表示。

```

var firstName = "Roc";

var lastName = 'Shaw';
```

与PHP中的双引号和单引号会影响对字符串的解释方式不同，ECMAScript中的这两种没有什么区别。

以双引号开始，必须以双引号结尾，而已单引号开头的字符串必须以单引号结尾。

```
var firstName = "roc'; //SyntaxError 语法错误
```

1. 字符字面量

String数据包含一些特殊的字符串字面量，也叫转义序列，用于表示非打印字符，或者具有其他用途的字符。

|字面量|含义|
|:-:|:-:|
|\n|换行 newline|
|\t|制表 Tab|
|\b|退格 backspace|
|\r|回车 return|
|\f|进纸 feed|
|\\\\|斜杠|
|\\'|单引号（'），在用单引号表示的字符串中使用。例如: 'He said, \'hey\'';|
|\\"|双引号（"），在用双引号表示的字符串中使用。例如: "He said, \"hello!\""|
|\\xnn|以十六进制代码nn表示的一个字符串（其中n为0-F）。例如，\x41表示"A"|
|\\unnnn|以十六进制代码nnnn表示的一个Unicode字符（其中n为0~F）。|

这些字符字面量可以出现在字符串中的任意位置，而且也将被作为一个字符来解析，如下面的例子所示：

```
var text = "This is the letter sigma: \u03a3.";

console.log(text); //This is the letter sigma: Σ.
```

这个例子中的变量text有28个字符，其中6个字符长的转义序列表示一个字符。

**任何字符串的长度都可以通过访问其length属性取得。**

```
var text = "This is the letter sigma: \u03a3.";

console.log(text.length);//28
```

**这个属性返回的字符数包括16位字符的数目。如果字符串中包含双字节字符，那么length属性可能不会精确地返回字符串中的字符数目。**


2. 字符串的特点

ES中的字符串是不可变的，也就是说，字符串一旦创建，它们的值就不能改变。要改变某个你变量保存的字符串，首先要销毁原来的字符串，然后再用另一个包含新值的字符串填充该变量。

```
var lang = "Java";

lang = lang + "script";

console.log(lang);
```
  
以上示例中的变量lang开始时包含字符串"Java"。而第二行代码把lang的值重新定义为"Java"与"Script"的组合，即"JavaScript"。

实现这个操作的过程如下：首先创建一个能容纳10个字符的新字符串，然后在这个字符串中填充"Java"和"Script"，最后一步是销毁原来的字符串"Java"和字符串"Script"，因为这两个字符串已经没用了。

这个过程是在后台发生的，而这也是在某些旧版浏览器（例如版本低于1.0的Firefox、IE6等）中拼接字符串时速度很慢的原因所在。但这些浏览器后来的版本已经解决了这个低效率问题。

3. 转换为字符串

要把一个值转换为一个字符串有两种方式。

第一种是使用几乎每个值都有的toString()方法。这个方法唯一要做的就是返回相应值的字符串表现。

```

var age = 11;

var ageAsString = age.toString(); // "11"

var found = true;

var foundAsString = found.toString(); //"true"

```

**数值、布尔值、对象和字符串值都有toString()方法。**

每个字符串也都有一个toString()方法，该方法返回字符串的一个副本。

但null和undefined值没有这个方法。

**在调用数值的toString()方法时，可以传递一个参数：输出数值的基数。**

**默认情况下，toString()方法以十进制格式返回数值的字符串表示。而通过传递基数，toString()可以输出以二进制、八进制、十六进制，乃至其他任意有效进制格式表示的字符串值。**

```
var num = 10;

console.log(num.toString(2)); //"1010"

console.log(num.toString(8)); //"12"

console.log(num.toString(10)); //"10"

console.log(num.toString(16)); //"a"

```

通过这个例子可以看出，通过指定基数，toString()方法会改变输出的值。而数值10根据基数的不同，可以在输出时被转换为不同的数值格式。注意，默认的（没有参数）输出值与指定基数10时的输出值相同。


**在不知道要转换的值是不是null或undefined的情况下，还可以使用转型函数String()，这个函数能够将任何类型的值转换为字符串。**

String()函数遵循下列转换规则：

- 如果值有toString()方法，则调用该方法(没有参数)并返回相应的结果；
- 如果值是null，则返回"null"；
- 如果值是undefined，则返回"undefined"；

```
var value1 = 10;
var value2 = true;
var value3 = null;
var value4;

console.log(String(value1)); //"10"
console.log(String(value2)); //"true"
console.log(String(value3)); //"null"
console.log(String(value4)); //"undefined"
```

数值和布尔值的转换结果与调用toString()方法得到的结果相同。因为null和undefined没有toString()方法，所以String()函数就返回了这两个值的字面量。

## Object

**ECMAScript中的对象其实就是一组数据和功能的集合。**
对象可以通过执行new操作符后跟要创建的对象类型的名称来创建。
而创建Object类型的实例对象并为其添加属性和方法，就可以创建自定以对象。

```
var o = new Object();
```

这个语法与Java中创建对象的语法相似；但在ES中，如果不给构造函数传递参数，则可以省略后面的那一对圆括号。

```
var o = new Object; //有效，但不推荐省略圆括号。
```

创建Object的实例并没有什么用处，但关键是要理解一个重要的思想：在ES中，Object类型是所有它的实例的基础。

**Object类型所具有的任何属性和方法也同样存在于更具体的对象中。**

Object的每个实例对象都具有下列属性和方法。

- constructor: 保存着用于创建当前对象的函数。
- hasOwnProperty(propertyName): 用于检查给定的属性在当前实例对象中是否存在。**作为参数的属性名（propertyName）必须以字符串形式指定。
- isPrototypeOf(object)：用于检查传入的对象是否是当前对象的原型。
- propertyIsEnumerable(propertyName): 用于检查给定的属性是否能够使用for-in语句来枚举。与hasOwnProperty()方法一样，作为参数的属性名必须以字符串形式指定。
- toLocaleString()：返回对象的字符串表示，该字符串与执行环境的地区对应。
- toString()：返回对象的字符串表示。
- valueOf()：返回对象的字符串、数值或布尔值表示。通常与toString()方法的返回值相同。

由于在ECMAScript中Object是所有对象的基础，因此所有对象都具有这些基本的属性和方法。