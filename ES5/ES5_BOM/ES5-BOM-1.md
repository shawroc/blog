# BOM

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

ECMAScript是JavaScript的核心，但如果要在Web中使用JavaScript，那么BOM（浏览器对象模型）则无疑才是真正的核心。BOM提供了很多对象，用于访问浏览器的功能，这些功能与任何网页内容无关。多年来，缺少事实上的规范导致BOM既有意思又有问题，因为浏览器提供商会按照各自的想法随意去扩展它。于是，**浏览器之间共有的对象就成为了事实上的标准。**这些对象在浏览器中得以存在，很大程度上是由于它们提供了与浏览器的互操作性。W3C为了把浏览器中JavaScript最基本的部分标准化，已经将BOM的主要方面纳入了HTML5的规范中。

## window对象

**BOM的核心对象是window，它表示浏览器的一个实例。**在浏览器中，window对象有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，又是ECMAScript规定的Global对象。这意味着在网页中定义的任何一个对象、变量和函数，都以window作为其Global对象，因此有权访问parseInt()等方法。

### 全局作用域

由于window对象同时扮演着ECMAScript中Global对象的角色，因此所有在全局作用域中声明的变量、、函数都会变成window对象的属性和方法。

```
var age = 29;

function sayAge() {
    console.log(this.age);
}

console.log(window.age); //29

sayAge(); //29

window.sayAge(); //29

```

我们在全局作用域中定义了一个变量age和一个函数sayAge()，它们被自动归在了window对象名下。于是，可以通过window.age访问变量age，可以通过window.sayAge()访问函数sayAge()。由于sayAge()存在于全局作用域中，因此this.age被映射到window.age，最终显示的仍然是正确的结果。

抛开全局变量会成为window对象的属性不谈，定义全局变量与在window对象上直接定义属性还是有一点差别：全局变量不能通过delete操作符删除，而直接在window对象上的定义的属性可以。

```
var age = 29;
window.color = "red";

//在IE9-抛出错误，在其他所有浏览器中都返回false
delete window.age;


//在IE9-抛出错误，在其他所有浏览器中都返回true
delete window.color; //returns true

console.log(window.age); //29

console.log(window.color); //undefined
```

**使用var语句添加的window属性有一个名为[[configurable]]的特性，这个特性的值被设置为false，因此这样定义的属性不可以通过delete操作符删除。**IE8及更早版本在遇到使用delete删除window属性的语句时，不管该属性最初是如何创建的，都会抛出错误，以示警告。IE9及更早版本不会抛出错误。

另外，还要记住一件事：尝试访问未声明的变量会抛出错误，但是通过查询window对象，可以知道某个可能未声明的变量是否存在。

```
//这里会抛出错误，因为oldValue未定义
var newValue = oldValue; //Reference Error, oldValue is not defined.

//这里不会抛出错误，因为这是一次属性查询
//newValue的值是undefined

var newValue = window.oldValue; 

console.log(newValue); //undefined

```

**Windows Mobile平台的IE浏览器不允许通过window.property = value之类的形式，或直接在window对象上创建新的属性或方法。可是，在全局作用中声明的所有变量换个函数，照样会变成window对象的成员。**

## 窗口关系及框架

**如果页面中包含框架，则每个框架都拥有自己的window对象，并且保存在frames集合中。**
在frams集合中，可以通过数值索引（从0开始，从左至右，从上到下）或者框架名称来访问相应的window对象。每个window对象都有一个name属性，其中包含框架的名称。

``` 

<html>
    <head>  
        <title>Frameset Example</title>
    </head>
    <frameset rows="160,*">
        <frame src="frame.htm" name="topFrame">
        <frameset cols="50%,50%">
            <frame src="anotherframe.htm" name="leftFrame">
            <frame src="yetanotherframe.htm" name="rightFrame">
        </frameset>
    </frameset>
</html>
```

以上代码创建了一个框架集，其中一个框架居上，两个框架居下。
对于这个例子而言，可以通过window.frames[0]或者window.frames["topFrame"]来引用上方的框架。

**不过，最好使用top而非window来引用这些框架（例如，通过top.frames[0]）。**

**top对象始终指向最高最外层的框架，也就是浏览器窗口。**

使用它可以确保在一个框架中正确地访问另一个框架。因为对于在一个框架中编写的任何代码来说，其中的window对象指向的都是那个框架的特定实例，而非最高层的框架。

