# DOM-4

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## Text类型

文本节点由Text类型表示，包含的是可以照字面解释的纯文本内容。

纯文本中可以包含转义后的HTML字符，但不能包含HTML代码。

Text节点具有以下特征：

- nodeType的值为3；
- nodeName的值为"#text"；
- nodeValue的值为节点所包含的文本；
- parentNode是一个Element；
- 不支持（没有）子节点。

可以通过nodeValue属性或data属性访问Text节点中包含的文本，这两个属性中包含的值相同。
对nodeValue的修改也会通过data反映出来，反之亦然。

使用下列方法可以操作节点中的文本。

- appendData(text)：将text添加到节点的末尾。
- deleteData(offset, count): 从offset指定的位置开始删除count个字符。
- insertData(offset, text): 在offset指定的位置插入text。
- replaceData(offset, count, text): 用text替换从offset指定的位置开始到offset+count为止处的文本。
- splitText(offset)：从offset指定的位置将当前文本节点分成两个文本节点。
- substringData(offset, count): 提取从offset指定的位置开始到offset+count为止出的字符串。

除了这些方法之外，文本节点还有一个length属性，保存着节点中字符串的数目。
而且，nodeValue.length和data.length中也保存着同样的值。

**在默认情况下，每个可以包含内容的元素最多只能有一个文本节点，而且必须确实有内容存在。**

```
<!-- 没有内容，也就没有文本节点 -->
<div></div>

<!-- 有空格，因而有一个文本节点 -->
<div> </div>

<!-- 有内容，因而有一个文本节点 -->
<div>Hellow World!</div>
```

上面代码给出的第一个\<div>元素没有内容，因此也就不存在文本节点。开始与结束标签之间只要存在内容，就会创建一个文本节点。

因此，第二个\<div>虽然只包含一个空格，但仍然有一个文本子节点；文本节点的nodeValue值是一个空格。

第三个\<div>也有一个文本节点，其nodeValue的值为"Hello World!"。

可以使用以下代码来访问这些文本子节点。

```
var textNode = div.firstChild; //或div.childNodes[0]
```

在取得了文本节点的引用后，就可以像下面这样来修改它了。

```
div.firstChild.nodeValue = "Some other message";
```

如果这个文本节点存在于文档树中，那么修改文本节点的结果就会立即得到反映。
另外，在修改文本节点时还要注意，此时的字符串会经过HTML（或XML，取决于文档类型）编码。

换句话说，小于号、大于号或引号都会像下面的例子一样被转义。

```
//输出结果是"Some &lt;strong&gt;other&lt;/strog&gt; message"
div.firstChild.nodeValue = "Some <strong>other</strong> message";
```

应该说，这是在向DOM文档中插入文本之前，先对其进行HTML编码的一种有效方法。

1. 创建文本节点

可以使用document.createTextNode()创建新文本节点，这个方法接受一个参数——要插入节点中的文本。与设置已有文本节点的值一样，作为参数的文本也将按照HTML或XML的格式进行编码。

```
var textNode =  document.createTextNode("<strong>hello</strong> world!");
```

在创建新文本节点的同时，也会为其设置ownerDocument属性。
不过，除非把新节点添加到文档书中已经存在的节点中，否则我们不会再浏览器窗口中看到新节点。

下面的代买会创建一个\<div>元素并向其中添加一条信息。

```
var element = document.createElement('div');

element.className = "message";

var textNode = document.createTextNode("Hello World");
element.appendChild(textNode);

document.body.appendChild(element);
```

这个例子创建了一个新\<div>元素并为它指定了值为"message"的class特性。然后，又创建了一个文本节点，并将其添加到前面创建的元素中。最后一步，就是将这个元素添加到文档的\<body>元素中，这样就可以在浏览器中看到新创建的元素和文本节点了。

一般情况下，每个元素只有一个文本子节点。不过，在某些情况下也可能包含多个文本子节点。

```
var element = document.createElement("div");
element.className = "message";

var textNode = document.createTextNode("Hello World!");
element.appendChild(textNode);

var anotherTextNode = document.createTextNode("Yeap");
element.appendChild(anotherTextNode);

document.appendChild(element);
```

**如果两个文本节点是相邻的同胞节点，那么这两个节点中的文本就会连起来显示，中间不会有空格。**

2. 规范化文本节点
   
DOM文档中存在相邻的同胞文本节点很容器导致混乱，因为分不清哪个文本节点表示哪个字符串。
另外，DOM文档中出现相邻文本节点的情况也不在少数，于是就催生了一个能够将相邻文本节点合并的方法。

这个方法是由Node类型定义的（因而在所有节点类型中都存在），名叫normalize()。

**如果在一个包含两个或多个文本节点的父元素上调用normalize()方法，则会将所有文本节点合并成一个节点，结果节点的nodeValue等于将合并每个文本节点的nodeValue值拼接起来的值。**

