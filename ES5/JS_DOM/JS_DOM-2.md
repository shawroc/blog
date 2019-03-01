# DOM-2

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

JavaScript通过Document类型表示文档。在浏览器中，document对象是HTMLDocument（继承自Document类型）的一个实例，表示整个HTML页面。而且，document对象是window对象的一个属性，因此可以将其作为全局对象来访问。

Document节点具有下列特征：

- nodeType的值为9；
- nodeName的值为"#document";
- nodeValue的值为null；
- parentNode的值为null；
- ownerDocument的值为null；
- 其子节点可能是一个DocumentType(最多一个)、Element(最多一个)、ProcessingInstruction或Comment。

Document类型可以表示HTML页面或其他基于XML的文档。不过最常见的应用还是作为HTMLDocument实例的document对象。
通过这个文档对象，不仅可以取得与页面有关的信息，而且哈能操作页面的外观及底层结构。

1. 文档的子节点

虽然DOM标准规定Document节点的子节点可以是DocumentType、Element、ProcessingInstruction或Comment，但还有两个内置的访问其子元素的快捷方式。

**第一个就是documentElement属性，该属性始终指向HTML页面的\<html>元素。**

**另一个就是通过childNodes列表访问文档元素，但通过documentElement属性则能更快捷、更直接地访问该元素。**

```
<html>
    <body>
    </body>
</html>
```

这个页面在经过浏览器解析后，其文档中只包含一个子节点，即\<html>元素。可以通过documentElement来访问这个元素。

```
var html = document.documentElement; //取得对<html>的引用
document.childNodes[0]; //返回值为<!doctype html>
document.firstChild; //返回值为<!doctype html>
```

作为HTMLDocument的实例，document对象还有一个body属性，直接指向\<body>元素。
因为开发人员经常要使用这个元素，所以document.body在JavaScript代码中出现的频率非常高。

```
var body = document.body; //取得对<body>的引用
```

**所有浏览器都支持document.documentElement和document.body属性。**

Document另一个可能的子节点是DocumentType。通常将\<!DOCTYPE>标签看成一个与文档其他部分不同的实体，可以通过doctype属性（在浏览器中是document.doctype）来访问它的信息。

浏览器对document.doctype的支持差别很大，可以给如下总结：

- IE8及之前版本：如果存在文档类型声明，会将其错误地解释为一个注释并把它当做Comment节点，而document.doctype的值始终为null。

- IE9+及Firefox：如果存在文档类型声明，则将其作为文档的第一个子节点。document.doctype是一个DocumentType节点，也可以通过document.firstChild或document.childNodes[0]访问同一个节点。

由于浏览器对document.doctype的支持不一致，因此这个属性的用处很有限。

从技术上说，出现在\<html>元素外部的注释应该算是文档的子节点。然而，不同的浏览器在是否解析这些注释以及能够正确处理它们等方面，存在很大差异。

```
<!--第一条注释-->
<html>
    <bdoy>
    </body>
</html>
<!--第二条注释-->
```

看起来这个页面应该由3个子节点：注释、\<html>元素、注释。从逻辑上讲，我们会认为document.childNodes中应该包含与这3节点对应的3项。但是，现实中的浏览器在处理位于\<html>外部的注释方面存在巨大差异。

- IE8及之前版本、Safari 3.1及更高版本、Opera和Chrome只为第一条注释创建节点，不为第二条注释创建节点。结果，第一条注释就会成为document.childNodes的第一个子节点。

- IE9及更高版本会将第一条注释创建为document.childNodes的一个注释节点，也会将第二条注释创建为document.childNodes中的注释子节点。

- Firefox以及Safari 3.1之前的版本会完全忽略这两条注释。

多数情况下，我们都用不着再document对象上调用appendChild()、removeChild()和replaceChild()方法，因为文档类型（如果存在的话）是只读的，而且它只能有一个元素子节点（该节点通常早就已经存在了）。

2. 文档信息

作为HTMLDocument的一个实例，document对象还有一些标准的Document对象没有的属性。
**这些属性提供了document对象所表现的网页的一些信息。**

其中第一个属性就是title，包含着\<title>元素中的文本——显示在浏览器窗口的标题栏或标签页。
通过这个属性可以取得当前页面的标题，也可以修改当前页面的标题并反映在浏览器的标题栏中能够。修改title属性的值会改变\<title>元素。

```
//取得文档标题
var originalTitle = document.title;

//设置文档标题
document.title = "New page title";
```

下面的3个属性都与对网页的请求有关，它们是URL、domain和referrer。

URL属性中包含页面完整的URL（即地址栏中显示的URL）。

