# Output

The top-level output key contains set of options instructing webpack on how and where it should output your bundles, assets and anything else you bundle or load with webpack.

## output.auxiliaryComment

string object

When used in tandem with output.library and output.libraryTarget, this option allows users to insert comments within the export wrapper.

To insert the same comment for each libraryTarget typem set auxiliaryComment to a string:

webpack.config.js

``` js
module.exports = {
  output: {
    library: 'someLibName',
    libraryTarget: 'umd',
    filename: 'someLibName.js',
    auxiliaryComment: 'Test Comment'
  }
};
```

which will yield the following:

webpack.config.js

``` js
(function webpackUniversalModuleDefinition(root, factory) {
  // Test Comment
  if(typeof exports === 'object' && typeof module === 'object') 
    module.exports = factory(require('lodash'));
  // Test Comment
  else if(typeof define  === 'function' && define.amd)
    define(['lodash'], factory)
  // Test Comment
  else if(typeof exports === 'object')
    exports['someLibName'] = factory(require('lodash'));
  else 
    root['someLibName'] = factory(root['_']);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__){
  // ...
});
```

For line-grained control over each libraryTarget comment, pass an object:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    // ...
    auxiliaryComment: {
      root: 'Root Comment',
      commonjs: 'CommonJS Comment',
      commonjs2: 'CommonJS2 Comment',
      and: 'AMD Comment'
    }
  }
};
```

output.chunkFilename

string

This option determines the name of non-entry chunk files.
See output.filename option for details on the possible values.

Note that these filenames need to be generated at runtime to send the requests for chunks.
Because of this, placeholders [ name ] and [ chunkhash ] need to add a mapping from chunk id to placeholder value to the output bundle with the webpack runtime.

This increases the size and may invalidate the bundle when placeholder value for any chunk changes.

By default [ id ].js is used or a value inferred from output.filename([ name ] is replaced with [ id ] or [ id ]. is prepended).


## output.chunkLoadTimeout

integer

Number of milliseconds before chunk request expires, defaults to 120 000.  This option is supported since webpack 2.6.0.

## output.crossOriginLoading

boolean string

Only used when target is web, which uses JSONP for loadinhg on-demand chunks, by adding script tags.

Enable cross-origin loading of chunks.
The following values are accepted...

crossOriginLoading: false -Disable cross-origin loading（default）。

crossOriginLoading: 'anonymous' - Enable cross-origin loading without credentials

crossOriginLoading: 'use-credentials' - Enanle cross-origin loading with credentials

## output.jsonpScriptType

string

Allows customization of the script type webpack injects script tags into the DOM to download async chunks. 

The following options are available: 

- 'text/javascript' (default)
- 'module': Use with ES6 ready code.

## output.devtoolFallbackModuleFilenameTemplate

string | function(info)

A fallback used when the template string or function above yields duplicates.

See output.devtoolModuleFilenameTemplate.

## output.devtoolLineToLine

boolean | object

Avoid using this option as it is deprecated and will soon be removed.

Enables line to line mapping for all or some modules.
This produces a simple source map where each line of the generated source is mapped to the same line of the original source. This is a performance optimization and should only be used if all input lines match generated lines.

Pass a boolean to enable or disable this feature for all modules(defaults to false).

An object with test, include, exclude is also allowed.

For example, to enable this feature for all javascript files within a certain directory:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    devtoolLineToLine: { test: /\.js$/, include: 'src/utilities'}
  }
};
```

## output.devtoolModuleFilenameTemplate

string | function(info)

This option is only used when devtool uses an options which requires module names.

Customize the names used in each source map's sources array.
This can be done by passing a template string or function.

