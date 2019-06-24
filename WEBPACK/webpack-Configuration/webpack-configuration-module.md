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
If you supply a Rule.exclude option, you can not also suplly a Rule.resource. See
