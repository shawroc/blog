# HTML5 与 响应式Web设计

---
绝大部分引用自《响应式Web设计 HTML5和CSS3实战（第2版）
---

有人可能会问，什么是HTML5啊？
HTML5其实就是HTML的最新版本，而HTML是构建网页的标记语言。
HTML作为一门语言在不断进化，上一个版本是HTML4.01。

要了解HTML的发展历程，推荐大家看一看维基百科：http://en.wikipedia.org/wiki/HTML#HTML_version2_timeline。

HTML5是W3C的建议标准，规范的全文地址是：http://www.w3.org/TR/html5/。

**HTML5提供了很多处理表单和用户输入的元素。这些新元素免除了开发者使用JavaScript费时费力的工作，比如表单验证。**

## 得到普遍支持的HTML5标记

今天，我所看到大多数网站（以及我自己写的网站）都使用了HTML5，而不是旧版本的HTML4.01。

所有现代的浏览器都理解HTML5中新的语义元素（新的结构化元素、视频和音频标签），设置老版本的IE（IE9以下版本）都可以通过引入一小段“腻子脚本”正确渲染这些新元素。

好了，了解这些以后，我们可以看看怎么开始写HTML5网页了。
先来看开始开始标签吧。

## 开始写HTML5网页

首先看HTML5文档的开始部分。
没有这些代码，网页会出现问题。

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
```

一个一个来看。一般来说，每个网页都会用掉这些元素，因此理解它们非常必要。

### doctype

doctype是我们告诉浏览器文档类型的手段。
如果没有这一行，浏览器将不知道如何处理后面的内容。

HTML5文档的第一行是doctype声明：

```
<!DOCTYPE html>
```

如果你喜欢小写，那么\<!doctype html>也一样。

相比HTML 4.01，这一改变很受欢迎。
回顾一下HTML4.01的写法吧：

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml-transitional.dtd">
```

真是噩梦一般啊，所以我之前都是复制黏贴这几行。

HTML5的doctype短小易懂，只有\<!DOCTYPE html>。

据我了解，这已经是告诉浏览器如何以“标准模式”渲染网页的最短方式了。

想知道“混杂”与“标准模式”模式的区别？还是看维基百科吧！

### HTML标签与lang属性

doctype声明之后是开发的html标签，也是文档的根标签。
同时，我们使用了lang属性指定了文档的语言。
然后是head标签。

```
<!doctype html>
<html lang="en">
<head>
```

### 指定替代语言

