# DOM扩展-1

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

4. 字符集属性

HTML5新增了几个与文明单号字符集有关的属性。

其中，charset属性表示文档中实际使用的字符集，也可以用来指定新字符集。

默认情况下，这个属性的值为"UTF-8"，但可以通过\<meta>元素、响应头部或直接设置charset属性修改这个值。

```

alert(document.charset); //"UTF-8";
document.charset = "utf-8";
```

另一个属性是defaultCharset，表示根据默认游览器及其操作系统的设置，当前文档默认的字符集应该是什么。如果文档没有使用默认的字符集，那charset和defaultCharset属性的值可能会不一样。例如:

```
if(document.charset != document.defaultCharset) {
    alert("Custom character set being used.");
}
```

通过这两个属性可以得到文档使用的字符编码的具体信息，也能对字符编码进行准确地控制。
运行适当的情况下，可以保证用户正常查看页面或使用应用。

支持document.charset属性的浏览器有IE、Safari、Opera和Chrome。
Firefox支持document.Characterset。支持document.defaultCharset属性的浏览器有IE、Safari和Chrome。

5. 自定义数据属性

HTML5规定可以为元素添加非标准的属性，但要添加前缀data-，目的是为元素提供与渲染无关的信息，或者提供语义信息。这些属性可以任意添加、随便命名，只要以data-开头即可。

```
<div id="myDiv" data-appId="12345" data-myName="Shaw"></div>
```

添加了自定义属性之后，可以通过元素的dataset属性来访问自定义属性的值。
dataset属性的值是DOMStringMap的一个实例，也就是一个名值对而的映射。

在这个映射中，每个data-name形式的属性都会有一个对应的属性，只不过属性名没有data-前缀（比如，自定义属性是data-myName，那映射中对应的属性就是myName)。

```
//本例中使用的方法

var div = document.getElementById("myDiv");

//取得自定义属性的值
var appId = div.dataset.appId;
var myName = div.dataset.myName;

//设置值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";

//有没有"myname"值呢？

if(div.dataset.myname) {
    console.log("Hello, " + div.dataset.myname);
}
```

如果需要给元素添加一些不可见的数据以便进行其他处理，那就要用到自定义数据属性。
在跟踪链接或混搭应用中，**通过自定义数据属性能方便地知道点击来自页面中的哪个部分。**

6. 插入标记

虽然DOM为操作节点提供理论细微入至的控制手段，但在需要给文档插入大量新HTML标记的情况下，通过DOM操作仍然非常麻烦，因为不仅要创建一系列DOM节点，而且还要小心地按照正确的顺序把它们连接起来。相对而言，使用插入标记的技术，直接插入HTML字符串不仅更简单，速度也更快。

以下与插入标记相关的DOM扩展已经纳入了HTML5规范。

- innerHTML属性

在读模式下，innerHTML属性返回与调用元素的所有子节点（包括元素、注释和文本节点）对应的HTML标记。在写模式下，innerHTML会根据指定的值创建新的DOM树，然后用这个DOM树完全替换调用元素原先的所有子节点。

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

对于上面的\<div>元素来说，它的innerHTML属性会返回如下字符串。

```
<p>This is a <strong>paragraph</strong> with a list foolowing it</p>
<ul>
    <li>Item1</li>
    <li>Item2</li>
    <li>Item3</li>
</ul>
```

但是，不同浏览器返回的文本格式会有所不同。
IE和Opera会将所有标签转换为大写形式，而Safari、Chrome和Firefox则会按照原先文档中（或指定这些标签）的格式返回HTML，包括空格和缩进。

**不要指望所有浏览器返回的innerHTML值完全相同。**

在写模式下，innerHTML的值会被解析为DOM子树，替换掉用哪个元素原来的所有子节点。
因为它的值被认为是HTML，所以其中的所有表现都会按照浏览器处理HTML的标准方式转换为元素（同样，这里的转换结果也因浏览器而异）。如果设置的值仅是文本而没有HTML标签，那么结果就是设置纯文本。

```
div.innerHTML = "Hello World";
```

为innerHTML设置的包含HTML的字符串值与解析后innerHTML的值大不相同。

