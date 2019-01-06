# CSS3 新特性

---
绝大部分引用自《响应式Web设计 HTML5和CSS3实战（第2版）
---

## 没人无所不知

没人什么都知道。
我使用CSS已经10多年了，每周都会发现新的CSS特性（或者发现某些自己以前知道但忘了的东西）。
为此，我认为企图知道CSS的所有属性和值的可能组合是不现实的，与其如此，不如让自己知道可以用CSS实现什么更好。

## 剖析 CSS 规则

在具体探讨CSS新特性之前，为避免概念不清，有必要先明确一下CSS规则的构成。
以下面的代码为例：

```
.round {
    /* 选择符 */
    border-radius: 10px; /* 声明 */
}
```

这条规则由选择符(.round)和声明(border-radius: 10px;)构成。
声明又由属性(border-radius: )和值(10px;)构成。

跟你心里的定义一样？很好，咱们继续。

别忘了检查浏览器支持情况，虽然这会让你多思考一会，但是绝对值得这么做。


## 便捷的CSS技巧

在每天的工作中，我发现自己经常会用一些CSS3特性。
把和谐特性分享给大家应该有用。

这些特性能够提高工作效率，特别是对响应式设计非常有帮助，而且可以相对轻松地解决以往令人头疼的问题。

**CSS响应式多列布局**

有没有过把一段文本分成多列显示的需求？
可以把文本分别放在不同的元素中，然后分别添加样式。
可是，纯粹为了添加样式而修改标记并不是值得提倡的。
CSS多列布局规范描述了如何通过多列显示文本。

比如以下标记：

```
<main>
    <p>lloremipsimLoremipsum dolor sit amet, consectetur
    <!-- 省略很多文本 -->
    </p>

    <p>lloremipsimLoremipsum dolor sit amet, consectetur
    <!--省略很多文本-->
    </p>
</main>
```

使用CSS多列布局可以通过几种方式让文本分成多列显示。
可以给每一列设定固定的列宽（比如12rem），也可以指定内容需要填充的列数（比如3）。

下面就用代码说明以上做法。
要设定列宽，使用以下语法：

```
main {
    column-width: 12em;
}
```

以上代码的意思就是内容要填充的列宽度为12em，无论视口多宽。
改变视口宽度会动态改变列数。

一行代码就可以轻松实现响应式多列，不错吧！

1. 固定列数，可变宽度

如果想让列数固定，宽度可变，可以这样写规则：

```
main {
    column-count: 4;
}
```

2. 添加列间距和分隔线

还可以给列间添加间距和分隔线：

```
main {
    column-gap: 2em;
    column-rule: thin dotted #999;
    column-width: 12em;
}
```

关于CSS多列布局，我觉得唯一一点需要说明的，就是如果每一列文本太长可能影响用户体验。这是因为用户需要反复上下滚动页面，也很麻烦。

## 断字

有多少回需要把很长的URL放到很小的空间里，然后又很绝望？

使用一个CSS3声明可以很轻松地修复它，这个声明凑巧还能支持IE5.5：

```
word-break: break-word;
```

### 截短文本

截短文本以前一直是服务器端来做。
今天，只要用CSS照样可以实现了。
下面看看具体怎么做。

比如有如下标记

```
<p class="truncate">Ok, listen up, I've figured out the key eternal happiness. All you need to do is eat lots of scones.</p>
```

以下是实现这一效果的CSS：

```
.truncate {
    width: 520px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: no-wrap;
}
```

只要内容超出既定宽度（如果是在一个弹性容器里，可以设置为100%），就会被截短。

### 创建水平滚动面板

相信有人明白这个标题的意思。
所谓水平滚动面板，就是iTunes商店和AppleTV中显示的相关内容面板（电影、专辑呀什么的）。

在水平空间允许的情况下，可以看到所有商品。
而在空间受限时（比如手机上），面板就可以左右滚动。

滚动面板在安卓和iOS设备上特别适合。

其实说CSS3并不完全对。
这里的关键技术是CSS2.1中的white-space。
这里把它和Flexbox布局机制融合了起来。

为了让这个技术起作用，只需要一个比所有内容加起来都窄的容器，将其X轴的overflow设置为auto。
这样，它会在空间足够的情况下不提供滚动机制，而在空间不够时显示滚动条。

```
.Scroll_Wrapper {
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
}

.Item {
    display: inline-flex;
}
```

这里的white-space: nowrap的意思就是有空白的时候不折行。
为了把所有内容都保持在一行。
我们设置了所有子元素为行内元素。
虽然使用的是inline-flex，其实inline-block或inline-table都可以。

