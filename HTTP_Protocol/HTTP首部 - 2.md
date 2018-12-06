# HTTP首部 - 2

---
绝大多数内容引自《图解HTTP》
---

## Via

使用首部字段Via是为了追踪客户端与服务器之间的请求和响应报文的传输路径。

报文经过代理或网关时，会先在首部字段Via中附加该服务器的信息，然后再进行转发。
这个做法和traceroute及电子邮件的Received首部的工作机制很类似。

首部字段Via 不仅用于追踪报文的转发，还可避免请求回环的发生。所以必须在经过代理时附加该首部字段内容。

```
客户端
GET / HTTP/1.1

代理服务器A
GET / HTTP/1.1
Via: 1.0 gw.hackr.jp(Squid/3.1)

代理服务器B
GET / HTTP/1.1
Via: 1.0 gw.hacker.jp(Squid/3.1), 1.1 al.example.com(Squid/2.7)

源服务器


各个代理服务器会往Via首部添加自身服务器的信息
```

在经过代理服务器A 时，Via 首部附加了 "1.0 gw.hacker.jp（Squid/3.1)"这样的字符串。行头的1.0是指接收请求的服务器上应用的HTTP 协议版本。接下来经过代理服务器B时亦是如此，在Via首部附加服务器B时亦是如此，在Via首部附加服务器信息，也可以增加1个新的Via首部写入服务器信息。

Via 首部是为了追踪传输路径，所以经常会和TRACE方法一起使用。
比如，代理服务器接收到由TRACE 方法发送过来的请求（其中 Max-Forwards: 0)时，代理服务器就不能再转发该请求了。

这种情况下，代理服务器会将自身的信息附加到Via首部，返回该请求的响应。


## Warning

HTTP/1.1的Warning首部是从HTTP/1.0的响应首部（Retry-After)演变过来的。

该首部通常会告知用户一些与缓存相关的问题的警告。

```
Warning: 113 gw.hackr.jp:8080 "Heuristic expiration" Tue, 03 Jul 2012 05:09:44 GMT
```

Warning 首部的格式如下。最后的日期时间部分可省略。

```
Warning: [警告码] [警告的主机：端口号] "[警告内容]" ([日期时间])
```

HTTP/1.1中定义了7种警告。

警告码对应的警告内容仅推荐参考。

另外，警告码具备扩展性，今后有可能追加新的警告码。

HTTP/1.1 警告码

|警告码|警告内容|说明|
|:-:|:-:|:-:|
|110|Response is stale(响应已过期)|代理返回已过期的资源|
|111|Revalidation failed（再验证失败）|代理再验证资源有效性时失败（服务器无法到达等原因）|
|112|Disconnection Operation(断开连接操作)|代理与互联网连接被故意切断|
|113|Heuristic expiration(试探性过期)|响应的使用期限超过24小时（有效缓存的设定时间大于24小时的情况下）|
|199|Miscellaneous warning（杂项警告）|任意的警告内容|
|214|Transformation applied（使用了转换）|代理对内容编码或媒体类型等执行了某些处理时|
|299|Miscellaneous persistent warning（持久杂项警告）|任意的警告内容|

## 请求首部字段

请求首部字段是从客户端往服务器发送请求报文中所使用的字段，用于补充请求的附加信息、客户端信息、对响应内容相关的优先级等内容。

### Accept

```
Accept: text/html, application/xhtml+xml, application/xml; q=0.9, */*; q=0.8
```

Accept 首部字段可通知服务器，用户代理能够处理的媒体类型及媒体类型的相对优先级。
可使用type/subtype 这种形式，一次指定多种媒体类型。

下面试举几个媒体类型的例子。

- 文本文件

text/html, text/plain, text/css...

application/xhtml+xml, application/xml...

- 图片文件

image/jpeg, image/gif, image/png ...

- 视频文件

video/mpeg, video/quicktime...

- 应用程序使用的二进制文件

application/octet-stream, application/zip ...


比如，如果浏览器不支持PNG图片的显示，那Accept就不指定image/png， 而指定可处理的 image/gif 和 image/jpeg 等图片类型。

若想要给显示的媒体类型增加优先级，则使用q= 来额外表示权重值，用分号(;)进行分隔。
权重值q的范围是0~1（可精确到小数点后3位），且1为最大值。
**不指定权重q值时，默认权重为 q=1.0。**

当服务器提供多种内容时，将会首先返回权重值最高的媒体类型。


### Accept-Charset

```
Accept-Charset: iso-8859-5, unicode-1-1; q=0.8
```

Accept-Charset 首部字段可用来通知服务器用户代理支持的字符集及字符集的相对优先顺序。
另外，可一次性指定多种字符集。
与首部字段Accept相同的是可用权重q值来表示相对优先级。

