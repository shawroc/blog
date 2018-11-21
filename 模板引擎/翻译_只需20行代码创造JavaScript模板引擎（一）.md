# 翻译_20行代码创造JavaScript模板引擎（一）

## 想看博客原文链接，请点击下方

[JavaScript template engine in just 20 lines](http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)

---

一个非常好用的学习正则表达的网站
[正则表达式图文解说网站](https://regexper.com)

---


事情的起因，我想编写一个逻辑简单的模板引擎，它可以很好满足我现在的需求。

我知道不能找一些现有的引擎，因为它们绝大多数是基于NodeJS的，很难在浏览器中去实现它们。

而我希望用原生JavaScript去写，这样也可以在浏览器上运行。

我是从[John Resig的博客](https://johnresig.com/blog/javascript-micro-templating/)得到制作这个简易版模板引擎的灵感。

我稍微改动了一下，缩减到20行。 这个脚本的工作原理，非常有趣。

在本文中， 将一步一步来创建这个引擎，这样你就体会到来自John的奇思妙想。

### 构思


```

functiom TemplateEngine(tpl, data) {
    //魔法细节在这里 magic details here!
}

var tpl = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';

var data = {
    name: "Shaw",
    age: 18
}

console.log(TemplateEngine(tpl, data)); 
//按照构思，我们想实现的需要和想得到结果 应该是 '<p>Hello, my name is Shaw. I'm 18 years old.</p>'

```

一个简单的函数，接收两个参数：tpl（模板字符窜），data（JS对象格式）；


---

### 第一步，匹配参数tpl（模板字符窜）中的动态模块

动态模块是指在 tpl（模板字符窜）中，你想要匹配并用数据替换的部分。

 '<%string%>'

```
//举个例子
//tpl中的动态模块有两个：<%name%>和<%age%>。

var tpl = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';
```

在这里，我决定用正则表达式去实现，正则表达式不是我的强项，所以有什么建议，尽管畅所欲言。

Tips: 其实正则没那么难，平时多练练就好了。 首先克服内心的恐惧，尝试着写，想不出来，多翻翻基础知识。

```

var regEx = /<%([^%>]+)?%>/g

```

这个正则表达式是什么意思呢？

在一个字符窜中，匹配以"<%"开头 和 "%>" 结尾的字符窜片段。

g，表示全局匹配。

在这里，我们需要用到正则表达式的exec()方法。

该方法用于正则表达式模式在字符窜中运行查找，如果exec()找到匹配的文本，则返回一个数组，否则返回null。

regExp.exec(str);

```
var tpl = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';
var regEx =  /<%([^%>]+)?%>/g;

console.log(regEx.exec(tpl));
/*
[0: "<%name%>", 1: "name", index: 21, input: "<p>Hello, my name is <%name%>. I'm <%age%> years old.</p>", length: 2, groups: undefined]
*/

```

得到了正则表达式在字符窜中匹配的字符窜片段。

只得到一个匹配的字符窜片段！

可是我们需要所有匹配的字符窜片段。

这时，我们需要一个while循环语句来依次得到匹配字符窜。

```
var tpl = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';

var regEx = /<%([^%>]+)?%>/g;

var match;

while(match = regEx.exec(tpl)) {

    console.log(match);

    //["<%name%>", "name", index: 21, input: "<p>Hello, my name is <%name%>. I'm <%age%> years old.</p>", groups: undefined]

    //["<%age%>", "age", index: 35, input: "<p>Hello, my name is <%name%>. I'm <%age%> years old.</p>", groups: undefined]
}
```
---

这里要了解RegExp.exec()方法，在全局匹配中的特性：

调用全局的RegExp对象的exec()时，它会在RegExp实例的lastIndex属性指定的字符处开始检索字符窜string

当exec()找到了与表达式相匹配的文本时， 在匹配后， 它将把RegExp实例的lastIndex属性设置为匹配文本的最后一个字符的下一个位置。可以通过反复调用exec()方法来遍历字符窜中的所有匹配文本。

==当exec()再也找不到匹配的文本时，它将返回null，并把lastIndex属重置为0。==

```
var reg = /\d/g;

var r =  reg.exec('a1b2c3');

console.log(r);

console.log(reg.lastIndex); // 2

r = reg.exec('a1b2c3');

console.log(reg.lastIndex); // 4

```


```
var reg = /\d/g;

while (r = reg.exec('a1b2c3')) {
    console.log(r.index + ':' + r[0])
}

//1:1 , 3:2, 5:3

```

### 第二步，用数据替换在模板中匹配的字符窜片段

现在，变得有趣了！！ 

给函数传递一个真实的数据（JS对象格式）。

然后用数据替换匹配的字符窜片段。

能想到的最简单的方法，就是使用String.prototype.replace()方法了。

我们可以这样写

```

function TemplateEngine(tpl, data){
    var regEx = /<%([^%>]+)?%>/g, matchStrArr;

    while(matchStrArr = regEx.exec(tpl)) {
        tpl = tpl.replace(matchStrArr[0], data[matchStrArr[1]])
    }

    return tpl;
}

var tpl = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';

var personalInfo = {
    name: "Shaw",
    age: 18
}

var htmlStr = TemplateEngine(tpl, personalInfo);

console.log(htmlStr); // <p>Hello, my name is Shaw. I'm 18 years old.</p>

//运行成功，可以使用。

```

测试，运行成功！

但是这还不够好，数据是非常简单的对象，并且很容易使用object['property']对象的中括号语法，去读取对象的值。

但在实践中，我们用到的数据中，可能有复杂的嵌套对象。

```
//嵌套对象
data = {
    name: "Krasimir Tsonev",
    profile: {age:29}
}
```