For example, when using devtool: 'eval'. this is the default:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]'
  }
};
```

The following substitutions are available in template strings（via webpack's internal ModuleFilenameHelpers):

|Template| Description|
|:-:|:-:|
|[ absolute-resource-path ]| The absolute filename|
|[ all-loaders ]| Automatic and explicit loaders and params up to the name of the first loader|
|[ hash ]| The hash of the module identifier|
|[ id ]| The module identifier|
|[ loaders ]| Explicit loaders and params up to the name of the first loader|
|[ resource ]| The path used to resolve the file and any query params used on the first loader|
|[ resource-path]| The path used to resolve the file without any query params|
|[ namespace ]| The modules namespace. This is usually the library name when building as a library, empty otherwise|

When using a function, the same options are available camel-cased via the info parameter:

``` js
module.exports = {
  // ...
  output: {
    devtoolModuleFilenameTemplate: info => {
      return `webpack:////${info.resourcePath}?${info.loaders}`;
    }
  }
};
```

If multiple modules would result in the same name,
output.devtoolFallbackModuleFilenameTemplate is used instead for these modules.

## output.devtoolNamespace

string

This option determines the modules namespace used with the output.devtoolModuleFilenameTemplate. 

When not specified, it will default to the value of: output.library.

It's used to prevent source file path collisions in sourcemaps when loading multiple libraries built with webpack.

For example, if you have 2 libraries, with namespaces library1 and library2, which both have a file ./src/index.js (with potentially different contents), they will expose these files as webpack://library1/./src/index.js and webpack://library2/./src/index.js.

## output.filename

string function

This option determines the name of each output bundle.
The bundle is written to the directory specified by the output.path option.

For a single entry point, this can be a static name.

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filenmae: 'bundle.js'
  }
};
```

However, when creating multiple bundles via more than one entry point, code splitting, or various plugins, you should use one of the following substitutions to give each bundle a unique name...

Using entry name:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: '[name].bundle.js'
  }
};
```

Using internal chunk id:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: '[id].bundle.js'
  }
};
```

Using the unique hash generated for every build:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: '[name].[hash].bundle.js'
  }
};
```

Using the unique hash generated for every build:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: '[name].[hash].bundle.js'
  }
};
```

Using hashes based on each chunk's content:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: [chunkhash].bundle.js'
  }
};
```

Using hashes generated for extracted content:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: '[contenthash].bundle.css'
  }
};
```

Using function to return the filename:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: '[contenthash].bundle.css'
  }
};
```

Using function to return the filename:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: (chunkData) => {
      return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    },
  }
};
```

Make sure to read the Caching guide for details.
There are more steps involved than just setting this option.

Note this option is called filename but you are still allowed to use something like 'js/[name]/bundle.js' to create a folder structure.

Note this option does not affect output files for on-demand-loaded chunks. For these files the output.chunkFilename option is used. Files created by loaders also aren't affected. In this case you would have to try the specific loader's available options.

The following substitutions are available in template strings(via webpack's internal TemplatePathPlugin ):

|Template|Description|
|:-:|:-:|
|[ hash ]| The hash of the module identifier|
| [ chunkhash ]| The hash of the chunk content|
| [ name ] | The module name |
| [ id ] | The module identifier |
| [ query ] | The module query, i.e, the string following ? in the filename|
| [ function ] | The function, which can return filename [ string ] |

The lengths of [ hash ] and [ chunkhash ] can be specified using [ hash: 16 ] (defaults to 20). 

Alternatively, specify output.hashDigestLength to configure the length globally.

If using a function for this option, the function will be passed an object containing the substitutions in the table above.

When using the ExtractTextWebpackPlugin, use [ contenthash ] to obtain a hash of the extracted file(neither [ hash ] nor [ chunkhash ] work).

## output.globalObject

string: 'window'

When targeting a library, especially the libraryTarget is 'umd', this option indicates what global object will be used to mount the library.

To make UMD build available on both browsers and Node.js, set output.globalObject option to 'this'.

For example:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    library: 'myLib',
    libraryTarget: 'umd',
    filename: 'myLib.js',
    globalObject: 'this'
  }
};
```

## output.hashDigest

The encoding to use when generating the hash, defaults to 'hex'.
All encodings from Node.js'hash.digest are supported. USING 'base64' for filenames might be problematic since it has the character / in its alphabet. Likewise 'latin1' could contain any character.

## output.hashDigestLength

The prefix length of the hash digest to use, defaults to 20.

## output.hashFunction

string | function 

The hashing algorithm to use, defaults to 'md4'.
All functions from Node.JS are supported. 
Since 4.0.0-alph2, the hashFunction can now be a constructor to a custom hash function.
You can provide a non-crypto hash function for performance reasons.

``` js
module.exports = {
  // ...
  output: {
    hashFunction: require('metrohash').MetroHash64
  }
};
```

Make sure that the hashing function will have update and digest methods available.

## output.hashSalt

An optional salt to update the hash via Node.JS`hash.update.

