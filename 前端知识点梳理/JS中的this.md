# JS中的this

首先要从函数的调用讲起

JS（ES5）里面有三种函数调用形式：

```
func(p1,p2);
obj.property.method(p1,p2);
func.call(context, p1,p2);
```

一般我们都知道前两种弄形式，而且认为前两种形式优于第三种形式。

其实第三种调用形式，才是正常调用形式：

```
func.call(context, p1, p2);
```

其他两种都是语法糖，可以等价地变为call形式：

```
func(p1,p2); //等价于
func.call(undefined, p1,p2);

obj.child.method(p1,p2); //等价于
obj.child.method.call(obj.child, p1, p2);
```

函数调用只有一种形式：

```
func.call(conext,p1,p2);
```

this就好解释了。

**this，就是上面代码中的context。就这么简单。**

this是你call一个函数时传的context，由于你从来不用call形式的函数调用，所以你一直不知道。

先看func(p1,p2)中的this如何确定

```
function func() {
    console.log(this);
}    

func();
```

等价于

```
function func() {
    console.log(this);
}

func.call(undefined); //可以简写为func.call()
```

按理说打印出来的this应该就是undefined了吧，但是浏览器里有一条规则:

**如果你传的context是null或undefined，那么window对象就是默认的context（严格模式下默认context是undefined）。**


因此上面的打印结果是window。

如果你希望这里的this不是window，很简单：

```
func.call(obj); //那么里面的this就是obj对象了。
```

**再看obj.property.method(p1,p2)的this如何确定。**

```
var obj = {
    foo: function(){
        console.log(this);
    }
}

obj.foo();
```

转换代码

```
obj.foo.call(obj);
```

this就是obj。

看一个经典题目

```
var obj = {
    foo: function(){
        console.log(this);
    }
}

var bar = obj.foo;
obj.foo();
bar();

//bar = function(){console.log(this)};
//bar.call(); 
//没有指定context，所以this指向window

//obj.foo();
//obj.foo.call(obj); 
//this就是obj
```

**[]语法**

```
function fn() {console.log(this);}
var arr =[fn];

arr[0]()//这里面的this又是什么呢？
```

转化

```
arr[0].call(arr); //那么里面的this就是arr了。
```

总结

1. this就是你call一个函数时，传入的第一个参数。
2. 如果你的函数调用形式不是call形式，请按照\[转换代码]为call形式。






