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

