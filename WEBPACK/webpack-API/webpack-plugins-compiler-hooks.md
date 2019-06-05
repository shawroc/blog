# webpack-plugins-compiler-hooks

## Compiler Hooks

The Compiler module is the main engine that creates a compilation instance with all the options passed through the CLI or Node API. It extends the Tapable class in order to register and call plugins. Most user facing plugins are first registered on the Compiler.

``` md
This module is exposed as webpack.Compiler and can be used directly.
```

When developing a plugin for webpack, you might want to know where each hook is called. To learn this, search for hooks.< hook name >.call across the webpack source.

##  Watching

The compiler supports watching which monitors the file system and recompiles as files change.

When in watch mode, the compiler will emit the additional events such as watchRun, watchClose, and invalid.

This is typically used in development, usually under the hood of tools like webpack-dev-serve, so that the developer doesn't need to re-compile manually every time. Watch mode can also be entered via the CLI.

## Hooks

The following lifecycle hooks are exposed by the compiler and can be accessed as such:

``` js
compiler.hooks.someHook.tap('MyPlugin', (params) => {
  /* ... */
});
```

Depending on the hook type, tapAsync and tapPromise may also be available.

For the description of hook types, see the Tapable docs.

