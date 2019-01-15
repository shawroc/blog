# SVG与响应式Web设计

---
绝大部分引用自《响应式Web设计 HTML5和CSS3实战（第2版）
---

SVG是响应式设计中十分重要的一项技术。
它是一种不会过时的、能够轻松解决多屏幕分辨率问题的技术。

Web领域中的图像，如JPEG、GIF或者PNG，都是把它们的可视数据保存为像素形式。
如果你将以这种形式保存的图像放大到两倍宽高以上，它的局限性很快就会暴露出来。

除了最小的图片资源，如果可能的话，使用SVG替代JPEG、GIF或者PNG。这样可以产生和分辨率无关的图片，而且大小也比位图图像小得多。

SVG是一个十分庞大的主体。因此你需要关心的部分取决于你对SVG的需求。

如果你想全面地了解SVG，从而操纵它，或者为其添加动画，那么你最好选一个舒服的姿势，并且准备大份的饮料，因为这需要花费你大量时间。

在开始SVG旅程前，让我们先回到2001年。

## SVG 的历史

SVG的第一个版本是在2001年推出的。你没有听错，SVG在2001年就诞生了。尽管它一直在发展，但是直到高分辨率设备的出现才被广泛注意和采用。

“SVG是XML种用于描述二维图形的语言。SVG支持三种图形对象: 矢量图形形状、图像和文本。”

顾名思义，SVG允许在代码中使用矢量点来描述二维图像。这种优势使SVG被广泛应用到图标、线条图和图标的表示中。

因为矢量图是使用相对点来保存数据的，所以可以缩放到任意大小而不会损失清晰度。
此外，由于SVG仅仅保存矢量点，相比于同等尺寸的JPEG、GIF和PNG，其文件大小更小。

SVG现在的浏览器支持度也相当不错，Android 2.3以上和IE9以上都支持。


## 用文档表示的图像

通常情况下，如果你在文本编辑器里查看图像文件的代码，会不知所云。

而SVG不同，它是使用标记式语言进行描述的。SVG使用XML来描述，XML是一种和HTML十分相似的语言。

**现今，XML在互联网上遍布各地。你使用过RSS阅读器吗？它就是基于XML的。XML是包装RSS内容的语言，从而让它便于被多种工具和服务使用。**

所以不仅机器可以阅读和理解SVG图像，我们也可以。

SVG图像的XML示例代码：

```
<?xml version="1.0"  encoding="UTF-8" standalone="no"?>
    <svg width="198px" height="188px" viewBox="0 0 198 188" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.2.2 (9983) - http://www.bohemiancoding.com/sketch -->
    <title>Star 1</title>
    <desc>Created with Sketch</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1 fill="none" fillrule="evenodd" sketch:type="MSPage">
    <polygon id="Star-1" stroke="#979797" stroke-width="3" fill="#F8E81C" sketch:type="MSShapeGroup" points=".............">
    </polygon>
    </svg>
```

这就是用于生成星星SVG图片所需的全部代码。

通常来说，如果你从未看过SVG代码，会好奇为什么我需要看这些代码。
诚然，如果你只是想在Web页面上显示这些矢量图像，你当然不需要查看代码。
只要找一个图形应用，将你的矢量图像保存为SVG格式就大功告成。

尽管大部分情况下我们只会用图像编辑器来编辑SVG，但是明白SVG是如何构成的以及如何调整它还是十分有用的，特别是你还要控制它或者给它加上动画效果的时候。

所以，让我们好好研究一下SVG的标记语言，并且了解到底发生了什么。我希望你能注意到以下几个关键点。

### SVG 的根元素

SVG的根元素有width、height和viewbox属性。

```
<svg width="198px" height="188px" viewBox="0 0 198 188">
```

这三个属性在SVG展示的时候偶都起到了十分重要的作用。

希望现在你能很好地理解“视口”这个概念。
视口即，用于描述在设备上能够观看内容的面积。

举个例子，一个手机的视口可能只有320像素宽480像素高，而桌面电脑则一般有1920像素宽1080像素高。

宽度和高度属性对于创造一个视口十分有用。透过这个定义的视口，我们可以看到内部定义的SVG形状。和普通的Web页面一样，SVG的内容可能会比视口大，但是这不意味着多余的部分就不存在，只是我们看不到而已。

而另一方面，视框（viewbox）则定义了SVG中所有形状都需要遵循的坐标系。

你可以把视框值 0 0 198 198 视为对矩形左上角和右下角的描述。前两个值被称为 min-x 和 min-y，用于描述 左上角的位置。 而接下来的两个值被称作宽度和高度，可以描述右下角的位置。

因此，viewbox属性可以让缩放图片。例如，你可以这么设置viewbox属性：

```
<svg width="198px" height="188px" viewBox="0 0 99 94">
```

那么其中的形状为了填满SVG的宽度和高度，就会被放大。

