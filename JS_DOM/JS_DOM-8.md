# DOM扩展-8

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 专有扩展

虽然所有浏览器开发商都知晓坚持标准的重要性，但在发现某项功能缺失时，这些开发商都会一如既往地向DOM中添加专有扩展，以弥补功能上的不足。表面上，这种各种各行其是的做法似乎不太好，但实际上专有扩展为Web开发领域提供了很多重要的功能，这些功能最终在HTML5规范中得到了标准化。

即便如此，仍然还有大量专有的DOM扩展没有成为标准。
但这并不是说它们将来不会被写进标准，而只是说它们专有功能，而且只得到了少数浏览器的支持。

### 文档模式

IE8引入了一个新的概念叫“文档模式”（document mode)。页面的文档模式决定了可以使用什么功能。

**文档模式决定了你可以使用哪个级别的CSS，可以在JavaScript中使用哪些API，以及如何对待文档类型（doctype）。**

到了IE9，总共有以下4种文档模式：

- IE5：以混杂模式渲染页面（IE5的默认模式就是混杂模式）。IE8及更高版本中的新功能都无法使用。

- IE7：以IE7标准模式渲染页面。IE8及更高版本中的新功能都无法使用。

- IE8：以IE8标准模式渲染页面。IE8中的新功能都可以使用，因此可以使用Selector API、更多CSS2级选择符合某些CSS3功能，还有一些HTML5的功能。不过IE9中的新功能无法使用。

- IE9: 以IE9标准模式渲染页面。IE9中的新功能都可以使用，比如ECMAScript 5、完整的CSS3以及更多HTML5功能。这个文档模式是最高级的模式。

要理解IE8及更高版本的工作原理，必须理解文档模式。

要强制浏览器以某种模式渲染页面，可以使用HTTP头部信息X-UA-Compatible，或通过等价的\<meta>标签来设置：

```
<meta http-equiv="X-UA-Compatible" content="IE=IEVersion">
```

注意，这里IE的版本（IEVersion）有以下一些不同的值，而且这些值并不一定与上述4种文档模式对应。

- Edge：始终以最新的文档模式来渲染页面。忽略文档类型声明。对于IE8，始终保持以IE8标准模式渲染页面。对于IE9，则以IE9标准模式渲染页面。

- EmulateIE9：如果有文档类型声明，则以IE9标准模式渲染页面，否则将文档模式设置为IE5。

- EmulateIE8：如果有文档类型声明，则以IE8标准模式渲染页面，否则将文档模式设置为IE5。

- EmulateIE7：如果有文档类型声明，则以IE7标准模式渲染页面，否则将文档模式设置为IE5。

- 9：强制以IE9标准模式渲染页面，忽略文档类型声明。

- 8：强制以IE8标准模式渲染页面，忽略文档类型声明。

- 7：强制以IE7标准模式渲染页面，忽略文档类型声明。
  
- 5：强制以IE5标准模式渲染页面，忽略文档类型声明。

比如，要想让文档模式像在IE7中一样，可以使用下面这行代码：

```
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
```

如果不打算考虑文档类型声明，而直接使用IE7标准模式，那么可以使用下面这行代码：

```
<meta http-equiv="X-UA-Compatible" content="IE=7">
```

没有规定说必须在页面中设置X-UA-Compatible。

默认情况下，浏览器会通过文档类型声明来确定是使用最佳的可用文档模式，还是使用混杂模式。

### children属性

由于IE9之前的版本与其他浏览器在处理文本节点中的空白符时有差异，因此就出现了children属性。这个属性是HTMLCollection的实例，只包含元素中同样还是元素的子节点。除此之外，children属性与childNodes没有什么区别，即在元素只包含元素子节点时，这两个属性的值相同。

下面是访问children属性的示例代码:

```
var childCount = element.children.length;
var firstChild = element.children[0];
```

支持children属性的浏览器有IE5、Firefox 3.5、Safari 2（但有bug）、Safari 3（完全支持）、Opera 8和Chrome（所有版本）。

IE8及更早版本的children属性中也会包含注释节点，但IE9之后的版本则只返回元素节点。

### contains()方法

在实际开发中，经常需要知道某个节点是不是另一个节点的后代。
IE为此率先引入了contains()方法，以便不通过DOM文档树中查找即可获得这个信息。
调用contains()方法的应该是祖先节点，也就是搜索开始的节点，这个方法接收一个参数，即要检测的后代节点。

如果被检测的节点是后代节点，该方法返回true。否则，返回false。

```
console.log(document.documentElement.contains(document.body)); //"true"
```

这个例子测试了\<body>元素是不是\<html>元素的后代，在格式正确的HTML页面中，以上代码返回true。支持contains()方法的浏览器有IE、Firefox 9+、Safari、Opera和Chrome。

