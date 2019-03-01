# JS_ES5_Event -1

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

JavaScript与HTML 之间的交互是通过事件实现的。

事件，就是文档或浏览器窗口中发生的一些特定的交互瞬间。

**可以使用侦听器（或处理程序）来预定事件，以便事件发生时执行相应的代码。这种在传统软件工程中被称为观察员模式的模型，支持页面的行为（JavaScript)与页面的外观（HTML和CSS代码）之间的松散耦合。**

事件最早是在IE3和Netscape Navigator 2中出现的，当时是作为分担服务器运算负载的一种手段。
在IE4和Navigator 4发布时，这两种浏览器都提供了相似但不相同的API，这些API并存经过了好几个主要版本。 DOM2级规范开始尝试以一种符合逻辑的方式来标准化DOM事件。

IE9、Firefox、Opera、Safari和 Chrome 全都已实现了 “DOM2级事件” 模块的核心部分。
IE8是最后一个仍然使用其专有事件系统的主要浏览器。

浏览器的事件系统相对比较复杂。尽管所有主要浏览器已经实现了"DOM2级事件"，但这个规范本身并没有涵盖所有事件类型。浏览器对象模型（BOM）也支持一些事件，这些事件与文档对象模型（DOM）事件之间的关系并不十分清晰，因为BOM事件长期没有规范可以遵循（HTML5后来给出了详细的说明）。

随着DOM3级的出现，增强后的DOM事件API变得更加繁琐。
使用事件有时相对简单，有时则非常复杂，难易程度会因你的需求而不同。

不过，有关事件的一些核心概念是一定要理解的。

## 事件流

当浏览器发展到第四代时（IE4及Netscape Communicator 4)，浏览器开发团队遇到了一个很有意思的问题：**页面的哪一部分会拥有某个特定的事件？**

**要明白这个问题问的是什么，可以想象画在一张纸上的一组同心圆。**

**如果你把手指放在圆心上，那么你的手指指向的不是一个圆，而是纸上的所有圆。**

两家公司的浏览器开发团队在看待浏览器时间方面还是一致的。

**如果你点击了某个按钮，他们都认为点击事件不仅仅发生在按钮上。也就是说，在点击按钮的同时，你也单击了按钮的容器元素，甚至也点击了整个页面。**

**事件流描述的是从页面中接收事件的顺序。**

但有意思的是，IE和 Netscape 开发团队居然提出了差不多是完全相反的事件流的概念。
IE的事件流是事件冒泡流，而 Netscape Communicator的事件流是事件捕获流。

### 事件冒泡流

IE的事件流叫做事件冒泡（Event Bubbling)，即事件开始时由最具体的元素（文档嵌套层次最深的那个节点）接收，然后逐级向上传播到较为不具体的节点（文档）。

以下面的HTML页面为例：

```
<!DOCTYPE html>
<html>
<head>
    <title>Event Bubbling Example</title>
</head>
<body>
    <div id="myDiv">Click Me</div>
</body>
</html>
```

如果你点击了页面中的\<div>元素，那么这个click事件会按照如下顺序传播：

```
1. <div>
2. <body>
3. <html>
4. document
```

也就是说，click事件首先在\<div>元素上发生，而这个元素就是我们点击的元素。
**然后，click事件沿DOM树向上传播，在每一级都会发生，直至传播到document对象。**

所有现代浏览器都支持事件冒泡，但在具体实现上海市有一些差别。
IE5.5 及更早版本中的事件冒泡会跳过\<html>元素（从\<body>直接跳到document）。
IE9、Firefox、Chrome和Safari 则将事件一直冒泡到window对象。

### 事件捕获

Netscape Communicator 团队提出的另一种事件流叫做事件捕获（event capturing）。

事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。

事件捕获的用意在于在事件到达预定目标之前捕获它。
如果仍以前面的HTML页面作为演示事件捕获的例子，那么点击\<div>元素就会以下列顺序出发click事件。

```
1. document
2. <html>
3. <body>
4. <div>
```

在事件捕获过程中，document对象首先接收到click事件，然后事件沿DOM树依次向下，一直传播到事件的实际目标，即\<div>元素。

虽然事件捕获是Netscape Communicator 唯一支持的事件流模型，但IE9、Safari、Chrome、Opera和Firefox 目前也支持这种事件流模型。

尽管“DOM2级事件”规范要求事件应该从document对象开始传播，但这些浏览器都是从window对象开始捕获事件的。

**由于版本的浏览器不支持，因此很少有人使用事件捕获，因此可以放心使用事件冒泡，在有特殊需要时再使用事件捕获。**


### DOM事件流

"DOM2级事件" 规定的事件流包括三个阶段： 

事件捕获阶段、处于目标阶段和事件冒泡阶段。

