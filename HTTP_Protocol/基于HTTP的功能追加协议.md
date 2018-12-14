# 基于HTTP的功能追加协议

---
绝大多数内容引自《图解HTTP》
---

虽然HTTP协议既简单又便捷，但随着时代的发展，其功能使用上捉襟见肘的疲态已经凸显。

## 基于HTTP的协议

在建立 HTTP标准规范时，制定者主要想把HTTP 当做传输HTML 文档的协议。随着时代的发展，Web更具多样性，比如演化成在线购物网站、SNS、企业或组织内部的各种管理工具，等等。

而这些网站所追求的功能可通过Web应用和脚本程序实现。即使这些已经满足需求，但性能上却未必最优，这是因为HTTP协议上的限制以及自身性能有限。

HTTP功能上的不足可通过创建一套全新的协议来弥补。

可是基于HTTP的Web浏览器的使用环境已遍布全球，因此无法完全抛弃HTTP。有一些新协议的规则是基于HTTP的，并在此基础上添加了新的功能。

## 消除HTTP瓶颈的SPDY

Google 在2010年发布了SPDY（取自SPeeDY，发音同speedy)，其开发目标旨在解决  HTTP的性能瓶颈，缩短Web页面的加载时间（50%）。

-  SPDY - The Chromium Projects

### HTTP 的瓶颈

在Facebook 和 Twitter 等SNS 网站上，几乎能够实时观察到海量用户公开发布的内容，这也是一种乐趣。当几百、几千万的用户发布内容时，Web网站为了保存这些新增内容，在很短的时间内就会产生大量的内容更新。

为了尽可能实时地显示这些更新的内容，服务器上一有内容更新，就需要直接把那些内容反馈到客户端的界面上。虽然看起来简单，但HTTP却无法妥善地处理好这项任务。

使用HTTP 协议探知服务器上是否有内容更新，就必须频繁地从客户端到服务器端进行确认。如果服务器上没有内容更新，那么就会产生徒劳的通信。

若想在现有Web 实现所需的功能，以下这些HTTP标准就会成为瓶颈。

- 一条连接上只可发送一个请求、
- 请求只能从客户端开始。客户端不可以接收除响应以外的指令。
- 请求/响应首部未经压缩就发送。首部信息越多延迟越大。
- 发送冗长的首部。每次互相发送相同的首部造成的浪费较多。
- 可任意选择数据压缩格式。非强制压缩发送。

**Ajax的解决办法**

Ajax（Asynchronous JavaScript and XML，异步JavaScript与 XML 技术）是一种有效利用JavaScript 和 DOM（Document Object Model，文档对象模型）的操作，以达到局部Web页面替换加载的异步通信手段。和以前的同步通信相比，由于它只更新一部分页面，响应中传输的数据量因此而减少，这一优点显而易见。

Ajax的核心技术是名为 XMLHttpRequest的API，通过JavaScript 脚本语言的调用就能和服务器进行HTTP通信。借由这种手段，就能从已加载完毕的Web页面上发起请求，只更新局部页面。

而利用Ajax 实时地从服务器获取内容，有肯能会导致大量请求产生。另外，Ajax仍未解决HTTP协议本身存在的问题。

**Comet 的解决方法**

一旦服务器端有内容更新了，Comet不会让请求等待，而是直接给客户端返回响应。这是一种通过延迟应答，模拟实现服务器端向客户端推送（Server Push）的功能。

通常，服务器端接收到请求，在处理完毕后就会立即返回响应，但为了实现推送功能，Comet会先将响应置于挂起状态，当服务器有内容更新时，再返回该响应。因此，服务器端一旦有更新，就可以立即反馈给客户端。

内容上虽然可以做到实时更新，但为了保留响应，一次连接的持续时间也变长了。期间，为了维持连接会消耗更多的资源。另外，Comet 也仍未解决HTTP协议本身存在的问题。

**SPDY 的目标**

陆续出现的Ajax和Comet等提高易用性的技术，一定程序上使HTTP得到了改善，但HTTP协议本身的限制也令人有些束手无策。为了进行根本性的改善，需要有一些协议层面上的改动。

