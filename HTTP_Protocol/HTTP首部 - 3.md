# HTTP首部 - 3

---
绝大多数内容引自《图解HTTP》
---

## 响应首部字段

响应首部字段是由服务器向客户端返回响应表文中所使用的字段，用于补充响应的附加信息、服务器信息，以及对客户端的附加要求等信息。

### Accept-Ranges

```
Accept-Ranges: bytes
```

首部字段Accept-Ranges是用来告知客户端服务器是否能处理范围请求，以指定获取服务器端某个部分的资源。

可指定的字段值有两种，可处理范围请求时指定其为bytes，反之则指定为none。

### Age

```
Age: 600
```

首部字段Age 能告知客户端，源服务器在多久前创建了响应。字段值的单位为秒。

若创建该响应的服务器是缓存服务器，Age 值是指缓存后的响应再次发起认证到认证完成的时间值。代理创建响应时必须加上首部字段Age。

### ETag

```
ETag: "82e222293907ce724faf677773957acd12"
```

首部字段ETag能告知客户端实体标识。
它是一种可将资源以字符串形式做唯一性标识的方式。服务器会为每份资源分配对应的ETag值。

另外，当资源更新时，ETag值也需要更新。生成ETag值时，并没有统一的算法规则，而仅仅是由服务器分配。

资源被缓存时，就会被分配唯一性标识。
例如，当使用中文版的浏览器访问\http://www.google.com/时，就会返回中文版对应的资源，而使用英文版的浏览器访问时，则会返回英文版对应的资源。

两者的URI 是相同的，所以仅凭URI指定缓存的资源是相当困难的。
若在下载过程中出现连接中断、再连接的情况，都会依照ETag值来指定资源。

**强ETag值和弱Tag值**

ETag中有强 ETag值 和 弱 ETag值之分。

- 强 ETag值

强 ETag值，不论实体发生多么细微的变化都会改变其值。

```
ETag: "usagi-1234"
```

- 弱 ETag值

弱 ETag 值只用于提示资源是否相同。
只有资源发生了根本改变，产生差异时才会改变ETag值。
这时，会在字段值最开始处附加 W/。

```
ETag: W/"usagi-1234"
```

### Location

```
Location: http://www.usagidesign.jp/sample.html
```

使用首部字段 Location 可以将响应接收方 引导至 某个与请求URI位置不同的资源。

基本上，该字段会配合 3xx：Redirection 的响应，提供重定向的URI。

几乎所有的浏览器在接收到包含首部字段Location的响应后，都会强制性地尝试对已提示的重定向资源的访问。

### Proxy-Authenticate

```
Proxy-Authenticate:  Basic realm="Usagidesign Auth"
```

首部字段 Proxy-Authenticate 会把由代理服务器所要求的认证信息发送给客户端。

它与客户端和服务器之间的HTTP 访问认证的行为相似，不同之处在于其认证行为是在客户端与代理之间进行的。而客户端与服务器之间进行认证时，首部字段WWW—Authorization 有着相同的作用。


### Retry-After

```
Retry-After: 120
```

首部字段Retry-After 告知客户端应该在多久之后再次发送请求。
主要配合状态码 503 Service Unavailable 响应，或3xx Redirect 响应一起使用。

字段值可以指定为具体的日期时间（Wed, 04 Jul 2012 06:34：24 GMT等格式），也可以是创建响应后的秒数。

### Server

```
Server: Apache/2.2.17（Unix）
```

首部字段Server 告知客户端当前服务器上安装的HTTP 服务器应用程序的信息。
不单单会标出服务器上的软件应用名称，还有可能包括版本号和安装时启用的可选项。

```
Server: Apache/2.2.6 (Unix) PHP/5.2.5
```

### Vary

**当代理服务器接受到带有Vary首部字段指定获取资源的请求时，如果使用的Accept-Language 字段的值相同，那么就直接从缓存返回响应。反之，则需要先从源服务器端获取资源后才能作为响应返回。**

```
Vary: Accept-Language
```

首部字段Vary 可对缓存进行控制。
源服务器会向代理服务器传送关于本地缓存使用方法的命令。

从代理服务器接收到源服务器返回包含 Vary 指定项的响应之后，若再要进行缓存，仅对请求中含有相同Vary 指定首部字段的请求返回缓存。即使对相同资源发起请求，但由于 Vary 指定的首部字段不相同，因此必须要从源服务器重新获取资源。


### WWW-Authenticate

```
WWW-Authenticate: Basic realm="UsagidesignAuth"
```

