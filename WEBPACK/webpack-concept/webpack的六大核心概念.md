# webpack 文档阅读笔记 20190523

## webupack 六个主要的概念

- Entry
- Output
- Loaders
- Plugins
- Mode
- Browser Compatibility

### Entry

entry 指示 webpack 应该使用哪个模块开始构建其内部依赖关系图。

entry 的 默认值是 ./src/index.js。

可以在 webpack.config.js（webpack 的配置文件）里自定义。

``` js
// webpack.config.js
module.exports = {
  entry: './path/to/my/entry/file.js'
}

```

### Output

output 告诉 webpack 在何处派发出它创建的包，以及如何命名这些文件。

output 的默认值 是 ./dist/main.js

可以在 webpack.config.js（webpack 的配置文件）里自定义。

``` js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

### Loaders

webpack 只能解析 JavaScript 和 JSON 文件。

Loader 允许 webpack 处理其他类型的文件，并将它们转换为可由应用程序使用并添加到依赖关系图中的有效模块。

loaders 在 webpack 配置里有两个属性：

1. test 属性标识应该转换哪个或哪些文件
2. use 属性指示应该使用哪个 loader 进行转换。

``` js
// webpack.config.js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader'
      }
    ]
  }
};
```

### Plugins

虽然 loader 用于转换某些类型的模块，但是可以利用插件执行更广泛的任务，比如包优化、资产管理和环境变量注入。

``` js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

html-webpack-plugin 这个插件的用途是 为应用程序自动生成 html 文件，并且自动注入。

### Mode

通过将 mode 参数设置为 development、production 或 none，你可以启用与每个环境相对应的 webpack 内置优化。 默认值是 production。

mode

- production
- development
- none

``` js
// webpack.config.js
module.exports = {
  mode: 'production' // mode default value is 'production'
};
```

``` js
// npm command line in Webpack Cli
webpack --mode=production
```

## Browser Compatibility

浏览器兼容