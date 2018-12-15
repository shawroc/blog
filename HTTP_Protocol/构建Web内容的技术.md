# 构建Web内容的技术

---
绝大多数内容引自《图解HTTP》
---

在Web刚出现时，我们只能浏览那些页面样式简单的内容。如今，Web使用各种各样的技术，来呈现丰富多彩的内容。

## HTML

### Web页面几乎全由HTML构建

HTML(HyperText Markup Language，超文本标记语言) 是为了发送Web上的超文本（Hypertext）而开发的标记语言。超文本是一种文档系统，可将文档中任意位置的信息与其他信息（文本或图片等）建立关联，即超链接文本。

标记语言是指通过在文档的某部分穿插特别的字符串标签，用来修饰文档的语言。我们把出现HTML文档内的这种特殊字符串叫做HTML标签（Tag）。

平时我们浏览的Web页面几乎全是使用HTML写成的。由HTML构成的文档经过浏览器的解析、渲染后，呈现出来的结果就是Web页面。

### HTML的版本

Tim Berners-Lee 提出HTTP概念的同时，还提出了HTML原型。1993年在伊利诺伊大学的NCSA发布了Mosaic浏览器，而能够被Mosaic解析的HTML，统一标准后既作为HTML 1.0发布。

目前的最新版本是HTML4.01标准，1999年12月W3C（World Wide Web Consortium）组织推荐使用这一版本。下一个版本，预计会在2014年左右正式推荐使用HTML5标准。

HTML5标准不仅解决了浏览器之间的兼容性问题，并且可把文本作为数据对待，更容易复用，动画等效果也变得更生动。

时至今日，HTML仍存在较多悬而未决问题。有些浏览器未遵循HTML标准实现，或扩展自用标签等，这都反映了HTML的标准实际上尚未统一这一现状。

### 设计应用CSS

CSS（Cascading Style Sheets，层叠样式表）可以指定如何展现HTML内的各种元素，属于样式表标准之一。即使是相同的HTML文档，通过改变应用的CSS，用浏览器看到的页面外观也会随之改变。CSS的理念是让文档的内容结构和设计分离，达到解耦的目的。

看一个CSS的例子

```
.logo {
    padding: 20px;
    text-align: cententer;
}
```

可在选择器(selector) .logo的指定范围内，使用{}括起来的声明块中写明的 padding: 20px等声明语句应用指定的样式。

可通过指定HTML元素或特定的class、ID等作为选择器来限定样式的应用范围。

## 动态HTML

### 让Web页面动起来的动态HTML

所谓动态HTML（Dynamic HTML），是指使用客户端脚本语言将静态的HTML内容变成动态的技术的总称。
鼠标点击点开的新闻、Google Maps 等可滚动的地图就用到了动态HTML。

动态HTML技术是通过调用客户端脚本语言 JavaScript， 实现对HTML的Web页面的动态改造。
利用DOM（Document Object Model，文档对象模型）可指定欲发生动态变化的HTML元素。

### 更易控制HTML的DOM

DOM是用以操作HTML文档和XML文档的API（Application Programming Interface，应用编程接口）。使用DOM 可以将HTML内的元素当做对象操作，如取出元素内的字符串、改变那个CSS的属性等，使页面的设计发生改变。

通过调用JavaScript等脚本语言对DOM的操作，可以以更为简单的方式控制HTML的改变。

```
<body>
    <h1>繁琐的Web安全</h1>
    <p>第一部分 Web的构成元素</p>
    <p>第二部分 浏览器的安全功能</p>
    <p>第三部分 接下来发生的事</p>
</body>
```

比如，从JavaScript的角度来看，将上述HTML文档的第3个P元素（P标签）改变文字颜色时，会像下面这样编写代码。

```
<script type="text/javascript">
    var content = document.getElementsByTagName('p');
    content[2].style.color = "#FF0000";
</script>
```

