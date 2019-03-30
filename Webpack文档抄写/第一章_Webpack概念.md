# Webpack 概念

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器（module bundler）。

当 webpack 处理应用程序时，它会递归构建一个依赖关系图 (dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

从 webpack v4.0.0 开始，可以不用引入一个配置文件。
然而，webpack 仍然还是高度可配置的。

在开始前你需要先理解四个**核心概念**：

- 入口 （entry）
- 输出 (output)
- loader
- 插件(plugins)


## 入口 [entry]

入口起点(entry point) 指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后， webpack 会找出有哪些模块和库是入口起点 (直接和间接) 依赖的。

每个依赖项随即被处理，最后输出到称之为 bundles 的文件中。

可以通过在 webpack 配置中 配置 entry 属性，来制定一个入口起点 （或多个入口起点）。

默认值为 ./src。

接下来我们看一个 entry 配置的最简单例子：

webpack.config.js

```js
module.exports = {
  entry: './path/to/my/entry/file.js'
};

```

## 出口 [output]

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。

基本上，整个应用程序解构，都会被编译到你指定的输出路径的文件夹中。

你可以通过在配置中指定一个 output 字段，来配置这些处理过程。

webpack.config.js

```js

const path = require('path');

module.export = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundlle.js'
  }
};
```

在上面的示例中，我们通过 output.filename 和 output.path 属性，来告诉 webpack bundle 的名称，以及我们想要 bundle 生成 (emit) 到哪里。

可能你想要了解在代码最上面导入的 path 模块是什么，它是一个 Node.js 核心模块，用于操作文件路径。

## loader

loader 让 webpack 能够去处理那些非 JavaScript 文件 (webpack 自身只理解 JavaScript)


```js

const path = require('path');

const config = {
  output: {
    filename: 'my-first-webapack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader'}
    ]
  }
};

module.exports = config;

```

```js

const config = {
  output: {
    filename: 'bundle.js',
    path: 'home/proj/public/assets'
  }
};

module.exports = config;

```

```js

{
  entry: {
    app: './src/app.js',
    search: './src/search.js
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}


// 写入到硬盘： ./dist/app.js， ./dist/search.js
```

```js

output: {
  path: "/home/proj/cdn/assets/[hash]",
  publicPath："http://cdn.example.com/assets/[hash]"
}

```


```node.js

npm install --save-dev css-loader

npm install --save-dev ts-loader

```

```js

//webpack.config.js

module.exports = {
  module: {
    rules: [
      {test: /\.css$/, use: 'css-loader'},
      {test: /\.ts$/, use: 'ts-loader'}
    ]
  }
}

```

```js

module: {
  rules: [{
    test: /\.css$/,
    use: [
      {loader: 'style-loader'},
      {
        loader: 'css-loader',
        options: {
          modules: true
        }
      }
    ]
  }]
}

```

```js

const pluginName = 'consoleLogBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compilier) {
    compilier.hooks.run.tap(pluginName, compilation => {
      console.log("webpack 构建过程开始！");
    });
  }
}

```

```js

//webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './path/to/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\./(js/jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;

```

```some-node-script.js

const webpack = require('webpack'); //访问 webpack 运行时
const configuration = require('./wenpack.config.js');

let compiler = webpack(configuration);

compiler.apply(new webpack.ProgressPlugin());

compiler.run(function(err, stats) {
  // ...
});
```


```js

// webpack.config.js 基本配置
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};

```

```js

// resolver 是一个库(libary)，用于帮助找到模块的绝对路径。
// 一个模块可以作为另一个模块的依赖模块，然后被后者引用

import foo from 'path/to/module'

// 或者

require('path/to/module')


// webpack 中的解析规则

// 解析绝对路径

import '/home/me/file';

import 'C:\\Users\\me\file';

// 由于我们已经取得文件的绝对路径，因此不需要进一步再做解析。


// 解析 相对路径

import "./src/file1";
import "./file2";

// 在这种情况下，使用 import 或 require 的资源文件(resource file)所在的目录被认为是上下文目录(context directory)。在 import/require 中给定的相对路径，会添加此上下文路径(context path)，以产生模块的绝对路径(absolute path)。

// 解析模块路径

import "module";
import "module/lib/file";

// 模块将在 resolve.modules 中指定的所有目录内搜索。 你可以替换初始模块路径，此替换路径通过使用 resolve.alias 配置选项来创建一个别名。
```

### manifest

在使用 webpack 构建的典型应用程序或站点中，有三种主要的代码类型：

1. 你或你的团队编写的源码。
2. 你的源码会依赖的任何第三方的 library 或 "vendor" 代码。
3. webpack 的 runtime 和 manifest， 管理所有模块的交互。

```js

var path = require('path');
var serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
};

var clientConfig = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
};

module.export = [ serverConfig, clientConfig ];

```


```js

const path = require('path');

module.exports = {
  // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly
  mode: "production", 
  
  // string | object | array
  entry: "./app/entry", 

  output: {
    path: path.resolve(__dirname, "dist"), // string
    filename： "bundle.js",
    publicPath: "/assets/",
    // 输出解析文件的目录，url 相对于 HTML 页面

    library: "MyLibrary",
    // 导出库

    libraryTarget: "umd",
    // 导出库(exported library)的类型

    /* 高级输出配置(点击显示) */
  },

  module: {
    rules: [
      // 模块规则 （配置 loader、解析器等选项）
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 是必不匹配选项 （优先于 test 和 include）
        // 最佳实践
        // - 只在 test和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude， 更倾向于 使用 include

        issuer: {
          test, 
          include,
          exclude
        },

        enforce: "pre",
        enforce: "post",
        // 标识应用这些规则，即使规则覆盖（高级选项）

        loader: "babel-loader",
        // 应该应用的 loader, 它相对上下文解析
        // 为了更清晰，'-loader' 后缀在 webpack 2 中不再是可选的

        options: {
          presets: ["es2015"]
        },
        // loader 的可选项
      },
      {
        test: /\.html/,
        use: [
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },
      { oneOf: [ /* rules */ ]},
      // 只使用这些嵌套规则之一

      { rules: [ /* rules */ ]},
      // 使用所有这些嵌套规则（合并可用条件）

      { resource: { and: [ /* 条件 */]}},
      // 仅当所有条件都匹配时才匹配

      { resource: { or: [/* 条件 */]}},
      { resource: [ /* 条件 */ ]},
      // 任意条件匹配时匹配 （默认为数组）

      { resource: { not: /* 条件 */ }}
    ],
  },

  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],

    extensions: [".js", ".json", ".jsx", ".css"],

    alias: {
      // 模块别名列表

      "module": "new-module",
      "only-module$": "new-module",
      "module": path.resolve(__dirname, "app/third/module.js"),
    },

    performance: {
      hints: "warning",
      maxAssetSize: 200000,
      maxEntrypointSize: 400000,
      assetFilter: function(assetFileName) {
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
      }
    },
    devtool: "source-map", // enum
    context: __dirname, // string
    target: "web",
    externals: ["react', /^@angular\//],
    stats: "errors-only",
      devServer: {
        proxy: {
          '/api': 'http://localhost: 3000'
        },
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        historyApiFallback: true,
        hot: true,
        https: false,
        noInfo: true,
      },

      plugins: [
        // ...
      ],
      // 附加插件列表

  }
}





```