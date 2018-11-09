# What happens when you type an URL in the browsers and press enter? - 在浏览器导航栏输入URL并按下回车，到底发生了什么？

## 博客原文链接 [What happens when you type an URL in the browser and press enter?](https://medium.com/@maneesha.wijesinghe1/what-happens-when-you-type-an-url-in-the-browser-and-press-enter-bb0aa2449c1a)

如果你从事WEB开发相关的职业， 我可以很确定的说，有人会问你这个问题 ：“在浏览器导航栏输入URL并按下回车，到底发生了什么？”。 对于浏览器背后发生的事情以及信息是如何通过互联网传输到计算机， 有一个基本的了解总是好的。

==让我们想象下这样一个情景，你想访问google地图的网页，maps.google.com，查看你从公司到心仪的晚餐饭馆预估的路程时间。==

==Tips: 学习经验，你可以代入这个场景多想象和回忆几次，这样你就不用死记硬背了。==

当我们身处这个应用场景，整个过程发生了什么呢？

### 1.你在浏览器的地址栏，输入了URL: maps.google.com

与URI(统一资源标识符)相比， 我们更熟悉URL（ Uniform Resourse Locator), 统一资源定位符。

URL表示资源的地点（互联网上所处的位置）

URL也正是使用Web浏览器等访问Web页面时需要输入的网页地址, maps.google.com。

---
关于URI，做个简单的了解。

==URI, Uniform Resourse Identifier的缩写。==

- Uniform, 规定统一的格式可方便处理多种不同类型的资源，而不用根据上下文环境来识别资源指定的访问方式。另外加入新增的协议方案（如 http:或ftp:)也更容易。
- Resourse， 资源的定义是“可标识的任何东西”。除了文档文件呢、图像或服务（例如天气预报）等能够区别于其他类型的， 都可视为资源。另外，资源不仅可以是单一的，也可以是多数的集合体。
- Identifier, 表示可标识的对象。 也成为标识符。
  
URI就是就是由某个协议方案表示的资源的定位标识符。 协议方案是指访问资源所使用的协议类型名称。

采用HTTP协议时，协议方案就是http。除此之外，还有ftp、mailto、telnet、file协议等。

==URI与URL的区别==

URI用字符窜标识某一互联网资源的所有信息，而URL表示资源的地点（互联网上所处的位置）。可见URL是URI的子集。


### 2. 负责域名解析的DNS服务-DNS解析。

DNS(Domain Name System)协议是和HTTP协议一样位于应用层的协议。它提供域名到IP地址之间的解析服务。

就像现实生活中的电话簿， URL和IP地址的映射关系，就像联系人和电话号码。

计算机既可以被赋予IP地址，也可以被赋予主机名和域名。 比如， www.baidu.com 

用户通常使用主机名或域名来访问对象的计算机，而不是直接通过IP地址访问。 与IP地址的一组纯数字相比，用字母配合数字的表示方法来制定计算机名更符合人类的记忆习惯。

计算机去理解字符窜，显然是很困难的，它更擅长跟数字打交道。

DNS协议提供通过域名查找IP地址，或逆向从IP地址反查域名的服务。

举个例子， www.google.com的IP地址为\: http://209.85.227.104 。
你也可以在浏览器地址栏输入 http://209.85.227.104， 来访问www.google.com。 但是很难记住，不是吗？我们更愿意记住www.google.com这个域名。 


==浏览器的DNS解析机制的过程是怎么样呢？==

- 浏览器检查缓存中的DNS记录，尝试找到maps.google.com对应的IP地址。

1. 首先检查，浏览器中的DNS缓存记录。 浏览器缓存中有一个DNS记录库，因此，DNS查询， 首先发生在这里。

2. 如果没有在浏览器缓存中找到呢？ 浏览器向操作系统（OS, Operating System) 发送一个请求: “gethostname on Windows”，来获取计算机操作系统的DNS缓存记录。

3. 如果在计算机系统，也没找到DNS缓存记录。浏览器接着去路由器那边查找DNS缓存记录， 路由器也保存着自己的DNS缓存记录。