domain属性只包含页面的域名。

而referrer属性中则保存着链接到当前页面的那个页面的URL。

**在没有来源页面的情况下，referrer属性中可能会包含空字符串。**

所有这些信息都存在于请求的HTTP头部，只不过是通过这些属性让我们能够在JavaScript中访问它们而已。

```
//取得完整的URL
var url = document.URL;

//取得域名
var domain = document.domain;

//取得来源页面的URL
var referrer = document.referrer;
```

URL与domain属性是相互关联的。例如：如果document.URL等于http://www.worx.com/xxxxx，那么document.domain就等于www.worx.com。

**在这3个属性中，只有domain是可以设置的。**
但由于安全方面的限制，也并非可以给domain设置任何值。
如果URL中包含一个子域名，例如：p2p.worx.com，那么就只能将domain设置为"worx.com"(在URL中包含"www"，如www.worx.com，也是如此)。

**不能将这个属性设置为URL中不包含的域。**

```
//假设页面来自p2p.worx.con域

document.domain =  'worx.com'; //成功
document.domain = 'xxxxx.net'; //出错

```


所谓的降域实现跨域
**当页面中包含来自其他子域的框架或内嵌框架时，能够设置document.domain就非常方便了。**
处于跨域安全限制，来自不同子域的页面无法通过JavaScript通信。

而通过将每个页面的document.domain设置为相同的值，这些页面就可以互相访问对方包含的JavaScript对象了。

例如：假设有一个页面加载自www.worx.com，其中包含一个内嵌框架，框架内的页面加载自p2p.worx.com，由于document.domain字符串不一样，内外两个页面之间无法相互访问对方的JavaScript对象。如果将这两个页面的document.domain值都设置为"worx.com"。它们之间就可以通信了。

**浏览器对domain属性还有一个限制，即如果域名一开始是“松散的”loose，那么就不能将它再设置为“紧绷的”tight。**

也就是说，在将document.domain设置为"worx.con"之后，就不能再将其设置回“p2p.worx.com”，否则将会导致错误。

```
//假设页面来自于p2p.worx.com

document.domain = 'worx.com'; //成功， 松散的

document.domain = 'p2p.worx.com'; //失败，紧绷
```

**所有刘浏览器中都存在这个限制，但IE8是实现这一限制的最早的版本。**

3. 查找元素

**说到最常见的DOM应用，恐怕就要数取得特定的某个或某组元素的引用，然后再执行一些操作了。**

取得元素的操作可以使用document对象的几个方法来完成。

其中, Document类型为此提供了两个方法：getElementById()和getElementByTagName()。

第一个方法，getElementById()，接收一个参数：要取得的元素的ID。如果找到相应的元素则返回该元素，如果不存在带有相应ID的元素，则返回null。**注意，这里的ID必须与页面中元素的特性（attribute）严格匹配，包括大小写。

```
<div id="myDiv"></div>
```

可以使用下面的代码取得这个元素：

```
var div = document.getElementById('myDiv');
```

如果页面中多个元素的ID值相同，getElementById()只返回文档中第一次出现的元素。

另外一个常用于取得元素引用的方法是getElementsByTagName()。这个方法接受一个参数，即要取得元素的标签名，而返回的是包含零或多个元素的NodeList。

在HTML文档中，这个方法会返回换一个HTMLCollection对象，作为一个"动态"集合，该对象与NodeList非常类似。

```
var images = document.getElementsByTagName('img');
```

这行代码会将一个HTMLCollection对象保存在images变量中。与NodeList对象类似，可以使用方括号语法或item()方法来访问HTMLCollection对象中的项。而这个对象中元素的数量则可以通过其length属性取得。

```
console.log(images.length);
console.log(images[0].src); //输出第一个图像元素的src特性
console.log(images.item(0).src); //输出第一个图像元素的src特性
```

HTMLCollection对象还有换一个方法，叫做nameItem()，使用这个方法可以通过元素的name特性取得集合中的项。

```
<img src="myimage.gif" name="myImage">

var images = document.getElementsByTagName('img');

var myImage = images.nameItem('myImage');
```

在提供按索引访问项的基础上，HTMLCollection还支持按名称访问项，这就为我们取得实际想要的元素提供了便利。而且，**命名的项也可以使用方括号语法来访问。**

```
var myImage = images['myImage'];
```

对HTMLCollection而言，可以向方括号中传入数值或字符串形式的索引值。
**在后台，对数值索引就会调用item()，而对字符串索引就会调用nameItem()。

**要想取得文档中的所有元素，可以向getElementByTagName()中传入"*"。**
在JavaScript及CSS中，星号('*')通常表示“全部”。