首部字段WWW-Authenticate 用于 HTTP 访问认证。
它会告知客户端适用于访问请求URI所指定资源的认证方案（Basic或是Digest）和带参数提示的质询（challenge)。状态码401 Unauthorized 响应中，肯定带有首部字段 WWW-Authenticate。

realm 字段的字符串时为了辨别请求URI 指定资源所受到的保护策略。

## 实体首部字段

实体首部字段是包含在请求报文和响应报文中的实体部分使用的首部，用于补充内容的更新时间等与实体相关的信息。

在请求和响应两方的HTTP报文中都含有与实体相关的首部字段。

### Allow

```
Allow: GET, HEAD
```

首部字段Allow 通知客户端能够支持 Request-URI 指定资源的所有HTTP方法。
当服务器接收到不支持的HTTP方法时，会以状态码405 Method Not Allowed 作为响应返回。
与此同时，还会把所有能支持的HTTP写法写入首部字段Allow后返回。

### Content-Encoding

```
Content-Encoding: gzip
```

首部字段Content-Encoding 会告知客户端服务器对实体的主体部分选用的内容编码方式。
内容编码是指在不丢失实体信息的前提下所进行的压缩。

主要采用以下4中内容编码的方式。

- gzip
- compress
- deflate
- identity

### Content-Language

```
Content-Language: zh-CN
```

首部字段 Content-Language 会告知客户端，实体主体适用的自然语言（指中文或英文等语言）。

### Content-Length

```
Content-Length: 15000
```

首部字段Content-Length 表明了实体主体部分的大小（单位是字节）。
对实体主体进行内容编码传输时，不能再使用Content-Length 首部字段。
由于实体主体大小的计算方法略微复杂，所以在此不再展开。

### Content-Location

```
Content-Location: http://www.hackr.jp/index-ja.html
```

首部字段 Content-Location 给出与报文主体部分相对应的URI。
和首部字段 Location 不同， Content-Location 表示的是报文主体资源对应的URI。

比如，对于使用首部字段Accept-Language的服务器驱动型请求，当返回的页面内容与实际请求的对象不同时，首部字段 Content-Location 内会写明URI。

比如，访问 http://www.hackr.jp/ 返回的对象却是 http://www.hacker.jp/index-ja.html等类似情况。

### Content-MD5

```
Content-MD5: 0GFkZDUwNGvHSKDKSLDKSKLDLKSKLDKLSLKDL==
```

首部字段 Content-MD5 是一串由 MD5 算法生成的值，其目的在于检查报文主体在传输过程中是否保持完整，以及确认传输到达。

对报文主体执行MD5 算法获得的128为位 二进制数，再通过 Base64 编码后将结果写入 Content-MD5 字段值。 由于HTTP 首部 无法记录二进制值，所以要通过 Base64编码处理。

为确保报文的有效性，作为接收方的客户端会对报文主体再执行一次相同的MD5算法。
计算出的值与字段值作比较后，即可判断出报文主体的准确性。

采用这种方法，对内容上的偶发性改变是无从查证的，也无法检测出恶意篡改。
其中一个原因在于，内容如果能够被篡改，那么同时意味着Content-MD5 也可重新计算然后被篡改。

所以处在接收阶段的客户端是无法意识到报文主体以及首部字段Content-MD5是已经被篡改过的。

### Content-Range

```
Content-Range: bytes 5001-10000/10000
```

针对范围请求，返回响应时使用的首部字段Content-Range， 能告知客户端作为响应返回的实体的哪个部分符合范围请求。字段值以字节为单位，表示当前发送部分及整个实体大小。

### Content-Type

```
Content-Type: text/html; charset=UTF-8
```

首部字段 Content-Type 说明了实体主体内对象的媒体类型。和首部字段Accept 一样，字段值用type/subtype形式赋值。

参数 charset 使用 iso-8859-1 或 euc-jp 等字符集进行赋值。

### Expires

```
Expires: Wed, 04 Jul 2012 08:25:06 GMT
```

首部字段Expires 会将资源失效的日期告知客户端。
缓存服务器在接收到含有首部字段Expires的响应后，会以缓存来应答请求，在Expires字段值指定的时间之前，响应的副本会一直被保存。当超过指定的时间后，缓存服务器在请求发送过来时，会转向源服务器请求资源。

源服务器不希望缓存服务器对资源缓存时，最好在Expires字段内写入与首部字段Date相同的时间值。

但是，当首部字段Cache-Control 有指定max-age 指令时，比起首部字段Expires，会优先处理 max-age 指令。

### Last-Modified

```
Last-Modified: Wed, 23 May 2012 09:59:55 GMT
```

