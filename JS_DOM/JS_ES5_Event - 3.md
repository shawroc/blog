# JS_ES5_Event - 3

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

Web浏览器中可能发生的事件有很多类型。
如前所述，不同事件类型具有不同的信息，而“DOM3级事件”规定了以下几类事件。

- UI事件，当用户与页面上的元素交互时触发；
- 焦点事件，当元素获取或失去焦点时触发；
- 滚轮事件，当使用鼠标滚动（或类似设备）时触发；
- 文本事件，当在文档中输入文本时触发；
- 键盘事件，当用户通过键盘在页面上执行操作时触发；
- 合成事件，当为IME输入字符时触发；
- 变动（muatation）事件，当底层DOM结构发生变化时触发；

除了这几类事件之外，HTML5 也定义了一组事件，而有些浏览器还会在DOM和BOM中实现其他专有事件。这些专有事件一般都是根据开发人员需求定制的，没有什么规范，因此不同浏览器的实现有可能不一致。

DOM3级事件模块在DOM2级事件模块基础上重新定义了这些事件，也添加了一些新事件。
包括IE9 在内的所有主流浏览器都支持DOM2级事件。IE9也支持DOM3级事件。

### UI事件

UI事件是指那些不一定与用户操作有关的时间。
这些事件在DOM规范出现之前，都是以这种或那种形式存在的，而在DOM规范中保留是为了向后兼容。现有的UI事件如下。

- DOMActivate：表示元素已经被用户操作（通过鼠标或键盘）激活。这个事件在DOM3级事件中被废弃，但Firefox2+ 和 Chrome支持它。考虑到不同浏览器实现的差异，不建议使用这个事件。

- load: 当页面完全加载后在window上面触发，当所有框架都加载完毕时在框架上面触发，当图像加载完毕时在\<img>元素上面触发，或者当嵌入的内容加载完毕时在\<object>元素上面触发。

- unload: 当页面完全卸载后在window上面触发，当所有框架都卸载后在框架集上面触发，或者当嵌入的内容卸载完毕后在\<object>元素上面触发。

- abort: 在用户停止下载过程时，如果嵌入的内容没有加载完，则在\<object>元素上面触发。

- error：在发生Javascript 错误时在window上面触发，当无法加载图像时在\<img>元素上面触发，当无法加载嵌入内容时在\<object>元素上面触发，或者当有一或多个框架无法加载时在框架集上面触发。

- select: 当用户选择文本框（\<input>或\<textarea>)中的一或多个字符时触发。

- resize: 当窗口或框架的大小变化时在window或框架上面触发。

- scroll: 当用户滚动带滚动条的元素中的内容时，在该元素上面触发。\<body>元素中包含加载页面的滚动条。

多数这些事件都与window对象或表单控制相关。

除了DOMActive之外，其他事件在DOM2级事件中都归为HTML事件（DOMActivate 在DOM2级中仍然属于UI事件）。要确定浏览器是否支持DOM2级事件规定的HTML事件。

```
var isSupported = document.implementation.hasFeature("HTMLEvents","2.0");
```

注意，只有根据"DOM2级事件"实现这些事件的浏览器才会返回true。而以非标准方式支持这些事件的浏览器则会返回false。要确定浏览器是否支持"DOM3级事件”定义的事件，可以使用如下代码：

```
var isSupported = document.implementation.hasFeature("UIEvent","3.0");
```

1. load事件

JavaScript中最常用的一个事件就是load。当页面完全加载后（包括所有图像、JavaScript文件、CSS文件等外部资源），就会触发window上面的load事件。
有两种定义onload事件处理程序的方式。

第一种方式是使用如下所示的JavaScript代码：

```
EventUtil.addHandler(window, "load", function(event) {
    alert("Loaded");
});
```

