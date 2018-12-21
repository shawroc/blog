# Array——数组

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

除了Object之外，Array类型是ECMAScript中最常用的类型了。

**ECMAScript中的数组与其他多数语言中的数组有着相当大的区别。**

**虽然ECMAScript数组与其他语言中的数组都是数据的有序列表，但与其他语言不同的是，ECMAScript数组的每一项可以保存任何类型的数据。**

也是说：可以用数组的第一个位置来保存字符串，用第二位置来保存数值，用第三个位置来保存对象，以此类推。

**而且，ECMAScript数组的大小是可以动态调整的，即可以随着数据的添加自动增长以容纳新数据。**


## 创建数组

创建数组的基本方式有两种。

第一种是使用Array构造函数

```

var colors = new Array();

```

如果预先知道数组要保存的项目数量，也可以给构造函数传递该数量，而该数量会自动变成length属性的值。

```
var colors = new Array(20);

console.log(colors.length); //20 
```

也可以向Array构造函数传递数组中应该包含的项。

```

var colors = new Array("red", "green", "blue");

console.log(colors); // ["red", "green", "blue"]

```

**当然，给构造函数传递一个值也可以创建数组。**
但这时候问题就复杂一点了，**因为如果传递的是数值，则会按照该数值创建包含给定项数的数组。**
**而如果传递的是其他类型的参数，则会创建包含那个的只有一个项的数组。**

```
var colors = new Array(3); //创建一个包含3项的数组
console.log(colors);  // [empty × 3]

var names = new Array("Shaw"); //创建一个包含一项，即字符窜“Shaw”的数组
console.log(names); // ["Shaw"]

```

另外，在使用Array构造函数时，也可以省略new操作符。
如下面的例子所示，省略new操作符的结果相同：

```
var colors = Array(3);

var names = Array("Shaw");

```

**创建数组的第二种基本方式是使用数组字面表示法。**

**数组字面量由一对包含数组项的方括号表示，多个数组项之间以逗号隔开。**

```

var colors = ["red", "green", "blue"]; //创建一个包含3个字符窜的数组

var names = []; //创建一个空数组

var values = [1,2, ]; //不要这样！这样会创建一个包含2或3项的数组
console.log(values.length); //Chrome控制台显示数组的长度为2

var opitions = [,,,,,]; //不要这样！这样会创建一个包含5或6项的数组
console.log(opitions.length); //Chrome控制台显示数组的长度为5

```

以上代码的第一行创建了一个包含3个字符串的数组。

第二行使用一对空方括号创建了一个空数组。

第三行展示了数组字面量的最后一项添加逗号的结果：

**在IE8及之前版本中，values会成为一个包含3个项且每项的值分别是1、2和undefined的数组。**

在其他浏览器中，values会成为一个包含2项，值分别为1和2的数组。

**原因始IE8及之前版本中的ECMAScript实现在数组字面量方面存在bug。**

由于IE的实现与其他浏览器不一致，因此不建议使用这种语法。

**与对象一样，在使用数组字面量表示法时，也不会调用Array构造函数。（Firefox 3及更早版本除外）。**


## 读取和设置数组的值，以及数组的项数属性（length）

在读取和设置数组的值时，要使用方括号并提供相应值的基于0的数字索引。

```
var colors = ["red", "blue", "green"]; //定义一个字符串数组

console.log(colors[0]); //显示第一项："red"

colors[2] = "orange"; // 修改数组的第三项为"orange"

colors[3] = "black"; // 新增第四项

console.log(colors); //["red", "blue", "orange", "black"]

```

方括号中的索引表示要访问的值。
如果索引小于数组中的项数，则返回对应项的值，就像这个例子中的colors[0]会显示“red”一样。
设置数组的值也使用相同的语法，但会替换指定位置的值。
如果设置某个值的索引超过了数组现有项数，如这个例子中的colors[3]所示，数组就会自动增加到该索引值加1的长度。

**数组的项数保存在其length属性中，这个属性始终会返回0或更大的值。**

```
var colors = ["red", "blue", "green"];
var names = [];

console.log(colors.length); //3
console.log(names.length); //0
```

**数组的length属性很有特点——它不是只读的。这意味着可以设置这个属性，通过设置这个属性，可以从数组的末尾移除项或向数组中添加新项。**

```
var colors = ["red", "blue", "green"]; //创建一个包含3个字符串的数组

colors.length = 2;

console.log(colors[2]); // undefined
console.log(colors); // ["red", "blue"];
```

这个例子中的数组colors一开始有3个值。将其length属性设置为2会移除最后一项（索引为2的那一项），再访问colors[2]就会显示undefined了。

**如果将其length属性设置为大于数组项数的值，则新增的每一项都会取得undefined值。**

```
var colors = ["red", "blue", "green"];
colors.length = 4;
console.log(colors[3]); //undefined
```

在此，虽然colors数组包含3个项，但把它的length属性设置成了4。
数组的第四项（即索引值为3）没设置任何值，所以访问这个位置的值就得到了特殊值undefined。

**利用length属性也可以方便地在数组末尾添加新项。**

```
var colors = ["red", "blue", "green"]; //创建一个包含3个字符串的数组

colors[colors.length] = "maroon"; //在数组索引为3的位置添加一种颜色

colors[colors.length] = "purple"; // 在数组索引为4的位置添加一种颜色

console.log(colors.length); //5

console.log(colors); //["red", "blue", "green", "maroon", "purple"]

```

