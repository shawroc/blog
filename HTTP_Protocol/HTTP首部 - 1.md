# HTTP首部 

---
绝大多数内容引自《图解HTTP》
---

HTTP协议的请求和响应报文中包含HTTP首部，只是我们平时在使用Web的过程中感受不到它。

## HTTP报文首部

HTTP协议的请求和响应报文中必定包含HTTP首部。
首部内容为客户端和服务器分别处理请求和响应提供所需要的信息。

对于客户端用户来说，这些信息中的大部分内容都无效亲自查看。

报文首部由几个字段构成。

### HTTP请求报文

在请求中，HTTP报文由方法、URI、HTTP版本、HTTP首部字段等部分构成。

下面的示例是访问http://www.baidu.com时，请求报文的首部信息。

```

GET / HTTP/1.1
Host: hack.jp
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0
Accept: text/html, application/xhtml+xml,application/xml; q=0.9, */*; q=0.8
Accept-Language: ja, en-us; q=0.7,en; q=0.3;
Accept-Encoding: gzip, deflate
DNT: 1
Connection: keep-alive
If-Modified-Since: Fri, 31 Aug 2007 02:02:20 GMT
If-None-Match： "45bae1-16-46d776ac"
Cache-Control: max-age=0;
```

### HTTP响应报文

在响应中，HTTP报文由HTTP版本、状态码（数字和原因短语）、HTTP首部字段3部分构成。

以下示例是之前请求访问 http://hackr.jp/时，返回的响应报文的首部信息。

```
HTTP/1.1 304 Not Modified
Date: Thu, 07 Jun 2012 07:21:36 GMT
Server: Apache
Connection: close
Etag: "45bae1-16a-46d776ac"
```

在报文众多的字段当中，HTTP首部字段包含的信息最为丰富。
首部字段同时存在于请求和响应报文内，并涵盖HTTP报文相关的内容信息。

因HTTP版本或扩展规范的变化，首部字段可支持的字段内容略有不同。

## HTTP首部字段

### HTTP首部字段传递重要信息

HTTP首部字段是构成HTTP报文的要素之一。

在客户端与服务器之间以HTTP协议进行通信的过程中，无论是请求还是响应都会使用首部字段，它能起到传递额外重要信息的作用。

使用首部字段是为了给浏览器和服务器提供报文主体大小、所使用的语言、认证信息等内容。

### HTTP首部字段结构

HTTP首部字段是由首部字段名和字段值构成的，中间用冒号“：”分隔。

```
首部字段名： 字段值
```

例如，在HTTP首部中以Content-Type 这个字段来表示报文主体的对象类型。

```
Content-Type: text/html
```

就以上述示例来看，首部字段名为Content-Type，字符串text/html是字段值。

另外，字段值对应单个HTTP首部字段可以由多个值，如下所示。

```
Keep-Alive: timeout=15, max=100
```

若HTTP首部字段重复了会如何？

当HTTP报文首部中出现了两个或两个以上具有相同首部字段名时会怎么样？
这种情况在规范内尚未明确，根据浏览器内部处理逻辑的不同，结果可能并不一致。
有些浏览器会优先处理第一次出现的首部字段，而有些则会优先处理最后出现的首部字段。

### 4种HTTP首部字段类型

HTTP首部字段根据实际用途被分为以下4中类型。

**通用首部字段（General Header Fields）**

请求报文和响应报文两方都会使用的首部。

**请求首部字段（Request Header Fields）**

从客户端向服务器端发送请求报文时使用的首部。
补充了请求的附加内容、客户端信息、响应内容相关优先级等信息。

**响应首部字段（Response Header Fields）**

从服务器端向客户端返回响应报文时使用的首部。
补充了响应的附加内容，也会要求客户端附加额外的内容信息。

**实体首部字段（Entity Header Fields）**

针对请求报文和响应报文的实体部分使用的首部。
补充了资源内容更新时间等与实体有关的信息。

### HTTP/1.1 首部字段一览

HTTP/1.1 规范定义了如下47种首部字段。

请求响应字段

|首部字段名|说明|
|:-:|:-:|
|Cache-Control|控制缓存的行为|
|Connection|逐跳首部、连接的管理|
|Date|创建报文的日期时间|
|Pragma|报文指令|
|Trailer|报文末端的首部一览|
|Transfer-Encoding|指定报文主体的传输编码方式|
|Upgrade|升级为其他协议|
|Via|代理服务器的相关信息|
|Warning|错误通知|
|Accept|用户代理可处理的媒体类型|
|Accept-Charset|优先的字符集|
|Accept-Encoding|优先的内容编码|
|Accept-Language|优先的语言（自然语言）|
|Authorization|Web认证信息|
|Expect|期待服务器的特定行为|
|From|用户的电子邮箱地址|
|Host|请求资源所在的服务器|
|If-Match|比较实体标记（ETag)|
|If-Modified-Since|比较资源的更新时间|
|If-None-Match|比较实体标记（与If-Match相反）|
|If-Range|资源未更新时发送实体Byte的范围请求|
|If-Unmodified-Since|比较资源的更新时间（与If-Modified-Since相反）|
|Max-Forwards|最大传输逐跳数|
|Proxy-Authorization|代理服务器要求客户端的认证信息|
|Range|实体的字节范围请求|
|Referer|对请求URI的原始获取方|
|TE|传输编码的优先级|
|User-Agent|HTTP客户端程序的信息|


