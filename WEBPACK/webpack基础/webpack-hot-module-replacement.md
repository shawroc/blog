# Hot Module Replacement

Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload. This can significantly speed up development in a few ways:

- Retain application state which is lost during a full reload.
- Save valuable development time by only updating what's changed.
- Modifications made to CSS/JS in the source code results in an instant browser update which is almost comparable to changing styles directly in the browser's dev tools.

## How It Works

Let's go through some different viewports to understand exactly how HMR works...

### In the Application

The following steps allow modules to be swapped in and out of an application:

1. The application asks the HMR runtime to check for updates.
2. The runtime asynchronously downloads the updates and notifies the application.
3. The application then asks the runtime to apply the updates.
4. The runtime synchronously applies the updates.

You can set up HMR so that this process happens automatically, or you can choose to require users interaction for updates to occur.

### In the compiler

In addition to normal assets, the compiler needs to emit an "update" to allow updating from previous version to the new version. The "update" consists of two parts: 

1. The updated manifest(JSON)
2. One or more updated chunks (JavaScript)

The manifest contains the new compilation hash and a list of all updated chunks. Each of these chunks contains the new code for all updated modules(or a flag indicating that the module was removed).

The compiler ensures that module IDs and chunk IDs are consistent between these builds.

It typically stores these IDs in memory, but it's also possible to store them in a JSON file.

### In a Module

HMR is an opt-in feature that only affects modules containing HMR code.
One example would be patching styling through the sytle-loader.

In order for patching to work, the style-loader implements the HMR interface. When it receives an update through HMR, it replaces the old styles with the new ones.

Similarly, when implementing the HMR interface in a module, you can describe what should happen when the module is updated.

However, in most cases, it's not mandatory to write HMR code in every module.

If a module has no HMR handlers, the update bubbles up. This means that a single handler can update a complete module tree. If a single module from the tree is updated, the entire set of dependencies is reloaded.

### In the Runtime

Here things get a bit more technical...
if you're not interested in the internals, feel free to jump this.

For the module system runtime, additional code is emitted to track module parents and children. On the management side, the runtime supports two methods: check and apply.

A check makes an HTTP request to the update manifest.
If this request fails, there is no update available.

If it succeeds, the list of updated chunks is compared to the list of currently loaded chunks.

For each loaded chunk, the cooresponding update chunk is downloaded. 
All module updates are stored in the runtime.

When all update chunks have been downloaded and are ready to be applied, the runtime switches into the ready state.

The apply method flags all updated modules as invalid.
For each invalid module, there needs to be an update handler in the module or in its parent(s).

Otherwise, the invalid flag bubbles up and invalidates parent(s) as well.
Each buble continues until the app's entry point or a module with an update handler is reached (whichever comes first).

If it bubbles up from an entry point, the process fails.

Afterwards, all invalid modules are disposed (via the dispose handler) and unloaded.
The current hash is then updated and all accept handlers are called.
The runtime switches back to the idle state and everyting continues as normal.