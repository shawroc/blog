# Mode

Providing the mode configuration option tells webpack to use its built-in optimizations accordingly.

string

Possible values for mode are: none, development or production(default).

## Usage

Just provide the mode option in the config:

``` js
module.exports = {
  mode: 'production'
};
```

or pass it as a CLI argument: 

``` js
webpack --mode=production
```

The following string values are supported:

|Option|Description|
|:-:|:-:|
|development| Sets process.env.NODE_ENV on DefinePlugin to value development. Enables NamedChunksPlugin and NamedModulesPlugin.|
|production| Sets process.env.NODE_ENV on DefinePlugin to value production . Enables FlagDependencyUsagePlugin , FlagIncludedChunksPlugin , ModuleConcatenationPlugin , NoEmitOnErrorsPlugin , OccurrenceOrderPlugin , SideEffectsFlagPlugin and TerserPlugin .|
|none| Opts out of any default optimization options|

If not set, webpack sets production as the default value for mode.

Please remember that setting NODE_ENV doesn't automatically set mode.

## Mode: development

``` js
// webpack.development.config.js
module.exports = {
  mode: 'development',
  devtool: 'eval',
  cache: true,
  performance: {
    hints: false
  },
  output: {
    pathinfo: true
  },
  optimization: {
    namedModule: true,
    namedChunk: true,
    nodeEnv: 'development',
    flagIncludedChunks: false,
    occurenceOrder: false,
    sideEffects: false,
    usedExports: false,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity
    },
    noEmitOnErrors: false,
    checkWasmTypes: false,
    minimize: false,
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.DefinePlugin({"process.env.NODE_ENV": JSON.stringify("development")}),
  ]
}
```

## Mode: none

``` js
// webpack.custom.config.js
module.exports = {
  mode: 'none',
  performance: {
    hints: false
  },
  optimization: {
    flagIncludedChunks: false,
    occurenceOrder: false,
    sideEffects: false,
    usedExports:  false,
    concatenateModules:  false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity
    },
  },
  noEmitOnErrors: false,
  checkWasmTypes: false,
  minimize: false,
  plugins: []
}
```

If you want to change the behavior according to the mode variable inside the webpack.config.js, you have to export a function instead of an object:

``` js
var config = {
  entry: './app.js'
  // ...
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    // ...
  }

  return config;
};
```