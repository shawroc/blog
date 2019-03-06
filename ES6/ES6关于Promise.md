# Promise对象

Promise对象用于表示一个异步操作的最终状态（完成或失败），以及其返回的值。

请看示例代码

```
var promise1 = new Promise(function(resolve,reject){
  setTimeout(function(){
    resolve('foo');
  }, 300);
});

promise1.then(function(value){
  console.log(value);
  //expected output: "foo"
});

console.log(promise1);
```

## 语法

```
new Promise( function(resolve, reject) {...} /* exeutor */);
```

## 参数 executor

executor是带有 resolve 和 reject 两个参数的函数。
Promise构造函数执行时立即调用 executor 函数，resolve和reject 两个函数作为参数传递给 executor （executor 函数在 Promise 构造函数返回新建对象前被调用）。

resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或 rejected（失败）。

executor 内部通常会执行一些异步操作，一旦完成，可以调用resolve函数来将promise状态改成fulfilled， 或者在发生错误时将它的状态改为rejected。

如果在 executor 函数中抛出一个错误，那么该 promise 状态为 rejected/

executor函数的返回值被忽略。

## 描述

Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers)。这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象。

一个Promise有以下几种状态：

- pending：初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected：意味着操作失败。

pending 状态的 Promise 对象可能出发 fulfilled 状态并传递一个值给相应的状态处理方法，也可能触发失败状态（rejected）并传递失败状态。当其中任一种情况出现时，Promise对象的then方法绑定的处理方法（handlers）就会被调用（then方法包含两个参数：onfulfilled和onrejected，它们都是 Function 类型。当Promise状态为fulfilled时，调用 then 的 onfulfilled 方法，当 Promise 状态为 rejected 时，调用 then 的 onrejected 方法，所以在异步操作的完成和绑定处理方法之间不存在竞争。

因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回 promise对象，所以它们可以被链式调用。

```
不要和惰性求值混淆：有一些语言中有惰性求值和延迟计算的特性，它们也被称为 “promises”，例如 Scheme。

Javascript中的promise代表一种已经发生的状态，而且可以通过回调方法链在一起。如果你想要的是表达式的延迟计算，考虑无参数的 “箭头方法”：f = () => 表达式，创建惰性求值的表达式，使用f()求值。

注意：如果一个promise对象处在fullfilled或rejected状态而不是pending状态，那么它也可以被称为settled状态。
你可能也会听到一个术语resolved，它标识promise对象处于fulfilled状态。
```

## 属性

- Promise.length

    length属性，其值总是为1（构造器参数的数目）。

- Promise.prototype

    表示 Promise 构造器的原型。

## 方法

- Promise.all(iterable)

    **这个方法返回一个新的promise对象**，该promise对象在iterable参数对象里所有的promise对象都成功的时候才会出发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。
    
    这个新的promie对象在出发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，**顺序根iterable的顺序保持一致；**

    如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。

    Promise.all方法常被用于处理多个 promise 对象的状态集合。

- Promise.race(iterable)

  当iterable 参数里的任意一个子promise 被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用其父promise绑定的相应句柄，并返回该promise对象。

- Promise.reject(reson)

  返回一个状态为失败的 Promise 对象，并将给定的失败信息传递给对应的处理方法。

- Promise.resolve(value)

  返回一个状态由给定value决定的Promise对象。
  如果该值是一个Promise对象，则直接返回该对象；
  如果该值是thenable（即，带有then方法的对象），返回的Promise对象的最终状态由then方法执行决定。
  否则的话（该value为空，基本类型或者不带then方法的对象），返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。
  通常而言，如果你不知道一个值是否是Promise对象，使用Promise.resolve(value)来返回一个Promise对象，这样就能将value以Promise对象形式调用。

## Promise原型

### 属性

#### Promise.prototype.constructor

返回被创建的实例参数，默认为 Promise 函数。

### 方法

