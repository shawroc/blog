# DOM-5

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## DOM操作技术

很多时候，DOM操作都比较简明，因此用JavaScript生成那些通常原本是HTML代码生成的内容并不麻烦。不过，也有一些时候，操作DOM并不像表面上看起来那么简单。

游览器浏览器中充斥着隐藏的陷阱和不兼容问题，用JavaScript代码处理DOM的某些部分要比处理其他部分更复杂一些。

1. 动态脚本

使用\<script>元素可以向页面中插入JavaScript代码。


一种方式是通过其src特性包含外部文件，另一种方式就是用这个元素本身来包含代码。

而动态脚本，指的是在页面加载时不存在，但将来的某一时刻通过修改DOM动态添加的脚本。

跟操作HTML元素一样，创建动态脚本也有两种方式： 插入外部文件和直接插入JavaScript代码。

动态加载的外部JavaScript文件能够立即运行，比如下面的\<script>元素：

```
<script type="text/javascript" src="client.js"></script>
```

这个\<script>元素包含了一个客户端检测脚本。而创建这个节点的DOM代码如下所示:

```
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "client.js";
document.body.appendChild(script);
```

显然，这里的DOM代码如实反映了相应的HTML代码。
不过，在执行最后一行代码把\<script>元素添加到页面之前，是不会下载外部文件的。
也可以把这个元素添加到\<head>元素中，效果相同。

整个过程可以使用下面的函数来封装。

```
function loadScript(url) {
    var srcipt = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}
```

然后，就可以通过调用这个函数来加载外部的JavaScript文件了。

```
loadScript("client.js");
```

加载完成后，就可以在页面中的其他地方使用这个脚本了。问题只有一个: 怎么知道脚本加载完成呢？遗憾的是，并没有什么标准来探知这一点。

不过，与此相关的一些事件倒是可以派上用场，这主要取决于所用的浏览器。

另外一种指定JavaScript代码的方式是行内方式。

```
<script type="text/javascript">
    function sayHi(){
        alert("hi");
    }
</script>
```

从逻辑上讲，下面的DOM代码是有效的。

```
var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode("function sayHi(){alert('hi')}
"));
document.body.appendChild(script);
```

在Firefox、Safari、Chrome和Opera中，这些DOM代码可以正常运行。但在IE中，则会导致错误，IE将\<script>视为一个特殊的元素，不允许DOM访问其子节点。

不过，可以使用\<script>元素的text属性来指定JavaScript代码。

```
var script = document.createElement("script");
script.type = "text/javascript";
script.text = "function sayHi(){alert('hi')}";
document.body.appendChild(script);
```

经过这样修改之后的代码可以在IE、Firefox、Opera和Safari 3之后版本中运行。
Safari 3.0之前的版本虽然不能正确地支持text属性，但允许使用文本节点技术来指定代码。

如果需要兼容早期版本的Safari，可以使用如下代码：

```
var script = document.createElement("script");
script.type = "text/javascript";
var code = "function sayHi(){console.log('hi');}";

try {
    script.appendChild(document.createTextCode(code));
} catch(ex) {
    script.text = code;
}

document.body.appendChild(script);
```

这里，首先尝试标准的DOM文本节点方法，因为除了IE（在IE中会导致抛出错误），所有浏览器都支持这种方式。如果这行代码抛出了错误，那么说明就是IE，于是就必须使用text属性了。

可以来封装下这个函数。

```
function loadScriptString(code) {
    var script = document.createElement("script");
    
    script.type = "text/javascript";

    try {
        script.appendChild(document.createTextNode(code));
    } catch(ex) {
        script.text = code;
    }

    document.body.appendChild(script);
}

loadScriptString("function sayHi(){alert('hi')}");
```

以这种方式加载的代码会在全局作用域中执行，而且当脚本执行后将立即可用。
实际上，这样执行代码与在全局作用域中把相同的字符串传递给eval()是一样的。

2. 动态样式

能够把CSS样式包含到HTML页面中的元素有两个。
其中，\<link>元素用于包含来自外部的文件，而\<style>元素用于指定嵌入的样式。

与动态脚本类似，所谓动态样式是指在页面刚加载时不存在的样式。

动态样式是在页面加载完成后动态添加到页面中的。

以下面这个典型的\<link>元素为例：

```
<link rel="stylesheet" type="text/css" href="style.css">
```

使用DOM代码可以很容易地创建出这个元素：

```
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "style.css";

var head = document.getElementsByTagName("head")[0];
head.appendChild(link);
```

以上代码在所有主流浏览器中都可以正常运行。
需要注意的是，必须将\<link>元素添加到\<head>而不是\<body>元素，才能保证在所有浏览器中的行为一致。整个过程可以用以下函数来表示：

```
function loadStyles(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.src = url;

    var head = document.getElementsByTagName("head")[0];
    head.appendChild(head);
}
```

调用loadStyles函数的代码如下：

```
loadStyles("styles.css");
```

**加载外部样式文件的过程是异步的，也就是加载样式与执行JavaScript代码的过程没有固定的次序。**

