# Configuration Languages

webpack accepts configuration files written in multiple programming and data languages. The list of supported file extensions can be found at the node-interpret package.

Using node-interpret, webpack can handle many different types of configuration files.

## TypeScript

To write the webpack configuration in TypeScript, you would first install the necessary dependencies, i.e., TypeScript and the relevant type definitions from the DefinitelyTyped project:

``` js
npm install  --save-de typescript ts-node @types/node @types/webpack

# and, if using webpack-dev-server

npm install --save-dev @types/webpack-dev-server
```

and then proceed to write your configuration:

webpack.config.ts

``` js
import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};

export default config;
```

Above sample assumes version >= 2.7 or newer of TypeScript is used with the new esModuleInterop and allowSyntheticDefaultImports compiler options in your tsconfig.json file.

Note that you'll also need to check your tsconfig.json file.
If the module in compilerOptions in tsconfig.json is commonjs, the setting is complete, else webpack will fail with an error.
This occurs because ts-node does not support any module syntax other than commonjs.

There are two solutions to this issue:

- Modify tsconfig.json.
- Install tsconfig-paths.

The first option is to open your tsconfig.json file and look for compilerOptions. Set target to "ES5" and module to "CommonJS" (or completely remove the module option).

The second option is to install the tsconfig-paths package:

``` js
npm install --save-dev tsconfig-paths
```

And create a separate TypeScript configuration specifically for your webpack configs:

tsconfig-for-webpack-config.json

``` json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "esModuleInterop": true
  }
}
``` 

Then set the environment variable process.env.TS_NOE_PROJECT provided by tsconfig-path like so:

package.json

``` json
{
  "scripts": {
    "build": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"
  }
}
```

## CoffeeScript

Similarly, to use CoffeeScript, you would first install the necessary dependencies:

``` js
npm install --save-dev coffee-script
```

and then proceed to write your configuration:

webpack.config.coffee

``` js
HtmlWebpackPlugin = require('html-webpack-plugin');
webpack = require('webpack');
path = require('path');

config = 
  mode: 'production'
  entry: './path/to/my/entry/file.js'
  output: 
    path: path.resolve(__dirname, 'dist')
    filename: 'my-first-webpack.bundle.js'
    module: rules: [{
      test: /\.jsx$?/
      use: 'babel-loader'
    }]
  plugins: [
    new HtmlWebpackPlugin(template: './src/index.html')
  ]

module.exports = config
```

## Babel and JSX

In the example below JSX(React JavaScript Markup) and Babel are used to create a JSON Configuration that webpack can understand.

First install the neccessary dependencies:

``` js
npm install --save-dev babel-register jsxobj babel-preset-es2015
```

.babelrc

``` json
{
  "presets": ["es2015"]
}
```

webpack.config.babel.js

``` js
import jsxobj from 'jsxobj';

// example of an imported plugin
const CustomPlugin = config => ({
  ...config,
  name: 'custom-plugin'
});

export default (
   <webpack target="web" watch mode="production">
    <entry path="src/index.js" />
    <resolve>
      <alias {...{
        react: 'preact-compat',
        'react-dom': 'preact-compat'
      }} />
    </resolve>
    <plugins>
      <CustomPlugin foo="bar" />
    </plugins>
  </webpack>
);
```