先发生的事件捕获，为截获事件提供了机会。然后是实际的目标接收到事件。
最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

以前面简单的HTML页面为例，单击\<div>元素会按照这个顺序触发事件。

```
//捕获阶段
1. document
2. html
3. body

//目标
4.div

//冒泡阶段
5. body
6. html
7. document
```

在DOM事件流中，实际的目标（\<div>元素）在捕获阶段不会接收到事件。
这意味着从document到\<html>到\<body>后就停止了。
下一个阶段是"处于目标"阶段，于是事件在\<div>上发生。并在事件处理中被看成冒泡阶段的一部分。
然后，冒泡阶段发生，事件又回播回文档。

多数支持DOM事件流的浏览器都实现了一种特定的行为；即使"DOM2级事件"规范明确要求捕获阶段不会涉及到事件目标，但IE9、Safari、Chrome、Firefox和Opera 9.5 及更高版本都会在捕获阶段出发事件对象上的事件。结果，就是有两个机会在目标对象上面操作事件。

**IE9、Opera、Firefox、Chrome和Safari都支持DOM事件流，IE8及更早版本不支持DOM事件流。**


## 事件处理程序

事件就是用户或浏览器自身执行的某种动作。
诸如click、load和mouseover，都是事件的名字。
而响应某个事件的函数就叫做事件处理程序(或事件侦听器)。

事件处理程序的名字以"on"开头，因此，click事件的时间处理程序就是onclick，load事件的事件处理程序就是onload。为事件指定处理程序的方式有好几种。

### HTML事件处理程序

某个元素支持的每种事件，都可以使用一个与相应事件处理程序同名的HTML特性来指定。
这个特性的值应该是能够执行的JavaScript代码。

例如，要在按钮被点击时执行一些JavaScript，可以像下面这样编码代码：

```
<input type="button" value="Click Me" onclick="alert('Clicked')">
```

当点击这个按钮时，就会显示一个警告框。
这个操作是通过指定onclick特性并将一些JavaScript代码作为它的值来定义的。

由于这个值是JavaScript，因此不能再其中使用未经转义的HTML语法字符，例如和号（&）、双引号("")、小于号（<）或大于号(>)。为了避免使用HTML实体，这里使用了单引号。

如果想要使用双引号，那么就要将代码改写成如下所示：

```
<input type="button" value="Click Me" onclick="alert(&qut;Cliked&qut;)">
```

在HTML中定义的事件处理程序可以包含要执行的具体动作，也可以调用在页面其他地方定义的脚本，如下面的例子所示：

```
<script type="text/javascript">
    function showMessage(){
        alert("Hello Wolrd");
    }
</script>

<input type="button" value="Click Me" onclick="showMessage()">
```

在这个例子中，单击按钮就会调用showMessage()函数。
这个函数是在一个独立的\<script>元素中定义的，当然也可以包含在一个外部文件中。

事件处理程序中的代码在执行时，有权访问全局作用域中的任何代码。

这样指定事件处理程序具有一些独到之处。首先，这样会创建一个封装着元素属性值的函数。这个函数中有一个局部变量event，也就是事件对象：

```
<!-- 输出 "click" -->
<input type="button" value="Click Me" onclick="alert(event.type)">
```

通过event变量，可以直接访问事件兑现个，你不用自己定义它，也不用从函数的参数列表中读取。

在这个函数内部，this值等于事件的目标元素。

```
<!-- 输出 "click" -->
<input type="button" value="Click Me" onclick="alert(this.value)">
```

不过，在HTML中指定事件处理程序有两个缺点。

首先，存在一个时差问题。因为用户可能会在HTML 元素一出现在页面上就触发相应的事件，但当时的事件处理程序有可能尚不具备执行条件。以前面的例子来说，假设showMessage()函数是在按钮下方、页面的最底部定义的。如果用户在页面分析showMessage()函数之前就点击了按钮，就会引发错误。

为此，很多HTML事件处理程序都会被封装在一个try-catch块中，以便错误不会浮出水面。

```
<input type="button" value="click me" onclick="try{showMessage()} catch(ex){}">
```

这样，如果在showMessage()函数有定义之前单击了按钮，用户将不会看到JavaScript错误，因为在浏览器有机会处理错误之前，错误就被捕获了。

另一个缺点是，这样扩展事件处理程序的作用域链在不同浏览器中会导致不同的结果。不同JavaScript引擎遵循的标识符解析规则略有差异，很可能会在访问非限定对象成员时出错。

通过HTML指定事件处理程序的最后一个缺点是HTML与JavaScript代码紧密耦合。
如果要更换事件处理程序，就要改动两个地方：HTML代码和JavaScript代码。而这正是许多开发人员摈弃HTML事件处理程序，转而使用JavaScript指定事件处理程序的原因所在。

