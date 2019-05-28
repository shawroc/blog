# Node Interface

webpack provides a Node.js API which can be used directly in Node.js runtime.

The Node.js API is useful in scenarios in which you need to customize the build or development process since all the reporting and error handling must be done manually and webpack only does the compiling part. For this reason the stats configuration options will not have any effect in the webpack() call.

## Installation

To start using webpack Node.js API, first install webpack if you haven't yet:

``` js
npm install --save-dev webpack
```

Then require the webpack module in your Node.js script:

``` js
const webpack = require('webpack');
```

Or if you prefer ES2015:

``` js
import webpack from 'webpack';
```

### webpack()

The imported webpack function is fed a webpack Configuration Object and runs the webpack compiler if a callback function is provided.

``` js
const webpack = require('webpack');

webpack({
  //Configuration Object
}, (err, stats) => {
  if( err || stats.hasErrors()) {
    // Handle errors here
  }
  // Done processing
});
```

### Compiler Instance

If you don't pass the webpack runner function a callback, it will return a webpack Compiler instance.

This instance can be used to manually trigger the webpack runner or have it build and watch for changes, much like CLI. 

The Compiler instance provides the following methods: 

- .run(callback)
- .watch(watchOptions, handler)

Typically, only one master Compiler instance is created, although child compilers can be created in order to delegate specific tasks.

The Compiler is ultimately just a function which performs bare minimum functionality to keep a lifecycle running. It delegates all the loading, bundling, and writing work to registered plugins.

The hooks property on a Compiler instance is used to register a plugin to any hook event in the Compiler's lifecycle. The WebpackOptionsDefaulter and WebpackOptionsApply utilities are used by webpack to configure its Compiler instance with all the built-in plugins.

The run method is then used to kickstart all compilation work.
Upon completion, the given callback function is executed.

The final logging of stats and errors should be done in this callback function.

### Run

Calling the run method on the Complier instance is much like the quick run method mentioned above:

``` js
const webpack = require('webpack');

const compiler = webpack({
  // Configuration Object
});

compiler.run((err, [stats](#stats-object)) => {
  // ...
});
```

### Watching

Calling the watch method triggers webpack runner, but then watches for changes (much like CLI: webpack --watch), as soon as webpack detects a change, runs again. Returns an instance of Watching.

``` js
watch(watchOptions, callback);
```

``` js
const webpack = require('webpack');

const compiler = webpack({
  // Configuration Object
});

const watching = compiler.watch({
  // Example watchOptions
  aggregateTimeout: 300,
  poll: undefined
},(err, stats) => {
  // Stats Object
  // Print watch/build result here...
  console.log(stats);
});
```

Watching options are covered in detail here.

## Close Watching

The watch method returns a Wathcing instance that exposes .close(callback) method. Calling this method will end watching:

``` js
watching.close(() => {
  console.log('Watching Eended.');
});
```

## Invalidate Watching

Using watching.invalidate, you can manually invalidate the current compiling round, without stopping the watch process：

``` js
watching.invalidate();
```

## Stats Object

The stats object that is passed as a second argument of the webpack() callback, is a good source of imforation about the code complilation process.

It includes:

- Errors and Warnings(if any)
- Timings
- Module and Chunk information

The webpack CLI uses this information to display nicely formatted output in your console.

``` md
when using the MultiCompiler, a MultiStats instance is returned that fulfullls the same interface as stats, i.e. the methods described below.
```

This stats object exposes the following methods:

### stats.hasErrors()

Can be used to check if there were errors while compiling. Returns true or false.

### stats.hasWarnings()

Can be used to check if there were warnings while compiling. Return true or false.

### stats.toJson(options)

Returns compilation information as a JSON object. options can be either a string (a preset) or an object for more granular control:

``` js
stats.toJson('minimal'); // more options: 'verbose', etc.
```

``` js
stats.toJson({
  assets: false,
  hash: true
});
```

All available options and presets are described in the stats documentation.

### stats.toString(options)

Returns a formatted string of the compilation information.

Options are the same as stats.toJson(options) with one addition:

``` js
stats.toString({
  // Add console colors
  colors: true
});
```

Here's an example of stats.toString() usage:

``` js
const webpack = require('webpack');

webpack({
  // Configuration Object
}, (err, stats) => {
  if(err) {
    console.error(err);
    return;
  }
  
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));
});
```

## MultiCompiler

The MultiCompiler module allows webpack to run multiple configurations in seperate compilers. If the options parameter in the webpack's NodeJS api is an array of options, webpack applies separate compilers and calls the callack method at the endd of each compiler execution.

``` js
const webpack = require('webpack');

webpack([
  { entry: './index1.js', output: { filename: 'bundle1.js'} },
  { entry: './index2.js', output: { filename: 'bundle2.js'} }
],(err, stats) => {
  process.stdout.write(stats.toString() + '\n');
});
```

## Error Handling

For a good error handling, you need to account for these three types of errors:

- Fatal webpack errors(wrong configuration, etc)
- Compilation errors (missing modules, syntax errors, etc)
- Compilation warnings

Here's an example that does all that:

``` js
const webpack = require('webpack');

webpack({
  // Configuration Object
}, (err, stats) => {
  if (err) {
    console.log(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if(stats.hasErrors()){
    console.error(info.errors);
  }

  if(stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  // Log result
});
```

## Custom File Systems

By default, webpack reads files and writes files to disk using a normal file system. However, it is possible to change the input or output behavior using a differet kind of file system(memory, webDAV, etc).

To accomplish this, one can change the inputFileSystem or outputFileSystem.

For example, you can replace the default outputFileSystem with memory-fs to write files to memory instead of to disk:

``` js
const MemoryFS = require('memory-fs');
const webpack = require('webpack');

const fs = new MemoryFS();
const compiler = webpack({
  // Configuration Options
});

compiler.outputFileSystem = fs;
compiler.run((err, stats) => {
  // Read the output later;
  const content = fs.readFileSync('...');
});
```