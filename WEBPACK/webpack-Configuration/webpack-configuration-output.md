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