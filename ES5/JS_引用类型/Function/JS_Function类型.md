# Function 类型

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

ECMAScript中什么最有意思？莫过于函数了——而有意思的根源，则在于函数实际上是对象。

**每个函数都是Function类型的实例，而且都与其他引用类型一样具有属性和方法。**

**由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。**

函数通常是使用函数声明语法定义的。

```
function sum (num1, num2) {
    return num1 + num2;
};
```

这与下面使用函数表达式定义函数的方式几乎相差无几。

```
var sum = function (num1, num2) { 
    return num1 + num2;
};
```

以上代码定义了变量sum并将其初始化为一个函数，function关键字后面没有函数名。这是因为在使用函数表达式定义函数时，没有必要使用函数名——通过变量sum即可引用函数。另外，还要注意函数末尾有一个分号，就像声明其他变量一样。

**函数名仅仅是指向函数的指针，因此函数名与包含对象指针的其他变量没有什么不同。**

```

function sum (num1, num2) {
    return num1 + num2;
};
console.log(sum(10,20)); //30

var anotherSum = sum;
console.log(anotherSum(10,20)); //30

sum = null;
console.log(anotherSum(10,20)); //30
```

以上代码首先定义了一个名为sum()的函数，用于求两个值的和。然后，又声明了变量anotherSum，并将sum的引用值赋给anotherSum。注意，使用不带圆括号的函数名是访问函数指针，而非调用函数。此时，anotherSum和sum都指向了同一个函数，因此anotherSum()也可以被调用并返回结果。即使将sum设置为null，让它与函数“断绝关系”，但仍然可以正常调用anotherSum()。

## 没有重载

**将函数想象成指针，也有助于理解为什么ECMAScript中没有函数重载的概念。**

```
function addSomeNumber (num) {
    return num + 100;
};

function addSomeNumber (num) {
    return num + 200;
};

var result = addSomeNumber(100); //300

```

显然，这个例子中声明了两个同名函数，而结果则是后面的函数覆盖了前面的函数。

```
var addSomeNumber = function (num) {
    return num + 100;
};

addSomeNumber = function (num) {
    return num + 200;
};

var result = addSomeNumber(100); //300
```
通过观察重写之后的代码，很容易看清楚到底是怎么回事——在创建第二个函数时，实际上覆盖了引用第一个函数的变量addSomeNumber。

## 函数声明与函数表达式

解析器在向执行环境中加载数据时，对函数声明和函数表达式并非一视同仁。

**解析器会率先读取函数声明，并使其在执行任何代码之前可用（可以访问）；**

**至于函数表达式，则必须等到解析器执行到它所在的代码行，才会真正被执行。**

```

console.log(sum(10,10)); //20

function sum(num1, num2) {
    return num1 + num2;
};

```

**以上代码可以正常运行。因为在代码开始执行之前，解析器会有个函数声明提升的过程（function declaration hoisting），读取并将函数声明添加到执行环境中。**

**JavaScript引擎会把声明函数放到源代码树的顶部。**

所以，即使声明函数的代码在调用它的代码后面，JavaScript引擎也能把函数声明提升到顶部。

但是

```
sum(10,10);

var sum = function(num1, num2) {
    return num1 + num2;
}

/*
//变量提升

var sum;
sum(10,10); // sum is not a function

sum = function(num1, num2) {
    return num1 + num2;
}
*/
```

上述代码之所以会在运行期间产生错误，原因在于函数位于一个初始化语句中，而不是一个函数声明。

在执行到函数所在的语句之前，变量sum中不会保存有对函数的引用。

而且，因为执行该语句时报错，实际上也不会执行到下一行。

**也可以同时使用函数声明和函数表达式，例如var sum = function sum(){}。不过，这种语法在Safari中会导致错误。**

## 作为值的函数

**ECMAScript中的函数名本身就是变量，所以函数也可以作为值来使用。**

**也就是说，不仅可以像传递参数一样把一个函数传递给另一个函数，而且可以将一个函数作为另一个函数的结果返回。**

