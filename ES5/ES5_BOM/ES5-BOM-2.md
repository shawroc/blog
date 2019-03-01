gi# BOM-2

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 间歇调用和超时调用

**JavaScript是单线程语言，但它允许通过设置超时值和间歇时间值来调度代码在特定的时刻执行（挂起）。**前者是在指定的时候过后执行代码，而后者则是每隔指定的时间就执行一次代码。

超时调用需要使用**window对象的setTimeout()方法，它接受两个参数：要执行的代码和以毫秒表示的时间（即在执行代码前需要等待多少毫秒）。其中，第一个参数可以是一个包含JavaScript代码字符串(就和在eval()函数中使用的字符串一样)，也可以是一个函数。

```
//不建议传递字符串
setTimeout("alert('Hello World')",1000);

//推荐的调用方式
setTimeout(function(){
    console.log(this); //window
}, 1000)
```

虽然这两种调用方式都没有问题，但由于传递字符串可能导致性能缺失，因此不建议以字符串作为第一个参数。

第二个参数是一个表示等待多长时间的毫秒数，但经过该时间后指定的代码不一定会执行。

**JavaScript是一个单线程的解释器，因此一定时间内只能执行一段代码。为了控制要执行的代码，就有一个JavaScript任务队列。**

这些任务会按照将它们添加到队列的顺序执行。setTimeout()的第二个参数告诉JavaScript再过多长时间把当前任务添加到任务队列的顺序执行。

**如果队列是空的，那么添加的代码会立即执行，如果队列不是空的，那么它就要等前面的代码执行完了再执行。**

**调用setTimeout()之后，该方法会返回一个数值ID，表示超时调用。**

**这个超时调用ID是计划执行代码的唯一标识符，可以通过它来取消超时调用。**

要取消尚未执行的超时调用计划，可以调用clearTimeout()方法并将相应的超时调用ID作为参数传递给它。

```
//设置超时调用
var timeoutId = setTimeout(function(){
    console.log('hello world');
}, 1000);

//把它取消
clearTimeout(timeoutId);
```

只要是在指定的时间尚未过去之前调用clearTimeout()，就可以完全取消超时调用。前面的代码在设置超时调用之后马上又调用了clearTimeout()，结果就跟什么也没有发生一样。

**超时调用的代码都是在全局作用域中执行的，因此函数中this的值在非严格模式下指向window对象，在严格模式下是undefined。**

间歇调用与超时调用类似，只不过它会按照指定的时间间隔重复执行代码，直至间歇调用被取消或页面被卸载。

**设置间歇调用的方法是setInterval()，它接受的参数与setTimeout()相同：要执行的代码（字符串或函数）和每次执行之前需要等待的毫秒数。**

```
//不建议传字符串
setInterval("alert('hello world')", 1000);

//推荐的调用方式
setInterval(function(){
    console.log('hello wolrd');
}, 1000)
```

调用setInterval()方法同样也会返回一个间歇调用ID，该ID可用于在将来某个时刻取消间歇调用。要取消尚未执行的间歇调用，可以使用clearInterval()方法并传入相应的间歇调用ID。**取消间歇调用的重要性要远远高于取消超时调用，因为在不加干涉的情况下，间歇调用将会一直执行到页面卸载。**

```
var num = 0;
var max = 10;
var intervalId = null;

function incrementNumber(){
    num ++;

    //如果执行次数达到了max设定的值，则取消后续尚未执行的调用
    if(num = max) {
        clearInterval(intervalId);
        console.log("done!");
    }
}

intervalId = setInterval(incrementNumber, 500);
```

在这个例子中，变量num没半秒递增一次，当递增到最大值时就会取消先前的间歇调用。

**这个模式也可以使用超时调用来实现。**

```
var num = 0;
var max = 10;

function incrementNum(){
    num ++;
    if(num <= max) {
        setTimeout(incrementNum, 500);
        console.log(num);
    } else {
        console.log("done!");
    }
}

setTimeout(incrementNum, 500);
```

可见，**在使用超时调用时，没有必要跟踪超时调用ID，因为每次执行代码之后，如果不再设置另一次超时调用，调用就会自动停止。**