这是通过JavaScript来指定事件处理程序的方式，使用了本章前面定义的跨浏览器的EventUtil对象。与添加其他事件一样，这里也给事件处理程序传入了一个event对象。
这个event对象中不包含这个事件的任何信息，但在兼容DOM的浏览器中，event.target 属性的值会被设置为document，而IE并不会为这个事件设置srcElement属性。

第二种能够指定onload 事件处理程序的方式是为\<body>元素添加一个onload特性，如下面的例子所示：

```
<!DOCTYPE html>
<html>
<head>
<title>Load Event Example</title>
</head>
<body onload="alert("loaded!")>

</body>
</html>
```

一般来说，在window上面发生的任何事件都可以在\<body>元素中通过相应的特性来指定，因为在HTML中无法访问window元素。实际上，这只是为了保证向后兼容的一种权益之计，但所有浏览器都能很好地支持这种方式。

还是尽可能使用JavaScript方式。

**图像上面也可以触发load事件，无论是DOM中的图像元素还是HTML中的图像元素。**

因此，可以在HTML中为任何图像指定onload事件处理程序，例如：

```
<img src="smile.gif" onload="alert("Image loaded")">
```

这样，当例子中的图像加载完毕后就会显示一个警告框。同样的功能也可以使用JavaScript来实现。

```
var image = document.getElementById("myImage");
EventUtil.addHandler(image, "load", function(event) {
    event = EventUtil.getEvent(event);
    console.log(EventUtil.getTarget(event).src);
});
```

这里，使用JavaScript指定了onload事件处理程序。同时也传入了event对象，尽管它也不包含什么有用的信息。不过事件的目标是\<img>元素，因此可以通过src属性访问并显示该信息。

在创建新的\<img>元素时，可以为其指定一个事件处理程序，以便图像加载完毕后给出提示。此时，最重要的是要在src属性之前指定事件，如下面的例子所示。

```
EventUtil.addHandler(window, "load", function(){
    var image = document.createElement("img");
    EventUtil.addHandler(image, "load", function(event){
        event = EventUtil.getEvent(event);
        console.log(EventUtil.getTarget(event).src);
    });
    document.body.appendChild(image);
    image.src = "smile.gif";
});
```

在这个例子中，首先为window指定了onload事件处理程序。原因在于，我们是想向DOM中添加一个新元素，所以必须确定页面已经加载完毕——如果在页面加载前操作document.body会导致错误。然后，创建了一个新的图像元素，并设置了其onload事件处理程序。最后又将这个图像添加到页面中，还设置了它的src属性。这里有一点需要格外注意：**新图像元素不一定要从添加到文档后才开始下载，只要设置了src属性就会开始下载。**

同样的功能也可以通过DOM0级的Image对象实现。在DOM出现之前，开发人员经常使用Image对象在客户端预先加载图像。恶意像使用\<img>元素一样使用Image对象，只不过无法将其添加到DOM树中。

```
EventUtil.addHandler(window,"load", function(){
    var image = new Image();
    EventUtil.addHandler(image, "load", function(event){
        console.log("Image loaded");
    });
});
```

在此，我们使用Image构造函数创建了一个新图像的实例，然后又为它指定了事件处理程序。有的浏览器将Image对象实现为\<img>元素，但并非所有浏览器都如此，所以最好将它们区别对待。

**在不属于DOM文档的图像（包括未添加到文档的\<img>元素和Image对象）上触发load事件时，IE8及之前版本不会生成event对象。IE9修复了这个问题。**

还有一些元素也以非标准的方式支持load事件。
在IE9+、Firefox、Opera、Chrome和Safari 3+及更高版本中，\<script>元素也会触发load事件，以便开发人员确定动态加载的JavaScript文件是否加载完毕。

```
EventUtil.addHandler(window, "load", function(){
    var script = document.createElement("script");
    EventUtil.addHandler(script, "load", function(event) {
        alert("loaded");
    });
    script.src = "example.js";
    document.body.appendChild(script);
});
```

这个例子使用了跨浏览器的EventUtil对象为新创建的\<script>元素指定了onload事件处理程序。

