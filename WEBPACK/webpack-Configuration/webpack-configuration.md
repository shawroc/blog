# Configuration

Out of the box, webpack won't require you to use a configuration file.
However, it will assume the entry point of your project is src/index and will output the result in dist/main.js minified and optimized for production.

Usually your projects will need to extend this functionality, for this you can create a webpack.config.js file in the root folder and webpack will automatically use it.

All the available configuration options are specified below.

## Use different config file

If for some reason you want to use different config file depending on certain situations you can change this via command line by using the --config flag

package.json

``` js
"script": {
  "build": "webpack --config webpack.config.js"
}
```

## Options

Click the name of each option in the configuration code below to jump to the detailed documentation. Also note that the items with arrows can be expanded to show more examples and, in some cases, more advanced configuration.

**webpack.config.js**

``` js
const path = require('path');

module.exports = {
  mode: "production", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly
  entry: "./app/entry", // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "dist"), //string
    // the target directory for all out files
    // must be an absolute path (use the Node.js path module)
    filename: "bundle.js", // string
    // the filename template for entry chunks
    publicPath: "/assets/", // string
    // the url to the output directory resolved relative to the HTML page
    library: "MyLibrary", // string.
    // the name of the exported library
    libraryTarget: "umd", // universal module definition
    // the type f the exported library
    /* Advanced output configuration (click to show) */
    /* Expert output configuration (on own risk) */
  },
  module: {
    // configuration regarding modules
    rules: [
      // rules for modules  (configure loaders, parser options, etc.)
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the sanme behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filenmae matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        issuer: { test, include, exclude },
        // conditions for thr issuer (the origin of the import)
        enforce: "pre",
        enforce: "post",
        // flags to apply these rules, even if they are overridden (advanced option)
        loader: "babel-loader",
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide
        options: {
          presets: ["es2015"]
        },
        // options for the loader
      },
      {
        test: /\.html$/,
        use: [
          // apply multiple loaders and options
          "htmlint-loader",
          {
            loader: "html-loader",
            options: {
              /.../
            }
          }
        ]
      },
      { oneOf: [ / rules /] },
      // only use one of these nested rules
      { rules: [ / rules /] },
      // use all of these nested rules (combine with conditions to be useful)
      { resource: { and: [ / conditions / ]}},
      // matches only if all conditions are matched
      { resource: { or: [ / conditions / ] } },
      { resource: [ / conditions / ] },
      // matches if any condition is matched (default for arrays)
      { resource: { not: / condition / } }
      // matches if the condition is not matched
    ],
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".css"],
    // extensions that are used
    alias: {
      // a list of module name aliases
      "module": "new-module",
      // alias "module" -> "new-module"  and "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // alias "only-module" -> "new-module", but not "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // alias "module" -> "./app/third/module.js" and "module/file" results in error
      // modules aliases are imported relative to the current context
    },
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed
  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  // is resolved relative to this directory
  target: "web", // enum
  // the environment in which the bundle should run
  // changed chunk loading behavior and available modules
  externals: ["react", /^@angular/],
  // Don't follow/bundle these modules, but request them at runtime form the environment
  serve: { // object
    port: 1337,
    content: './dist',
    // ...
  },
  // lets you provide options for webpack-serve
  stats: "errors-only",
  // lets you precisely control what bundle information gets displayed
  devServer: {
    proxy: { // proxy URLs to backend development server
      'api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement, Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
  plugins: [
    // ....
  ],
  // list of additonal plugins
}
```

Generate Custom Webpack Configuration is an interactive portal you can play around by selecting custom webpack configuration options tailored for your frontend project. 

It automatically generates a minimal webpack configuration based on your selection of loaders/plugins, etc.

Or use webpack-cli's init command that will ask you a couple of questions befoe creating a configuration file.

``` js
npx webpack-cli init
```

After running npx webpack-cli init you might get more packages installed to your project depending on the choices you've made during configuration generation.

``` nodejs
npx webpack-cli init

!INFO For more information and a detailed description of each question, have a look at https

!INFO Alternatively, run 'webpack(-cli) --help' for usage info.

? Will your application have multiple bundles?  No
? Which module will be the first to enter the application? [default: ./src/index]
? Which folder will your generated bundles be in? [default: dist]:
? Will you be using ES2015? Yes
? Will you use one of the below CSS solutions? No

+ babel-plugin-syntax-dynamic-import@6.18.0
+ uglifyjs-webpack-plugin@2.0.1
+ webpack-cli@3.2.3
+ @babel/core@7.2.2
+ babel-loader@8.0.4
+ @babel/preset-env@7.1.0
+ webpack@4.29.3

added 124 pacakges from 39 contributors, updated 4 packages and audited 25221 packages in 7.463s found 0 vulnerabilities

Congratulations! Your new webpack configuration file has been created!
```

createapp.dev - create a webpack config in your browser is an online tool for creating custom webpack configuration. 

It allows you to select various features that will be combined and added to resulting configuration file.

Also, it generates an example project based on provided webpack configuration that you can review in your browser and download.d