```
function callSomeFunction(someFunction, someArgument) {
    return someFunction(soneArgument);
}
```

这个函数接收两个参数。第一个参数是一个函数，第二个参数是要传递给该函数的一个值。

```

function callSomeFunction(someFunction, someArgument) {
    return someFunction(someArgument);
}

function add(num) {
    return num + 10;
}

var result0 = callSomeFunction(add, 10);
console.log(result0); //20

function getGreetingName(name) {
    return "Hello " + name;
}

var result1 = callSomeFunction(getGreetingName, "Shaw");
console.log(result1); // "Hello Shaw"
```

这里的callSomeFunction()函数是通用的，即无论第一个参数中传递进来的是什么函数，它都会返回执行第一个参数后的结果。

要访问函数的指针而不执行函数的话，必须去掉函数名后面的那对大括号。
因此上面例子中传递给callSomeFunction()的是add和getGreetingName，而不是执行它们之后的结果。

**可以从一个函数中返回另一个函数，而且这也是极为有用的一种技术。**

例如，假设有一个对象数组，我们想要根据某个对象属性对数组进行排序。
而传递还给数组sort()方法的比较函数要接收两个参数，即要比较的值。
可是我们需要一种方式来指明按照哪个属性来排序。
要解决这个问题，可以定义一个函数，它接收一个属性名，然后根据这个属性名来创建一个比较函数。

```

function createComparisonFunction(propertyName) {

    return function(obj1, obj2) {
        var value1 = obj1[propertyName];
        var value2 = obj2[propertyName];

        if(value1 < value2) {
            return -1;
        } else if(value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };

}

```

这个函数看起来有点复杂，实际上就是在一个函数中嵌套了另一个函数，而且内部函数前面加了一个return操作符。在内部函数接收到propertyName参数后，它会使用方括号语法取得给定属性的值。取得了想要的属性值之后，定义比较函数就非常简单了。

```
//比较函数的使用

var data = [{name: "Shaw", age: 18}, {name: "Roc", age: 19}];

function createComparisonFunction(propertyName) {

    return function(obj1, obj2) {
        var value1 = obj1[propertyName];
        var value2 = obj2[propertyName];

        if(value1 < value2) {
            return -1;
        } else if(value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };

}


data.sort(createComparisonFunction("name"));
console.log(data[0].name); //"Roc"

data.sort(createComparisonFunction("age"));
console.log(data[0].age); // 18

```

这里，我们创建了一个包含两个对象的数组data。其中，每个对象都包含一个name属性和一个age属性。

在默认情况下，sort()方法会调用每个对象的toStrig()方法以确定它们的次序。
但得到的结果往往并不符合人类的思维习惯。

因此，我们调用createComparisonFunction("name")方法创建了一个比较函数，以便按照每个对象的name属性值进行排序。

而结果排在前面的第一项是name为"name: 'roc', age: 19"的对象。

然后，又使用了createComparisonFunction("age")返回的比较函数，这次是按照对象的age属性排序。

得到的结果是" {name: "Shaw", age: 18}"的对象。

## 函数内部属性

**在函数内部，有两个特殊的对象：arguments和this。**

arguments，它是一个类数组对象，包含着传入函数中的所有参数。

虽然arguments对象的主要用途是保存函数参数，**但这个对象还有一个名叫callee的属性，该属性是一个指针，指向拥有这个arguments对象的函数。**

```
//经典的阶乘函数

function factorial(num) {
    if( num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}

```

定义阶乘函数一般都要用到递归算法；如上面的代码所示，在函数有名字，而且名字以后也不会变的情况下，这样定义没有问题。

但问题是这个函数的执行与函数名factorial紧紧耦合在了一起。

为了消除这种紧密耦合的现象，可以使用arguments.callee。

```
function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num-1);
    }
}
```

在这个重写后的factorial()函数的函数体内，没有再引用函数名factorial。
这样，无论引用函数时使用的是什么名字，都可以保证正常完成递归调用。