处于持续开发状态中的SPDY协议，正是为了在协议级别消除HTTP 所遭遇的瓶颈。

### SPDY的设计与功能

SPDY没有完全改写HTTP协议，而是在TCP/IP的应用层与运输层之间通过新加会话层的形式运作。同时，考虑到安全性问题，SPDY规定通信中使用SSL。

SPDY以会话层的形式加入，控制对数据的流动，但还是采用HTTP建立通信连接。因此，可照常使用HTTP的GET和POST等方法、Cookie以及HTTP报文等。

```
//SPDY的设计
HTTP 应用层
SPDY 会话层
SSL 表示层
TCP 传输层
```

使用SPDY后，HTTP协议额外获得以下功能

**多路复用流**

通过单一的TCP连接，可以无限制处理多个HTTP请求。所有请求的处理都在一条TCP连接上完成，因此TCP的处理效率得到提高。

**赋予请求优先级**

SPDY不仅可以无限制地并发处理请求，还可以给请求逐个分配优先级顺序。这样主要是为了在发送多个请求时，解决因带宽低而导致响应变慢的问题。

**压缩HTTP首部**

压缩HTTP请求和响应的首部。这样一来，通信产生的数据包数量和发送的字节数就更少了。

**推送功能**

支持服务器主动向客户端推送数据的功能。这样，服务器可直接发送数据，而不必等待客户端的请求。

**服务器提示功能**

服务器可以主动提示客户端请求所需的资源。由于在客户端发现资源之前就可以获知资源的存在，因此在资源已缓存等情况下，可以避免发送不必要的请求。

### SPDY 消除 Web 瓶颈了吗

希望使用 SPDY时，Web的内容不必做什么特别改动，而Web浏览器及Web服务器都要为对应SPDY做出一定程度上的改动。有好几家Web浏览器已经针对SPDY 做出了相应的调整。另外，Web服务器也进行了实验性质的应用，但把该技术导入实际的Web网站却进展不佳。

因为SPDY基本上只是将单个域名（IP地址）的通信多路复用，所以当一个Web网站上使用多个域名下的资源，改善结果就会受到限制。

SPDY 的确是一种可有效消除HTTP瓶颈的技术，但很多Web网站存在的问题并非仅仅是由HTTP瓶颈所导致。对Web本身的速度提升，还应该从其他可细致钻研的地方入手，比如改善Web内容的编写方式。

## 使用浏览器进行全双工通信的WebSocket

利用Ajax和Comet技术进行通信可以提升Web的浏览速度。但问题在于通信若使用HTTP协议，就无法彻底解决瓶颈问题。WebSocket网络技术正是为解决这些问题而实现的一套新协议及API。

当时筹划将WebSocket作为HTML5标准的一部分，而现在它却逐渐变成了独立的协议标准。WebSocket 通信协议在 2011年12月11日，被RFC 6455 - The WebSocket Protocol 定为标准。

### WebSocket的设计与功能

WebSocket，即Web浏览器与Web服务器之间全双工通信标准。其中，WebSocket协议由IETF定为标准，WebSocket API 由 W3C 定为标准。仍在开发中的WebSocket 技术主要是为了解决 Ajax和 Comet 里 XMLHttpRequest 附带的缺陷所引起的问题。

### WebSocket协议

一旦Web服务器与客户端之间建立起WebSocket协议的通信连接，之后所有的通信都依靠这个专用协议进行。通信过程中可互相发送JSON、XML、HTML或图片等任意格式的数据。

由于是建立在HTTP基础上的协议，因此连接的发起方仍是客户端，而一旦确立 WebSocket 通信连接，不论服务器还是客户端，任意一方都可直接向对方发送报文。

WebSocket协议的主要特点。

**推送功能**

支持由服务器向客户端推送数据的推送功能。这样，服务器可直接发送数据，而不必等待客户端的请求。

**减少通信量**

