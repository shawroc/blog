# requireJS 随记

this 在 node 执行环境中就是 global
this 在 浏览器中 代表 window

```js
(function(name,definition,context){
  if (typeof module != 'undefined' && module.exports) {
    module.exports = definition();
    // 在 CMD 规范下 (node)
    // 相当于
    // module.exports = function(){ return 1;}
  }else if (typpeof context['define'] == 'function' && (context['define']['amd'] || context) ) {
    // 在 AMD 规范 RequireJS 或者 CMD 规范下 (SeaJS)
    define(definition);
  } else {
    // 在浏览器环境下
    context[name] = definition();
    // 相当于 window.sample = function(){}
  }
})('sample', function(){}, this)

```

## RequireJS

RequireJS 遵循 AMD 规范，用于解决命名冲突和文件依赖的问题。

### 使用

```js

<script src="http://apps.bdimg.com/libs/require.js/2.1.9/require.min.hs"></script>

<script>
  requirejs.config({
    base: ".",
    paths: {
      'easyTpl': '../lib/easyTpl'
    }
  });

  // 加载入口模块
  requirejs(['amd-cmd-main']);

```

```md

- www/
    - index.html
    - js/
        - app/
            - sub.js
        - lib/
            - jquery.js
            - canvas.js
        - app.js
```

```html
<script data-main="js/app.js" src="js/require.js"></script>
```

```js

// app.js:

requirejs.config({
  // By default load any module IDS from js/lib
  baseUrl: 'js/lib',
  // except, if the module ID starts with "app"
  // load it from the js/app directory. paths
  // config is relative to the baseUrl, and
  // never includes a '.js' extension since
  // the paths config could be for a directory
  paths: {
    app: '../app'
  }
});

// path 的作用在于 做一些额外的配置
// Start the main app logic

requirejs(['jquery','canvas', 'app/sub'],function($, canvas, sub) {
  // jQuery, canvas and the app/sub module are all
  // loaded and can be used here now.
});

```


## r.js 打包

npm install -g requirejs
r.js -o app.build.js

```js
// r.js
requirejs.config({
  base: './src/js',
  paths: {
    'jquery': 'lib/bower_components/jquery/dist/jquery.min'
  }
});

requirejs(['app/index]');


// main.js
requirejs.config({
  base: "./src/js",
  paths: {
    'jquery': 'lib/bower_components/jquery/dist/jquery.min'
  }
});
// 加载入口模块



// build.js
({
  // 跟踪要压缩的文件所在的文件夹 ./src/js 所在的文件夹
  baseUrl: './src/js',
  // 一些文件别名
  paths: {
    'jquery': 'lib/bower_components/jquery/dist/jquery.min,
  },
  // 追踪依赖 main
  name: 'main',
  // build.js 所在的文件夹 作为依据 追踪路径
  out: 'dist/js/merge.js'
});

// node r.js -o build.js
// node r.js -o build.js optimize=none
```
