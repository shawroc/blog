# DOM扩展

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---


尽管DOM作为API已经非常完善了，但为了实现更多的功能，仍然会有一些标准或专有的扩展。
2008年之前，浏览器中几乎所有的DOM扩展都是专有的。此后，W3C着手将一些已经成为事实标准的专有扩展标准化并写入规范当中。

对DOM的两个主要的扩展是Selector API(选择符API)和HTML。

这两个扩展都源自开发社区，而将某些常见做法及API标准一直是众望所归。
此外，还有一个不那么引人注目的Element Traversal（元素遍历）规范，为DOM添加了一些属性。

虽然前述两个主要规范（特别是HTML5) 已经涵盖了大量的DOM扩展，但专有扩展依然存在。

## 选择符API

众多JavaScript库中最常用的一项功能，就是根据CSS选择符选择与某个模式匹配的DOM元素。
实际上，jQuery（www.jquery.com）的核心就是通过CSS选择符查询DOM文档取得元素的引用，从而抛开了getElementById()和getElementsByTagName()。

Selectors API(www.w3.org/TR/selectors-api)是由W3C发起制定的一个标准。致力于让浏览器原生支持CSS查询。

所有实现这一功能的JavaScript库都会写一个基础的CSS解析器，然后再使用已有的DOM方法查询文档并找到匹配的节点。

尽管库开发人员在不知疲倦地改进这一过程的性能，但到头来都只能通过运行JavaScript代码来完成查询操作。

而把这个功能变成原生API之后，解析和树查询操作可以在浏览器内部通过编译后的代码来完成，极大地改善了性能。

Selectors API Level 1的核心是两个方法：

querySelector()和querySelectorAll()。

在兼容浏览器中，可以通过Document及Element类型的实例调用它们。

目前已完全支持Selectors API Level 1的浏览器有IE 8+、Firefox 3.5+、Safari 3.1+、Chrome和Opera 10+。

1. querySelector()方法

querySelector()方法接收一个CSS选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回null。

```
//取得body元素
var body = document.querySelector("body");

//取得ID为"myDiv"的元素
var myDiv = document.querySelector("#myDiv");

//取得类为"selected"的第一个元素
var selected = document.querySelector(".selected");

//取得类为"button"的第一个图像元素
var img = document.body.queryselector("img.button");
```

**通过Document类型调用querySelector()方法时，会在文档元素的范围内查找匹配的元素。**

**而通过Element类型调用querySelecor()方法时，只会在该元素后代元素的范围查找匹配的元素。**

CSS选择符可以简单也可以复杂，视情况而定。如果传入了不被支持的选择符，querySelector()会抛出错误。

2. querySelectorAll()方法

querySelectorAll()方法接收的参数与querySelector()方法一样，都是一个CSS选择符，但返回的是所有匹配的元素而不仅仅是一个元素。**这个方法返回的是一个NodeList的实例。**

具体来说，返回的值实际上是带有所有属性和方法的NodeList，而其底层实现则类似于一组元素的快照，而非不断对文档进行搜索的动态查询。

**这样实现可以避免使用NodeList对象通常会引起的大多数性能问题。**

只要传给querySelectorAll()方法的CSS选择符有效，该方法都会返回一个NodeList对象，而不管找到多少匹配的元素。如果没有找到匹配的元素，NodeList就是空的。

与querySelector()类似，能够调用 querySelectorAll()方法的类型包括 Document、DocumentFragment和 Element。

```
//取得某<div>中的所有<em>元素
var ems = document.getElementById("myDiv").querySelectorAll("em");

//取得类为"selected"的所有元素
var selecteds = document.querySelectorAll(".selected");

//取得所有<p>元素中的所有<strong>元素
var strongs = document.querySelectorAll("p strong");
```

要取得返回的NodeList中的每一个元素，可以使用item()方法，也可以使用方括号语法。

```
var i, len, strong;

for(i = 0; i < len; i ++) {
    strong = strongs[i];
    strong.className = "important";
}
```

同样与querySelector()类似，如果传入了浏览器不支持的选择符或选择符中有语法错误，querySelectorAll()会抛出错误。


## 元素遍历

对于元素间的空格，IE9及之前版本不会返回文本节点，而其他浏览器都会返回文本节点。

这样就导致了在使用childNodes和firstChild等属性时的行为不一致。

为了弥补这一差异，而同时又保持DOM规范不变，Element Traversal（www.w3.org/TR/ElementTraversal/)新定义了一组属性。

Element Traversal API为DOM元素添加了以下5个属性。

