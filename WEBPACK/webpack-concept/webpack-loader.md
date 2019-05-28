# loader

loader 是应用于模块源代码上的转换。
它允许在导入或“加载”文件时对文件进行预处理。
因此，loader 有点像其他构建工具中的任务，并提供了处理前端构建步骤的强大方法。
loader 可以将文件从另一种语言 (如TypeScript) 转换为 JavaScript 或 内联图像作为数据 url。

## Example

举个例子，你可以使用 loaders 让 webpack 加载 CSS 文件 或者 把 TypeScript 转换成 JavaScript。

如何做到？你需要先 安装 这两个 loaders。

``` js
npm install --save-dev css-loader
npm install --save-dev ts-loader
```

然后指示 webpack 对每个 .css 文件 使用 css-loader， 对所有 .ts 文件使用 ts-loader。

webpack.config.js

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader'
      },
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  }
};
```

## Using Loaders

There are three ways to use loaders in your application:

- Configuration(recommond): Specify them in your webpack.config.js file

- Inline: Specify them explicitly in each import statement

- CLI: Specify them within a shell command

## Configuration

module.rules allows you to specify serveral loaders within your webpack configuration. This is a concise way to display loaders, and helps to maintain clean code. 

It also offers you a full overview of each respective loader.

Loaders are evaluated/executed from right to left(or from bottom to top). In the example below execution starts with sass-loader, continues with css-loader and finally ends with style-loader.

See "Loader Features" for more information about loaders order.

webpack.config.js

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            optiions: {
              modules: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
}
```

## Inline

It's possible to specify loaders in an import statement, or any equivalent "importing"  method. Separate loaders from the resource with !. Each part is resolved relative to the current directory.

``` js
import Styles from 'style-loader ! css-loader?modules!./style.css';
```

It's possible to override any loaders, preLoaders and postLoaders from the configuration by prefixing the inline import statement:

- Prefixing with ! will disable all configured normal loaders

``` js
import Styles from '!style-loader!css-loader?modules!./style.css'; 
```

- Prefixing with !! will disable all configured loaders (preLoaders, loaders, postLoaders);

``` js
import Styles from '!!style-loader!css-loader?modules!./style.css';
```

- Prefixing with -! will disable all configured preLoaders and loaders but not postLoaders

``` js
import Styles from '-!style-loader!css-loader?modules!./style.css';
```

Options can be passed with a query parameter, e.g. ?key=value&foo=bar, or a JSON object, e.g. ? {"key": "value", "foo": "bar"}.

## CLI

You can also use loaders through the CLI:

``` js
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

## Loader Features

- Loaders can be chained. Each loader in the chain applies transformations to the processed resource. A chain is executed in reverse order. The first loader passes its result to the next one, and so forth. Finally, webpack expects JavaScript to be returned by the last loader in the chain.

- Loaders can be synchronous or asynchronous.

- Loaders run in Node.js and can do evevrything that's possible there.

- Loaders can be configured with an options object(using query parameters to set options is still supported but has been deprecated).

- Normal modules can export a loader in addition to the normal main via package.json via package.json with the loader fied.

- Plugins can give loaders more features.

- Loaders can emit additional arbitrary files.