```
//通过代码来访问前面例子中每个框架的不同方式

window.frames[0];
window.frames["topFrame"];
top.frames[0];
top.frames["topFrame"];
frames[0];

window.frames[1];
window.frames["leftFrame"];
top.frames[1];
top.frames["leftFrame"];f
frames[1];

window.frames[2];
window.frames["rightFrame"];
top.frames[2];
top.frames["rightFrame"];
frames[2];
```

与top相对的另一个window对象是parent。
**顾名思义，parent(父)对象始终指向当前框架的直接上层框架。**
在某些情况下，parent有可能等于top；但在没有框架的情况下，parent一定等于top（此时它们都等于window）。

```
<html>
    <head>
        <titleFrameset Example</title>
        <frameset rows="100,*">
            <frame src="frame.htm" name="topFrame">
            <frameset cols="50%,50%">
                <frame src="anotherframe.htm" name="leftFrame">
                <frame src="anotherframeset.htm" name="rightFrame">
            </frameset>
        </frameset>
    </head>
</html>
```

这个框架集中第一个框架包含了另一个框架集，该框架集的代码如下所示：

```
<html>
    <head>
        <title>Frameset Example</title>
    </head>
    <frameset cols="50%,50%">
        <frame src="red.htm" name="redFrame">
        <frame src="blue.htm" name="blueFrame">
    </frameset>
</html>
```

浏览器在加载完第一个框架集以后，会继续讲第二个框架集加载到rightFrame中。如果代码位于redFrame（或blueFrame）中，那么parent对象指向的就是rightFrame。如果代码位于topFrame中，则parent指向的是top，因为topFrame的直接上层框架就是最外层框架。

**注意，除非最高层窗口是通过window.open()打开的，否则其window对象的name属性不会包含任何值。**

与框架有关的最后一个对象是self，它始终指向window；实际上，self和window对象可以互换使用。引入self对象的目的只是为了与top和parent对象对应起来，因此它不格外包含其他值。

所有这些对象都是window对象的属性，可以通过window.parent、window.top等形式来访问。**同时，这也意味着可以将不同层次的window对象连戳起来。**

**在使用框架的情况下，浏览器会存在多个Global对象。在每个框架中定义的全局变量会自动成为框架中window对象的属性。由于每个window对象都包含原生类型的构造函数，因此每个框架都有一套自己的构造函数，这些构造函数一一对应，但并不相等。例如，top.object并不等于top.frames[0].Object。这个问题会影响到对跨框架传递传递的对象使用instanceof操作符。**


## 窗口位置

用来确定和修改window对象位置的属性和方法有很多。

**IE、Safari、Opera和Chrome都提供了screenLeft和screenTop属性，分别用于表示窗口相对于屏幕左边和上面的位置。**Firefox则在screenX和screenY属性中提供相同的窗口位置信息，Safari和Chrome也同时支持这两个属性。Opera虽然也支持screenX和screenY属性，但与screenLeft和screenTop睡醒并不对应，因此不要在Opera中使用它们。

```
var leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX;

var topPos = (typeof window.scrrenTop == "number") ? window.screenTop : window.screenY;
```

以上，运用二元操作符首先确定screenLeft和screenTop属性是否存在，如果是（在IE、Safari、Opera和Chrome中），则取得这两个属性的值。如果不存在（在Firefox中），则取得screenX和screenY的值。

在使用这些值的过程中，还必须注意一些小问题。在IE、Opera中，screenLeft和screenTop中保存的是从屏幕左边和上边到由window对象表示的页面可见区域的距离。换句话说，**如果window对象是最外层对象，而且浏览器窗口紧贴屏幕最上端——即y轴坐标为0，那么screenTop的值就是位于页面可见区域上方的浏览器工具栏的像素高度。**

**但是，在Chrome、Firefox和Safari中，screenY或screenTop中保存的是整个浏览器窗口相对于屏幕的坐标值，即在窗口的y轴坐标为0时返回0。**

更让人捉摸不透的是，Firefox、Safari和Chrome始终返回页面中每个框架的top.screenX和top.screenY值。即使在页面由于被设置了外边距而发生偏移的情况下，相对于window对象使用screenX和screenY每次也都会返回相同的值。而IE和Opera则会给出框架相对于屏幕边界的精确坐标值。

最终结果，就是无法在跨浏览器的条件下去的窗口左边和上边的精确坐标值。然而，使用moveTo()和moveBy()方法倒是今天有可能将窗口精确地移动到一个新位置。这两个方法都接收两个参数，其中moveTo()接收的是新位置的x和y坐标值，而moveBy()接收的是水平和垂直方面上移动的像素数。