```
::before 和 ::after伪元素

如果查询示例代码，你会发现::before伪元素用于显示项目的数量。
如果使用伪元素，记住为了保证::before和::after显示，它们必须包含一个content值，就算空白也行。

显示之后，这些元素就还选哪个相应元素的第一个和最后一个子元素一样。
```

为了增添点艺术情调，还可以尽量隐藏滚动条。
可惜相应属性只有个别浏览器支持，所以要手工添加前缀（Autoprefixer不会添加这些属性，因为它们是专有的）。此外，这里还可以针对WebKit浏览器（iOS设备）添加一些触摸样式的滚动效果。

好，现在的.Scroll_Wrapper就变成这样了:

```
.Scroll_Wrapper {
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    /*在WebKit的触摸设备上出现*/
    -webkit-over-scrolling: touch;
    /*在支持的IE中删除滚动条*/
    -ms-overflow-style: none;
}

/*防止WebKit浏览器中出现滚动条*/
.Scroll_Wrapper::-webkit-scrollbar {
    display: none;
}
```

空间有限时，就会出现水平滚动面板。否则，内容适应。

这个技术还是有点问题。
首先，在本书写作时，Firefox没有相应属性隐藏滚动条。
其次，老版安卓设备不支持水平滚动。
因此，建议配合特性检测来使用这个技术。

## 在CSS中创建分支

要做出任何地方、任何设备上都同样出色的响应式设计，经常会碰到某些设备不支持什么特性或技术的情况。

此时，往往需要在CSS中创建一个分支。

如果浏览器支持某特性，就应用一段代码；
如果不支持，则应用另一段代码。

如果是在JavaScript中，这种情况就是if/else 或 switch语句的用武之地。

在CSS中创建分支有两种手段。
一是完全基于CSS，但支持的浏览器不多；
二是借助JavaScript库，获得广泛兼容性。

### 特性查询

CSS原生的分支语法就是特性查询，属于CSS Conditional Rules Module Level 3。不过现在，IE11及之前的版本和Safari不支持这个特性。
所以说兼容性不完美。

特性查询与媒体查询语法类似，比如：

```
@supports (flashing-sausages: lincolnshire){
    body {
        sausage-sound: sizzling;
        sausage-color: slighty-burnt;
        background-color: brown;
    }
}
```

这段样式只有浏览器支持flashing-sausages属性才会应用。
我肯定没有浏览器打算支持这个属性，因此@supports块中的样式不会被应用。

下面看一个更实际的例子。
在浏览器支持的情况下使用Flexbox，在不支持的情况下回退到另一种布局方案。比如：

```
@supports (display:flex){
    .Item {
        display: inline-flex;
    }
}

@supports not (display: flex){
    .Item {
        display: inline-block;
    }
}
```

这里定义了一块代码在浏览器支持某特性时应用，定义了另一块代码在浏览器不支持特性时应用。这样写的前提是浏览器支持@supports，可如果妞支持，这两块代码都不会被应用。

如果你涵盖不支持@supports的设备，最好首先写默认的声明，然后再写@supports声明。这样，如果浏览器支持@supports，其中的规则会覆盖默认规则；否则，其中的规则就会被忽略。

因此，前面的例子可以重写成这样：

```
.Item {
    display: inline-block;
}

@supports (display: flex) {
    .Item {
        display: inline-flex;
    }
}
```

### 组合条件

也可以组合条件。
假设我们只想在浏览器支持Flexbox和pointer: coarse时应用某些规则，可以这样写：

```
@supports ((display: flex) and (pointer: coarse)){
    .Item {
        display: inline-flex;
    }
}
```

这里用的是and关键字。
支持的关键字还有or。
假如除了前面两个条件满足之外，如果浏览器支持3D变形也想应用样式，那么可以这样写：

```
@supports ((display:flex) and (pointer:coarse)) or (transform: translate3d(0,0,0)) {
    .Item {
        display: inline-flex;
    }
}
```

注意全面的例子中使用了括号把几个条件分开了。

可惜的是，并非所有浏览器都支持@supports，那怎么办呢？

没关系，有一个非常的JavaScript工具可以解决这个问题。

### Modernizr

在@supports得到广泛支持以前，可以使用Modernizr这个JavaScript工具。
目前，它是在CSS中实现分支的最可靠方式。

在需要对CSS代码开分支的时候，我一般会采用渐进增强的手段。
所谓渐进增强，就是从最简单的可用代码开始，从最基本的功能开始，从支持能力最低的设备开始，逐步增强到支持能力更强的设备。

