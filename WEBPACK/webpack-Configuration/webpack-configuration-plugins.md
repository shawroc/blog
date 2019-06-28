# Plugins

The plugins option is used to customize the webpack build process in a variety of ways.
webpack comes with a variety built-in plugins available under webpack.[ plugin-name ].

## plugins

[ plugin ]

An array of webpack plugins. 
For example, DefinePlugin allows you to create global constants which can be configured at compile time.
This can be useful for allowing different behavior between development builds and release builds.

webpack.config.js

``` js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      // Definitions...
    })
  ]
};
```

A more complex example, using multiple plugins, might look something like this:

webpack.config.js

``` js
var webpack = require('webpack');
// importing plugins that do not come by default in webpack
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboradPlugin = require('webpack-dashboard/plugin');

// adding plugins to your configuration
module.exports = {
  // ...
  plugins: [
    new ExtractTextPlugin({
      filename：'build.min.css',
      allChunks: true,
    }),
    new webpack.IgnorePlugin(/^\./locale$/,/moment$/),
    // compile time plugins
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    // webpack-dev-server enhancement plugins
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
```