```
//将窗口移动到屏幕左上角
window.moveTo(0,0); 

//将窗口向下移动100像素
window.moveBy(0,100);

//将窗口移动到(200,300)
window.moveTo(200,300);

//将窗口向左移动50像素
window.moveBy(-50,0);
```

需要注意的是，这两个方法可能会被浏览器禁用；而且，在Opera和IE7（及更高版本）中默认就是禁用的。另外，这两个方法都不适用于框架，只能对最外层的window对象使用。

## 窗口大小

跨浏览器确定一个窗口的大小不是一件简单的事。IE9+、Firefox、Safari、Opera和Chrome均为此提供了4个属性:

- innerWidth
- innerHeight
- outerWidth
- outerHeight

在IE9+、Safari和Firefox中，outerWidth和outerHeight返回浏览器窗口本身的尺寸（无论是从最外层的window对象还是从某个框架访问）。

在Opera中，这两个属性的值表示页面视图容器的大小。而innerWidth和innerHeight则表示该容器中页面视图区的大小（减去边框宽度）。

**在Chrome中，outerWidth、outerHeight返回是整个浏览器的长款值，innerWidth、innerHeight返回的是视口（viewport）大小而非浏览器窗口大小。**

IE8及更早版本没有提供取得当前浏览器窗口尺寸的属性，不过，它通过DOM提供了页面可见区域的相关信息。

**在IE、Firefox、Safari、Opera和Chrome中，document.documentElement.clientWidth和document.documentElement.clientHeight中保存了页面视口的信息。**

在IE6中，这些属性必须在标准模式下才有效；如果是混杂模式，就必须通过**document.body.clientWidth和document.body.clientHeight取得相同的信息。**

**而对于混杂模式下的Chrome，则无论通过document.documentElement还是document.body中的clientWidth和clientHeight属性，都可以取得视口的大小。**

**虽然最终无法确定浏览器窗口本身的大小，但却可以取得页面视口的大小。**

```
var pageWidth = window.innerWidth,
    pageHeight = window.innerHeight;

if(typeof pageWidth != "number") {
    if(document.compatMode == "CSS1Compat") {
        pageWidth = document.documentElement.clientWidth;
        pageHeight = document.documentElement.clientHeight;
    } else {
        pageWidth = document.body.clientWidth;
        pageHeight = document.body.clientHeight;
    }
}
```

以上代码中，我们首先将window.innerWidth和window.innerHeight的值分别赋给了pageWidth和pageHeight。然后检查pageWidth中保存的是不是一个数值；如果不是，则通过检查document.compatMode来确定页面是否处于标准模式。

如果是，则分别使用document.documentElement.clientWidth和document.documentElement.clientHeight的值。否则，就使用document.body.clientWidth和document.body.clientHeight的值。

对于移动设备，window.innerWidth和window.innerHeight保存着可见视口，也就是屏幕上可见区域的大小。移动IE浏览器不支持这些属性，但通过document.documentElement.clientWidth和document.documentElement.clientHeight提供了相同的信息。随着页面的缩放，这些值也会相应的变化。

在其他移动浏览器中，document.documentElement度量的是布局视口，即渲染后页面的实际大小（与可见视口不同，可见窗口只是整个页面中的一小部分）。

移动IE浏览器把布局视口的信息保存在document.body.clientWidth和document.body.clientHeight中。这些值不会随着页面缩放变化。

由于与桌面浏览器间存在这些差异，最好是先检测一下用户是否在使用移动设备，然后再决定使用哪个属性。

**另外，使用resizeTo()和resizeBy()方法可以调整浏览器窗口的大小。**
这两个方法都接收两个参数，其中resizeTo()接收浏览器窗口的新宽度和新高度，而resizeBy()接收新窗口与原窗口的宽度和高度只差。

```
//调整到100x100
window.resizeTo(100,100);

//调整到200x150
window.resizeBy(100,50);

//调整到300x300
window.resizeTo(300,300);

```

需要注意的是，这两个方法与移动窗口位置的方法类似，也有可能被浏览器禁用；而且，在Opera和IE7（及更高版本）中默认就是禁用的。另外，这两个方法同样不适用于框架，而只能对最外层的window队形使用。

## 导航和打开窗口

