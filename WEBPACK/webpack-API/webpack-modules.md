# Webpack Modules

## Module Methods

This section covers all methods available in code compiled with webpack. When using webpack to bundle your application, you can pick from a variety of module syntax styles including ES6, CommonJS and AMD.

While webpack supports multiple module syntaxes, we recommend following a single syntax for consistency and to avoid odd behaviors/bugs. Here's one example of mixing ES6 and CommonJS, however there are surely others.

### ES6 [ Recommended ]

Version 2 of webpack supports ES6 module syntax natively, meaning you can use import and export without a tool like babel to handle this for you. Keep in mind that you will still probably need babel for other ES6+ features. The following methods are supported by webpack:

#### import

Statically import the export s of another module.

``` js
import MyModule from './my-module.js';
import { NamedExport } from './other-module.js';
```

The keyword here is statically. Normal import statement cannot be used dynamically within other logic or contain variables. See the [spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) for more information and import() below for dynamic usage.

#### export

Export anything as a default or named export.

``` js
// Named exports
export var Count = 5;
export function Multiply(a,b) {
  return a * b;
}

// Default export
export default {
  // Some data...
};
```

#### import()

import('path/to/module') -> Promise

Dynamically load modules. Calls to import() are treated as split points, meaning the requested module and its children are split out into a seperate chunk.

The ES2015 Loader spec defines import() as method to load ES2015 modules dynamically on runtime.

``` js
if ( module.hot ) {
  import('lodash').then( _ => {
    // Do something with lodash(a.k.a )
  });
}
```

This feature relies on Promise internally.
If you use import() with older browsers, remember to shim Promise using a polyfill such as es6-promise or promise-polyfill.

### Magic Comments

Inline comments to make features work.
By adding comments to the import we can do things such as name our chunk or select different modes. 
For a full list of these magic comments see the code below followed by an explanation of what these comments do.

``` js
// Single target
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  'module'
);

// Multiple possible targets
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  `./locale/${language}`
);

import(/* webpackIgnore: true */ 'ignored-module.js');
```

webpackIgnore: Disables dynamic import parsing when set to true.

webpackChunkName: A name for the new chunk. Since webpack 2.6.0, the placeholders [ index ] and [ request ] are supported within the given string to an incremented number or the actual resolved filename respectively. Adding this comment will cause our separate chunk to the named [ my-chunk-name ].js instead of [ id ].js.

webpackMode: Since webpack 2.6.0, different modes for resolving dynamic imports can be specified. The following options are supported:

- "lazy" (default): Generates a lazy-loadable chunk for each import() ed module.

- "lazy-once": Generates a single lazy-loadable chunk that can satisfy all calls to import(). The chunk will be fetched on the first call to import(), and subsequent calls to import() will use the same network response. Note that this only makes sense in the case of a partially dynamic statement, e.g. import(`./locales/${language}.json`), where there are multiple module paths that could potentially be requested.

- "eager": Generates no extra chunk. All modules are included in the current chunk and no additional network requests are made. A promise is still returned but is already resolved. In contrast to a static import, the module isn't executed until the call to import() is made.

- "weak": Tries to load the module if the module function has already been loaded in some other way (i.e. another chunk imported it or a script containing the module was loaded). A Promise is still returned but, only successfully resolves if the chunks are already on the client. If the module is not available, the Promise is rejeced. A network request will never be performed. This is useful for universal rendering when required chunks are always manually served in initial requests (embedded within the page), but not in cases where app navigation will trigger an import not initially served.

webpackPrefetch: Tells the browser that the resource is probably needed for some navigation in the future. Check out the guide for more information on how webpackPrefetch works.

webpackPreload: Tells the browser that the resource might be needed during the current navigation. Check out the guide for more information on how webpackPreload works.

## CommonJS

The goal of CommonJS is to specify an ecosystem for JavaScript outside the browser. The following CommonJS methods are supported by webpack:

### require

``` js
require(dependency: String);
```

Synchronously retrieve the exports from another module. The compiler will ensure that the dependency is available in the output bundle.

``` js
var $ = require('jquery');
var myModule = require('my-module');
```

Using it asynchronously may not have the expected effect.

### require.resolve

``` js
require.resolve(dependency: String);
```

Synchronously retrieve a module's ID.
The compiler will ensure that the dependency is available in the output bundle. 
See module.id for more information.

Module ID is a number in webpack(in contrast to NodeJS where it is a string -- the filename).

### require.cache