```

function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num-1);
    }
}

var trueFactorial = factorial;

factorial = function(){
    return 0;
}

console.log(trueFactorial(5)); //120
console.log(factorial(5)); //0
```

在此，变量trueFactorial获得了factorial的值，实际上是在另一个位置上保存了一个函数的指针。然后，我们又将一个简单地返回0的函数赋值给factorial变量。

如果向原来的factorial()那样不使用arguments.callee，调用trueFactorial()就会返回0.可是，在解除了函数体内的代码与函数名的耦合状态之后，trueFactorial()仍然能够正常地计算阶乘。至于factorial()，它现在只是一个返回0的函数。

**函数内部的另一个特殊特殊对象是this，其行为与Java和C#的this大致类似。**

**this引用的是函数执行的环境对象———当在网页的全局作用域中调用函数时，this对象引用的就是window）。**

```
window.color = "red";

var o = {color: "blue"};

function sayColor() {
    console.log(this.color);
}

sayColor(); //"red"

o.sayColor = sayColor;
console.log(o.sayColor()); //"blue"

```

上面这个函数sayColor()时在全局作用域中定义的，它引用了this对象。
**由于在调用函数之前，this的值并不确定，因此this可能会在代码执行过程中引用不同的对象。**当在全局作用域中调用sayColor()时，this引用的是全局对象window；换句话说，对this.color求值会转换成对window.color求值，于是结果就返回了“red”。而当把这个函数赋值给对象o并调用o.sayColor()时，this引用的是对象o，因此对this.color求值会转换成对o.color求值，结果就返回了“blue”。

**一定要记住，函数的名字仅仅是一个包含指针的变量而已。因此，即使是在不同的环境中执行，全局的sayColor()函数与o.sayColor()指向的仍然是同一个函数。**

ECMAScript 5也规范了另一个函数对象的属性：caller。
除了Opera的早起版本不支持，其他浏览器都支持这个ECMAScript 3 并没有定义的属性。 这个属性中保存着调用当前函数的函数的引用，**如果是在全局作用域中调用当前函数，它的值为null。**

```
function outer() {
    inner();
}

function inner() {
    console.log(inner.caller);
    /*
    ƒ outer() {
    inner();}
    */
}

outer();

```

以上代码会导致警告框中显示outer()函数的源代码。 因为outer()调用了inner()，所以inner.caller就指向outer()。为了实现更松散的耦合，也可以通过arguments.callee.caller来访问同样的信息。

```

function outer() {
    inner();
}

function inner() {
    console.log(arguments.callee.caller);
}

outer();
```

IE、Firefox、Chrome和Safari的所有版本以及Opera9.6都支持caller属性。

当函数在严格模式下运行时，访问arguments.callee会导致错误。ECMAScript5还定义了arguments.caller属性，但在严格模式下访问它也会导致错误，而在非严格模式下这个属性始终是undefined。

定义arguments.callee属性是为了分清arguments.caller和函数的caller属性。

以上变化都是为了加强这门语言的安全性，这样第三方代码就不能再相同的环境里窥视其他代码了。

**严格模式还有一个限制：不能为函数的caller属性赋值，否则会导致错误。**

## 函数属性和方法

**ECMAScript中的函数是对象，因此函数也有属性和方法。**

**每个函数都包含两个属性：**

- length
- prototype

其中，length属性表示函数希望接收的命名参数的个数。

```

function sayName(name) {
    console.log(name);
}

function sum(num1, num2) {
    return num1 + num2;
}

function sayHi() {
    console.log("Hi");
}

console.log(sayName.length); //1
console.log(sum.length); //2
console.log(sayHi.length); //0

```

在ECMAScript核心所定义的全部属性中，最耐人寻味的就要数prototype属性了。

对于ECMAScript中的引用类型而言，prototype是保存它们所有实例方法的真正所在。

换句话说，诸如toString()和valueOf()等方法实际上都保存在prototype名下，只不过是通过各自对象的实例访问罢了。在创建自动以引用类型以及实现继承时，prototype属性的作用是极为重要的。

**在ECMAScript 5中，prototype属性是不可枚举的，因此使用for-in无法发现。**

