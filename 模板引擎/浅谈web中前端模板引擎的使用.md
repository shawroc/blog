# 模板引擎

[模板引擎-百度词条](https://baike.baidu.com/item/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E/907667?fr=aladdin)

## 什么是模板引擎？（百度词条）

模板引擎（这里特指用于Web开发的模板引擎）是为了使用户界面与业务数据分离而产生的，它可以生成特定格式的文档，用于网站的模板引擎会生成一个标准的HTML文档。

## 原理（百度词条）

模板引擎的实现方式有很多，最简单的是“置换型”模板引擎，这类模板引擎将指定模板内容（字符窜）中的特定标记（子字符窜）替换一下变生成了最终需要的业务数据（比如网页）。

置换型模板引擎的优点：实现简单， 缺点： 效率低，无法满足高负载的应用请求。

## 用途（百度词条）

模板引擎可以让（网站）程序实现界面与数据分离，业务代码与逻辑代码的分离，提升开发效率，良好的设计也提高了代码的复用性。

我们司空见惯的模板安装卸载等概念，基本上都和模板引擎有着千丝万缕的联系。模板引擎不只是可以让你实现代码分离（业务逻辑代码和用户界面代码），也可以实现数据分离（动态数据与静态数据），还可以实现代码单元共享（代码重用），设置是多语言、动态页面与静态页面自动均衡（SDE）等等与用户界面可能没有关系的功能。

## 前端模板

AJAX的出现使得前后端分离成为可能。

后端专注于业务逻辑，为前端提供接口。

前端通过AJAX的方式向后端的接口请求数据，然后动态渲染页面。

```
//假设接口数据如下
//[{friends: "Sharon"}, {friends: "Sandy"}, {friends: "Roc"}]

//假设渲染后的页面

<div>
    <ul class="friends-list">
        <li>Sharon</li>
        <li>Sandy</li>
        <li>Roc</li>
    </ul>
</div>

```

模板引擎出现之前，当然是在js中遍历拼接字符窜。

```
<div></div>

<script>
//假设接口的数据为
var data = [{friends: "Sharon"}, {friends: "Sandy"}, {friends: "Roc"}];

var htmlStr = '';

htmlStr += '<ul class="friends-list">';

for(var i= 0; i < data.legnth; i ++ ) {
    htmlStr += '<li>' + data[i].friends + '</li>';
}

htmlStr += '</ul>';

document.querySelector('div').innerHTML = str;
</script>
```

确实很简单方便，但是也有很多缺点：

html代码(View层) 和 JS代码 （Controller层），UI与逻辑代码混杂在一起，非常不便于阅读。 一旦业务复杂起来，不容易维护。

从安全角度来讲，也会有代码注入攻击风险（code injection)。

从代码者的角度来讲，如果需要拼接的HTML代码里有很多引号的话（比如标签里面有很多属性），那么就非常容易出错。

---
既然这样，总要想办法解决问题！

这就引出模板引擎， Underscore的_.template可能是最简单的前端模板引擎了（或者可以说，这就是个前端模板函数）。

引用_.template，将以上的代码改写。

```
<div></div>

<script src="http://cdn.bootcss.com/underscore.js/1.8.3/underscore.js"></script>


<script type="text/template" id="tpl">
    <ul class="list">
        <%_.each(data, function(item){%>
            <li><%= item.friends %></li>
        <%});%>
    </ul>
</script>


<script>
// 模拟数据
var data = [{friends: "Sharon"}, {friends: "Sandy"}, {friends: "Roc"}];
var compiled = _.template(document.getElementById("tpl").innerHTML);
var htmlStr = compiled(data);
document.querySelector('div').innerHTML = htmlStr;
</script>

```

这样的话，前端需要改HTML代码，只需要改模板即可。

用户界面与逻辑代码不在混杂，可维护性和扩展性大大的提高了。

如何实现一个模板引擎呢？ 实现的思路是什么呢？

感兴趣的话，可以看看我翻译的两篇文章。

[翻译_20行代码创造JavaScript模板引擎（一）](https://segmentfault.com/a/1190000016678647)

[翻译_只需20行代码创造JavaScript模板引擎（二）](https://segmentfault.com/a/1190000016802068)

[字符串替换模板引擎github地址]
()





