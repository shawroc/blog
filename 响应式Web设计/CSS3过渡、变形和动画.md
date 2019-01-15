# CSS3过渡、变形和动画

---
绝大部分引用自《响应式Web设计 HTML5和CSS3实战（第2版）
---

从历史上看，每当需要移动元素或者添加动画效果时，这就是JavaScript的专属领域。
现如今，通过CSS3的三个主要代理-过渡(transition)、变形(transform)和动画(animation)——就可以完成大部分动画工作。

事实上，只有过渡和动画和运动相关的，变形只是让我们去改变元素。

但是正如我们看到的，在制作优秀动画效果时，它们三个都是不可或缺的。

## 什么是 CSS3 过渡以及如何使用它

当元素的CSS状态改变时，过渡是最简单的创造视觉效果的方式。
让我们看一个简单的例子，当鼠标悬停在一个元素上时，元素从一个状态过渡到另一个状态。

我们在给超链接设置样式的时候，一般都会设置一个悬停状态的效果，这种方法能明显地提醒用户他的鼠标指向的是一个超链接。

虽然悬停状态对越来越多的触摸设备没有太大用户，但是对于使用鼠标的用户来说，却是与网站交互的一种简单使用的方式。

我们用这个例子来说明过渡。

在使用CSS的时候，悬停状态通常就是一个开关。
元素默认有一个状态，然后在鼠标悬停其上时马上切换到另一种状态。
而CSS3的过渡，顾名思义，允许我们在不同的状态之间切换。

```
先让我们了解几个重要的事情。
首先，你不能从display: none；状态开始过渡。
当某个元素被设置为dosplay: none的时候，事实上它没有被“绘制”在屏幕上，所以没有状态让你进行过渡。

为了创造渐进的效果，你需要修改opacity或者position的值。

其次，并非所有属性都可以进行过渡。

为免你做无用的尝试，请看可以进行过渡的元素的列表： https://www.w3.org/TR/css3-transtion/。

```

```
<nav>
    <a href="#">link 1</a>
    <a href="#">link 2</a>
    <a href="#">link 3</a>
    <a href="#">link 4</a>
    <a href="#">link 5</a>
</nav>
```

相关CSS代码如下：

```
a {
    font-family: sans-serif;
    color: #fff;
    text-indent: 1rem;
    background-color: #ccc;
    display: inline-flex;
    flex: 1 1 20%;
    align-self: stretch;
    align-items: center;
    text-decoration: none;
    transition: box-shadow 1s;
}

a + a {
    border-left: 1px solid #aaa;
}

a: hover {
    box-shadow: inset 0 -3px 0 #CC3232;
}
```

在本例中，当鼠标悬停在链接上时，我们在底部添加了红色阴影。
我选择box-shadow是因为它不会像border那样影响元素的页面布局。

在通常情况下，悬停的时候，链接会从状态一（没有红线）切换到状态二（带有红线）；
它看起来像一个开关。

然而，以下这行代码：

```
transition: box-shadow 1s;
```

在box-shadow上，将会耗时1秒，从现存状态切换到悬停状态。

```
你会注意到，我们在上述例子的CSS中使用了相邻兄弟选择器+。
这表示，如果一个选择器直接跟随另一个选择器，那么就应用大括号内的样式。

这在我们不想为第一个元素添加左边框的时候十分有用。
```

注意，在CSS中过渡属性应用到元素的初始状态而不是结束状态上。
简言之，过渡声明时应该在from而不是to状态上。

这样，不同的状态，比如:active，也可以有不同的样式集，却有一样的过渡。

### 过渡相关的属性

- transition-property: 要过渡的CSS属性的名字（如background-color、text-shadow或者all，all会过渡所有过渡的属性。

- transition-duration: 定义过渡效果持续的时长（用秒进行定义，例如.3s、2s或1.5s)。

- transition-timing-function: 定义过渡期间的速度变化（例如ease、linear、ease-in、ease-out、ease-in-out或者cubic-bezier）。

- transition-delay: 可选，用于定义过渡开始前的延迟时间。相反，将值设置为一个负数，可以让过渡效果立即开始，但过渡旅程会在半路结束。同样是用秒进行定义，例如.3s、2s或2.5s。