4. 如果以上DNS缓存记录查找都失败了，浏览器只能去ISP(Internet Service Provider，网络服务提供者) DNS记录缓存查找。ISP有一个自己的DNS服务器， 其中有DNS记录缓存。 这是最后能在DNS缓存中，找到请求URL和对应IP地址的希望了。

你也许会问为什么会在这么多层级保存着DNS记录缓存？

信息缓存了那么多次，感觉隐私被侵犯了。

但是缓存对于节约网络流量，提高数据传输效率是非常重要的。


### 3. 请求的URL在缓存中都找不到？ ISP（Internet Service Provider, 网络服务提供者）的DNS服务器将发起DNS查询， 以查找maps.google.com对应服务器的IP地址。

前面提到过，为了让我的电脑连接到maps.google.com这个主机域名的服务器，我需要它对应的IP地址。 

DNS查询的目的就是在互联网上搜索多个DNS服务器，直到在某个DNS服务器上找到网站正确的IP地址。

这种类型的搜索，成为递归搜索。 因为搜索是持续重复从一个DNS服务器到另外一个DNS服务器，直到找到我们需要的IP地址，或返回一个错误响应：无法找到对应的IP地址。

在这歌情景下，我们更愿意将ISP的DNS服务器解析称为DNS递归查询，它的主要职责是通过在互联网上询问其他DNS服务器以找到目标域名所对应的正确的IP地址。

其他的DNS服务器，在此情景下，被称为域服务器，因为他们基于域的架构执行DNS搜索。

如果上述内容没有绕晕你的话，下面我将解释下什么是“域架构”？

一般而言，网站的URL们一般包含着\: 一个三级域（a third-level domain), 一个二级域（a second-level domain），一个顶级域（a top-level domain）和 一个根域（root domain）。在DNS查询过程中， 每个域级别都有专属于自己的域服务器。


对于maps.google.com而言。

ISP的DNS递归查询，从根域服务器开始。 maps.google.com. ,主要后面带了“."， 表示根域服务器。

根域名服务器定向到.com域服务器。

.com域服务器定向到google.com域服务器。

google.com域服务器将在它的DNS记录中找到maps.google.com的匹配的IP地址，并将IP地址返回给ISP的DNS服务器，最后发送给你的浏览器。

```

ISP的DNS递归查询过程

maps.google.com. 

=> Root Domain "."

=> Top-Level Domain ".com"

=> Second-Level Domain "google.com"

=> Third-Level Domain "maps.google.com

=> Ip: 212.23.42.42

=> Return IP to ISP DNS Server

=> Your web Broswer get the IP address from ISP DNS Server

```

上述的DNS查询请求时使用小数据包发送的。这些数据包包含着，诸如请求内容和如若查找到IP地址，查询结果返回对象。

这些数据包在到达正确的DNS服务器之前，在客户端和服务器之间的多个网络设备进行传输。

网络设备通过“路由表” （Router Table）来确定数据包到达“目标DNS服务器”的最快方式。如果这些数据包丢失，会得到一个请求失败。 否则，它们将到达正确的DNS服务器， 获取正确的IP地址，IP地址返回给ISP的DNS服务器，最后返回给您的浏览器。


### 4. 浏览器启动与服务器的TCP连接。

一旦， 浏览器从ISP的DNS服务器那里接收到正确的IP地址，它就会与匹配IP地址的服务器建立连接，从而可以传输信息。

那么客户端（你的电脑）如何和服务器建立连接呢？
 
客户端使用互联网协议建立这样的连接， 有许多不同的协议可以使用， TCP是用于处理HTTP请求，最常见的传输协议。

建立TCP连接的作用就是为了在客户端（你的电脑）和服务器之间传送数据包。

整个TCP建立连接过程中，TCP/IP三次握手。

客户端和服务器，交换SYN（synchronize 同步）数据包和 ACK（acknowledge 确认)数据包，建立TCP连接。

TCP/IP 三次握手的过程\:

1. 客户端通过网络发送一个SYN数据包，向服务器询问是否开放连接？

2. 如果服务器的端口可接受和开启新连接，它将使用有一个SYN/ACK数据包来响应，客户端发来的SYN数据包。

