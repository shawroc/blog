# Configuration

You may have noticed that few webpack configurations look exactly alike. This is because webpack's configuration file is a JavaScript file that exports a webpack configuration.

This configuration is then processed by webpack based upon its defined properties.

Because it's a standard Node.js CommonJS module, you can do the following:

- import other files via require(...)
- use utilities on npm via require(...)
- use JavaScript control flow expressions i.e. the ?: operator
- use constants or variables for often used values
- write and execute functions to generate a part of configuration

Use these features when appropriate.

While they are technically feasible, the following practices should be avoided:

- Access CLI arguments, when using the webpack CLI.
- Export non-deterministic values.
- Write long configurations

The examples below describe how webpack's configuration canbe both expressive and configurable because it is code"

## Simple Configuration

webpack.config.js

``` js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
```

## Multiple Targets

Along with exporting a single configuration as an object, function or Promise, you can export multiple configurations.

## Using other Configuration Languages

webpack accepts configuration files written in multiple programming and data languages.
