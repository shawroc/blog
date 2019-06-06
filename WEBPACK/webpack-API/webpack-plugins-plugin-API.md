# Plugin API

Plugins are a key piece of the webpack ecosystem and provide the community with a powerful way to tap into webpack's compilation process. 
A plugin is able to hook into key events that are fired throughout each compilation. Every step of the way, the plugin will have full access to the compiler and, when applicable, the current compilation.

Let's start by going over tapable utility, which provides the backbone of webpack's plugin interface.

## Tapable

This small library is a core utility in webpack but can also used elsewhere to provide a similar plugin interface.

Many objects in webpack extend the Tapable class. 
The class exposes tap, tapAsync, and tapPromise methods which plugins can use to inject custom build steps that will be fired througout a compilation.

Please see the documentation to learn more.
An understanding of the three tap methods, as well as the hooks that provide them is crucial.
The objects that extend Tapable (e.g. the compiler), the hooks they provide, and each hook's type (e.g. the SyncHook ) will be noted.

## Plugin Types

Depending on the hooks used and tap methods applied, plugins can function in a different number of ways.

The way this works is closely related to the hooks provided by Tapable. The compiler hooks each note the underlying Tapable hook indicating which tap methods are available.

So depending on which event you tap into, the plugin may run differently.

For example, when hooking into the compile stage, only the synchronous tap method can be used:

``` js
compiler.hooks.compile.tap('MyPlugin', parameters => {
  console.log('Synchronously tapping the compile hook.');
});
```

However, for run which utilizes the AsyncHook, we can utilize tapAsync or tapPromise ( as well as tap):

``` js
compiler.hooks.run.tapAsync('MyPlugin', (source, target, routesList, callback) => {
  console.log('Asynchronously tapping the run hook.');
});

compiler.hooks.run.tapPromise('MyPlugin', (source, target, routersList) => {
  return new Promise(resolve => setTimeout(resolve, 1000)).then( () => {
    console.log('Asynchronously tapping the run hook with a delay.');
  });
});

compiler.hooks.run.tapPromise('MyPlugin', async (source, target, routesList) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Asynchronously tapping the run hook with a delay.');
});
```

The moral of the story is that there are a variety of ways to hook into the compiler, each one allowing your plugin to run as it sees fit.

## Custom Hooks

In order to add a new hook to the compilation for other plugins to tap into, simply require the neccessary hook class from tapable and create one:

``` js
const SyncHook = require('tapable').SyncHook;

// Within the 'apply' method ...

if (compiler.hooks.myCustomHook) throw new Error('Already in use');
compiler.hooks.myCustomHook = new SyncHook(['a','b','c']);

// Wherever/ whenever you'd like to trigger the hook ...
compiler.hooks.myCustomHook.call(a,b,c);
```

Again, see the documentation for tapable to learn more about the different hook classes and how they work.

## Reporting Progress

Plugins can report progress via ProgressPlugin, which prints progress messages to stderr by default. In order to enable progress reporting, pass a --progress argument when running the webpack CLI.

It is possible to customize the printed output by passing different arguments to the reportProgress function of ProgressPlugin.

To report progress, a plugin must tap into a hook using the context: true option:

``` js
compiler.hooks.emit.tapAsync({
  name: 'MyPlugin',
  context: true  
}, (context, compiler, callback) => {
  const reportProgress = context && context.reportProgress;
  if(reportProgress) reportProgress(0.95, 'Starting work');
  setTimeoout(() => {
    if(reportProgress) reportProgress(0.95, 'Done work');
    callback();
  }, 1000);
});
```

The reportProgress function may be called with these arguments:

``` js
reportProgress(percentage, ...args);
```

- percentage:  This argument is unused; instead, ProgressPlugin will calculate a percentage based on the current hook.

- ...args: Any number of strings, which will be passed to the ProgressPlugin handler to be reported to the user.

Note that only a subset of compiler and compilation hooks support the reportProgress function.

See ProgressPlugin for a full list.