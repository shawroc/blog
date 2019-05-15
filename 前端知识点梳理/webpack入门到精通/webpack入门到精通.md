# webpack 入门到精通

package.json 就是 项目的清单文件

main 在 webpack 中一般称为 主程序入口

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