#### Promise.prototype.catch(onRejected)

添加一个拒绝（rejection）回调到当前 promise，返回一个新的promise。
当这个回调函数被调用，新 promise 将以它的返回值来resolve，否则如果当前 promise 进入 fulfilled 状态，则以当前promise的完成结果作为新 promise 的完成结果。

#### Promise.prototype.then(onFulfilled, onRejected)

添加解决（fulfillment）和拒绝（rejection）回调到当前 promise，返回一个新的 promise，将以回调的返回值来resolve。

#### Promise.prototype.finally(onFinally)

添加一个事件处理回调于当前promise对象，并且在原promise对象解析完毕后，返回一个新的promise对象。回调会在当前promise运行完毕后被调用，无论当前promise的状态是完成(fulfilled)还是失败(rejected)。

## 创建Promise

Promise 对象是由关键字new 及其构造函数来创建的。
该构造函数会把一个叫做“处理器函数” (executor function) 的函数作为它的参数。

这个“处理器函数” 接受两个函数——resolve和reject——作为参数。

当异步任务顺利完成且返回结果值，会调用resolve函数；
而当异步任务失败并且返回失败原因（通常是一个错误对象）时，会调用 reject 函数。

```
const myFirstPromise = new Promise((resolve, reject) => {
  // ?做一些异步操作，最终会调用下面两者之一
  // resolve(someValue); // fulfilled
  // ?或
  // reject("failure reason"); //rejected
});
```

想要某个函数？拥有promise功能，只需让其返回一个promise即可。

```
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};
```

## 示例

### 非常简单的例子

```
let myFirstPromise = new Promise(function(resolve, reject) {
  // 当异步代码执行成功时，我们才会调用resolve(...)，当异步代码失败时会调用reject
  // 在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码可能是XHR请求或是HTML5的一些API方法
  setTimeout(function(){
    resolve("成功！"); //代码正常执行！
  }, 250);
});

myFirstPromise.then(function(successMessage){
  // successMessage的值是上面调用resolve(...)方法传入的值
  // successMessage参数不一定非要是字符串类型，这里只是举个例子
  console.log("Yay!"+ successMessage);
});
```

### 高级一点的例子

本例展示了 Promise 的一些机制。

testPromise() 方法在每次点击 \<button>按钮时被调用，该方法会创建一个promise对象，使用 window.setTimeout() 让 Promise等待 1-3 秒不等的时间来填充数据（通过Math.random()方法）。

Promise 的值的填充过程会被日志记录（logged）下来，这些日志信息展示了方法中的同步代码和异步代码是如何通过Promise完成解耦的。

```
'use strict'

var promiseCount = 0;

function testPromise() {
  let thisPromiseCount = ++promiseCount;

  let log = document.getElementById('log');
  log.insertAdjacentHTML('beforeend', thisPromiseCount + ') 开始 (<small>同步代码开始</small>)<br/>');

  // 新构建一个 Promise 实例： 使用 Promise 实现每过一段时间会废计数器加一的过程，每段时间时间间隔为1~3秒不等
  let p1 = new Promise(
    // resolver 函数在 Promise 成功或失败时都可能被调用
    (resolve, reject) => {
      log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Promise 开始 (<small>异步代码开始</small>)<br/>');

      // 创建一个异步调用
      window.setTimeout(
        function() {
          // 填充 Promise
          resolve(thisPromiseCount);
        }, Math.random() * 2000 + 1000);
    }
  )
}

// Promise 不论成功或者失败都会调用 then
// catch() 只有当 promise 失败时才会调用

p1.then(
  // 记录填充值
  function(val) {
    log.insertAdjacentHTML('beforeend', val + ') Promise 已填充完毕 (<small>异步代码结束</small>)<br/>');
  })
  .catch(
    // 记录失败原因
    (reason) => {
      console.log('处理失败的 promise(' +reason +')');
    });

log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Promise made (<small>同步代码结束</small><br/>)');
```

