# JS_DOM Level 2 and Level 3 - 1

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

DOM1级主要定义的是HTML和XML文档的底层结构。
DOM2 和 DOM3级则在这个结构的基础上引入了更多的交互能力，也支持了更高级的XML特性。

为此，DOM2 和 DOM3 级分为许多模块（模块之间具有某种关联），分别描述了DOM的某个非常具体的子集。

这些模块如下：

- DOM2级核心（DOM Level 2 Core）：在1级核心基础上构建，为节点添加了更多方法和属性。

- DOM2级视图（DOM Level 2 Views）：为文档定义了基于样式信息的不同视图。

- DOM2级事件（DOM Level 2 Events）：说明了如何使用事件与DOM文档交互。

- DOM2级样式（DOM Level 2 Style)：定义了如何以编程方式来访问和改变CSS样式信息。

- DOM2级遍历和范围（DOM Level 2 Traversal and Range)：引入了遍历DOM文档和选择其特定部分的新接口。

- DOM2级HTML（DOM Level 2 HTML): 在1级HTML基础上构建，添加了更多属性、方法和新接口。

## DOM变化

DOM2级和3级的目的在于扩展DOM API，以满足操作XML的所有需求，同时提供更好的错误处理及特性检测能力。

**从某种意义上讲，实现这一目的的很大程度意味着对命名空间的支持。**

DOM2级核心没有引入新类型，它只是在DOM1级的基础上通过增加新方法和新属性来增强既有类型。

DOM3级核心，同样增强了既有类型，但也引入了一些新类型。

类似地，“DOM2级视图”和“DOM2级HTML”模块也增强了DOM接口。提供了新的属性和方法。

可以通过下列代码来确定浏览器是否支持这些DOM模块。

```
var supportsDOM2Core = document.implementation.hasFeature("Core", "2.0");
var supportsDOM3Core = document.implementation.hasFeature("Core", "3.0");
var supportsDOM2HTML = document.implementation.hasFeature("HTML","2.0");
var supportsDOM3HTML = document.implementation.hasFeature("HTML", "3.0");
var supportsDOM2Views = document.implementation.hasFeature("Views", "2.0");
```

### 针对XML命名空间的变化

有了XML命名空间，不同XML文档的元素就可以混合在一起，共同构成格式良好的文档，而不用担心命名冲突。

从技术上说，HTML不支持XML命名空间，但XHTML支持XML命名空间，因此，本节给出的都是XHTML的示例。

命名空间要使用xmlns特性来指定。XHTML的命名空间是http://www.w3.org/1999/xhtml，在任何格式良好的XHTML页面中，都应该将其包含在\<html>元素中。

```
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Example XHTML page</title>
    </head>
    <body>
        Hello World!
    </body>
</html>
```

对这个例子而言，其中的所有元素默认都被视为XHTML命名空间中的元素。

要想明确地为XML命名空间创建前缀，可以使用xmlns后跟冒号，再后跟前缀。

```
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <xhtml:head>
        <xhtml:title>Example XHTML page</xhtml:title>
    </xhtml:head>
    <xhtml:body>
        Hello World!
    </xhtml:body>
</xhtml:html>
```

这里为XHTML的命名空间定义了一个名为xhtml的前缀，并要求所有XHTML元素都以该前缀开头。
有时候为了避免不同语言减的冲突，也需要使用命名空间来限定特性。

```
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <xhtml:head>
        <xhtml:title>Example XHTML page</xhtml:title>
    </xhtml:head>
    <xhtml:body xhtml:class="home">
        Hello World!
    </xhtml:body>
</xhtml: html>
```

这个例子中的特性class带有一个xhtml前缀。
在只基于一种语言编码XML文档的情况系啊，命名空间实际也没有什么用。

**不过，在混合使用两个语言的情况下，命名空间的用处就非常大了。**

下面这个混合XHTML和SVG语言的文档：

```
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Example XHTML page</title>
    </head>
    <body>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="widht:100%; height:100%">
            <rect x="0" y="0" width="100" height="100" style="fill:red">
        </svg>
    </body>
</html>
```

在这个例子中，通过设置命名空间，将\<svg>标识为了与包含文档无关的元素。
此时，\<svg>元素的所有子元素，以及这些元素的所有特性，都被认为属于http://www.w3.org/2000/svg命名空间。

