# BOM-3

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

### navigator 检测插件

检测浏览器中是否安装了特定的插件是一种最常见的检测例程。对于非IE浏览器，可以使用plugins数组来达到这个目的。该数组中的每一项都包含下列属性：

- name: 插件的名字。
- decription: 插件的描述。
- filename: 插件的文件名。
- length: 插件所处理的MIME类型数量。

一般来说，name属性中会包含检测插件必需的所有信息，但有时候也不完全如此。在检测插件时，需要像下面这样循环迭代每个插件并将插件的name与给定的名字进行比较。

```
function hasPlugin(name) {
    name = name.toLowerCase();
    for(var i = 0; i < navigator.plugins.length; i ++) {
        if(navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
            //字符串有indexOf()方法
            return true;
        }
    }
    return false;
}

console.log(hasPlugin("Flash")); //false in Chrome
```

这个hasPlugin()函数接受一个参数：要检测的插件名。**第一步是将传入的名称转换为小写，以便于比较。**然后，迭代plugin数组，通过indexOf()检测每个那么属性，以确定传入的名称是否出现在字符串的某个地方。比较的字符串都使用小写形式可以避免因大小写不一致导致的错误。而传入的参数应该尽可能具体，以避免混淆。应该说不容易导致混淆。在Firefox、Safari、Opera和Chrome中可以使用这种方法来检测插件。

**每个插件对象本身也是一个MimeType对象的数组，这些对象可以通过方括号语法来访问。每个MimeType对象有4个属性：包含MIME类型描述的description、回指插件对象的enablePlugin、表示与MIME类型对应的文件扩展名的字符串suffixes(以逗号分隔)和表示完整MIME类型字符串中的type。**

检测IE中的插件比较麻烦，因为IE不支持Netscape式的插件。**在IE中检测插件的唯一方式就是使用专有的ActiveXObject类型，并尝试创建一个特定插件的实例。**

**IE是以COM对象的方式实现插件的，而COM对象使用唯一标识符标识。因此，要想检测特定的插件，就必须知道其COM标识符。**

例如：Flash的标识符时ShockwaveFlash.ShockwaveFlash。知道唯一标识符之后，就可以用下面的函数来检测IE中是否安装相应的插件了。

```
//检测IE中的插件

function hasIEPlugin(name) {
    try {
        new ActiveXObject(name); //创建不了的话，会抛出错误
        return true;
    } catch(ex) {
        return false
    }
}

//检测Flash
alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));

//检测QuickTime
alert(hasIEPlugin("QuickTime.QuickTime"));
```

在这个例子中，函数hasIEPlugin()只接收一个COM标识符作为参数。在函数内部，首先会尝试创一个COM对象的实例。之所以要在try-catch语句中进行实例化，是因为创建未知COM对象会抛出错误。这样，如果实例化成功，则函数返回true；否则，如果抛出错误，则执行catch块，结果就会返回false。

鉴于检测这两种插件的方法差别太大，因此典型的做法是针对每个插件分别创建检测函数，而不是使用前面介绍的通过检测方法。

```

function hasPlugin(name) {
    var name = name.toLowercase();
    for(var i = 0; i < navigator.plugin.length; i++) {
        if(navigator.plugin[i].name.index(name) > -1) {
            return true;
        }
    }
    return false;
}

function hasIEPlugin(name) {
    try {
        new ActiveXObject(name);
        return true;
    } catch(ex) {
        return false;
    }
}

//检测所有浏览器中的Flash
function hasFlash() {
    var result = hasPlugin("Flash");
    if(!result) {
        result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
    }
    return result;
}

//检测所有浏览器中的QuickTime
function hasQuickTime() {
    var result = hasPlugin("QuickTime");
    if(!result) {
        result = hasIEPlugin("QuickTime.QuickTime");
    }
    return result;
}

hasFlash();

hasQuickTime();

```

上面代码中定义了两个函数：hasFlash()和hasQuickTime()。每个函数都是先尝试使用不针对IE的插件检测方法。如果返回了false（在IE中会这样），那么再使用针对IE的插件检测方法。如果IE的插件检测方法再返回false，则整个方法也将返回false。只要任何一次检测返回true，这个方法都会返回true
。