响应首部字段

|首部字段名|说明|
|:-:|:-:|
|Accept-Ranges|是否接受字节范围请求|
|Age|推算资源创建经过时间|
|ETag|资源的匹配信息|
|Location|令客户端重定向至指定URI|
|Proxy-Authenticate|代理服务器对客户端的认证信息|
|Retry-After|对再次发起请求的时机要求|
|Server|HTTP服务器的安装信息|
|Vary|代理服务器缓存的管理信息|
|WWW-Authenticate|服务器对客户端的认证信息|


实体首部字段

|首部字段名|说明|
|:-:|:-:|
|Allow|资源可支持的HTTP方法|
|Content-Encoding|实体主体适用的编码方式|
|Content-Language|实体主体的自然语言|
|Content-Length|实体主体的大小（字节）|
|Content-Location|替代对应资源的URI|
|Content-MD5|实体主体的报文摘要|
|Content-Range|实体主体的位置范围|
|Content-Type|实体主体的媒体类型|
|Expires|实体主体过期的日期时间|
|Last-Modified|资源的最后修改日期时间|

### 非HTTP/1.1 首部字段

在HTTP协议通信交互中使用到的首部字段，不限于RFC2616中定义的47种首部字段。
还有Cookie、Set-Cookie和Content-Disposition等其他RFC中定义的首部字段，它们的使用频率也很高。

这些非正式的首部字段统一归纳在RFC4229 HTTP Header Fied Registrations中。

### End-to-end 首部和Hop-by-hop首部

HTTP首部字段将定义成缓存代理和非缓存代理的行为，分成2种类型。

**端到端首部（End-to-end Header）**

分在此类别中的首部会转发给请求/响应对应的最终接收目标，且必须保存在由缓存生成的响应中，另外规定它必须被转发。

**逐跳首部（Hop-by-hop Header）**

分在此类别中的首部只对单次转发有效，会因通过缓存或代理而不再转发。
HTTP/1.1和之后版本中，如果要使用hop-by-hop首部，需提供Connection首部字段。

下面列举了HTTP/1.1中的逐跳首部字段。
除这8个首部字段之外，其他所有字段都属于端到端首部。

- Connection
- Keep-Alive
- Proxy-Authenticate
- Proxy-Authorization
- Trailer
- TE
- Transfer-Encoding
- Upgrade

## HTTP/1.1 通用首部字段

通用首部字段是指，请求报文和响应报文双方都会使用的首部

### Cache-Control

通过指定首部字段Cache-Control的指令，就能操作缓存的工作机制。

指令的参数是可选的，多个指令只见那通过“，”分隔。
首部字段Cache-Control的指令可用于请求及响应时。

```
Cache-Control: private, max-age=0, no-cache
```

可用的指令按请求和响应分类如下所示。

**缓存请求指令**

|指令|参数|说明|
|:-:|:-:|:-:|
|no-cache|无|强制向源服务器再次验证|
|no-store|无|不缓存请求或响应的任何内容|
|max-age = [秒]|必须|响应的最大Age值|
|max-stale（=[秒]）|可省略|接收已过期的响应|
|min-fresh = [秒]|必需|期望在指定时间内的响应仍有效|
|no-transform|无|代理不可更改媒体类型|
|only-if-cached|无|从缓存获取资源|
|cache-extension|-|新指令标记（token）|

**缓存响应指令**

|指令|参数|说明|
|:-:|:-:|:-:|
|public|无|可向任意方提供响应的缓存|
|private|可省略|仅向特定用户返回响应|
|no-cache|可省略|缓存前必须先确定其有效性|
|no-store|无|不缓存请求或响应的任何内容|
|no-transform|无|代理不可更改媒体类型|
|must-revalidate|无|可缓存但必须再向源服务器进行确认|
|proxy-revalidate|要求中间缓存服务器对缓存的响应有效性再进行确认|
|max-age = [秒]|必需|响应的最大Age值|
|s-maxage = [秒]|必需|公共缓存服务器响应的最大Age值|
|cache-extension|-|新指令标记（token）|


### 表示是否能缓存的指令

**public 指令**

```
Cache-Control: public
```

当指定使用public指令时，则明确表明其他用户也可利用缓存。

