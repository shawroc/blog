# npm scripts 打造前端工作流

---
如果使用 npm 安装插件太慢（被墙），可执行 npm install -g cnpm --registry=https://registry.npm.taobao.org

---

npm scripts 原理

``` js
// npm run 自定义命令
// 写在 package.json 里面的 scripts 里面
{
  "name": "test",
  "version": "1.0.0",
  "description": "我的一个测试包",
  "main": "index.js",
  "scripts": {
    "test": "mkdir abc",
    "mk": "mkdir abcd",
    "delete": "rm -r abcd",
    "start": "touch hello"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/shawroc/book.git"
  }
  "keywords": [
    "shawroc"
  ],
  "author": "shawroc",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/jirengu/book/issues"
  },
  "dependencies": {
    "esaytpl": "^1.0.4"
  },
  "devDependencies": {
    "server-mock": "^1.0.5"
  },
  "homepage": "https://github.com/jirengu/book#readme"
}
```

npm scripts 打造前端工作流的实例
npm init 初始化 package.json 文件
package.json

``` js

{
  "name": "book.shawroc.com-fe.com",
  "version": "1.0.0",
  "description": "shawroc前端学习指南",
  "main": "gulpfile.js",
  "dependencies": {
    "directory-tree": "^1.1.0",
    "gitbook-plugin-multipart": "^0.3.0",
    "gitbook-plugin-toggle-chapters": "^0.0.3",
    "grunt": "^1.0.1",
    "gulp": "^3.9.0",
    "gulp-shell": "^0.5.1",
    "requirejs": "^2.1.22"
  },
  "devDependencies": {
    "grunt" : "^1.0.1"
  },
  "scripts": {
    "build": "gitbook build && exit 0",
    "code": "npm run upload:_book; npm run upload:src",
    "init": "npm run build; cd_book; git init; git add .; git commit",
    "upload:_book": "cd _book ; cp -rf code _book; git add . ; ",
    "upload:src": "git add . ; git commit -am \"upload\"",
    "start": "npm run build; npm run upload:_book;"
  },
  "respository": {
    "type": "git",
    "url": "git+https://github.com/shawroc/book.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/shawroc/book/issues"
  },
  "homepage": "https://github.com/shawroc/book#readme
}
```

如果报 Error：EACCES, open '/Users/xxx/xxx.lock错误。
先执行: sudo chown -R$(whoami)$HOME/.npm 以其他身份运行命令 修改文件目录属主 -R权限 修改变量(whoami) $HOME/.npm

更改回 sudo chown -R$(whoami)/usr/local/lib/node_modules