```
div.innerHTML = "Hello & Welcome, <b>\" reader \" ! </b>"
```

以上操作得到的结果如下:

```
<div id="content">Hello &amp; welcome, <b>&quot;reader&quot;!</b></div>
```

设置了innerHTML之后，可以像访问文档中的其他节点一样访问新创建的节点。


**使用innerHTML属性也有一些限制。比如，在大多数浏览器中，通过innerHTML插入\<script>元素并不会执行其中的脚本。**

IE8及更早版本是唯一能在这种情况下执行脚本的浏览器，但必须满足一些条件。

一是必须为\<script>元素指定defer属性，二是\<script>元素必须位于（微软所谓的）“有作用域的元素”（scoped element）之后。

\<script>元素被认为是"无作用域的元素"，也就是在页面中看不到的元素，与\<style>元素或注释类似。如果通过innerHTML插入语的字符串开头就是一个"无作用域的元素",那么IE会在解析这个字符串前先删除该元素。换句话说，一下代码达不到目的：

```
div.innerHTML = "<script defer>alert('hi')<\/script>; //无效
```

此时，innerHTML字符串一开始（而且整个）就是一个“无作用域的元素”，所以这个字符串会变成空字符串。如果想插入这段脚本，必须在前面添加一个“有作用域的元素”，可以是一个文本节点，也可以是一个没有结束标签的元素如\<input>。

例如，下面这几行代码都可以正常执行：

```
div.innerHTML = "_<script defer>alert('hi')<\/script>";
div.innerHTML = "<div>&nbsp;</div><script defer>alert('hi');<\/script>";
div.innerHTML = "<input type=\"hidden\"><script defer>alert('hi')<\/script>";
```

第一行代码会在\<script>元素前插入一个文本节点。

事后，为了不影响页面显示，你可能需要移除这个文本节点。第二行代码采用的方法类似，只不过使用的一个包含非换行空格的\<div>元素。

如果仅仅插入一个空的\<div>元素，还是不行，必须包含一点而内容，浏览器才会创建文本节点。

同样，为了不影响页面布局，恐怕还得移除这个节点。

第三行代码使用的是一个隐藏的\<input>域，也能达到相同的效果。
不过，由于隐藏的\<input>域不影响页面布局，因此这种方式在大多数情况下都是首选。

```
div.innerHTML = "<style type=\"text/css\">body {background-color: red}</style>";
```

但在IE8及更早版本中，\<style>也是一个"没有作用域的元素"，因此必须像下面这样给它设置一个"有作用域的元素":

```
div.innerHTML = "_<style type=\"text/css\">body {background-color: red} </style>";

div.removeChild(div.firstChild);
```

并不是所有元素都支持innerHTML属性。现在这句话有待商议。

- outerHTML属性

在读模式下，outerHTML返回调用它的元素及所有子节点的HTML标签。
在写模式下，outerHTML会根据指定的HTML字符串创建新的DOM子树，然后用这个DOM子树完全替换调用元素。

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

如果在\<div>元素上调用outerHTML，会返回与上面相同的代码，包括\<div>本身。
不过，由于浏览器解析和解释HTML标记的不同，结果也肯能会有所不同。（这里的不同与使用innerHTML存在的差异性质是一样的。）

使用outerHTML属性以下面这种方式设置值：

```
div.outerHTML = "<p>This is a paragraph.</p>";
```

这行代码完成的操作与下面这些DOM脚本代码一样：

```
var p = document.createElement("p");

p.appendChild(document.createTextNode("This is a paragraph."));
div.parentNode.replaceChild(p, div);
```

结果，就是新创建的\<p>元素会取代DOM树中的\<div>元素。

支持outerHTML属性的浏览器有IE4+、Safari 4+、Chrome和Opera 8+。
Firefox 7及之前版本都不支持outerHTML属性。

- insetrtAdjacentHTML()方法

插入标记的最后一个新增方式是insertAdjacentHTML()方法。
这个方法最早也是在IE中出现的，它接收两个参数：插入位置和要插入的HTML文本。

"beforebegin"，在当前元素之前插入一个紧邻的同辈元素。