**private指令**

```
Cache-Control: private
```

当指定private指令后，响应只以特定的用户作为对象，这与public指令的行为相反。

缓存服务器会对该特定用户资源缓存的服务，对于其他用户发送过来的请求，代理服务器则不会返回缓存。

**no-cache指令**

```
Cache-Control: no-cache
```

使用no-cache指令的目的是为了防止从缓存中返回过期的资源。

客户端发送的请求中如果包含no-cache指令，则表示客户端将不会接收缓存过的响应。
于是，“中间”的缓存服务器必须把客户端请求转发给源服务器。

如果服务器返回的响应中包含no-cache指令，那么缓存服务器不能对资源进行缓存。
源服务器以后也不再对缓存服务器请求中提出的资源有效性进行确认，且禁止其对响应资源进行缓存操作。

```
Cache-Control: no-cache=Location
```

由服务器返回的响应中，若报文首部字段Cache-Control中对no-cache字段名具体制定参数值，那么客户端在接收到这个被制定参数值的首部字段对应的响应报文后，就不能使用缓存。

换言之，无参数值的首部字段指定的其他URI可以使用缓存。只能在响应指令中指定该参数。

### 控制可执行缓存的对象的指令

**no-store指令**

```
Cache-Control: no-store
```

当使用no-store指令时，暗示请求（和对应的响应）或响应中包含机密信息。

**从字面意思上很容易把no-cache误解成为不缓存，但事实上no-cache代表不缓存过期的资源，缓存会向源服务器进行确认有效期确认后处理资源，也许成为do-not-serve-from-cache-without-revalidaion更合适。no-store才是真正地不进行缓存，请注意。**

因此，该指令规定缓存不能再本地存储请求或响应的任一部分。

###  指定缓存期限和认证的指令

**s-maxage指令**

```
Cache-Control: s-maxage=604800（单位：秒）
```

s-maxage指令的功能和max-age指令的相同，它们的不同点是s-maxage指令只适用于供多位用户使用的公共缓存服务器（代理服务器）。也就是说，对于向同一用户重复返回响应的服务器来说，这个指令没有任何作用。

另外，当使用s-maxage指令后，则直接忽略对Expires首部字段及max-age指令的处理。

**max-age指令**

```
Cache-Control: max-age=604800 (单位：秒)
```

当客户端发送的请求中包含max-age指令时，如果判定缓存资源的缓存时间数值比指定时间的数值更小，那么客户端就接收缓存的资源。另外，当指定max-age值为0，那么缓存服务器通常需要将请求转发给源服务器。

当服务器返回的响应中包含max-age指令时，缓存服务器将不对资源的有效性再作确认，而max-age数值代表资源保存为缓存的最长时间。

应用HTTP/1.1版本的缓存服务器遇到同时存在Expires首部字段的情况时，会优先处理max-age指令，而忽略掉Expires首部字段。

而HTTP/1.0版本的缓存服务器的情况却相反，max-age指令会被忽略掉。

**min-fresh**

```
Cache-Control: min-fresh=60(单位：秒)
```

min-fresh指令要求缓存服务器返回至少还未过指定时间的缓存资源。

比如，当指定min-fresh为60秒后，过了60秒的缓存都无法作为响应返回了。

**max-stale指令**

```
Cache-Control: max-stale=3600（单位：秒）
```

使用max-stale可指示缓存资源，即使过期了也照常接收。

如果指令未指定参数值，那么缓存资源无论经过多久，客户端都会接收到。
如果指令中指定了具体数值，那么即使过期，只要仍处于max-stale指定的时间内，仍旧会被客户端接收。

**only-if-cached指令**

```
Cache-Control: only-if-cached
```

使用only-if-cached指令表示客户端仅在缓存服务器本地缓存目标资源的情况下才会要求其返回。
换言之，该指令要求缓存服务器不重新加载响应，也不会再次确认资源有效性。

若发生请求缓存服务器的本地缓存无响应，则返回状态码504 Gateway Timeout。

**must-revalidate指令**

```
Cache-Control: must-revalidate
```

使用must0revalidate指令，代理会向源服务器再次验证即将返回的响应缓存目前是否仍然有效。

若代理无法连通源服务器再次获取有效资源的话，缓存服务器必须给客户端一条504(Gateway Timeout)状态码。

另外，使用must-revalidae指令会忽略请求的max-stale指令。
（即使已经在首部使用了max-stale，也不会再有效果）。

**proxy-revalidate**

```
Cache-Control: proxy-revalidate
```

proxy-revalidate 指令要求所有的缓存服务器在接收到客户端带有该指令的请求返回响应之前，必须再次验证缓存的有效性。

**no-transform指令**

```
Cache-Control: no-transform
```

使用 no-transform 指令规定无论是在请求还是响应中，缓存都不能改变实体主体的媒体类型。

