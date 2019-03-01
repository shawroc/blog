# 在HTML中使用JavaScript

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

只要一提到把JavaScript放到网页中，就不得不涉及到Web的核心语言——HTML。

**在当初开发JavaScript的时候，NetScape要解决的一个重要问题就是如何让JavaScript既能与HTML页面共存，又不影响页面在其他浏览器中的呈现效果。**

经过尝试、纠错和争论，最终的决定就是为Web增加统一的脚本支持。而Web诞生早起的很多做法也都保留下来，并被正式纳入HTML规范中。

## \<script>元素

向HTML页面中插入JavaScript的主要方法，就是使用\<script>元素。
这个元素由Netscape创造并在Netscape Navigator 2中首先实现。后来，这个元素被加入到正式的HTML规范中。HTML 4.01为\<script>定义了下列6个属性。

- async: 可选。表示应该立刻下载脚本，但不应妨碍页面中的其他操作，比如下载其他资源或等待加载其他脚本。只对外部脚本文件有效。

- defer: 可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。**只对外部脚本文件有效。IE7及更早版本对嵌入脚本也支持这个属性。**

- charset: 可选。表示通过src属性指定的代码的字符集。由于大多数浏览器会忽略它的值，因此这个属性很少有人用。

- language: 已废弃。原来用来表示编写代码使用的脚本语言（如JavaScript、JavaScript1.2或VBScript）。大多数浏览器会忽略这个属性，因此也没必要再用。

- src: 可选。表示包含要执行代码的外部文件。

- type: 可选。表示编写代码使用的脚本语言的内容类型（也称为MIME类型）。可以看成是language的替换属性。虽然text/javascript和text/ecmascript都已经不推荐使用，但人们一直以来使用的都还是text/javascript。实际上，服务器在传送JavaScript文件时使用的MIME类型通常是application/x-javascript，但在type中设置这个值却可能导致脚本被忽略。另外，在非IE浏览器中还可以使用以下值：application/javascript和application/ecmascript。**考虑到约定俗成和最大限度的浏览器兼容性，目前type属性的值依旧还是text/javascript。**不过，这个属性不是必需的，如果没有指定这个属性，则其默认值仍为text/javascript。

**使用\<script>元素嵌入JavaScript代码时，只需为\<script>指定type属性。然后，像下面这样把JavaScript代码直接放在元素内部即可：**

```
<script type="text/javascript">
    function sayHi() {
        console.log("hi");
    }
</script>
```

包含在\<script>元素内部的JavaScript代码将被从上到下依次解释。就拿前面这个例子来说，解释器会解释一个函数的定义，然后将该定义保存在自己的环境当中。在解释器对\<script>元素内部的所有代码求值完毕以前，页面中的其余内容都不会被浏览器加载或显示。

在使用\<script>嵌入JavaScript代码时，记住不要在代码中的任何地方出现"\</script>"字符串。

例如，浏览器在加载下面所示的代码时就会产生一个错误：

```
<script type = "text/javascript">
    function sayScript() {
        console.log("</script>");
    }
</script>
```

因为按照解析嵌入式代码的规则，当浏览器遇到字符串"</script>"时，就会认为那是结束的\</script>标签。而通过转译字符“\”解决这个问题。

```
<script type="text/javascript">
    function sayScript() {
        console.log("<\/script>");
    }
</script>
```

这样写代码浏览器可以接受，因而也就不会导致错误了。

如果要通过\<script>元素来包含外部JavaScript文件，那么src属性就是必需的。这个属性的值是一个指向外部JavaScript文件的链接。

```
<script type="text/javascript" src="example.js"></script>
```

在这个例子中，外部文件example.js将被加载到当前页面中。外部文件只需包含通常要放在开始的\<script>和结束的\</script>之间的那些JavaScript代码即可。**与解析嵌入式JavaScript代码一样，在解析外部JavaScript文件（包括下载该文件）时，页面的处理也会暂时停止。**如果是在XHTML文档中，也可以省略前面示例代码中结束的\</script>标签。

