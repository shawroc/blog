# Optimization

Since version 4 webpack runs optimizations for you depending on the chosen mode, still all optimizations are available for manual configuration and overrides.

## optimization.minimize

boolean

Tell webpack to minimize the bundle using the TerserPlugin.

This is true by default in production mode.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    minimize: false
  }
};
```

## optimization.minimizer

[ <plugin> ] and or [ function (compiler) ]

Allows you to override the default minimizer by providing a different one or more customized TerserPlugin instances.

webpack.config.js

``` js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  }
};
```

Or, as function:

``` js
module.exports = {
  optimization: {
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
        new TerserPlugin({/* your config */}).apply(compiler);
      }
    ],
  }
};
```

## optimization.splitChunks

object

By default webpack v4+ provides new common chunks strategies out of the box for dynamically imported modules. See available options for configuring this behavior in the SplitChunksPlugin page.

## optimization.runtimeChunk

object string boolean

Setting optimization.runtimeChunk to true or "multiple" adds an additional chunk to each entrypoint containing only the runtime. This setting is an alias for:

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  }
};
```

The value "single" instead creates a runtime file to be shared for all generated chunks. This setting is an alias for:

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    }
  }
};
```

By setting optimization.runtimeChunk to object it is only possiblle to provide the name property which stands for the name or name factory for the runtime chunks.

Default is false: each entry chunk embeds runtime.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}`
    }
  }
};
```

## optimization.noEmitOnErrors

boolean

Use the optimization.noEmitOnErrors to skip the emitting phase whenever there are errors while compiling. This ensures that no erroring assets are emitted. The emitted flag in the stats is false for all assets.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    noEmitOnErrors: true
  }
};
```

## optimization.namedModules

boolean: false

Tells webpack to use readable module identifiers for better debugging. When optimization.namedModules is not set in webpack config, webpack will enable it by default for mode development and disable for mode production.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    namedModules: true
  }
};
```

## optimization.namedChunks

boolean: false

Tells webpack to use readable chunk identifiers for better debugging. This option is enabled by default for mode development and disabled for mode production if no option is provided in webpack config.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    namedChunks: true
  }
};
```

## optimization.moduleIds

bool: false string: natural, named, hashed, size, total-size

Tells webpack whch algorithm to use when choosing module ids. 
Setting optimization.moduleIds to false tells webpack that none of built-in algorithms should be used, as custom one can be provided via plugin. 

By default optimization.moduleIds is set to false.

The following string values are supported:

|Option|Description|
|:-:|:-:|
|natural| Numeric ids in order of usage.|
|named| Readable ids for better debugging.|
|hashed| Short hashes as ids for better long term caching.|
|size| Numeric ids focused on minimal initial download size.|
|total-size| numeric ids focused on minimal total download size.|

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    moduleIds: 'hashed'
  }
};
```

## optimization.chunkIds

bool: false string: natural, named, size, total-size

Tells webpack which algorithm to use when choosing chunk ids.
Setting optimization.chunkIds to false tells webpack that none of built-in algorithms should be used, as custom one can be provided via plugin. There are couple of defaults for optimization.chunkIds:

- if optimization.occurrenceOrder is enabled optimization.chunkIds is set to 'total-size'

- Disregarding previous if, if optimization.namedChunks is enabled optimizaztion.chunkIds is set to 'named'

- If none of the above, optimization.chunkIds will be defaulted to 'natural'

The following string values are supported:

|option| Description|
|:-:|:-:|
|'natural'| Numeric ids in order of usage.|
|'named'| Readable ids for better debugging.|
|'size'| Numeric ids focused on minimal initial download size.|
|'total-size'|Numeric ids focused on minimal total download size.|

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    chunkIds: 'named'
  }
};
```

## optimization.nodeEnv

string bool: false

Tells webpack to set process.env.NODE_ENV to a given string value. 
optimization.nodeEnv uses DefinePlugin unless set to false.optimization.nodeEnv defaults to mode if set, else falls back to "production".

Possible values:

- any string: the value to set process.env.NODE_ENV to.

- false: do not modify/ set the value of process.env.NODE_ENV.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    nodeEnv: 'production'
  }
};
```

## optimization.mangleWasmImports

bool: false

When set to true tells webpack to reduce the size of WASM by changing imports to shorter strings. It mangles module and export names.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    mangleWASMImports: true
  }
};
```

## optimization.removeAvailableModules

bool: true

Tells webpack to detect and remove modules from chunks when these modules are already included in all parents. Setting optimization.removeAvailableModules to false will disable this optimization.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    removeAvailableModules: false
  }
};
```

## optimization.removeEmptyChunks

bool: true

Tells webpack to detect and remove chunks which are empty. Setting optimization.removeEmptyChunks to false will disable this optimization.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    removeEmptyChunks: false
  }
};
```

## optimization.mergeDuplicateChunks

bool: true

Tells webpack to merge chunks which contain the same modules. Setting optimization.mergeDuplicateChunks to false will disable this optimization.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    mergeDuplicateChunks: false
  }
};
```

## optimization.flagIncludedChunks

bool

Tells webpack to determine and flag chunks which are subsets of other chunks in a way that subsets don't have to be loaded when the bigger chunk has been already loaded. 
By default optimization.flagIncludedChunks is enabled in production mode and disbaled elsewise.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    flagIncludedChunks: true
  }
};
```

## optimization.occurrenceOrder

bool

Tells webpack to figure out an order of modules which will result in the smallest initial bundle. By default optimization.occurrenceOrder is enabled in production mode and disabled elsewise.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    occurrenceOrder: false
  }
};
```

## optimization.providedExports 

bool

Tells webpack to figure out which exports are provided by modules to generate more efficient code for export * from ... By default

optimization.provideExports is enabled.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    providedExports: false
  }
};
```

## optimization.usedExports

bool

Tells webpack to determine used exports for each module. 
This depends on optimization.providedExports. 
Information collected by optimization.usedExports is used by other optimizations or code generation i.e. exports are not generated for unused exports, export names are mangled to single char identifiers when all usages are compatible.

Dead code elimination in minimizers will benefit from this and can remove unused exports. 

By default optimization.usedExports is enabled in production mode and disabled elsewise.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    usedExports: true
  }
};
```

## optimization.concatenateModules

bool

Tells webpack to find segments of the module graph which can be safely concatenated into a single module.

Depends on optimization.providedExports and optimization.usedExports. By default optimization.concatenateModules is enabled in production mode and disabled elsewise.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    concatenateModules: true
  }
}
```

## optimization.sideEffects

bool

Tells webpack to recognise the sideEffects flag in package.json or rules to skip over modules which are flagged to contain no side effects when exports are not used.

package.json

``` js
{
  "name": "awesome npm module",
  "version": "1.0.0",
  "sideEffects": false
}
```

optimization.sideEffects depends on optimization.providedExports to be enabled. This dependency has a build time cost, but eliminating modules has positive impact on performance becaue of less code generation. 

Effect of this optimization depends on your codebase, try it for possible performance wins.

By default optimization.sideEffects is enabled in production mode and disabled elsewise.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    sideEffects: true
  }
};
```

## optimization.portableRecords

bool

optimization.portableRecords tells webpack to generate records with relative paths to be able to move the context folder.

By default optimization.portableRecords is disabled.
Automatically enabled if at least one of the records options provided to webpack config: recordsPath, recordsInputPath, recordsOutputPath.

webpack.config.js

``` js
module.exports = {
  // ...
  optimization: {
    portableRecords: true
  }
};
```