3. 客户端收到从服务器端返回的SYN/ACK数据包，向服务器发送ACK数据包确认。

然后TCP连接就建立了。

```
// TCP/IP 握手过程

1. Client.send(SYN packet) => Asking Server? open for new connection

2. get SYN from Client
Server (ports) &&( accept new connection),  response(SYN/ACK packet) => Client

3. Client received response SYN/ACK packet from Server and confirm it by sending ACK packet to Server

TCP connection established
```

### 5. 浏览器向服务器发送HTTP请求

一旦，建立了TCP连接，可以开始传送数据了。 

浏览器会发送一个GET请求，请求maps.google.com网页。如果你提交的是验证信息或表单信息，这可能是一个POST请求。

这个请求还将包含额外的信息，例如\: 浏览器类型（用户代理），接受的数据类型，连接类型，域名，cookie信息等等。

```
// GET 请求样本

GET http://facebook.com/ HTTP/1.1
Accept: application/x-ms-application, image/jpeg, application/xaml+xml,[...]
User-Agent: Mozilla/4.0 (compatible); MSIE8.0; Windows NT 6.1; WOW64;[...]
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Host: facebook.com
Cookie: datr=12323232-[....]; locale=en us; ls=WW[...]

```

如果你对幕后发生的事情感到好奇，可以使用Chrome浏览器的控制台，按F12键(在windows系统可以使用快捷键 Ctrl + Shift + J)， 在控制台的区域有个Network，那里你能到这些幕后发生的事情。


### 6. 服务器处理请求

服务器收到浏览器请求，然后交给专门处理浏览器请求的应用程序。 

处理浏览器请求的应用程序（用ASP.NET，PHP， Ruby等语言编写）读取并检查请求的信息（请求头、cookie)，必要时更新服务器上的信息。最后，它以特定的数据格式（JSON, XML, HTML) 组装响应。

### 7. 服务器返回HTTP响应给浏览器

服务器返回HTTP响应给浏览器，响应中包含你所请求的网页内容，以及协议版本、响应状态码、状态码原因语句、编码方式、缓存类型、cookie设置、隐私信息、响应报文（服务器返回给浏览器的文本信息，通常HTML, CSS, JS, 图片等文件就放在这一部分）等等。

```

//服务器HTTP响应 范例

HTTP/1.1 200 OK
Cache-Control: private, no-store, no-cache, must-revalidate, post-check=0, pre-check=0
Expires: Sat, 01 Jan 2000  00:00:00 GMT
P3P: CP="DSP LAW"
Pragma: no-cache
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
X-Connection: close
Transfer-Encoding: chunked
Date: Fri, 12 Feb 2010 09:05:55 GMT

```

第一行显示了状态码，非常重要，因为它告诉我们响应的状态。

响应状态码描述了五种状态：

1. 1xx，Informational，信息状态码，表示接受的请求正在处理。
2. 2xx，Success，成功状态码，表示请求正常处理完毕。
3. 3xx，Redirection， 重定向状态码，表示需要客户端需要进行附加操作。
4. 4xx，Client Error，客户端错误状态码，表示服务器无法处理请求。
5. 5xx，Server Error，服务器错误状态码，表示服务器处理请求出错。

因此，如果你遇到了一个错误，可以查看一下HTTP响应，以检查您收到的状态代码类型，从而对错误的原因有个基本的判断。


### 8. 浏览器解析渲染页面

浏览器对内容的解析渲染, 这一部分（渲染树构建、布局及绘制），又可以分为下面五个部分。

1. 解析HTML并构建DOM树。
2. 解析CSS并构建CSSOM树。
3. 将DOM和CSSOM合并成一个渲染树。
4. 根据渲染树来布局，以计算每个节点的几何信息。
5. 将各个节点绘制到屏幕上。

### 9.最后, 您将看到 maps.google.com 出现在您的浏览器中

尽管这似乎是一个非常冗长乏味的过程，但我们知道，在按下键盘上的回车键之后，页面呈现的时间不到几秒钟。所有这些步骤都在几毫秒内发生，我们甚至都没有注意到。

我真诚地希望本文能够对您有了解“输入URL到页面呈现” 有一个大概的了解！

