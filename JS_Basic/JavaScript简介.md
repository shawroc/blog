# JavaScript简介

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

JavaScript诞生于1995年。当时，它的主要目的是处理以前由有服务器语言（如Perl）负责的一些输入验证操作。

在JavaScript问世之前，必须把表单数据发送到服务器端才能确定用户是否没有填写某个必填项，是否输入了无效的值。

Netscape Navigator希望通过JavaScript来解决这个问题。在人们普遍使用电话拨号上网的年代，能够在客户端完成一些基本的验证任务绝对是令人兴奋的。毕竟，拨号上网的速度之慢，导致了与服务器的每一次数据交换都成了对人们耐心的一次考验。

自此以后，JavaScript逐渐成为世面上常见浏览器必备的一项特色功能。如今，JavaScript的用途早不再局限于简单的数据验证，而是具备了与浏览器窗口及其内容等几乎所有方面交互的能力。

今天的JavaScript已经成为了一门功能全面的编程语言，能够处理复杂的计算和交互，拥有了闭包、匿名（lambda，拉姆达）函数，设置元编程等特性。

作为Web的一个重要组成部分，JavaScript的重要性是不言而喻的，就连手机浏览器，甚至那些专门为残障人士设计的非常规浏览器都支持它。

当然，微软的例子更为典型。虽然有自己的客户端脚本语言VBScript，但微软仍然在Internet Explorer的早起版本中加入了自己的JavaScript实现。

JavaScript从一个简单的输入验证器发展成为一门强大的编程语言，完全出乎人们的意料。

**它既是一门非常简单的语言，又是一门非常复杂的语言。**

说它简单，是因为学会使用它只需片刻功夫；而说它复杂，是因为要真正掌握它需要数年时间。要想全面理解和掌握JavaScript，关键在于弄清楚它的本质、历史和局限性。

## JavaScript简史

在Web日益流行的同时，人们对客户端脚本语言的需求也越来越强烈。那个时候，绝大多数因特网用户都使用速度仅为28.8bit/s的“猫”（调制解调器）上网，但网页的大小和复杂性却不断增加。

为完成简单的表单验证而频繁地狱服务器交换数据只会加重用户的负担。想象一下：用户填写完一个表单，单击“提交”按钮，然后等待30秒钟，最终服务器返回消息说有一个必填字段没有填好.....当时走在技术革新最前沿的Netscape公司，决定着手可开发一种客户端语言，用来处理这种简单的验证。

当时就职于Netscape公司的Brendan Eich，开始着手为计划于1995年2月发布的Netscape Navigator 2 开发一种名为 LiveScript的脚本语言——该语言将同时在浏览器和服务器中使用（它在服务器上的名字叫LiveWire）。为了赶在发布日期前完成LiveScript的开发，Netscape与Sun公司建立了一个开发联盟。在Netscape Navigator 2正是发布前夕，Netscape为了搭上媒体热炒Java的顺风车，临时把LiveScript改名为JavaScript。

由于JavaScript 1.0获得了巨大成功，NetScape随即在Netscape Navigator 3中又发布了JavaScript 1.1。Web虽然羽翼未丰，但用户关注度却屡创新高。在这样的背景下，Netscape把自己定位为市场领袖型公司。与此同时，微软决定与Navigator竞争的自家产品Internet Explorer浏览器投入更多资源。Navigator 3 发布后不久，微软就在其Internet Expolorer 3中加入了名为JScript的JavaScript实现（命名为JScript是为了避开与Netscape有关的授权问题）。以现在的眼光来看，微软1996年8月为进入Web浏览器领域而实施的这个重大举措，是导致Netscape日后蒙羞的一个标志性时间。**这也标志着JavaScript作为一门语言，其开发向前迈进了一大步。**

微软推出其JavaScript实现意味着有了两个不同的JavaScript版本：Netscape Navigator中的JavaScript、Internet Explorer中的JScript。

与C及其他编程语言不同，当时还没有标准规定JavaScript的语法和特性，两个不同版本并存的局面已经完全暴露了这个问题。随着页面担心的日益加剧，JavaScript的标准化问题被提上了议事日程。

1997年，以JavaScript 1.1 为蓝本的建议被提交给了欧洲计算机制造商协会（ECMA，European Computer Manufacturers Association）。该协会指定39号技术委员会（TC39，Technical Committee #39）负责“标准化一种通用、跨平台、供应商中立的脚本语言的语法和语义”。TC39由来自Netscape、Sun、微软、Borland及其他关注脚本语言发展的公司的程序员组成，他们经过数月的努力完成了ECMA-262——定义一种名为ECMAScript的新脚本语言的标准。

第二年，ISO/IEC（International Organization for Standardization and International Electrotechnical Commission，国际标准化组织和国际电工委员会）也采用了ECMAScript作为标准(即ISO/IEC-16262)。自此之后，浏览器开发上就开始致力于将ECMAScript作为各自JavaScript实现的基础，也在不同程度上取得了成功。

## JavaScript的实现