```
为了真正地明白视框和SVG坐标系统以及它们带来的机会，我建议你阅读Sara Soueidan的文章：https://sarasoueidan.com/svg-coordinate-systems/，以及Jakob Jenkov的文章：http://tutorials.jenkov.com/svg/svg-viewport-view-box.html。
```

### 命名空间

这个SVG会有一个由生成它的图形编辑程序定义的命名空间（xmlns是XML命名空间的缩写）。

```
xmlns: sketch="http://www.bohemiancoding.com/sketch/ns"
```

这些命名空间往往只是在生成SVG的程序中使用，所以在Web页面上展示SVG的时候他们并不是必需的。因此在优化流程中，为了减小SVG的大小，通常会把它们去掉。

### 标题和描述标签

title和desc标签提高了SVG文档的可读性。

```
<title>Star 1</title>
    <desc>Created with Sketch.</desc>
```

这些标签可以用来在图像不可见的情况下描述图像的内容。
然而，当SVG图片被应用为背景图片的时候，可以去除这些标签来减小文件大小。

### defs 标签

在我们的示例代码里有一个空的defs标签：

```
<defs></defs>
```

尽管在我们的示例中它是空的，这仍然是一个十分重要的元素。它是用于存储所有可以复用的元素定义的地方，如梯度、符号、路径等。

### 元素 g

g元素能把其他元素捆绑在一起。
例如，你要画一辆车的SVG，你会把咏柳构成车轮的形状用g标签集合起来。

```
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fillrule="evenodd" sketch:type="MSPOage">
```

在g标签中我们可以看到先前的命名空间。这会有助于图形编辑软件再次打开这个图像，但是它对于这个图片在其他地方展示并没有影响。

### SVG 形状元素

在本例中最里面的节点是一个多边形（polygon）。

```
<polygon id="Star-1" stroke="#979797" stroke-width="3" fill="#F8E81C" sketch:type="MSShanpeGroup" points="99 154 40.2214748 184.901699 51.4471742 119.45085 ........"> </polygon>
```

SVG拥有一系列可用的现成形状（path、rect、circle、ellipse、line、polyline、polygon）。

### SVG路径

SVG路径和其他SVG形状有所区别，因为它们是由任意数量的连接点组成的（允许你自由创造你想要的形状）。

这就是SVG文件的价值所在。希望你对它有了更高层次的理解。虽然有些人喜欢手写SVG的代码，但是更多人喜欢利用图像工具来生成SVG。

下面让我们看看有什么流行的选择。

## 使用流行的图像编辑工具和服务创建SVG

尽管SVG可以使用文本编辑器编辑，但是仍然有大量提供了GUI（graphical user interface，图像用户界面）的编辑程序。

如果你拥有图像编辑背景，会发现使用这些软件会让你的工作轻松很多。
或许最好的选择是 Adobe 公司的 Illustrator (PC/Mac)。
然而，对于普通用户来说，AI还是有点昂贵，所以我推荐Bohemian Coding的Sketch。

它的售价也不便宜，但是如果你使用的是Mac的话，我推荐你考虑它。

如果你用的是Windows/Linux 或者想要一个更便宜的软件，你可以考虑一下免费的开源软件 Inkscape。它绝对不是最好的工具，但它是十分强大的。

最后，还有些在线的编辑器。
Google有SVG-edit。还有Draw SVG和 Method Draw。后者被认为是SVG-edit更好看的分支。

**利用 SVG 图标服务**

上面提到的程序给予了你从头开始创建SVG图像的能力、
然而，如果你只是想找一些图标，可以通过从在线图标服务下载SVG版本的图标来节省大量的时间。我个人最爱的是 https://icomoon.io/。

为了快速说明在线图标服务的好处，打开icomoon.io，你会看到一个可以供你搜索的图标库（部分免费，部分收费）。

选择你需要的图标，然后下载。生成的文件会包括SVG、PNG和在defs元素中使用的SVG符号，记住，defs元素时引用元素的容器。

## 在 Web 页面中插入 SVG

在SVG图片上，你可以做很多（基于浏览器的）你在普通格式图片（JPEG、GIF、PNG）上做不到的事。至于你能做什么，很大程度取决于你如何插入SVG。所以在考虑到底能用SVG做什么前，我们先了解插入SVG的多种方法。

### 使用 img 标签

最直接的插入 SVG 图像的方式就是你将图像插入到HTML文档中的方式。我们使用一个简单的img标签即可：

```
<img src="mySconeVector.svg" alt="Amazing line art of scone"/>
```

这种情况下，SVG所能做的和其他插入的图片差不多，没什么多说的。

### 使用 object 标签

object 标签是 W3C 推荐的用于装载非HTML内容的容器。
我们可以像下面这样利用它插入SVG：

```
<object data="img/svgfile.svg" type="image/svg+xml">
    <span class="fallback-info">Your browser doesn't support SVG</span>
</object>
```

