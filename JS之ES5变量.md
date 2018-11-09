## 变量

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

按照ECMA-262的定义，JavaScript的变量与其他语言的变量有很大区别。

JavaScript变量，有着松散类型的本质。

决定了它只是在特定时间用于保存特定值的一个名字而已。

由于不存在定义某个变量必须要保存何种数据类型值的规则，变量的值及其数据类型可以在脚本的生命周期内改变。

从某种角度上看，这可能是一个既有趣又强大，同时又容易出问题的特性，但JavaScript变量实际的复杂程度远不止如此。

### 基本类型和引用类型的值

ECMAScript变量可能包含两种不同数据类型的值： 

- 基本类型值
- 引用类型值
  
基本类型值指的是简单的数据段，而引用类型值指那些可能由多个值构成的对象。

在将一个值赋给变量时，解析器必须确定这个值是基本类型值还是引用类型值。

基本数据类型:

1. Undefiend
2. Null
3. Boolean
4. Number
5. String

这5种基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。

**在很多语言中，字符窜是以对象的形式来表示，因此被认为是引用数据类型，ECMAScript放弃了这一传统。**

引用数据类型：保存在内存中的对象。

**与其他语言不同，JavaScript在操作对象时，实际上是在操作对象的引用而不是实际的对象。引用类型的值是按引用访问的。**

### 引用数据类型——动态的属性

定义基本类型值和引用类型值的方式是类似的：创建一个变量并为该变量赋值。

但是，当这个值保存到变量中以后，对不同类型值可以执行的操作则大相径庭。

对于引用数据类型的值，我们可以为其添加属性和方法，也可以改变和删除其属性和方法。

```

var person = new Object();
person.name = "Shaw";
console.log(person.name); //"Shaw"

```

以上代码创建了一个对象并将其保存在了变量person中。
然后，我们为该对象添加了一个名为name的属性，并将字符窜值"Shaw"赋给了这个属性。

紧接着，又通过console.log()方法访问了这个新属性。

如果对象不被销毁或者这个属性不被删除，则这个属性将一直存在。

**但是，我们不能给基本类型的值添加属性，尽管这么做不会导致任何错误。**

```

var name = "Shaw";
name.age = 18;
console.log(name.age); //"undefined"

```

在这个例子中，我们为字符窜name定义了一个名为age的属性，并为属性赋值27。
但访问这个属性时，发现该属性不见了。

**这说明只能给引用数据类型值动态地添加属性，以便将来使用。**

### 复制变量值

除了保存的方式不同之外，在从一个变量向另一个变量赋值基本类型值和引用类型值时，也存在不同。

**如果从一个变量向另外一个变量赋值基本类型的值，会在变量对象上创建一个新值，然后把该值复制到位新变量分配的位置上。**

```
var num1 = 5;
var num2 = num1;
```

在此，num1中保存的值是5。当使用num1的值初始化num2时，num2中也保存了值5。
但num2中的5与num1中的5是完全独立。
这两个变量可以参与任何操作而不会相互影响。


**当从一个变量向另一个变量赋值引用数据类型的值时，实际上，复制的变量只是一个指针，这个指针指向存储在堆内存中的一个对象。**

复制操作结束后，两个变量实际上将引用同一个对象，也就是所谓的浅拷贝。

因此，改变其中一个变量，就会影响另一个变量。

```
var obj1 = new Object(); // obj1 指向=> {} 
var obj2 = obj1; // obj2 也指向 => {} 

obj1.name = "Shaw";
console.log(obj2.name); // "Shaw"

```

首先，变量obj1保存了一个Object的实例对象。
然后，这个值被赋值到了obj2中。
换句话说，obj1和obj2都指向同一个对象。

这样，当为obj1添加name属性后，可以通过obj2来访问这个属性，因此这两个变量引用的都是同一个对象。

### 传递参数

**ECMAScript中所有函数的参数都是按值传递的。**
**也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。**

有不少人可能会困惑，因为访问变量有按值和按引用两种方式，**而参数只能按值传递。**

在向参数传递基本类型的值时，被传递的值会被复制给一个局部变量（按照ECMAScript的概念来说，就是arguments对象中的一个元素）。
在向参数传递引用类型的值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反映在函数外部。

```

function addTen(num) {
    // var num = count = 20
    num += 10;
    return num;
}

var count = 20;
var result = addTen(count);
console.log(count); //20，没有变化
console.log(result); //30

```

