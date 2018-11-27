# 简单的HTTP协议4

---
绝大多数内容引自《图解HTTP》
---

## HTTP协议用于客户端和服务器端之间的通信

HTTP协议和TCP/IP协议族内的的其他众多的协议相同，用于客户端和服务器之间的通信。

**请求访问文本或图像等资源的一端称为客户端，而提供资源响应的一端称为服务器端。**

**应用HTTP协议时，必定是有一段担任客户端角色，另一端担任服务器端角色。**
也就是说，在两台计算机之间使用HTTP协议通信时，在一条通信线路上必定有一端是客户端，另一端则是服务器端。

有时候，按实际情况，两台计算机作为客户端和服务端的角色可能会互换。但就仅从一条通信线路来说，服务器端和客户端的角色是确定的，而用HTTP协议能够明确区分哪端是客户端，哪端是服务器端。

## 通过请求和响应的交换达成通信

HTTP协议规定，请求从客户端发出，最后服务器端响应该请求并返回。换句话说，肯定是先从客户端开始建立通信的，服务器端在没有接收到请求之前不会发送响应。

```
1. 发送请求

GET /index.htm HTTP/1.1
Host: baidu.com

2. 返回响应
HTTP/1.1 200 OK
Date: Tue, 10 Jul 2012 06:50:15 GMT
ContentL-Length: 362
Content-Type: text/html
<html>
....
```

上面示例中

```
GET /index.htm HTTP/1.1
Host: baidu.com
```

为请求报文中的内容。

起始行开头的GET表示请求访问服务器的方法，称为方法（method）。随后的字符串/index.htm指明了请求访问的资源对象，也叫做请求URI（request-URI）。最后的HTTP/1.1，即HTTP的版本号，用来提示客户端使用的HTTP协议功能。

综合来看，这段请求内容的意思是：请求访问某台HTTP服务器上的/Index.htm页面资源。

**请求报文是由请求方法、请求URI、协议及协议版本号、可选的请求首部字段和内容实体组成。**

```
方法 URI 协议及协议版本
GET /index.htm HTTP/1.1

请求首部字段
Host: baidu.com
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 16

内容实体
name=ueno&age=37
```

接收到请求的服务器，会将请求内容的处理结果以响应的形式返回。

```
//响应报文
HTTP/1.1 200 OK
Date: Tue, 10 Jul 2012 06:50:15 GMT
Content-Length: 362
Content-Type: text/html

<html>
...
```

在起始行开头的HTTP/1.1 表示服务器对应的HTTP版本。

紧挨着的200 OK 表示请求的处理结果的状态码（status code)和原因短语（reason-phrase)。
下一行显示了创建响应的日期时间，是首部字段（head filed)内的一个属性。

接着以一空行分隔，之后的内容成为资源实体的主体(entity body)。

**响应报文基本上由协议版本、状态码（表示请求成功或失败的数字代码）、用以解释状态码的原因短语、可选的响应首部字段以及实体主体构成。**

```
协议版本 状态码 状态码的原因短语
HTTP/1.1 200 OK

响应首部字段
Date: Tue, 10 Jul 2012 06:50:15 GMT
Content-Length： 362
Content-Type: text/html

资源实体
<html>
....
```

## HTTP是不保存状态的协议

HTTP是一种不保存状态，即无状态（stateless）协议。HTTP协议自身不对请求和响应之间的通信状态进行保存。
也就是说在HTTP这个应用层，对于发送过的请求或响应都不做持久化处理。

**使用HTTP协议、每当有新的请求发送时，就会有对应的新响应产生。协议本身并不保留之前一切的请求或响应报文的信息。**

**这是为了更快地处理大量事务，确保协议的可收缩性，而特意把HTTP协议设计成如此简单的。**

可是，随着Web的不断发展，因无状态而导致业务处理变得棘手的情况增多了。比如，用户登录到一家购物网站，即使他跳转到该站的其他页面后，也需要能继续保持登录状态。针对这个实例，网站为了掌握是谁送出的请求，需要保存用户的状态。

**HTTP/1.1 虽然是无状态协议，但为了实现期望的保持状态功能，于是引入了Cookie技术。有了Cookie在用HTTP协议通信，就可以管理状态了。**

## 请求URI定位资源

HTTP协议使用URI定位互联网上的资源。正是因为URI的特定功能，在互联网上任意位置的资源都能访问到。

**当客户端请求访问资源而发送请求时，URI需要将作为请求报文中的请求URI包含在内。**

指定请求URI的方式有很多。

```
//范例

// 1. URI为完整的请求URI

GET http://baidu.com/index.htm HTTP/1.1

// 2. 在首部字段Host中写明网络域名或IP地址

GET /index.htm HTTP/1.1
Host: baidu.com
```

除此之外，如果不是访问特定资源而是对服务器本身发起请求，可以用一个*来代替请求URI。

下面这个例子是查询HTTP服务器支持的HTTP方法种类。

```
OPTIONS * HTTP/1.1
```

## 告知服务器意图的HTTP方法

**GET: 获取资源**

