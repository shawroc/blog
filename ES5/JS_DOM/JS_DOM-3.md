# DOM-3

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---


## Element类型

除了Document类型之外，Element类型就要算是Web编程中最常用的类型了。
Element类型用于表现XML或HTML元素，提供了对元素标签名、子节点及特性的访问。
Element节点具有以下特征:

- nodeType的值为1；

- nodeName的值为元素的标签名

- nodeValue的值为null；

- parentNode可能是Document或Element;

- 其子节点可能是Element、Text、Comment、ProcessingInstruction、CDATASection或EntityReference。

要访问元素的标签名，可以使用nodeName属性，也可以使用tagName属性。这两个属性会返回相同的值（使用后者主要是为了清晰起见）。

以下面的元素为例：

```
<div id="myDiv"></div>

//可以像下面这样取得这个元素及其标签名

var div = document.getElementById('myDiv');

console.log(div.tagName); //"DIV"
console.log(div.tagName == div.nodeName); //true
```

这里的元素标签名是div，它拥有一个值为"myDiv"的ID。可是，div.tagName实际上输出的是"DIV"而非"div"。
在HTML中，标签名始终都以全部大写表示；而在XML（有时候也包括XHTML）中，标签名则始终会与源代码中的保持一致。
假如你不确定自己的脚本将会在HTML还是XML文档中执行，最好是在比较之前将标签名转换为相同的大小写形式。

```
if (element.tagName == "div") {
    //不能这么比较，很容易出错
    //在此执行某些操作
}

if (element.tagName.toLowerCase() == "div") {
    //这样最好（适用于任何文档）
    //在此执行某些操作
}
```

这个例子展示了围绕tagName属性的两次比较操作。第一次比较非常容易出错，因为其代码在HTML文档中不管用。第二次比较将标签名转换成了全部小写，是推荐的做法，因为这种做法适用于HTML文档，也使用与XML文档。

**可以在任何浏览器中通过脚本访问Element类型的构造函数及原型，包括IE8及之前版本。在Safari2之前版本和Opera8 之前的版本中，不能访问Element类型的构造函数。**

1. HTML元素

所有HTML元素都由HTMLElement类型展示，不是直接通过这个类型，也是通过它的子类型来表示。
HTMLElement类型直接继承自Element并添加了一些属性。添加的这些属性分别对应与每个HTML元素中都存在的下列标准特性。

- id，元素在文档中的唯一标识符。

- title， 有关元素的附加说明信息，一般通过工具提示条显示出来。

- lang，元素内容的语言代码，很少使用。

- dir，语言的方向，值为"ltr"（left-to-right，从左到右）或"rtl"（right-to-left，从右到左）也很少使用。

- className，与元素的class特性对应，即伪元素指定的CSS类。没有将这个书名命名为class，**是因为class是ECMAScript的保留字。

上述这些属性都可以用来取得或修改相应的特性值。以下面的HTML元素为例：

```
<div id="myDiv" class="bd" title="body text" lang="en" dir="ltr"><div>
```

元素中指定的所有信息，都可以通过下列JavaScript代码取得:

```
var div = document.getElementById("myDiv");

console.log(div.id); //"myDiv"
console.log(div.className);//"bd"
console.log(div.title);//"body text"
console.log(div.lang);//"en"
console.log(div.dir); // "ltr"
```

当然，像下面这样通过为每个属性赋予新的值，也可以修改对应的每个特性:

```
div.id = "someOtherId";
div.className = "ft";
div.title = "some other text";
div.lang = "fr";
div.dir = "rtl";
```

并不是所有属性的修改都会在页面中直观地表现出来。对id或lang的修改掉队用户而言是透明不可见的（假设没有基于它们的值设置的CSS样式），而对title的修改则只会在鼠标移动到这个元素之上时才会显示出来。对dir的修改会在属性被重写的那一刻，立即影响页面中文本的左、右对齐方式。

修改className时，如果新类关联了与此前不同的CSS样式，那么就会立即应用新的样式。

**所有HTML元素都是由HTMLElement或者其更具体的子类型来表示的。**

2. 取得特性

每个元素都有一或多个特性，这些特性的用途是给出相应元素或其内容的附加信息。操作特性的DOM方法主要有三个，分别是getAttribute()、setAttribute()和removeAttribute()。这三个方法可以针对任何特性使用，包括哪些以HTMLElement类型属性的形式定义的特性。

```
var div = document.getElementById("myDiv");

console.log(div.getAttribute("id")); // "myDiv"
console.log(div.getAttribute("class")); //"bd"
console.log(div.getAttribute("title")); //"body text"
console.log(div.getAttribute("lang")); //"en"
console.log(div.getAttribute("dir")); //"ltr"
```

