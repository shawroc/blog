# Command Line Interface

For proper usage and easy distribution of this configuration, webpack can be configured with webpack.config.js. Any parameters sent to the CLI will map to a corresponding parameter in the config file.

Read the installation guide if you don't already have webpack and CLI installed.

## Usage with config file

``` js
webpack [--config webpack.config.js]
```

## Usage without config file

``` js
webpack <entry> [<entry>] -o <output>
```

<entry>

A filename or a set of named filenames which act as the entry point to build your project. 
You can pass multiple entries(every entry is loaded on startup).
If yoou pass a pair in the form <name>=<request> you can create an additional entry point.
It will be mapped to the configuration option entry.

<output>

A path and filename for the bundled file to be saved in.
It will be mapped to the configuration options output.path and output.filename.

Example

If your project structure is as follows -

``` js
.
|- dist
|- index.html
|- src
  |- index.js
  |- index2.js
  |- others.js
```

``` js
webpack src/index.js -o disst/bundle.js
```

This will bundle your source code with entry as index.js and the output bundle file will have a path of dist and the filename will be bundle.js

``` js
| Asset | Size | Chunks | Chunk Names |
|-------|------|--------|-------------|
|bundle.js| 1.54 kB| 0 [emitted] | index |
[0] ./src/index.js 51 bytes {0} [built]
[1] ./src/others.js 29 bytes {0} [built]
```

``` js
webpack index=./src/index.js entry2=./src/index2.js dist/bundle.js
```

``` js
	| Asset     | Size    | Chunks        | Chunk Names   |
	|-----------|---------|---------------|---------------|
	| bundle.js | 1.55 kB | 0,1 [emitted] | index, entry2 |
	[0] ./src/index.js 51 bytes {0} [built]
	[0] ./src/index2.js 54 bytes {1} [built]
	[1] ./src/others.js 29 bytes {0} {1} [built]
```

## Common Options

List all of the options available on the cli

``` js
webpack --help
webpack -h
```

Build source using config file

Specifies a different configuration file to pick up. Use this if you want to specify something different from webpack.config.js, which is the default.

``` js
webpack --config example.config.js
```

Print result of webpack as JSON

``` js
webpack --json
webpack --json > stats.json
```

In every other case, webpack prints out a set of stats showing bundle, chunk and timing details. Using this option the output can be a JSON object. 
This response is accepted by webpack's analyse tool, or chrisbateman's webpack-visualizer, or th0r's webpack-bundle-analyzer. The analyse tool will take in the JSON and provide all the details of the build in graphical form.

## Environment Options

When the webpack configuration exports a function, an "environment" may be passed to it.

``` js
webpack --env.production    # sets env.production == true
webpack --env.platform=web  # sets env.platform == "web"
```

## Example Usage

``` js
webpack index=./src/index.js index2=./src/index.js --output-path='./dist' --output-filename='[name][hash].bundle.js'

| Asset    | Size    | Chunks      | Chunk Names   |
|----------|---------|-------------|---------------|
| index2740fdca26e9348bedbec.bundle.js |  2.6 kB | 0 [emitted] | index2        |
| index740fdca26e9348bedbec.bundle.js  | 2.59 kB | 1 [emitted] | index         |
	[0] ./src/others.js 29 bytes {0} {1} [built]
	[1] ./src/index.js 51 bytes {1} [built]
	[2] ./src/index2.js 54 bytes {0} [built]
```

``` js
webpack.js index=./src/index.js index2=./src/index2.js --output-path='./dist' --output-filename='[name][hash].bundle.js' --devtool source-map  --output-source-map-filename='[name]123.map'

| Asset | Size    | Chunks      | Chunk Names   |
|-------|---------|-------------|---------------|
| index2740fdca26e9348bedbec.bundle.js | 2.76 kB | 0 [emitted] | index2        |
|  index740fdca26e9348bedbec.bundle.js | 2.74 kB | 1 [emitted] | index         |
|  index2123.map | 2.95 kB | 0 [emitted] | index2 |
|  index123.map | 2.95 kB | 1 [emitted] | index |
	[0] ./src/others.js 29 bytes {0} {1} [built]
	[1] ./src/index.js 51 bytes {1} [built]
	[2] ./src/index2.js 54 bytes {0} [built]
```

## Profiling

The --profile option captures times information for each step of the compilation and includes this in the output.

``` js
webpack --profile

.
.
.
[0] ./src/index.js 90 bytes {0} [built]
 factory: 22ms building: 16ms = 38ms
```

For each module, the following details are included in the output as applicable:

- factory: time to collect module metadata (e.g. resolving the filename)
- building: time to build the module (e.g. loaders and parsing)
- dependencies: time to identify and connect the module’s dependencies

Paired with --progress, --profile gives you an in-depth idea of which step in the compilation is taking how long. This can help you optimise your build in a more informed manner.

``` js
webpack --progress --profile

30ms building modules
1ms sealing
1ms optimizing
0ms basic module optimization
1ms module optimization
1ms advanced module optimization
0ms basic chunk optimization
0ms chunk optimization
1ms advanced chunk optimization
0ms module and chunk tree optimization
1ms module reviving
0ms module order optimization
1ms module id optimization
1ms chunk reviving
0ms chunk order optimization
1ms chunk id optimization
10ms hashing
0ms module assets processing
13ms chunk assets processing
1ms additional chunk assets processing
0ms recording
0ms additional asset processing
26ms chunk asset optimization
1ms asset optimization
6ms emitting
⋮
```