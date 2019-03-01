# AJAX - 3

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---


## Comet

Comet是Alex  Russel发明的一个词儿，值的是一种更高级的Ajax技术，经常也被人称为服务器推送”）。

Ajax是一种从页面向服务器请求数据的技术，而Comet则是一种服务器向页面推送数据的技术。Comet能够让信息近乎实时地被推送到页面上，非常适合处理体育比赛的分数和股票报价。

有两种实现Comet的方式：长轮询和流。

长轮询是传统轮询的一个翻版，即浏览器定时向服务器发送请求，看有没有更新数据。

长轮询把短轮询颠倒了一下。页面发起一个到服务器的请求，然后服务器一直保持连接打开，直到有数据可发送。发送完数据之后，浏览器关闭连接，随即又发起一个到服务器的新请求。这一过程在页面打开期间一直持续不断。

无论是短轮询还是长轮询，浏览器都要在接收数据之前，先发起对服务器的连接。
两者最大的区别在于服务器如何发送数据。

短轮询是服务器立即发送响应，无论数据是否有效，而长轮询是等待发送有效的响应。
轮询的优势是所有浏览器都支持，因为使用XHR对象和setTimeout()就能实现。
而你要做的就是决定什么时候发送请求。

第二种流行的Comet实现是HTTP流。流不同域上述两种轮询，因为它在页面的整个生命周期内只使用一个HTTP连接。具体来说，就是浏览器向服务器发送一个请求，而服务器保持连接打开，然后周期性地向浏览器发送数据。

所有服务器端语言都支持答应到输出缓存然后刷新（将输出缓存中的内容一次性全部发送到客户端）的功能，而这正是实现HTTP流的关键所在。

在Firefox、Safari、Opera和 Chrome中，通过侦听 readystatechange 事件及检测 readyState 的值是否为3。当readyState 值变为3时，responseText属性就会保存接收到所有数据。

此时，就需要比较此前接收到的数据，决定从什么位置开始取得最新的数据。
使用XHR对象实现HTTP流的典型代码如下所示：

```
function createStreamingClient(url, progress, finished) {
    var xhr = new XMLHttpRequest(),
        received = 0;
    
    xhr.open("get", url, true);
    xhr.onreadystatechange = function(){
        var result;
        if(xhr.readyState === 3){
            //只取得新数据并调整计数器
            result = xhr.responseText.substring(received);
            received += result.length;
            progress(result);
        } else if (xhr.readyState ===  4) {
            finished(xhr.responseText);
        }
    }
    xhr.send(null);
    return xhr;
}


var client = createStreamingClient("straming.php", function(data){
    console.log("Received: " + data);
}, function(data){
    console.log("done");
});
```

这个createStreamingClient()函数接收三个参数: 要连接的URL、在接收到数据时调用的函数以及关闭连接时调用的函数。

有时候，当连接关闭时，很可能还需要重新建立，所以关注连接什么时候关闭还是有必要的。

只要readystatechange时间发生，而且readyState值为3,，就对responseText进行分割以取得最新数据。这里的receivedd变量用于记录已经处理了多少个字符，每次readyState值为3时都递增。然后，通过progress回调函数来处理传入的新数据。而当readyState值为4时，则执行finished回调函数，传入响应返回的全部内容。

虽然这个例子比较简单，而且也能在大多数浏览器中正常运行（IE除外），但管理Comet的连接是很容易出错，需要时间不断改进才能达到完美。

浏览器社区认为Comet是未来Web的一个重要组成部分，为了简化这一技术，又为Comet创建了两个新的接口。

## 服务器发送事件

SSE（Server-Sent Events，服务器发送事件）是围绕只读Comet交互推出的API或者模式。

SSE API用于创建到服务器的单向连接，服务器通过这个连接可以发送任意数量的数据。

服务器响应的MIME类型必须是text/event-stream，而且是浏览器中的JavaScript API能解析格式输出。

SSE支持短轮询、长轮询和HTTP流，而且能在断开连接时自动确定何时重新连接。

