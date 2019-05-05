# CSS 布局

- 什么是布局
- DIV + CSS？
- 固定宽度 VS 弹性布局
- 单列布局
- 双列布局
- 三列布局

## 什么是布局

现有样式不能满足人们的需求
- 文档流
- 浮动
- 定位

人们需要：
- 导航栏 + 内容
- 导航栏 + 内容 + 广告栏
- 从上到下、从左到右、定宽、自适应..

CSS2 并没有提供原声支持，所以需要将一些属性组合起来，以实现布局

## “DIV + CSS 布局” 

中国特色，国外一般不这么叫 <div> 是一个无语义的标签，适合用来做与内容无关的事情 只能用 <div> 吗？

1. 不一定
2. 尽量使用有语义的标签

## 常见布局（PC）

- 固定宽度布局
- 弹性 （fluid）布局
- 响应式布局 ———— 多终端 （PC、Pad、Phone）

## 单列布局

如何实现

定宽

width: 1000px; 或 max-width: 1000px;

水平居中

margin-left: auto; margin-right: auto;

``` html
<style>
  .layout {
    /*width: 960px;*/
    max-width: 960px;
    margin: auto;
  }
  #header {
    height: 60px;
    background: red;
  }
  #content {
    height: 400px;
    background: blue;
  }
  #footer {
    height: 50px;
    background: yellow;
  }
</style>
<div id="header" class="layout">头部</div>
<div id="content" class="layout">内容</div>
<div id="footer" class="layout">尾部</div>
```

通栏

``` html
<style>
  body {
    min-width: 960px;
  }
  .layout {
    width: 960px;
    margin: 0 auto;
  }
  #header {
    height: 60px;
    background: red;
  }
  #content {
    height: 400px;
    background: blue;
  }
  #footer {
    height: 50px;
    background: yellow;
  }
</style>

<div id="header"> 
  <div class="layout">头部</div>
</div>
<div id="content" class="layout">内容</div>
<div id="footer">
  <div class="layout">尾部</div>
</div>