虽然JavaScript和ECMAScript通常都被人们用来表达相同的含义，但JavaScript的含义却比ECMA-262规定的要多得多。

**一个完整的JavaScript实现应该由下列三个不同的部分组成。**

- 核心（ECMAScript）

- 文档对象模型（DOM）

- 浏览器对象模型 （BOM）

### ECMAScript

由ECMA-262定义的ECMAScript与Web浏览器没有依赖关系。实际上，这门语言本身并不包含输入和输出定义。**ECMAScript-262定义的只是这门语言的基础，而在此基础之上可以构建更完善的脚本语言。**

我们常见的Web浏览器只是ECMAScript实现可能的宿主环境之一。宿主环境不仅提供基本的ECMAScript实现，同时也会提供该语言的扩展，以便语言与环境之间对接交互。而这些扩展——如DOM，则利用ECMAScript的核心类型和语法提供更多更具体的功能，以便实现针对环境的操作。其他宿主环境包括Node（一种服务端JavaScript平台）和Adobe Flash。

既然ECMA-262标准没有参照Web浏览器，那它规定了些什么内容？大致来说，它规定了这门语言的下列组成部分。

- 语法
- 语句
- 对象
- 类型
- 关键字
- 保留字
- 操作符

**ECMAScript就是对实现该标准规定的各个方面内容的语言的描述。**
JavaScript实现了ECMAScript，Adobe ActionScript同样也实现了ECMAScript。


1. ECMAScript的版本

这里只说下第五版。

ECMAScript 3.1成为 ECMAScript-262第五版，并于2009年12月3日正式发布。第5版力求澄清第3版中已知的歧义并增添了新的功能。新功能包括原生JSON对象（用于解析和序列化JSON数据）、继承的方法和高级属性定义，另外还包含一种严格模式，对ECMAScript引擎解释和执行代码进行了补充说明。

2. 什么是ECMAScript兼容

ECMA-262给出了ECMAScript兼容的定义。要想成为ECMAScript的实现，则该实现必须做到：

- 支持ECMA-262描述的所有“类型、值、对象、属性、函数以及程序句法和语义。”

- 支持Unicode字符标准

此外，兼容的实现还可以进行下列扩展。

- 添加ECMA-262没有描述的“更多类型、值、属性和函数”。ECMA-262所说的这些新增特性，主要是指该标准中没有规定的新对象和对象的新属性。

- 支持ECMA-262没有定义的“程序和正则表达式语法”。（也就是说，可以修改和扩展内置的正则表达式语法。）

3. Web浏览器对ECMAScript的支持

到了2008年，五大主流Web浏览器（IE、Firefox、Safari、Chrome和Opera）全部做到了与ECMAScript-262兼容。IE8是第一个着手实现ECMAScript-262第5版的浏览器，并在IE9中提供了完整的支持。Firefox 4也紧随其后做到兼容。

## 文档对象模型（DOM)

文档对象模型（DOM，Document Object Model）是针对XML但经过扩展用于HTML的应用程序编程接口（API，Application Programming Interface）。DOM把整个页面映射为一个多层节点结构。HTML或XML页面中的每个组成部分都是某种类型的节点，这些节点又包含不同类型的数据。

```
<!DOCTYPE HTML>
<html>
    <head>
        <title>Sample Page</title>
    </head>
    <body>
        <p>hello world</p>
    </body>
</html>
```

通过DOM创建的这个表示文档的树形图，开发人员获得了控制页面内容和结构的主动权。借助DOM提供的API，开发人员可以轻松自如地删除、添加、替换或修改任何节点。

1. 为什么要使用DOM

在IE4和Netscape Navigator4分别支持的不同形式的DHTML（Dynamic HTML）基础上，开发人员首次无需重新加载网页，就可以修改其外观和内容了。然而，DHTML在给Web技术发展带来巨大进步的同时，也带来了巨大的问题。由于Netscape和微软在开发DHTML方面各执己见，过去那个只编写一个HTML页面就能够在任何浏览器中运行的时代结束了。

对开发人员来说，如果想继续保持Web跨平台的天性，就必须额外多做些工作。而人们真正担心的是，如果不对Netscape和微软加以控制，Web开发领域就会出现技术上两强割据，浏览器互不兼容的局面。

**此时，负责制定Web通信标准的W3C(World Wide Web Consortium，万维网联盟)开始着手规划DOM。**

2. DOM级别

DOM1级（DOM Level1）于1998年10月成为W3C的推荐标准。DOM1级由两个模块组成：DOM核心（DOM Core）和DOM HTML。

**其中，DOM核心规定的是如何映射基于XML的文档结构，以便简化对文档中任意部分的访问和操作。**

**DOM HTML模块则在DOM核心的基础上加以扩展，添加了针对HTML的对象和方法。**

**DOM并不只是针对JavaScript的，很多别的语言月都实现了DOM。不过，在Web浏览器中，基于ECMAScript实现的DOM的确已经成为JavaScript这门语言的一个重要组成部分。**