GET方法用来请求访问已被URI识别的资源。**指定的资源经服务器端解析后返回相应内容。**
也就是说，如果请求的资源时文本，那就保持原样返回。如果是像CGI（Common Gateway Interface, 通用网关接口）那样的程序，则返回经过执行后的输出结果。

```
//使用GET方法 的请求 相应的例子

//请求
GET /index.html HTTP/1.1
Host: baidu.com
If-Modified-Since: Thu, 12 Jul 2012 07:30:00 GMT

//响应
仅返回2012年7月12日7点30分以后更新过的index.html页面资源。如果未有内容更新，则以状态码302 Not Modified作为响应返回。
```

**POST: 传输实体主体**

POST方法用于传输实体的主体。

虽然用GET方法也可以传输实体的主体，但一般不用GET方法进行传输，而是用POST方法。
虽说POST的功能与GET很相似，但POST的主要目的并不是获取响应的主体内容。

```
//使用POST方法的请求 响应的例子

请求
POST/submit.cgi HTTP/1.1
Host:www.baidu.com
Content-Length: 1560

响应
返回submit.cgi接收数据的处理结果
```


**PUT: 传输文件**

PUT方法用来传输文件。就像FTP协议的文件上传一样，要求爱请求报文的主体中包含文件内容，然后保存到请求URI指定的位置。

但是，**鉴于HTTP/1.1的PUT方法自身不带验证机制，任何人都可以上传文件，存在安全性问题，因此一般的Web网站不使用该方法。若配合Web应用程序的验证机制，或架构设计采用REST（REpresemtational State Transfer，表征状态转移）标准的同样Web网站，就可能会开放使用PUT方法。

```
//使用PUT方法的请求 响应的例子

请求
PUT/example.html HTTP/1.1
Host: www.baidu.com
Content-Type: text/html
Content-Length: 1560
```

响应
响应返回状态码204 No Content（状态码的意思是请求执行成功了，但无数据返回。）

**HEAD: 获得报文首部**

HEAD方法和GET方法一样，只是不返回报文主体部分。用于确认URI的有效性及资源更新的日期时间等。

**和GET一样，但不返回报文主体

```
//使用HEAD方法的请求 响应的例子

请求
HEAD/index.html HTTP/1.1
Host: www.baidu.com

响应
返回index.html有关的响应首部
```

**DELETE: 删除文件**

DELETE方法用来删除文件，是与PUT相反的方法。DELETE方法按请求URI删除指定的资源。

**但是，HTTP/1.1的DELETE方法本身和PUT方法一样不带验证机制，所以一般的Web网站也不使用DELETE方法。当配合Web应用程序的验证机制，或遵守REST标准时还是有可能会开放使用的。

```
//使用DELETE方法的请求 响应的例子

请求
DELETE/example.html HTTP/1.1
Host: www.baidu.com

响应
响应返回状态码204 No Content (比如：该html已从该服务器上删除)
```

**OPTIONS: 询问支持的方法**

OPITIONS方法用来查询针对请求URI指定的资源支持的方法。

```
//使用OPTIONS方法的请求 响应的例子

请求
OPTIONS * HTTP/1.1
Host: www.baidu.com

响应
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
```

**TRACE：追踪路径**

TRACE方法是让Web服务器端将之前的请求通信环回给客户端的方法。

发送请求时，在Max-Forwards首部字段中填入数值，每经过换一个服务器就将该数字减1，当数值刚好减到0时，就停止继续传输，最后接收到请求的服务器端则返回状态码200 OK的响应。

客户端通过TRACE方法可以查询发送出去的请求时怎样被加工修改/篡改的。
这是因为，请求想要连接到原目标服务器可能会通过代理中转，TRACE方法就是用来确定连接过程中发生的一系列操作。

但是，TRACE方法本来就不怎么常用，再加上它容器引发XST（Cross-Site Tracing，跨站追踪）攻击，通常就更用不到了。

```
使用TRACE方法的请求 响应的例子

请求
TRACE/ HTTP/1.1
Host: baidu.com
Max-Forwards: 2


响应
HTTP/1.1 200 OK
Content-Type: message/http
Content-Length： 1024

TRACE/ HTTP/1.1
Host: baidu.com
Max-Forwards: 2 (返回响应包含请求内容)
```

**CONNECT: 要求用隧道协议连接代理**

CONNECT方法要求在与代理服务器通信时建立隧道，实现用隧道协议进行TCP通信。
主要使用SSL（Secure Sockets Layer，安全套接层）和 TLS（Transport Layer Security，传输层安全）协议把通信内容加密后经网络隧道传输。

CONNECT方法的格式如下所示。

CONNECT 代理服务器名：端口号 HTTP版本

```
//使用CONNET方法的请求 响应的例子

请求
CONNECT proxy.baidu.com:8080 HTTP/1.1
Host: proxy.baidu.com

响应
HTTP/1.1 200 OK（之后进入网络隧道）
```

## 使用方法下达命令

向请求URI指定的资源发送请求报文时，采用称为方法的命令。

方法的作用在于，可以指定请求的资源按期望产生某种行为。