```
var element = document.createElement("div");
element.className = "message";

var textNode = document.createTextNode("Hello World");
element.appendChild(textNode);

var anotherTextNode = document.createTextNode("How are you?");
element.appendChild(anotherTextNode);

console.log(element); 
//<div class="message">
//Hello World
//How are you?
//</div>

document.body.appendChild(element);

console.log(element.childNodes.length); //2

element.normalize();

console.log(element.childNodes.length); //1
console.log(element.firstChild.nodeValue); //"Hello WorldHow are you?"
```

**浏览器在解析文档时永远不会创建相邻的文本节点。**
这种情况只会作为执行DOM操作的结果出现。

3. 分割文本节点

Text类型提供了一个作用与normalize()相反的方法: splitText()。这个方法会将一个文本节点分成两个文本节点，即按照指定的位置分割nodeValue值。

原来的文本节点将包含从开始到指定位置之前的内容，新文本节点将包含剩下的文本。

这个方法会返回一个新文本节点，该节点与原节点的parentNode相同。

```
var element = document.createElement("div");
element.className = "message";

var textNode = document.createTextNode("Hello World!");
element.appendChild(textNode);

document.body.appendChild(element);

var newNode = element.firstChild.splitText(5);

console.log(element.firstChild.nodeValue); //"Hello"
console.log(newNode.nodeValue); //" World!"

console.log(element.childNodes.length); //2
```

在这个例子中，包含"Hello World!"的文本节点被分割为两个文本节点，从位置5开始。位置5是"Hello"和"world"之间的空格，因此原来的文本节点将包含字符串"Hello"，而新文本节点将包含文本"world!"（包含空格）。

分割文本节点是从文本节点中提取数据的一种常用DOM解析技术。

## Comment类型

注释在DOM中是通过Comment类型表示的。Comment节点具有下列特征：

- nodeType的值为8；
- nodeName的值为"#comment"；
- nodeValue的值是注释的内容；
- parentNode可能是Document或Element；
- 不支持（没有）子节点

Comment类型与Text类型继承自相同的基类，因此它拥有除splitText()之外的所有字符串操作方法。与Text类型相似，也可以通过nodeValue或data属性来取得注释的内容。

注释节点可以通过其父节点来访问。

```
<div id="myDiv"><!-- A Comment --></div>
```

在此，注释节点是\<div>元素的一个子节点，因此可以通过下面的代码来访问它。

```
var div = document.getElementById("myDiv");
var comment = div.firstChild;

console.log(comment.data); //"A comment"
```

**另外，使用document.createComment()并为其传递注释文本也可以创建注释节点，如下面例子所示。**

```
var comment = document.createComment("A commment ");
```

显然，开发人员很少会创建和访问注释节点，因为注释节点对算法鲜有影响。
此外，浏览器也不会识别位于\</html>标签后面的注释。

**如果要访问注释节点，一定要保证它们是\<html>元素的后代（即位于\<html>和\</html>之间。）**

## CDATASection类型

CDATASection类型只针对基于XML的文档，表示的是CDATA区域。与Comment类似，CDATASection类型继承自Text类型，因此拥有除splitText()之外的所有字符串操作方法，CDATASection节点具有下列特征:

- nodeType的值为4；
- nodeName的值为"#cdata-section"；
- nodeValue的值是CDATA区域中的内容；
- parentNode可能是Document或Element;
- 不支持(没有)子节点

CDATA区域只会出现在XML文档中，因此多数浏览器都会把CDATA区域错误地解析为Commment或Element。

```
<div id="myDiv"><![CDATA[This is some content.]]></div>
```

这个例子中的\<div>元素应该包含一个CDATASection节点。但是，四大主流浏览器无一能够解析它。即使对于有效的XHTML页面，浏览器也没有正确地支持嵌入的CDATA区域。

在真正的XML文档中，可以使用document.createCDATASection()来创建CDATA区域。只需为其传入节点的内容即可。

## DocumentType类型

DocumentType类型在Web浏览器中并不常用，仅有Firefox、Safari、Chrome和Opera支持它。

DocumentType包含着与文档的doctype有关的所有信息，它具有下列特征:

- nodeType的值为10；
- nodeName的值为doctype的名称；
- nodeValue的值为null；
- parentNode是Document；
- 不支持（没有）子节点；

在DOM1级中，DocumentType对象不能动态创建，而只能通过解析文档代码的方式来创建。
支持它的浏览器会把DocumentType对象保存在document.doctype中。

DOM1级描述了DocumentType对象的3个属性：name、entities和notations。

其中，那么表示文档类型的名称；

entities是由文档类型描述的实体的namedNodeMap对象；

notations是由文档描述的符号的NamedNodeMap对象。

通常，浏览器中的文档使用的都是HTML或XHTML文档类型，因而entities和notations都是空列表(列表中的项都来自行内文档类型声明)。

**但不管怎样，只有name属性是有用的。**