```
<script type="text/javascript" src="example.js"/>
```

但是，不能在HTML文档使用这种语法。原因始这种语法不符合HTML规范，而且也得不到某些浏览器（尤其是IE）的正确解析。

**需要注意的是，带有src属性的\<script>元素不应该在其\<script>和\</script>标签之间再包含额外的JavaScript代码。如果包含了嵌入的代码，则只会下载并执行外部脚本文件，嵌入的代码会被忽略。**

**通过\<script>元素的src属性还可以包含来自外部域的JavaScript文件。**

这一点既让\<script>元素倍显强大，又让它备受争议。

**在这一点上，\<script>与\<img>元素非常相似，即它的src属性可以是指向当前HTML页面所在域之外的某个域中的完整URL。**

```
<script type="text/javascript" src="http://www.xxx.com/afile.js"></script>
```

这样，位于外部域中的代码也会被加载和解析，就像这些代码位于加载它们的页面中一样。

利用这一点就可以在必要时通过不同的域来提供JavaScript文件。不过，在访问自己不能控制的服务器上的JavaScript文件时要多加小心。如果不幸遇到了怀有恶意的程序员，那他们随时都可能替换该文件中的代码。因此，如果想包含来自不同域的代码，则要么你是那个域的所有者，要么那个域的所有者值得信赖。


**无论如何包含代码，只要不存在defer和async属性，浏览器都会按照\<script>元素在页面中出现的先后顺序对它们依次进行解析。换句话说，在第一个\<script>元素包含的代码解析完成后，第二个\<script>包含的代码才会被解析，然后才是第三个、第四个...**

## 标签的位置

按照传统的做法，所有\<script>元素都应该放在页面的\<head>元素中，例如：

```
<!DOCTYPE html>
<html>
    <head>
      <title>Example HTML Page</title>
      <script type="text/javascript" src="example1.js"></script>
      <script type="text/javascript" src="example2.js"></script>
    </head>
    <body>
        <!-- 这里放内容 -->
    </body>
</html>
```

这种做法的目的就是把所有外部文件（包括CSS文件和JavaScript文件）的引用都放在相同的地方。

可是，在文档的\<head>元素中包含所有JavaScript文件，意味着必须等到全部JavaScript代码都被下载、解析和执行完成以后，才能开始呈现页面的内容。**浏览器在遇到到\<body>标签时才开始呈现内容。

对于那些需要很多JavaScript代码的页面来说，这无疑会导致浏览器在呈现页面时出现明显的延迟，而延迟期间的浏览器窗口中将会是一片空白。

**为了避免这个问题，现代Web应用程序一般都把全部JavaScript引用放在\<body>元素中页面内容的后面。**

```
<!DOCTYPE html>
<html>
    <head>
        <title>Example HTML Page</title>
    </head>
    <body>
        <!-- 这里放内容 -->
        <script type="text/javascript" src="example1.js"></script>
        <script type="text/javascript" src="example2.js"></script>
    </body>
</html>
```

这样，在解析包含的JavaScript代码之前，页面的内容将完全呈现在浏览器中。而用户也会因为浏览器窗口显示空白页面的时间缩短而感到打开页面的速度加快了。


## 延迟脚本

HTML 4.01为\<script>标签定义了defer属性。

**在\<script>元素中设置defer属性，相当于告诉浏览器立即下载脚本，延迟执行到整个页面都解析完毕再运行。**

```
<!DOCTYPE html>
<html>
    <head>
        <title>Example HTML Page</title>
        <script type="text/javascript" defer="defer" src="example1.js"></script>
        <script type="text/javascript" defer="defer" src="example2.js"></script>
    </head>
    <body>
        <!-- 这里放内容 -->
    </body>
<html>
```