一般来说，知不知道样式已经加载完成并不重要；
不过，也存在集中利用时间来事件这个过程是否完成的技术。

另一种定义样式的方式是使用\<style>元素来包含嵌入式CSS。

```
<style type="text/css">
body {
    background-color: red;
}
</style>
```

按照相同的逻辑，下列DOM代码应该是有效的：

```
var style = document.createElement("link");
style.type = "text/css";
style.appendChild(document.createTextNode("body{background-color:red}"));
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
```

以上代码可以在Firefox、Safari、Chrome和Opera中运行，在IE中则会报错。
IE将\<style>视为一个特殊的、与\<script>类似的节点，不允许其他DOM节点访问它。

事实上，IE此时抛出的错误与向\<script>元素添加子节点时抛出的错误相同。

解决IE中这个问题的办法，就是访问元素的styleSheet属性，该属性又有一个cssText属性，可以接受CSS代码。

```
var style = document.createElement("style");
style.type = "text/css";
try {
    style.appendChild(document.createTextNode("body {background-color:red}"));
} catch(ex) {
    style.styleSheet.cssText = "body {background-color:red}"
}

var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
```

与动态添加嵌入式脚本类似，重写后的代码使用了try-catch语句来捕获IE抛出的错误，然后使用针对IE的特殊方式来设置样式。

因此，通用的解决方案如下：

```
function loadStylesString(css) {
    var style = document.createElement('link');
    style.type = "text/css";
    try {
        style.appendChild(document.createTextNode(css));
    } catch(ex) {
        style.styleSheet.cssText = css;
    };
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}
```

调用这个函数的示例如下:

```
loadStyleString("body {background-color:red}");
```

这种方式会实时地向页面中添加样式，因此能够马上看到变化。

**如果专门针对IE编码代码，务必小心使用styleSheet.cssText属性。在重用同一个\<style>元素并再次设置这个属性时，有可能会导致浏览器崩溃。同样，将cssText属性设置为空字符串也可能导致浏览器崩溃。不知道IE修复了这个BUG没有。**


3. 操作表格

\<table>元素是HTML中最复杂的结构之一。
要想创建表格，一般都必须涉及表示表格行、单元格、表头等方面的标签。

由于涉及的标签多，因而使用核心DOM方法创建和修改表格往往都免不了要编写大量的代码。

假设我们要使用DOM来创建下面的HTML表格。

```
<table border="1" width="100%">
    <tbody>
        <tr>
            <td>Cell 1,1</td>
            <td>Cell 2,1</td>
        </tr>
        <tr>
            <td>Cell 1,2</td>
            <td>Cell 2,2</td>
        </tr>
    </tbody>
</table>
```

要使用核心DOM方法创建这些元素，得需要像下面这么多代码：

```
//创建table
var table = document.createElement("table");
table.border = "1";
table.width = "100%";

//创建tbody
var tbody = document.createElement("tbody");
table.appendChild(tbody);

//创建第一行tableRow
var tableRow1 = document.createElement("tr");
tbody.appendChild(tableRow1);

var tableRow1Cell1 = document.createElement("td");
tableRow1Cell1.appendChild(document.createTextNode("Cell 1,1"));
tableRow1.appendChild(tableRowCell1);

var tableRow1Cell2 = document.createElement("td");
tableRow2Cell2.appendChild(document.createTextNode("Cell 1,2"));
tableRow1.appendChild(tableRowCell2);

//创建第二行tableRow
var tableRow2 = document.crateElement("tr");
tbody.appendChild(tableRow2);

var tableRow2Cell1 = document.createElement("td");
tableRow2Cell1.appendChild(document.createTextNode("Cell 2,1)");
tableRow2.appendChild(tableRow2Cell1);

var tableRow2Cell2 = document.createElement("td");
tableRow2Cell2.appendChild(document.createTextNode("Cell 2,2)");
tableRow2.appendChild(tableRow2Cell2);


//将表格添加到文档主体中
document.body.appendChild(table);
```

显然，DOM代码很长，还有点不好懂。为了方便构建表格，HTML DOM还为\<table>、\<tbody>和\<tr>添加了一些属性和方法。

- caption: 保存着对\<caption>元素（如果有）的指针。
- tBodies: 是一个\<tbody>元素的HTMLCollection。
- tFoot: 保存着对\<tfoot>元素（如果有）的指针。
- tHead: 保存着对\<thead>元素（如果有）的指针。
- rows：是一个表格中所有行的HTMLCollection。
- createTHead(): 创建\<thead>元素，将其放到表格中，返回引用。
- createTFoot(): 创建\<tfoot>元素，将其放到表格中，返回引用。
- createCaption():创建\<caption>元素，将其放到表格中，返回引用。
- deleteTHead(): 删除\<thead>元素。
- deleteTFoot(): 删除\<tfoot>元素。
- deleteCaption(): 删除\<caption>元素。
- deleteRow(pos): 删除指定位置的行。
- insertRow(pos): 向rows集合中的指定位置插入一行。

为\<tbody>元素添加的属性和方法如下：

- rows: 保存着\<tbody>元素中行的HTMLCollection。
- deleteRows(pos): 删除指定位置的行。
- insertRows(pos): 向rows集合中的指定位置插入一行，返回对新插入行的引用。