Multiple requires of the same module result in only one module execution and only one export. Therefore a cache in the runtime exists. Removing values from this cache cause new module execution and a new export.

**This is only needed in rare cases for compatibility!**

``` js
var dl = require('denpendency');
require('dependency') === dl;
delete require.cache[require.resolve('dependency')];
require('dependency') !== dl;
```

``` js
// in file.js
require.cache[module.id] === module;
require('./file.js') === module.exports;
delete require.cache[module.id];
require.cache[module.id] === undefined;
require('./file.js') !== module.exports; // in theory; in praxis this causes a stack overflow
require.cache[module.id] !== module;
```

### require.ensure

require.ensure() is specific to webpack and superseded by import().

``` js
require.ensure(
  dependencies: String[],
  callback: function(require),
  errorCallback: function(error),
  chunkName: String
)
```

Split out the given dependencies to separate bundle that will be loaded asynchronously. When using CommonJS module syntax, this is the only way to dynamically load dependencies. Meaninng, this code can be run within execution, only loading the dependencies if certain conditions are met.

This feature relies on Promise internally. If you use require.ensure with older browsers, remember to shim Promise using a polyfiill such es6-promise or promise-polyfill.

``` js
var a = require('normal-dep');

if ( module.hot ) {
  require.ensure(['b'], function(require) {
    var c = require('c');

    // Do something special ...
  });
}
```

The following parameters are supported in the order specified above:

- dependencies: An array of strings declaring all modules required for the code in the callback to execute.

- callback:  A function that webpack will execute once the dependencies are loaded. An implementation of the require function is sent as a parameter to this function. The function body can use this to further require() modules it needs for execution.

- errorCallback: A function that is executed when webpack fails to load the dependencies.

- chunkName: A name given to the chunk created by this particular require.ensure(). By passing the same chunkName to various require.ensure() calls, we can combine their code into a single chunk, resulting in only one bundle that the browser must load.

Although the implementation of require is passed as an argument to the callback function, using an arbitrary name e.g. require.ensure([], function(request) { request('someModule');}) isn't handled by webpack's static parser. Use require instead, e.g. require.ensure( [], function(require) { require('someModule');}).


## AMD

Asynchronous Module Definition(AMD) is a JavaScript specification that defines an interface for writing and loading AMD methods are supported by webpack:

define (with factory)

``` js
define([name: String], [dependencies: String[]], factoryMethod: function(...))
```

If dependencies are provided, factoryMethod will be called with the exports of each dependency (in the same order). If dependencies are not provided, factoryMethod is called with require, exports and module(for compatibility!). If this function returns a value, this value is exported by the module. The compiler ensures that each dependency is available.

Note that webpack ignores the name argument.

``` js
define(['jquery', 'my-module'], function($, myModule) {
  // Do something with $ and myModule ...
  // Export a function
  return function doSomething() {
    // ...
  };
});
```

This CANNOT be used in an async function.

### require (amd-version)

``` js
require(dependencies: String[], [callback: function(...)])
```

Similar to require.ensure, this will split the given dependencies into a separate bundle that will be loaded asynchronously. The callback will be called with the exports of each dependency in the dependencies array.

``` js
require(['b'], function(b){
  var c = require('c');
});
```

There is no option to provide a chunk name.

## Labeled Modules

The internal LabeledModulesPlugin enables you to use the following mothods for exporting and requiring within your modules:

### export label

Export the given value. The label can occur before a function declaration or a variable declaration. The function name or variable name or variable name is the identifier under which the value is exported.

``` js
export: var answer = 42;
export: function method(value) {
  // Do something...
};
```

Using it in an async function may not have the expected effect.

### require label

Make all exports from the dependency available in the current scope. The require label can occur before a string. The dependency must eport values with the export label. CommonJS or AMD modules cannot be consumed.

some-dependency.js

``` js
// some-dependency.js
export: var answer = 42;
export: function method(value) {
  // Do something...
};
```

``` js
require: 'some-dependency';
console.log(answer);
method(...);
```

## Webpack

Aside from the module syntaxes described above, webpack also allows a few custom, webpack-specific methods:

### require.context

``` js
require.context(
  directory: String,
  includeSubdirs: Boolean /* optional, default true */,
  filter: RegExp /* optional, default /^\.\/.*$/, any file */,
  mode: String /* optional, 'sync' | 'eager' | 'weak' |'lazy'| 'lazy-once', default 'sync' */
)
```

