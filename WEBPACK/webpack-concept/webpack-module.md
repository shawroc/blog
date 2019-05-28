# Modules

In modular programming, developers break programs up into discrete chunks of functionality called a module.

Each module has a smaller surface area than a full program, making verification, debugging, and testing trivial.

Well-written modules provide solid abstractions and encapsulation boundaries, so that each module has a coherent design and a clear purpose within the overall application.

Node.js has supported modular programming alomost since its inception. On the web, however, support for modules has been slow to arrive. Multiple tools exist that support modular JavaScript on the web, with a variety of benefits and limitations. webpack builds on lessons learned from these systems and applies the concept of modules to any file in your project.

## What is a webpack Module

In contrast to Node.js modules, webpack modules can express their dependencies in a variety of ways.

A few examples are:

- An ES2015 import statement
- A commonJS require() statement
- An AMD define and require statement
- An @import statement inside of a css/sass/less file.
- An image urll in a stylesheet(url(...)) or html ( < img src=... >) file.

``` md
webpack 1 requires a specific loader to convert ES2015 import, however this is possible out of the box via webpack 2.
```

## Supported Module Types

webpack supports modules written in a varity of languages and preprocessors, via loaders.

Loaders describe to webpack how to process non-JavaScript modules and include these dependencies into your bundles.

The webpack community has built loaders for a wide variety of popular languages and language processors, including:

- CoffeeScript
- TypeScript
- ESNext (Babel)
- Sass
- Less
- Stylus

And many others! 
Overall, webpack provides a powerful and rich API for customization that allows one to use webpack for any stack, while staying non-opinionated about your development, testing, and production workflows.

## Module Resolution

A resolver is a library which helps in locating a module by its absolute path. A module can be required as a dependency from another module as: 

``` js
import foo from 'path/to/module';
// or
require('path/to/module');
```

The dependency module can be from the application code or a third party library. The resolver helps webpack find the module code that needs to be included in the bundle for every such require/import statment. webpack uses enhanced-resolve to resolve file paths while bundling modules.

### Resolving rules in webpack

Using enhanced-resolve, webpack can resolve three kinds of file paths:

#### Absolute paths

``` js
import '/home/me/file';
import 'C:\\Users\\me\\file';
```

Since we already have the absolute path to the file, no further resolution is required.

#### Relative paths

``` js
import '../src/file1';
import './files';
```

In this case, the directory of the resource file where the import or require occurs is taken to be the context directory.

The relative path specified in the import/require is joined to this context path to produce the absolute path to the module.

#### Module paths

``` js
import 'module';
import 'moudle/lib/file';
```

Modules are searched for inside all directories specified in resolve.modules.

You can replace the original module path by an alternate path by creating an alias for it using resolve.alias configuration option.

Once the path is resolved based on the above rulle, the resolver checks to see if the path points too a file or a directory.

If the path points to a file:

- If the path has a file extension,then the file is bundled straightaway.
- Otherwise, the file extension is resolved using the **resolve.extensions** option, which tells the resolver which extensions (eg- .js, .jsx) are acceptable for resolution.

If the path points to a folder, then the following steps are taken to find the right file with the right extension:

- If the folder contains a package.json file, then fields specified in the resolve.mainFields configuration option are looked up in order,and the fist such field in package.json determines the file path.

- If there is no package.json or if the main fields do not return a valid path, file names specified in the resolve.mainFiles configuration option are looked for in order, to see if a matching filenames exists in the imported/required directory.

- The file extension is then resolved in a similar way using the resolve.extensions option.

webpack provides resonable defaults for these options depeding on your build target.

### Resolving Loaders

This follows the same rules as those specified for file resolution. But the resolveLoader configuration option can be used to have separate resolutio rule for loaders.

###  Caching 

Every filesystem access is cached, so that multiple parallel or serial requests to the same file occur faster.

In wath mode, only modified files are evicted from the cache.
If watch mode is off, then the cache gets purged befor every comppilation.