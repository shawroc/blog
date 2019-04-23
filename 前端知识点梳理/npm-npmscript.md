# npm-npmscript-gulp-webpack

## npm 是什么

NPM（node package manager)，通常称为 node 包管理器。
顾名思义，它的主要功能就是管理 node 包，包括：安装、卸载、更新、查看、搜索、发布等。

npm 的背后，是基于 couchdb 的一个数据库，详细记录了每个包的信息，包括作者、版本、依赖、授权信息等。

它的一个很重要的作用就是：将开发者从繁琐的包管理工作（版本、依赖等）中解放出来，更加专注于功能的开发。

npm 官网: https://npmjs.org/ || https://www.npmjs.com

npm 官方文档: https://npmjs.org/doc/README.html

### node 的使用

```js

// demo
// a.js
// function sayHello(name){
//  console.log('hello' + name)
// }
// exports.sayHello = sayHello
// -index.js
var a = 1;
console.log(a);

// git bash 上运行
// node index.js
// git bash 终端上 显示 1

// 引入同级目录下的 a

var sayHello = require('./a').sayHello;
sayHello('ruoyu');


// npm 一个约定，当你直接写 模块名， 首先会从node_modules 里面去找
// 找不到的话，再从上一级的node-modules 里面去找
// 他会逐级 网上找
var marked = require('marked');
var str = marked('#hello');
console.log(str);

```


node_modules 的配置文件

npm 是什么意思呢？

.npmignore 是什么意思呢？ 就是我们不要把这些文件发布到 npm 服务器上。

bower 也是一个类似于 npm 的管理器

Makefile 是 Linux 里面的命令

```js
all:
  @cp lib/marked.js marked.js
  @uglifyjs --comments '/\*[^\0]+?Copyright[^\0]+?\*/' -o marked.min.js

clean:
  @rm marked.js
  @rm marked.min.js

bench:
  @node test --bench

/PHONY: clean all
```


```js
// package.json 就是告诉 npm ， 你当前代码的一个版本以及一些其他的相关信息
{
  "name": "hunger-demo3",
  "version": "1.0.1",
  "description": "",
  "main": "index.js",
  "bin":{
    "hungerdemo": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```

``` js
// demo2

node index.js hello
// 得到两个数组
// 第一个是我们用什么工具去执行
// 第二个是文件的地址
// ['/user/local/bin/node', '/Users/wingo/Desktop/workspace/git/kejian-zuoye-xianqmu/frontend-knowledge-ppt/code/npm/demo2/index.js', 'hello']
console.log(process.argv)


process.argv.forEach((val, index) => {
  console.log(index + ':' + val)
})

// process 就是和进程相关的
```

## npm 包管理

node 包的安装分两种：本地安装、全局安装。
两者的区别如下，后面会通过简单例子说明。

- 本地安装： package 会被下载到当前所在目录，也只能在当前目录下使用。

- 全局安装： package 会被下载到特定的系统目录下，安装的 package 能够在所有目录下使用。

### 本地安装 npm install pkg

运行如下命令，就会在当前目录下安装 grunt-cli （grunt 命令行工具）

```nodeJs
npm install grunt-cli
```

安装结束后，当前目录下会多出一个 node_modules 目录，grunt-cli 就安装在里面。

同时注意控制台输出的信息：

```js

// 逐级回溯向上找到node_modules 中 对应的模块

grunt-cli@0.1.9 node_modules/grunt-cli
|-- resolve@0.3.1
|-- nopt@1.0.10 (abbrev@1.0.4)
|-- findup-sync@0.1.2 (lodash@1.0.1, glob@3.1.21)

// grunt-cli@0.1.9: 当前安装的package 为grunt-cli, 版本为 0.19
// node_modules/grunt-cli: 安装目录
// resolve@0.3.1: 依赖的包有resolve、nopt、findup-sync, 它们各自的版本、依赖在后面的括号里列出来

// 如果报Error: EACCES。 open '/Users/xxx/xxx.lock 错误。先执行：sudo chown -R$(whoami) $HOME/.npm;

```