Specify a whole group of dependencies using a path to the directory, an option to includeSubdirs, a filter for more fine grained control of the modules included, and a mode to define the way how loading will work. Underlying modules can then be easily resolved later on: 

``` js
var context = require.context('components', true, /\.html$/);
var componentA = context.resolve('componentA');
```

If mode is specified as "lazy", the underlying modules will be loaded asynchronously:

``` js
var context = require.context('locales', true, /\.json$/, 'lazy');
context('localeA').then(locale => {
  // do something with locale
});
```

The full list of available modes and its behavior is decribed in import() documentation.

### require.include

``` js
require.include(dependency: String)
```

Include a dependency without executing it.
This can be used for optimizing the position of a module in the output chunks.

``` js
require.include('a');
require.ensure(['a','b'], function(require){ /* ... */ });
require.ensure(['a','c'], function(require){ /* ... */});
```

This will result in the following output:

- entry chunk: file.js and a
- anonymous chunk: b
- anonymous chunk: c

Without require.include('a') it would be duplicated in both anonymous chunks.

### require.resolveWeak

Simillar to require.resolve, but this won't pull the module into the bundle. It's what is considered a "weak" dependency.

``` js
if(__webpack_modules__[require.resolveWeak('module')]) {
  // Do something when module is availabe ...
}
if(require.cache[require.resolveWeak('module')]) {
  // Do something when module was loaded before...
}

// You can perform dynamic resolves("context")
// jst as with other require/import methods.
const page = 'Foo'l
__webpack_modules__[require.resolveWeak(`./page/${page}`)];
```

require.resolveWeak is the foundation of universal rendering(SSR + Code Splitting), as used in packages such as react-univeral-component. It allows code to render synchronously on both the server and initial page-loads on the client. It requires that chunks are manually served or somehow available. It's able to requie modules without indicating they should be bundled into a chunk. It's used in conjunction with import() which takes over when user navigation triggers additonal imports.

## Module Variables

This section covers all variables available in code compiled with webpack. Modules will have access to certain data from the compilation process through module and other variables.

### module.loaded(NodeJS)

This is false if the module is currently executing, and true if the sync execution has finished.

### module.hot(webpack-specific)

Indicates whether or not Hot Module Replacement is enabled and provides an interface to the process.

### module.id(CommonJS)

The ID of the current module.

``` js
module.id === require.resolve('./file.js');
```

### module.exports(CommonJS)

Defines the value that will be returned when a consumer makes a require call to the module (defaults to a new object).

``` js
module.exports = function doSomething(){
  // Do something...
};
```

This CANNOT be used in an asynchronous function.

### exports(CommonJS)

This variable is equal to the default value of module.exports(i.e. an object). If module.exports gets overwritten, exports will no longer be exported.

``` js
exports.someValue = 42;
exports.anObject = {
  x: 123
};
exports.aFunction = function doSomething(){
  // Do something
};
```

### global(NodeJS)

See node.js global

### process(NodeJS)

See node.js process

### __dirname(NodeJS)

Depending on the config option node.__dirname:

- false: Not defined
- mock: equal "/"
- true: node.js __dirname

If used inside an expression that is parsed by the Parse, the config option is treated as true.

### __filename(NodeJS)

Depending on the config option node.__filename:

- false: Not defined
- mock: equal "/index.js"
- true: node.js__filename

If used inside an expression that is parsed by the Parser, the config option is treated as true.

### __resourceQuery(webpack-specific)

The resource query of the current module. If the following require call was made, then the query string would be available in file.js. 

``` js
require('file.js?test');
```

file.js

``` js
__resourceQuery === '?test';
```

### __webpack_public_path__(webpack-specific)

Equals the config options output.publicPath.

### __webpack_require__(webpack-specific)

The raw require function. This expression isn't  parsed by the Parser for dependencies.

### __webpack_chunk_load__(webpack-specific)

The internal chunk loading function. Takes two arguments:

- chunkId The id for the chunk to load.
- callback(require) A callback function called once the chunk is loader.

### __webpack_modules__(webpack-specific)

Access to the internal object of all modules.

### __webpack_hash__(webpack-specific)

This variable is only available with the HotModuleReplacementPlugin or the ExtendedAPIPlugin. It provides access to the hash of the compilation.

### __non_webpack_require__(webpack-specific)

Generates a require function that is not parsed by webpack. Can be used to do cool stuff with a global require function is available.

### DEBUG (webpack-specific)

Equals the config option debug.