在这个例子中，虽然我们把\<script>元素放在了文档的\<head>元素中，但其中包含的脚本将延迟到浏览器遇到\</html>标签后再执行。

HTML5规范要求脚本按照它们出现的先后顺序执行，因此第一个延迟脚本会先于第二个延迟脚本执行，而这两个脚本会先于DOMContentLoaded执行。

在现实当中，延迟脚本并不一定会按照顺序执行，也不一定会在DOMContentLoaded事件触发前执行。因此最好只包含一个延迟脚本。

defer属性只适用于外部脚本文件。这一点在HTML5中已经明确确定。因此支持HTML5的实现会忽略给嵌入脚本设置的defer属性。IE4~7还支持对嵌入脚本的defer属性，但IE8及之后版本则完全支持HTML5规定的行为。

IE4、Firefox 3.5、Safari 5和Chrome是最早支持defer属性的浏览器。其他浏览器会忽略这个属性，像平常一样处理脚本。为此，把延迟脚本放在页面底部仍然是最佳选择。

**在XHTML文档中，要把defer属性设置为defer="defer"**

## 异步脚本

HTML5为\<script>元素定义了async属性。

这个属性与defer属性类似，都用于改变处理脚本的行为。同样与defer类似，async只适用于外部脚本文件，并告诉浏览器立即下载文件。

**但与defer不同的是，标记为async的脚本并不保证按照指定它们的先后顺序执行。**

```
<!DOCTYPE html>
<html>
    <head>
        <title>Example HTML Page</title>
        <script type="text/javascript" async src="example1.js></script>
        <script type="text/javascript" async src="example2.js></script>
    </head>
    <body>
        <!-- 这里放内容 -->
    </body>
</html>
```

在以上代码中，第二个脚本文件可能会在第一个脚本文件之前执行。因此，确保两者之间互不依赖非常重要。

**指定async属性的目的是异步加载页面其他内容。为此，建议异步脚本不要在加载期间修改DOM。**

异步脚本一定会在页面的load事件前执行，但可能会在DOMContentLoaded事件触发之前或后执行。支持异步脚本的浏览器有Firefox3.6、Safari 5和Chrome。

## 在XHTML中的用法（HTML5正快速地被前端开发人员采用，建议在学习和开发中遵循HTML5标准，可以略过此内容，也稍作了解)

可扩展超文本标记语言，即XHTML(Extensible HyperText Markup Language)，是将HTML作为XML的应用而重新定义的一个标准。

编写XHTML代码的规则要比编写HTML严格得多，而且直接影响能否在嵌入JavaScript代码时使用\<script>标签。

下面的代码，在HTML中有效，但在XHTML中则是无效的。

```
<script type="text/javascript">
    function compare(a,b){
        if(a < b) {
            return -1;
        } else if(a > b) {
            return 1;
        } else {
            return 0;
        }
    }
</script>
```

在HTML中，有特殊的规则用以确定\<script>元素中的哪些内容可以被解析，但这些特殊的规则在XHTML中不适用。

这里比较语句 a < b 中的小于号 (<) 在XHTML中将被当做开始一个新标签来解析。但是作为标签来讲，小于号后面不能跟空格，因此就会导致语法错误。

**避免在XHTML中出现类似语法错误的方法有两个。一时用相应的HTML实体（\&lt;)替换代码中的所有的小于号（<），替换后的代码类似如下所示：

```
<script type="text/javascript">

    function compare(a,b) {
        if(a &lt; b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }
</script>
```

虽然这样可以让代码在XHTML中正常运行，但却导致代码不好理解了。为此，我们可以考虑采用另外一个种方法。

保证让相同代码在XHTML中正常运行的第二个方法，就是用一个CData片段来包含JavaScript代码。在XHTML(XML)中，**CData片段是文档中的一个特殊区域，这个区域中可以包含不不要解析的任意格式的文本内容。 因此，在CData片段中就可以使用任意字符——小于号当然也没有问题，而且不会导致语法错误。**

