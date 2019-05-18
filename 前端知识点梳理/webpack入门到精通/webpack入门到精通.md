# webpack 入门到精通

## package.json 就是 项目的清单文件

main 在 webpack 中一般称为 主程序入口

scripts 定义的是 自定义命令行

``` json
// package.json
{
  "name": "xxx",
  "version": "1.0.0",
  "descrition": "xxx",
  "main": "index.js",
  "keywords" : [
    "build",
    "tutorial",
    "webpack"
  ]
},
"script": {
  "entry": "node ./command.js -f=entry",
  "output": "node ./command.js -f=output",
  "split": "node ./command.js -f=code_split",
  "module": "node ./command.js -f=modules",
  "resolve": "node ./comnand.js -f=resolve",
  "devtool": "node ./command.js -f=devtool",
  "loaders": "node ./command.js -f=loaders",
  "plugins": "node ./command.js -f=plugins"
},
"author": "shawroc",
"license": "MIT",
"devDependencies": {
  "babal-core": "^6.13.2",
  "babel-loader": "^6.2.4",
  ...
},
"repository":  {
  "xxx/webpack-tutorial"
}

```

## webpack.config.js 就是 webpack 的配置文件

### entry 就是 入口

``` js

const path = require('path')
// 必须是绝对路径 哦
// 配置里面
module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '_[name].js'
  }
}

```

``` js

let base = {
  index: './index.js',
  index1: './index1/js
}

const dynamic-entry = () => base;

module.exports = {
  entry: dynamic_entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '_[name].js'
  }
}

```

``` js
let base = {
  index: './index.js',
  index1: './index1.js'
}

// webpack2  提供了多种配置方案
// const dynamic-entry = () => base;

const dynamic_entry_promise = () => {
  return new Promise((resolve, reject) => {
    resolve(base)
  })
}

module.exports = {
  entry: dynamic_entry_promise,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '_[name].js'
}

```

### output 就是输出目录

output 就是输出目录

``` js
const path = require('path');
let base = {
  index: './index.js?t=2',
  index1： './index1.js'
};

// webpack 提供多种配置方案

const dynamic_entry = () => base

const dynamic_entry_promise = () => {
  return new Promise((resolve, reject) => {
    resolve(base)
  })
}

module.exports = {
  entry: base,
  output: {
    // 导出目录
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/assets/", // server-relative
    // 包规范格式
    libraryTarget: 'umd',
    library: 'MyLibrary',
    // 文件名
    chunkFilename: '[chuchhash]_[id].js',
    // hash 位数
    hashDigestLength: 2,
    // 导出文件
    // filename: '[chunkhash:3]_[name].js'
    filename: '[chunkhash]_[name].js'
  }
}
```

hash 的作用 第一个就是去缓存

output 里面的 chunkFilename 在 webpack 中是用来异步加载的。

``` js
// index1.js
console.log('I am index')

// require.ensure(dependencies:String[], callback: function(require), 'name')

//异步加载

require.ensure([], (require) => {
  require('./index.js')
}, 'dynamic')
```

## code split 异步加载

code split 就是文件拆分，异步加载

``` md

结构

code_split
  --dist
    -- index.html
    -- index.js
    -- readme.md
    -- split
    -- webpack.config.js
```

index.js

``` js
// index.js

console.log('I am index')
// require('./split.js');
import * as Test from './split.js'
```

split.js

``` js
console.log('I am a split');
```

## module 处理相应文件 引用模块的规则

webpack.config.js

``` js

const path = require('path')
let base = {
  index: './index.js'
}

module.exports = {
  entry: base,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: '\.jsx?$/,
        exclude: [
          'node_modules'
        ],
        use: [{
          loader: "babel-loader"
        }]
      }
    ],
  }
}
```

##  resolve 解析一些路径

resolve 的 webpack config 文件

``` js
// webpack.config.js

const path = require('path');
let base = {
  index: './index.js'
}

// webpack2 提供了多种配置方案

module.exports = {
  entry: base,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  // 处理 resolve 别名 alias
  resolve: {
    alias: {
      test: path.resolve(__dirname, 'test/test/test.js')
    }
  },
  // entry ===> rules ===> webpack ===> output
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [
          'node_modules'
        ],
        use: [{
          loader: "babel-loader"
        }]
      }
    ]
  }
}
```

## devtool

devtool：'source-map'
在高级浏览器里面就可以实现一个源文件和编译出来的文件，相互之间的一个映射表

``` js 
// webpack.config.js
const path = require('path');
let base = {
  index: './index.js'
};

module.exports = {
  // 在高级浏览器里面就可以实现一个 源文件和编译出来的文件 相互之间的一个映射表
  devtool: 'source-map',
  target: 'web',
  entry: base,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      test: path.resolve(__dirname, 'test/test.js')
    }
  },
  module: {
    rules: [
      {
        test: '/\.jsx?$/,
        exclude: [
          'node_modules'
        ],
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  }

}