一般认为，**使用超时调用来模拟间歇调用的是一种最佳模式。**

在开发环境下，很少使用真正的间歇调用，原因是后一个间歇调用可能会在前一个调用结束之前启动。而像前面例子中那样使用超时调用，则完全可以避免这一点。**最好不要使用间歇调用。**

## 系统对话框

浏览器通过alert()、confirm()和prompt()方法可以调用系统对话框向用户显示消息。
系统对话框与在浏览器中显示的网页没有关系，也不包含HTML。

**它们的外观由操作系统及（或）浏览器设置决定，而不是由CSS决定。此外，通过这几个方法打开的对话框都是同步和模态的。**

**也就是说，显示这些对话框的时候代码会停止执行，而关掉这些对话框后代码又会恢复执行。**

经常用到的alert()方法，这个方法接受一个字符串并将其显示给用户。具体来说，调用alert()方法的结果就是向用户显示一个系统对话框，其中包含指定的文本和一个OK（“确定”）按钮。

第二种对话框是调用confirm()方法生成的。从向用户显示消息的方面来看，这种“确认”对象很像一个“警告”对话框。但二者的主要区别在于“确认”对话框除了显示OK按钮外，还会显示一个Cancel（“取消”）按钮，两个按钮可以让用户决定是否执行给定的操作。

为了确定用户是点击了OK还是Cancel，可以检查confirm()方法返回的布尔值：true表示单击了OK，false表示单击了Cancel或单击了右上角的X按钮。确认对话框的典型用法如下。

```
if(confirm("Are you sure?")) {
    console.log("I am so glad to meet you!");
} else {
    console.log("see you next time!")
}

```

在这个例子中，第一行代码(if条件语句)会向用户显示一个确认对话框。
如果用户点击了OK，则通过控制台"I am so glad to meet you!"。如果用户点击的是Cancel按钮，则通过控制台"see you next time!"。这种模式经常在用户要执行删除操作的时候使用，例如删除电子邮件。

最后一种对话框是通过prompt()方法生成，这是一个“提示”框，用于提示用户输入一些文本。提示框中除了显示OK和Cancel按钮之外，还会显示一个文本输入域，以供用户在其中输入内容。prompt()方法接受两个参数：要显示给用户的文本提示和文本输入域的默认值（可以是一个空字符串）。

如果用户单击了OK按钮，则prompt()返回文本输入域的值；如果用户单击了Cancel或没有点击OK而是通过其他方式关闭了对话框，则该方法返回null。

```
var result = prompt("What is your name?", ""); //返回是用户输入的字符串值

if(result != null) {
    console.log("welcome " + result);
}

```

这些系统对话框很适合向用户显示消息并请用户作出决定。
**由于不涉及HTML、CSS和JavaScript，因此它们是增强Web应用程序的一种便捷方式。**

除了上述三种对话框之外，Google Chrome浏览器还引入了一种新特性。如果当前脚本在执行过程中会打开两个或多个对话框，那么从第二个对话框开始，每个对话框中都会显示一个复选框，以便用户阻止后续的对话框显示，除非用户刷新页面。

如果用户勾选了其中的复选框，并且关闭了对话框，那么除非用户刷新页面，所有后续的系统对话框（包括警告框、确认框和提示框）都会被屏蔽。Chrome没有就对话框是否显示，向开发人员提供任何信息。

**由于浏览器会在空闲时重置对话框计算器，因此如果两个独立的用户操作分别打开两个警告框，那么这两个警告框中都不会显示复选框。而如果是同一次用户操作会生成两个警告框，那么第二个警告框中就会显示复选框。这个新特性出现以后，IE9和Firefox4也实现了它。**

还有两个可以通过JavaScript打开的对话框，即“查找”和“打印”。这两个对话框都是异步显示的，能够将控制权立即交还给脚本。这两个对话框与用户通过浏览器菜单的“查找”和“打印”命令打开的对话框相同。而在JavaScript中则可以像下面这样通过window对象的find()和print()方法打开它们。

```
//显示“打印”对话框
window.print();

//显示"查找”对话框
window.find();
```