## output.hotUpdateChunkFilename

string function

Customize the filenames of hot update chunks.
See output.filename option for details on the possible values.

The only placeholders allowed here are [ id ] and [ hash ], the default being：

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    hotUpdateChunkFilename: '[id].[hash].hot-update.js'
  }
};
```

Here is no need to change it.

## output.hotUpdateFunction

function

only used when target is web, which uses JSONP for loading hot updates.

A JSONP function used to asynchronously load hot-update chunks.

For details see output.jsonpFunction.

## output.hotUpdateMainFilename

string function

Customize the main hot upldate filename.
See output.filename option for details on the possible values.

[ hash ] is the only available placeholder, the default being:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    hotUpdateMainFilename: '[hash].hot-update.json'
  }
};
```

Here is no need to change it.

## output.jsonpFunction

string 

Only used when target is web, which uses JSONP for loading on-demand chunks.

A JSONP function name used to asynchronously load chunks or join multiple initial chunks (SplitChunksPlugin, AggessiveSplittingPlugin).

This needs to be changed if multiple webpack runtimes(from different compilation) are used on the same webpage.

If using the output.library option, the library name is automatically appended.

## output.library

string or object(since webpack 3.1.0; for libraryTarget: 'umd')

How the value of the output.library is used depends on the value of the output.libraryTarget option;

Please refer to that section for the complete details.

Note that the default option for output.libraryTarget is var, so if the following configuration option is used:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    library: 'MyLibrary'
  }
};
```

The variable MyLibrary will be bound with the return value of your entry file, if the resulting output is included as a script tag in an HTML page.

## output.libraryExport

string | string[]

Configure which module or modules will be exposed via libraryTarget. It is undefined by default, same behaviour will be applied if you set libraryTarget to an empty string e.g. '' it will export the whole (namespace) object. 

The examples below demonstrate the effect of this config when using libraryTarget: 'var'.

The following configurations are supported:

libraryExport: 'default' - The default export of your entry point will be assigned to the library target:

``` js
// if your entry has a default export of 'MyDefaultModule'
var MyDefaultModule = _entry_return_.default;
```

libraryExport: 'MyModule' - The specified module will be assigned to the library target:

``` js
var MyModule = _entry_return_.MyModule;
```

libraryExport: ['MyModule', 'MySubModule'] - The array is interpreted as a path to a module to be assigned to the library target:

``` js
var MySubModule = _entry_return_.MyModule.MySubModule;
```

With the libraryExport configurations specified above, the resulting libraries could be utilized as such:

``` js
MyDefaultModule.doSomething();
MyModule.doSomething();
MySubModule.doSomething();
```

## output.libraryTarget

string: 'var'

Configure how the library will be exposed.
Any one of the following options can be used. Please note that this option works in conjunction with the value assigned to output.library.
For the following examples, it is assumed that this value is configured as MyLibrary.

Note that _entry_return_ in the example code below is the value returned by the entry point. In the bundle itself, it is the output of the function that is generated by webpack from the entry point.

## Expose a Variable

These options assign the return value of the entry point (e.g. whatever the entry point exported) to the name provided by output.library at whatever scope the bundle was included at.

libraryTarget：'var' -(default) When your library is loaded, the return value of your entry point will be assigned to a variable:

``` js
var MyLibrary = _entry_return_;

// In a separate script ...
MyLibrary.doSomething();
```

When using this option, an empty output.library will result in no assignment.

libraryTarget: 'assign' - This will generate an implied global which has the potential to reassign an existing value(use with caution).

``` js
MyLibrary = _entry_return_;
```

Be aware that if MyLibrary isn't defined earlier your library will be set in global scope.

When using this option, an empty output.library will result in a broken output bundle.

## Expose Via Object Assignment

These options assign the return value of the entry point (e.g. whatever the entry point exported) to a specific object under the name defined by output.library.

If output.library is not assigned a non-empty string, the default behavior is that all properties returned by the entry point will be assigned to the object as defined for the particular output.libaryTarget, via the following code fragment：

``` js
(function(e, a) { for( var i in a) { e[i] = a[i]; }}(output.libraryTarget, _entry_return_));
```

libraryTarget: "this" - The return value of your entry point will be assigned to this under the property named by output.library. 

The meaning of this is up to you:

``` js
this['MyLibrary'] = _entry_return_;