使用window.open()方法既可以导航到一个特定的URL，也可以一个新的浏览器窗口。这个方法可以接收4个参数：要加载的URL、窗口目标、一个特性字符串以及一个表示"新页面是否取代浏览器历史记录中当前加载页面的布尔值。" 通常只须传递第一个参数，最后一个参数只在不打开新窗口的情况下使用。

如果为window.open()传递了第二个参数，而且该参数是已有窗口或框架的名称，那么就会在具有该名称的窗口或框架的名称，那么就会在具有该名称的窗口或框架中加载第一个参数指定的URL。

```
//等同于<a href="http://www.worx.com" target="topFrame">
window.open("http://www.worx.com", "topFrame");
```

调用这行代码，就如同用户单击了href属性为[http://www.worx.com/](http://www.worx.com/)，target属性为"topFrame"的链接。如果有一个名叫"topFrame"的窗口或框架，就会在该窗口或框架加载这个URL；否则，就会创建一个新窗口并将其命名为"topFrame"。此外，第二个参数也可以是下列任何一个特殊的窗口名称：_self、_parent、_top或_blank。

1. 弹出窗口

如果给window.open()传递的第二个参数并不是一个已经存在的窗口或框架，那么该方法就会根据在第三个参数位置上传入的字符串创建一个新窗口或新标签页。如果没有传入第三个参数，那么就会打开一个带有全部默认设置（工具栏、地址栏和状态栏等）的新浏览器窗口（或者打开一个新标签页——根据浏览器设置）。在不打开新窗口的情况下，会忽略第三个参数。

第三个参数是一个逗号分隔的设置字符串，表示在新窗口中都显示哪些特性。下列列出了可以出现在这个字符串中的设置选项。

|设置|值|说明|
|:-:|:-:|:-:|
|fullscreen|yes或no|**表示浏览器窗口是否最大化。仅限IE|
|height|数值|表示新窗口的高度。不能小于100|
|left|数值|表示新窗口的左坐标。不能是负值|
|location|yes或no|表示是否在浏览器窗口中显示地址栏。不同浏览器的默认值不同。如果设置为no，地址栏可能会隐藏，也可能会被禁用（取决于浏览器）|
|menubar|yes或no|表示是否在浏览器窗口中显示菜单栏。默认值为no|
|resizable|yes或no|表示是否可以通过拖动浏览器窗口的边框改变其大小。默认值为no|
|scrollbars|yes或no|表示如果内容在视口中显示不下，是否允许滚动。默认值为no|
|status|yes或no|表示是否在浏览器窗口显示状态栏。默认值为no|
|toolbar|yes或no|表示是否在浏览器窗口中显示工具栏。默认值为no|
|top|数值|表示新窗口的上坐标。不能是负值。|
|width|数值|表示新窗口的宽度。 不能小于100|

表中所列的部分或全部设置选项，都可以通过逗号分隔的名值对列表来指定。其中，名值对以等号表示（**注意，整个特性字符串中不允许出现空格**）。

```

window.open("http://www.worx.com/","worxWindow", "height=400,width=400,top=100,left=10,resizable=yes");
```

这行代码会打开一个新的可以调整大小的窗口，窗口初始大小为400 x 400像素，并且距屏幕上沿和左边各10像素。

**window.open()方法会返回一个指向新窗口的引用。**

引用的对象与其他window对象大致相似，但我们可以对其进行更多控制。

例如，**有些浏览器在默认情况下可能不允许我们针对主浏览器窗口调整大小或移动位置，但却允许我们针对通过window.open()创建的窗口调整大小或移动位置。**通过这个返回的对象，可以像操作其他窗口一样操作新打开的窗口。

```
var worxWin = window.open("http://www.worx.com","worxWin","height=400,width=400,top=10,left=10,resizable=yes");

worxWin.resizeTo(500,500);

worxWin.moveTo(100,100);

```

调用close()方法还可以关闭新打开的窗口。

```
worxWin.close();
```

这个方法仅适用于通过window.open()打开的弹出窗口。对于浏览器的主窗口，如果没有得到用户的许可是不能关闭它的。弹出窗口倒是可以调用top.close()在不经用户允许的情况下关闭自己。弹出窗口关闭之后，窗口的引用仍然还在，但除了向下面这样检测其closed属性之外，已经没有其他用处了。

```
worxWin.close();
console.log(worxWin.closed);//true
```

新创建的window对象还有一个opener属性，其中保存着打开它的原始窗口对象。这个属性只在弹出窗口中的 最外层window对象（top）中有定义，而且指向调用window.open()的窗口或框架。

```
var worxWin = window.open("http://www.worx.com", "worxWin", "height=400,height=400,top=10,left=10,resizable=yes");

console.log(worxWin.opener == window); //true
```

**虽然弹出窗口中有一个指针指向打开它的原始窗口，但原始窗口中并没有这样的指针指向弹出窗口。窗口并不跟踪记录它们打开的弹出窗口，因此我们只能在必要的时候自己动手实现跟踪。**

有些浏览器（如IE8和Chrome）会在独立的进程中运行每个标签页。当一个标签页打开另有一个标签页时，如果两个window对象之间需要彼此通信，那么新标签页就不能运行在独立的进程中。在Chrome中，将新创建的标签页的opener属性设置为null，即表示在单独的进程中运行新标签。

```
var worxWin = window.open("http://www.worx.com","worxWin","height=400,width=400,top=10,left=10,resizable=yes");

worxWin.opener = null;

```

将opener属性设置为null就是告诉浏览器新创建的标签页不需要与打开它的标签页通信，因此可以在独立的进程中运行。标签页之间的联系一旦切断，将没有办法恢复。

2. 安全限制

曾经有一段时间，广告商在网上使用弹出窗口达到了肆无忌惮的程度。他们经常把窗口打扮成系统对话框的模样，引诱用户去点击其中的广告。由于看起来像是系统对话框，一般用户很难分辨是真是假。为了解决这个问题，有些浏览器开始在弹出窗口配置方面增加限制。

windows XP SP2中的IE6对弹出窗口施加了多方面的安全限制，包括不允许在屏幕之外创建弹出窗口、不允许将弹出窗口移动到屏幕以外、不允许关闭状态栏等。IE7则增加了更多的安全限制，如不许关闭地址栏、默认情况下不允许移动弹出窗口或调整大小。Firefox1从一开始就不支持修改状态栏，因此无论给window.open()传入什么样的特性字符串，弹出窗口中都会无一例外地显示状态栏。后来的Firefox3 又强制始终在弹出窗口中显示地址栏。Opera只会在主浏览器窗口中打开弹出窗口，但不允许它们出现在可能与系统对话框混淆的地方。

此外，有的浏览器只根据用户操作来创建弹出窗口。这样一来，在页面尚未加载完成时调用window.open()的语句根本不会执行，而且还可能会将错误消息显示给用户。也是说，只能通过点击或者击键来打开弹出窗口。

对于那些不是用户有意打开的弹出窗口，Chrome采取了不同的处理方式。它不会像其他浏览器那样简单地屏蔽这些弹出窗口，而是只显示他们的标题栏，并把它们放在浏览器窗口的右下角。

**在打开计算机硬盘中的网页时，IE会解除对弹出窗口的某些限制。但是在服务器上执行这些代码会受到对弹出窗口的限制。**

3. 弹出窗口屏蔽程序

大多数浏览器都内置有弹出窗口屏幕程序，而没有内置此类程序的浏览器，也可以安装Yahoo! Toolbar等带有内置屏幕程序的实用工具。

结果就是用户可以将绝大多数不想看到弹出窗口屏蔽掉。

在弹出窗口被屏蔽时，就应该考虑两种可能性。如果是浏览器内置的屏蔽程序阻止的弹出窗口，那么window.open()很可能会返回null。此时，只要检测这个返回的值就可以确定弹出窗口是否被屏蔽了。

```
var worxWin = window.open("http://www.worx.com","worxWin","height=400,width=400,top=10,left=10,resizable=yes");

if(worxWin == null) {
    console.log("The popup was blocked");
}
```

如果是浏览器扩展或其他程序阻止的弹出窗口，那么window.open()通常会抛出一个错误。
因此，要想准确地检测弹出窗口是否被屏蔽吗，必须在检测返回值的同时，将对window.open()的调用封装在一个try-catch语句中。

```
var bloacked = false;

try {
    var worxWin = window.open("http://www.worx.com","worxWin", "height=400,width=400,top=10,left=10,resizable=yes");
    if(worxWin == null) {
        bloacked = true;
    }
    
} catch(ex) {
    blocked = true;
}

if(blocked) {
    console.log("The popup was blocked!");
}

```

在任何情况下，以上代码都可以检测出调用window.open()打开的弹出窗口是不是被屏蔽了。但要注意的是，检测弹出窗口是否被屏蔽只是一方面，它并不会阻止浏览器显示与被屏蔽窗口有关的信息。