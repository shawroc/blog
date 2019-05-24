# Dependency Graph

Any time one file depends on another, webpack treats this as a dependency.

This allows webpack to take non-code assets, such as images or web fonts, and also provide them as dependencies for your application.

When webpack processes your application, it starts from a list of modules defined on the command line or in its config file.

Starting from these entry points, webpack recursivelly builds a dependency graph that includes every module your application needs, then bundles all of those modules into a small number of bundles - often, just one - to be loaderd by the browser.

``` md
Bunding your application is respecially powerful for HTTP/1.1 clients, as it minimizes the number of times your app has to wait while the browser starts a new request.

For HTTP/2, you can also use Code Splitting to achieve best results.
```

## Tragets

Because JavaScript can be written for both server and browser, webpack offers multiple deployment targets that you can set in your webpack configuration. ==The webpack target property is not to be confused with the output.libraryTarget property.==

### Usage

To set the target property, you simply set the target value in your webpack config:

webpack.config.js

``` js
module.exports = {
  target: 'node'
};
```

In the example above, using node webpack will compile for usage in the Node.js - like environment(uses Node.js require to load chunks and not touch any built in modules like fs or path).

Each target has a variety of deployment/environment specific additions, support to fit its needs.

### Multiple Targets

Although webpack does not support multiple strings being passed into the target property, you can create an isomorphic library by bundling two separate configurations:

webpack.config.js

``` js
const path = require('path');

const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
};

const clientConfig = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
};

module.exports = [serverConfig, clientConfig];
```

The example above will create a lib.js and lib.node.js file in your dist folder.

### Resources

As seen from the options above there are multiple different deployment targets that you can choose from. Below is a list of examples, and resources that you can refer to.s