使用DOM Level 3 compareDocumentPosition()也能够确定节点间的关系。支持这个方法的浏览器有IE9+、Firefox、Safari、Opera 9.5+和Chrome。

如前所述，这个方法用于确定两个节点间的关系，返回一个表示该关系的位掩码（bitmask）。
下表列出了这个位掩码的值。

|掩码|节点关系|
|1|无关（给定的节点不在当前文档中）|
|2|居前（给定的节点在DOM树中位于参考节点之前）|
|4|居后（给定的节点在DOM树中位于参考节点之后）|
|8|包含（给定的节点是参考节点的祖先）|
|16|被包含（给定的节点是参考节点的后代）|

为模仿contains()方法，应该关注的是掩码16。
可以对compareDocumentPosition()的结果执行按位与，以确定参考节点是否包含给定的节点。

```
var result = document.documentElement.comapreDocumentPosition(document.body);
alert(!!(result & 16));
```

执行上面的代码后，结果就变成20（表示“居后”的4加上表示“被包含”的16）。对掩码16执行按位操作会返回一个非零数值，而两个逻辑非操作符会将该数值转换成布尔值。

使用一些浏览器及能力检测，就可以写出如下所示的一个通用的contains函数：

```

function contains(refNode, otherNode) {
    if(typeof refNode.contains === 'function' && (!client.engine.webkit || client.engine.webkit >= 522)) {
        return refNode.contains(otherNode);
    }else if(typeof refNode.compareDocumentPosition === 'function') {
        return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
        var node = otherNode.parentNode;
        do {
            if(node === refNode) {
                return true;
            } else {
                node = node.parenttNode;
            }
        } while (node !== null);
        return false;
    }
}
```

这个函数组合使用了三种方法来确定一个节点是不是另一个节点的后代。
函数的第一个参数是参考节点，第二个参数是要检查的节点。
在函数体内，首先检测refNode中是否存在contains()方法（能力检测）。
这一部分代码还检查了当前浏览器的所用的WebKit版本号。
如果方法存在而且不是WebKit(!client.engine.webkit)，则继续执行代码。

否则，如果浏览器是WebKit且至少是Safari3(WebKit版本号为522或更高)，那么也可以继续执行代码。在WebKit版本号小于522的Safari浏览器中，contains()方法不能使用。

接下来检查是否存在compareDocumentPosition()方法，而函数的最后一步则是自otherNode开始向上遍历DOM结构，以递归方式取得parentNode，并检查其是否与refNode相等。
在文档树的顶端，parentNode的值等于null的话，循环就结束。这是针对旧版本Safari的一个后备策略。

### 插入文本

IE原来专有的插入标记的属性innerHTML和outerHTML已经被HTML5纳入规范。

后来新加入文本的属性是innerText和outerText。

1. innerText属性

通过innerText属性可以操作元素中包含的所有文本内容，包括子文档树中的文本。
在通过innerText读取值时，它会按照由浅入深的顺序，将子文档树中的所有文本拼接起来。

在通过innerText写入值时，结果会删除元素的所有子节点，插入包含相应文本值的文本节点。

```
<div id="content">
    <p>This is a <strong>paragraph</strong> with a list following it.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
</div>
```

对于这个例子中的\<div>元素而言，其innerText属性会返回下列字符串:

```
This is a paragraph with a list following it.
Item 1
Item 2
Item 3
```

由于不同浏览器处理空白符的方式不同，因此输出的文本可能会也可能不会包含原始HTML代码中的缩进。

使用innerText属性设置\<div>元素的内容，则只需一行代码：

```
div.innerText = "Hello World";
```

执行这行代码后，页面的HTML代码就会变成如下所示。

```
div.innerText = "Hello & welcome, <b>\"reader\"</b>";
```

运行以上代码之后，会得到如下所示的结果。

```
<div id="content">Hello &amp; welcome, &lt;b&gt;reader&quot;!&lt;/b&gt;<div>
```

设置innerText永远只会生成当前节点的一个子文本节点，而为了确保只生成一个子文本节点，就必须要对文本进行HTML编码。利用这一点，可以通过innerText属性过滤掉HTML标签。方法是将innerText设置为等于innerText，这样就可以去掉所有HTML标签，比如：

```
div.innerText = div.innerText;
```

执行这行代码后，就用原来的文本内容替换了容器元素中的所有内容（包括子节点，因而也就去掉了HTML标签）。

支持innerText属性的浏览器包括IE4+、Safari 3+、Opera 8+和Chrome。
Firefox虽然不支持innerText，但支持作用类似的textContent属性。
textContent是DOM Level 3规定的一个属性，其他支持textContent属性的浏览器还有IE9+、Safari 3+、Opera 10+和Chrome。

