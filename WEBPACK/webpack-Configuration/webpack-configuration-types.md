# Configuration Types

Besides eporting a single config object, there are a few more ways that cover other needs as well.

## Exporting a Function

Eventually you will find the need to disambiguate in your webpack.config.js between development and production builds. you have two options:

One option is to export a function from your webpack config instead of exporting an object. The function will be invoked with two arguments:

- An environment as the first parameter.
- An options map(argv) as the second paramenter. This decribes the options passed to webpack, with keys such as output-filename and optimize-minimize.

``` js
module.exports = function(env, argv) {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-maps' : 'eval',
    plugins: [
      new TerserPlugin({
        tersetOptions: {
          compress: argv['optimize-minimize']
        }
      })
    ]
  };
};
```

## Exporting a Promise

webpack will run the function exported by the configuration file and wait for a Promise to be returned. Handy when you need to asynchronously load configuration variables.

It is possible to export multiple promises by wrapping them into Promise.all([/* Your promises */ ]).

``` js
module.exports = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        entry: './app.js',
        /* ... */
      })
    }, 5000)
  });
};
```

## Exporting multiple configurations

Instead of exportig a single configuration object/function, you may  export multiple configurations(multiple functions are supported since webpack 3.1.0). 

When running webpack, all configurations are built. For instance, this is useful for bundling a library for multiple targets such as AMD and CommonJS:

``` js
module.exports = [{
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  name: 'amd',
  entry: './app.js',
  mode: 'production',
}, {
  output: {
    filename: './dist-commonjs.js',
    libraryTarget: 'commonjs'
  },
  name: 'commonjs',
  entry: './app.js',
  mode: 'production',
}];
```

If you pass a name to --config-name flag, webpack will only build that specific configuration.