根据W3C的规范，lang属性指定元素内容以及包含文本的元素属性使用的主语言。
如果正文内容不是英文的，最好指定正确的语言。
比如，如果是日语，相应的HTML标签应该是\<html lang="ja">。
完整的语言列表在这里: [语言列表](http://www.iana.org/assignments/language-subtag-registry)

### 字符编码

最后是指定字符编码。
因为这是一个空元素（不能包含任何内容的元素），所以不需要结束标签：

```
<meta charset="utf-8">
```

除非确实有需要，否则这里charset属性的值一般都是utf-8。

更多信息可以参考这个链接：

[字符编码](https://www.w3.org/International/questions/qa-html-encoding-declarations#html5charset)

## 宽容的HTML5

记得上学的时候，非常厉害（实际上也非常好）的数学老师有时候不来。
每当这时候，大家都会松一口气，因为会有一位非常和蔼可亲的老师来代课。
他会静静地坐着，让我们自己学习，不会冲我们发火，也不会挖苦谁。
他在我们解题的时候不会要求大家安静，也不会在乎是不是按照他的思路解题。
他只关心你回答的是否正确，以及是否可以清楚地解释计算过程。

如果HTML5是一位数学老师，就应该是那位宽容的代课老师。
下面来解释一下这个怪异的类比。

如果注意一下自己写代码的方式，你会发现自己基本上会使用小写，而且会把属性值放在引号里，另外也会为脚本和样式声明一个type。
比如，可能会这样链接样式表：

```
<link href="CSS/main.css" rel="stylesheet" type="text/css"/>
```

HTML5不要求这么精确，只要这样写就行：

```
<link href=CSS/main.css rel=stylesheet>
```

注意到了吗？没有结束的反斜杠，属性值也没加引号，而且没有type声明。
不过宽容的HTML5并不在乎这些，后一种写法跟前一种写法一样，完全没有问题。

这种松散的语法并不局限于链接资源，而是可以在文档中任何地方出现。
比如，可以这样声明一个div元素：

```
<div id=wrapper>
```

这同样是有效的HTML5代码。插入图片也一样：

```
<img src=fromtCarousel.png aLt=frontCarousel>
```

这行代码照样有效。
没有结束标签的反斜杠，没有引号，大小写混用，都没问题。
就算省略\<head>标签，页面依然有效。
要是XHTML 1.0的话，会怎么样呢？

**想要一个HTML5模板？推荐HTML5 Boilerplate(http://html5boilerplate.com/)。这个模板预置了HTML5 “最佳实践”，包括基础的样式、腻子脚本和可选的工具，比如Modernizr。阅读这个模板的代码就可以学到很多有用的技巧，如果你有特殊需要，还可以对其性质。强烈建议选用！**

### 理性编写 HTML5

我个人喜欢XHTML风格的语法写HTML5。
也就是说，标签必须闭合，属性值必须加引号，而且大小写也必须一致。
有人可能会说，不遵守这些写法可以节省很多输入工作量，而缺少的内容可以由工具来补充。
但我希望自己的标记看起来一目了然，所以建议大家这样做。
我认为清晰胜过简洁。

在编写HTML5文档时，既可以保持清晰明了，同时也能享受HTML5带来的高效率。
举个例子，比如一个CSS链接，我会这样写：

```
<link href="CSS/main.css" rel="stylesheet"/>
```

这里没有省略末尾的反斜杠和引号，但省略了type属性。
问题的关键在于你自己认为合适就行。
HTML5不会对你发火，不会把你的标记拿到班上展示，也不会罚你站，更不会因为标签通不过验证就给你扣上坏学生的帽子。只要你写出自己认为合适的标记就行。

我谁也不骗。我只是希望你能给属性值加上引号，也别落下标签结束的反斜杠。
否则，我可能会默默地指责一下你。

**无论HTML5对语法要求多宽松，都有必要检验自己的标记是否有效。有效目的标记更容易理解。W3C推出验证器就是为了这个目的： https://validator.w3.org/**

### 向<a>标签致敬

HTML5的一大好处就是可以把多个元素放到一个\<a>标签里（哇，早该这样了，对不？）。
以前，如果想让标记有效，必须每个元素分别包含一个\<a>标签。
比如以下HTML 4.01代码：

```
<h2><a href="index.html">The home page</a></h2>
<p><a href="index.html">This paragraph also links to the home page</a></p>
<a href="index.html"><img src="home-image.png" alt="home-slice"></a>
```

在HTML5中，可以省去所有内部的\<a>标签，只在外面套一个就行了：

```
<a href="index.html">
    <h2>The home page</h2>
    <p>This paragraph also links to the home page</p>
    <img src="home-image.png" alt="home-slice"/>
</a>
```

唯一的限制是不能把另一个\<a>标签或button之类的交互性元素放到同一个\<a>标签里（也很好理解），另外也不能把表单放到\<a>标签里（更不用说了）。

## HTML5的新语义元素

OS X词典中关于“语义”的定义如下：

“含义在语言或逻辑方面的分支”。

对我们而言，语义就是赋予标记含义。为什么赋予标记含义很重要？
这是一个很好的问题。

大多数网站的结构都很相似，包含页头、页脚、侧边栏、导航条，等等。
作为网页编写者，我们会给相应的div元素起个好理解的名字（比如class="Header"）。

可是，单纯从代码来看，任何用户代理（浏览器、屏幕阅读器、搜索引擎爬虫，等等）都不能确定每个div元素中包含的是什么内容。用户辅助技术也无法区分不同的div。HTML5为此引入了新的语义元素。

我们不会介绍所有新元素，只会介绍我觉得对响应式设计最有用的那些。

### <main>元素

很长时间以来，HTML5都没有元素用于表示页面的主内容区。
在页面的主体中，主内容区就是包含主内容的区块。

刚开始，对于不在HTML5元素中的内容是否算主内容还有争议。
好在后来规范改了，现在我们可以使用main标签来声明主内容区。

无论是页面中的主要内容，还是Web应用中的主要部分，都应该放到main元素中。
以下规范中的内容特别有用：

“文档的主内容指的是文档中特有的内容，导航链接、版权信息、站点标志、广告和搜索表单等多个文档中重复出现的内容不算主内容。”

另外要注意，每个页面的主内容区只能有一个，而且不能作为article、aside、header、nav或section等其他HTML5语义元素的后代。

上述这些元素倒是可以放到main元素中。

### <section>元素

section元素用于定义文档或应用中一个通用的区块。
例如，可以用section包装联系信息、新闻源，等等。
关键是要知道这个元素不是为应用样式而存在的。
如果只是为了添加样式而包装内容，还是像以前一样使用div吧。

在开发Web应用时，我一般会用section包装可见组件。
这样可以清楚地知道一个组件的开始和结束。

那到底什么时候该用section元素呢？
可以想一想其中的内容是否会配有自然标题。
如果没有，那最好还是选div。


### <nav>元素

\<nav>元素用于包装指向其他页面或同一页面中不同部分的主导航链接。
但它不一定非要用在页脚中（虽然用在页脚中是可以的）；

页脚中经常会包含页面公用的导航。

如果你通常使用无序列表和列表标签来写导航，那最好改成用nav嵌套多个a标签。

### <article>元素

\<article>跟\<section>元素一样容易引起误解。
为此，我不止一遍读了规范原文。
以下是我对规范的解读。
\<article>用于包含一个独立的内容块。
在划分页面结构时，问一问自己，想放在article中的内容如果整体复制黏贴到另一个站点中是否照样有意义？
或者这样想，想放在article中的内容是不是包含了RSS源中的一篇文章？
明显可以放到article元素中的内容有博客正文和新闻报道。
对于嵌套\<article>而言，内部的\<article>应该与外部\<article>相关。

### <aside>元素

\<aside>元素用于包含与其旁边内容不相关的内容。
实践当中，我经常用它包装侧边栏（在内容适当的情况下）。
这个元素也适合包装突出引用、广告和导航元素。
基本上任何与主内容无直接关系的，都可以放在这里面。
对于电子商务站点来说，我会把“购买了这个商品的用户还购买了”的内容放在\<aside>里面。

### <figure>和<figcaption>元素

与\<figure>相关的规范原文如下：

“····可用于包含注解、图示、照片、代码，等等。”

```
<figure class='MoneyShot">
    <img class="MoneyShotImg" src="img/scones.jpg" alt="Incredible scones" />
    <figcaption class="ImageCaption">Incredible scones, picture form Wikipedia</figcaption>
</figure>
```

这里用\<figure>元素包装了一个小小的独立区块。
在它里面，又使用\<figcaption>提供了赋figure元素的标题。

如果图片或代码需要一个小标题，那么这个元素非常合适。

### <details>和<summary>元素

你是不是常常想在页面中添加一个“展开”/“收起”部件？
用户点击一段摘要，就会打开相应的补充内容面板。
HTML5为此提供了details和summary元素。

```
<details>
    <summary>I ate 15 scones in one day</summary>
    <p>Of course I didn't. It would probably kill me if I did. What a way to go. Mmmm, scones!</p>
</details>
```

在Chrome浏览器中打开，不用添加任何样式，默认只会显示摘要文本。

单击摘要文本，就会打开一个面板。
再点击一次，面板收起。
如果希望面板默认打开，可以为details元素添加open属性。

```
<details>
    <summary>I ate 15 scones in one day</summary>
    <p>................</p>
</details>
```

支持这两个元素的浏览器通常会添加一些样式，以便用户知道可以点击打开面板。
在这个例子中，Chrome（Safari也可以）会添加一个黑色小三角图标。
要禁用这个样式，可以使用针对Webkit的伪选择符：

```
summary::-webkit-details-marker {
    display: none;
}
```

当然，使用同样的选择符也可以添加不同于默认的样式。

目前还不能为展开和收起面板添加动画。
同样，也不能收起其他面板。
我不太清楚这些特性将来是否可以得到支持。
应该把它想象成以前使用JavaScript切换display:none的效果。

Firefox和IE都不支持上述行为，只会渲染出两个行内元素。
有相应的腻子脚本（https://mathiasbynens.be/notes/html5-details-jquery），希望将来这两个浏览器能原生支持它们。

### <header>元素

实践中，可以将\<header>元素用在站点页头作为“报头”，或者用在\<article>元素中用作某个区块的引介区。它可以在一个页面中出现多次（比如页面中每个\<section>中都可以由一个\<header>）。

### <footer>元素

\<footer>元素应该用于在相应区块中包含与区块相关 内容，可以包含指向其他文档的链接，或者版权声明。与\<header>一样，\<footer>同样可以在页面中出现多次。比如，可以用它作为博客的页脚，同时用它包含文章正文的末尾部分。**不过，规范里说了，作者的联系信息应该放在\<address>元素中。

### <address>元素

\<address>元素明显用于标记联系人信息，为最接近的\<article>或\<body>所用。
不过有一点不好理解，它并不是为包含邮政地址准备的（除非该地址确实是相关内容的联系地址）。
邮政地址以及其他联系信息应该放在传统的\<p>标签里。

我不太喜欢用\<address>，因为我觉得如果能单独使用它来标记某个物理地址会更有用，但这只是个人偏好。希望你能觉得它有用。

### h1 到 h6

最近我才知道，原来规范是不推荐使用h1到h6来标记标题和副标题的。
我说的是比如这样：

```
<h1>Scones:</h1>
<h2>The most respledent of snacks</h2>
```

HTML5 规范是这么说的：

“h1到h6元素不能用于标记副标题、字幕、广告语，除非想把它们用作新区域或子区块的标题。”

这应该是规范中少见的表述清晰的句子了。

那我们怎么估计其可能性呢？
规范本身有一整节在讲这些（https://www.w3.org/TR/html5/common-idioms.html#common-idioms）。我个人更喜欢会用\<hgroup>元素，只可惜它已经风光不再了。根据规范的建议，前面的代码应该重写成这样：

```
<h1>Scones: </h1>
<p>The most resplendent of snacks</p>
```

## HTML5 文本级元素

除了刚刚介绍的结构化和分组元素，HTML5还修订了一些以前作为行内元素使用的标签。
修订之后，HTML5规范称它们为“文本级语义标签”（https://www.w3.org/TR/html5/text-level-semantics.html#text-level-semantics）。

下面来看几个常见的例子。

### <b>元素

过去，人们常用\<b>元素来加粗文本。
追溯历史，这种用法起源于让标记语言承担样式功能的时候。
而现在。可以把它用作一个添加CSS样式的标记，正如HTML5规范所说：

“\<b>元素表示只为引人注意而标记的文本，不传达更多的重要性信息，也不用于表达其他的愿望或情绪。比如，不用于文章摘要中的关键词、评测当中的产品名、交互式文本程序中的可执行命令，等等。”

尽管现在的\<b>元素并无特殊含义，但既然它是文本级的，那就不能用它来包围一大段其他标记，这时候应该用div。另外，由于过去人们常用它来加粗文本，如果你不想让它把自己的内容展示为粗体，一定要在CSS理重置它的font-weight。

### <em>元素

没错，我一般用\<em>就只是为了给文本添加样式。
我需要调整自己的用法，因为HTML5说：

“em元素表示内容中需要强调的部分。”

因此，除非你想强调内容，否则可以考虑\<b>标签，或者在合适的情况下，选\<i>也行。

### <i>元素

HTML5规范里这么描述\<i>元素：

“一段文本，用于表示另一种愿望或情绪，或者以突出不同文本形式的方式表达偏离正文的意思。”

总之，它不仅仅用于把文本标为斜体。
比如，可以用它在文本中标记出少见的名字：

```
<p>However, discussion on the hgroup element is now frustraneous as it is now gone the way of the <i>Raphus cucullatus</i>.</p>
```

## 作废的HTML特性

除了脚本链接中的语言特性外，还有一些之前常用的特性现在在HTML5中已经作废了。
HTML5宣布作废的特性可分两类：兼容和不兼容。
兼容特性还可以用，但在验证器中会收到警告。
现实当中应该不用它们，但用它们也不会出什么问题。
不兼容特性可能在某些浏览器中仍然可以正确渲染，但确实非常不鼓励你用，如果你非要用，可能会有问题。

说到作废和不兼容特性，实际上很多我以前都没用过，有些甚至从来不知道）。
相信不少读者跟我类似。
不过，要是你真的很好奇，可以看看这个完整的作废且不兼容特性的列表：
[作废且不兼容特性列表](http://www.w3.org/TR/html5/obsolete.html)。

主要包括： strike、center、font、acronym、frame和frameset。

还有一些特性在最初的HTML5草案中存在过，但现在已经删掉了。
比如hgroup，最初想用它作为标题组，可以把主标题h1和副标题h2放到它里面。
不过，现在再讨论hgroup已经没有意义，因为它已经作古（可以google，如果你愿意可以试试）。

## 使用 HTML5 元素

现在该实际用一用我们介绍的HTML5 元素了。

看看下面的代码哪些用上了新的HTML5元素？

```
<article>
    <header class="header">
        <a href="/" class="LogoWrapper">
            <img src="img/SOC-Logo.png" alt="Scone O'Clock logo"/>
        </a>
    </header>
    <section class="IntroWrapper">
        <p class="IntroText">Occasionally maligned and misunderstood; the scone is a quintessentially British classic.</p>
        <figure class="MoneyShot">
            <img class="MoneyShotImg" src="img/scones.jpg" alt="Incredible scones"/>
            <figcaption class="ImageCaption">Incredible scones, picture from Wikipedia</figcaption>
        </figture>
    </section>
    <p>Recipe and serving suggestions follow.</p>
    <section class="Ingredients">
        <h3 class="SubHeader">Ingredients</h3>
    </section>
    <section class="HowToMake">
        <h3 class="SubHeader">Method</p>
    </section>
    <footer>
        Made for the book, <a href="http://rwd.education">'Resonsive web design with HTML5 and CSS3'</a> by <address><a href="http://benfrain">Ben Frain</a></address>
    </footer>
</article>
```

凭常识选择元素

这里删除了很多内部包含的内容，因为我们想聚焦于结构。
相信你也觉得从标记中找出不同的区块并不难。
不过，此时此刻我还是想提供一个实用的建议。
某一时刻选错了标记并不意味着世界末日。

比如，在前面的例子中是用\<section>还是\<div>并没有那么重要。
如果在应该用\<i>的地方用了\<em>，我也不觉得有什么罪恶感。

W3C执行规范的人不会追究你。
你要做的就是运用一点点常识。
也就是说，如果你可以在合适的地方使用\<header>和\<footer>，那么就会带来无障碍方面的好处。

## WCAG 和 WAI-ARIA

早在2011年到2012年，W3C就已经大刀阔斧地决心让编写无障碍网页更简单。

### WCAG

WCAG的宗旨是：

“提供一份能满足个人、组织和政府间国际交流需求的Web内容无障碍的标准。”

一些相对陈旧的网页（相对于单页Web应用而言），有必要参考WCAG指南。
这份指南提供了很多（大部分是常识性的）有关让网页无障碍访问的建议。

每个建议对应一个一致性级别：A、AA或AAA。

关于一致性级别的具体内容，[可以参考这里](https://www.w3.org/TR/UNERSTADING-WCAG20/conformance.html#uc-levels-head)。

看了以后，你可能会发现自己已经按照其中很多建议做了，比如为图片提供替代文本。
可是，我还是建议大家看看这份简明指南（https://www.w3.org/WAI/WCAG20/glance/Overview.html），然后定义一份属于自己的参考列表（https://www.w3.org/WAI/WCAG20/quickref/）。

强烈建议每一位读者花一两个小时看看这份清单。
其中很多建议实际做起来非常简单，但对用户却能提供很大的便利。

### WAI-ARIA

WAI-ARIA的目标是总体上解决网页动态内容的无障碍问题。
它提供了用于描述自定义部件（Web应用中的动态部分）的角色、状态和属性方法，从而可以让使用辅助月设备的用户识别并利用这些部件。

举个例子，如果屏幕上有一个部件显示不断更新的股票价格，那失明的用户在访问这个页面时怎么知道那是股价呢？WAI-ARIA致力于解决这些问题。

**不要对语义元素使用角色**

以前，给页头或页脚添加“地标”角色是推荐的做法，比如：

```
<header role="banner">A header with ARIA landmark banner role</header>
```

可是现在看来这样做事多余的。
如果你看规范，找到前面介绍的那些元素，都会看一个Allowed ARIA role attribute部分。
以下就是section元素对应部分的说明：

“可以使用的ARIA role属性值：region（默认，不要设置）、alert、alertdialog、application、contentinfo、dialog、document、log、main、marquee、presentation、search或status。”

这里的关键是“region（默认，不要设置）”。这句话表明给这个元素添加ARIA角色并没有意义，因为元素本省已经暗含了相应的角色。规范中的一个说明让我们更容易理解这一点：

“多数情况下，设置与ARIA默认暗含的语义匹配的ARIA角色或aira-*属性是不必要的，也是不推荐的，因为浏览器已经设置了这些属性。”

### 如果你只能记住一件事

方便辅助技术的最简单方式就是尽可能使用正确的元素。
比如header元素远比div class="Header"有用。
类似地，如果页面中有一个按钮，使用button元素（而不是span或其他用样式装扮成按钮的元素）。
我承认，有时候并不能随心所欲地给button设置样式（比如display: table-cell或display: flex），但这时候至少应该选择更接近的方案，比如\<a>标签。

### ARIA的更多用途

ARIA并非只能用于标记“地标”。
关于它的更多用途，可以看这份关于角色及其适用场景的简洁介绍：https://www.w3.org/TR/wai-aria/roles。

另外，我想推荐大家看一看Heydon Pickering的书：Apps For All: Coding Accessible Web Applications。

```
使用NCVDA测试你的设计

如果你在Windows平台上做开发，可能希望在屏幕阅读器上测试ARIA特性。
为此，我推荐NVDA（Non-Visual Desktop Access），它免费，地址是：http://www.nvaccess.org/。

谷歌的Chrome浏览器现在也提供了免费的"Accessibility Developer Tools”（可跨平台），非常值得一试。

还有越来越多的工具可以用来快速测试色盲用户的体验等。

比如， https://michelf.ca/projects/sim-daltonism/就是一个Mac应用，可以切换色盲的类型，让你在浮动的调色板中看到预览。

最后，OS X也包含一个VoiceOver实用工具，可用于测试网页。
```

希望以上对WAI-ARIA和WCAG的简单介绍，可以让你稍微想一想怎么通过自己的设计方便那些使用辅助技术上网的用户。在下一个HTML5项目里增加对辅助技术的支持并不像你想象的那么难。

最后再向大家推荐一个关于无障碍性的资源，那就是A11Y项目：http://a11yproject.com/。

这个网站上有很多链接和实用的建议。


## 在 HTML5 中嵌入媒体

对很多人来说，是苹果拒绝在iOS设备中支持Flash才让HTML5进入他们的视野。
Flash的市场份额曾经非常之高，主要用于在网页中播放视频。
然而，苹果并没有选择实用Adobe专有的技术，而是决定使用HTML5渲染富媒体内容。
虽然HTML5在富媒体方面确实有了长足进步，但苹果的公开支持却给了它很大的推动，使其媒体工具获得了社区的广泛关注。

可以想见，IE8及更低版本的IE不支持HTML5视频和音频。
多数其他现代浏览器(Firefox 3.5+、Chrome 4+、Safari 4、Opera 10.5、IE9+、iOS 3.2+、Opera Mobile 11+、Android 2.3+)都能正常处理它们。

### 使用 HTML5 视频和音频

在HTML5中添加视频和音频很简单。
唯一麻烦的是列出可替代的媒体资源（因为不同的浏览器支持的媒体格式不同）。
目前，MP4已经是可以跨桌面和移动平台的格式，因此在网页中添加HTML5视频也变得非常简单。

以下是一个使用 HTML5 链接到视频的例子：

```
<video src="myVideo.mp4"></video>
```

在 HTML5 中，只要一对\<video>\</video>（或\<audio>\</audio>）标签就可以了。
也可以在这对标签中间添加文本，以便出问题时让用户知道这里是什么。
当然，还有一些属性是通常都需要添加的，比如width和height：

```
<video src="myVideo.mp4" width="640" height="480">What, do you mean you don't understand HTML5? </video>
```

好，如果把前面的代码放到网页里，用Safari打开，就能看到视频，但没有播放控件。
要使用默认的播放控件，还需要添加controls属性。
也可以添加autoplay属性（不推荐，因为大家都不喜欢默认播放视频）。
请看下面修改后的代码：

```
<video src="myVideo.mp4" width="640" height="480" controls autoplay>
What, do you mean you don't understand HTML5?</video>
```

添加了前面的属性后，就可以在浏览器中看到下面的屏幕截图了：

其他属性还有: preload用于控制媒体的预加载， loop用于重复播放，还有poster用于设置视频的首屏图像。预加载对于缓存视频延迟很有用。要使用某个属性，只要在标签中添加它即可，比如：

```
<video src="myVideo.mp4" width="640" height="480" controls autoplay preload="auto" loop poster="myVideoPoster.png">What, do you mean you don't understand HTML5?</video>
```

**旧版本浏览器的后备**

如果需要，可以使用\<source>标签在旧版本的浏览器中提供后备资源。
比如，除了提供MP4版本的视频，如果想让IE8及更低版本的IE也能看到视频，可以添加一个Flash源作为后备。更进一步，如果用户浏览器没有任何播放条件，还可以提供一个下载视频的链接。

```
<video width="640" height="480" controls preload="auto" loop poster="myVideoPoster.png">
    <source src="video/myVideo.mp4" type="video/mp4">
    <object width="640" height="480" type="application/x-shockwaveflash" data="myFlashVideo.SWF">
        <param name="movie" value="myFlashVideo.swf">
        <param name="flashvars" value="controlbar=over&amp;image=myVideoPoster.jpg&amp;file=myVideo.mp4" />
        <img src="myVideoPoster.png" width="640" height="480" alt="_TITLE_" title="No video playback capabilities, please download the video below" />
    </object>
    <p><b>Download Video:</b> MP4 Format: <a href="myVideo.mp4"> "MP4" </a></p>
</video>
```

### audio与vedio几乎一样

\<audio>标签与\<video>标签的属性相同（当然不包括width、height和poster）。它们的主要区别，当然是音频没有视频需要的播放区域。

## 响应式 HTML5 视屏与内嵌框架

我们已经看到了，支持老旧版本浏览器会导致代码臃肿。
本来就一两行的video标签，为了支持旧版本的IE得变成十几行（外加一个Flash文件）！
我个人一般为了追求文件更小，不会添加Flash后备；当然，每个人的情况不同。

现在，HTML5视频的唯一问题就是它不是响应式的。
没错，这是一个在讲响应式Web设计的书里出现的一个不“响应”的例子。

不过，对于HTML5嵌入视频，要让它变成响应式的很简单。
只要把高度和宽度属性删掉（比如，删除width="640" height="480"），并添加以下CSS：

```
video {
    max-width: 100%;
    height: auto;
}
```

这样虽然能解决本地服务器上的视频问题，却不能解决内嵌框架中的嵌入视频。
以下代码会在当前页面添加来自YouTube的《午夜狂奔》的电影预告片：

```
<iframe width="960" height="720" src="https://www.youtube.com/watch?v=B1_N28DA3gY" frameborder="0" allowfullscreen></iframe>
```

如果就这样添加到页面中，即使应用了前面的CSS，当视口小于960像素时，也会有一部分影像被遮住。

解决这个问题的最简单方式，就是采用法国CSS大师Thierry Koblentz的技术。
本质上是创建一个比例相同的盒子来包含视频。
关于这里边有什么“魔法”，这里就不泄漏了。

大家看原文吧！

[原文地址](http://alistapart.com/article/creating-intrinsic-ratios-for-video)

如果你稍微懒那么一点点，还可以根本不用计算什么比例，也不用自己写插入代码，因为有这样的在线服务。打开(http://embedresponsively.com)，把内嵌框架的URL粘贴进去。然后你就会得到一段代码，把它贴到自己的页面里就行了。比如，我们《午夜狂奔》的电影预告片会得到以下代码：

```
<style>
.embed-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
    height: auto;
}

.embed-container iframe, .embed-container object, .embed-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>

<div class="embed-container">
    <iframe src="http://www.youtube.com/embed/B1_N28DA3gY" frameborder="0" allowfullscreen>
    </iframe>
</div>
```

这就是所有代码了，把它粘贴到网页中就成了。
这样，就有了一个响应式的YouTube视频。
(听着孩子，别跟罗伯特·唐尼学，吸烟不好)。

## 小结

这一章的内容可不少。
从基本的HTML5网页结构，到嵌入富媒体（视频）并确保它们适应视口变化，可谓应有尽有。

虽然这一章内容并不专门针对响应式设计，但我们了解了如何编写富有语义的代码，知道了怎么让网页对那些依赖辅助技术的用户同样有用。