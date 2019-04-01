# Flex 布局

## 精品教程

[阮一峰 Flex](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

### Flex 之前

Flex 之前，主要使用

- normal flow (正常流，也叫文档流)
- float + clear
- position relative + absolute
- display inline-block
- 负 margin

### Flex 来了

一种新的布局方式- Flex 布局

1. 块级布局侧重垂直方向、行内布局侧重水平方向，flex 布局是与方向无关的。
2. flex 布局可以实现 空间自动分配、自动对齐（flexible: 弹性、灵活）。
3. flex 适用于 简单的线性布局，更复杂的布局要交给 grid 布局（还没发布）。


###  基本概念

- main size
- cross size
- flex container
- flex item
- cross start
- cross end
- main axis
- cross axis

#### flex container 的属性

- flex-direction 方向  :[row, row-reverse, column, column-reverse ]
- flex-wrap 换行 : [ wrap, nowrap, initial, inherit, unset, wrap-reverse ]
- flex-flow 上面两个的简写 
- justify-content 主轴方向对齐方式 : [ flex-start, center, flex-end, inherit, initial, space-around, space-between ]
- align-items 侧轴对齐方式  : [ flex-start, center, flex-end, inherit, initial, space-around, space-between ]
- align-content  多行/ 列内容对齐方式 (用得较少) : [ center, flex-end, flex-start, inherit, initial, space-between, space-around, stretch]

#### flex item 的属性

原理： 空间的分配

- flex-grow 增长比例 （空间过多时）
- flex-shrink 收缩比例 （空间不够时）
- flex-basis 默认大小 （一般不用）
- flex 上面三个的缩写 flex-grow, flex-shrink, flex-basis
- order 顺序 （代替双飞翼）
- align-self 自身的对齐方式

#### 使用 flex 布局

1. 手机页面布局 (topbar + main + tabs)
2. 产品列表 (ul > li * 9)
3. PC 页面布局
4. 完美居中

```html
<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>移动页面布局</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    ul {
      list-style: none;
    }
    .container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      height: 10%;
      background: #ccc;
    }
    main {
      flex-grow: 1;
      background: #eee;
    }
    footer {
      height: 10%;
    }
    footer ul {
      height: 100%;
      display: flex;
    }
    footer > ul > li {
      background: red;
      width: 25%;
      height: 100%;
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>header</header>
    <main>main</main>
    <footer>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </footer>
  </div>
</body>
</html>

```

```html

<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>产品列表</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    ul {
      list-style: none;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      width:350px;
      margin: auto;
      border: 1px solid red;
      justify-content: space-between;
    }
    li {
      width: 100px;
      height: 100px;
      background: #ddd;
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</body>
</html>
```


```html

<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>PC布局</title>
  <style>
    header {
      height: 50px;
      background: #ddd;
    }
    footer {
      height: 50px;
      background: #ddd;
    }
    .content {
      display: flex;
    }
    .content > aside {
      width: 120px;
      background: #444;
    }
    .content > main {
      height: 400px;
      flex: 1;
      background: #ff0000;
    }
    .content > nav {
      width: 100px;
      background: green;
    }
  </style>
</head>
<body>
  <header></header>
  <div class="content">
    <aside id="aside1"></aside>
    <main></main>
    <nav></nav>
  </div>
  <footer></footer>
</body>
</html>
```

```html
<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>flex 绝对居中</title>
  <style>
    .parent {
      height: 400px;
      background: #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .child {
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <div class="parent">
    <div class="child">
      快要吃完饭啦！快要吃完饭啦！快要吃完饭啦！快要吃完饭啦！快要吃完饭啦！快要吃完饭啦！<br>
      快要吃完饭啦！<br>
      快要吃完饭啦！<br>
      快要吃完饭啦！<br>
      快要吃完饭啦！<br>
      快要吃完饭啦！<br>
    </div>
  </div>
</body>
</html>

```

