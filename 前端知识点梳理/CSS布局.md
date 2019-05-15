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
```

### 内联元素水平居中

内联元素水平居中

``` css
.parent {
  text-align: center;
}
.child {
  display: inline-block;
}

/* IE6 不支持 inline-block (为什么用下面的写法) */

.child {
  * display: inline;
  * zoom: 1;
}
```

范例

``` html
<style>
.layout {
  max-width: 960px;
  margin: 0 auto;
}

#header {
  background: #eee;
  text-align: center;
  font-size: 0;
  padding: 10px;
}

#header .btn {
  display: inline-block;
  border: 1px solid #ccc;
  border-right: 0;
  font-size: 14px;
  color: #000;
  text-decoration: none;
  padding: 5px 8px;
}

#header .btn:first-child {
  border-radius: 5px 0 0 5px;
}
#header .btn:last-child {
  border-right: 1px solid #ccc;
  border-radius: 0 5px 5px 0;
}
#content {
  height: 400px;
  background: pink;
}
#footer {
  height: 50px;
  background: yellow;
}
</style>

<div id="header">
  <a class="btn" href="#">HTML</a>
  <a class="btn" href="#">CSS</a>
  <a class="btn" href="#">JavaScript</a>
</div>
<div id="content">
</div>
<div id="footer">
</div>
```

双列布局

一列固定宽度，另外一列自适应宽度

如何实现

浮动元素 + 普通元素 margin

侧边栏在左边

``` html
<div id="content">
  <div class="aside">aside</div>
  <div class="main">content</div>
</div>
<div id="footer">footer</div>

<style>
/* 用了浮动之后， 必须清除 浮动 */ 
#content:after {
  content: '';
  display: block;
  clear: both;
}
.aside {
  width: 200px;
  height: 500px;
  background: yellow;
  float: left;
}
.main {
  margin-left: 210px;
  height: 400px;
  background: red;
}
```

侧边栏在右边

``` html
<div id="content">
  <div class="aside">aside</div>
  <div class="main">content</div>
</div>
<div id="footer">footer</div>

<style>
/* 注意渲染的先后顺序 */
  #content:after {
    content: '';
    display: block;
    clear: both;
  }
  .aside {
    width: 200px;
    height: 500px;
    background: yellow;
    float: right;
  }
  .main {
    margin-right: 210px;
    height: 400px;
    background: red;
  }
  #footer {
    background: #ccc;
  }
</style>
```

三列布局

两侧两列固定宽度，中间列自适应宽度

如何实现？

``` html
<div id="content">
  <!-- 为什么不是main在前面 -->
  <div class="menu">aside</div>
  <div class="aside">aside</div>
  <div class="main">main</div>
</div>
<div id="footer">footer</div>

<style>
  #content::after {
    content: '';
    display: block;
    clear: both;
  }
  .menu {
    width: 100px;
    height: 500px;
    background: pink;
    float: left;
  }
  .aside {
    width: 200px;
    height: 500px;
    background: yellow;
    float: right;
  }
  .main {
    margin-left: 110px;
    margin-right: 210px;
    height: 400px;
    background: red;
  }
  #footer {
    background：#ccc;
  }
</style>
```


一栏布局

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Bin</title>
  <style>
    body {
      margin: 0;
    }
    #topbar {
      border: 1px solid blue;
      min-height: 40px;
    }
    #topbar>.inner {
      max-width: 800px;
      min-height: 40px;
      border: 1px solid green;
      margin-left: auto;
      margin-right: auto;
      line-height: 40px;
    }
    #topbar .logo {
      width: 40px;
      height: 40px;
      background: #ddd;
      float: left;
    }
    #topbar .buttons {
      float: right;
    }
    #topbar .slogan {
      border: 1px solid;
      margin-left: 40px;
      margin-right: 100px;
    }
    .clearfix::after {
      content: '';
      display: block;
      clear: both;
    }
    main {
      border: 1px solid red;
      max-width: 800px;
      min-height: 100px;
      margin-top: 10px;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  <div id="topbar">
    <div class="inner clearfix">
      <div class="logo"></div>
      <div class="buttons">
        <a href="#">登录</a>
        <a href="#">注册</a>
      </div>
      <div class="slogan">hi</div>
    </div>
  </div>
  <main></main>
</body>
</html>
```

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Bin</title>
  <style>
    body {
      margin: 0;
    }
    #topbar {
      border: 1px solid blue;
      min-height: 40px;
    }
    #topbar>.inner {
      max-width: 800px;
      min-height: 40px;
      border: 1px solid green;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
    }
    #topbar .logo {
      width: 40px;
      height: 40px;
      background: #ddd;
    }
    #topbar .slogan {
      flex-grow: 1;
    }
    main {
      border: 1px solid red;
      max-width: 800px;
      min-height: 100px;
      margin-top: 10px;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  <div id="topbar">
    <div class="inner">
      <div class="logo"></div>
      <div class="buttons">
        <a href="#">登录</a>
        <a href="#">注册</a>
      </div>
      <div class="slogan">hi</div>
    </div>
  </div>
  <main></main>
</body>
</html>
```