即使这个文档从技术上说是一个XHTML文档，但因为有了命名空间，其中的SVG代码也仍然是有效的。

对于类似这样的文档来说，最有意思的事发生在调用方法操作文档节点的情况下。
例如，在创建一个元素时，这个元素属于哪个命名空间呢？
在查询一个特殊标签名时，应该将结果包含在哪个命名空间中呢？

"DOM2级核心"通过为大多数DOM1级方法提供特定于命名空间的版本解决了这个问题。

1. Node类型的变化

在DOM2级中，Node类型包含下列特定于命名空间的属性。

- localName: 不带命名空间前缀的节点名称。

- nameSpaceURI:命名空间URI或者（在未指定的情况下是 ）null。

- prefix: 命名空间前缀或者（在未指定的情况下是）null。

当节点使用了命名空间前缀时，其nodeName等于 prefix + ':' + localName。

以下面的文档为例：

```
<html xmlns="http://www.w3.org/1999/xhtml>
    <head>
        <title>Example XHTML page</title>
    </head>
    <body>
        <s:svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="width:100%; height:100%">
        <s:rect x="0" y="0" width="100" height="100" style="fill:red">
        </s:svg>
    </body>
</html>
```

对于\<html>元素来说，它的localName和tagName是"html"，nameSpaceURI是"http://www.w3.org/1999/xhtml"，而prefix是null。

对于\<s:svg>元素而言，它的localName是"svg"，tagName是"s:svg"，namespaceURI是"http://www.w3.org/2000/svg"，而prefix是"s"。

DOM3级在此基础上更近一步，又引入了下列与命名空间有关的方法。

- isDefaultNamespace(namespaceURI)：在指定的namespaceURI是当前节点的默认命名空间的情况下返回true。

- lookupNamespaceURI(namespaceURI):返回给定prefix的命名空间。

- lookupPrefix(namespaceURI)： 返回给定namespaceURI的前缀。

针对前面的例子，可以执行下列代码：

```
console.log(document.body.isDefaultNamespace("http://www.w3.org/1999/xhtml")); //true

console.log(svg.lookupPrefix("s")); //"s"
console.log(svg.lookupNamespaceURI("s")); //"http://www.w3.org/1999/xhtml"
```

在取得一个节点，但不知道该节点与文档其他元素之间关系的情况下，这些方法都是很有用的。

2. Document类型的变化

DOM2级中的Document类型也发生了变化，包含了下列与命名空间有关的方法。

- createElementNS(namespaceURI, tagname): 使用给定的tagname创建一个属于命名空间namespaceURI的新元素。

- createAttributeNS(namespaceURI, attributeName): 使用给定的attributeName创建换一个属于命名空间namespaceURI的新特性。

- getElementsByTagNameNS(namespaceURI, tagName): 犯规属于命名空间namespaceURI的tagName的NodeList。

使用这些方法时需要传入表示命名空间的URI（而不是命名空间前缀）。

```
//创建一个新的SVG元素
var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");

//创建一个属于某个命名空间的新特性
var att = document.createAttributeNS("http://www.somewhere.com", "random");

//取得所有XHTML元素
var element = document.getElementsByTagNameNs("http://www.w3.org/1999/xhtml, "*");
```

只有在文档中存在两个或多个命名空间时，这些与命名空间有关的方法才是必需的。

3. Element类型的变化

“DOM2级核心”中有关Element的变化，主要涉及操作特性。

- getAttributeNS(namespaceURI, localName): 取得属于命名空间namespaceURI且名为localName的特性。

- getAttributeNodeNS(namespaceURI, localName): 取得属于命名空间namespaceURI且名为localName的特性节点。

- getElementsByTagNameNS(namespaceURI, tagName): 返回属于命名空间namespaceURI的tagName元素的NodeList。

- hasAttributeNS(namespaceURI, localName): 确定当前元素是否有一个名为localName的特性，而且该特性的命名空间是namespaceURI。注意，"DOM2级核心"也增加了一个hasAttribute()方法，用于不考虑命名空间的情况。

- removeAttributeNS（namespaceURI, localName)：删除属于命名空间namespaceURI且名为localName的特性。

- setAttributeNS(namespaceURI, qualifiedName, value): 设置属于命名空间namespaceURI且名为qualifiedName的特性的值为value。

- setAttributeNodeNS(attNode):设置属于命名空间namespaceURI的特性节点。

