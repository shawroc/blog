# The Manifest

In a typical application or site built with webpack, there are three main types of code: 

1. The source code you, and maybe your team, have written.
2. Any third-party library or "vendor" code your source is dependent on.
3. A webpack runtime and manifest that conducts the interaction of all modules.

This article will focus on the last of these three parts, the runtime and in particular the manifest.

## Runtime

The runtime, along with the manifest data, is basically all the code webpack needs to connect your modularized application while it's running in the browser.

It contains the loading and resolving logic needed to connect your modules as they interact. This includes connecting modules that have already been loaded into the browser as well as logic to lazy-load the ones that haven't.

## Manifest

Once your application hits the browser in the form of index.html file, some bundles and a variety of other assets required by your application must be loaded and linked somehow.

That /src directory you meticulously laid out is now bundled, minified and maybe even split into smaller chunks for lazy-loading by webpack's optimization.

So how does webpack manage the interaction between all of your required modules? This is where the manifest data comes in...