这两个方法同样不会就用户在对话框中的操作给出任何信息，因此它们的用处有限。另外，这两个对话框是异步显示的，那么Chrome的对话框计数器就不会将它们计算在内，它们不会受用户禁用后续对话框显示的影响。

## location对象

##location是最有用的BOM对象之一，它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。**

事实上，location对象是很特别的一个对象，因为它既是window对象的属性，也是document对象的属性。也就是说，**window.location和document.location引用的是同一个对象。**

**location对象的用处不只表现在它保存着当前文档的信息，还表现在它将URL解析为独立的片段，让开发人员可以通过不同的属性访问这些片段。**

下表为location对象的所有属性

|属性名|例子|说明|
|:-:|:-:|:-:|
|hash|"#content"|返回URL中的hash（#号后跟零或多个字符），如果URL中不包含散列，则返回空字符串|
|host|"www.worx.com:80|返回服务器名称和端口号（如果有）|
|hostname|"www.worx.com"|返回不带端口号的服务器名称|
|href|"http://www.worx.com"|返回当前加载页面的完整URL。而location对象的toString()方法也返回这个值|
|pathname|"/WileyCDA/"|返回URL中的目录和文件名|
|port|"8080"|返回URL中指定的端口号。如果URL中不包含端口号，则这个属性返回空字符串|
|protocol|"http:"|返回页面使用的协议。通常是http:或https:|
|search|"?q=javascript"|返回URL的查询字符串。这个字符串以问号开头|

1. 查询字符串参数

虽然通过上面的属性可以访问到location对象的大多数信息，但其中访问URL包含的查询字符串的属性并不方便。尽管location.search返回从问号到URL末尾的所有内容，但却没有办法逐个访问其中的每个查询字符串参数。

可以像下面这样创建一个函数，用以解析查询字符串，然后返回所有参数的一个对象：

```
function getQueryStringArgs() {
    //取得查询字符串并去掉开头的问号
    var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
    args = {},
    items = qs.length ? qs.split("&") : [],
    item = null,
    name = null,
    value = null,
    i =0,
    len = items.length;

    //逐个将每一项添加到args对象中。
    for(var i = 0; i < len; i++) {
        item = item[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);

        if(name.length) {
            args[name] = value;
        }
    };

    return args;
}
```

这个函数的第一步是先去掉查询字符串开头的问号。当然，前提是location.search中必须要包含一或多个字符。然后。所有参数将被保存在args对象中，该对象以字面量形式创建。接下来，根据和号（&）来分隔查询字符串，并返回name=value格式的字符串数组。下面的for循环会迭代这个数组，然后再根据等于号分割每一项，从而返回第一项为参数名，第二项为参数值的数组。再使用decodeURIComponent()分别解码name和value（浏览器会给查询字符串编码）。最后，将name作为args对象的属性，将value作为相应属性的值。

```
//假设查询字符串是?q=javascript&num=10

var args = getQueryStringArgs();

console.log(args[q]); //"javascript"
console.log(args[num]); //"10"
```

可见，每个查询字符串参数都成了返回对象的属性。这样就极大方便了对每个参数的访问。

2. 位置操作

使用location对象可以通过很多方式改变浏览器的位置。首先，也是最常用的方式，就是assign()方法并为其传递一个URL。

```
location.assign("http://www.google.com");
```

这样，就可以立即打开新URL并在浏览器的历史记录中生成一条记录。如果是将window.location或location.href设置为一个URL值，也会以该值调用assign()方法。

```
window.location = "http://www.worx.com";
location.href = "http://www.worx.com";
```

在这些改变浏览器位置的方法中，最常用的是设置location.href属性。

另外，修改location对象的其他属性也可以改变当前加载的页面。

```
//假设初始URL为http://www.wrox.com/cda/

//将URL修改为"http://www.worx.com/cda/#section1
location.hash = "#section1";

//将URL修改为"http://www.worx.com/cda/?q=javascript
location.search = "?q=javascript";

//将URL修改为"http://www.yahoo.com/cda/"
location.hostname = "www.yahoo.com";

//将URL修改为"http://www.yahoo.com/mydir"
location.pathname = "mydir"

//将URL修改为"http://www.yahoo.com:8080/cda/"
location.port = "8080";
```

