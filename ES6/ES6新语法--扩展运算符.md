# ES6新语法-扩展运算符

JavaScript是ECMAScript的实现和扩展，ES6标准的制定也为JavaScript加入了许多新特性。

展开运算符(spread operator) 允许一个表达式在某处展开。

展开运算符在多个参数（用于函数调用）或多个元素（用于数组字面量）或者多个变量（用于解构赋值）的地方可以使用。

展开运算符不能用在对象当中，因为目前展开运算符只能在可遍历对象（iterables)可用。
iterables的实现是依靠Symbol.iterator函数，而目前只有Array,Set,String内置\[Symbol.iterator\]方法，而Object尚未内置该方法，因此无法使用展开运算符。

不过ES7草案当中已经加入了对象展开运算符特性。

## 函数调用中使用展开运算符

在以前我们会使用apply方法来将一个数组展开成多个参数：

```
function test (a,b,c) {}
var args = [0,1,2];
test.apply(null, args);
```

如上我们把args数组当作实参传递给了a,b,c，这边正式利用了Function.prototype.apply的特性。

不过有了ES6，我们就可以更加简洁地来传递数组参数：

```
function test(a,b,c) {}

var args = [0,1,2];

test(...args);
```

我们使用...展开运算符就可以把args直接传递给test()函数。

## 数组字面量中使用展开运算符

在ES6的世界中，我们可以直接加一个数组直接合并到另外一个数组当中：

```
var arr1 = ['a', 'b', 'c'];

var arr2 = [...arr1, 'd', 'e']; // ['a','b','c','d','e']
```

展开运算符也可以用在push函数中，可以不用再用apply()函数来合并两个数组：

```
var arr1 = ['a','b','c'];
var arr2 = ['d','e'];
arr1.push(...arr2); 

console.log(arr1); //['a','b','c','d','e']
```

## 用于解构赋值

解构赋值也是ES6中的一个特性，而这个展开运算符可以用于部分场景：

```
let [arg1, arg2, ...arg3] = [1,2,3,4];

console.log(arg1); //1
console.log(arg2); //2
console.log(arg3); //[3,4]
```

不过要注意，解构赋值中展开运算符只能用在最后:

```
let [arg1,...arg2,arg3] = [1, 2, 3, 4]; //报错
```

## 类数组对象变成数组

展开运算符可以将一个类数组对象变成一个真正的数组对象:

```
var list = document.getElementsByTagName('div');
var arr = [...list]; 
```

list是类数组对象，而我们通过使用展开运算符使之变成了数组。

## ES7草案中的对象展开运算符

ES7中的对象展开运算符可以让我们更快捷地操作对象：

```
let {x,y,...z} = {x:1,y:2,a:3, b:4};

console.log(x); //1
console.log(y)l //2
console.log(z); //{a:3,b:4}
```

另外还有很多用处，比如可以合并两个对象:

```
let a = {x:1, y:2};
let b = {z:3};
let ab = {...a, ...b};

console.log(ab); //{x:1, y:2, z:3}
```