只要建立起 WebSocket 连接，就希望一直保持连接状态。和HTTP相比，不但每次连接时的总开销减少，而且由于WebSocket的首部信息很小，通信量也相应减少了。

为了实现WebSocket通信，在HTTP连接建立之后，需要完成一次“握手”（Handshaking）的步骤。

- 握手 请求

为了实现WebSocket 通信，需要用到HTTP的Upgrade 首部字段，告知服务器通信协议发生变化，以达到握手的目的。

```
GET/ chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIhbXBsZSBub25jZQ==
Origin: http:// example.com
Sec-WebSocket-Protocol: chat, superchat
Sec-WebScoket-Version: 13
```

Sec-WebSocket-Key字段内记录着握手过程中必不可少的键值。
Sec-WebSocket-Protocol 字段内记录使用的子协议。

子协议按WebSocket协议标准在连接分开使用时，定义那些连接的名称、

- 握手 响应

对于之前的请求，返回状态码101 Switching Protocols的响应。

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLXXXXXXxxx=
Sec-WebSocket-Protocol: chat
```

Sec-WebSocket-Accept 的字段值是由握手请求中的Sec-WebSocket-Key的字段值生成的。

成功握手确定 WebSocket 连接之后，通信时不再使用HTTP的数据帧，而采用 WebSocket 独立的数据帧。

- WebSocket API

JavaScript 可调用“The WebSocket API”（http://www.w3.org/TR/websockets/，由W3C标准制定）内提供的WebSocket程序接口，以实现WebSocket协议下全双工通信。

以下为调用WebSocket API，每 50ms 发送一次数据的实例。

```
var socket = new WebSocket('ws://game.example.com:12010/updates');

socket.onopen = function(){
    setInterval(function(){
        if(socket.bufferdAmout == 0) {
            socket.send(getUpdateData());
        }
    }, 50)
};
```

## 期盼已久的 HTTP/2.0

目前主流的HTTP/1.1 标准，自1999年发布的RFC2616之后再未进行过修订。SPDY 和 WebSocket 等技术纷纷出现，很难断言 HTTP/1.1 仍是 适用于当下的Web的协议。

负责互联网技术标准的 IETF（Internet Engineering Task Force，互联网工程任务组）创立 httpbis（Hypertext Transfer Protocol Bis， http：//datatracker.ietf.org/wg/httpbis/）工作组，其目标是推进下一代HTTP——HTTP/2.0 在2014年11月实现标准化。

**HTTP/2.0的特点**

HTTP/2.0的目标是改善用户在使用Web时的速度体验。由于基本上都会先通过 HTTP/1.1 与 TCP 连接，现在以下面的这些协议为基础，探讨一下它们的实现方法。

- SPDY

- HTTP Speed + Mobility

- Network-Friendly HTTP Upgrade

HTTP Speed + Mobility 由微软公司起草，是用于改善并提高移动通信时的通信速度和性能的标准。它建立在Google 公司提出的SPDY 与 WebSocket的基础之上。

Network-Friendly HTTP Upgrade 主要是在移动端通信时改善HTTP性能的标准。

**HTTP/2.0的7项技术及讨论**

HTTP/2.0 围绕着主要的7项技术进行讨论，现阶段（2012年8月13日），大都倾向于采用以下协议的技术。但是，讨论仍在持续，所以不能排除会发生重大改变的可能性。

|压缩|SPDY、Friendly|
|多路复用|SPDY|
|TLS7义务化|Speed + Mobility|
|协商|Speed Mobility, Friendly|
|客户端拖拽（Client Pull)/ 服务器推送(Sever Push)|Speed + Mobility|
|流量控制|SPDY|
|Websocket| Speed + Mobility|

**HTTP Speed + Mobility 简写为 Speed +  Mobility，Network Friendly HTTP Upgrade 简写为Friendly。**

## Web服务器管理文件的WebDAV

WebDAV(Web-based Distributed Authoring and Versioning， 基于万维网的分布式创作和版本控制)是一个可对Web服务器上的内容直接进行文件复制、编辑等操作的分布式文件系统。

它作为扩展 HTTP/1.1 的协议定义在RFC4918。

除了创建、删除文件等基本功能，它还具备文件创建者管理、文件编辑过程中禁止其他用户内容覆盖的加锁功能，以及对文件内容修改的版本控制功能。

使用HTTP/1.1的PUT方法和DELETE方法，就可以对Web服务器上的文件进行创建和删除操作。可是出于安全性及便捷性等考虑，一般不使用。


### 扩展 HTTP/1.1的 WebDAV

针对服务器上的资源，WebDAV 新增加了一些概念，如下所示。

- 集合（Collection)：是一种统一管理多个资源的概念。以集合为单位可进行各种操作。也可实现类似集合的集合这样的叠加。

- 资源（Resource)：把文件或集合称为资源。

- 属性（Property）：定义资源的属性。定义以“名称 = 值”的格式进行。

- 锁（Lock）：把文件设置成无法编辑状态。多人同时编辑时，可防止在同一事件进行内容写入。

#### WebDAV内新增的方法及状态码

WebDAV 为实现远程文件管理，向HTTP/1.1 中追加了一下这些方法。

- PROPFIND: 获取属性
- PROPPATCH: 修改属性
- MKCOL: 创建集合
- COPY: 赋值资源及属性
- MOVE: 移动资源
- LOCK: 资源加锁
- UNLOCK：资源解锁

为配合扩展的方法，状态码也随之扩展。

102 Proccessing: 可正常处理请求，但目前是处理了中状态

207 Multi-Status: 存在多种状态

422 Unprocessible Entity: 格式正确，内容有误

423 Locked：资源已被加锁。

424 Failed Dependency: 处理与某请求关联的请求失败，因此不再维持依赖关系。

507 Insufficient Storage: 保存空间不足

- WebDAV的请求实例

下面是使用PROPFIND 方法对 http://www.example.com/file 发起获取属性的请求。

```
PROPFIND /file HTTP/1.1
Host: www.example.com
Content-Type: application/xml; charset="utf-8"
Content-Length: 219