**每次修改location的属性（hash除外），页面都会以新URL重新加载。**

**在IE8、Firefox1、Safari 2+、Opera 9+和Chrome中，修改hash的值会在浏览器的历史记录中生成一条新记录。**在IE的早期版本中，hash属性不会用户点击“后退”和“前进”按钮时被更新，而只会在用户点击包含hash的URL时才会被更新。

当通过上述任何一种方式修改URL之后，浏览器的历史记录中就会生成一条新记录，因此用户通过点击“后退”都会导航到前一个页面。要禁用这种行为，可以使用replace()方法。这个方法只接受一个参数，即要导航到的URL；结果虽然会导致浏览器位置改变，但不会在历史记录中生成新记录。在调用replace()方法之后，用户不能回到前一个页面。

```
<!DOCTYPE html>
<html>
    <head>
        <title>Example Page</title>
    </head>
    <body>
        <p>Enjoy the page for a second, because you won't be coming back here</p>
        <script>
            setTimeout(function(){
                location.replace("http://www.worx.com");
            }, 1000)
        </script>
    </body>
</html>
```

如果将这个页面加载到浏览器中，浏览器就会在1秒钟重新定向到www.worx.conm。然后，“后退”按钮处于禁用状态，如果不重新输入完整的URL，则无法返回示例页面。

与位置有关的最后一个方法是reload()，作用是重新加载当前显示的页面。如果调用reload()，作用是重新加载当前显示的页面。如果调用reload()，不传递任何参数，页面就会以最有效的方式重新加载。也就是说，**如果页面自上次请求以来并没有改变过，页面就会从浏览器缓存中重新加载。****如果要强制从服务器重新加载，则需要像下面这样为该方法传递参数true。**

```
location.reload(); //重新加载（有可能从缓存中加载）
location.reload(true); //重新加载（从服务器重新加载）
```

位于reload()调用之后的代码可能会也可能不会执行，这要取决于网络延迟或系统资源等因素。为此，最好将reload()放在代码的最后一行。

## navigator对象

最早由Netscape Navigator 2.0引入的navigator对象，现在已经成为了识别客户端浏览器的事实标准。虽然其他浏览器也通过其他方式提供了现年共同或相似的信息（例如，IE中的window.clientInformation和Opera中的window.opera)，但navigator对象却是所有支持JavaScript的浏览器所共有的。与其他BOM对象的情况一样，每个浏览器中的navigator对象也都有一套自己的属性。

下表为存在于所有浏览器中的属性和方法，以及支持它们的浏览器版本。

查询兼容性![Can I Use](caniuse.com)

|属性或方法|说明|
|:-:|:-:|:-:|:-:|:-:|:-:|
|appCodeName|浏览器的名称。通常是Mozilla，即使在非Mozilla浏览器中也是如此|
|appMinorVersion|次版本信息|
|appName|完整的浏览器名称|
|appVersion|浏览器的版本。一般不与实际的浏览器版本对应|
|buildID|浏览器编译版本|
|cookieEnabled|表示cookie是否启用|
|cpuClass|客户端计算机使用的CPU类型（x86、68k、Alpha、PPC或Other|
|javaEnabled|表示当前浏览器中是否启用了Java|
|language|浏览器的主语言|
|mimeType|在浏览器中注册的MIME类型数组|
|onLine|表示浏览器是否连接到了因特网|
|oscpu|客户端计算机的操作系统或使用的CPU|
|platform|浏览器所在的系统平台|
|plugins|浏览器中安装的插件信息的数组|
|preference()|设置用户的首选项|
|productSub()|关于产品的次要信息（如Gecko版本）|
|registerContentHandler()|针对特定的MIME类型将一个站点注册为处理程序|
|registerProtocolHandler()|针对特定的协议将一个站点注册为处理程序|
|systemLanguage|操作系统的语言|
|userAgent|浏览器的用户代码字符串|
|userLanguage|操作系统的默认语言|
|userProfile|借以访问用户个人信息的对象|
|vendor|浏览器的品牌|
|vendorSub|有关供应商的次要信息|

表中的这些navigator对象的属性通常用于检测显示网页的浏览器类型。