**每个函数都包含两个非继承而来的方法：apply()和call()。**

这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内this对象的值。

**apply()方法接收两个参数：一个是在其中运行函数的作用域，另一个是参数数组。其中，第二个参数可以是Array的实例，也可以是arguments对象。**

```
function sum(num1, num2) {
    return num1 + num2;
}

function callSum1(num1, num2) {
    //传入arguments对象
    console.log(this);// window
    return sum.apply(this, arguments);
}

function callSum2(num1, num2) {
    //传入数组
    console.log(this);// window
    return sum.apply(this, [num1, num2]);
}

console.log(callSum1(10,10)); //20
console.log(callSum2(10,10)); //20
```

在上面的例子中，callSum1()在执行sum()函数时传入了this作为this值和arguments对象。

因为是在全局作用域中调用的，所以this就是window对象。

而callSum2同样也调用了sum()函数，只不过传入的是this和一个参数数组。

这两个函数都会正常执行并返回正确的结果。

**call()方法与apply()方法的作用相同，它们的区别仅在于接收参数的方式不同。对于call()方法而言，第一个参数是this值没有变化，变化的是其余参数都直接传递给参数。**

也就是说，传递给函数的参数必须逐个列举出来。

```

function sum(num1, num2) {
    return num1 + num2;
}

function callSum(num1, num2) {
    return sum.call(this, num1, num2);
}

console.log(callSum(10, 10)); //20
```

在使用call()方法的情况下，callSum()必须明确地传入每一个参数。
结果与使用apply()没有什么不同。

至于是使用apply()还是call()，完全取决于你采取哪种给函数传递参数的方式最方便。

如果你打算直接传入arguments对象，或者包含函数中先接收到也是一个数组，那么使用apply()肯定更方便；否则，选择call()可能更合适。

**在不给函数传递参数的情况下，使用哪个方法都无所谓。**

**事实上，传递参数并非apply()和call()真正的用武之地。它们真正强大的地方是能够扩充函数赖以运行的作用域。**

```

window.color = "red";

var  o = {color: "blue"};

function sayColor() {
    console.log(this.color);
}

sayColor(); // "red"

sayColor.call(this); //"red"
sayColor.call(window); //"red"
sayColor.call(o); //"blue"

```

sayColor()是作为全局函数定义的，而且当在全局作用域中调用它时，它确实会显示“red”。

因此，this,color的求值会转换成对window.color的求值。

而sayColor.call(this)和sayColor.call(window)，则是两种显式地在全局作用域中调用函数的方式，结果都会显示“red”。

但是，当运行sayColor.call(o)时，函数的执行环境就不一样了，因为此时函数体内的this对象指向了o，于是结果显示的是“blue”。

**使用call()或apply()方法来扩充作用域的最大好处，就是对象不需要与方法有任何耦合关系。**


**ECMAScript5还定义了一个方法： bind()。**
**这个方法会创建一个函数的实例对象，其this值会被绑定到传入bind()函数的对象（值）。**

```

window.color = "red";

var o = { color: "blue" };

function sayColor() {
    console.log(this.color);
}

var objectSayColor = sayColor.bind(o);

objectSayColor(); //"blue"

```

在这里，sayColor()调用bind()并传入对象o，创建了objectSayColor()函数。

ObjectSayColor()函数的this值等于o，因此即使是在全局作用域中调用这个函数，也会看到“blue”。

支持bind()方法的浏览器有IE9+、Firefox 4+、Safari 5.1+、Opera 12+和Chrome。

每个函数继承的toLocaleString()和toString()方法始终都返回函数的代码。
返回的代码的格式则因浏览器而异——有的返回的代码与源代码中的函数代码一样，而有的则返回函数代码的内部表示，即由解析器删除了注释并对某些代码作了改动后的代码。

由于存在这些差异，无法根据这两个方法返回的结果来实现任何重要功能。

不过，这些信息在调试代码时倒是很有用。

**另外一个继承的valueOf()方法同样也只返回函数代码。**












