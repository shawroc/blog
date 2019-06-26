# Module

Those options determine how the different types of modules within a project will be treated.

## module.noParse

RegExp [ RegExp ] function(resource) string [ string  ]

Prevent webpack from parsing any files matching the given regular expression(s). Ignored files should not have calls to import, require, define or any other importing mechanism. This can boost build performance when ignoring large libraries.

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    noParse: /jquery|lodash/,
  }
};
```

``` js
module.exports = {
  // ...
  module: {
    noParse: (content) => /jqeury|lodash/.test(content)
  }
};
```

## module.rules

[ Rule ]

An array of Rules which are matched to requests when modules are created. These rules can modify how the mdoule is created. They can apply loaders to the module, or modify the parser.

## Rule Conditions

There are two input values for the conditions:

1.  The resource: An absolute path to the file requested. It's already resolved according to the resolve rules.

2. The issuer: An absolute path to the file of the module which requested the resource. It's the location of the import.

Example: When we import './style.css' within app.js, the resource is /path/to/style.css and the issuer is /path/to/app.js .

When using multiple conditions, all conditions must match.

## Rule results

Rule results are used only when the Rule condition matches.

There are two output values of a Rule:

  1. Applied loaders: An array of loaders applied to the resource.
  2. Parser options: An options object which should be used to create the parser for this module.

These properties affect the loaders: loader, options, use.

For compatibility also these properties: query, loaders.

The enforce property affects the loaders category. Whether it's a normal, pre - or post-loader.

The parser property affects the parser options.

## Nested rules

Nested rules can be specified under the properties rules and oneOf.

These rules are evaluated when the Rule condition matches.

## Rule.enforce

strinng

Possible values: 'pre' | 'post'

Specifies the category of the loader. No value means normal loader.

There is also an additional category "inlined loader" which are loaders applied inline of the import/require.

There are two phases that all loaders enter one after the other:

1. Pitching phase: the pitch method on loaders is called in the order post, inline, normal, pre. See Pitching Loader for details.

2. Normal phase: the normal method on loaders is executed in the order pre, normal, inline, post. Transformation on the source code of a module happens in this phase.

All normal loaders can be ommitted (overridden) by prefixing ! in the request.

All normal and pre loaders can be omitted (overridden) by prefixing -! in the request.

All normal, post and pre loaders can be ommitted (overidden) by prefixing !! in the request.

``` js
// Disable preloaders
import { a } from '!./file.js';

// Disable preloaders and normal loaders
import { b } from '-!./file2.js';

// Disable all loaders
import { c } from '!!./file3.js';
```

Inline loaders and ! prefixes should not be used as they are non-standard. They may be use by loader generated code.

## Rule.exclude

Rule.exclude is a shortcut to Rule.resource.exclude. 
If you supply a Rule.exclude option, you can not also suplly a Rule.resource. See Rule.resource and Conditionn.exclude for details.

## Rule.include

Rule.include is a shortcut to Rule.resource.include.
If you supply a Rule.include option, you can not also supply a Rule.resource. 

See Rule.resource and Condition.include for details.

## Rule.issuer

A condition to match agait the module that issued the request. In the following example, the issuer for the a.js request would be the path to the index.js file.

index.js

``` js
import A from './a.js';
```

This option can be used to apply loaders to the dependencies of a specific module or set of modules.

## Rule.loader

Rule.loader is a shortcut to Rule.use: [ { loader } ].
See Rule.use and UseEntry.loader for details.

## Rule.loaders

Rule.loaders is an alias to Rule.use. See Rule.use for details.

## Rule.oneOf

An array of Rules from which only the first matching Rule is used when the Rule matches.

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf:[
          {
            resourceQuery: /inline/, // foo.css?inline
            use: 'url-loader'
          },
          {
            resourceQuery: /external/, // foo.css?external
            use: 'file-loader'
          }
        ]
      }
    ]
  }
};
```

## Rule.options / Rule.query

Rule.options and Rule.query are shortcuts to Rule.use: [ { options } ]. See Rule.use and UseEntry.options for details.

## Rule.parser

An object with parser options. All applied parser options are merged.

Parsers may inspect these options and disable or reconfigure themselves accordingly. Most of the default plugins interpret the values as follows:

- Setting the option to false disables the parser.

- Setting the option to true or leaving it undefined enables the parser.

However, parser plugins may accept more than just a boolean.
For example, the internal NodeStuffPlugin can object instead of true to add additional options for a particular Rule.

Examples(parser options by the default plugins):

``` js
module.exports = {
  // ...
  module: {
    rules: [
      {
        // ...
        parser: {
          amd: false, // disable AMD
          commonjs: false, // disable CommonJS
          system: false, // disable SystemJS
          harmony: false, // disable ES2015 Harmony import/export
          requireInclude: false, // disable require.include
          requireEnsure: false, // disable require.ensure
          requireContext: false, // disable require.context
          browserify: false, // disable special handling of Browserify bundles
          requireJs: false. // disable requirejs.*
          node: false, // disable dirname, filename, module, require, extensions, require.main, etc.
          node: {...} // reconfigure node layer on module level
        }
      }
    ]
  }
}
```

## Rule.resource

A conditon matched with the resource. 
You can either supply a Rule.resource option or use the shortcut options Rule.test，Rule.exclude，and Rule.include.

## Rule.resourceQuery