下面就来看一看怎么基于Modernizr以渐进增强的方式实现CSS代码分支。

使用Modernizr检测特性

如果你做过Web开发，很可能听说过Modernizr，甚至可能用过它。
Modernizr是一个放在网页中用于检测浏览器特性的JavaScript库。
使用Modernizr，只要下载后把它链接到head中就行了：

```
<script src="/js/libs/modernizr-2.8.3-custom.min.js"></script>
```

这样，当浏览器加载页面后，就会运行Modernizr内置的所有测试。
如果浏览器通过测试，Modernizr会在html标签上添加一个类。

比如，Modernizr在检测完浏览器特性后，可能会给html标签添加以下这些类：

```
<html class="js no-touch cssanimations csstransforms csstransforms3d csstransitions svg inlinesvg" lang="en">
```

这些类只反映了部分特性，包括： 动画、变形、SVG、行内SVG，以及对触摸的支持。有了这些类，CSS代码就可以像这样开分支了。

```
.widget {
    height: 1rem;
}

.touch .widget {
    height: 2rem;
}
```

在前面的例子中，部件本来是1rem高，但如果html标签上由touch类，那么它就会变成2rem高。

同样的逻辑也可以反过来写：

```
.widget {
    height: 2rem;
}

.no-touch .widget {
    height: 1rem;
}
```

这样就是让部件默认为2rem高，而在html标签上由no-touch类时变成1rem高。

不管怎么写代码，Modernizr都可以为分支代码提供支持。
这样，如果你想使用transform3d，同时又想在不支持的浏览器中提供后备，那用Modernizr就会非常方便。

## 新CSS3选择符

CSS3提供了很多新的选择符。
虽然新选择符听起来好像没那么耀眼，但它们确实能提高编码的效率，让你爱上CSS3。下面就来介绍它们。

### CSS3 属性选择符

可能有人使用过属性选择符，比如以下规则:

```
img[alt] {
    border: 3px dashed #el5f5f;
}
```

其中的选择符选择任何包含alt属性的元素。
好，如果想选择包含data-sausage属性的元素，就可以这样写：

```
[data-sausage] {
    /* 样式 */
}
```

没错，只要在方括号中给出属性名就行。

如果同时指定属性的值，还可以进一步缩小搜索范围。比如，以下规则：

```
img[alt="sausages"] {
    /* 样式 */
}
```

只会选择alt属性值为 sausages 的元素，比如：

```
<img class="oscarMain" src="img/sausages.png" alt="sausages" />
```

不过，以上选择符在CSS2里就可以用了。
CSS3又给属性选择符增加了什么新特性？

### CSS3 子字符串匹配属性选择符

CSS3支持依据属性选择符包含的子字符串来选择元素。

听起来不太直观，但实际上并不难。

根据子字符串匹配元素分三种情况：

- 以·····开头

- 包含·····

- 以·····结尾

下面分别看一看。

1. 以·····开头

看下面的标记：

```
<img src="img/ace-film.jpg" alt="film-ace"/>
<img src="img/rubbish-film.jpg" alt="film-rubbish"/>
```

可以使用“以·····开头” 选择符来选择这两个图片:

```
img[alt^="film"] {
    /* 样式 */
}
```

这里关键是^符号，它表示“以·····开头”。
因为这两个图片的alt属性都以film开头，所以这个选择符匹配它们俩。

2. 包含······

“包含·····” 的属性选择符是这样的：

```
[attribute*="value"] {
    /* 样式 */
}
```

与前面一样，可以将它和标签类型联用，不过我是只会在必要时才那么做（比如要修改使用元素类型）。

看下面的标记：

```
<p data-ingredients="scones cream jam">Will I get selected? </p>
We can select that element like this:
[data-ingredients*="cream"] {
    color: red;
}
```

这里面关键是*符号，它的意思是 “包含·····”。

“以·····开头” 选择符显示不行，因为属性值并不是以cream开头。

但“包含······” 是可以的。

3. 以·····结尾

“以·····结尾” 选择符的语法如下：

```
[attribute$="value"] {
    /* 样式 */
}
```

看个例子更便于理解：

```
<p data-ingredients="scones cream jam">Will I get selected?</p>
<p data-ingredients="toast jam butter">Will I get selected?</p>
<p data-ingredients="jam toast butter">Will I get selected?</p>
```