**注意，传递给getAttribute()的特性名与实际的特性名相同。**
因此要想得到class特性，要传入“class”而不是“className”，后者只有在通过对象属性访问特性时才用。如果给定名称的特性不存在，getAttribute()返回null。

通过getAttribute()方法也可以取得自定义特性（即标准HTML语言中没有的特性）的值。

```
<div id="myDiv" my_special_attribute="hello"></div>
```

这个元素包含一个名为my_special_attribute的自定义特性，它的值是“helllo”。可以像取得其他特性一样取得这个值。

```
var value = div.getAttribute("my_special_attribute");
```

**特性的名称是不区分大小写的，即“id”和“ID”代表的都是同一个特性。**

**根据HTML5规范，自定义特性应该加上data-前缀以便验证。**

任何元素的所有特性，也都可以通过DOM元素本身的属性来访问。
当然，HTMLElement也会有5个属性与相应的特性一一对应。

**不过，只有公认的（非自定义的）特性才会以属性的形式添加DOM对象中。**

```
<div id="myDiv" align="left" my_special_attribute="hello!"></div>
```

id和align在HTML中是\<div>的公认特性，因此该元素的DOM对象中也将存在对应的属性。不过自定义属性my_special_attribute在Safari、Opera、Chrome及Firefox中是不存在的。
但IE却会为自定义特性也创建属性。

```
console.log(div.id); //"myDiv"
console.log(div.align); //"left"
```

有两类特殊的特性，它们虽然有对应的属性名，但属性的值与通过getAttribute()返回的值并不相同。
第一类特性是style，用于通过CSS为元素指定样式。
在通过getAttribute()访问时，返回的style特性值是包含的是CSS文本，而通过属性来访问它则会返回一个对象。

由于style属性是用于以编程方式访问元素样式的，因此并没有直接映射到style特性。

第二类与众不同的特性是onclick这样的事件处理程序。
当在元素上使用时，onclick特性中包含的是JavaScript代码，如果通过getAttribute()访问，则会返回相应代码的字符串。
而在访问onclick属性时，则会返回一个JavaScript函数（如果未在元素中指定相应特性，则返回null）。这是因为onclick及其他事件处理程序属性本身就应该被赋予函数值。

由于存在这些差别，在通过JavaScript以编程方式操作DOM时，开发人员经常不使用getAttribute()，而是只使用对象的属性。**只有在取得自定义特性值的情况下，才会使用getAttribute()方法。**


3. 设置特性

与getAttribute()对应的方法是setAttribute()，这个方法接受两个参数：要设置的特性名和值。

如果特性已经存在，setAttribute()会以指定的值替换现有的值。

如果特性不存在，则创建该属性并设置相应的值。

```
div.setAttribute("id", "someOtherId");
div.setAttribute("class", "ft");
div.setAttribute("title", "Some other text");
div.setAttribute("lang","fr");
div.setAttribute("dir","rtl");
```

**通过setAttribute()方法既可以操作HTML特性也可以操作自定义特性。**
**通过这个方法设置的特性名会被统一转换为小写形式，即“ID”最终会变成“id”。**

因为所有特性都是属性，所以直接给属性赋值可以设置特性的值。

```
div.id = "someOtherId";
div.align = "left";
```

不过，像下面这样为DOM元素添加一个自定义的属性，该属性不会自动成为元素的特性。

```
div.mycolor = "red";
console.log(div.getAttribute("mycolor")); //null(IE除外)
```

**在大多数浏览器中，这个属性都不会自动变成元素的特性，因此想通过getAttribute()取得同名特性的值，结果会返回null。**

**可是，自定义属性在IE中会被当做元素的特性，反之亦然。**

最后一个方法是remobveAttribute()，这个方法用于彻底删除元素的特性。调用这个方法不仅会清除特性的值，而且也会从元素中完全删除特性。

```
div.removeAttribute('class');
```

这个方法并不常用，但在序列化DOM元素时，可以通过它来确切地指定要包含哪些特性。

4. attribute属性

**Element类型是使用attribute属性的唯一一个DOM节点类型。**
attributes属性中包含一个NamedNodeMap，与NodeList类似，也是一个“动态”的集合。元素的每一个特性都由一个Attr节点表示，每个节点都保存在NameNodeMap对象中。

NamedNodeMap对象拥有下列方法。

- getNamedItem(name): 返回nodeName属性等于name的节点。

- removeNamedItem(name): 从列表中移除nodeName属性等于name的节点。

- setNamedItem(node): 向列表中添加节点，以节点的nodeName属性为索引。

- item(pos): 返回位于数字pos位置处的节点。

attributes属性中包含一系列节点，每个节点的nodeName就是特性的名称，而节点的nodeValue就是特性的值。要取得元素的id特性，可以使用以下代码。