该首部字段应用于内容协商机制的服务器驱动协商。

### Accept-Encoding

```
Accept-Encoding： gzip, deflate
```

Accept-Encoding 首部字段用来告知服务器用户代理支持的内容编码及内容编码的优先级顺序。
可一次性指定多种内容编码。

下面试举出几个内容编码的例子。

- gzip

由文件压缩程序gzip(GNU zip) 生成的编码格式（RFC1952)，采用Lempel-Ziv算法（LZ77）及 32位循环冗余校验（Cyclic Redundancy Check，通称CRC）。

- compress

由UNIX 文件压缩程序compress 生成的编码格式，采用Lempel-Ziv-Welch(LZW)。

- deflate

组合使用zlib格式（RFC1950）及由deflate压缩算法（RFC1951)生成的编码格式。

- identity

不执行压缩或不会变化的默认编码格式

采用权重q值来表示相对优先级，这点与首部字段Accept相同。
另外，也可使用星号(*) 作为通配符，指定任意的编码格式。

### Accept-Language

```
Accept-Language: zh-cn,zh;q=0.7,en-us,en;q=0.3
```

首部字段Accept-Language 用来告知服务器用户代理能够处理的自然语言集（指中文或英文），以及自然语言集的相对优先级。可一次性指定多种自然语言集。

和Accept 首部字段一样，按权重值 q 来表示相对优先级。

### Authorization

```
Authorization: Basic dWVu3N1bjpwYXNzd29yZA==
```

首部字段Authorization 是用来告知服务器，用户代理的认证信息（证书值）。
通常，想要通过服务器认证的用户代理会在接收到返回的401状态码响应后，把首部字段Authorization 加入请求中。
共用缓存在接收到含有Authorization 首部字段的请求时的操作处理会略有差异。


### Expect

```
Expect: 100-continue
```

客户端使用首部字段Expect来告知服务器，期望出现的某种特定行为。
因服务器无法理解客户端的期望作出回应而发生错误时，会返回状态码417 Expecation Failed。

客户端可以利用该首部字段，写明所期望的扩展。
虽然HTTP/1.1 规范只定义了100-continue（状态码 100 Continue 之意）。

等待状态码 100 响应的客户端在发生请求时，需要指定Expect: 100-continue。

### From

首部字段From用来告知服务器使用用户代理的用户的电子邮件地址。
通常，其使用目的就是为了显示搜索引擎等用户代理的负责人的电子邮件联系方式。
使用代理时，应尽可能包含From首部字段（但可能会因代理不同，将电子邮件地址记录在User-Agent首部字段内）。


### Host

**虚拟主机运行在同一个IP上，因此使用首部字段Host加以区分。**

```
Host: www.baidu.com
```

首部字段Host 会告知服务器，请求的资源所处的互联网主机名和端口号。
Host首部字段再HTTP/1.1 规范内是唯一一个必须被包含在请求内的首部字段。

首部字段Host 和以单台服务器分配多个域名的虚拟主机的工作机制有很亲密的关联，这是首部字段Host必须存在的意义。

**首部字段Host和以单台服务器分配多个域名的虚拟主机的工作机制有很亲密的关联，这是首部字段Host 必须存在的意义。**

因此，就需要使用首部字段 Host 来明确指出请求的主机名。
若服务器未设定主机名，那直接发送一个空值即可。

```
Host:
```

### If-Match

形如 If-xxx 这种样式的请求首部字段，都可称为条件请求。

服务器接收到附带条件的请求后，只有判断指定条件为真时，才会执行请求。

```
If-Match: "123456"
```

**只有当If-Match 的字段值跟 ETag 值匹配一致时，服务器才会接受请求。**

首部字段 If-Match，属附带条件之一，它会告知服务器匹配资源所用的实体标记（ETag）值。
这时的服务器无法使用弱ETag值。

服务器会比对If-Match的字段值和资源的ETag值，仅当两者一致时，才会执行请求。
反之，则返回状态码 412 Precondition Failed 的响应。

还可以使用星号（*）指定 If-Match 的字段值。
针对这种情况，服务器将会忽略 ETag 的值，只要资源存在就处理请求。

### If-Modified-Since

```
If-Modified-Since: Thu, 15 Apr 2004 00:00:00 GMT
```

**如果在If-Modified-Since 字段指定的日期时间后，资源发生了更新，服务器会接收请求。**

首部字段 If-Modified-Since，属附带条件之一，它会告知服务器若 If-Modified-Since 字段值早于资源的更新时间，则希望能处理该请求。

而在指定If-Modified-Since 字段值的日期时间之后，如果请求的资源都没有过更新，则返回状态码 304 Not Modified 的响应。

