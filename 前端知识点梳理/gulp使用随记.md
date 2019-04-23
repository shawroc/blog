# gulp 实践

## gulp 简介

地址： http://gulpjs.com/

- 它是一款 nodejs 应用。
- 它是打造前端工作流的利器，打包、压缩、合并、git、远程操作...
- 简单易用
- 无快不破
- 高质量的插件
- ...

### gulp 安装及常见问题

1. 安装 gulp

```js
npm install -g gulp
```

如果报 Error: EACCES, open '/Users/xxx/xxx.lock 错误。
先执行： sudo chown -R $(whoami) $HOME/.npm

如何理解数据流？
可以这么理解。

1. 读取文件
2. 文件加上一句话
3. 输出并保存
4. 又打开一个文件
5. 把两个文件内容合并
6. 再输出

一个流水线

npm 的安装和使用

``` js
npm install gulp-cli -g
npm install gulp -D
touch gulpfile.js
gulp --help
```

gulpfile.js 的写法

``` js

var gulp = require('gulp');
var pug = require('gulp-pug');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');

gulp.task('html', function(){
  return gulp.src('client/templates/*.png')
    .pipe(pug())
    .pipe(gulp.dest('build/html'))
});

gulp.task('css', function(){
  return gulp.src('client/templates/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
})

gulp.task('default', ['html','css']);

```

如果使用 npm 安装插件太慢 （被墙），可执行 npm install -g cnpm --registry=https://registry.npm.taobao.org，先安装 cnpm，之后再安装插件时用 cnpm 安装， cnpm install gulp

2. 安装各种插件

``` js
npm install --save gulp // 本地使用gulp
npm install --save gulp-imagemin // 压缩图片
npm install --save gulp-minify-css // 压缩css
npm install --save gulp-ruby-sass // sass
npm install --save gulp-jshint // js代码检测
```

cd 到 对应的文件夹
touch gulpfile.js
npm init 

demo0
|- dist
|- src
  |- gulpfile.js
  |- index.html
  |- package.json

``` json
{
  "name": "demo0",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "gulp": "^3.9.1",
    "gulp-concat": "^2.6.0",
    "gulp-cssnano": "^2.1.2"    
  }
}
```


gulp 插件查找 http://gulpjs.com/plugins

如果安装得慢， 找淘宝镜像
npm set --registry https://registry.npm.taobao.org

``` js
// gulpfile.js
// 在 node 端 运行如下命令行
// npm install --save-dev gulp
// npm install --save-dev gulp-cssnano
// npm install --save-dev gulp-concat
var gulp = require('gulp');

// css 压缩
// concat 合并
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');

//gulp.src |  gulp.dest | gulp.task | gulp.watch

// 合并 压缩 输出到指定目录
gulp.task('default', function(){
  gulp.src('./src/css/*.css')
    .pipe(concat('index-merge.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('build:css', function(){

});

gulp.task('build:js', function(){

});
```

一些 gulp 的 API

``` js
gulp.src() 放入的都是需要处理的

gulp.task()

gulp.watch('js/**/*.js')
```


## gulp 实践

``` js
// gulpfile.js
var gulp = require('gulp');

var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');

// gulp.src | gulp.dest | gulp.task | gulp.watch

gulp.task('css', function(){
  gulp.src('./src/css/*.css')
    .pipe(concat('index-merge.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css/'));
});

// npm install --save-dev gulp-cssnano
// npm install --save-dev gulp-concat

// 用 中括号语法 在 default 引用创建的 ['css']
gulp.task('default', ['css'])

```

第二个例子

``` js
var gulp = require('gulp');

var minifycss = require('gulp-minify-css'), // css 压缩
uglify = require('gulp-uglify'), // js压缩
concat = require('gulp-concat'), // 合并文件
rename = require('gulp-rename'), // 重命名
clean = require('gulp-clean'), // 清空文件夹
minhtml = require('gulp-htmlmin'), // html 压缩
jshint = require('gulp-jshint'), // js代码规范性检查
imagemin = require('gulp-imagemin'); // 图片压缩

gulp.task('html', function(){
  return gulp.src('src/*.html')
    .pipe(minhtml({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function(argument){
  gulp.src('src/css/*.css')/
    .pipe(concat('merge.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('js', function(argument){
  gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('merge.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('img', function(argument){
  gulp.src('src/imgs/*)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function(){
  gulp.src('dist/*', {read: false})
    .pipe(clean());
});

gulp.task('build', ['html', 'css', 'js', 'img']);
```

第三个例子

``` js
var gulp = require('gulp');

// 引入组件
var browserSync = require('browser-sync').create();
var fs = require('fs');

gulp.task('reload', function(){
  browserSync.reload();
});

gulp.task('server', function(){
  browserSync.init({
    server: {
      baseDir: './src'
    }
  });
  gulp.watch(['**/*.css', '**/*.js', '**/*.html'], ['reload'])
});
```

