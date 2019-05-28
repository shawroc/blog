# Output

## Output

输出配置选项告诉 webpack 如何将编译后的文件写入磁盘。
注意，虽然可以有多个入口点，但是只指定一个输出配置。

### Usage 

webpack 配置中 output 属性的要求是将其值设置为对象

``` js
// webpack.config.js
module.exports = {
  output: {
    filename: 'bundle.js'
  }
}
```

### Multiple Entry Points

如果您的配置创建了多个"块"(比如多个入口点，或者使用CommonsChunkPlugin之类的插件)，您应该使用占位符来确保每个文件都有唯一的名称。

webpack.config.js

``` js
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist' 
  }
};

// writes to dist: ./dist/app.js ./dist/search.js
```

### Advanced

Here's a more complicated example of using a CDN and hashes for assets:

config.js

``` js
module.exports = {
  // ...
  output: {
    path: '/home/proj/cdn/assets/[hash]',
    publicPath: 'https://cdn.example.com/assets/[hash]/'
  }
};
```