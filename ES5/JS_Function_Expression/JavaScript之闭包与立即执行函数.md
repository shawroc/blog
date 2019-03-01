# 闭包与立即执行函数

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

作用域链的这种配置机制引出了一个值得注意的副作用，即闭包只能取得包含任何变量的最后一个值。

```

function createArray(){

    var result = new Array();

    for(var i = 0; i < 10; i++) {
        result[i] = function() {
            return i;
        }
    }

    return result;
}

```

这个函数会返回一个函数数组。表面上看，似乎每个函数都应该返回自己的索引值，即位置0的函数返回0，位置1的函数返回1， 以此类推。

但实际上，每个函数都返回10，因为每个函数的作用域中都保存着createArray的活动对象，所以他们引用的都是同一个变量i。

当createArray()函数返回后，变量i的值是10，此时每个函数都引用着同一个变量i，所以i的值是10。

```
// 代码执行过程

createArray();

/*
createArray() {
    var result = new Array();

    var i; // 0,1,2,3,4,5,6,7,8,9,10

    for ( i = 0; i < 10 ; i ++) {
        result[i] = function() {
            return i; 
            // 注意 函数的执行时机，你只有调用函数的时候，才会产生执行环境，沿着作用域链，找到活动对象
            // 这里有个闭包，还记得闭包的概念吗？ 有权访问到另外一个函数作用域的变量的函数
        }
    }
    
    /*
    result[0] = function(){
        return i
    }
    result[1] = function(){
        return i
    }
    result[2] = function(){
        return i
    }
    ....
    */
    return result;
}

result = [function(){return i}, function(){return i}....];

*/

createArray()[1](); // 10
```

那么如何让这个函数的行为符合我们的预期呢？

可以通过创建另一个匿名函数强制让闭包的行为符合预期，这里也应用了立即执行函数。

```
//立即执行函数
//我们平时写函数然后调用是这么写的。
//声明函数，调用执行。

function foo(){
    console.log("hi");
}

foo(); // "hi"

//那么，我们可不可以声明调用写一块呢？ 这就是申明函数立刻执行。
//好像不可以，控制台报错

function foo(){
    console.log("hi");
}(); //Uncaught SyntaxError: Unexpected token )


//那么如果用括号包裹呢？

(function foo(){
    console.log("hi");
}()); // "hi"， 可以了。 这就是立即执行函数！ 

```

有了立即执行函数，就可以强制让闭包的行为符合我们的预期了。

```

//改写代码

function createArray() {

    var result = new Array();

    for( var i = 0; i < 10; i ++ ) {
        result[i] = (function(i) { 
            return function(){
                return i;
            }
        }(i));
    }

    return result;

}

createArray()[0](); // 0
createArray()[1](); // 1
createArray()[2](); // 2 

// 这里不只有一种方法，其他方法在此不表。

```