此时，大多数浏览器中event对象的target属性引用的都是\<script>节点，而在Firefox 3 之前的版本中，引用的则是document。IE8及更早版本不支持\<script>元素上的load事件。

IE和Opera 还支持\<link>元素上的load事件，以便开发人员确定样式表是否加载完毕。

```
EventUtil.addHandler(window, "load", function(){
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    EventUtil.addHandler(link, "load", function(event){
        alert("css loaded");
    });
    link.href = "example.css";
    document.getElementsTagName("head")[0].appendCHild(link);
});
```

2. unload事件

与load事件对应的是unload事件，这个事件在文档被完全卸载后触发。
**只要用户从一个页面切换到另一个页面，就会发生unload事件。**

而利用这个事件最多的情况是清除引用，以避免内存泄漏。

与load事件类似，也有两种指定onunload事件处理程序的方式。第一种方式是使用JavaScript，如下所示。

```
EventUtil.addHandler(window, "unload", function(event){
    alert("Unloaded");
});
```

此时生成的event对象在兼容DOM的浏览器中只包含target属性（值为document）。IE8及之前版本则为这个事件对象共了srcElement属性。

指定事件处理程序的第二种方式，也是为\<body>元素添加一个特性（与load事件相似），如下面的例子所示：

```
<!DOCTYPE html>
<html>
<head>
    <title>Unload Event Example</title>
</head>
<body onunload="alert('Unloaded')">

</body>
</html>
```

无论使用哪种方式，都要小心编写onunload事件处理程序中的代码。既然unload事件是在一切都被卸载之后才触发，那么在页面加载后存在的那些对象，此时就不一定存在了。

此时，操作DOM节点或者元素的样式就会导致错误。

**根据"DOM2级事件"，应该在\<body>元素而非window对象上面触发unload事件。不过，所有浏览器都在window上实现了unload事件，以确保向后兼容。

3. resize

当浏览器窗口被调整到一个新的高度或宽度时，就会触发resize事件。这个事件在window（窗口）上面触发，因此可以通过JavaScript或者\<body>元素中的onsize特性来指定事件处理程序。

我们还是推荐使用如下所示的JavaScript方式：

```
EventUtil.addHandler(window, "resize", function(event){
    console.log("Resized");
});
```

与其他发生在window上的事件类似，在兼容DOM的浏览器中，传入事件处理程序中的event对象有一个target属性，值为document；而IE8及之前版本则未提供任何属性。

关于何时会触发resize事件，不同浏览器有不同的机制。IE、Safari、Chrome和Opera会在浏览器窗口变化了1像素时就触发resize事件，然后随着变化不断重复触发。Firefox则只会在用户停止调整窗口大小时才会触发resize事件。由于存在这个差别，应该注意不要在这个事件的处理程序中加入大计算量的代码，因为这些代码有可能被频繁执行，从而导致浏览器反应明显变慢。

**浏览器窗口最小化或最大化也会触发resize事件。**

4. scroll事件

虽然scroll事件是在window对象上发生的，但它实际表示的则是页面中相应元素的变化。在混杂模式下，可以通过\<body>元素的scrollLeft和scrollITop来监控到这一变化；而在标准模式下，除Safari之外的所有浏览器都会通过\<html>元素来反映这一变化（Safari 仍然基于\<body>跟踪滚动位置），如下面的例子所示：

```
EventUtil.addHandler(window, "scroll", function(event){
    if(document.compatMode === "CSS1Compat") {
        console.log(document.documentElement.scrollTop);
    } else {
        console.log(document.body.scrollTop);
    }
});
```

以上代码指定的事件处理程序会输出页面的垂直滚动位置——根据呈现模式不同使用了不同的元素。由于Safari 3.1 之前的版本不支持document.compatMode，因此旧版本的浏览器就会满足第二个条件。

**与resize事件类似，scroll事件也会在文档被滚动期间重复被触发，所以有必要尽量保持事件处理程序的代码简单。**