有了这么简单实用的API，再实现Comet就容易多了。

支持SSE的浏览器有Firefox 6+、Safari 5+、Opera 11+、Chrome和iOS 4+版 Safari。

1. SSE API

SSE的JavaScript API与其他传递信息的JavaScript API很相似。要预定新的事件流，首先要创建换一个新的EventSource对象，并传入一个入口点：

```
var source = new EventSource("myevents.php");
```

注意，传入的URL必须与创建对象的页面同源（相同的URL模式、域及端口）。
EventSourse的实例有一个readyState属性，值为0表示正连接到服务器，值为1表示打开了连接，值为2表示关闭了连接。

另外还有以下三个时间。

- open: 在建立连接时触发。
- message: 在从服务器接受到新事件时触发。
- error: 在无法建立连接时触发。

就一般的用法而言，onmessage事件处理程序也没有什么特别的。

```
source.onmessage = function(event){
    var data = event.data;
    //处理数据
};
```

负无穷发回的数据以字符串形式保存在event.data中。

默认情况下，EventSourse对象会保持与服务器的活动连接。
如果连接断开，还会重新连接。
这就意味着SSE适合长轮询和HTTP流。
如果想强制立即断开连接并且不再重新连接，可以调用close()方法。

```
source.close();
```

2. 事件流

所谓的服务器事件会通过一个持久的HTTP响应发送，这个响应的MIME类型为text/eventstream。响应的格式是纯文本，最简单的情况是每个数据项都带有前缀data:，例如：

```
//第一个message事件返回的event.data
data: foo

//第二个message事件返回的event.data
data: bar

//第三个message事件返回的event.data
data: foo
data: bar
```

通过id：前缀可以给特定的时间制定一个关联的ID,，这个ID行位于data：行前面或后面皆可：

```
data: foo
id: 1
```

设置了ID后，EventSource会跟踪上一次触发的事件。
如果连接断开，会向服务器发送一个包含名为Last-Event-ID的特殊HTTP头部的请求，以便服务器知道下一次该触发哪个事件。

在多次连接的事件流中，这种机制可以确保浏览器以正确的顺序收到连接的数据段。

## Web Sockets

要说最令人津津乐道的新浏览器API，就得数Web Sockets了。
Web Sockets的目标是在一个单独的持久连接上提供全双工、双向通信。
在JavaScript中创建了Web Socket之后，会有一个HTTP请求发送到浏览器以发起连接。
在取得服务器响应后，建立的连接会使用HTTP升级从HTTP协议交换为Web Socket协议。

也就是说，使用标准的HTTP服务器无法实现Web Sockets，只有支持这种协议的专门服务器才能正常工作。

由于Web Sockets使用了自定义的协议，所以URL模式也略有不同。
未加密的连接不再是http://，而是ws://；
加密的连接也不是https://，而是wss://。
在使用Web Socket URL时，必须带着这个模式，因为将来还有可能支持其他模式。

使用自定义协议而非HTTP协议的好处是，能够在客户端和服务器之间发送非常少量的数据，而不必担心HTTP那样字节级的开销。由于传递的数据包很小，因此Web Sockets非常适合移动应用。毕竟对移动应用而言，带宽和网络延迟都是关键问题。

使用自定义协议的缺点在于，制定协议的时间比制定JavaScript API的时间还要长。

Web Sockets曾几度搁浅，就因为不断有人发现这个新协议存在一致性和安全性问题。

Firefox 4 和 Opera 11都曾默认启用Web Sockets，但在发布前夕又禁用了，因为又发现了安全隐患。目前支持Web Sockets的浏览器有Firefox 6+、Safari 5+、Chrome和iOS 4+版 Safari。

1. Web Sockets API

要创建Web Socket，先实例一个WebSocket对象并传入要连接的URL：

```
var socket = new WebSocket("ws://www.example.com/server.php");
```