If-Modified-Since 用于确认代理或客户端拥有的本地资源的有效性。

**获取资源的更新日期时间，可通过确认首部字段Last-Modified 来确定。**

### If-None-Match

首部字段If-None-Match 属于附带条件之一。
它和首部字段If-Match作用相反。
用于指定If-None-Match 字段值的实体标记（ETag）值与请求资源的ETag 不一致时，它就告知服务器处理该请求。

在GET 或 HEAD 方法中使用首部字段 If-None-Match 可获取最新的资源。
因此，这与使用首部字段If-Modified-Since时有些类似。

### If-Range

首部字段If-Range 属于附带条件之一。
它告知服务器若指定的If-Range 字段值（ETag 值或者时间）和请求资源的 ETag 值或时间相一致时，则作为范围请求处理。反之，则返回全体资源。

下面我们思考一下不使用首部字段 If-Range 发送请求的情况。
服务器端的资源如果更新，那客户端持有资源中的一部分也会随之无效。
当然，范围请求作为前提是无效的。
这时，服务器会暂且以状态码 412 Precondition Failed 作为响应返回，其目的是催促客户端再次发送请求。
这样一来，与使用首部字段If-Range比起来，就需要花费两倍的功夫。

### If-Unmodified-Since

```
If-Unmodified-Since: Thu, 03 Jul 2012 00:00:00 GMT
```

首部字段If-Unmodified-Since 和首部字段 If-Modified-Since 的作用相反。
它的作用是告知服务器，指定的请求资源只有在字段值内指定的日期时间之后，未发生更新的情况下，才会处理请求。

如果在指定日期时间后发生了更新，则以状态码 412 Precondition Failed 作为响应返回。

### Max-Forwards

```
Max-Forwards: 10
```

通过TRACE方法或OPTION方法，发送包含首部字段 Max-Forwards 的请求时，该字段以十进制形式指定可经过的服务器最大数目。服务器在往下一个服务器转发请求之前，Max-Forwards的值减 1 后重新赋值。

当服务器接受到Max-Forwards值为0的请求时，则不再进行转发，而是直接返回响应。

使用HTTP协议通信时，请求可能会经过代理等多台服务器。
途中，如果代理服务器由于某些原因导致请求转发失败，客户端也就等不到服务器的响应了。对此，我们无从可知。

可以灵活使用首部字段 Max-Forwards，针对以上问题产生的原因展开调查。
由于当Max-Forwards 字段值为0时，服务器就会立即返回响应，由此我们至少可以对以哪台服务器为终点的传输路径的通信状态有所把握。

### Proxy-Authorization

```
Proxy-Authorization: Basic dGlwOjkpNLAGfFY5
```

接收到从代理服务器发来的认证质询时，客户端会发送包含首部字段 Proxy-Authorization 的请求，以告知服务器认证所需要的信息。

这个行为是与客户端和服务器之间的HTTP访问认证相类似的，不同之处在于，认证行为发生在客户端与代理之间。

客户端与服务器之间的认证，使用首部字段Authorization 可起到相同作用。

### Range

```
Range: bytes=5001-10000
```

对于只需获取部分资源的范围请求，包含首部字段Range即可告知服务器资源的指定范围。

上面的示例表示请求获取从第5001字节至1000 字节的资源。

接收到附带 Range 首部字段请求的服务器，会在处理请求之后返回状态码为206 Partial Content的响应。
无法处理该范围请求时，则会返回状态码 200 OK 的响应及全部资源。

### Referer

首部字段 Referer会告知服务器请求的原始资源的URI。

客户端一般都会发送Referer 首部字段给服务器。

但出于安全性的考虑时，也可以不发送该首部字段。

因此原始资源的URI中的查询字符串可能含有ID和密码等保密信息，要是写进Referer转发给其他服务器，则有可能导致保密信息的泄漏。

另外，Referer的正确的拼写应该是Referrer，但不知为何，大家一直沿用这个错误的拼写。

### TE

```
TE: gzip, deflate; q=0.5
```

首部字段TE会告知服务器客户端能够处理响应的传输编码方式及相对优先级。
它和首部字段Accetp-Encoding的功能很相像，但是用于传输编码。

首部字段TE除指定传输编码之外，还可以指定伴随trailer 字段的分块传输编码的方式。
应用后者时，只需把trailers赋值给该字段值。

```
TE: trailers
```

### User-Agent

首部字段User-Agent 会将创建请求的浏览器和用户代理名称等信息传达给服务器。

由网络爬虫发起请求时，有可能会在字段内添加爬虫作者的电子邮件地址。
此外，如果请求经过代理，那么中间也很可能被添加上代理服务器的名称。