```
var allElements = document.getElementsByTagName('*');
```

仅此一行代码返回的HTMLCollection中，就包含了整个页面中的所有元素——按照它们出现的先后顺序。
也就是说，第一项是\<html>元素，第二项是\<head>元素，以此类推。

**由于IE将注释（Comment）实现为元素（Element)，因此在IE中调用getElementsByTagName('*')将会返回所有注释节点。**

**虽然标准规定标签名必须区分大小写，但为了最大限度地与既有HTML页面兼容，传给getElementsByTag()的标签名是不需要区分大小写的。对于XML而言（包括XHTML），getElementsByTagName()方法就要区分大小写了。**

第三个方法，也是只有HTMLDocument类型才有的方法，是getElementsByName()。
顾名思义，这个方法会返回带有给定name特性的所有元素。
最常使用getElementsByName()方法的情况是取得单选按钮；
为了确保发送给浏览器的值正确无误，所有单选按钮不必须具有相同的name特性。

```
<fieldset>
    <legend>Which color do you prefer?</lengend>
    <ul>
        <li>
            <input type="radio" value="red" name="color" id="colorRed">
            <label for="colorRed">Red</label>
        </li>
        <li>
            <input type="radio" value="green" name="color" id="colorGreen">
            <label for="colorGreed">Green</label>
        </li>
        <li>
            <input type="radio" value="blue" name="color" id="colorBlue">
            <label for="colorBlue">Blue</label>
        </li>
    </ul>
</fieldset>
```

如这个例子所示，其中所有单选按钮的name特性值都是"color"，但它们的ID可以不同。ID的作用在于将\<label>元素应用到每个单选按钮，而name特性则用以确保三个值中只有一个被发送给浏览器。

这样，我们就可以使用如下代码取得所有单选按钮：

```
var radios = document.getElementsByName('color');
```

与getElementsByTagName()类似，getElementsByName()方法返回一个NodeList。但是，对于这里的单选按钮来说，nameItem()方法则只会取得第一项（因此每一项的name特性都相同）。

4. 特殊集合

除了属性和方法，document对象还有一些特殊的集合。这些集合都是HTMLCollection对象。为访问文档常用的部分提供了快捷方式。

- document.anchors， 包含文档中红所有带name特性的\<a>元素；

- document.forms，包含文档中所哟偶的\<form>元素，与document.getElementsByTagName('form')得到结果相同；

- document.images，包含文档中所有的\<img>元素，与document.getElementsByTagName('img')得到的结果相同；
  
- document.links，包含文档中所有带href特性的\<a>元素。

这个特殊集合始终都可以通过HTMLDocument对象访问到，而且，与HTMLCollection对象类似，集合中的项也会随着当前文档内容的更新而更新。

5. DOM一致性检测

由于DOM分为多个级别，也包含多个部分，因此检测浏览器实现了DOM的哪些部分就十分必要来了。

document.implementation属性就是为此提供相应信息和功能的对象，与浏览器对DOM的实现直接对应。

```
var hasXMLDom = document.implementation.hasFeature('XML', '1.0');
```

尽管使用hasFeature()确实方便，但也有缺点。因为实现者可以自行决定是否与DOM规范的不同部分保持一致。事实上，要想让hasFeature()方法针对所有值都返回true很容易，**但返回true有时候也不意味着实现与规范一致。**

例如，Safari 2.x及更早版本会在没有完全实现某些DOM功能的情况下返回true。

因此，在使用DOM的某些特殊的功能之前，最好除了检测hasFeature()之外，还同时使用能力检测。

6. 文档写入

有一个document对象的功能已经存在很多年了，那就是将输出流写入到网页中的能力。这个能力体现在下列4个方法中：write()、writeln()、open()和close()。

其中，write()和writeln()方法都接受一个字符串参数，即要写入到输出流中的文本。

write()会原样写入，而writeln()则会在字符串的末尾添加一个换行符(\n)。在页面被加载的过程中，可以使用这两个方法向页面中动态地加入内容。

```
<!doctype html>
<html>
    <head>
        <title>Sample Page</title>
    </head>
    <body>
        <p>Hello world</p>
        <script type="text/javscript">
            document.write("<strong>" + (new Date()).toString() + "</strong>");
        </script>
    </body>
</html>
```

这个例子展示了在页面加载过程中输出当前日期和时间的代码。

其中，日期被包含在一个\<strong>元素中，就像在HTML页面中包含普通的文本一样。这样做会创建一个DOM元素，而且可以在将来访问该元素。通过write()和writeln()输出的任何HTML代码都将如此处理。