data 和 type 属性其实只有一个是必须要的，但是我建议都添加上。
data 属性是你链接SVG资源的方式。
type 属性描述了内容的MIME类型。
在这个例子中，image/svg+xml 是SVG的MIME 类型（互联网媒体类型）。
你也可以添加width和height属性，如果你想约束这个任凭器的SVG的大小。

通过object标签插入到页面的SVG可以被JavaScript访问，这是采用这种插入方式的一个重要理由。
而另一个好处就是，object可以在浏览器不支持引入的数据类型的情况下做出简单的反馈。

例如，如果上述的object标签在IE8（IE8不支持SVG）中被打开，它会显示消息"your browser doesn't support SVG"。

**你可以使用这个空间来插入一个img标签来引入备用的图像，然而要注意的是，在我的粗略测试中，我发现无论这张图片是否真的被需要，它都会被下载。**

因此，如果你希望你的网站加载速度尽可能快，这并不是最佳选择。

另一种后备方法是使用CSS中的background-image。
例如，在上例中，我们可以给后备的span标签添加类.fallback-info。
我们可以使用CSS为其添加合适的background-image。
这种情况下，background-image 只会在需要的情况下才加载。

### 把 SVG 作为背景图像插入

SVG可以在CSS中用作一个背景图像，和其他图片格式（PNG、JPG、GIF）一样。引入SVG时并没有什么特别之处：

```
.item {
    background-image: url('image.svg');
}
```

对于那些不支持SVG的老旧版本的浏览器，你可能想引入一个支持度更高的后备策略（通常是PNG）。下面就是一种IE8和Android 2上的后备方法。

IE8不支持background-size和SVG，而Android 2.3不支持SVG并且需要在background-size前添加前缀：

```
.item {
    background: url('image.png') no-repeat;
    background: url('image.svg') left top / auto auto no-repeat;
}
```

在CSS中，当两个相同属性都被应用的时候，样式表中下方的属性总会覆盖上方的属性。
在CSS中，浏览器总会忽略它所不能理解的那些属性/值对。

因此，老式浏览器会加载PNG，因为它们可能不认识SVG或者不能理解没有添加前缀的background-size属性。

而现代浏览器虽然认识这两个写法，但是下方的优先级更高。

你也可以在Modernizr的帮助下提供后备策略。
Modernizr是一款JavaScript的浏览器功能检测工具。
Modernizr对于不同的SVG插入方法有单独的测试，并且可能在下一个版本中添加对于CSS中的SVG的检测。而现在，你可以这么做：

```
.item {
    background-image: url('image.png');
}

.svg .item {
    background-image: url('image.svg')'
}
```

你喜欢的话，也可以把逻辑反转:

```
.item {
    background-image: url('image.svg');
}

.no-svg .item {
    background-image: url('image.png');
}
```

当功能检测被充分支持后，你可以这么做:

```
.item {
    background-image: url('image.png');
}

@supports (fill: black) {
    .item {
        background-image: url('image.svg');
    }
}
```

因为fill是一个SVG属性，所以如果浏览器支持SVG，那么@supports规则就会生效，它就会使用下面面的语句覆盖第一条设定。

如果你对SVG的需求主要是静态背景图片或者图标之类，我强烈建议通过背景图像的方式插入SVG文件。这是因为我们有一堆工具可以自动生成图片精灵和样式表，意味着可以把SVG当做data URI引入、备用的PNG资源和你创造的SVG所需要的样式表。

这种使用SVG的方式支持度不错，因为图像自身的缓存效果挺好（因此性能表现也挺好），而且实现起来也十分简单。

### 关于 data URI 的简短介绍

如果你读了上一小节，可能会好奇究竟什么是data URI(Uniform Resource Identifier，统一资源标识符)。相对于CSS而言，这是用来引入外部资源的，如图像。

因此，我们既可以这样引入外部图像文件：

```
.external {
    background-image: url('Star.svg');
}
```

也可以利用data URI 引入图片：

```
.data-uri {
    background-image: url(data:image/svg+xml, encodeURI);
}
```

它并不好看，但是它节省了一次网络请求。
data URI有不同的编码方式，并且有大量可用的工具来为你的资源创建data URI。

如果使用这种方式对SVG进行编码，我建议不要采用 base64 编码，因为它对SVG内容的压缩并不如text好。

### 生成图像精灵