方法中有GET、POST和HEAD等。

下标列出了HTTP/1.0和HTTP/1.1 支持的方法。另外，方法名区分大小写，注意要用大写字母。

### HTTP/1.0和HTTP/1.1支持的方法

|方法|说明|支持的HTTP协议版本|
|:-:|:-:|:-:|
|GET|获取资源|1.0, 1.1|
|POST|传输实体主体|1.0，1.1|
|PUT|传输文件|1.0, 1.1|
|HEAD|传输报文首部|1.0，1.1|
|DELETE|删除文件|1.0，1.1|
|OPITIONS|询问支持的方法|1.1|
|TRACE|追踪路径|1.1|
|CONNECT|要求用隧道协议连接代理|1.1|
|LINK|建立和资源之间的联系|1.0|
|UNLINE|断开连接关系|1.0|

## 持久连接节省通信量

HTTP协议的初始版本中，每进行一次HTTP通信就要断开一次TCP连接。

```
建立TCP连接 

SYN ->
    <- SYN/ACK
ACK ->
HTTP Request ->
             <- HTTP Reponse
    <- FIN
    -> ACK
    -> FIN
    <- ACK
断开TCP连接
```

以当年的通信情况来说，因为都是些容量很小的文本传输，所以即使这样也没有多大问题。可随着HTTP的普及，文档中包含大量图片的情况多了起来。

比如，使用浏览器浏览一个包含多张图片的HTML页面时，在发送请求访问HTML页面资源的同时，也会请求该HTML页面里包含的其他资源。因此，每次的请求都会造成无畏的TCP连接建立和断开，增加通信量的开销。

1. 持久连接

为解决上述TCP连接的问题，HTTP/1.1和一部分的HTTP/1.0想出了持久连接（HTTP Persistent Connection，也成为HTTP keep-alive或HTTP connection reuse)的方法。

持久连接的特点是，只要任意一端没有明确提出断开连接，则保持TCP连接状态。

**持久连接旨在建立1次TCP连接后进行多次请求和响应的交互。**

持久连接的好处在于减少了TCP连接的重复建立和断开所造成的额外开销，减轻了服务器端的负担。另外，减少开销的那部分时间，使HTTP请求和响应能够更早地结束，这样Web页面的显示速度也就相应提高了。

在HTTP/1.1中，所有的连接默认都是持久连接，但在HTTP/1.0内并未标准化。

虽然有一部分服务器通过非标准的手段实现了持久连接，但服务器端不一定能够支持持久连接。毫无疑问，除了服务器端，客户端也需要支持持久连接。

2. 管线化

持久连接使得多数请求以管线化（pipelining）方式发送成为可能。

从前发送请求后需等待并收到响应，才能发送下一个请求。

管线化技术出现后，不用等待响应亦可直接发送下一个请求。

这样就能做到同时并行发送多个请求，而不需要一个接一个地等待响应了。

比如，当请求一个包含10张图片的HTML Web页面，与挨个连接相比，用持久连接可以让请求更快结束。

**而管线化技术则比持久连接还要快。请求数越多，时间差就越明显。**

## 使用Cookie的状态管理

HTTP是无状态协议，它不对之前发生过的请求和响应的状态进行管理。也就是说，无法根据之前的状态进行本次的请求处理。

假设要求登录认证的Web页面本身无法进行状态的管理（不记录已登录的状态），那么每次跳转新页面不是要再次登录，就是要在每次请求报文中附加参数来管理登录状态。

不可否认，无状态协议当然也有它的优点。

**由于不必保存状态，自然可减少服务器的CPU及内存资源的消耗。**
从另一方面来说，正是因为HTTP协议本身是非常简单的，所以才会被应用到各种场景中。

**如果让服务器管理全部客户端状态则会成为负担。**

保留无状态协议这个特征的同时又要解决类似的矛盾问题，于是引入了Cookie技术。

Cookie技术通过在请求和响应报文中写入Cookie信息来控制客户端的状态。

**Cookie会根据从服务器发送的响应报文内的一个叫做Set-Cookie的首部字段信息，通知客户端保存Cookie。当下次客户端再往服务器发送请求时，客户端会自动在请求报文中加入Cookie值后发送出去。**

服务器端发现客户端发送过来的Cookie后，会去检查究竟是从哪一个客户端发来的连接请求，然后对比服务器上的记录，最后得到之前的状态信息。

Cookie交互的情景，HTTP请求报文和响应报文的内容如下:

```
//1.请求报文
GET /render/ HTTP/1.1
Host: baidu.com
首部字段内没有Cookie的相关信息

//2.响应报文 （服务器端生成Cookie信息）
HTTP/1.1 200 OK
Date: Thu, 12 Jul 2016 07:12:20 GMT
Server: Apache
< Set-Cookie: sid=13420771492323; path=/; expires=Wed,10-Oct-16 07:12:20 GMT>
Content-Type: text/plain; charset=UTF-8

//3.请求报文（自动发送保存着的Cookie信息）
GET /image/ HTTP/1.1
Host: baidu.com
Cookie: sid=13420771492323
```