为\<tr>元素添加的属性和方法如下:

- cells: 保存着\<tr>元素中单元格的HTMLCollection。
- deleteCell(pos): 删除指定位置的单元格。
- insertCell(pos): 向cells集合中的指定位置插入一个单元格，返回对新插入单元格引用。


使用这些属性和方法，可以极大地减少创建表格所需的代码数量。
例如：使用这些属性和方法可以将前面的代码重写如下：

```
//创建table
var table = document.createElement("table");
table.border = "1.0";
table.width = "100%";

//创建table body
var tbody = document.createElement("tbody");
table.appendChild(tbody);

//创建第一行
tbody.insertRow(0);
tbody.rows[0].insertCell(0);
tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell, 1,1"));
tbody.rows[0].insertCell(1);
tbody.rows[0].cells[1].appendChild(document.createTextNode("Cell, 1,2"));

//创建第二行
tbody.insertRow(1);
tbody.rows[1].insertCell(0);
tbody.rows[1].cells[0].appendChild(document.createTextNode("Cell, 2,1"));
tbody.rows[1].insertCell(1);
tbody.rows[1].cells[1].appendChild(document.createTextNode("Cell, 2,2"));

//将表格添加到文档主体中
document.body.appendChild(table);
```

在这次的代码中，创建\<table>和\<tbody>的代码没有变化。

不同的是创建两行的部分，其中使用了HTML DOM定义的表格属性和方法。

总之，使用这些属性和方法创建表格的逻辑性更强，也更容易看懂，尽管技术上这两套代码都是正确的。

4. 使用NodeList

**理解NodeList及其“近亲”NamedNodeMap和HTMLCollection，是从整体上透彻理解DOM的关键所在。**

这三个集合都是"动态的"; 换句话说，每当文档结构发生变化时，它们都会得到更新。
因此，它们始终都会保存着最新、最准确的信息。

**从本质上说，所有NodeList对象都是在访问DOM文档时实时运行的查询。**

例如: 下面的代码将导致无限循环

```
var divs = document.getElementsByTagName("div"), i, div;

for (var i = 0; i < divs.length; i ++) {
    div = document.createElement("div");
    document.body.appendChild(div);
}
```

第一行代码会取得文档中所有的\<div>元素的HTMLCollection。
由于这个集合是“动态的”，因此只要有新\<div>元素被添加到页面中，这个元素也会被添加到该集合中。

浏览器不会将创建的所有集合都保存在一个列表中，而是在下一次访问集合时再更新集合。

结果，在遇到上例中所示的循坏代码时，就会导致一个有趣的问题。

每次循环都要对条件 i < divs.length求值，意味着会运行取得所有\<div>元素的查询。考虑到循环体每次都会创建一个新\<div>火元素并将其添加到文档中，因此divs.length的值在每次循环后都会递增。

既然i和divs.length每次都会同时递增，结果它们的值永远也不会相等。

**如果想要迭代一个NodeList，最好是使用length属性初始化第二个变量，然后将迭代器与该变量进行比较。**

```
var divs = document.getElementsByTagName("div"), i, length, div;

for( i = 0, length = divs.length; i < length; i ++) {
    div = document.createElement("div");
    document.body.appendChild(div);
}
```

这个例子中初始化第二个变量length。
由于length中保存着对divs.length在循环开始时的一个快照，因此就会避免上一个例子中出现的无限循环问题。

**一般来说，应该尽量减少访问NodeList的次数。因此每次访问NodeList，都会运行怡翠基于文档的查询。所以，可以考虑将从NodeList中的值缓存起来。**


## 小结

DOM是语言中中立的API，用于访问和操作HTML和XML文档。DOM1 级将HTML和XML文档形象地看作一个层次化的节点树，可以使用JavaScript来操作这个节点树，进而改变底层文档的外观和结构。

DOM由各种节点构成，简要总结如下：

- 最基本的节点类型是Node，用于抽象地表示文档中一个独立的部分；所有其他类型都继承自Node。

- Document 类型表示整个文档，是一组分层节点的跟节点。在JavaScript中，document对象是Document的一个实例。使用document对象，有很多种方式可以查询和取得节点。

- Element节点表示文档中的所有HTML或XML元素，可以用来操作这些元素的内容和特性。

- 另外还有一些节点类型，分别表示文本内容、注释、文档类型、CDATA区域和文档片段。

访问DOM的操作在多数情况下都很直观，不过在处理\<script>和\<style>元素时还是存在一些复杂性。由于这两个元素分别包含脚本和样式信息，因此浏览器通常会将它们与其他元素区别对待。这些区别导致了在针对这些元素使用innerHTML时，以及在创建新元素时的一些问题。

**理解DOM的关键，就是理解DOM对性能的影响。DOM操作往往是JavaScript程序中开销最大的部分，而因访问NodeList到哦之的问题为最多。**

NodeList 对象都是“动态的”，这就意味着每次访问NodeList对象，都会运行一次查询。

**有鉴于此，最好的办法就是尽量减少DOM操作。**