我个人推荐的用于生成图像精灵或者data URI的工具是 [Iconizr](http://iconizr.com/)。

它让你对最终生成的SVG文件和后备PNG资源拥有完整的控制权。它可以生成data URI格式或者图像精灵的结果。如果过你选择生成图像精灵的话，它甚至还会引入必要的JavaScript片段来确保你引入正确的资源。强烈推荐这个工具。

另外，你可能像知道是data URI还是图像精灵比较适合你的项目。
为此，我做了进一步的调查，并且列举出它们各自的优缺点。
因此，当你面临这种选择的时候，可以访问https://benfrain.com/image-sprites-data-uris-icon-fonts-v-svgs/。

尽管我很喜欢把SVG当做背景图像插入，但是如果你想为它加上动画效果，或者使用JavaSctipt来插入数据等，那么最好的萱蕚还是把SVG内联到HTML上。

## 内联 SVG

**由于SVG仅仅是一个XML文档，所以你可以直接将它插入到HTML中。比如:**

```
<div>
    <h3>Insert 'inline':</h3>
    <span class="inlineSVG">
        <svg id="svgInline" width="198" height="188" viewBox="0 0 198 188" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Star 1</title>
            <g class="star_Wrapper" fill="none" fill-rule="evenodd">
                <path iod="star_Path" stroke="#979797" strokewidth="3" fill="#F8E81C" d="M99 ......." />
            </g>
        </svg>
    </span>
</div>
```

并不需要包装什么特别的元素，你只需要直接在HTML标记内插入SVG标记即可。
另外，如果你删除svg 元素的width和height属性，SVG就会自动缩放来填满容器。

直接插入SVG的做法让你可以使用最多的SVG功能。

### 利用符号复用图像对象

在本章前面曾提到，我从[IcoMoon](https://icomoon.io/)上挑选并下载了一些图标。
它们是用于描述触摸手势的图标：滑动、缩放、拖动，等等。

假设你正在搭建的网站上，你需要多次使用它们。是否还记得我曾经提过的在SVG的符号定义里的版本属性？现在我们来使用它。

通过defs引入多个符号定义。
你会注意到，在SVG元素上，内联样式是diplay: none，并且width和height属性都被设为0（如果你喜欢的话，可以在CSS上设置这些样式）。

这样，SVG就不会占用空间了。

我们是使用SVG作为容器来放置我们的图形对象的符号。

所以，我们的代码是这样的：

```
<body>
    <svg display="none" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink">
    <defs>
    <symbol id="icon-drag-left-right" viewBox="0 0 1344 1024">
        <title>drag-legt-right</title>
        <path class="path1" d="M256 192v-1601-224 224 244 224v-160h256v-128z"></path>
```

注意到defs元素中的symbol元素了吗？
这就是我们定义一个形状以供稍后使用时，会用到的元素。

在定义所有必需的符号元素红藕，我们开始“正常”的HTML编码。
然后，如果想使用其中一个符号，我们会这么做：

```
<svg class="icon-drag-left-right">
    <use xlink:href="icon-drag-left-right"></use>
</svg>
```

这样，页面上就会展示拖动图标。

神奇之处就是use元素。顾名思义，它就是把已经定义好的图形对象“使用”起来。
它通过xlink属性来选择引入的对象。

在本例中，这个属性是拖动图标的符号ID(#icon-drag-left-right)。
我们在文档前定义了这个符号。

当复用符号的时候，除非你明确指定了符号的大小（通过属性设置或者CSS设置），否则use会默认宽高为100%。所以，我们可以这样来重新设置图标大小。

```
.icon-drag-left-right {
    width: 2.5rem;
    heigth: 2.5rem;
}
```

use 元素可以复用所有的SVG内容：梯度、形状、符号等。

### 根据上下文改变内联 SVG 颜色

使用内联SVG后，你可以根据上下文来改变SVG的颜色。
这在你需要多个版本的图标时是十分有用的：

```
.icon-drag-left-right {
    fill: #f90;
}

.different-context .icon-drag-left-right {
    fill: #ddd;
}
```

**通过对父元素的继承创造双色图标**

使用内联SVG，你可以实现一些有趣的效果。
例如，利用旧CSS变量currentColor，把一个单色的SVG图标变成双色（只要SVG内包含了多个路径）。
要实现这种效果，需要在SVG符号中，把你想设置为单一颜色的路径的fill属性设定为currentColor，然后使用CSS中的color属性设定这个元素的颜色。

至于没有设置fill属性的路径，它们则会使用CSS定义的fill值。

```
.icon-drag-left-right {
    width: 2.5rem;
    height: 2.5rem;
    fill: #f90;
    /*这会应用在symbol中那些将fill属性值设置为currentColor的path上 */
    color: #ccc; 
}
```

下面是同一个符号被复用了三次，每次都是不同的颜色和大小。

**例如，颜色值并不需要设置在元素本身，我们可以设置在父元素上。currentColor会继承DOM树上最近的父元素的色值。**

这种使用方式有很多好处。

唯一的坏处是，如果你想在页面上使用这些图标，就必须引入同一个SVG代码。

然而，因为资源（SVG代码）不容易被缓存，所以这会影响性能。

不过，我们有备用方案（如果你乐于插入一个脚本用于兼容IE浏览器）。

### 复用外部图形对象资源

如果每个页面都要添加庞大的符号集合，那无疑十分烦人。
因此，我们可以使用use元素链接到外部的SVG文件，并且抓取你想要使用的部分。

```
<svg class="icon-drag-left-right">
    <use xlink:href="defs.svg#icon-drag-left-right"></use>
</svg>
```

最重要的部分是href。
我们链接到外部SVG文件（defs.svg部分），然后确定文件中我们想使用的符号的ID（#icon-drag-left-right部分）。

这样做的好处是，资源会被浏览器缓存（和其他外部图像一样），并且防止我们的代码被一堆SVG的符号定义塞满。

不足之处是，和直接内联defs不一样，对defs.svg做的变动不会更新到use标签中。用JavaScript改变其中一条路径。

不过有个坏消息，IE浏览器不支持对外部符号资源的引用。
幸好，对于IE9~IE11，我们有腻子脚本(poyfill)。
它会称为“给每个人的SVG”（SVG for Evenybody)，可以让我们忽略IE的限制。

可以到这个[链接](https://github.com/jonathantneal/svg4everybody)上了解。

使用了改短JavaScript脚本后，你就可以愉快掉引入外部资源。
在IE下，腻子脚本会将其中的SVG数据直接插入到文档中供你使用。

## 不同插入方式下可以使用的功能

如前所述，SVG和其他图片资源是不一样的。
在不同的插入方式下，它们有不同的行为。
我们已经知道了有四种主要方法可以插入SVG:

- 通过img标签插入

- 通过object标签插入

- 设置为背景图像

- 内联

在上面各种插入方式里，有的功能是可用的，有的功能是不可用的。

要明白在每种插入方式中你可以使用的功能，请看下表。

|特征|img标签插入|object标签插入|内联|背景图片|
|:-:|:-:|:-:|:-:|:-:|
|SMIL动画|Y|Y|Y|Y|
|外部CSS控制|N|*1|Y|N|
|内部CSS修改|Y|Y|Y|Y|
|通过JavaScript控制|N|Y|Y|N|
|缓存|Y|Y|*2|Y|
|SVG内部的媒体查询|Y|Y|*3|Y|
|使用use|N|Y|Y|N|

我们可以看到表中有些用数字标记的注意事项。

- *1：在使用object插入SVG的时候，你可以使用外部样式表，但是你必须在SVG文件里引入该样式表。

- *2：你可以通过外部资源（可以缓存）的方式引入SVG，但是在IE浏览器中默认是不支持的。

- *3: 在内联SVG文件中的样式表部分的媒体查询，其作用对象是在所在文档的大小（而非SVG本身大小）。

**浏览器兼容性问题**

要注意到每个浏览器对SVG的实现可能不一样。
因此，不是每个浏览器都实现了上述内容，又或者，不是每个浏览器的表现都是一致的。

示例的行为在最新版本的Firefox、Chrome和Safari中都是一致的。
然而，IE有的时候会不一样。

例如，我们已知，在所有兼容SVG的IE版本（此刻指的是IE9、IE10和IE11）里，不能引用外部SVG资源。

此外，无论采用什么方法插入SVG，IE都会把外部样式表中的样式应用到SVG上（其他浏览器只有在SVG采用内联或者object标签方式引入的时候才应用）。

IE还不允许通过CSS为SVG添加动画，你只能用JavaScript实现。

我这里要唠叨一下：在IE上，你只能通过JavaScript为SVG添加动画。

## SVG的怪癖

让我们先把了浏览器的小毛病放到一边，考虑一下表中这些特征允许你做什么，以及为什么你想用/不想用它们。

无论用什么方式插入，SVG都会使用设备最高的分辨率来渲染。
在大多数情况下，分辨率无关性是使用SVG的理由。

至于选择哪种插入方式，一般取决于你的工作流和手头上的工作。

然而，还是有其他功能值得了解的。例如 SMIL动画、引入外部样式表的方式、用字符书库分隔符标识内部资源的方法、使用JavaScript修改SVG的方法以及如何在SVG内部使用媒体查询。

### SMIL 动画

SMIL动画（https://www.w3.org/TR/smil-animation/）是一种在SVG文档内部定义SVG动画的方法。

SMIL（发音和“smile” 一致）是synchronized multimedia integration language(同步多媒体集成语言)的缩写，被开发来作为在XML文档中定义动画的方法（记住，SVG是基于XML的）。

下面是定义SMIL动画的示例：

```
<g class="star_Wrapper" fill="none" fill-rule="evenodd">
    <animate xlink:href="#star_Path" attributeName="fill" attributeType="XML" begin="0s" dur="2s" fill="freeze" from="#F8E81C" to="#14805e">
    
    <path id="star_Path" stroke="#979797" stroke-width="3" fill="#F8E81C" d="M99 1541-58.78 30.902 11.227-65.45L3.894 ......." />
</g>
```

我采用的是一个我们先前看过的SVG示例。
g元素是SVG种的一个分组元素。在此例中，它包跨了一个星形（带有属性id="star_Path"的path元素）和animate 元素中的SMIL动画。

这个简单的动画是在两秒内把星形从黄色渐变为绿色。

更重要的是，无论是通过img、object、background-image或者内联插入，都会实现该动画效果。

**SMIL的结局**

IE并不支持SMIL，或者说，不怎么、不太、不俺么、几乎不支持。
恩，言下之意就是SMIL此时不受IE支持。

更糟糕的是（我知道，我在打击你）微软并没有计划引入它。

你可以在https://developer.microsoft.com/en-us/microsoft-edge/platform/status/svgsmilanimation 上看看凭条支持度。

另外，Chrome已经声明了准备在Chrome浏览器上放弃SMIL： https://groups.google.com/a/chronium.org/forum/#!topic/blink-dev/5o0yiO440LM%5B1-25%5D。

万幸的是，仍然有许多方法来制作SVG动画，我们稍后谈到。
所以如果你要支持IE浏览器，请一定要坚持下去。

### 使用外部样式表为SVG添加样式

我们可以用CSS来为SVG添加样式。你可以把CSS包裹在SVG内，或者在你写CSS的点添加这类CSS。

现在，如果翻到我们之前提起的功能表，你会看得到，当使用 img 标签或者作为 background-image 插入图片时（除了IE浏览器），你是不能使用外部CSS给SVG添加样式的。
只有在内联或者通过object标签插入的情况下，才能实现。

有两种方法可以在SVG中链接外部样式表。
最直接的方式是这样（你通常会在defs部分中添加）：

```
<link href="style.css" type="text/css" rel="stylesheet" />
```

这和我们在HTML5前链接样式表的方法比较相似，type属性在HTML5中已经不是必需的了。
然而，尽管在很多浏览器上这个方法都能生效，但是它不是规范上定义的[标准方法](https://www.w3.org/TR/SVG/styling.html)。

下面是正确的/官方的方法，是1999年为XML定义的，[文档链接](https://www.w3.org/1999/06/REC-xml-stylesheet-19990629/)

```
<?xml-stylesheet href="styles.css" type="text/css"?>
```

你需要在你的SVG元素添加这段代码。例如：

```
<?xml-stylesheet href="styles.css" type="text/css" ?>
<svg width="198" height="188" viewBox="0 0 198 188" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink">
```

有趣的是，后者是唯一一个可以在IE上工作的语法。
所以，当你需要从你的SVG中链接外部样式表时，推荐使用第二种语法，因为它的支持度更高。

当然，你不是必须要使用外部样式表，你可以在SVG上直接使用内联样式。

### 使用内联样式为SVG 添加样式

你可以在SVG内部放置它本身的样式。它们应该被放置在defs元素内。
因为SVG是基于XML的，所以比较安全的做法是要加上字符数据(Character Data, CDATA)标记。

CDATA标记只是告诉浏览器，字符数据分隔符之间的信息可以当做XML标记插入，但是不应该被插入。

```
<defs>
<style type="text/css">
    <![CDATA[
        #star_Path {
            stroke: red;
        }
    ]]>
</style>
</defs>
```

**CSS中的SVG 属性**

注意上例代码中的stroke属性。它并不是CSS属性，而是SVG属性。
你在样式中可以使用不少的SVG属性（无论是内联样式或外部样式表）。
例如，对于SVG，你不用指定background-color，而是需要定义fill。

你无需定义border，而是定义stroke-width。

如果想知道所有SVG的属性值，可以参考[规范](https://www.w3.org/TR/SVG/styling.html)

无论是内联还是外部引入的CSS，你都可以做“正常”的CSS行为：改变元素的外观、添加动画、变换元素，等等。

### 用 CSS 为 SVG 添加动画

让我们看一个在SVG内部为SVG添加CSS动画的例子（记住，这些样式也可以写在外部样式表中）。

让我们拿之前看到的星形举个例子。这次我们让它旋转起来。

```
<div class="wrapper">
    <svg width="198" height="188" viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink">
    <title>Star 1</title>
    <defs>
        <style type="text/css">
            <![CDATA[
                @keyframs spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                .star_Wrapper {
                    animation: spin 2s 1s;
                    transform-origin: 50% 50%;
                }
                .wrapper {
                    padding: 2rem;
                    margin: 2rem;
                }
            ]]>
        </style>
    <defs>
    <g class="star_Wrapper" fill="none" fill-rule="evenodd">
        <path id="star_Path" stroke="#333" stroke-width="3" fill="#F8E81C" d="M99 1541-58........">
    </g>
</div>
```

如果你在浏览器中观看示例，一秒钟后，星形会完成一次耗时两秒的旋转。

```
要注意SVG上的transform-origin被设置为 50% 50%。
这是因为与CSS不同，SVG默认的transform-origin不是50% 50%（元素的正中间），而是 0 0（元素的左上角）。如果不指定该属性，星形会围绕左上角进行旋转。
```

仅仅用CSS的animation你就可以制作很多SVG动画（当然是在不需要兼容IE的情况下）。
然而，当你需要添加交互功能，只会IE浏览器或者同步一系列事件的时候，最好使用JavaScript实现动画效果。

幸运的是，我们可以依靠一些库来制作SVG动画。

## 使用 JavaScript添加SVG动画

当一个SVG是通过内联或者object标签的方式插入页面时，我们可以通过JavaScript直接或者间接地控制它。

间接的意思是指我可以通过JavaScript来改变它或者它的父类的class，从而触发动画效果。

```
svg {
    /* 没有动画效果 */
}

.added-with-js svg {
    /* 动画 */
}
```

当然，你也可以直接使用JavaScript来控制动画效果。

如果你只要实现一两个独立的动画效果，那么自己手写JavaScript代码会是一个明智的、更为轻量级的选择。然而，如果你需要在时间轴上添加大量的动画效果或者需要同步多个动画，那么一个JavaScript动画库会让你事半功倍。

最终，你需要判断的是，为了你的目标引入这个库到页面里是否合适。

我推荐使用[GreenSock动画平台](http://greensock.com/)

[Velocity.js](http://julian.com/research/velocity)

[Snap.svg](http://snapsvg.io)。

在下个例子里，我会使用GreenSock 写一个小例子。

**使用 GreenSock 添加 SVG 动画**

假设我们要做一个刻度盘，它们会根据我们设定的值而展示动画。
我们希望不仅刻度盘的边框长度和颜色会改变，同时中间的数字也会变化。

所以，假如我们输入75，然后点击“Animate!!”按钮，它会变成这个样子：

为了简洁，我不会贴出完整的JavaScript代码，我只关注几个关键点。

基本思想是，我们需要用\<path>元素（而不是\<circle>元素）来实现一个圆圈。
路径(path)就意味着我们可以使用stroke-dashoffset技术来制作动画路径。
在后文中我们会谈到这项技术，因此这里我只是简短地介绍一下。
我们使用JavaScript来度量路径的长度，然后使用stroke-dashoffset属性来指定渲染部分的长度和缺失部分的长度。

然后用stroke-dashoffset来改变dasharray开始的位置。

这意味着你可以控制path的stroke的长度，并且让它动起来。这看起来好像路径正在绘制一样。

如果dasharray变化的目标值是一个静态的已知值，那么使用CSS的animation实现也是相对简单的。

当然，除了动态值问题外，我们还需要让stroke的颜色渐变，还要可视化地在文本节点上显示输入值的计算过程。

这个动画的复杂程度相当于我们在拍着自己的头、揉着自己的肚子的同时从10 000开始倒数。

GreenSock让这些任务变得相当简单。

下面是让GreenSock产生该效果的JavaScript代码：

```
//动态绘制线条并改变颜色
TweenLite.to(circlePath, 1.5, {
    'stroke-dashoffset': "-" + amount,
    stroke: strokeEndColour
});

var counter = {
    var : 0
};

TweenLite.to(counter, 1.5, {
    var: inputValue,
    onUpdate: function () {
        var: inputValue,
        onUpdate: function() {
            text.textContent = Math.ceil(counter.var) + "%";
        },
        ease: Circ.easeOut
    }
});
```

从本质上讲，你需要往TweenLite.to()函数传入你想要的动画、动画开始的时间点、你想改变的数值（和改变后的结果）。

GreenSock拥有出色的文档和论坛，所以一旦你发现自己需要做大量的同步动画，请从你的日程里空出一天来熟悉GreenSock。

## 优化SVG

作为一个尽责的开发者，我们尽可能压缩资源大小。
最简单的方法是使用自动化工具来优化SVG文件。
除了那些明显的做法，如去掉不需要的元素（如标题和描述元素），我们还可以做很多优化。
这些微优化叠加后，其效果往往出乎我们的意料。

目前，我推荐使用SVGO（http://github.com/svg/svgo)。
如果你从没使用过SVGO，我推荐你从SVGOMG（https://jakearchibald.io/svgomg/)开始。
这是一个浏览器版本的SVGO，你可以切换不同的优化插件，并且可以看到即时的优化反馈。

还记得本章开头的星形例子吗？
默认情况下，该例子的大小为489字节。
通过SVGO处理后，它的大小会变成218字节，这还是在保留了viewbox的情况下。
它们压缩了55.42%的大小。
如果你使用了一大堆SVG图像，这种优化的效果会很明显。
下面是优化后的SVG代码：

```
<svg width="198" height="188" viewBox="0 0 198 188" xmlns="http://www.w3.org/2000/svg">
<path stroke="#979797" stroke-width="3" fill="#F8E81C" d="M99 1541-58.78 30.902 11.227-65-45L3.894......"/>
</svg>
```

使用SVGO之前你要意识到，SVGO非常流行，其他很多SVG工具也使用它。

例如，我们提到过的Iconizr(http://iconizr.com/)。
就会默认用SVGO处理你的SVG文件。
所以，你要尽量避免无意义的多次优化。

## 把SVG作为滤镜

前面，我们提到了CSS的滤镜效果。
然而，它们在IE10和IE11上尚未被支持。
庆幸的是，我们可以依靠SVG在IE10和IE11上创建滤镜。
但是这和以往一样，并没有你想象中那么直接。

```
<img class="HRH" src="queen@2x-1024x747.png" />
```

同样，在该示例的文件夹里，有一个SVG里定义了一个滤镜，代码如下:

```
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
        <filter id="myfilter" x="0" y="0">
            <feColorMatric in="SourceGraphic" type="hueRotate" values="90" result="A"/>
            <feGaussianBlur in="A" stdDeviation="6"/>
        </filter>
    </defs>
</svg>
```

在滤镜内，我们首先定义一个90度的色盘旋转（使用feColorMatrix)，然后写入特效，通过result属性导向下一个过滤器（feGaussianBlur），并在上面设置模糊值为6。

这里要强调一下，它看上去并不优雅，但是无疑它能够正常工作。

现在，我们无需直接把SVG标记添加到HTML中去，而是通过上一章提到的CSS过滤器语法引用它。

```
.HRH {
    filter: url('filter.svg#myfilter");
}
```

不幸的是，这个方法在IE10和IE11上并不生效。
然而，还是有其他方法来达到目标。
我们可以在SVG里引用SVG的image标签引入该图片。

```
<svg width="1024px" height="747px" viewBox="0 0 1024 747" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
        <filter id="myfilter" x="0" y="0">
            <feColorMatrix in="SourceGraphic" type="hueRotate" values="90" result="A"/>
            <feGaussianBlur in="A" stdDeviation="6"/>
        </filter>
    </defs>
    <image x="0" y="0" width="1024px" height="747px" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="queen@2x-1024x747.png" filter="url(#myfilter)">
    </image>
</svg>
```

这个SVG标记和前一个例子中的外部filter.svg滤镜十分相似，但是添加了height、width和vviewBox属性。

另外，我们需要的图像是SVG中defs元素外的唯一内容。
我们使用filter属性和滤镜的ID来链接到我们需要的滤镜（在上方的defs中定义）。

虽然这个方法比较麻烦，但是你可以从SVG里获得更多的滤镜效果，而且能够在IE10和IE11中正常工作。

## SVG 中媒体查询的注意事项

所有支持SVG的浏览器应该都支持SVG内部定义的CSS媒体查询。
然而，当你用到SVG内部的媒体查询时，还是要注意一些小问题。

假如，假设你插入如下的SVG内部媒体查询：

```
<style type="text/css">
    <![CDATA[
        #star_Path {
            stroke: red;
        }
        @media (min-width: 800px) {
            #star-Path {
                stroke: violet;
            }
        }
    ]]>
</style>
```

当视口为1200像素宽的时候，该SVG的大小为200像素宽。

我们想让这个星星在屏幕宽度超过800像素的时候，边框呈现为紫色。
而这正是我们缩写的媒体查询的意图。
然而，当SVG通过img标签插入、作为背景图像插入或者通过object标签插入的时候，它们并不清楚外部HTML文档的信息。

因此，此时的min-width就是SVG本身的最小宽度。

所以，除非SVG本身的宽度大于800像素，否则边框不会变成紫色。
相反，当你插入一个内联SVG的时候，它和页面融合在一起（某种程度上可以这么说）。

此时媒体查询中的min-width会由视口决定。

为了解决这个问题，并且让媒体查询表现一直，可以这样修改我们的代码：

```
@media (min-device-width: 800px) {
    #star-Path {
        stroke: violet;
    }
}
```

这种情况下，无论SVG大小如何，采用何种方法插入，它们都会寻找设备宽度（也就是视口）进行对比。

### 实现技巧

本章差不多要结束了，但是就SVG而言，我们仍然有很多可以谈的。
因此，我列出几个不相关的注意事项。
它们不太值得我们长篇大论，但是我会用注意事项的方式标记出来，从而节省你搜索的时间。

- 如果你不需要添加SVG动画，选择图片精灵或者data URI 样式表的方式进行调用。这样会更容易提供备用资源，而且在性能方面也表现得更好。

- 在资源创建的过程中尽可能使用自动化，这样会减少人工错误且效率更高。

- 要在项目中插入SVG的话，尽可能只用一种调用方式（图片精灵、data URI或者内联）。多种引入方式不利于后期维护。

- 在SVG动画上没有“一刀切”的方案。对于偶尔使用而且简单的动画，使用CSS。对于交互复杂的动画火鹤时间轴动画，而且需要在IE上生效的，使用可靠的库，如GreenSock、Velocity.js或者Snap.svg。