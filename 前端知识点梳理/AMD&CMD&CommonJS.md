# AMD 与 CMD 规范

先看一段代码

```js
var modal = require('modal');
$btn.on('click', function(){
  modal.open();
});
```

上面的代码是个简单的示意，使用 require 加载 modal 组件，当用户点击按钮的时候打开弹窗。

如何实现呢？

## 相关概念

1. CommonJS 规范
2. AMD 规范
3. CMD 规范

### AMD 规范

AMD (Asynchronous Module Definition，异步模块定义) 指的是一种机制，在该机制下模块和依赖可以异步加载。

这对浏览器端的异步加载尤其适用。

#### 语法

```js

define(id?, dependencies?, factory);

```

- id: 定义中模块的名字，可选；如果没有提供该参数，模块的名字应该默认为模块加载器请求的指定脚本的名字。

- dependencies: 是一个当前模块依赖的，已被模块定义的模块标识的数组字面量。 依赖参数是可选的，如果忽略此参数，它应该默认为 [ "require" , "exports", "module"]。然而，如果工厂方法的长度属性小于 3，加载器会选择以函数的长度属性指定的参数个数调用工厂方法。

- 工厂方法 factory，模块初始化要执行的函数或对象。如果为函数，它应该只被执行一次。如果是对象，此对象应该为模块的输出值。

示例：

```js
define('modal', ['jQuery','dialog'], function($, Dialog){
  $('.modal').show();
  Dialog.open();
});
```

实现 AMD 的库有 'RequireJS'、'curl'、'Dojo' 等。

###  CommonJS 规范

CommonJS 是服务器端模块的规范，Node.js 采用了这个规范。
NodeJS 首先采用了 js 模块化的概念。

1. 在一个模块中，存在一个自由的变量 "require"，它是一个函数。
    - 这个 "require" 函数接收一个模块标识符。
    - "require" 返回外部模块所输出的 API。

2. 在一个模块中，会存在一个名为 "exports" 的自由变量，它是一个对象，模块可以在执行的时候把自身的 API 加入到其中。

3. 模块必须使用 "exports" 对象来做为输出的唯一表示。

示例：

math.js

```js

exports.add = function() {
  var sum = 0, i = 0, args = arguments, l = args.length;
  while( i < l ) {
    sum += args[i++];
  }
  return sum;
};
```

increment.js

```js
var add = require('math').add;
exports.increment = function(val) {
  return add(val, 1);
}

```

programs.js

```js

var inc = require('increment').increment;
var a = 1;
inc(a);
//2

```

### CMD 规范

CMD (Common Module Definition) 是 SeaJS 推广过程中产生的。

```js
(function (name, definition, context) {
    if (typeof module != 'undefined' && module.exports) {
        // 在 CMD 规范下 (node)
        module.exports = definition();
    } else if (typeof context['define'] == 'function' && (context['define']['amd'] || context['define']['cmd'])  ) {
        //在 AMD 规范下(RequireJS) 或者 CMD 规范下(SeaJS)
        define(definition);
    } else {
        //在浏览器环境下
        context[name] = definition();
    }
})('sample', function () {

    var sample = (function () {
        "use strict";

        var a = 1;

        function inc(){
            a++;
        }

        function get(){
            return a;
        }

        return {
            inc: inc,
            get: get
        }

    })();

    return sample;

}, this);
```