# CSS 浮动和定位

## 浮动的基本概念

浮动模型也是一种可视化格式模型，浮动的框可以左右移动（根据 float 属性值而定），直到它的外边缘碰到包含框或者另一个浮动元素的框的边缘。浮动元素不在文档的普通流中，文档的普通流中的元素表现的就像浮动元素不存在一样。


正常情况

``` html
<div style="border: 5px solid #0e0; width: 300px;">
  <div style="height: 100px; width: 100px; background-color: red;">
  </div>
  <div style="height: 100px; width: 100px; background-color: green;">
  </div>
  <div style="height: 100px; width: 100px; background-color: yellow;">
  </div>
</div>
```

红向右浮动

``` html
<div style="border: 5px solid #0e0; width: 300px;">
  <div style="height: 100px; width: 100px; background-color: red; float: right;">
  </div>
  <div style="height: 100px; width: 100px; background-color: green;">
  </div>
  <div style="height: 100px; width: 100px; background-color: yellow;">
  </div>
</div>
```

都向左浮动，父元素宽度为 0

``` html
<div style="border: 5px solid #0e0; width: 300px;">
  <div style="height: 100px; width: 100px; background-color: red;">
  </div>
  <div style="height: 100px; width: 100px; background-color: green;">
  </div>
  <div style="height: 100px; width: 100px; background-color: yellow;">
  </div>
</div>
```

如果包含块儿太窄无法容纳水平排列的三个浮动元素，那么其他浮动块儿向下移动，直到有足够的空间，如果浮动元素的高度不同，那么向下移动的时候可能被卡住。


### 行框

浮动会让元素脱离普通流，如果浮动的元素后面有一个文档流中元素。
那么这个元素的框会表现的像浮动元素不存在，但是框的文本内容会收到浮动元素的影响，会移动以留出空间。用术语说就是浮动元素旁边的行框被缩短，从而给浮动元素流出空间，因而行框围绕浮动框。

### 清除浮动

可以看出浮动后虽然绿色 div 布局不受浮动影响，正常布局，但是文字部分却被挤到了红色浮动 div 外边。 要想阻止行框围绕在浮动元素外边，可以使用 clear 属性，属性的 left, right, both, none 表示框的哪些边不挨着浮动框。

如果我们想让父元素在视觉上包围浮动元素可以像下面这样处理，在最后添加一个空 div， 对它清理。缺点是增加一个无意义的标签。

``` html
<div style="border: 5px solid #0e0; width: 300px;">
  <div style="height: 100px; width: 100px; background-color: red; float: left">
  </div>
  <div style="height: 100px; width: 100px; background-color: green;float: left">
  </div>
  <div style="height: 100px; width： 100px; background-color: yellow; float: left">
  </div>
  <div style="clear: both;"></div>
</div>
```

``` css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

### BFC 特性

BFC 会阻止垂直外边距 （margin-top、margin-bottom）折叠

- 按照 BFC 的定义，只有同属于一个 BFC 时，两个元素才有可能发生垂直 Margin 的重叠，这个包括相邻元素，嵌套元素，只要他们之间没有阻挡（例如边框，非空内容，padding 等）就会发生 margin 重叠。

- 因此要解决 margin 重叠问题，只要让它们不在同一个 BFC 就行了，但是对于了两个相邻元素来说，意义不大，没有必要给它们加个外壳，但是对于嵌套元素来说就很有必要了，只要把父元素设为 BFC 就可以了。这样 子元素的 margin 就不会和父元素的 margin 发生重叠。

- BFC 不会重叠浮动元素
- BFC 可以包含浮动

我们可以利用 BFC 的第三条特性来 “清浮动”，这里其实说清浮动已经不再合适，应该说包含浮动。也就是说只要父容器形成 BFC 就可以，简单看看如何形成 BFC

- float 为 left | right
- overflow  为 hidden | auto | scroll
- display  为 table-cell | table-caption | inline-block
- position 为 absolute | fixed

局限性

使用 BFC 包含 float 的时候会使父容器长度缩短，而且还有个重要缺陷—— 父容器 float 解决了其塌陷问题，那么父容器的父容器怎么办？ overflow 属性会影响滚动条和绝对定位的元素；position 会改变元素的定位方式，这是我们不希望的，display 这几种方式依然没有解决低版本 IE 问题。。


### 通用的清理浮动方案

``` css
/* 方法1 */
.clearfix {
  *zoom: 1;
}

.clearfix::after {
  content: "";
  display: block;
  clear: left;
}

/* 方法2 */
.clearfix {
  *zoom: 1;
}
.clearix::after {
  content: "";
  display: table;
  clear: both;
}
```

两种方案

虽然我们得出了一种浏览器兼容的靠谱解决方案，但这并不代表我们一定得用这种方式，很多时候我们的父容器本身需要 position: absolute 等形成了 BFC 的时候我们可以直接利用这些属性了，大家要掌握原理，活学活用。

总而言之，清理浮动两种方式

1. 利用 clear 属性，清除浮动
2. 使 父容器形成 BFC


## CSS 定位

基本属性

|值| 属性|
|:-:|:-:|
|inherit| 规定应该从父元素继承 position 属性的值|
|static| 默认值，没有定位，元素出现在正常的流中（忽略 top，bottom，left，right 或者 z-index 声明）|
|relative| 生成相对定位的元素，相对于元素本身正常位置进行定位，因此， left: 20px 会向元素的 left 位置添加 20px|
|absolute| 生成绝对定位的元素，相对于 static 定位以外的第一个祖先元素（offset parent）进行定位，元素的位置通过 left，top，right 以及 bottom 属性进行规定|
|fixed| 生成绝对定位的元素，相对于浏览器窗口进行定位。元素的位置通过 left， top，right 以及 bottom 属性进行规定。|
|sticky| CSS3 新属性，表现类似 position: relative 和 position: fixed 的合体， 在目标区域在屏幕中可见|

### 普通流与相对定位

CSS 有三种基本的定位机制: 普通流，相对定位和绝对定位

- 普通流是默认定位方式，在普通流中元素框的位置由元素在 html 中的位置决定，元素 position 属性为 static 或 继承来的 static 时就会按照普通流定位，这也是我们最常见的方式

- 相对定位比较简单，对应的 position 属性的 relative 值，如果对一个元素进行相对定位，它将出现在他所在的位置上，然后可以通过设置垂直或水平位置，让这个元素相对于它自己移动，在使用相对定位时，无论元素是否移动，元素在文档流中占据原来空间，只是表现出来的位置会改变。

