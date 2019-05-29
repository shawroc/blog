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
---

## 3. 实例方法：codePointAt()

JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为 2 个字节。对于那些需要 4 个字节储存的字符（Unicode 码点大于 0xFFFF 的字符），JavaScript 会认为它们是两个字符。

``` js
var s = "𠮷";

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```

上面代码中，汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是 0x20BB7，UTF-16 编码为 0xD842 0xDFB7（十进制为 55362 57271），需要 4 个字节储存。对于这种 4 个字节的字符，JavaScript 不能正确处理，字符串长度会误判为 2，而且 charAt()方法无法读取整个字符，charCodeAt()方法只能分别返回前两个字节和后两个字节的值。

ES6 提供了 codePointAt()方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。

``` js
let s = '𠮷a';

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```

上面代码中，汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是 0x20BB7，UTF-16 编码为 0xD842 0xDFB7（十进制为 55362 57271），需要 4 个字节储存。对于这种 4 个字节的字符，JavaScript 不能正确处理，字符串长度会误判为 2，而且 charAt()方法无法读取整个字符，charCodeAt()方法只能分别返回前两个字节和后两个字节的值。

codePointAt() 方法的参数，是字符在字符串中的位置（从 0 开始）。上面代码中，JavaScript 将“𠮷a”视为三个字符，codePointAt 方法在第一个字符上，正确地识别了“𠮷”，返回了它的十进制码点 134071（即十六进制的 20BB7）。在第二个字符（即“𠮷”的后两个字节）和第三个字符“a”上，codePointAt()方法的结果与 charCodeAt()方法相同。

codePointAt() 方法返回的是码点的十进制值，如果想要十六进制的值，可以使用 toString()方法转换一下。

``` js
let s = '𠮷a';

s.codePointAt(0).toString(16) // "20bb7"
s.codePointAt(2).toString(16) // "61"
```

你可能注意到了，codePointAt()方法的参数，仍然是不正确的。比如，上面代码中，字符 a 在字符串 s 的正确位置序号应该是 1，但是必须向 codePointAt()方法传入 2。解决这个问题的一个办法是使用 for...of 循环，因为它会正确识别 32 位的 UTF-16 字符。

``` js
let s = '𠮷a';
for(let char of s) {
  console.log(char.codeAtPoint(0).toString(16));
}
// 20bb7
// 61
```

另一种方法也可以，使用扩展运算符（...）进行展开运算。

``` js
let arr = [...'𠮷a']; // arr.length === 2
arr.forEach(
  char => console.log(char.codePointAt(0).toString(16))
);
```

codePointAt() 方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。

``` js
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}

is32Bit("𠮷") // true
is32Bit("a") // false
```
---

## 4. 实例方法：normalize()

许多欧洲语言有语调符号和重音符号。为了表示它们，Unicode 提供了两种方法。

一种是直接提供带重音符号的字符，比如Ǒ（\u01D1）。另一种是提供合成符号（combining character），即原字符与重音符号的合成，两个字符合成一个字符，比如 O（\u004F）和 ˇ（\u030C）合成 Ǒ（\u004F\u030C）。

这两种表示方法，在视觉和语义上都等价，但是 JavaScript 不能识别。

``` js
'\u01D1' === '\u004F\u030C' // false

'\u01D1'.length // 1
'\u004F\u030C'.length // 2
```

上面代码表示，JavaScript 将合成字符视为两个字符，导致两种表示方法不相等。

ES6 提供字符串实例的 normalize()方法，用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。

``` js
'\u01D1'.normalize() === '\u004F\u030C'.normalize()
// true
```

ES6 提供字符串实例的 normalize()方法，用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。

- NFC，默认参数，表示“标准等价合成”（Normalization Form Canonical Composition），返回多个简单字符的合成字符。所谓“标准等价”指的是视觉和语义上的等价。
- NFD，表示“标准等价分解”（Normalization Form Canonical Decomposition），即在标准等价的前提下，返回合成字符分解的多个简单字符。
- NFKC，表示“兼容等价合成”（Normalization Form Compatibility Composition），返回合成字符。所谓“兼容等价”指的是语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”。（这只是用来举例，normalize 
- NFKD，表示“兼容等价分解”（Normalization Form Compatibility Decomposition），即在兼容等价的前提下，返回合成字符分解的多个简单字符。

``` js
'\u004F\u030C'.normalize('NFC').length // 1
'\u004F\u030C'.mormalize('NFD').length // 2
```

上面代码表示，NFC 参数返回字符的合成形式，NFD 参数返回字符的分解形式。

不过，normalize 方法目前不能识别三个或三个以上字符的合成。这种情况下，还是只能使用正则表达式，通过 Unicode 编号区间判断。

--- 

## 5. 实例方法：includes(), startsWith(), endsWith()

传统上，JavaScript 只有 indexOf 方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法。

- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

``` js
let s = 'Hello world';

s.startsWith('Hello') // true
s.endsWith('!'); // true
s.includes('o'); // true
```

这三个方法都支持第二个参数，表示开始搜索的位置。

``` js
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```

上面代码表示，使用第二个参数 n 时，endsWith 的行为与其他两个方法有所不同。它针对前 n 个字符，而其他两个方法针对从第 n 个位置直到字符串结束。

--- 

## 6. 实例方法： repeat()

repeat 方法返回一个新字符串，表示将原字符串重复 n 词。

``` js
'x'.repeat(3); // 'xxx'
'hello'.repeat(2); // "hellohello"
'na'.repeat(0); // ""
```

参数如果是小数，会被取整。

``` js
'na'.repeat(2.9) // "nana"   Math.floor(2.9) ==> 2
```

但是，如果参数是 0 到 -1 之间的小数，则等同于 0，这是因为会先进行取整运算。 0 到 -1 之间的小数， 取整以后等于 -0， repeat 视同为 0。

``` js
'na'.repeat(-0.9) // ""
```

参数 NaN 等同于 0。

``` js
'na'.repeat(NaN) // ""
```

如果 repeat 的参数是字符串，则会先转换成数字。

``` js
'na'.repeat('na'); // ""
'na'.repeat('3'); // "nanana"
```

---

## 7. 实例方法： padStart(), padEnd()

ES2017 引入了字符串补全长度的功能。
如果某个字符串不够指定长度，会在头部或尾部补全。
padStart() 用于头部补全， padEnd() 用于尾部补全。

``` js
'x'.padStart(5, 'ab'); // "ababx"
'x'.padStart(4, 'ab'); // "abax";

'x'.padEnd(5, 'ab'); // "xabab"
'x'.padEnd(4, 'ab'); // "xaba"
```

上面代码中，padStart() 和 padEnd() 一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。

如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。

``` js
'xxx'.padStart(2, 'ab'); // "xxx"
'xxx'.padEnd(2, 'ab'); // "xxx"
```

如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。

``` js
'abc'.padStart(10, '0123456789'); 
// '0123456abc'
```

如果省略第二个参数，默认使用空格补全长度。

``` js
'x'.padStart(4); // "   x"
'x'.padEnd(4); // "x   "
```

padStart() 的常见用途是为数值补全指定位数。下面代码生成 10 位的数值字符串。

``` js
'1'.padStart(10, '0'); //  "0000000001"
'2'.padStart(10, '0'); //  "0000000012"
'123456'.padStart(10, '0'); // "0000123456"
```

另一个用途是提示字符串格式。

``` js
'12'.padStart(10, 'YYYY-MM-DD'); // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD'); // "YYYY-09-12"
```

---

## 8. 实例方法: trimStart(), trimEnd()

ES