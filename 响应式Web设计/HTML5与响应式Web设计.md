# HTML5 与 响应式Web设计

---
绝大部分引用自《响应式Web设计 HTML5和CSS3实战（第2版）
---

有人可能会问，什么是HTML5啊？
HTML5其实就是HTML的最新版本，而HTML是构建网页的标记语言。
HTML作为一门语言在不断进化，上一个版本是HTML4.01。

要了解HTML的发展历程，推荐大家看一看维基百科：http://en.wikipedia.org/wiki/HTML#HTML_version2_timeline。

HTML5是W3C的建议标准，规范的全文地址是：http://www.w3.org/TR/html5/。

**HTML5提供了很多处理表单和用户输入的元素。这些新元素免除了开发者使用JavaScript费时费力的工作，比如表单验证。**

## 得到普遍支持的HTML5标记

今天，我所看到大多数网站（以及我自己写的网站）都使用了HTML5，而不是旧版本的HTML4.01。

所有现代的浏览器都理解HTML5中新的语义元素（新的结构化元素、视频和音频标签），设置老版本的IE（IE9以下版本）都可以通过引入一小段“腻子脚本”正确渲染这些新元素。

好了，了解这些以后，我们可以看看怎么开始写HTML5网页了。
先来看开始开始标签吧。

## 开始写HTML5网页

首先看HTML5文档的开始部分。
没有这些代码，网页会出现问题。

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
```

一个一个来看。一般来说，每个网页都会用掉这些元素，因此理解它们非常必要。

### doctype

doctype是我们告诉浏览器文档类型的手段。
如果没有这一行，浏览器将不知道如何处理后面的内容。

HTML5文档的第一行是doctype声明：

```
<!DOCTYPE html>
```

如果你喜欢小写，那么\<!doctype html>也一样。

相比HTML 4.01，这一改变很受欢迎。
回顾一下HTML4.01的写法吧：

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml-transitional.dtd">
```

真是噩梦一般啊，所以我之前都是复制黏贴这几行。

HTML5的doctype短小易懂，只有\<!DOCTYPE html>。

据我了解，这已经是告诉浏览器如何以“标准模式”渲染网页的最短方式了。

想知道“混杂”与“标准模式”模式的区别？还是看维基百科吧！

### HTML标签与lang属性

doctype声明之后是开发的html标签，也是文档的根标签。
同时，我们使用了lang属性指定了文档的语言。
然后是head标签。

```
<!doctype html>
<html lang="en">
<head>
```

### 指定替代语言

根据W3C的规范，lang属性指定元素内容以及包含文本的元素属性使用的主语言。
如果正文内容不是英文的，最好指定正确的语言。
比如，如果是日语，相应的HTML标签应该是\<html lang="ja">。
完整的语言列表在这里: [语言列表](http://www.iana.org/assignments/language-subtag-registry)

### 字符编码

最后是指定字符编码。
因为这是一个空元素（不能包含任何内容的元素），所以不需要结束标签：

```
<meta charset="utf-8">
```

除非确实有需要，否则这里charset属性的值一般都是utf-8。

更多信息可以参考这个链接：

[字符编码](https://www.w3.org/International/questions/qa-html-encoding-declarations#html5charset)

## 宽容的HTML5

记得上学的时候，非常厉害（实际上也非常好）的数学老师有时候不来。
每当这时候，大家都会松一口气，因为会有一位非常和蔼可亲的老师来代课。
他会静静地坐着，让我们自己学习，不会冲我们发火，也不会挖苦谁。
他在我们解题的时候不会要求大家安静，也不会在乎是不是按照他的思路解题。
他只关心你回答的是否正确，以及是否可以清楚地解释计算过程。

如果HTML5是一位数学老师，就应该是那位宽容的代课老师。
下面来解释一下这个怪异的类比。

如果注意一下自己写代码的方式，你会发现自己基本上会使用小写，而且会把属性值放在引号里，另外也会为脚本和样式声明一个type。
比如，可能会这样链接样式表：

```
<link href="CSS/main.css" rel="stylesheet" type="text/css"/>
```

HTML5不要求这么精确，只要这样写就行：

```
<link href=CSS/main.css rel=stylesheet>
```

注意到了吗？没有结束的反斜杠，属性值也没加引号，而且没有type声明。
不过宽容的HTML5并不在乎这些，后一种写法跟前一种写法一样，完全没有问题。

这种松散的语法并不局限于链接资源，而是可以在文档中任何地方出现。
比如，可以这样声明一个div元素：

```
<div id=wrapper>
```

这同样是有效的HTML5代码。插入图片也一样：

```
<img src=fromtCarousel.png aLt=frontCarousel>
```

这行代码照样有效。
没有结束标签的反斜杠，没有引号，大小写混用，都没问题。
就算省略\<head>标签，页面依然有效。
要是XHTML 1.0的话，会怎么样呢？

**想要一个HTML5模板？推荐HTML5 Boilerplate(http://html5boilerplate.com/)。这个模板预置了HTML5 “最佳实践”，包括基础的样式、腻子脚本和可选的工具，比如Modernizr。阅读这个模板的代码就可以学到很多有用的技巧，如果你有特殊需要，还可以对其性质。强烈建议选用！**