注意，必须给WebSocket构造函数传入绝对URL。
同源策略对Web Sockets不适用，因此可以通过它打开到任何站点的连接。
至于是否会与某个域中的页面通信，则完全取决于服务器。
（通过握手信息可以知道请求来自何方）。

实例化了WebSocket对象后，浏览器会马上尝试创建连接。
与XHR类似，WebSocket也有一个表示当前状态的readyState属性。
不过，这个属性的值与XHR并不相同。

- WebSocket.OPENING(0): 正在建立连接。

- WebSocket.OPEN(1): 已经建立连接。

- WebSocket.CLOSING(2): 正在关闭连接。

- WebSocket.CLOSE(3): 已经关闭连接。

WebSocket没有 readystatechange事件；不过，它有其他事件，对应着不同的状态。
readyState的值永远从0开始。

要关闭Web Socket连接，可以在任何时候调用close()方法。

```
socket.close();
```

调用了close()之后，readyState的值立即变为2（正在关闭），而在关闭连接后就会变成3。

2. 发送和接收数据

Web Socket打开之后，就可以通过连接发送和接收数据。
要向服务器发送数据，使用send()方法并传入任意字符串。

```
var socket = new WebSocket("ws://www.example.com/server.php/");
socket.send("Hello World");
```

因为Web Sockets只能通过连接发送纯文本数据，所以对于复杂的数据结构，在通过连接发送之前，必须进行序列化。

下面的例子展示了先将数据序列化为一个JSON字符串，然后再发送到服务器：

```
var message = {
    time: new Date(), //Tue Dec 25 2018 local time
    text: "Hello world!",
    clientId:"asdfp8734rew"
};

socket.send(JSON.stringify(message)); // message 2018-12-25T01:53:00Z"
```

接下来，服务器要读取其中的数据，就要解析接收到的JSON字符串。

当服务器向客户端发来消息时，WebSocket对象就会触发message事件。
这个message事件与其他传递信息的协议类似，也是把返回的数据保存在event.data属性中。

```
socket.onmessage = function(event) {
    var data = event.data;

    //处理数据
}
```

与通过send()发送到服务器的数据一样，event.data中返回的数据也是字符串。
如果你想得到其他格式的数据，必须手工解析这些数据。

3. 其他事件

WebSocket对象还有其他三个事件，在连接生命周期的不同阶段触发。

- open: 在成功建立连接时触发。

- error：在发生错误时触发，连接不能持续。

- close：在连接关闭时触发。

WebSocket 对象不支持DOM2级事件侦听器，因此必须使用DOM 0级语法分别定义每个事件处理程序。

```
var socket = new WebSocket("ws://www.example.com/server.php");

socket.onopen = function(){
    console.log("Connection established");
};

socket.onerror = function(){
    console.log("Connection error.");
};

socket.onclose = function(event){
    console.log("Connection closed.");
}
```

在这三个事件中，只有close事件的event对象有额外的信息。
这个事件的事件对象有三个额外的属性：wasClean、code 和 reason。

其中，wasClean是一个布尔值，表示连接是否已经明确地关闭；
code是服务器返回的数值状态码；
而reason是一个字符串，包含服务器发回的消息。
可以把这些信息显示给用户，也可以记录到日志中以便将来分析。

```
socket.onclose = function(event) {
    console.log("Was clean? " + event.wasClean + " Code=" + event.code + " Reason=" + event.reason);
};
```

### SSE与Web Sockets

面对某个具体的用例，在考虑是使用SSE还是使用Web Sockets时，可以考虑如下几个因素。

首先，你是否有自由度建立和维护Web Sockets服务器？

因为Web Socket协议不同于HTTP，所以现有服务器不能用于Web Socket通信。

SSE倒是通过常规HTTP通信，因此现有服务器就可以满足需求。

第二个要考虑的问题是到底需不需要双向通信。
如果用例只需读取服务器数据（如比赛成绩），那么SSE比较容易实现。

如果用例必须双向通信（如聊天室），那么 Web Sockets 显然更好。