A condition matched with the resource query.
This option is used to test against the query section of a request string (i.e. from the question mark onwards). If you were to import Foo from './foo.css?inline', the following condition would match:

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        resourceQuery: /inline/,
        use: 'url-loader'
      }
    ]
  }
};
```

## Rule.rules

An array of Rules that is also used when the Rule matches.

## Rule.sideEffects

bool

Indicate what parts of the module contain side effects.

## Rule.test

Rule.test is a shortcut to Rule.resource.test.
If you supply a Rule.test option, you can not also supply a Rule.resource. See Rule.resource and Condition.test for details.

## Rule.type

string

Possible values: 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 
webassembly/experimental'

Rule.type sets the type for a matching module. This prevent defaultRules and their default importing behaviors from occuring.

For example, if you want to load a .json file through a custom loader, you'd need to set the type to javascript/auto to bypass webpack's built-in json importing. (See v4.0 changelog for more details)

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.json$/,
        type: 'javascript/auto',
        loader: 'custom-json-loader'
      }
    ]
  }
};
```

## Rule.use

[ UseEntry ] function(info)

[ UseEntry ]

Rule.use can be an array of UseEntry which are applied to modules. Each entry specifies a loader to be used.

Passing a string (i.e. use: [ 'style-loader' ]) is a shortcut to the loader property (i.e. use: [ { loader: 'style-loader'} ]).

Loaders can be chained by passing multiple loaders, which will be applied from right to left (last to first configured).

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    rules: [
      {
        // ...
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, 
          {
            loader: 'less-loader',
            options: {
              noIeCompat: true
            }
          }
        ]
      }
    ]
  }
};
```

function(info)

Rule.use can also be a function which receives the object argument describing the module being loaded, and must return an array of UseEntry items.

The info object parameter has the following fields:

- compiler: The current webpack compiler (can be undefined).

- issuer: The path to the module that is importing the module being loaded.

- realResource: Always the path to the module being loaded.

- resource: The path to the module being loaded, it is usually equal to realResource except when the resource name is overwritten via !=! in request string.

The same shortcut as an array can be used for the return value(i.e. use: [ 'style-loader' ]).

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    rules: [
      use: (info) => ([
        {
          loader: 'custom-svg-loader'
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [{
              cleanupIds: {
                prefix: basename(info.resource)
              }
            }]
          }
        }
      ])
    ]
  }
};
```

## Condition

Conditions can be one of these:

- A string: To match the input must start with the provided string. I.e. an absolute directory path, or absolute path to the file.

- A RegExp: It's tested with the input.

- A function: It's called with the input and must return a truthy value to match.

- An array of Conditions: At least one of the Conditions must match.

- An object: All properties must match. Each property has a defined behavior.

{ test: Condition }: The Condition must match. The convention is to provide a RegExp or array of RegExps here, but it's not enforced.

{ include: Condition }: The Condition must match. The convention is to provide a string or array of strings here, but it's not enforced.

{ exclude: Condition }: The Condition must NOT match. The conbention is to provide a string or array of strings here, but it's not enforced.

{ and: [ Condition ]}: All conditions must match.

{ or: [ Condition ]}: Any condition must match.

{ not: [ Condition ]}: All conditions must NOT match.

Example:

``` js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'app/styles'),
          path.resolve(__dirname, 'vendor/styles')
        ]
      }
    ]
  }
};
```

## UseEntry

object function(info)

object

It must have loader property being a string.
It is resolved relative to the configuration context with the loader resolving options (resolveLoader).

It can have an options property being a string or object. This value is passed to the loader, which should interpret it as loader options.

For compatibility a query property is also possible, which is an alias for the options property. Use the options property instead.

Note that webpack needs to generate a unique module identifier from the resource and all loaders including options. It tries to do this with a JSON.stringify of the options object. This is fine in 99.9% of cases, but may be not unique if you apply the same loaders with different options to the resource and the options have some stringified values.

It also breaks if the options object cannot be stringified (i.e. circular JSON). Because of this you can have a ident property in the options object which is used as unique identifier.

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    rules: [
      {
        loader: 'css-loader',
        options:  {
          module: true
        }
      }
    ]
  }
};
```

## Module Contexts

Avoid using these options as they are deprecated and will soon be removed.

These options describe the default settings for the context created when a dynamic dependency is encountered.

Example for an unknow dynamic dependency: require.

Example for an expr dynamic dependency: require(expr).

Example for an wrapped dynamic dependency: require('./templates/' + expr).

Here are the available options with their defaults:

webpack.config.js

``` js
module.exports = {
  // ...
  module: {
    exprContextCritical: true,
    exprContextRecursive: true,
    exprContextRegExp: false,
    exprContextRequest: '.',
    unknowContextCritical: true,
    unknowContextRecursive: true,
    unknowCOntextRegExp: false,
    unknowContextRequest: '.',
    wrappedContextCritical: false,
    wrappedContextRecursive: true,
    wrappedContextRegExp: /.*/,
    strictExportPresence: false // since webpack 2.3.0
  }
};
```

You can use the ContextReplacementPlugin to modify these values for individual dependencies. This also removes the warning.

A few use cases:

- Warn for dynamic dependencies: wrappedContextCritical: true.

- require(expr) should include the whole directory:  exprContextRegExp: /^\.\//

- require('./templates/' +expr) should not include subdirectories by default: wrappedContextRecursive: false

- strictExportPresence makes missing exports an error instead of warning.