如果说DOM1级的目标主要是映射文档的结构，那么DOM2级的目标就要宽泛多了。DOM2级在原来DOM的基础上又扩展了鼠标和用户界面时间、范围、遍历（迭代DOM文档的方法）等细分模块，而且通过对象接口增加了对CSS（Cascading Style Sheets，层叠样式表）的支持。DOM1级中的DOM核心模块也经过扩展开始支持XML命名空间。

DOM2级引入了下列新模块，也给出了众多新类型和新接口的定义。

- DOM视图（DOM Views）：定义了跟踪不同文档（应用CSS之前和之后的文档）视图的接口；

- DOM事件 (DOM Events)：定义了事件和事件处理的接口；

- DOM样式（DOM Style）： 定义了基于CSS为元素应用样式的接口；

- DOM遍历和范围（DOM Tranversal and Range）：定义了遍历和操作文档数的接口。

DOM3级则进一步扩展了DOM，引入了以统一方式加载和保存文档的方法——在DOM加载和保存（DOM Load and Save）模块中定义；

新增了验证文档的方法——在DOM验证（DOM Validation）模块中定义。DOM3级也对DOM核心进行了扩展，开始支持XML 1.0规范，涉及XML Infoset、XPath和XML Base。

**在阅读相关参考文档的时候，可能会看到DOM0级（DOM Level 0）的字眼。实际上，DOM0级标准是不存在的；所谓DOM0级只是DOM历史坐标中的一个参照点而已。具体来说，DOM0级指的是IE 4和Natscape Navigator 最初支持的DHTML。**

3. 其他DOM标准

除了DOM核心和DOM HTML接口之外，另外几种语言还发布了只针对自己的DOM标准。下面列出的语言都是基于XML的，每种语言的DOM标准都添加了与特定语言相关的新方法和新街口:

- SVG(Scalable Vector Graphic，可伸缩矢量图) 1.0；

- MathML(Mathematrical Markup Language，数学标记语言) 1.0；

- SMIL（Synchronized Multimedia Intgration Language，同步多媒体集成语言）。

还有一些语言也开发了自己的DOM实现，例如Mozilla的XUL（XML User Interfacce Language，XML用户界面语言）。但是，只有上面列出的几种语言是W3C的推荐标准。

4. Web浏览器对DOM的支持

在DOM标准出现了一段时间后，Web浏览器才开始实现它。微软IE5首次尝试实现DOM，知道IE5.5才算是真正支持DOM1级。在随后的IE6和IE7中，微软都没有引入新的DOM功能，而到了IE8才对以前DOM实现中的bug进行了修复。

Netscape直到Netscape6(Mozilla 0.60)才开始支持DOM。在Netscape7之后，Mozilla把开发中心转向了Firefox浏览器。Firefox 3完成支持DOM1级，几乎完全支持DOM2级，甚至还支持DOM3级的一部分。（Mozilla开发团队的目标是构建与标准100%兼容的浏览器，而他们的努力也得到了回报。）

支持DOM已经成为浏览器开发商的首要目标，主流浏览器每次发布新版本都会改进对DOM的支持。

## 浏览器对象模型（BOM）

IE3和Netscape Navigator 3有一个共同的特色，那就是支持可以访问和草祖宗浏览器窗口的浏览器对象模型(BOM，Broswer Object Model)。开发人员使用BOM可以可控制浏览器显示的页面以外的部分。而BOM真正与众不同的地方（也是经常会导致问题的地方），还是它作为JavaScript实现的一部分但却没有相关标准。这个问题在HTML5中得到了解决，HTML5致力于把很多BOM功能写入正式规范。

**HTML5发布后，很多关于BOM的困惑烟消云散。**

从根本上讲，BOM只处理浏览器窗口和框架，但人们习惯上也把所有针对浏览器的JavaScript扩展算作BOM的一部分。

- 弹出新浏览器窗口的功能；

- 移动、缩放和关闭浏览器窗口的功能；

- 提供浏览器详细信息的navigator对象；

- 提供浏览器加载页面的详细信息的location对象；

- 提供用户显示器分辨率详细信息的screen对象；

- 对cookies的支持；

- 像XMLHttpRequest和IE的ActiveXObject这样的自定义对象。

由于没有BOM标准可以遵循，因此每个浏览器都有自己的实现。
虽然也存在一些事实标准，例如、要有window对象和navigator对象等，但每个浏览器都会为这两个对象乃至其他对象定义自己的属性和方法。


## 小结

JavaScript是一种专为与网页交互而设计的脚本语言，由下列三个不同的部分组成：

- ECMAScript，由ECMA-262定义，提供核心语言功能；

- 文档对象模型（DOM），提供访问和操作网页内容的方法和接口；

- 浏览器对象模型（BOM），提供与浏览器交互的方法和接口。

JavaScript的这三个组成部分，在当前五个主流浏览器（IE,FF,Chrome, Safari和Opera）中都得到了不同程度的支持。

对已经正式纳入HTML5标准的BOM来说，尽管各浏览器都实现了某些众所周知的共同特性，但其他特性还是因浏览器而异。