创建 npm

``` js

cd 到对应的目录

1. npm init 之后

// 命名之前，要确定这个和 npm 服务器上的所有包都不重名
// 最好先搜索一下

``` md
name: (demo0) hunger-demo0
version: (1.0.0)
description：这是我的demo
entry point: (index.js)
test command: 
git repository: 
keywords: shawroc
author: shawroc
liscense: (ISC)
```

2. 新建一个 READEME.md


touch README.md

``` md
# 测试
这里是 shawroc 的课堂
```

3. 新建一个 index.js

``` js
var marked = require('marked')

var str = marked('# hello world')

module.exports = str

```

### npm install --save marked

npm install --save 就是把我们的下载信息自动添加到 package.json 的 dependencies 里面。

package.json 就相当于一个种子一样，这个种子文件很小。
但是当我需要这些材料的时候，我点个下载 npm install --save xxxx,
就会把这些材料下载下来。

``` md
// .gitignore
node_modules 就是不传他， 但是如果你的代码里没有这个模块，你的代码不就报错了吗？

```

``` json
{
  "name": "demo0",
  "version": "1.0.0",
  "description": "This is Shaw's Demo",
  "main": "index.js",
  "srcript": {
    "test": "echo \"Error: no test specified\""
  },
  "keywords": {
    "shawroc"
  },
  "author": "shawroc",
  "license": "ISC",
  "dependencies": {
    "marked": "^0.3.6"
  }
}

```

### npm install --save-dev

npm install --save-dev 就是 自己在做开发，测试的时候依赖的，分享给别人用不到，所以是别人下载不下来的。



``` json

{
  "name": "hunger-demo0",
  "version": "1.0.0",
  "description": "this is my demo",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\""
  },
  "keywords": {
    "shawroc"
  },
  "author": "ruoyu",
  "license": "ISC"m
  "dependencies": {
    "marked": "^0.3.6"
  },
  "devDependencies": {
    "easytpl": "^1.0.4"
  }
}

```


### 简单的命令行工具

demo3
|- pacakge.json
|- index.js

``` js
// index.js
#!/usr/bin/env node
console.log('hello');
```

``` json
// pacakge.json
// bin 就是 二进制命令行
{
  "name": "demo3",
  "version": "1.0.1",
  "description": "",
  "main": "index.js",
  "bin": {
    "hungerdemo": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\""
  },
  "author": "",
  "license": "ISC"
}

{
  "name": "demo3",
  "version": "1.0.1",
  "description": "",
  "main": "index.js",
  "bin": {
    "demo3": "./index.js",
    "demo4": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\""
  },
  "author": "",
  "license": "ISC"
}

```

npm installl -g 
凡是安装在全局的node_modules 都是放在
/usr/local/lib/node_modules/ 这个文件夹下


## 天气预报- node 小应用

代码结构
- weather
  |- index.js
  |- package.json

``` json
// package.json
{
  "name": "weather",
  "version": "1.0.2",
  "description": "",
  "main": "index.js",
  "bin": {
    "weather": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" "
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.15.3"
  }
}
```

``` js
// index.js
#!/usr/bin/env node

var axios = require('axios');
console.log(process.argv);

var data = {}

if(process.argv[2]){
  data.params = {
    city: proccess.argv[2]
  }
}

axios.get('http://api.jirengu.com/weather.php', data)
  .then(function(response){
    var weatherInfo = response.data.results[0].weather_data[0]
    console.log(weahterInfo.date)
    console.log(weatherInfo.temperature)
    console.log(weatherInfo.weather + ',' + weatherInfo.wind)
    console.log('PM25:' + weatherInfo.data.results[0].pm25)
  })
  .catch(function(error){
    console.log(error)
  })
```