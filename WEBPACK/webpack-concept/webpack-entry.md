# webpack-entry

正如在入门中提到的，有多种方法可以在 webpack 配置中定义 entry 属性。
接下来，将展示配置entry 属性的方法，并解释为什么可能对您有用。

## Single Entry(Shorthand) Syntax

Usage: entry: string | Array < string >

``` js
// webpack.config.js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

## Object Syntax

Usage: entry: { [ entryChunkName : string ]: Array < string >}

webpack.config.js

``` js
module.export = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
}
```

对象语法虽然冗长，然而，这是在应用程序中定义条目的最可伸缩的方式。

## 多页应用 Multi Page Application

webpack.config.js

``` js
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

这是做什么的？
我们告诉 webpack 我们想要3个独立的依赖关系。

为什么？
在多页面应用程序中，服务器将为您获取一个新的 HTML 文档。
页面将重新加载此新文档并重新下载资源。
这就给了我们很多机会去做一些事。

- 利用 optimization.splitChunks 在每个页面之间创建共享代码包。在入口点之间重用大量代码/模块的多页面应用程序可以极大地受益于这些技术。