除了第一个参数之外，这些方法与DOM1级中相关方法的作用相同；第一个参数始终都是一个命名空间URI。

4. NamedNodeMap

NamedNodeMap类型也新增了下列与命名空间有关的方法。
由于特定是通过NamesNodeMap表示的，因此这些方法多数情况下只针对特性使用。

- getNamedItemNS(namespaceURI, localName): 取得属于命名空间namespaceURI 且名为localName的项。

- removeNamedItemNS(namespaceURI, localName): 移除属于命名空间namespaceURI且名为localName的项。

- setNameItemNS(node): 添加node，这个节点已经事先指定了命名空间信息。

由于一般都是通过元素访问特性，所以这些方法很少使用。


### 其他方面的变化

DOM的其他部分在"DOM2级核心"中也发生了一些变化。
这些变化与XML命名空间无关，而是更倾向于确保API的可靠性及完整性。

1. DocumentType类型的变化

DocumentType类型新增了3个属性：publicId、systemId和internalSubset。其中，前两个属性表示的是文档类型声明中的两个信息段，这两个信息段在DOM1级中是没有办法访问到的。
以下面的HTML文档类型声明为例。

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

对于这个文档类型声明而言，publicId是"-//W3C//DTD HTML 4.01//EN"， 而systemId是"http://www.w3.org/TR/html5/strict/dtd"。

在支持DOM2级的浏览器中，可以运行下列代码。

```
console.log(document.doctype.publicId);
console.log(document.doctype.systemId);
```

实际上，很少需要在网页中访问此类信息。
最后一个属性internalSubset，用于访问包含在文档类型声明中的额外定义。

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml11-strict.dtd" [<!ELEMENT name (#PCDATA)>]>
```

访问document.doctype.internalSubset将得到"<!ELEMENT name (#PCDATA)>"。

这种内部子集(internal subset)在HTML中极少用到，在XML中可能会更常见一些。

2. Document类型的变化

Document类型的变化中唯一与命名空间无关的方法是importNode()。
这个方法的用途是从一个文档中取得一个节点，然后将其导入到另一个文档，使其成为这个文档结构的一部分。

需要注意的是，每个节点都有ownerDocument属性，表示所属的文档。如果调用appendChild()时传入的节点属于不同的文档(ownerDocument属性的值不一样)，则会导致错误。

但在调用importNode()时传入不同文档的节点则会返回一个新节点，这个新节点的所有权归当前文档所有。

说起来，importNode()方法与Element的cloneNode()方法非常相似，它接受两个参数：

要复制的节点和一个表示是否复制子节点的布尔值。返回的结果是原来节点的副本，但能够在当前文档中使用。

```
var newNode = document.importNode(oldNode, true); //导入节点及其所有子节点
document.body.appendChild(newNode);
```

这个方法在HTML文档中并不常用，在XML文档中用得比较多。

"DOM2级视图"模块添加了一个名为"defaultView"的属性，其中保存着一个指针，指向拥有给定文档的窗口（或框架）。

除此之外，“视图”规范滨南更没有提供什么时候其他视图可用的信息，因而这是唯一一个新增的属性。除IE之外的所有浏览器都支持defaultView属性。

在IE中有一个等价的属性名叫parentWindow（Opera也支持这个属性）。因此，要确定文档的归属窗口，可以使用以下代码。

```
var parentWindow =  document.defaultView || document.parentWindow;
```

除了上述一个方法和一个属性之外，"DOM2级核心"还为document.implementation对象规定了两个新方法：createDocumentType()和createDocument()。

前者用于创建换一个新的DocumentTyoe节点，接收3个参数：针对文档中元素的namespaceURI、文档元素的标签名、新文档的文档类型。

```
var doc = document.implementation.createDocument("", "root", null);
```

这行代码会创建一个没有命名空间的新文档，文档元素为\<root>，而且没有指定文档类型，要想创建一个XHTML文档，可以使用以下代码。

```
var doctype = docuemnt.implementation.createDocumentType("html", "-//W3C//DTD XHTML 1.0 Strict//EN", "http://www.w3.org/TR/xhtml/DTD/xhtml-strict.dtd");

var doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", doctype);
```

这样，就创建了一个带有适当命名空间和文档类型的新XHTML文档。
不过，新文档当前只有文档元素\<html>，剩下的所有元素都需要继续添加。