- childElementCount: 返回子元素（不包括文本节点和注释）的个数。
- firstElementChild: 指向第一个子元素；firstChild的元素版。
- lastElementChild: 指向最后一个子元素；lastChild的元素版。
- previousElementSibling: 指向前一个同辈元素；previousSibling的元素版。
- nextElementSibling: 指向后一个同辈元素；nextSibling的元素版。

**支持的浏览器为DOM元素添加了这些属性，利用这些元素不必担心空白文本节点，从而可以更方便地查找DOM元素了。**

过去要跨浏览器遍历某元素的所有子元素，需要像下面这样写代码：

```
var child = element.firstChild

while (child != element.lastChild) {
    if(child.nodeType == 1) { //检查是不是元素
        processChild(child);
    };
    child = child.nextSibling; 
}
```

而使用Element Traversal新增的元素，代码会更简单：

```
var child = element.firstElementChild;

while(child != child.lastElementChild) {
    processChild(child); //已知其实元素
    child = element.nextElementSibling;
}
```

支持Element Traversal规范的浏览器有IE 9+、Firefox 3.5+、Safaru 4+、Chrome和Opera 10+；

## HTML5

对于传统HTML而言，HTML5是一个叛逆。

1. 与类相关的扩充

HTML4在Web开发领域得到广泛采用后导致了一个很大的变化，即class属性用得越来越多，一方面可以通过它为元素添加样式，另一方面还可以用它表示元素的语义。于是，自然就有很多JavaScript代码来操作CSS类，比如动态修改或者搜索文档中具有给定类或给定的一组类的元素，等等。为了让开发人员适应并增加对class属性的新认识，HTML5新增了很多API，致力于简化CSS类的用法。

- getElementsByClassName()方法

HTML5添加的getElementsByClassName()方法是最受人欢迎的一个方法，可以通过document对象及所有HTML元素调用该方法。这个方法最早出现在JavaScript库中，是听过既有的DOM功能实现的，**而原生的实现具有极大的性能优势。**

getElementsByClassName()方法接收一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的NodeList。传入多个类名时，类名的先后顺序不重要。

```
//取得所有类中包含"username"和"current"的元素，类名的先后顺序无所谓
var allCurrenttUsernames = document.getElementsByClassName("username current");

//取得ID为"myDiv"的元素中带有类型"selected"的所有元素
var selected = document.getElementById("myDiv").getElementsByClassName("selected");
```

调用这个方法时，只有位于调用元素子树中的元素才会返回。
在document对象调用getElementsByClassName()始终会返回与类型匹配的所有元素，在元素上调用该方法就只会返回后代元素中匹配的元素。

使用这个方法可以更方便地为带有某些类的元素添加事件处理程序，从而不必再局限于使用ID或标签名。

不过别忘了，因为返回的对象是NodeList，所以使用这个方法与使用getElementsByTagName()以及其他返回NodeList的DOM方法都具有同样的性能问题。

支持getElementByClassName()方法的浏览器哟偶IE9+、Firefox 3+、Safari 3.1+、Chrome和Opera 9.5+。

- classList属性

在操作类名时，需要通过className属性添加、删除和替换类名。
因为className中是一个字符串，所以即使只修改字符串一部分，也必须每次都设置整个字符串的值。

比如，以下面的HTML代码为例。

```
<div class="bd user disabled">..</div>
```

这个\<div>元素一共有三个类名。要从中删除一个类名，需要把这三个类名拆开，删除不想要的那个，然后再把其他类名拼接成一个新字符串。

```
//删除“user”类

//首先，取得类名字符串并拆分为数组

var classNames = div.className.split(/\s+/);

var i, length = classNames.length, position;

for(var i = 0; i < length; i ++) {
    if(classNames[i] === "user") {
        position = i;
        break;
    }
}

//删除类名
classNames.splice(i,1);

//把剩下的类名拼成字符串并重新设置
div.className = classNames.join(" ");
```

为了从\<div>元素的class属性中删除"user"，以上这些代码都是必须的。

必须通过类似的算法替换类名并确认元素中是否包含该类名。

添加类名可以通过拼接字符串完成，但必须要通过检测确定不会多次添加相同的类名。很多JavaScript库都实现了这个方法，以简化这些操作。

HTML5新增了一种操作类名的方式，可以让操作更简单也更安全，那就是为所有元素添加classList属性。

这个classList属性是新集合类型DOMTokenList的实例。与其他DOM集合类似，DOMTokenList有一个表示自己包含多少元素的length属性，而要取得每个元素可以使用item()方法，也可以使用方括号语法。

此外，这个新类型还定义如下方法：