这个属性中保存点 是文档类型的名称，也就是出现在\<!DOCTYPE 之后的文本>

下面以严格型HTML4.01的文档类型声明为例:

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

```

DocumentType的name属性中保存的就是"HTML":

```
console.log(document.doctype.name); 
//或document.doctype.nodeName
```

IE及更早版本不支持DocumentType，因此document.doctype的值始终都等于null。IE浏览器会把文档类型声明错误地解释为注释，并且为它创建一个注释节点。IE9会给document.doctype赋正确的对象，但仍然不支持访问DocumentType类型。

## DocumentFragment类型

在所有节点类型中，只有DocumentFragment 在文档中没有对应的标记。
DOM规定文档片段(document fragment)是一种轻量级的文档，可以包含和控制节点，但不会像完整的文档那样占用额外的资源。

DocumentFragment节点具有下列特征：

- nodeType的值为11；
- nodeName的值为"#document-fragment"；
- nodeValue的值为null；
- parentNode的值为null；
- 子节点可以是Element、ProcessingInstruction、Comment、Text、CDATASection或EntityReference。

**虽然不能把文档片段直接添加到文档中，但可以将它作为一个“仓库”来使用，即可以在里面保存将来可能会添加到文档中的节点。**

要创建文档片段，可以使用document.createDocumentFragment()方法，如下所示：

```
var fragment = document.createDocumentFragment();
```

文档片段继承了Node的所有方法，通常用于执行哪些针对文档的DOM操作。

**如果将文档中的节点添加到文档片段中，就会从文档树中移除该节点，也不会从浏览器中再看到该节点。添加到文档片段中的新节点同样也不属于文档树。**

可以通过appendChild()或insertBefore将文档片段中内容添加到文档中。

在将文档片段作为参数传递给这两个方法时，实际上只会将文档片段的所有子节点添加到相应位置上；文档片段本身永远不会成为文档树的一部分。

```
<ul id="myList></ul>
```

假设我们想为这个\<ul>元素添加3个列表项。
如果逐个地添加列表项，将会导致浏览器反复渲染（呈现）新信息。

**为避免这个问题，可以像下面这样使用一个文档片段来保存创建的列表项，然后再一次性将它们添加到文档中。**

```
var fragment = document.createDocumentFragment();
var ul = document.getElementById("myList");
var li = null;

for(var i=0; i < 3; i++) {
    li = document.createElement('li');
    li.appendChild(document.createTextNode("Item "+ (i+1)));
    fragment.appendChild(li);
}

ul.appendChild(fragment);
```

在这个例子中，我们先创建一个文档片段并取得了对\<ul>元素的引用。
然后，通过for循环创建3个列表项，并通过文本表示它们的顺序。

为此，需要分别创建\<li>元素、创建文本节点，再把文本节点添加到\<li>元素。
接着使用appendChild()将\<li>元素添加到文档片段中。

循环结束后，再调用appendChild()并传入文档片段，将所有列表项添加到\<ul>元素中。

此时，文档片段的所有子节点被删除被转移到了\<ul>元素中。

## Attr类型

元素的特性在DOM中以Attr类型来表示。
在所有浏览器中(包括IE8)，都可以访问Attr类型的构造函数和原型。
从技术角度上讲，特性就是存在于元素的attributes属性中的节点。
特性节点具有下列特征：

- nodeType的值为2；
- nodeName的值是特性的名称；
- nodeValue的值是特性的值；
- parentNode的值为null；
- 在HTML中不支持（没有）子节点；
- 在XML中子节点可以是Text或EntityReference；

尽管他们也是节点，**但特性却不认为是DOM文档树的一部分。**

开发人员最常使用的是getAttribute()、setAttribute()和removeAttribute()方法，很少直接引用特性节点。

Attr对象有3个属性：name、value和specified。

其中，name是特性名称（与nodeName的值相同），value是特性的值（与nodeValue的值相同），而specified是一个布尔值，用以区别特性是在代码中指定的，还是默认的。

```
var attr = document.createAttribute("align");
attr.value = "left";
element.setAttributeNode(attr);

console.log(element.attributes['align'].value); //"left"
console.log(element.getAttributeNode("align").value); //"left"
console.log(element.getAttribute("align")); //"left"
```

这个例子创建了一个新的特性节点。

由于在调用createAttribute()时已经为name属性赋了值，所以后面就不必给它赋值了。
之后，又把value属性的值设置为"left"。

为了将新创建的特性添加到元素中，必须使用元素的setAttributeNode()方法。

添加特性之后，可以通过下列任何方式访问该特性：

attributes属性、getAttributeNode()方法以及getAttribute()方法。

其中，attributes和getAttributeNode()都会返回对应特性的Attr节点，而getAttribute()则只会返回特性的值。

**不建议直接访问特性节点。实际上，使用getAttribute()、setAttribute()和removeAttribute()方法远比操作特性节点更为方便。**