假设我们只想选择包含 data-ingredients 属性中同时包含 scones、cream和jam的元素（第一个元素）。这时候可以使用“以·····结尾” 选择符：

```
[data-ingredient$="jam"] {
    color: red;
}
```

这里关键是 $ 符号，意思是 “以······结尾”。

### 属性选择符的注意事项

对属性选择选择符而言，属性被当成一个字符串。比如以下CSS规则：

```
[data-film^="film"] {
    color: red;
}
```

并不会选择以下元素：

```
<span data-film="awful moulin-rouge film">Moulin Rouge is dreadful</span>
```

这是因为data-film属性并不以film开头，而是以awful开头。

除了前面介绍的三种属性选择符，还可以使用“空格分隔的” 属性选择符（注意~符号），IE7都支持：

```
[data-film~="film"] {
    color: red;
}
```

当然也可以选择整个属性：

```
[data-film="awful moulin-rouge film"] {
    color: red;
}
```

或者，如果你只想以某两个（或任意多个）子字符串是否存在为依据，也可以这样写：

```
[data-film*="awful"][data-film="moulin-rouge"] {
    color: red;
}
```

没有哪种方法是唯一正确的。实践中可以根据属性值的复杂程度做出选择。

### 属性选择符选择以数值开头的ID 和类