- add(value)：将给定的字符串值添加到列表中。如果值已经存在，就不添加了。
- contains(values): 表示列表中是否存在给定的值，如果存在则返回true，否则返回false。
- remove(value): 从列表中删除给定的字符串。
- toggle(value)： 如果列表中已经存在给定的值，删除它。如果列表中没有给定的值，添加它。

这样，前面那么多行代码用下面这一行代码就可以代替了：

```
div.classList.remove("user");
```

以上代码能够确保其他类名不受此次修改的影响。其他方法也能极大地减少类似基本操作的复杂性。

```
//删除"disabled"类
div.classList.remove("disabled");

//添加"current"类
div.classList.add("current");

//切换"user‘类
div.classList.toggle("user");

//确定元素中是否包含既定的类型
if(div.classList.contains("bd") && !div.classList.contains("disabled")) {
    //执行操作
}

//迭代类名
for (var i = 0, len = div.classList.length; i < len; i ++) {
    doSomething(div.classList[i]);
}
```

有了classList属性，除非你需要全部删除所有类名，或者完全重写元素的class属性，否则也就用不到className属性了。

支持classList属性的浏览器有Firefox 3.6+ 和Chrome。

2. 焦点管理

HTML5也添加了辅助管理DOM焦点的功能。

首先就是document.activeElement属性，这个属性始终会引用DOM中当前获得了焦点的元素。

元素获得焦点的方法有页面加载、用户输入（通常是通过Tab键）和代码中调用focus()方法。

```
var button = document.getElementById("myButton");
button.focus();

console.log(document.activeElement === button); //true;
```

默认情况下，文档刚刚加载完成时，document.activeElement中保存的是document.body元素的引用。
文档加载期间，document.activeElement的值为null。


另外就是新增了document.hasFocus()方法，这个方法用于确定文档是否获得了焦点。

```
var button = document.getElementById("myButton");

button.focus();

console.log(document.hasFocus()); //true
```

通过检测文档是否获得了焦点，可以知道用户是不是正在与页面交互。

查询文档获知哪个元素获得了焦点，以及确定文档是否获得了焦点，这两个功能最重要的用途是提高Web应用的无障碍性。 

无障碍Web应用的一个主要标志就是恰当的焦点管理，而确切地知道哪个元素获得了焦点是一个极大的进步，至少不用像过去那样靠猜测了。

实现了这两个属性的浏览器包括IE 4+、Firefox 3+、 Safari 4+、Chrome和Opera 8+;

3. HTMLDocument的变化

HTML5扩展了HTMLDocument，增加了新的功能。与HTML5中新增的其他DOM扩展类似，这些变化同样基于那些已经得到很多浏览器完美支持的专有扩展。所以，尽管这些扩展被写入标准的时间相对不长，但很多浏览器很早就已经支持这些功能了。

- readyState属性

IE最早为document对象引入了readyState属性。然后，其他浏览器也都陆续添加这个属性，最终HTML5把这个属性纳入了标准当中。Document的readyState属性有两个可能的值:

- loading，正在加载文档。
- complete，已经加载完文档。

使用document.readyState的最恰当方式，就是通过它来实现一个指示文档已经加载完成的指示器。

在这个属性得到广泛支持之前，要实现这样一个指示器，必须借助onload事件处理程序设置一个标签，表明文档已经加载完毕。

document.readyState属性用法如下:

```
if(document.readyState == "complete") {
    //执行操作
}
```

支持readyState属性的浏览器有IE4+、Firefox 3.6+、Safari、Chrome和Opera 9+。

- 兼容模式

自从IE6开始区分渲染页面的模式是标准的还是混杂的，检测页面的兼容模式就成了浏览器的必要功能。

IE为此给document添加了一个名为compatMode的属性，这个属性就是为了告诉开发人员浏览器采用了哪种渲染模式。

就像下面例子中展示的那样，在标准模式下，document.compatMode的值等于"CSS1Compat"，而在混杂模式下，document.compatMode的值等于"BackCompat"。

```
if(document.compatMode == "CSS1Compat") {
    console.log("Standard Mode");
} else {
    console.log("Quirks Mode");
}
```

后来，陆续实现这个属性的浏览器有Firefox、Safari 3.1+、Opera和Chrome。最终，HTML5也把这个属性纳入标准，对其实现做出了明确规定。

- head属性

作为对document.body引用文档的\<body>元素的补充，HTML5新增了document.head属性，引用文档的\<head>元素。
要引用文档的\<head>元素，可以结合使用这个属性和另一种后备方法。

```
var head = document.head || document.getElementsByTagName("head")[0];

```

如果可用，就使用document.head，否则仍然使用getElementsByTagName()方法。

实现document.head属性的浏览器包括Chrome和Safari 5。