```
var idValue = element.attributes.getNamedItem('id').nodeValue;
```

使用方括号语法通过特性名称访问节点的简写方式。

```
var id = element.attribute['id'].nodeValue;
```

也可以使用这种语法来设置特性的值，即先取得特性节点，然后再将其nodeValue设置为新值。

```
element.attribute['id'].nodeValue = "someOtherId";
```

通过removeNamedItem()方法与在元素上调用removeAttribute()方法的效果相同——直接删除具有给定名称的特性。

removeNamedItem()返回表示被删除特性的Attr节点。

```
var oldAttr = element.attributes.removeNamedItem("id");
```

最后，setNamedItem()是一个很不常用的方法，通过这个方法可以为元素添加一个新特性，需要为它传入一个特性节点。

```
element.attributes.setNamedItem(newAttr);
```

一般来说，由于attributes的方法不够方法，因此开发人员更多的会使用getAttribute()、removeAttribute()、setAttribute()方法。

不过，如果想要遍历元素的特性，attributes属性倒是可以派上用场。在需要将DOM结构序列化为XML或HTML字符串时，多数都会涉及遍历元素特性。

```
function outputAttributes(element) {
    var pairs = [],
        attrName,
        attrValue;
    for(var i = 0; i < element.attributes.length; i++) {
        attrName = element.attributes[i].nodeName;
        attrValue = element.attributes[i].nodeValue;
        if(element.attributes[i].specified) {
            pairs.push(attrName + '=' + attrValue);
        }
    }
    return pairs.join(' ');
}
```

5. 创建元素

使用document.createElement()方法可以创建新元素。
这个方法只接受一个参数，即要创建元素的标签名。

这个标签名在HTML文档中不区分大小写，而在XML（包括XHTML）文档中红，则是区分大小写。

```
var div = document.createElement('div');
```

在使用createElement()方法创建新元素的同时，也为新元素设置了ownerDocument属性。
还可以操作元素的特性，为它添加更多子节点，以及执行其他操作。

```
div.id = "myNewDiv";
div.className = "box";
```

在新元素上设置这些特性只是给它们赋予了相应的信息。由于新元素尚未被添加到文档树中，因此设置这些特性不会影响浏览器的显示。要把新元素添加到文档树，可以使用appendChild()、insertBefore()或replaceChild()方法。下面的代码会把新创建的元素添加到文档的\<body>元素中。

```
document.body.appendChild(div);
```

一旦将元素添加到文档树中，浏览器就会立即呈现该元素。此后，对这个元素所做的任何修改都会实时反映在浏览器中。

在IE中可以以另一种方式使用createElement()。即为这个方法传入完整的元素标签，也可以包含属性。

```
var div = document.createElement("<div id=\"myNewDiv\"class=\"box\"></div>");
```

6. 元素的子节点

元素可以由任意数目的子节点和后代节点，因此元素可以是其他元素的子节点。元素的childNodes属性中抱哈了它的所有子节点，这些子节点有可能是元素、文本节点、注释或处理命令。

不同浏览器在看待这些节点方面存在显著的不同。

```
<ul id="myList">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

如果是IE来解析代码，那么\<ul>元素会有3个子节点，分别是3个\<li>元素。但如果是在其他浏览器中, \<ul>元素都会有7个元素，包括3个\<li>元素和4个文本节点（表示\<li>元素之间的空白符）。

**如果向下面这样将元素减的空白符删除，那么所有浏览器都会返回相同数目的子节点。**

```
<ul id="myList"><li>item1</li><li>item2</li><li>item3</li></ul>
```

对于这段代码，\<ul>元素在任何浏览器中都会包含3个子节点。如果需要通过childNodes属性遍历子节点，那么一定不要忘记浏览器间的这一差别。

这意味着在执行某项操作以前，通常都要先检查一下nodeType属性。

```
for(var i = 0; i < element.attributes.length; i++) {
    if(element.childNodes[i].nodeType == 1) {
        // do something
    }
}
```

这个例子会循环遍历特定元素的每一个子节点，然后只在子节点的nodeType等于1（表示是元素节点）的情况下，才会执行某些操作。

如果想通过某个特定的标签名取得子节点或后代节点该怎么办呢？
实际上，元素也支持getElementByTagName()方法。在通过元素调用这个方法时，除了搜索起点是当前元素之外，其他方面都跟通过document调用这个方法相同，因此结果只会返回当前元素的后代。

例如，要想取得前面\<ul>元素中包含的所有\<li>元素。

```
var ul =  document.getElementById('myList');
var items = ul.getElementsByTagName('li');
```

**要注意的是，这里\<ul>的后代中指包含直接子元素。不过如果它包含更多层次的后代元素，那么各个层次中包含的\<li>元素也都会返回。**