在HTML5之前，以数值开头的ID和类是无效的。
HTML5放开了这个限制。
说到ID，不能忘了ID不能包含空格，而且必须在页面中唯一。
更多信息可以参考这个链接：
[链接](http://www.w3.org/html/wg/drafts/html/master/dom.html)。

虽然HTML5允许ID和类以数值开头，但CSS还不允许使用以数值开头的选择符（http://www.w3.org/TR/CSS21/syndata.html)。

然而，使用属性选择符却可以绕过CSS的限制。
比如： 

```
[id="10"]
```

## CSS3 结构化伪类

CSS3 为我们提供了更多基于元素之间的位置关系选择它们的选择符。

下面看一个常见的设计场景，假设有一个针对较大视口的导航条，我们想让其中除最后一项之外的其他项显示在左侧。

```
<nav class="nav-wrapper">
    <a href="/home" class="nav-link">Home</a>
    <a href="/About" class="nav-link">About</a>
    <a href="/Films" class="nav-link">Films</a>
    <a href="/Forum" class="nav-link">Forum</a>
    <a href="/Contact-us" class="nav-Link nav-linkLast">Contact Us</a>
</nav>
```

这样做本身就有问题。
比如，在某些内容管理系统中，给最后一个链接添加额外的类并不容易。
好在，这个问题放在今天已经不是问题了。
利用CSS3提供的结构化伪类，可以轻松处理类似问题。

### :last-child

CSS 2.1 中就有一个用于匹配列表中第一项的选择符：

```
div:first-child {
    /* 样式 */
}
```

CSS3 又增加了一个可以选择最后一项的选择符：

```
div:last-child {
    /* 样式 */

}
```

看一下怎么用这个选择符解决前面提到的问题：

```
@media (min-width: 60rem) {
    .nav-Wrapper {
        display: flex;
    }
    .nav-link:last-child {
        margin-left: auto;
    }
}
```

还有专门针对只有一项的选择符：only-child和唯一一个当前标签的选择符：only-of-type。

### nth-child

使用nth-child选择符可以解决更麻烦的问题。
还是与前面一样的标记，下面看看怎么使用nth-child来选择任意链接。

首先，如果想隔一个选一个怎么办？

可以这样选择奇数个：

```
.nav-Link:nth-child(odd) {
    /* 样式 */
}
```

或者像这样选择偶数个：

```
.nav-Link:nth-child(even) {
    /* 样式 */
}
```

### 理解 nth

经验少的读者可能会觉得nth很吓人。
可是，只要掌握了它的逻辑和语法，发现就会发现它能让你做的事非常棒。

CSS3提供了以下几个基于nth的规则：

- nth-child(n)

- nth-last-child(n)

- nth-of-type(n)

- nth-last-of-type(n)

前面已经展示了可以在nth-child后面使用(odd)和(even)分别选择奇数和偶数个元素。

除此之外，参数(n)还有另外两种写法。

- 传入整数。比如nth-child(2)会选择第二项。

- 传入数值表达式。例如nth-child(3n+1)会从第一项开始，然后每三个选一个。

整数n很好理解，只要传入想要选择的元素的序号就行了。

n作为数值表达式对于普通人特别是数学不好的人来说就没那么好理解了。
如果你数学很好，下一节其实不用看。
否则，下一节就是给你准备的了。

一点数学

假设页面中有10个span：

```
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
```

它们默认的样式如下：

```
span {
    height: 2rem;
    width: 2rem;
    background-color: blue;
    display: inline-block;
}
```

没错，结果就是10个方块排成一行：

下面看看怎么通过基于nth的选择符选择不同的方块。

我们只看括号里的表达式，从右边开始。
好，假设要知道（2n+3）会选择什么，我们先看括号里最右边的数（这里的3表示从左数第三个），然后就知道是以它为起点每几个选一个。
因此，添加以下规则：

```
span:nth-child(2n+3) {
    color: #f90;
    border-radius: 50%;
}
```

在浏览器中会得到如下结果：

显然，这个nth选择符从第三项开始，每两项选择一项（如果有100个方块，还会继续向右选下去）。

如果想选择从第二项开始往后的所有方块呢？
可以写成:nth-child(n+2)。

同样，如果想每3个选1个，也不用写成: nth-child(3n+3)，而是可以直接写成：nth-child(3n)。这是因为每3个就意味着从第3个开始，不用再明确写出来了。

表达式中也可以出现负值，比如：nth-child(3n-2)，表示从第-2个元素开始，每3个选1个。

除了指定起点，也可以更改方向。
默认情况下，在找到起点元素之后，后续的选择会沿DOM向下。
如果你想反转方向呢？添个减号就行了，比如：

```
span:nth-child(-2n+3){
    background-color: #f90;
    border-radius: 50%;
}
```

这样也是先找到第三项，但之后就会沿着与默认相反的方向，DOM向上，每2个选1个。

接下来，nth-child和nth-last-child的区别在于，nth-last-child是从DOM的另外一头开始。
比如 :nth-last-child(-n+3)，就是从倒数第三个开始向后选择所有项。

最后，再看看 :nth-of-type 和 :nth-last-of-type。
前面的例子只考虑了子元素，并没有区分标记类型(nth-child选择符选择的是同级DOM中的子元素，与类无关)，而:nth-of-type和:nth-last-of-type 就要区分类型了。

```
<span class="span-class"></span>
<span class="span-class"></span>
<span class="span-class"></span>
<span class="span-class"></span>
<span class="span-class"></span>
<div class="span-class"></div>
<div class="span-class"></div>
<div class="span-class"></div>
<div class="span-class"></div>
<div class="span-class"></div>
```

如果我们使用下面的选择符：

```
.span-class:nth-of-type(-2n+3){
    background-color: #f90;
    border-radius: 50%;
}
```

那么虽然所有元素都有相同的类span-class，但这里只会选择带有该类的span元素（因为第一个选中的元素的类型是span）。

CSS3的计算规则与JavaScript和jQuery不同

JavaScript和jQuery都是从0开始计数的。
换句话说，JavaScript和jQuery中的1实际上代表第二个元素。
但CSS3则从1开始计数，因此1就是第一项。

### 基于 nth 的选择与响应式设计

这一节我们会展示一个真实的应用场景，看一看如何在响应式设计中运用基于nth的选择符解决问题。

还记得之前的水平滚动面板吗？

目前要考虑的场景是不能水平滚动，因此我们要使用同样的标记，把2014年最卖座的10部电影显示在网格中。

在小视口中，网格只有两项宽；
在大一点的视口中是三项宽，再大一点就是四项宽。
问题来了：无论视口多大，我们都希望最底部那一行不显示底部边框。

看到最后两项底部讨厌的边框了吗？
我们的问题就是怎么去掉它。
不过，方案要足够灵活，这样即使最后一行又多出一项，那一项的底部边框也照样能被去掉。
由于不同视口中每一行的项数不同，必须针对视口改变基于nth的选择符。

为简单起见，这里指给大家展示匹配每行四项的情况。
其他视口下的选择符，大家可以看示例代码。

```
@media (min-width: 55rem) {
    .Item {
        width: 25%;
    }
    /* 每4个选1个，但仅限于最后4项 */
    .Item:nth-child(4n+1):nth-child(-n+4),
    /* 取得该集合后面的每一项 */
    .Item:nth-child(4n+1):nth-last-child(-n+4) ~ .Item {
        border-bottom: 0;
    } 
}
```

**这里我们连缀使用了基于nth的伪类选择符。而这里的关键，是要理解第一项并不决定接下来的选择范围，而是决定每个选择范围中必须匹配的元素。对前面的例子而言，第一个元素必须是每4个中的第一个元素，同时必须是最后4个中的一个。**