这里的函数addTen()有一个参数num，而参数实际上是函数的局部变量。
在调用这个函数时，变量count作为形参被传递给函数，这个变量的值是20。
于是，数值20被复制给参数num以便在addTen()中使用。
在函数内部，参数num的值被加上了10，但这一变化不会影响函数外部的count变量。
参数num与变量count互不认识，他们仅仅是具有相同的值。

使用数值等基本类型值来说明，**按值传递参数比较好理解**。

**但如果使用对象，那问题就不怎么好理解了。**

```

function setName(obj) {
    obj.name = "Shaw";
}

var person = new Object(); // person  = new object() => {};
setName(person); 
/*
setName(person) => {
    //var obj = person => {}
    obj.name = "Shaw";
    }
*/

console.log(person.name); // "Shaw"
```

以上代码，创建了一个对象，并将其保存在了变量person中。
然后，这个变量（指针）被传递给setName()函数中之后就被复制给了obj。
在这个函数内部，obj和person引用的是同一个对象。
换句话说：obj会按照引用（指针）来访问同一个对象。
于是，当在函数内部为obj添加name属性后，函数外部的person也将有所反映。
因为person指向的对象在堆内存中只有一个，而且是全局对象。

有很多开发人员错误地认为： 在局部作用域中修改的对象会在全局作用域中反映出来，就说明如果参数是对象的，是按引用传递的。

为了证明参数是按值传递的，我们来看下面这个经过修改的例子：

```
function setName(obj) {
    obj.name = "Shaw";
    obj = new Object();
    obj.name = "Roc";
}

var person = new Object(); // person => {}
setName(person);
/*
setName => {
    var obj = person => {}
    obj.name = "Shaw"; => {name: "Shaw"}

    obj = person => new {}
    obj.name = "Roc" => obj = { name : "Roc"}
}
*/

console.log(person.name); //"Shaw"
```

这个例子与前一个例子的唯一区别，就是在setName()函数中添加了两行代码：

一行代码为obj重新定义了一个对象，另一行代码为该对象定义了一个带有不同值的name属性。

在把person传递给setname()后，其name属性就被设置为“Shaw”。

然后，又将一个新对象赋给变量obj， 同时将其name属性设置为“Greg”。

如果person是按引用类型传递的，那么person就会自动被修改为指向其name属性值为“Greg”的新对象。

但是，接下来访问person.name时，显示的值仍然是“Shaw”。

这说明，即使在函数内部修改了参数的值，但原始的引用仍然保持未变。

接下来，当在函数内部重写obj时，这个变量引用的就是一个局部对象了。

而这个局部变量会在函数执行完毕后立即销毁。

**可以把ECMAScript函数的参数想象成局部变量。**

### 检测类型

要检测一个变量是不是基本数据类型。

**typeof操作符是最佳的工具。**

**typeof操作符是确定一个变量是字符窜、数值、布尔值，还是undefiend的最佳工具。如果变量的值是一个对象或者null，则typeof操作符会返回"object"**

```

var str = "Shaw";
var boolean = true;
var num = 22;
var undef;
var emptyObj = null;
var obj = new Object();

console.log(typeof str); // "string"
console.log(typeof boolean); // "boolean"
console.log(typeof num); // "number"
console.log(typeof undef); // "undefined"
console.log(typeof emptyObj);  // "object"
console.log(typeof obj); // "object"

```

虽然在检测基本数据类型时，typeof是非常得力的助手，但在检测引用类型的值时，这个操作符的用处不大。

一般情况下，我们并不是想知道某个值是对象，而是想知道它是什么类型的对象。

为此，ECMAScript提供了instanceof操作符：

```
//instanceof操作符语法

result = variable instanceof constructor

```

如果变量是给定引用类型的实例对象，那么instanceof操作符就会返回true。

```
person instanceof Object; // 变量person是Object的实例对象吗？
colors instanceof Array; // 变量colors是Array的实例对象吗？
pattern instanceof RegExp; // 变量pattern是RegExp的实例对象吗？

```

所有引用类型的值都是Object的实例对象。

因此，在检测一个引用类型值和Object构造函数的关系时，instanceof操作符始终会返回true。

当然，如果使用instanceof操作符检测基本类型的值，则该操作符始终返回false，因为基本类型不是对象。