"afterbegin"，在当前元素之下插入一个新的子元素或在第一个子元素或在第一个子元素之前再插入新的子元素。

"beforeend"，在当前元素之下插入一个新的子元素或在最后一个子元素之后再插入新的子元素。

"afterend"，在当前元素之后插入一个紧邻的同辈元素。

注意，这些值都必须是小写形式。
第二个参数是一个HTML字符串（与innerHTML和outerHTML的值相同），如果浏览器无法解析该字符串，就会抛出错误。

```
//作为前一个同辈元素插入
element.insertAdjacentHTML("beforebegin", "<p>Hello World!</p>");

//作为第一个子元素插入
element.insertAdjacentHTML("afterbegin","<p>Hello World!</p>");

//作为最后一个子元素插入
element.insertAdjacentHTML("beforeend", "<p>Hello World!</p>");

//作为后一个同辈元素插入
element.insertAdjacentHTML("afterend", "<p>Hello World!</p>");
```

- 内存与性能问题

前面介绍的方法替换子节点可能会到值浏览器的内存占用问题，尤其是在IE中，问题会更加明显。

在删除带有事件处理程序或引用了其他JavaScript对象子树时，就有可能导致内存占用问题。

假设，某个元素有一个事件处理程序（或者引用了换一个JavaScript对象作为属性），在使用前述某个属性将文档树中删除后，元素与事件处理程序（或JavaScript对象）之间的绑定关系在内存中并没有一并删除。

如果这种情况频繁出现，页面占用的内存数量就会明显增加。因此，在使用innerHTML、outerHTML属性和insertAdjacentHTML()方法时，最好先手工删除要被替换的元素的所有事件处理程序和JavaScript对象属性。

不过，使用这几个属性——特别是使用innerHTML，仍然还是可以为我们提供很多便利的。
一般来所，在插入大量新HTML标记时，使用innerHTML属性与通过多次DOM操作先创建节点再指定它们之间的关系相比，效率要高得多。

**这是因为在设置innerHTML或outerHTML时，就会创建一个HTML解析器。**

这个解析器是在浏览器级别的代码（通常是C++编写的）基础上运行的，因此比执行JavaScript快得多。不可避免地，创建和销毁HTML解析器也会带来性能损失，所以最好能够将设置innerHTML或outerHTML的次数控制在河里的范围内。

例如，下列代码使用innerHTML创建了很多列表项：

```
for( var i = 0, len =  values.length; i < len; i ++) {
    ul.innerHTML += "<li>" + values[i] + "</li>"; //要避免这种频繁操作！！
}
```

这种每次循环都设置一次innerHTML的做法效率很低。
而且，每次循环还要从innerHTML中读取一次信息，就意味着每次循环要访问两次innerHTML。
最好的做法是单独构建字符串，然后再一次性地将结果字符串赋值给innerHTML，像下面这样：

```
var itemsHTML = "";

for(var i = 0, len = values.length; i < len; i ++) {
    itemsHTML += "<li>" + values[i] + "</li>/n";
}

ul.innerHTML = itemsHTML;
```

这个例子的效率要高得多，因为它只对innerHTML执行了一次赋值操作。

- scrollIntoView()方法

如何滚动页面也是DOM规范没有解决的一个问题。
为了解决这个问题，浏览器实现了一些方法，以方便开发人员更好地控制页面滚动。
在各种专有方法中，HTML5最终选择了scrollIntoView()作为标准方法。

scrollIntoView()可以在所有HTML元素上调用，通过滚动浏览器窗口或某个元素容器，调用元素就可以出现在视口。如果给这个方法传入true作为参数，或者不传入任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。

如果传入false作为参数，调用元素会尽可能全部出现视口中，（可能的话，调用元素的底部会与视口底部平齐。）不过顶部不一定平齐，例如:

```
//让元素可见
document.forms[0].scrollIntoView();
```

当页面发生变化时，一般会用这个方法来吸引用户的注意力。实际上，为某个元素设置焦点也会导致浏览器滚动并显示出获得焦点的元素。

支持scrollIntoView()方法的浏览器有IE、Firefox、Safari和Opera。