首部字段 Last-Modified 指明资源最终修改的时间。
一般来说，这个值是 Request-URI指定资源被修改的时间。
但类似使用 CGI 脚本进行动态数据处理时，该值有可能会变成数据最终修改时的时间。


## 为Cookie服务的首部字段

管理服务器与客户端之间状态的Cookie，虽然没有被编入标准化 HTTP/1.1 的RFC2616中，但在Web 网站方面得到了广泛的应用。

Cookie 的工作机制是用户识别及状态管理。Web 网站为了管理里用户的状态会通过Web浏览器，把一些数据临时写入用户的计算机内。接着当用户访问该Web网站时，可通过通信方式取回之前发放的Cookie。

调用Cookie时，由于可校验Cookie的有效期，以及发送方的域、路径、协议等信息，所以正规发布的Cookie内的数据不会因来自其他Web站点和攻击者的攻击而泄漏。

**由网景公司颁布的规格标准**

网景通信公司设计并开发了Cookie，并制定相关的规格标准。
1994年前后，Cookie 正式应用在网景浏览器中。
目前最为普及的Cookie方式也是以此为基准的。

**RFC2109**

某企业尝试以独立技术对 Cookie 规格进行标准化统筹。
原本的意图是想和网景公司制定的标准交互应用，可惜发生了微妙的差异。
现在该标准已淡出了人们的视线。

**RFC2965**

为终结 Internet Explorer 浏览器与 Netscape Navigator的标准差异而导致的浏览器战争，RFC2965 内定义了新的HTTP 首部 Set-Cookie2和 Cookie 2。

可事实上，它们几乎没怎么投入使用。

**RFC6265**

将网景公司制定的标准作为业界事实标准（De facto standard)，重新定义 Cookie 标准后的产物。

为Cookie 服务的首部字段

|首部字段名|说明|首部类型|
|:-:|:-:|:-:|
|Set-Cookie|开始状态管理所使用的Cookie信息|响应首部字段|
|Cookie| 请求首部中附带从服务器端接收到Cookie信息|请求首部字段|


### Set-Cookie

```
Set-Cookie: status=enable; expires=Tue, 05 Jul 2011 07:26:31 GMT; path=/; domain=.hacker.jp;
```

当服务器准备开始管理客户端的状态时，会事先告知各种信息。

下面的表格列举了Set-Cookie的字段值。

|属性|说明|
|NAME=VALUE|赋予Cookie的名称和其值（必需项）|
|expires=DATE|Cookie的有效期（若不明确指定则默认为浏览器关闭前为止)|
|path=PATH|将服务器上的文件目录作为Cookie的适用对象（若不指定则默认为文档所在的文件目录）|
|domain=域名|作为Cookie适用对象的域名（若不指定则默认为创建Cookie的服务器的域名）|
|Secure|仅在HTTPS 安全通信时才会发送 Cookie|
|HttpOnly|加以限制，使Cookie 不能被JavaScript 脚本访问|

### expires属性

Cookie的expires 属性指定浏览器可发送Cookie的有效期。

当省略 expires 属性时，其有效期仅限于维持浏览器会话（Session)时间段内。
这通常限于浏览器应用程序被关闭之前。

另外，一旦Cookie从服务器端发送至客户端，服务器端就不存在可以显式删除Cookie的方法。
但可通过覆盖已过期的Cookie，实现对客户端Cookie的实质性删除操作。

### path属性

Cookie的path属性可用于限制指定Cookie的发送范围的文件目录。
不过另有办法可避开这项限制，所以这个作为安全机制的效果不能抱有期待。

### domain属性

通过Cookie的 domain 属性指定的域名可做到与结尾匹配一致。
比如，当指定 example.com后，除example.com以外，www.example.com 或 www2.example.com等都可以发送Cookie。

因此，除了针对具体指定的多个域名发送Cookie之外，不指定domain属性显得更安全。

### secure属性

Cookie 的 secure 属性用于限制Web 页面仅在 HTTPS 安全连接时，才可以发送Cookie。

发送Cookie 时，指定secure属性的方法如下所示。

```
Set-Cookie:  name=value; secure
```

以上例子仅当在 https\://www.example.com/(HTTPS)安全连接的情况下才会进行Cookie的回收。
也就是说，即使域名相同，http\://www.example.com/ (HTTP) 也不会发生Cookie回收行为。

当省略secure属性时，不论HTTP还是HTTPS，都会对Cookie进行回收。

### HttpOnly属性

Cookie的 HttpOnly 属性是Cookie的扩展功能，它使JavaScript 脚本无法获得Cookie。
其主要目的是防止跨站脚本攻击（Cross-site scripting，XSS）对Cookie的信息窃取。