**plugins集合有一个名叫refresh()的方法，用于刷新plugins以反映最新安装的插件。这个方法接收一个参数：表示是否应该重新加载页面的一个布尔值。如果将这个值设置为true，则会重新加载包含插件的所有页面。否则，只更新plugins集合，不重新加载页面。**

### navigator 注册处理程序

Firefox2为navigator对象新增了registerContentHandler()和registerProtocolHandler()方法（这两个方法是在HTML5中定义的）。这两个方法可以让一个站点指明它可以处理特定类型的信息。

随着RSS阅读器和在线电子邮件程序的兴起，注册处理程序就为像使用桌面应用程序一样，默认使用这些在线应用程序提供了一种方式。

其中，registerContentHandler()方法接收三个参数：要处理的MIME类型、可以处理该MIME类型的页面的URL以及应用程序的名称。举个例子，要将一个站点注册为处理RSS源的处理程序，可以使用如下代码：

```
navigator.registerContentHandler("application/rss+xml", "http://www.somereader.com?feed=%s", "Some Reader");
```

第一个参数是RSS源的MIME类型。第二个参数是应该接收RSS源URL的URL，起哄的%s表示RSS源URL，有浏览器自动插入。当下一次请求RSS源时，浏览器就会打开指定的URL，而相应的Web应用程序以适当方式来处理该请求。


**Firefox 4 及之前版本只允许在registerContentHandler()方法中使用三个MIME类型：application/rss+xml、application/atom+xml和application/vnd.mozilla,maybe.feed。这三个MIME类型的作用都一样，即为RSS或ATOM新闻源（feed）注册处理程序。**

类似的调用方式也适用于registerProtocolHandler()方法，它也接收三个参数：要处理的协议（如mailto或ftp）、处理该协议的页面的URL和应用程序的名称。例如，要想将一个应用程序注册为默认的邮件邮件客户端，可以使用如下代码。

```
navigator.registerProtocolHandler("mailto", "http://www.somemailclient.com?cmd=%s", "some mail client");
```

这个例子注册了一个mailto协议的处理程序，该程序指向一个基于Web的电子邮件客户端。
第二个参数仍然是处理响应请求的URL，而%s则表示原始的请求。

**Firefox 2 虽然实现了registerProtocolHandler()，但该方法还不能用，Firefox 3完整实现了这个方法。**

## screen对象

JavaScript中有几个对象在编程中用处不大，而是screen对象就是其中之一。screen对象基本上只能用来表明客户端的能力，其中包括浏览器窗口外部的显示器的信息，如像素宽度和高度等。每个浏览器中的screen对象都包含着各不相同的属性。