### DOM0级事件处理程序

通过JavaScript指定事件处理程序的传统方式，就是将一个函数赋值给一个时间处理程序属性。
这种为事件处理程序赋值的方法是在第四代 Web浏览器中出现的，而且至今仍然为所有现代浏览器所支持。

**原因一是简单，二是具有跨浏览器的优势。**

要使用JavaScript指定事件处理程序，首先必须取得一个要操作的对象的引用。

每个元素（包括window和document）都有自己的事件处理程序属性，这些属性通常全部小写。
例如onclick。将这种属性的值设置为一个函数，就可以指定事件处理程序。

```
var btn = document.getElementById("myBtn");
btn.onclick = function(){
    console.log("click");
};
```

再次，我们通过文档对象取得了一个按钮的引用，然后为它指定了onclick事件处理程序。
但要注意，在这些代码运行以前不会指定事件处理程序，因此如果这些代码在页面中位于按钮后面，就有可能在一段时间内怎么点击都没有反应。

使用DOM0级方法指定的事件处理程序被认为是元素的方法。
因此，这时候的事件处理程序时在元素的作用域中运行；
换句话说，程序中的this引用当前元素。

```
var btn = document.getElementById("myBtn");
btn.onclick = function(){
    console.log(this.id); //"myBtn"
}
```

单击按钮显示的是元素的ID，这个ID是通过this.id取得的。不仅仅是ID，实际上可以在处理程序中通过this访问元素的任何属性和方法。

以这种方式添加的事件处理程序会在事件流的冒泡阶段被处理。

也可以删除通过 DOM0 级方法指定的事件处理程序，只要像下面这样将事件处理程序属性的值设置为null即可： 

```
btn.onclick = null;
```

将事件处理程序设置为null之后，再点击按钮将不会有任何动作发生。

**如果你使用HTML指定事件处理程序，那么onclick属性的值就是一个包含着在同名HTML特性中指定的代码的函数。而将相应的属性设置为null，也可以删除以这种方式指定的事件处理程序。**

### DOM2级事件处理程序

"DOM2级事件" 定义了两个方法，用于处理指定和删除事件处理程序的从操作：addEventListener()和removeEventListener()。

所有DOM节点中都包含这两个方法，并且它们都接受3个参数：

要处理的事件名、作为事件处理程序的函数和一个布尔值。

最后这个布尔值参数如果是true，表示在捕获阶段调用事件处理程序；如果是false，表示在冒泡阶段调用事件处理程序。

要在按钮上为click事件添加事件处理程序，可以使用下列代码：

```
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function(){
    alert(this.id);
}, false);
btn.addEventListener("click", function(){
    alert("Hello World");
}, false);
```

上面的代码为一个按钮添加了onclick 事件处理程序，而且该事件会在冒泡阶段被触发(因为最后一个参数是fasle)。与DOM0级方法一样，这里添加的事件处理程序也是在其依附的元素的作用域中运行。使用DOM2级方法添加事件处理程序的主要好处是就可以添加多个事件处理程序。

```
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function(){
    alert(this.id);
}, false);
btn.addEventListener("click", function(){
    alert("Hello World");
}, false);
```

这里为按钮添加了两个事件处理程序。

这两个事件处理程序会按照它们的顺序触发，因此首先会显示元素的ID，其次会显示"Hello world!"消息。

通过addEventListener()添加的事件处理程序只能使用removeEventListener()来移除；
移除时传入的参数与添加处理程序时使用的参数相同。
这也意味着通过 addEventListener()添加的匿名函数无法移除。

```
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function(){
    alert(this.id);
}, false);

//这里省略了其他代码

btn.removeEventListener("click", function(){//没有用
    alert(this.id);
}, false)
```

在这个例子中，我们使用 addEventListener() 添加了换一个事件处理程序。
虽然调用 removeEventListener()时看似使用了相同的参数，但实际上，第二个参数与传入addEventListener()中的那一个是完全不同的函数。
而传入 removeEventListener() 中的事件处理程序函数必须与传入addEventListener()中的相同。

```
var btn = document.getElementById("myBtn");
var handler = function(){
    alert(this.id);
};

btn.addEventListener("click", handler, false);

btn.removeEventListener("click", handler, false); //有效
```

重写后的这个例子没有问题，是因为在addEventListener()和removeEventListener()中使用了相同的函数。

大多数情况下，都是将事件处理程序添加到事件流的冒泡阶段，这样可以最大限度地兼容各种浏览器。
最好只在需要在事件到达目前之前截获它的时候将事件处理程序添加到捕获阶段。

如果不是特别需要，不建议在事件捕获阶段处理程序。

**IE9、Firefox、Safari、Chrome和 Opera 支持DOM2级事件处理程序。**

