# AMD & CMD & RequireJS

## 模块化的价值

最主要的目的：

- 解决命名冲突
- 依赖管理

其他价值

- 提高代码可读性
- 代码解耦，提高复用性

参考 

[前端模块化开发的价值](https://github.com/seajs/seajs/issues/547)

## 前端模块化

在 JavaScript 发展初期就是为了实现简单的页面交互逻辑，寥寥数语即可。

如今 CPU、浏览器性能得到了极大的提升，很多页面逻辑迁移到了客户端（表单验证等），随着 web2.0 时代的到来，Ajax 技术得到广泛应用，jQuery 等前端库层出不穷，前端代码日益膨胀。

这时候 JavaScript 作为嵌入式的脚本脚本的定位动摇了，JavaScript 却没有为组织代码提供任何明显帮助，甚至没有类的概念，更不用说模块 （module）了，JavaScript 极其简单的代码组织规范不足以驾驭如此庞大规模的代码。

### 模块

既然 JavaScript 不能 handle 如此大规模的代码，我们可以借鉴一下其他语言是怎么处理大规模程序设计的，**在 Java 中有一个重要的概念 -- package，逻辑上相关的代码组织到同一个包内，包内是一个相对独立的王国，不用担心命名冲突什么的，那么外部如何使用呢？ 直接 import 对象的 package 即可。

```java

import java.util.ArrayList;

```

遗憾的是 JavaScript 在设计时的定位原因，没有提供类似的功能，开发者需要模拟出类似的功能，来隔离、组织复杂的 JavaScript 代码，我们称为 模块化。

一个模块就是实现特定功能的文件，有了模块，我们就可以更方便地使用别人的代码，想要什么功能，就加载什么模块。模块开发需要遵循一定的规范，各行其是就都乱套了。

规范形成的过程是痛苦的，前端的先驱在刀耕火种、茹毛饮血的阶段开始，发展到现在初具规模，简单了解下这段不凡的历程。

#### 函数封装

我们在讲函数的时候提到，函数一个重要的功能就是实现特定逻辑的一组语句打包，而且 JavaScript 的作用域就是基于函数的，所以把函数作为模块化的第一步是很自然的事情，在一个文件里面编写几个相关函数就是最开始的模块了。

```js
function fn1(){
  statement
}

function fn2(){
  statement
}
```

这样在需要的以后加载函数所在文件，调用函数就可以了。

这种做法的缺点很明显：污染了全局变量，无法保证不与其他模块发生变量名冲突，而且模块成员之间没什么关系。

#### 对象

为了解决上面问题，对象的写法应运而生，可以吧所有的模块成员封装在一个对象中。

```js
var myModule = {
  var 1: 1,

  var 2: 2,

  fn1: function(){

  },
  
  fn2: function(){

  }
}


```

这样我们在希望调用模块的时候引用对应文件，然后

```js
myModule.fn2();
```

这样就避免了变量污染，只要保证模块名唯一即可，同时同一模块内的成员也有了关系。
看似不错的解决方案，但是也有缺陷，外部可以随意修改内部成员。

```js

myModule.var1 = 100;
```

这样就会产生意外的安全问题

#### 立即执行函数

可以通过立即执行函数、来达到隐藏细节的目的

```js
var myModule = (function(){
  var var1 = 1;
  var var2 = 2;

  function fn1(){

  }

  function fn2(){

  }

  return {
    fn1: fn1,
    fn2: fn2
  };

})();
```

这样在模块外部无法修改我们没有暴露出来的变量、函数。

上述做法就是我们模块化的基础，目前，通行的 JavaScript 模块规范主要有两种：CommonJS 和 AMD。


## CommonJS

我们先从 CommonJS 谈起，因为在网页端没有模块化编程 只是页面 JavaScript 逻辑复杂，但也可以工作下去，在服务器端却不一定要有模块，所以虽然 JavaScript 在 web 端发展这么多年，第一个流行的模块化规范却由服务器端的 JavaScript 应用带来，CommonJS 规范 是由 NodeJS 发扬光大，这标志着 JavaScript 模块化编程正式登上了舞台。

1. 定义模块： 根据 CommonJS 规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为 global 对象的属性。

2. 模块输出： 模块只有一个出口，module.exports 对象，我们需要把模块希望输出的内容放入该对象。

3. 加载模块：加载模块使用 require 方法， 该方法读取一个文件并执行，返回文件内部的 module.exports 对象。

看个例子

```js
// 模块定义 myModel.js

var name = "Byron';

function printName(){
  console.log(name);
}

function printFullName(firstName) {
  console.log(firstName + name);
}

module.exports = {
  printName: printName,
  printFullName: printFullName
}

// 加载模块

var nameModule = require('./myModule.js');

nameModule.printName();
```

不同的实现对 require 时的路径要求有不同要求，一般情况可以省略 js 扩展名， 可以使用相对路径，也可以使用绝对路径，甚至可以省略路径直接使用模块名（前提是该模块是系统内置模块）。

## 尴尬的浏览器

仔细看上面的代码，会发现 require 是同步的。
模块系统需要同步读取模块文件内容，并编译执行以得到模块接口。

这在服务器端实现很简单，也很自然，然而，想在浏览器实现问题却很多。

**浏览器端，加载 JavaScript 最佳、最容易的方式是在 document 中插入 script 标签。但脚本标签天生异步，传统 CommonJS 模块在浏览器环境中无法正常加载。**

解决思路之一是，开发一个服务器端组件，对模块代码作静态分析，将模块与它的依赖列表一起返回给浏览器。这很好使，但需要服务器安装额外的组件，并因此要调整一系列底层架构。

另一种解决思路是，用一套标准模板来feng·