这样做可防止缓存或代理压缩图片等类似操作。


### Cache-Control扩展

**cache-extension token**

```
Cache-Control: private, community="UCI"
```

通过cache-extension标记（token），可以扩展Cache-Control首部字段内的指令。

如上面的例子，Cache-Control首部字段本身没有community这个指令。

借助extension tokens 实现了该指令的添加。

如果缓存服务器不能理解community这个新指令，就会直接忽略。
因此，extension tokens 仅地能理解它的缓存服务器来说是有意义的。

## Connection

Connection首部字段具备如下两个作用

- 控制不再转发给代理的首部字段

Connection: 不再转发的首部字段

在客户端发送请求和服务器返回响应内，使用Connection 首部字段，可控制不再转发给代理的首部字段（即Hop-by-hop首部）。

- 管理持久连接

```
Connection: close
```

HTTP/1.1 版本的默认连接都是持久连接。
为此，客户端会在持久连接上连续发送请求。
当服务器向明确断开连接时，则指定Connection 首部字段的值为Close。

```
Connection: Keep-Alive
```

HTTP/1.1 之前的HTTP版本的默认连接都是非持久连接。
为此，如果想在旧版本的HTTP协议上维持持续连接，则需要指定Connection首部字段的值为Keep-Alive。

## Date

首部字段Date表明创建HTTP报文的日期和时间。

HTTP/1.1 协议使用在RFC1123中规定的日期时间的格式。

如下示例：

```
Date: Tue, 03 Jul 2012 04:40:59 GMT
```

之前的HTTP协议版本中使用在RFC850中定义的格式，如下所示。

```
Date: Tue, 03-Jul-2012 04:40:59 GMT
```

除此之外，还有一种格式。它与C标准库内的asctime()函数的输出格式一致。

```
Date: Tue Jul 03 04:40:59 2012
```

## Pragma

Pragma 是 HTTP/1.1 之前版本的历史遗留字段，仅作为与HTTP/1.0的向后兼容而定义。

规范定义的形式唯一，如下所示。

```
Pragma: no-cache
```

该首部字段属于通用首部字段，但只用在客户端发送的请求中。
客户端会要求所有的中间服务器不返回缓存的资源。

**所有的中间服务器如果都能以HTTP/1.1 为基准，那么直接采用 Cache-Control: no-cache指定缓存的处理方式是最为理想的。但要整体掌握全部中间服务器使用的HTTP协议版本却是不现实的。因此，发送的请求会同时含有下面两个首部字段。**

```
Cache-Control: no-cache
Pragma: no-cache
```

## Trailer

首部字段Trailer会事先说明在报文主体后记录了哪些首部字段。
该首部字段可应用在HTTP/1.1版本分块传输编码时。

```
HTTP/1.1 200 OK
Date: Tue, 03 Jul 2012 04:40:56 GMT
Content-Type: text/html

···
Transfer-Encoding: chucked
Trailer: Expires

···(报文主体)···

0
Expires: Tue, 28 Sep 2004 23:59:59 GMT

```

以上例子中，指定首部字段Trailer的值为Expires，在报文主体之后（分块长度0之后）出现了首部字段Expires。

## Transfer-Encoding

首部字段Transfer-Encoding规定了传输报文主体时采用的编码方式。

HTTP/1.1的传输编码方式仅对分块传输编码有效。

```
HTTP/1.1 200 OK
Date: Tue, 03 Jul 2012 04:50:50 GMT
Cache-Control: public, max-age=604800
Content-Type: text/javaScript; charset=utf-8
Expires: Tue, 10 Jul 2012 04:40:56 GMT
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Encoding: gzip
Transfer-Encoding: chucked
Connection: keep-alive

cf0 <-16进制（10进制为3312）

···3312字节分块数据···

392 <-16进制（10进制为914）

···914字节分块数据···

0
```

以上用例中，正如在首部字段Transfer-Encoding中指定的那样，有效使用分块传输编码，且分别被分为3312字节和914字节大小的分块数据。

## Upgrade

首部字段Upgrade用于检测HTTP协议及其他协议是否使用跟高的版本进行通信，其参数值可以用来指定一个完全不同的通信协议。

```
//请求报文
GET/index/htm HTTP/1.1
Upgrade: TLS/1.0
Connecction: Upgrade

//响应报文
HTTP/1.1 101 Swiching Protocols
Upgrade: TLS/1.0, HTTP/1.1
Connection: Upgrade
```

上面这个例子中，首部字段Upgrade 指定的值为TLS/1.0。
请注意此处两个首部字段的对应关系，Connection的值被指定为 Upgrade，还需要额外指定Connection: Upgrade。

对于附有首部字段Upgrade的请求，服务器可用101 Switching Protocols状态码作为响应返回。