查兼容性![Can I Use](http://www.caniuse.com)

|属性|说明|
|:-:|:-:|
|availHeight|屏幕的像素高度减系统部件高度之后的值（只读）|
|avialWidth|屏幕的像素宽度减系统部件宽度之后的值（只读）|
|availTop|未被系统部件占用的最上方的像素值（只读）|
|availLeft|未被系统部件占用的最左侧的像素值（只读）|
|height|屏幕的像素高度|
|left|当前屏幕距左边的像素距离|
|width|屏幕的像素宽度|
|bufferDepth|读、写用于呈现屏外位图的位数|
|colorDepth|用于表现颜色的位数，多数系统都是32（只读）|
|deviceXDPI|屏幕实际的水平DPI（只读）|
|deviceYDPI|屏幕实际的垂直DPI（只读）|
|fontSmoothingEnabled|表示是否启用了字体平滑（只读）|
|logicalXDPI|屏幕逻辑的水平DPI（只读）|
|logicalYDPI|屏幕逻辑的垂直DPI（只读）|
|pixelDepth|屏幕的位深（只读）|
|top|当前屏幕距上边的像素距离|
|updateInterval|读、写以毫秒表示的屏幕刷新间隔|

这些信息，经常集中出现在测试客户端能力的站点跟踪工具中，但通常不会用于影响功能。不过，有时候也可能会用到其中的信息来调整浏览器窗口大小，使其占据屏幕的可用空间。

```
window.resizeTo(window.availWidth, window.availHeight);
```

**许多浏览器都会禁用调整浏览器窗口大小的能力，因此上面这行代码不一定在所有环境下都有效。

**涉及移动设备的屏幕大小时，情况有点不一样。运行iOS的设备始终会像是把设备竖着拿在手里一样，因此返回的值是768 * 1024。 而Android设备则会相应调用screen.width和screen.height的值。**

## history对象

**history对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。**因为history是window对象的属性，因此每个浏览器窗口、每个标签页乃至每个框架，都有自己的history对象与特定的window对象关联。

出于安全方面的考虑，开发人员无法得知用户浏览过的URL。不过，借由用户访问过的页面列表，同样可以在不知道实际URL的情况下实现后退和前进。

使用go()方法可以在用户的历史记录中任意跳转，可以向后也可以向前。这个方法接受一个参数，表示向后或向前跳转的页面数的一个整数值。负数表示向后跳转（类似于单击浏览器的“后退”按钮），正数表示向前跳转（类似于点击浏览器的“前进”按钮）。

```
//后退一页
history.go(-1);

//前进一页
history.go(1);

//前进两页
history.go(2);
```

也可以给go()方法传递一个字符串参数，此时浏览器会跳转到历史记录中包含该字符串的第一个位置——可能后退，也可能前进，具体要看哪个位置最近。如果历史记录中不包含该字符串，那么这个方法什么也不做。

```
//跳转到最近的worx.com页面
history.go("worx.com");

//跳转到最近的nczonline.net页面
history.go("nczonline.net");
```

另外，还可以使用两个简写方法back()和forward()来代替go()。顾名思义，这两个方法可以模拟浏览器的“后退”和“前进”按钮。

```
//后退一页
history.back();

//前进一页
history.forward();
```

除了上述几个方法外，history对象还有一个length属性，保存着历史记录的数量。这个数量包括所有历史记录，即所有向后和向前的记录。对于加载到窗口、标签页或框架中的第一个页面而言，history.length等于0。通过像下面这样测试该属性的值，可以确定用户是否一开始就打开了你的页面。

```
if(history.length == 0) {
    console.log("这是你打开的第一个页面");
}
```

虽然history并不常用，但在创建自定义的“后退”和“前进”按钮，以及检测当前页面是不是用户历史记录中的第一个页面时，还必须使用它。

**当页面的URL改变时，就会生成一条历史记录。在IE8及更高版本、Opera、Firefox、Safari 3及更高版本以及Chrome中，这里所说的改变包括URL中hash的变化（因此，设置location.hash会在这些浏览器中生成一条新的历史记录）。**


## 小结

浏览器对象模型（BOM）以window对象为依托，表示浏览器窗口以及页面可见区域。同时，window对象还是ECMAScript中的Global对象，因而所有全局变量和函数都是它的属性。且所有原生函数及其他函数也都存在于它的命名空间下。

- 在使用框架时，每个框架都有自己的window对象以及所有原生构造函数及其他函数的副本。每个框架都保存爱frames集合中，可以通过位置或通过名称来访问。

- 有一些窗口指针，可以用来引用其他框架，包跨父框架。

- top始终指向最外围的框架，也就是整个浏览器窗口。

- parent对象表示包含当前框架的框架，而self对象则回指window。

- 使用location对象可以通过编程方式来访问浏览器的导航系统内。设置相应的属性，可以部分或整体性地修改浏览器的URL。

- 调用replace()方法可以导航到一个新URL，同时该URL会替换浏览器历史记录中当前显示的页面的URL。

- navigator对象提供了与浏览器有关的信息。到底提供了哪些信息，很大程度上取决于用户的浏览器。不过，也有一些公共的属性（如userAgent）存在于所有浏览器中。

BOM中还有两个对象：screen和history，但它们的功能有限。

screen对象中保存着与客户端显示器有关的信息，这些信息一般用于站点分析。history对象为访问浏览器的历史记录开了一个小缝隙，开发人员可以据此判断历史记录的数量，也可以在历史记录中向后或向前导航的任意页面。