**由于数组最后一项的索引值始终是length-1，因此下一个新项的索引值就是length。**

每当在数组末尾添加一项后，其length属性都会自动更新以反应这一变化。

**特别要注意的地方，当把一个值放在超出当前数组大小的位置上时，数组就会重新计算其长度值，即长度值等于最后一项的索引加1.**

```
var colors = ["red", "blue", "green"];

colors[99] = "black";

console.log(colors.length); //100

colors[98]; // undefined

colors[3]; // undefined
```

向colors数组的位置99插入了一个值，结果数组新长度（length）就是100。
而位置3到位置98实际上都是不存在的，所以访问它们都会返回undefined。

数组最多可以包含4,294,967,295个项， 这几乎已经能够满足任何编程需求了。
如果想添加的项数超过了这个上限值，就会发生异常。
而创建一个初始大小与这个上限值接近的数组，则可能会导致运行时间超长的脚本错误。

## 检测数组

自从ECMAScript3做出规定之后，就出现了确定某个对象是不是数组的经典问题。

对于一个网页，或者一个全局作用域而言，使用instanceof操作符就能得到满意的结果。

```
var value = [];

if(value instanceof Array) {
    console.log("it is array");
}
```

instanceof操作符的问题在于，它假定只有一个全局执行环境。

如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的构造函数。
如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。

**为了解决这个问题，ECMAScript5新增了Array.isArray()方法。这个方法的目的是最终确定这个值到底是不是数组，而不管它是在哪个全局执行环境中创建的。**

```
var value = []; 
if(Array.isArray(value)) {
    console.log("it is Array");
}
```

支持Array.isArray()方法的浏览器有IE9+、Firefox4+、Safari 5+、Opera 10.5+ 和Chrome。


## 转换方法

**数组也是对象，只不过是个特殊的对象，所以，也具有toLocaleString(), toString()和valueOf()方法。**
其中，调用valueOf()返回的还是数组本身，而调用数组的toString()方法会返回由数组中每个项的值以字符串形式拼接而成的以逗号分隔的字符窜。
**为了创建这个字符串会调用数组每一项的toString()方法。**

```

var colors = ["red", "blue", "green"];
console.log(colors.toString()); // "red,blue,green";
console.log(colors.valueOf()); // ["red","blue","green"];
console.log(colors); // ["red","blue","green"];
alert(colors); //"red,blue,green";

```

首先，显式地调用了toString()方法，返回数组的字符串表示，数组中每个项的值以字符串形式拼接，中间以逗号分隔。
接着调用valueOf()方法，而最后一行代码直接将数组传递给了alert()。
由于alert()要接收字符窜参数，所以它会在后台调用toString()方法，由此，会得到与直接调用toString()方法相同的结果。

toLocaleString()方法经常也会返回与toString()和valueOf()方法相同的值，但也不总是如此。
当调用数组的toLocaleString()方法时，它也会创建一个数组值的以逗号分隔的字符串。
而与前两个方法唯一的不同之处在于，这一次为了取得每一项的值，调用的是每一项的toLocaleString()方法，而不是toString()方法。

```
var person1 = {
    toLocaleString: function(){
        return "Shaw";
    },

    toString: function() {
        return "Roc";
    }
}

var person2 = {
    toLocaleString: function(){
        return "Daniel";
    },

    toString: function() {
        return "Danny";
    }
}

var people = [person1, person2];

alert(people); //等价于people.toString();  "Roc,Danny";
alert(people.toString()); // "Roc,Danny"
alert(people.toLocaleString()); // "Shaw,Daniel"

```

以上代码定义了两个对象：person1和person2。
而且还分别为每个对象定义了一个toString()方法和一个toLocaleString()方法，这两个方法返回不同的值。
**然后，创建换一个包含前面定义的两个对象的数组。**

在将数组传递给alert()时，输出结果是“Roc,Danny”，因为调用了数组每一项的toString()方法。
同样，这与下一行显式调用toString()方法得到的结果相同。

而当调用数组的toLocaleString()方法时，输出结果是“Shaw,Daniel”，原因始调用了数组每一项的toLocaleString()方法。

数组继承的toLocaleString()、toString()和valueOf()方法，在默认情况下都会以逗号分隔的字符串形式返回数组项。

**而如果使用join()方法，则可以使用不同的分隔符来构建这个字符窜。**
**join()方法只接收一个参数，即用作分隔符的字符窜，然后返回包含所有数组项的字符串。**

```
var colors = ["red","blue","green"];

console.log(colors.join(",")); //red,blue,green
console.log(colors.join("||")); //red||blue||green

```

使用join()方法重现了toString()方法的输出。
在传递逗号的情况下，得到了以逗号分隔的数组值。
而在最后一行代码中，传递了双竖线符号，结果就得到了字符窜“red||blue||green”。
**如果不给join()方法出入任何值，或者join()方法传入任何值，或者给它传入undefined，则使用逗号作为分隔符。**
**IE7及更早版本会错误的使用字符窜“undefined”作为分隔符。**

**如果数组中的某一项的值是null或者undefined，那么该值在join()、toLocaleString()、toString()和valueOf()方法返回的结果以空字符串表示。**

