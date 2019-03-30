# icon 全解

## icon 的各种做法

1. img 法
2. background 法 n
3. background 合一法 CSS Sprites Generator
4. font 法
5. SVG 法 (推荐使用 SVG 法)
6. 新手慎用：CSS 就是干法  cssicon.space

font 法, html entity 这个概念 

www.iconfont.cn 查看帮助文档即可

svg 支持 写 CSS

```html

<svg style="width: 100px; height: 100px; fill: red; stroke: black; stroke-width: 10px;" class="icon" aria-hidden="true">
  <use xlink:href="#icon-qq"></use>
</svg>


```

生成在线代码

```html css
@font-face {
  font-family: 'iconfont';
  src: url('//at.../..);
  src: url() format('embeded-opentype),
  url(),
  url()
}

<div style="font-family:iconfont;">
  &#xe614; &#xe613; &#xe61c;
</div>
```

```css

.xxx::before {
  //css的写法
  content: '\e614';
}
```
