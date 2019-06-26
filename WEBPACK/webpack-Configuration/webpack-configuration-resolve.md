# Resolve

These options change how modules are resolved.
webpack provides reasonable defualts, but it is possible to change the resolving in details. Have a look at Module Resolution for more explanation of how the resolver works.

## resolve

object

Configure how modules are resolved.
For example, when calling import 'lodash' in ES2015, the resolve options can change where webpack goes to look for 'lodash' (see modules).

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    // configuration options
  }
};
```

## resolve.alias

object

Create aliases to import or require certain modules more easily. For example, to alias a bunch of commonly used src/ folders:

webpack.config.js

``` JS
module.exports = {
  // ...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities'),
      Templates: path.resolve(__dirname, 'src/template/')
    }
  }
};
```

Now, instead of using relative paths when importing like so:

``` js
import Utility from '../../utilities/utility';
```

you can use the alias:

``` js
import Utility from 'Utilities/utility';
```

A trailing $ can also be added to the given object's keys to signify an exact match:

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      xyz$: path.resolve(__dirname, 'path/to/file.js')
    }
  }
};
```

which would yield these results:

``` js
// Exact match, so path/to/file.js is resolved and imported
import Test1 from 'xyz'; 

// Not an exact match, normal resolution takes place
import Test2 from 'xyz/file.js'; 
```

## resolve.aliasFields

[ string ] : [ 'browser' ]

Specify a field, such as browser, to be parsed according to this specification.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    aliasFields: ['browser']
  }
};
```

## resolve.cacheWithContext

boolean (since webpack 3.1.0)

If unsafe cache is enabled, includes request.context in the cache key. This option is taken into account by the enhanced-resolve module. Since webpack 3.1.0 contect in resolve caching is ignored when resolve or resolveLoader plugins are provided. This addresses a performance regression.

## resolve.descriptionFiles

[ string ] : [ 'package.json' ]

The JSON files to use for descriptions.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    descriptionFiles: ['package.json']
  }
};
```

## resolve.enforceExtension

boolean: false

if true, it will not allow extension-less files.
So by default require('./foo') works if ./foo has a .js extension, but with enabled only require('./foo.js') will work.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    enforceExtension: false
  }
};
```

## resolve.enforceModuleExtension

boolean: false

Tells webpack whether to require to use an extension for modules (e.g. loaders).

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    enforceModuleExtension: false
  }
};
```

## resolve.extensions

[ string ] : [ '.wasm', '.mjs', '.js', '.json' ]

Attempt to resolve these extensions in order.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json']
  }
};
```

which is what enables users to leave off the extension when importing:

``` js
import File from '../path/to/file';
```

## resolve.mainFields

[ string ]

When importing from an npm package, e.g. import * as D3 from 'd3', this option will determine which fields in its package.json are checked. The default values will vary based upon the target specified in your webpack configuration.

When the target property is set to webworker, web, or left unspecified:

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    mainFields: ['browser', 'module', 'main']
  }
};
```

For any other target(including node):

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    mainFields: ['module', 'main']
  }
};
```

For example, consider an arbitrary library called upstream with a package.json that contains the following fields:

``` js
{
  "browser": "build/upstream.js",
  "module": "index"
}
```

When we import * as Upstream from 'upstream' this will actually resolve to the file in the browser property. The browser property takes precedence because it's the first item in mainFields. Meanwhile, a Node.js application bundled by webpack will first try to resolve using the file in the module field.

## resolve.mainFiles

[ string ] : [ 'index' ]

The filename to be used while resolving directories.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    mainFiles: [ 'index' ]
  }
};
```

## resolve.modules

[ string ] : [ 'node_modules' ]

Tell webpack what directories should be searched when resolving modules.

Absolute and relative paths can both be used, but be aware that they will behave a bit differently.

A relative path will be scanned similarly to how Node scans for node_modules, by looking through the current directory as well as its ancestors (i.e. ./node_modules, ../node_modules, and on).

With an absolute path, it will only search in the given directory.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    modules: ['node_modules']
  }
};
```

If you want to add a directory to search in that takes precedence over node_modules/:

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    modules: [ 'node_modules' ]
  }
};
```

If you want to add a directory to search in that takes precedence over node_modules/: 

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
```

## resolve.unsafeCache

regex array boolean: true

Enable aggressive, but unsafe, caching of modules. Passing true will cache everything.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    unsafeCache: true
  }
};
```

A regular expression, or an array of regular expressions, can be used to test file paths and only cache certain modules. For example, to only cache utilities:

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    unsafeCache: /src\/utilities/
  }
};
```

## resolve.plugins

[ Plugin ]

A list of additional resolve plugins which should be applied. It allows plugins such as DirectoryNamedWebpackPlugin.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  }
};
```

## resolve.symlinks

boolean: true

Whether to resolve symlinks to their symlinked location.

When enabled, symlinked resources are resolved to their real path, not their symlinked location. Note that this may cause module resolution to fail when using tools that symlink packages (like npm link).

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    symlinks: true
  }
};
```

## resolve.cachePredicate

function: function (module) { return true; }

A function which decides whether a request should be cached or not.
An object is passed to the function with path and request properties. It must return a boolean.

webpack.config.js

``` js
module.exports = {
  // ...
  resolve: {
    cachePredicate: (module) => {
      // additional logic
      return true;
    }
  }
};
```

## resolveLoader

object

This set of options is identical to the resolve property set above, but is used only to resolve webpack's loader packages. Default:

webpack.config.js

``` js
module.exports = {
  // ...
  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  }
};
```

## resolveLoader.moduleExtensions

[ string ]

The extensions/suffixes that are used when resolving loaders. Since version two, we strongly recommend using the full name, e.g. example-loader, as much as possible for clarity. However, if you really wanted to exclude the -loader bit, i.e. just use example, you can use this option to do so:

webpack.config.js

``` js
module.exports = {
  // ...
  resolveLoader: {
    moduleExtensions: ['-loader']
  }
};
```