```
<script type="text/javascript"><![CDATA[
    function compare(a,b) {
        if(a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }
]]></script>
```

在兼容XHTML的浏览器中，这个方法可以解决问题。但实际上，还有不少浏览器不兼容XHTML，因而不支持CData片段，怎么办呢？再使用JavaScript注释将CData标记注释掉就可以了。

```
<script type="text/javascript">
///<![CDATA[
    function compare(a,b) {
        if(a < b) {
           console.log("A is less than B"); 
        } else if ( a > b) {
            console.log("A is greater than B");
        } else {
            console.log("A is equal to B");
        }
    }
]]>
</script>
```

这种格式在所有现代浏览器中都可以正常使用。虽然有几分hack的味道，但它能通过XHTML验证，而且对XHTML之前的浏览器也会平稳退化。

**在将页面的MIME类型指定为"application/xhtml+xml"的情况下会出发XHTML模式。并不是所有浏览器都支持以这种方式提供XHTML文档。**


## 不推荐使用的语法

在最早引入\<script>元素的时候，该元素与传统HTML的解析是具有冲突的。

**由于要对这个元素应用特殊的解析规则，**因此在那些不支持JavaScript的浏览器(最典型的是Mosaic)中就会导致问题。

具体来说，不支持JavaScript的浏览器会把\<script>元素的内容直接输出到页面中，因而会破坏页面的布局和外观。

**Netscape与Mosaic协商并提出了一个解决方案，让不支持\<\script>元素的浏览器能够隐藏嵌入的JavaScript代码。**这个方案就是把JavaScript代码包含在一个HTML注释中。

```
<script><!-- 
    function sayHi() {
        alert("say Hi!");
    } 
//--></script>
```

给脚本加上HTML注释后，Mosaic等浏览器就会忽略\<script>标签中的内容；
而那些支持JavaScript的浏览器在遇到这种情况时，则必须进一步u恶人其中是否包含需要解析的JavaScript代码。

虽然这种注释JavaScript代码的格式得到了所有浏览器的认可，也能被正确解释，但由于所有浏览器都已经支持JavaScript，因此也就没有必要再使用这种格式了。 在XHTML模式下，因为脚本包含在XML注释中，所以脚本会被忽略。

## 嵌入代码与外部文件

**在HTML中嵌入JavaScript代码虽然没有问题，但一般认为最好的做法还是尽可能使用外部文件来包含JavaScript代码。**

不过，并不存在必须使用外部文件的硬性规定，但支持使用外部文件的人多会强调如下优点：

- 可维护性：遍及不同HTML页面的JavaScript会造成维护问题。把所有JavaScropt文件都放在一个文件夹中，维护起来就轻松多了。而且开发人员因此也能够在不触及HTML标记的情况下，集中精力编辑JavaScript代码。

- 可扩展性：适应未来，通过外部文件来包含JavaScript无须使用前面提到XHTML或注释hack。HTML和XHTML包含外部文件的语法是相同的。

- 可缓存：浏览器能够根据具体的设置缓存链接的所有外部JavaScript文件。也就是说，如果有两个页面都使用同一个文件，那么这个文件只需下载一次。因此，最终结果就是能够加快页面加载的速度。

## 文档模式

IE5.5 引入了文档模式的概念，而这个概念是通过使用文档类型（doctype）切换实现的。

最初的两种文档模式：混杂模式(quirks mode)和标准模式(standard mode)。

混杂模式会让IE的行为与包含非标准特性的IE5相同，而标准模式则让IE的行为更接近标准行为。

虽然这两种模式主要影响CSS内容的呈现，但在某些情况下也会影响到JavaScript的解释执行。

在IE引入文档模式的概念后，其他浏览器也纷纷效仿。在此之后，IE又提出一种所谓的准标准模式(almost standard mode)。这种模式下的浏览器特性有很多都是符合标准的，但也不尽然。不标准的地方主要体现在处理图片间隙的时候（在表格中使用图片问题最明显）。