单独使用各种过渡属性创建过渡效果的语法如下：

```
.style {
    /*...（其他样式）...*/
    transition-property: all;
    transition-duration: 1s;
    transition-timing-function: ease;
    trnsition-delay: 0s;
}
```

### 过渡的简写语法

我们可以把这些独自声明的属性组合成一个简写版：

```
transition: all 1s ease 0s;
```

需要注意的是，当使用简写语法的时候，第一个和事件有关的值会被应用给transition-duration，而第二个则会应用到transition-delay上。

我一般倾向于使用缩写版，因为那样我只要定义需要过渡的属性和过渡的时长即可。

还有一个小问题：定义那些你真的需要过渡的属性。定义成all是十分方便的，但是如果你只需要过渡透明度，那么就把transition-property设成opacity，否则你会加重浏览器的负担。

在大部分情况下，这并不是什么大问题，但如果你想提供最佳的网站性能，特别是在老式浏览器上，每一个小点都需要注意。

```
过渡的支持度非常高，但是和以往一样，记得使用像Autoprefixer之类的工具添加相应的浏览器私有前缀。你可以在[caniuse](http://caniuse.com)上查阅浏览器的支持度。

简写版:

过渡和2D变形在除IE9及更旧版之外的浏览器上都能正常工作。
除了IE9及更旧版本、Android 2.3及更旧版本，以及Safari 3.2及更旧版本外，3D变形在其余所有浏览器上都能正常使用。
```

### 在不同时间段内过渡不同属性

当一条规则要实现多个属性过渡时，这些属性不必步调一致。看看下面这段代码：

```
.style {
    /* ...（其他样式）... */
    transition-property: border, color, text-shadow;
    transition-duration: 2s, 3s, 8s;

}
```

此处我们通过transition-property来指定过渡border、color和text-shadow。
然后，在transition-duration声明中，我们设定边框过渡效果应该2秒内完成、文字颜色3秒、文字阴影8秒。由逗号分隔的过渡持续时间按顺序对应上面的CSS属性。

### 理解过渡调速函数

声明一个过渡时，属性、持续时间和延迟都简单易懂。
然而，过渡调速函数就有点让人摸不着头脑了。
ease、linear、ease-in、ease-out、ease-in-out和cubic-bezier都是做什么用的呢？