<?xml version="1.0" encoding="utf-8" ?>
    <D:propfind xmlns:D="DAV:">
        <D: prop  xmlns:R="http://ns.example.com/boxschema/">
            <R:bigbox/>
            <R:author/>
            <R:DingALing/>
            <R:Random/>
        </D: prop>
    </D: propfind>
````

- WebDAV的响应实例

下面是针对之前的PROPFIND方法，返回http://www.example.com/file的属性的响应。

```
HTTP/1.1 207 Multi-Status
Content-Type: application/xml; charset="utf-8"
Content-Length: 831

<?xml version="1.0" encoding="utf-8" ?>
    <D:multistatus xmlns:D="DAV:">
        <D:reponse xmlsns:R="http://ns.example.com/boxchema/">
        <D:href>http://www.example.com/file</D:href>
        .......
    </D:multistatus>
```

**为何HTTP协议受众如此广泛**

过去，新编写接入互联网的系统或软件时，还需要同时编写实现与必要功能对应的新协议。但最近，使用HTTP的系统和软件占了绝大多数。

这里有着诸多原因，其中与企业或组织的防火墙设定有莫大的关系。防火墙的基本功能就是禁止非指定的协议和端口号的数据包通过。因此如果使用新协议或端口号则必须修改防火墙设置。

互联网上，使用率最高的当属Web。不管是否具备访问FTP或SSH的权限，一般公司都会开放对Web的访问。Web是基于HTTP协议运作的，因此在构建Web服务器或访问Web站点时，需事先设置防火墙HTTP（80/tcp）和 HTTPS（443/tcp）的权限。

许多公司或组织已设定权限将HTTP作为通信环境，因此无须修改防火墙的设定。可见HTTP具有导入简单这一大优势。而这也是基于HTTP服务或内容不断增加的原因之一。

还有一些其他原因，比如，作为HTTP客户端的浏览器已相当普遍，HTTP服务器的数量已颇具规模，HTTP本身就是优异简单的应用等。