document.getElementsByTagNmae('p')语句调用getElementsByTagName函数，从整个HTML文档(document object)内取出P元素。接下来的content[2].style.color = '#FF0000'语句指定content的索引为2的元素的样式颜色改为红色(#FF0000)。

DOM 内存在各种函数，使用它们可查阅HTML中的各个元素。

## Web应用

### 通过Web提供功能的Web应用

Web应用是指通过Web功能提供的应用程序。比如有购物网站、网上银行、SNS、BBS、搜索引擎和e-learning等。互联网（Internet）或企业内网(Internet)上遍布各式各样的Web应用。

原本应用HTTP协议的Web机制就是对客户端发来的请求，返回事前准备好的内容。
可随着Web越来越普及，仅靠这样的做法已不足以应对所有的需求，更需要引入由程序创建HTML内容的方法。

类似这种由程序创建的内容成为动态内容，而事先准备好的内容称为静态内容。
Web应用则作用于动态内容之上。

### 与Web 服务器及程序协作的CGI

CGI（Common Gateway Interface，通用网关接口）是指Web 服务器在接收到客户端发送过来的请求后转发给程序的一组机制。在CGI的作用下，程序会对请求内容作出相应的动作，比如创建HTML等动态内容。

使用CGI的程序叫做CGI程序，通常是用Perl、PHP、Ruby和C等编程语言编写而成。

### 因Java而普及的Servlet

Servlet 是一种能在服务器上创建动态内容的程序。Servlet 是用Java 语言实现的一个接口，属于面向企业级Java（JavaEE，Java Enterprise Edition）的一部分。

之前提及的CGI，由于每次接到请求，程序都要跟着启动一次。因此一旦访问量过大，Web服务器要承担相当大的负载。而Servlet运行在与We服务器相同的进程中，因此受到的负载较小。Servlet的运行环境叫做Web容器或Serlet 容器。

Serlet 作为解决CGI问题的对抗急速。随Java得到了普及。

随着CGI的普及，每次请求都要启动新CGI程序的CGI运行机制逐渐变成了性能瓶颈，所以之后Servlet 和 mod_perl等可直接在Web服务器上运行的程序才得以开发、普及。

### 数据发布的格式及语言

#### 可扩展标记语言

XML（eXtensible Markup Language，可扩展标记语言）是一种可按应用目标进行扩展的通用标记语言。旨在通过使用XML，使互联网数据共享变得更容易。

XML和 HTML 都是从标准通过标记语言SGML（Standard Generalized Markup Language）简化而成。与HTML相比，它对数据的记录方式做了特殊处理。

下面以HTML编码的某公司的研讨会议议程为例进行说明。

```
<html>
<head>
<title>T公司研讨会介绍</title>
</head>
<body>
<h1>T公司研讨会介绍</h1>
<ul>
    <li>研讨会编号：TR001
        <ul>
            <li>Web应用程序脆弱性诊断讲座</li>
        </ul>
    </li>
    <li>研讨会编号：TROO2
        <ul>
            <li>网络系统脆弱性诊断讲座</li>
        </ul>
    </li>
</ul>
</body>
</html>
```

用浏览器打开该文档时，就会显示排列的列表内容，但如果这些数据被其他程序读取会发生什么？某些程序虽然具备可通过识别布局取出文本的方法，但这份HTML的样式一旦改变，要读取数据内容也就变得相对困难了。可见，为了保持数据的正确读取，HTML 不适合用来记录数据结构。

接着将这份列表以XML的形式改写成了以下的示例。

```
<研讨会 编号="TR001" 主题="Web应用程序脆弱性诊断讲座">
<类别>安全</类别>
<概要>为深入研究Web应用程序脆弱性诊断必要的..</概要>
</研讨会>
<研讨会 编号="TR002" 主题="网络系统脆落性诊断讲座">
<类别>安全</类别>
<概要>为深入研究网络系统脆弱性诊断必要的...</概要>
</研讨会>
```

XML 和 HTML 一样，使用标签构成树形结构，并且可自定义扩展标签。

从XML文档中读取数据比起HTML更为简单。由于XML的结构基本上都是用标签分割而成的树形结构，因此通过语法分析器(Parser)的解析功能解析XML结构并取出数据元素，可更容易地对数据进行读取。

更容易地复用数据使用XML在互联网被广泛接收。比如，可用在2个不同的应用之间的交换数据格式化。

#### 发布更新信息的RSS/Atom

RSS(简易信息聚合，也叫聚合内容)和Atom都是发布新闻或博客日志等更新信息文档的格式的总称。两者都用到了XML。

RSS有以下版本，名称和编写方式也不相同。

- RSS 0.9 (RDF Site Summary)：最初的RSS版本。1999年3月由网景通信公司自行开发用于其门户网站。基础构图创建在初期的RDF规格上。

- RSS 0.91 (Rich Site Summary): 在RSS0.9的基础上扩展元素，于1999年7月开发完毕。非RDF规格，使用XML方式编码。

- RSS 1.0 ( RDF Site Summary)：RSS规格正处于混乱状态。2000年12月由RSS-DEV 工作组再次采用 RSS0.9 中使用的RDF规格发布。

- RSS2.0（Really Simple Syndication）：非RSS1.0 发展路线。增加支持 RSS0.91的兼容性，2000年12月由UserLand Software公司开发完成。

Atom具备以下两种标准。

**Atom供稿格式(Atom Syndication Format)**: 为发布内容而制定的网站消息来源格式，单讲Atom时，就是指该标准。

**Atom出版协定(Atom Publishing Protocol)：**为Web上内容的新增或修改而制定的协议。

用于订阅博客更新信息的RSS阅读器，这种应用几乎支持RSS的所有版本以及Atom。


### JavaScript衍生的轻量级易用JSON

JSON(JavaScript Object Notation) 是一种以JavaScript（ECMAScript)对象表示法为基础的轻量级数据标记语言。能够处理的数据类型有 true/false/null/对象/数组/数字/字符串。这7种类型。

```
{
    "name": "Web Application Security",
    "num": "TR001"
}
```

JSON 让数据更轻更纯粹，并且JSON的字符串形式可被JavaScript轻易地读入。当初配合XML使用的Ajax技术也让JSON的应用变得更为广泛。另外，其他各种编程语言也提供了丰富的库类，以达到轻便操作JSON的目的。