---

引入精品博客一篇[大白话讲解Promise(一)](http://www.cnblogs.com/lvdabao/p/es6-promise-1.html#!comments)，侵权删。


去年6月份，ES2015正式发布（也就是ES6，ES6是它的乳名），其中Promise被列为正式规范。作为ES6中最重要的特性之一，我们有必要掌握并理解透彻。本文将由浅入深，讲解Promise的基本概念与使用方法。

## ES6 Promise 先拉出来溜溜

复杂的概念不讲，我们先简单粗暴地把Promise用一下，有个直观感受。那么第一个问题来了，Promise是什么玩意呢？是一个类？对象？数组？函数？

别猜了，直接打印出来看看吧，console.dir(Promise)，就这么简单粗暴。

这么一看就明白了，Promise是一个构造函数，自己身上有all、reject、resolve这几个眼熟的方法，原型上有then、catch等同样很眼熟的方法。这么说用Promise new出来的对象肯定就有then、catch方法喽，没错。

那就new一个玩玩吧！

```
var p = new Promise(function(resolve, reject){
  //做一些异步操作
  setTimeout(function(){
    console.log('执行完成');
    resolve('随便什么数据');
  }, 2000);
});
```

Promise的构造函数接收一个参数，是函数，并且传入两个参数：resolve, reject，分别表示异步操作执行成功后的回调函数和异步操作执行失败后的回调函数。

其实这里用“成功”和“失败”来描述并不准确，按照标准来讲，resolve是将Promise的状态设置为fulfiled，reject是将Promise的状态设置为rejected。

不过在我们开始阶段可以先这么理解，后面再细究概念。

在上面的代码中，我们执行了一个异步操作，也就是setTimeout，2秒后，输出 “执行完成”，并且调用resolve方法。

运行代码，会在2秒后输出 "执行完成"。
**注意！我只是new了一个对象，并没有调用它，我们传进去的函数就已经执行，这是需要注意的一个细节。**

所以我们用Promise的时候一般是包在一个函数中，在需要的时候去运行这个函数，如：

```
function runAsync () {
  let p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function() {
      console.log(function(){
        console.log('执行完成');
        resolve('随便什么数据');
      });
    }, 2000);
  })
  
  return p;
}

runAsync();
```

这时候你应该有两个疑问：

1. 包装这么一个函数有毛线用？ 
2. resolve('随便什么数据'); 这是干毛的？

我们继续来讲。
在我们包装好的函数最后，会return出Promise对象，也就是说，执行这个函数我们得到了一个Promise对象。

还记得Promise对象上有then、catch方法吧？
这就是强大之处，请看下面的代码：

```
runAsync().then(function(data){
  console.log(data);
  // 后面可以用传过来的数据做些其他操作
  // ......
});
```

在runAsync()的返回上直接调用then方法，then接收一个参数，是函数，并且会拿到我们在runAsync中调用resolve时传的参数。运行这段代码，会在2秒后输出"执行完成"，紧接着输出“随便什么数据”。

这时候你应该有所领悟了，原来then里面的函数就跟我们平时的回调函数一个意思，能够在runAsync这个异步任务执行完成之后被执行。这就是Promise的作用了，简单来讲，就是能把原来的回调写法分离出来，在异步操作执行完成后，用链式调用的方式执行回调函数。

你可能会不屑一顾，那么牛逼轰轰的Promise就这点能耐？
我把回调函数封装以下，给runAsync传进去不也一样吗，就像这样：

```
function runAsync(callback){
  setTimeout(function(){
    console.log('执行完成');
    callback('随便什么数据');
  }, 2000);
}

runAsync(function(data){
  console.log(data);
});
```

效果也是一样的，还费劲用Promise干嘛？
那么问题来了，有多层回调该怎么办？
总不能再定义一个callback2，然后给callback传进去吧。
而Promise的优势在于，可以在then方法中继续写Promise对象并返回，然后继续调用then来进行回调操作。

## 链式操作的用法

所以，从表面上看，Promise只是能够简化层层回调的写法，而实质上，Promise的精髓是“状态”，用维护状态、传递状态的方式来使得回调函能够及时调用，它比传递callback函数要简单、灵活的多。

所以使用Promise的正确场景是这样的：

```
runAsync()
.then(function(data){
  console.log(data);
  return runAsync2();
})
.then(function(data){
  console.log(data);
  return runAsync3();
})
.then(function(data){
  console.log(data);
});
```

这样能够按顺序，每隔两秒输出每个异步回调中的内容，在runAsync2中传给resolve的数据，能在接下来的then方法中拿到。

猜猜runAsync1、runAsync2、runAsync3这三个函数都是如何定义的？
没错，就是下面这样（代码较长请自行展开）：

```
function runAsync1(){
  var p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function(){
      console.log('异步任务1执行完成');
      resolve('随便什么数据1');
    }, 1000);
  });
  return p;
}

function runAsync2(){
  var p = new Promise(function(resolve,reject){
    //做一些异步操作
    setTimeout(function(){
      console.log('异步任务2执行完成');
      resolve('随便什么数据2');
    }, 2000);
  });
  return p;
}

function runAsync3(){
  var p = new Promise(function(resolve, reject){
    setTimeout(function(){
      console.log('异步任务3执行完成');
      resolve('随便什么数据3');
    });
  });
  return p;
}
```

在then方法中，你也可以直接return数据而不是Promise对象，在后面的then中就可以接收到数据了，比如我们把上面的代码修改成这样：

```
runAsync1()
.then(function(data){
  console.log(data);
  return runAsync();
})
.then(function(data){
  console.log(data);
  return '直接返回数据'; //这里直接返回数据
})
.then(function(data){
  console.log(data);
});
```

### reject的用法

到这里，你应该对"Promise是什么玩意"有了最基本的了解。
那么我们接着来看看ES6的Promise还有哪些功能。
我们光用了resolve，还没用reject呢，它是做什么的呢？
事实上，我们前面的例子都是只有“执行成功”的回调，还没有“失败”的情况，reject的作用就是把Promise的状态设置为rejected，这样我们在then中就能捕捉到，然后执行“失败”情况的回调。

```
function getNumber(){
  var p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function(){
      var num = Math.ceil(Math.random()*10); //生成1-10的随机数
      if(num<=5){
        resolve(num);
      }else{
        reject('数字太大了');
      }
    }, 2000);
  });
  return p;
}

getNumber()
.then(function(data){
  console.log('resolved');
  console.log(data);
}, function(reason, data){
  console.log('rejected');
  console.log(reason);
});
```

getNumber函数用来异步获取一个数字，2秒后执行完成，如果数字小于等于5，我们认为是“成功”了，调用resolve修改Promise的状态。否则，我们认为是“失败”了，调用reject并传递一个参数，作为失败的原因。

运行getNumber并且在then中传了两个参数，then方法可以接受两个参数，第一个对应resolve的回调，第二个对应reject的回调。

所以我们能够分别拿到他们传过来的数据。

多次运行这段代码，你会随机得到下面两种结果：

1. resolved 1。
2. rejected 数字太大了

### catch的用法

我们知道Promise对象除了then方法，还有一个catch方法，它是做什么用的呢？
其实它和then的第二个参数一样，用来指定reject的回调，用法是这样:

```
getNumber()
.then(function(data){
  console.log('resolved');
  console.log(data);
})
.catch(function(reason){
  console.log('rejected');
  console.log(reason);
});
```

效果和写在then的第二个参数里面一样。
不过它还有另外一个作用: 在执行resolve的回调（也就是上面then中的第一个参数）时，如果抛出异常了（代码出错了），那么并不会报错卡死，而是会进到这个catch方法中。

请看下面代码：

```
getNumber()
.then(function(data){
  console.log('resolved');
  console.log(data);
  console.log(somedata); //此处的somedata未定义
})
.catch(function(reason){
  console.log('rejected');
  console.log(reason);
});
```

在resolve的回调中，我们console.log(somedata);
而somedata这个变量是没有被定义的。
如果我们不用Promise，代码运行到这里就直接在控制台报错了，不往下运行了。
但是在这里，会得到这样的结果：

```
resolved
4
rejected
ReferenceError: somedata is not defined(...)
```

也就是说进到catch方法里面去了，而且把错误原因传到了reason参数中。
即便是有错误的代码也不会报错了，这与我们的try/catch语句有相同的功能。

### all的用法

Promis的all方法提供了并执行异步操作的能力，并且在所有异步操作执行完后才执行回调。
我们仍旧使用上面定义好的runAsync1、runAsync2、runAsyn3这三个函数，看下面的例子：

```
Promise.all([runAsync1(), runAsync2(), runAsync3()])
.then(function(results){
  console.log(results);
});
```

用Promise.all来执行，all接收一个数组参数，里面的值最终都返回Promise对象。
这样，三个异步操作的并行执行的，等到它们都执行完后才会进到then里面。
那么，三个异步操作返回的数据哪里去了呢？
都在then里面呢，all会把所有异步操作的结果放进一个数组中传给then，就是上面的results。

所以上面代码的输出结果就是:

```
异步任务1执行完成
异步任务2执行完成
异步任务3执行完成
```

有了all，你就可以并行执行多个异步操作，并且在一个回调中处理所有的返回数据，是不是很酷？
有一个场景是很适合用这个的，一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash以及各种静态文件。

所有的都加载完后，我们再进行页面的初始化。

### race的用法

all方法的效果实际上是 谁跑的慢，以谁为准执行回调，那么相对的就有另一个方法 谁跑的快，以谁为准执行回调，这就是race方法，这个词本来就是赛跑的意思。

race的用法与all一样，我们把上面runAsync1的延迟改为1秒来看以下：

```
Promise
.race([runAsync1(), runAsync2(), runAsync3()])
.then(function(results){
  console.log(results);
});
```

这三个异步操作同样是并行执行的。

结果你应该可以猜到，1秒后runAsync已经执行完了，此时then里面的就执行了。
结果是这样的：

```
异步任务1执行完成
随便什么数据1
异步任务2执行完成
异步任务3执行完成
```

你猜对了吗？不完全，是吧。
在then里面的回调开始执行时，runAsync2()和runAsync3()并没有停止，仍旧再执行。
于是再过1秒后，输出了他们结束的标志。

这个race有什么用呢？
使用场景还是很多的，比如我们可以用race给某个异步请求设置超时时间，并且在超时后执行相应的操作，代码如下：

```
// 请求某个图片资源
function requestImg(){
  var p = new Promise(function(resolve, rejecct){
    var img = new Image();
    img.src = "xxx";
    img.onload = function(){
      resolve(img);
    }
  });
  return p;
}

// 延迟函数，用于给请求计时
function timeout(){
  var p = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject('图片请求超时');
    }, 5000);
  });
  return p;
}

Promise
.race([requestImg(), timeout()])
.then(function(results){
  console.log(results);
})
.catch(function(reason){
  console.log(reason);
});
```

requestImg函数会异步请求一张图片，我把地址写为"xxxxx"，所以肯定是无法成功请求到的。
timeout函数是一个延迟5秒的异步操作。
我们把这两个返回Promise对象的函数放进race，于是他两就会赛跑，如果5秒之内图片请求成功了，那么便进入then方法，执行正常的流程。

如果5秒钟图片还未成功返回，那么timeout就跑赢了，则进入catch，报出"图片请求超时"的信息。