**如果在文档开始处没有发现文档类型声明，则所有浏览器都会默认开启混杂模式。**但采用混杂模式不是什么值得推荐的做法，因为不同浏览器在这种模式下的行为差异非常大，如果不使用某些hack技术，跨浏览器的行为根本就没有一致性可言。

对于标准模式，可以通过使用下面任何一种文档类型来开启：

```
<!-- HTML 4.01 严格型 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!-- XHTML 1.0 严格型 -->
<!DOCTYPE html PUBLIC "-//W3C//DTC XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!-- HTML 5-->
<!DOCTYPE html>
```

而对于准标准模式，则可以通过使用过渡型（transitional）或框架集型（frameset）文档类型来出发。

```
<!-- html 4.01 过渡型 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!-- HTML 4.01 框架集型 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">

<!-- XHTML 1.0 过渡型 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml/DTD/xhtml1-transional.dtd">

<!-- XHTML 1.0 框架集型 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml/DTD/xhtml1-frameset.dtd">

```

准标准模式与标准模式非常接近，它们的差异几乎可以忽略不计。因此，当有人提到“标准模式”时，有可能是指这两种模式的任何一种。而且，检测文档模式时也不会发现什么不同。


## \<noscript>元素

**早期浏览器都面临一个特殊的问题，即当浏览器不支持JavaScript时如何让页面平稳地退化。**

对这个问题的最终解决方案就是创造一个\<noscript>元素，用以在不支持JavaScript的浏览器中显示替代的内容。

这个元素可以包含能够出现在文档\<body>中的任何HTML元素——\<script>除外。

包含在\<noscript>元素中的内容只有在下列情况下才会显示出来：

- 浏览器不支持脚本；

- 浏览器支持脚本，但脚本被禁用。

符合上述任何一个条件，浏览器都会显示\<noscript>中的内容。

而在除此之外的其他情况下，浏览器不会呈现\<noscript>中的内容。

```
<!DOCTYPE html>
<html>
    <head>
        <title>Example HTML Page</title>
        <script type="text/javascript" src="example1.js"></script>
        <script type="text/javascript" src="example2.js"></script>
    </head>
    <body>
        <noscript>
            <p>启动支持JavaScript，浏览体验更佳哦。</p>
        </noscript>
    </body>
</html>
```

这个页面会在脚本无效的情况下向用户显示一条信息。

而在启用了脚本的浏览器中，用户永远也不会看到它——尽管它是页面的一部分。

## 小结

把JavaScript插入到HTML页面中要使用\<script>元素。
使用这个元素可以把JavaScript嵌入到HTML页面中，让脚本与标记混合在一起；也可以包含外部的JavaScript文件。

需要注意的地方有：

- 在包含外部JavaScript文件时，必须将src属性设置为指向相应文件的URL。而这个文件既可以是与包含它的页面位于同一个服务器上的文件，也可以是其他任何域中的文件。


- 所有\<script>元素都会按照它们在页面中出现的先后顺序依次被解析。在不使用defer和async属性的情况下，只有在解析完前面\<script>元素中的代码之后，才会开始解析后面\<script>元素中的代码。


- 由于浏览器会先解析完不使用defer属性的\<script>元素中的代码，然后再解析后面的内容，所以一般应该把\<script>元素放在页面最后，即主要内容后面，\</body>标签前面。

- 使用defer属性可以让脚本在文档完全呈现之后再执行。延迟脚本总是按照指定它们的顺序执行。

- 使用async属性可以表示脚本不必等待其他脚本，也不必阻塞文档呈现。不能保证异步脚本按照它们在页面中出现的顺序中。

另外，使用\<noscript>元素可以指定在不支持脚本的浏览器中显示的替换内容。
但在启用了脚本的情况下，浏览器不会显示\<noscript>元素中的任何内容。