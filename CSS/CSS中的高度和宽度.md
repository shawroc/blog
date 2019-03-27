# 宽度与高度

### 核心知识

1. 文档流(Normal Flow)
    i. 内联元素的宽高
    ii. 块级元素的宽高
      一个div里面如果有一个内联元素，那么div高度是由内联元素的行高line-height决定的。
      如果有多行呢，就是把每一行的line-height加起来一起算

    iii. 水平居中
    iv. 垂直居中
    v. 文字溢出省略(多行)

2. 盒模型
    i. 一比一的 div
    ii. outline
    iii. border调试大法

如果父元素没有什么东西挡住margin，那么儿子元素的上下margin就会和父元素的margin合并起来

div的高度是由它内部文档流中元素高度的总和决定的

脱离文档流（正常流）的几种方式，float, position: absolute, position: fixed

内联元素的高度和上下padding无关，div的高度由line-height决定

### 一些小技巧

#### 让单行内联元素实现两端对齐

```
/*CSS*/
div {
  border: 1px solid red;
  font-size: 20px;
}
/* text-align: justify 只有在多行文本时才生效，两端对齐*/
span {
  display: inline-block;
  text-align: justify;
  width: 5em;
  line-height: 20px;
  height: 20px;
  overflow: hidden;
}
span::after {
  content: '';
  display: inline-block;
  width: 100%;
  border: 1px solid red;
}

<!-- html -->
<div>
  <span>姓名</span><br>
  <span>联系方式</span>
</div>
```

#### 让内联元素之间没有空格的方法

```
/*CSS*/
ul {
  margin: 0; 
  padding: 0;
  list-style: none;
}
/* float之后 li 会自动变成 inline-block?*/
ul > li {
  float: left;
  border: 1px solid red;
}
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

<!-- html -->
<div>
  <ul class="clearfix">
    <li>选项1</li>
    <li>选项2</li>
    <li>选项3</li>
    <li>选项4</li>
    <li>选项5</li>
    <li>选项6</li>
  </ul>
</div>
```

#### 让单词自动断行的方法

```
/* CSS */
/*直接使用CSS中的word-break: break-all*/
/*不过这个功能一般很难用到 */
/*单词的断行，断行所有*/
div {
  border: 1px solid red;
  word-break: break-all;
}

<!-- html -->
<div>
  <!--在html中可以直接使用连字符，--断行。-->
  1
  <!-- 这是一个word -->
  2222222222222222222222222222222222222222222222222222222222
  3
  4
  5
</div>
```

#### 单行文字溢出

```
/* CSS */
/*单行文本溢出*/
div {
  border: 1px solid red;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

<!--html-->
<div>
  1
  2222222222222222222222222222222222222222222222222222222222
  2222222222222222222222222222222222222222222222222222222222
  2222222222222222222222222222222222222222222222222222222222
  2222222222222222222222222222222222222222222222222222222222
  2222222222222222222222222222222222222222222222222222222222
  3
  4
  5
</div>
```

#### 多行文字溢出

```
/* CSS */
/*多行文本溢出*/
div {
  border: 1px solid red;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

<!--html-->
<div>
  1
  2222222222222222222222222222222222222222222222222222222222
  2222222222222222222222222222222222222222222222222222222222
  3
  4
  5
</div>
```

#### 文字垂直居中

```
/* CSS */
/*文字垂直居中*/
div {
  border: 1px solid red;
  line-height: 24px;
  padding: 8px 0;
  text-align: center;
}

<!--html-->
<div>
  1
  2222222222222222222222222222222222222222222222222222222222
  2222222222222222222222222222222222222222222222222222222222
  3
  4
  5
</div>
```

#### 绝对居中

```
/* CSS */
/*div垂直居中*/
body {
  margin: 0;
  border: 1px solid black;
}
/* margin: auto 配合 position: absolute top:0 right: 0 bottom: 0 left: 0 ， 定宽定高 */ 
/* .son {
  border: 1px solid red;
  padding: 10px;
  width: 100px;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100px;
} */

.son {
  border: 1px solid black;
}
/* 子元素不定宽高，如何绝对居中。
  父元素display: flex;
        justify-content: center;
        align-items: center;
*/
.dad {
  outline: 3px solid green;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

<div class="dad">
  <div class="son">
    block 2222
    block 2222
    block 2222
    block 2222
    block 2222
  </div>
</div>
```

#### 一比一的div

```
/* CSS 一比一 
  padding-top
  “百分数是相对于父元素的width计算的，所以如果父元素的width以某种方式发生变化，百分数也会变化”。
  */
.one {
  border: 1px solid red;
  padding-top: 100%;
}

<div class="one">
</div>
```