别忘了，在不能选择Web Sockets的情况下，组合XHR和SSE也是能实现双向通信的。

## 安全

讨论Ajax和Comet安全的文章可谓连篇累牍，而相关主题的书也已经出了很多本了。
大型Ajax应用程序的安全问题涉及面非常之广，但我们可以从普遍意义上探讨一些基本的问题。

首先，可以通过XHR访问的任何URL也可以通过浏览器或服务器来访问。
下面的URL就是一个例子：

```
/getuserinfo.php?id=23
```

如果是向这个URL发送请求，可以想象结果会返回ID为23的用户的某些数据。
谁也无法保证别人不会将这个URL的用户ID修改为24、56或其他值。

因此，getuserinfo.php文件必须知道请求者是否有权限访问要请求的数据；
否则，你的服务器就会门户大开，任何人的数据都可能被泄漏出去。

对于未授权系统有权访问某个资源的情况，我们称之为CSRF（Cross-Site Request Forgery，跨站点请求伪造）。

未被授权系统会伪装自己，让处理请求的服务器认为它是合法的。

受到CSRF攻击的Ajax程序有大有小，攻击行为既有旨在揭示系统漏洞的恶作剧，也有恶意的数据窃取或数据销毁。

为确保通过XHR访问的URL安全，通行的做法就是验证发送请求者是否有权限访问相应的资源。有下列几种方式可供选择。

- 要求以SSL连接来访问可以通过XHR请求的资源。

- 要求每一次请求都要附带经过相应算法计算得到的验证码。

要注意，下列措施对防范CSRF攻击不起作用。

- 要求发送POST而不是GET请求—很容易改变。
- 检查来源URL以确定是否可信—来源记录很容易伪造。
- 基于cookie信息进行验证—同样很容易伪造。

XHR对象也提供了一些安全机制，虽然表面还是哪个看可以保证安全，但实际上却相当不靠谱。实际上，前面介绍的open()方法还能再接收两个参数: 要随请求一起发送的用户名和密码。

带有这两个参数的请求可以通过SSL发送给服务器上的页面，如下面的例子所示。

```
xhr.open("get", "example.php", true, "username", "password"); //不要这么做
```

## 小结

Ajax是无需刷新页面就能够从服务器取得数据的一种方法。
关于Ajax，可以从以下几方面来总结一下。

- 负责Ajax运作的核心对象是XMLHttpRequest(XHR)对象。

- XHR对象由微软最早在IE5中引入，用于通过JavaScript从服务器取得XML数据。

- 在此之后，Firefox、Safari、Chrome和Opera都实现了相同的特性，使XHR成为了Web的一个事实标准。

- 虽然实现之间存在差异，但XHR对象的基本用法在不同浏览器间还是相对规范的，因此可以放心地用在Web开发当中。

同源策略是对XHR的一个主要约束，它为通信设置了“相同的域、相同的端口、相同的协议"这一限制。

试图访问上述限制之外的资源，都会引发安全错误，除非采用被认可的跨域解决方案。

这个解决方案叫做CORS（Cross-Origin Resourse Sharing，跨域资源共享），IE8通过XDomainRequest对象支持CORS，其他浏览器通过XHR对象原生支持CORS。

图像Ping和JSONP是另外两种跨域通信的技术，但不如CORS稳妥。

Comet是对Ajax的进一步扩展，让服务器几乎能够实时地向客户端推送数据。
实现Com儿童的手段主要有两个：长轮询和HTTP流。

所有浏览器都支持长轮询，而只有部分浏览器原生支持HTTP流。
SSE（Server-Sent Events，服务器发送事件）是一种实现Comet交互的浏览器API，既支持长轮询，也支持HTTP流。

Web Sockets是一种与服务器进行全双工、双向通信的信道。
与其他方案不同，Web Sockets不适用HTTP协议，而使用一种自定义的协议。
这种协议专门为快速传输小数据而设计。
虽然要求使用不同的Web服务器，但却具有速度上的优势。