发送指定HttpOnly 属性的Cookie的方法如下所示。

```
Set-Cookie: name=value; HttpOnly
```

通过上述设置，通常从Web页面内还可以对Cookie进行读取操作。
但使用JavaScript的 document.cookie 就无法读取附加HttpOnly属性后的Cookie的内容。
因此，也就无法在XSS中利用JavaScript劫持Cookie了。

虽然是独立的扩展功能，但Internet Explorer 6 SP1 以上版本等当下的主流浏览器都已经支持该扩展了。另外顺带一提，该扩展并非是为了防止XSS而开发的。

### Cookie

```
Cookie: status=enable
```

首部字段Cookie会告知服务器，当客户端想获得HTTP状态管理支持时，就会在请求中包含从服务器接收到的Cookie。接收到多个Cookie时，同样可以以多个Cookie形式发送。


## 其他首部字段

HTTP 首部字段是可以自行扩展的。所以在Web服务器和浏览器的应用上，会出现各种非标准的首部字段。

接下来，我们就一些最为常用的首部字段进行说明。

- X-Frame-Options
- X-XSS-Protection
- DNT
- P3P

### X-Frame-Options

```
X-Frame-Options: DENY
```

首部字段 X-Frame-Options 属于 HTTP 响应首部，用于控制网站内容在其他Web 网站的Frame标签内的显示问题。其主要目的是为了防止点击劫持（clickjacking）攻击。

首部字段 X-Frame-Options 有以下两个可指定的字段值。

- DENY: 拒绝
- SAMEORIGIN: 仅同源域名下的页面（Top-level-browsing-context）匹配时许可。（比如，当指定http://hack.jp/sample.html页面为SAMEORIGIN时，那么hacker.jp 上所有页面的frame都被允许加载该页面，而example.com等其他域名的页面就不行了）

支持该首部字段的浏览器有：IE8、Firefox 3.6.9+、Chrome 4.1.249.1042+、Safari 4+ 和Opera 10.50+等。现在主流的浏览器都已经支持。

能在所有的Web服务器端预先设定好 X-Frame-Options 字段值是最理想的状态。

对 apache2.conf的配置实例

```
<ifModule mod_headers.c>
    Header append X-FRAME-OPTIONS "SAMEORIGIN"
</IfModule>
```

### X-XSS-Protection

```
X-XSS-Protection: 1
```

首部字段 X-XSS-Protection 属于 HTTP 响应首部，它是针对跨站脚本攻击（XSS）的一种对策，用于控制浏览器XSS 防护机制的开关。

首部字段X-XSS-Protection 可指定的字段值如下。

- 0: 将XSS过滤设置成无效状态
- 1：将XSS过滤设置成有效状态

### DNT

```
DNT:1
```

**首部字段DNT属于HTTP请求首部，其中DNT是Do Not Track的简称，意为拒绝个人信息被收集，是表示拒绝被精准广告追踪的一种方法。**

首部字段DNT可指定的字段值如下。

- 0：同意被追踪
- 1：拒绝被追踪

由于首部字段DNT的功能具备有效性，所以Web服务器需要对DNT做对应的支持。

### P3P

```
P3P: CP="CAO DSP LAW CURa ADMa DEVa TAIa PSAa PSDa IVAa IVDa OUR BUS IND UNI COM NAV INT"
```

首部字段P3P 属于HTTP 响应首部，通过利用 P3P （The Platform for Privacy Preferences，在线隐私偏好平台）技术，可以让 Web 网站上的个人隐私变成一种仅供程序可理解的形式，以达到保护用户隐私的目的。

要进行P3P的设定，需按操作以下步骤进行。

**步骤1：创建P3P隐私**

**步骤2： 创建P3P隐私对照文件后，保存命名在 /w3c/p3p.xml**

**步骤3：从P3P隐私中新建Compact policies后，输出到HTTP响应中。**

有关P3P的详细规范标准请参看下方链接。

- The Platform for Privacy Preferences 1.0(P3P 1.0) Specification

[P3P的详细规范标准](http://www.w3.org/TR/P3P)


### 协议中对 X- 前缀的废除

在HTTP等多种协议中，通过给非标准参数加上前缀 X-，来区别于标准参数，并使那些非标准的参数作为扩展变成可能。

但是这种简单粗暴的做法有百害而无一益，因此在“RFC 6648 - Deprecating the "X-" Prefix and Similar Contructs in Application Protocols"中提议停止该做法。

然而，对已经在使用中的X- 前缀来说，不应该要求其变更。