// In a separate script...
this.MyLibrary.doSomething();
MyLibrary.doSomething(); // if this is window
```

libraryTarget: 'window' - The return value of your entry point will be assigned to the window object using the output.library value.

``` js
window['MyLibrary'] = _entry_return_;

window.MyLibrary.doSomething();
```

libraryTarget: 'global' - The return value of your entry point will be assigned to the global object using the output.library value.

``` js
global['MyLibrary'] = _entry_return_;

global.MyLibrary.doSomething();
```

## Module Definition Systems

Those options will result in a bundle that comes with a more complete header to ensure compatibility with various module systems. 

The output.library option will take on a different meaning under the following output.libraryTarget options.

libraryTarget: 'commonjs2' - The return value of your entry point will be assigned to the module.exports.

As the same impliers, this is used in CommonJS environments:

``` js
module.exports = _entry_return_;

require('MyLibrary').doSomething();
```

Note that output.library is omitted, thus it is not required for this particular output.libraryTarget.

libraryTarget: 'amd' - This will expose your library as an AMD module.

AMD modules require that the entry chunk (e.g. the first script loaded by the < script > tag) be defined with specific properties, such as define and require which is typically provided by RequireJS or any compatible loaders (such as almond).

Otherwise, loading the resulting AMD bundle directly will result in an error like define is not defined.

So, with the following configuration...

``` js
module.exports = {
  // ...
  output: {
    library: 'MyLibrary',
    libraryTarget: 'amd'
  }
};
```

The generated output will be defined with the name "MyLibrary", i.e.

``` js
define('MyLibrary', [], function() {
  return _entry_return_;
});
```

The bundle can be included as part of a script tag, and the bundle can be invoked like so:

``` js
require(['MyLibrary'], function(MyLibrary) {
  // Do something with the library...
});
```

If output.library is undefined, the following is generated instead.

``` js
define([], function() {
  return _entry_return_;
});
```

This bundle will not work as expected, or not work at all (in the case of the almond loader) if loaded directly with a < script > tag. 

It will only work through a RequireJS compatible asynchronous module loader through the actual path to that file, so in this case, the output.path and output.filename may become important for this particular setup if these are exposed directly on the server.

libraryTarget: 'amd-require' - This packages your output with an immediately-executed AMD require(dependencies, factory) wrapper.

The 'amd-require' target allows for the use of AMD dependencies without needing a separate later invocation. As with the 'amd' target, this depends on the appropriate require function being available in the environment in which the webpack output is loaded.

With this target, the library name is ignored.

libraryTarget: 'umd' - This exposes your library under all the module definitions, allowing it to work with CommonJS, AMD and as global variable. Take a look at the UMD Repository to learn more.

In this case, you need the library property to name your module:

``` js
module.exports = {
  // ...
  output: {
    library: 'MyLibrary',
    libraryTarget: 'umd'
  }
};
```

In this case, you need the library property to name your module:

``` js
module.exports = {
  // ...
  output: {
    library: 'MyLibrary',
    libraryTarget: 'umd'
  }
};
```

And finally the output is: 

``` js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object') 
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object') 
    exports['MyLibrary'] = factory();
  else 
    root['MyLibrary'] = factory(); 
})(typeof self !== 'undefined' ? self : this, function () {
  return _entry_return_;
});
```

Note that omitting library will result in the assignment of all properties returned by the entry point be assigned directly to the root object, as documented under the object assignment section. Example:

``` js
module.exports = {
  // ...
  output: {
    libraryTarget: 'umd'
  }
};
```

The output will be:

``` js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else {
    var a = factory();
    for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
  }
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});
```

since webpack 3.1.0, you may specify an object for library for differing names per targets:

``` js
module.exports = {
  // ...
  output: {
    library: {
      root: 'MyLibrary',
      amd: 'my-library',
      commonjs: 'my-common-library'
    },
    libraryTarget: 'umd'
  }
};
```

libraryTarget: 'system' - This will expose your library as a System.register module. This feature was first released in webpack 4.30.0.

System modules require that a global variable System is present in the browser when the webpack bundle is executed. Compiling to System.register format allows you to System.import('bundle.js') without additional configuration and have your webpack bundle loaded into the System module registry.

``` js
module.exports = {
  // ...
  output: {
    libraryTarget: 'system'
  }
};
```

Output: 

``` js
System.register([], function(_export) {
  return {
    setter: [],
    execute: function() {
      // ...
    },
  };
});
```

By adding output.library to configuration in addition to having output.libraryTarget set to system, the output bundle will have the library name as an argument to System.register:

``` js
System.register('my-library', [], function(_export){
  return {
    setters: [],
      execute: function() {
      // ...
    },
  };
});
```

Module proof library.

## Other Targets

libraryTarget: 'jsonp' - This will wrap the return value of your entry point into a jsonp wrapper.

``` js
MyLibrary(_entry_return_);
```

The dependencies of your library will be defined by the externals config.

## output.path

string

The output directory as an absolute path.

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    path: path.resolve(__dirname, 'dist/assets')
  }
};
```