为了确保跨浏览器兼容，有必要编写一个类似于下面的函数来检测可以使用哪个属性。

```

function getInnerText(element) {
    return (typeof element.textContent === "function") ? element.textContext: element.innerText;
} 

function setInnerText(element, text) {
    if( typeof element.textContent === "function" ) {
        element.textContent = text;
    } else {
        element.innerTextt = text;
    }
}
```

这两个函数都接收一个元素作为参数，然后检查这个元素是不是有textContent属性。
如果有，那么typeof element.texxtContent 应该是"function"。
如果没有，那么这两个函数就会改为使用innerText。

可以像下面这样调用这两个函数。

```
setInnerText(div, "hello world");
console.log(getInnerText(div)); //"Hello World"
```

使用这两个函数可以确保在不同的浏览器中使用正确的属性。

**innerText与textContent返回的内容并不完全一样。比如，innerText会忽略行内的样式和脚本，而textContent则会像返回其他文本一样返回行内的样式和脚本代码。避免扩浏览器兼容问题的最佳途径，就是从不包含行内样式或行内脚本的DOM子树副本或DOM片段中读取文本。**

2. outerText属性

除了作用范围扩大到了包含调用它的节点之外，outerText与innerText基本上没有多大区别。

在读取文本值时，outerText与innerText的结果完全一样。

但在写模式下，outerText就完全不同了：outerText不只是替换调用它的元素的子节点，而是会替换整个元素（包括子节点）。

```
div.outerText = "Hello World";
```

这行代码实际上相当于如下两行代码：

```
var text = document.createTextNode("Hello World!");
div.parentNode.replaceChild(text, div);
```

本质上，新的文本节点会完全取代调用outerText的元素。
此后，该元素就从文档中被删除，无法访问。

支持outerText属性的浏览器有IE 4+、Safari 3+、Opera 8+和Chrome。
由于这个属性会导致调用它的元素不存在，因此并不常用。

建议尽可能不要使用这个属性。

### 滚动

HTML5在将scrollIntoView()纳入规范后，仍然还有其他几个专有方法可以在不同的浏览器中使用。下面列出的几个方法都是对HTMLElement类型的扩展，因此在所有元素中都可以调用。

- scrollIntoViewIfNeeded(alignCenter): 只在当前元素在视口中不可见的 情况下，才滚动浏览器窗口或容器元素，最终让它可见。如果当前元素在视口中可见，这个方法什么也不做。如果将可选的alignCenter参数设置为true，则表示尽量将元素显示在视口中部（垂直方向）。Safari和Chrome实现了这个方法。

- scrollByLines(lineCount)：将元素的内容滚动指定的行高，lineCount值可以是正值，也可是是负值。Safari和Chrome实现了这个方法。

- scrollByPages(pageCount)：将元素的内容滚动指定的页面高度，具体高度由元素的高度决定。Safari和Chrome实现了这个方法。

**scrollIntoView()和scrollIntoViewIfNeeded()的作用对象是元素的容器，而scrollByLines()和scrollByPages()影响的则是元素本身。**

```
//将页面主体滚动5行
document.body.scrollByLines(5);

//在当前元素不可见的时候，让它进入浏览器的窗口
doocument.images[0].scrollIntoViewIfNeeded();

//将页面主体往回滚动1页
document.body.scrollByPages(-1);
```

由于scrollIntoView()是唯一一个所有浏览器都支持的方法，因此还是这个方法最常用。


## 小结

虽然DOM为与XML文档的交互指定了一系列核心API，但仍然有几个规范对标准的DOM进行了扩展。
这些扩展中有很多是个别浏览器厂商专有的，但后来成为了事实标准，于是其他浏览器也都提供了相同的实现。

-  Selectors API，定义了两个方法，让开发人员能够基于CSS选择符从DOM中取得元素，这两个方法是querySelector()和querySelecotorAll()。

- Element Traveral，为DOM元素定义了额外的属性，让开发人员你能够更方便从一个元素跳到另一个元素。之所以会出现这个扩展，是因为浏览器处理DOM元素间空白符的方式不一样。

- HTML5，为标准的DOM定义了很多扩展功能。其中包括只在innerHTML属性这样的事实标准基础上提供的标准定义，以及为管理焦点、设置字符集、滚动页面而规定的扩展API。


虽然目前DOM扩展的数量还不多，但随着Web技术的发展，相信一定还会涌现更多扩展来。
很多浏览器都在试验专有的扩展，而这些扩展一旦获得认可，就能成为“伪标准”，甚至会被收录到规范的新版本中。