其实他们就是预置好的贝塞尔曲线，本质上是缓动函数。
或者更简单地说，就是过渡在数学上的描述。
可视化这些曲线通常更简单，所以我向你[推荐](http://cubic-bezier.com/) 和 [easings](http://easings.net)。

这两个网站可以让你去对比各种调速函数，查看它们之间的区别。

不过，就算你能闭着眼睛写出贝塞尔曲线，在实际使用中，也不会有什么太大的区别。
为什么呢？和其他增强效果一样，使用过渡效果也需要长个心眼。
在现实中，如果过渡效果持续事件过长，会让人感觉网站很慢。

例如，导航链接用5秒来完成过渡，只会让你的用户骂娘而不是赞叹。
**感知速度对用户来说非常重要，所以我们必须让网站和应用尽可能快。**

因此，除非有什么特殊理由，使用快速的（以我的经验最多1秒）默认过渡效果（ease）往往是最好的。

### 响应式网站中的有趣过渡

你小时候有没有遇到过这种情况：一天，一个家长楚门了，然后另外一个家长对你说：“既然爸爸妈妈不在家，我们可以给你的早餐麦片加些糖，不过你要对他们保守秘密哦。”

我对这件事可是十分内疚啊。

那么现在，让我们来给自己加点糖。当媒人看到的时候，我们来做点有趣的事情。
我并不支持你在生产环境中这么做，但是你可以在你的响应式项目中加上这句代码：

```
* {
    transition: all 1s;
}
```

此处，我们使用CSS通配选择器 * 来选择页面的所有元素，然后为所有元素都设置一个耗时1s的过渡效果。**声明中省略了过渡调速函数，浏览器会默认使用ease**。声明中同样省略了延迟时间，浏览器会默认使用none，所以过渡效果不会有延迟。

最终效果会是怎样的呢？试着调整浏览器窗口大小，大多数效果（超链接、悬停状态等）和你所期望的一样。

不过，因为所有元素都被应用了过渡，自然也就包括媒体查询中的规则，所以当浏览器窗中大小发生变化时，页面元素将从一种排列方式过渡为另一种排列方式。

必须这么做吗？当然不是！

但这种效果是不是即好看又好玩？没错！好吧，现在趁妈妈没注意到，把规则去掉吧！！

### CSS 的 2D 变形

虽然两个英文单词发音类似，但CSS变形(transformation，包括2D变形和3D变形)和CSS过渡(transition)完全不同。

可以这么理解：过渡是从一种状态平滑转换到另一种状态，而变形则定义了元素将会变成什么样子。

我自己（极其幼稚）的理解是这样的：想象一下《变形金刚》里的擎天柱，他通过变形来变成一部卡车。而在机器人与卡车之间的阶段，我们称之为过渡（从一个状态过渡到另一个状态）。

如果你不知道谁是擎天柱，那么就把最后几个句子忽略吧！！
希望一切很快就会变得清晰。

可用的CSS变形有两种：2D和3D。

2D变形的实现更广泛，浏览器支持更好，写起来也更简单。
所以我们先看看2D变形。
CSS3的2D变形模块允许我们使用下列变形。

- scale: 用来缩放元素（放大和缩小）。

- translate：按照一定角度旋转元素（单位为度）。

- skew: 沿X和Y轴对元素进行斜切。

- matrix: 允许你以像素精度来控制变形效果。

**要记住，变形是在文档流外发生的。一个变形的元素不会影响它附近未变形的元素的位置。**

让我们试试各种2D过渡。

### scale

下面是scale的语法:

```
.scale:hover {
    transform: scale(1.4); /*scale是个CSS函数 */
}
```

我们已经告知了浏览器，当鼠标悬停在该元素上时，我们希望元素放大到原始大小的1.4倍。

除了我们刚才使用的用来放大元素的数值，我们还可以使用小于1的数值来缩小元素。

下面的代码会将元素缩小一半:

```
transform: scale(0.5);
```

### translate

下面是translate的语法：

```
.translate: hover {
    transform: translate(-20px, -20px);
}
```

translate会告知浏览器按照一定的度量值移动元素，可以使用像素或者百分比。
语法中定义的第一个值是X轴上偏移的距离，第二个是Y轴上偏移的距离。

正值会让元素向右或者向下移动，负值则会让元素向左或者向上移动。

如果你只传入一个值，它会被应用到X轴上。
如果你想指定一个轴进行移动，可以使用 translateX 或者 translateY。

使用translate来居中绝对定位的元素。

translate提供了十分有用的方法在相对定位的容器中居中绝对定位元素。

```
<div class="outer">
    <div class="inner"></div>
</div>
```

然后是CSS代码：

```
.outer {
    position: relative;
    height: 400px;
    background-color: #f90;
}

.inner {
    position: absolute;
    height: 200px;
    width: 200px;
    margin-top: -100px;
    margin-left: -100px;
    top: 50%;
    left: 50%;
}
```

你也许也做过类似的事情。

当绝对定位的元素的尺寸已知时，我们可以使用负的margin来将它拉到中间。

然而不知道元素的高度时怎么办？
变形伸出了援手。

让我们在内部容器里随机加些内容。

好，现在让我们使用 transform 来解决一下问题。

```
.inner {
    position: absolute;
    width: 200px;
    background-color: #999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

此时，top和left的值使内部容器的左上角位于其父容器的正中间。
然后 transform 让其在对应轴上反向移动自己宽高的一半，从而达到居中的效果。

### rotate

rotate 允许你旋转一个元素，语法如下：

```
.rotate:hover {
    transform: rotate(30deg);
}
```

括号中的值只能以度为单位(如90deg)。
正值时会进行顺时针旋转，而负值则会逆时针旋转。

当然，你也让元素这么转：

```
transform: rotate(3600deg);
```

这会让元素旋转整整10圈。这个值使用的次数寥寥可数，除非你给一家风车公司设计网站，这倒有可能会派上用场。

### skew

如果你多少有点Photoshop，就会知道skew（斜切）是怎么回事，它会让元素在一个或两个轴上变形偏斜。

```
.skew:hover {
    transform: skew(40deg, 12deg);
}
```

第一个值是X轴上的斜切（本例中是40度），第二个值是Y轴上的斜切（本例中是12度）。
忽略第二个值意味着仅有的值只会应用在X轴上（水平方向）。

```
.skew:hover {
    transform: skew(10deg);
}
```

### matrix

好了，现在该聊聊那个被严重高估的电影了？ Matrix 黑客帝国。

什么电影？你想知道的是CSS3 中的matrix而不是电影？
好吧·····

我不打算说谎了。我觉得matrix（矩阵）变形的语法超级复杂。

```
.matrix: hover {
    transform: matrix(1.678, -0.256, 1.522, 2.333, -51.533, -1.989);
}
```

它基本上能让你将其他变形（scale、rotate、skew等）组合成单个声明。

总的来说，我还是蛮喜欢挑战难题的，但是我相信你也会同意这语法太有挑战性了。
对于我来说，在看了规范文档之后问题更难了，[要完全理解矩阵得了解相关的数学知识](https://www.w3.org/TR/css3-2d-transforms/)。

```
如果你在不使用动画库的情况下使用JavaScript完成动画，可能需要对矩阵稍微熟悉一点而。
这是变形的计算语法，如果你用JavaScript获取当前动画状态，必须要了解矩阵值。
```

**傻瓜式的矩阵变形工具**

无论怎么想象，我都不是一个数学家，所以当我需要创建矩阵变形时，我一般都走捷径。
如果你的数学也不太好，我建议你访问[这里](http://www.useragentman.com/matrix)。

Matrix Construction Set这个网站可以让你精确地拖放元素，然后它会自动生成完美的矩阵代码。（代码中包含了浏览器私有前缀）。

### transform-origin 属性

注意在CSS里，默认的变形原点（浏览器中作为变形中心的点）是在正中心：

元素X轴的50% 和 Y轴的50% 处。

这和SVG默认的左上角（或者 0 0）是不同的。

使用transform-origin，我们可以修改变形原点。

现在，我们来调整一下 transform-origin:

```
.matrix:hover {
    transform: matrix(1.678, -0.256, 1.522, 2.333, -51.533, -1.1989);
    transform-origin: 270px 20px;
}
```

第一个值是水平方向上的偏移量，第二个值是垂直方向上的偏移量。
你可以使用关键词。

**如果你对transform-origin使用了百分比，那么水平/垂直偏移量都是相对于元素的宽高而言的。**

如果你使用长度，那么它们会相对元素左上角计算该点位置。

你可以访问，这个[网址](https://www.w3.org/TR/css2-2d-transforms/)获取更多关于transform-origin属性的信息。

以上讲述了2D变形的基本要素，比起3D变形，2D变形在浏览器中被广泛支持；
与绝对定位等旧方法相比，它为我们提供了一种更好的方法来在屏幕上移动元素。

CSS3的2D变形模块的[完整规范文档](https://www.w3.org/TR/css2-2d-transforms/)。

```
如果想更多地了解用transform移动元素的好处，可以阅读Paul Irish的文章 (http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/);

另外，如果你想了解浏览器如何处理过渡和动画，以及为什么变形会如此高效，我强烈推荐你阅读以下文章: https://blogs.adobe.com/webplatform/2014/03/18/css-animations-and-transitions-performance/。

```

## CSS的 3D 变形

来观看一下我们的第一个示例。
当我们悬停在一个元素上时，该元素翻转。我在此处使用hover来触发变化，是因为它很容易展现出来。但是这个翻转动作也可以通过类的改变（由JavaScript 触发的）或者换一个元素被聚焦被聚焦等方式触发。

我们有两个元素：一个水平翻转元素和一个垂直翻转元素。

图片并不能充分展示元素如何从绿色面转向红色面，也不能展示出它们是如何产生3D效果的，但还是希望下面这幅截屏能让你对其有所了解。

**有一个小技巧，在某些浏览器中，绝对定位只能逐像素操作，而变形可以实现比一像素更精确的定位。**

下面是翻转元素的相关代码：

```
<div class="flipper">
    <span class="filpper-object filpper-vertical">
        <span class="panel front">The Front</span>
        <span class="panel back">The Back</span>
    </span>
</div>
```

水平翻转元素和垂直翻转元素的唯一区别就是用 flipper-horizontal 类 替代了 flipper-vertical 类。

由于大部分样式涉及美学部分，因此我们这里只看那些生成翻转效果所必不可少的部分。

首先，我们要为.flipper-obeject的父元素设置透视。我们使用perspective属性来实现。这个属性设置了用户视点到3D场景的距离。

如果你设置了一个比较小的值，如20px，那么3D空间会延伸到距离屏幕只有20px处，这会导致一个非常明显的3D效果。如果设置一个比较大的值，那就意味着3D空间离屏幕很远，3D效果会没有那么明显。

```
.flipper {
    perspective: 400px;
    position: relative;
}
```

我们将父元素设置为相对定位，从而创造一个上下文来放置flipper-object。

```
.flipper-object {
    position: absolute;
    transition: transform 1s;
    transform-style: preserve-3d;
}
```

除了将.flipper-object 元素用绝对定位的方式定位在父元素的左上角外（绝对定位的默认位置）外，我们还为变形添加了过渡效果。**而创建3D效果的关键点是transform-style: preserve-3d。这告诉浏览器，当我们要为这个元素创造变形效果时，它的子元素也保持3D效果。

如果我们不在.flipper-object 上设置 preserve-3d，就永远都看不到翻转元素的背面（红色部分）。你可以阅读[相关规范](https://www.w3.org/TR/2009/WD-css3-3d-transforms-20090320/) 阅读相关规范。

翻转元素中的每个面板都会被定位到容器的顶部。
但是我们不想在翻转的时候看到元素的“屁股”（否则我们将永远看不到绿色面板，因为它在红色面板的“后面”）。

要防止这种情况出现，我们需要使用backface-visibility属性。我们把它设置为hidden来隐藏元素的背面：

```
.panel {
    top: 0;
    position: absolute;
    backface-visibility: hidden;
}
```

```
我发现backface-visibility在某些浏览器上会有些令人惊讶的副作用。
它对于提高旧式安卓设备上的fixed定位元素的性能十分有帮助。
你可以阅读 

https://benfrain.com/easy-css-fix-fixed-positioning-android-2-2-2-3/ 

和

https://benfrain.com/improving-css-performance-fixed-position-elements/

来了解更多。
```

接下来，我们想让我们的背面面板默认就是翻转的。
为了达到这个效果，我们使用rotate变形：

```
.flipper-vertical .back {
    transform: rotateX(180deg);
}

.flipper-horizontal .back {
    transform: rotateY(180deg);
}
```

现在万事俱备，我们希望当我们悬停在外部元素的时候，整个内部元素都会有翻转的效果：

```
.flipper:hover .flipper-vertical {
    transform: rotateX(180deg);
}

.flipper:hover .flipper-horizontal {
    transform: rotateY(180deg);
}
```

你马上会想到许多使用它的场景。
如果你好奇怎么用它来实现一个新奇的导航效果，又或者想实现一个屏外菜单，我推荐你[访问](http://tympanus.net/Development/PerspectivePageView-Navigation/index.html)

**transform3d属性**

除了使用perspective外，我还发现了 transform3d这个有用的属性。
在整个简单的属性里，你可以在X轴(左/右)、Y轴(上/下)、Z轴（前/后）上移动元素。

让我们在上一个例子中加入transform3d变形。

除了为元素添加一点padding外，下面是与上例代码中的唯一区别：

```
.flipper:hover .flipper-vertical {
    transform: rotateX(180deg) translate3d(0,0, -120px);
    animation: pulse 1s 1s infinite alternate both;
}

.flipper:hover .flipper-horizontal {
    transform: rotateX(180deg) translate3d(0, 0, 120px);
    animation: pulse 1s 1s infinite alternate both;
}
```

我们依旧使用变形，但这一次，除了rotate外，我们还增加了translate3d。
translate3d中逗号分隔的三个参数分别是X轴上的偏移、Y轴上的偏移、Z轴上的偏移。

在这两个例子中，我并没有在X轴（左右）和Y轴（上下）上改变元素的位置，我改变的是元素到你的视点的距离。

在顶部的例子中你会发现按钮翻转到背面，并且离屏幕近了120像素（负值将元素拉向了你）。

而另一个元素则在水平旋转后离原来的位置远了120像素。

**想了解关于 translate3d 的规范，你可以访问这个[文档](https://www.w3.org/TR/css3-3d-transforms/)**

**使用变形实现渐进增强**

我发现transform3d的最大用处在于将面板移入移出屏幕，尤其是如“离屏”导航模式。

**当你需要使用JavaScript和现代CSS功能（如变形）来制造交互效果的时候，尽可能考虑一下低级设备的支持性问题。**

如果那些用户不支持JavaScript呢？
如果JavaScript在加载或者执行的时候遇到了问题呢？
又或者某些人的设备不支持transform(如 Opera Mini)？
不要担心，只要做一点点努力，就有可能保证我们的界面最终能够应付所有的不测。

在制作这种交互模式的时候，我发现最有用的办法是从最低级的功能开始，逐步增强。
所以，首先为不能使用JavaScript的情况进行搭建。
毕竟这种状况下，如果你的菜单展示需要依赖JavaScript，将菜单放置在屏幕外会导致用户不能使用你的菜单。
于是我们将菜单标签直接放在文档流中的导航区域里。
这样，在最坏的情况下，用户也可以滚动到页脚，点击他们想要切换的标签。

如果JavaScript是可用的，在小屏幕下，我们会把菜单“拉”到左侧。
当菜单按钮被点击的时候，我们会在body标签上添加一个类（通过JavaScript)，然后把这个类作为钩子，从而驱动CSS将这个导航区域展示出来。

在大屏幕下，我们收起菜单按钮，将导航区放置在左侧，并且调整主内容区域从而适应它。

然后，我们逐步优化导航的展示/收起效果。这就是Modernizr之类的工具实至名归的地方；

在HTML上添加一个类用作样式钩子。

首先，对于那些只支持translate变形的浏览器（例如老式的安卓浏览器），使用简单的translateX:

```
.js .csstransforms .navigation-menu {
    left: auto;
    transform: translateX(-200px);
}
```

而对于支持translate3d的浏览器，我们则使用translate3d代替。
一旦支持，这种方法的性能表现会更好，这得益于大多数设备上的图像处理器。

```
.js .csstransforms3d .navigater-menu {
    left: auto;
    transform: translate3d(-200px, 0, 0);
}
```

使用渐进增强的开发方式可以确保尽可能多的用户享受可用的设计效果。
记住，你的用户可能不需要优秀的视觉体验，但是要确保应用的可用性。

## CSS3 动画效果

如果你使用过Flash、Final Cut Pro或者 After Effects之类的软件，那么CSS3动画你也能迅速上手。CSS3中沿用了基于时间线的应用程序中广泛使用的动画关键帧技术。

相较于3D变形，CSS3动画的支持度更高。
Firefox 5+、Chrome、Safari 4+、Android（所有版本）、iOS（所有版本）和IE10+ 都支持。

CSS3动画由两部分组成： 首先是关键帧声明，然后是在动画属性中使用该关键帧声明。

首先，我们创建一个关键帧规则：

```
@keyframes pulse {
    100% {
        text-shadow: 0 0 5px #bbb;
        box-shadow: 0 0 3px 4px #bbb;
    }
}
```

如你所见，在@keyframes关键词后我们定义了一个新的关键帧规则，并且给这个动画命了名，在这个例子中是pulse（脉冲）。

一般情况下，最好使用一个能代表动画效果的名字，因为一个关键帧声明可以在项目中多处复用。

我们在这里只定义了一个简单的关键帧选择器： 100%。
然而， 你也可以设置多个关键帧选择器（用百分比定义）。
你可以把它们想象成时间轴上的点。

例如，10%的时候背景变成蓝色，30%的时候背景变成紫色，60%时让元素变得半透明，等等。

如果你需要的话，还有等价于0%和100%的关键词。
你可以这样使用：

```
@keyframes pulse {
    to {
        text-shadow: 0 0 5px #bbb;
        box-shadow: 0 0 3px 4px #bbb;
    }
}
```

然而要提醒一下，WebKit内核的浏览器（iOS，Safari）对 from 和 to 的支持不是十分好（更喜欢0% 和 100%），所以我推荐你使用百分比关键帧选择器。

你会注意到我们并没有费心去定义起点。

这是因为起点就是这个属性所在的状态。
你可以了解下[规范](https://www.w3.org/TR/css3-animations/)。

```
如果0% 或者 from 关键帧没有被指定，那么用户代理会利用被添加动画的属性，计算出相关的值来构建 0% 关键帧。

同样，如果100% 或者 to 关键帧未被定义，用户代理也会计算出相应的关键帧。

如果定义了负值或者大于 100%的关键帧，它会被忽略。
```

在这个关键帧数声明中，我们在100%处添加了文字阴影与盒阴影。
我们可以预期到，这个动画被使用后，元素会动态添加相应的文字阴影和盒阴影。
但是这个动画会持续多久呢？
我们怎么定义它重复播放、翻转播放或者其他我希望的播放方式？
下面是我们使用关键帧动画的方法：

```
@keyframes pulse {
    100% {
        text-shadow: 0 0 5px #bbb;
        box-shadow: 0 0 3px 4px #bbb;
    }
}

.flipper:hover .flipper-horizontal {
    transform: rotateY(180deg);
    animation: pulse 1s 1s infinite alternate both;
}
```

此时的animation属性使用了缩写语法。
在本例中，我们实际定义了（依照定义顺序）使用的关键帧规则的名字(pulse)、动画持续时长(1s)、动画开始延迟(1s, 给予按钮足够的时长进行翻转)、动画运行的次数（infinite，无限次）、动画播放方向(alternate，交替，所以动画轮流往复地播放)，最后我们想让animation-fill-mode 保留动画中无论是顺序播放还是倒序播放的值（both）。

缩写属性实际上可以接受全部七个动画属性。
除了前面说的，还可以指定 animation-play-state。
这个属性可以被设置为running 和 paused 来运行或者 暂停动画。
当然，你可以不采用缩写模式。
有的时候分别设置属性会更易读懂（帮助你在日后重温代码）。

下面是各个属性的正确写法，可选的值用|分隔表示。

```
.animation-properties {
    animation-name: warning;
    animation-duration: 1.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-play-state: running | paused;
    animation-delay: 0s;
    animation-fill-mode: none | forwards | backwards | both;
    animation-direction: normal | reverse| alternate | alternatereverse;
}
```

如果你想理解每个动画属性的完整定义，可以访问 https://www.w3.org/TR/css3-animations/。

正如前面提到的一样，你可以在其他元素复用已经声明的关键帧规则，并且可以使用完全不同的设置：

```
.flipper:hover .flipper-vertical {
    transform: rotateX(180deg);
    animation: pulse 2s 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 5 alternate both;
}
```

上例将在2秒内运行pulse动画效果，并且使用了ease-in-out-back 调速函数（使用贝塞尔曲线定义的）。

它会按照顺序逆序各播放五次。

这只是一个简单的CSS动画的例子。
但是基本任何动画都可以用关键帧实现，因此这个可能性是无限的。
有兴趣的话，可以阅读 [CSS3 动画的最新发展](http://dev.w3.org/csswg/css3-animations/)。

**animation-fill-mode属性**

animation-fill-mode 属性值得一提。想象一下，一个动画花了3秒钟从黄色背景变化为红色背景。

我们使用了下面的动画设置：

```
.background-change {
    animation: fillBg 3s;
    height: 200px;
    width: 400px;
    border: 1px solid #ccc;
}

@keyframes fillBg {
    0% {
        background-color: yellow;
    }

    100% {
        background-color: red;
    }
}
```

然而，一旦动画结束，div的背景会变成透明。
这是因为默认原则是动画内外互不干涉。
我们可以使用 animation-fill-mode 覆盖这种行为。

```
animation-fill-mode: forwards;
```

这指使元素保留动画结束时的值。
在本例中，div的背景会在动画结束后保持为红色。

如果想了解更多关于 animation-fill-mode 属性的资料，可以访问这个[网址](https://www.w3.org/TR/css3-animations/#animation-fill-mode-property)。