Note that [ hash ] in this parameter will be replaced with an hash of the compilation.

See the Caching guide for details.

## output.pathinfo

boolean

Tells webpack to include comments in bundles with information about the contained modules. This option defaults to true in development and false in production mode respectively.

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    pathinfo: true
  }
};
```

Note it also adds some info about tree shaking to the generated bundle.

## output.publicPath

string: '' function

This is an important option when using on-demand-loading or loading external resources like images, files, etc. If an incorrect value is specified you'll receive 404 errors while loading these resources.

This option specifies the public URL of the output directory when referenced in a browsser. A relative URL is resolved relative to the HTML page(or < base > tag).

Server-relative URLs, protocol-relative URLs or absolute URLs are also possible and sometimes required, i.e when hosting assets on a CDN.

Simple rule: The URL of your output.path from the view of the HTML page.

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    publicPath: 'https://cdn.example.com/assets/'
  }
};
```

For this configuration:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    publicPath: '/assets/',
    chunkFilename: '[id].chunk.js'
  }
};
```

A request to a chunk will look like /assets/4.chunk.js.

A loader outputing HTML might emit something like this:

``` js
<link href="/assets/spinner.gif"/>
```

or when loading an image in CSS:

``` css
background-image: url(/assets/spinner.gif);
```

The webpack-dev-server also takes a hint from publicPath, using it to determine where to serve the output files from.

Note that [ hash ] in this parameter will be replaced with an hash of the compilation.

See the Caching guide for details.

Examples: 

``` js
module.exports = {
  // ...
  output: {
    // One of the below
    publicPath: 'https://cdn.example.com/assets/', // CDN (always HTTPS)
    publicPath: '//cdn.example.com/assets/', // CDN (same protocol)
    publicPath: '/assets/', // server-relative
    publicPath: 'assets/', // relative to HTML page
    publicPath: '../assets/', // relative to HTML page
    publicPath: '', // relative to HTML page(same directory)
  }
};
```

In cases where the publicPath of output files can't be known at compile time, it can be left blank and set dynamically at runtime in the entry file using the free variable __webpack_public_path__ .

``` js
__webpack_public_path__ = myRuntimePublicPath;

// rest of your application entry
```

See this discussion for more information on __webpack_public_path__.

## output.sourceMapFilename

string

This option is only used when devtool uses a SourceMap option which writes an output file.

Configure how source maps are named. By default '[ file ].map' is used.

The [ name ], [ id ], [ hash ] and [ chunkhash ] substitutions from output.filename can be used.

In addition to those, you can use substitutions listed below.
The [ file ] placeholder is replaced with the filename of the original file. We recommend only using the [ file ] placeholder, as the other placeholders won't work when generating SourceMaps for non-chunk files.

|Template|Description|
|:-:|:-:|
|[ file ]| The module filename|
|[ filebase ]| The module basename|


## output.sourcePrefix

string

Change the prefix for each line in the output bundles.

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    sourcePrefix: '\t'
  }
};
```

Note by default an empty string is used.
Using some kind of indentation makes bundles look more pretty, but will cause issues with multi-line strings.

