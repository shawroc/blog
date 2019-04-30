# CSS 常见样式 2

## CSS 背景 - 元素隐藏 - inline-block

### 背景

|属性|描述|
|:-:|:-:|
|background|简写属性，作用是将背景属性设置在一个声明中|
|background-attachment| 背景图像是否固定或者随着页面的其余部分滚动|
|background-color|设置元素的背景颜色|
|background-image|把图像设置为背景|
|background-position|设置背景图像的起始位置|
|background-repeat|设置背景图像是否及如何重复|
|background-size|设置背景的大小（兼容性)|

- background-position: 默认左上角
  - x y
  - x% y%
  - [ top | center | bottom ] [ left | center | right]

- background-repeat
  - no-repeat: 背景图片在规定位置
  - repeat-x: 图片横向重复
  - repeat-y: 图片纵向重复
  - repeat: 全部重复

- background-size
  - 100px 100px
  - contain
  - cover


例子

``` css
background-color: #f00;
background-image: url(background.gif);
background-repeat: no-repeat;
background-attachement: fixed;
background-position: 0 0;

/* 可以缩写为一句话 */
background: #f00 url(background.gif) no-repeat fixed 0 0;
```

### CSS Sprite

- 指将不同的图片/图标合并在一张图上。
- 使用 CSS Sprite 可以减少网络请求，提高网页加载性能。

### 隐藏 or 透明

- opacity: 0; 透明度为 0， 整体
- visibility: hidden; 和 opacity: 0 类似
- display: none; 消失，不占用位置
- background-color: rgba(0,0,0,0.2) 只是背景色透明

### inline-block

- 既呈现 inline 特性 （不占据一整行，宽度由内容宽度决定）
- 又呈现 block 特性 （可设置宽高，内外边距）
- 缝隙问题

``` html
<style>
/* inline-block 居中 */
/* 如何消除inline-block之间的缝隙呢？*/
body {
  text-align: center;
}
.wrap {
  font-size: 0;
}
.box {
  border: 1px solid;
  display: inline-block;
  width: 100px;
  vertical-align：top;
}
.b1 {
  padding: 40px;
}
.b2 {
  padding: 10px;
}
</style>

<div class="wrap"> 
  <span class="box b1">hello</span>
  <span class="box b2">world</span>
</div>
```

### line-height

line-height 是用来设置单行文本的行高

- line-height: 2
- line-height: 100%
- height = line-height 来垂直居中单行文本

line-height: 2 和 line-height: 200% 有什么区别呢？


``` html

<style>
  /* line-height 是可以继承的 */
  /* line-height: 2 会根据 每个元素的行内元素字体大小去计算 */
  /* body {
    line-height: 2;
  } */

  /* 如果写百分比的话， */
  /* 则根据 html 根元素的字体大小，自动计算出值 */
  /* 而 line-height 是 可继承的 */
  .body {
    line-height: 200%;
  }
  .box {
    border: 1px solid red;
    width: 200px;
    padding: 10px;
  }
  .box p {
    font-size: 30px;
  }
</style>

<body>
  <div class="box">
  line-height: 2, line-height: 100%, height = line-height 来垂直居中单行文本
  <p>hello world hello world</p>
  </div>
</body>
```

### 盒模型

W3C 标准中 padding、border 所占的空间不在 width、height 范围内，大家俗称的 IE 的盒模型 width 包括 content 尺寸 + padding + border

- 标准盒模型， content(height + width) + padding + border + margin

- IE 盒模型， content + padding + border (height +width) + margin

ie678 怪异模式 （不添加 doctype) 使用 ie 盒模型， 宽度 = 边框 + padding + 内容宽度

chrome, ie 9+， ie678（添加 doctype）使用标准盒模型，宽度 = 内容宽度

#### 使用 css3 新样式 box-sizing

1. box-sizing: content-box, w3c 标准盒模型
2. box-sizing: border-box, "IE 盒模型"


### icon 的各种实现方式

目录

1. 需求
2. image
3. CSS Sprite
4. Icon Font
5. CSS Icon
6. SVG

#### 使用 image 实现

注意事项

1. img 的大小设置
2. img 的 vertical-align
3. 请求数过多

请求是邪恶的吗？
明明可以发更少的请求，你却发很多请求，这才是邪恶的。

#### CSS Sprites

CSS 精灵图

你还在人肉拼 Sprites 吗？

1. 用命令行：sprity create build resource/*.png -s style.css

sprity create out resourse -s style.css

2. 用在线工具: http://cn.spritegen.website-performance.org

缺点

1. 无法缩放
2. 不好修改

#### Icon Font

把字体做成图标

1. 制作字体文件
2. 声明 font-family
  1. 使用本地链接
  2. 使用第三方链接
3. 使用 font-family
  1. 使用 HTML 实体
  2. 使用 CSS :before

#### html 实体

html entity

#### CSS icon

用 CSS 画

CSS 能画圆，能画方，为什么不能画 icon？

https://cssicon.space/

#### SVG

1. img src=svg
2. SVG "sprites"

借助工具。