## IE 事件处理程序

IE实现了与DOM中类似的两个方法：attachEvent()和detachEvent()。
这两个方法接收相同的两个参数： 事件处理了程序名称与事件处理程序函数。

由于IE8 及更早版本只支持事件冒泡，所以通过attachEvent()添加的事件处理程序都会被添加到冒泡阶段。

```
var btn = document.getElementById("myBtn");
btn.attachEvent("onclick", function(){
    console.log("Clicked");
});
```

注意，attachEvent()的第一个参数是"onclick"，而非DOM的addEventListener()的"click"。

**在IE中使用 attachEvent()与使用DOM0级方法的主要区别在于事件处理程序的作用域。**
**在使用DOM0级方法的情况下，事件处理程序会在其所属元素的作用域内运行。在使用attachEvent()方法的情况下，事件处理程序会在全局作用域中运行，因此this等于window。**

```
var btn = document.getElementById("myBtn");
btn.attachEvent("click", function(){
    alert(this === window); //true
});
```

**在编写跨浏览器的代码时，牢记这一区别非常重要。**

与addEventListener()类似，attachEvent()方法也可以用来为一个元素添加多个事件处理程序。

```
var btn = document.getElementById("myBtn");
btn.addEventListener("onclick", function(){
    alert("clicked");
});

btn.addEventListener("onclick", function(){
    alert("Hello world!");
});
```

这里调用了两次 attachEvent()，为同一个按钮添加了两个不同的事件处理程序。
不过，与DOM方法不同的是，这些事件处理程序不是以添加它们的顺序执行，而是以相反的顺序被触发。
单击这个例子中的按钮，首先看到是"Hello world!"，然后才是"clicked"。

使用attachEvent()添加的时间可以通过detachEvent()来移除，条件是必须提供相同的参数。
与DOM方法一样，这也意味着添加的匿名函数将不能被除。

不过，只要能够将对相同的函数的引用传给detachEvent()，就可以移除相应的事件处理程序。

```
var btn = document.getElementById("myBtn");
var handler = function(){
    alert("clicked");
}

btn.attachEvent("onclick", handler);

btm.detachEvent("onclick", handler);
```

这个例子将保存在变量handler中的函数作为事件处理程序。
因此，后面的detachEvent()可以使用相同的函数来移除事件处理程序。

**支持IE事件处理程序的浏览器有IE和Opera**

## 跨浏览器的事件处理程序

为了以跨浏览器的方式处理事件，不少开发人员会使用能够隔离浏览器差异的JavaScript库，还有一些开发人员会自己开发最合适的事件处理的方法。

自己编写代码其实也不难，只要恰当地使用能力检测即可。要保证处理事件的代码能在大多数浏览器下一致运行，只需关注冒泡阶段。

第一个要创建的方法是 addHandler()， 它的职责是视情况分别使用DOM0级方法、DOM2级方法或IE方法来添加事件。这个方法属于一个名叫EventUtil的对象，本书将使用这个对象来处理浏览器间的差异。

addHandler()方法接受3个参数： 要做的元素、事件名称和事件处理程序函数。

与addHandler()对应的方法是removeHandler()， 它也接受相同的参数。
这个方法的职责是移除之前添加的事件处理程序——无论该事件处理程序是采取什么方式添加到元素中的，如果其他方法无效，默认采用DOM0级方法。

EventUtil的用法如下：

```

var EventUtil = {
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type,handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] =  handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.removeEventListener(type, handler, false);
        } else if(element.attachEvent) {
            element.detachEvent('on'+type, handler);
        } else {
            element['on' + type] = null;
        }
    }
}

```

这两个方法首先会检测传入的元素中是否存在DOM2级方法。

如果存在DOM2级方法，则使用该方法：传入事件类型、事件处理程序函数和第三个参数false（表示冒泡阶段）。如果存在的是IE的方法，则采取第二种方案。注意，为了在IE8及更早版本中运行，此时的事件类型必须加上"on"前缀。最后一种可能就是使用DOM0级方法（在现代浏览器中，应该不会执行这样的代码）。

此时，我们使用的是方括号语法来讲属性名指定为事件处理程序，或者将属性设置为null。

可以像下面这样使用EventUtil对象：

var btn = document.getElementById("myBtn");

var handler = function() {
    alert("Clicked");
};

EventUtil.addHandler(btn, "click", handler);
```

addHandler() 和 removeHandler()没有考虑到所有的浏览器问题，例如在IE中的作用域问题。
不过，使用它们添加和移除事件处理程序还是足够了。
此外还要注意，DOM0级对每个事件只支持一个事件处理程序。
好在，只支持DOM0级的浏览器已经没有那么多了，因此这对你而言应该不是什么问题。