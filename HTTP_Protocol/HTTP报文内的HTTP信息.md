# HTTP报文内的HTTP信息

---
绝大多数内容引自《图解HTTP》

---

HTTP通信过程包括从客户端发往服务器端的请求及从服务器端返回客户端的响应。


## HTTP报文

用于HTTP协议交互的信息被称为HTTP报文。

请求端（客户端）的HTTP报文叫做请求报文，响应端（服务器端）的叫做响应报文。

HTTP报文本身是由多行（用CR+LF作换行符）数据构成的字符串文本。

HTTP报文大致可分为报文首部和报文主体两块。
两者由最初出现的空行（CR+LF）来划分。

通常，并不一定要有报文主体。

```

HTTP报文的结构

报文首部： 服务器端或客户端需处理的请求或响应的内容及属性

空行（CR+LF) CR（Carriage Return，回车符，16进制0x0d）和LF（Line Feed，换行符，16进制0x0a）

报文主体：应被发送的数据

```

## 请求报文及响应报文的结构

```

//请求报文结构

报文首部
- 请求行
- 请求首部字段
- 通用首部字段
- 实体首部字段
- 其他

空行（CR+LF）

报文主体


//响应报文

报文首部
- 状态行
- 响应首部字段
- 通用首部字段
- 实体首部字段
- 其他

空行（CR+LF）

报文主体
```

---

```
//请求报文的实例

//->请求行
GET /HTTP/1.1

//->各种首部字段
Host: baidu.com
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; rv:13.0) Gecko/20100101 Firefox/13.0.1
Accept: text/html, application/xhtml+xml, application/xml; q=0.9, */*; q=0.8
Accept-Language: zh, en-us; q=0.7,en; q=0.3
Accept-Encoding: gzip, deflate
DNT: 1
Connection: keep-alive
Pragma: no-cache
Cache-Control:  no-cache

空行(CR+LF)


//响应报文的实例

//->状态行
HTTP/1.1 200 OK

//->各种首部字段
Date: Fri, 13 Jul 2012 02:45:26 GMT
Server: Apache
Last-modified: Fri, 31 Aug 2007 02:02:20 GMT
ETag: "45bael-16a-46d776ac"
Accept-Ranges: bytes
Content-Length: 362
Connnection: close
Content-Type: text/html

空行(CR+LF)

// 报文主体

<html xmlns="http://www.w3.org/1999/xhtml>
<head>
    <meta http-equiv="Content-Type" content="text/html"; charset="utf-8"/>
    <title>baidu.com</title>
</head>
<body>
    <img src="xxx.com" alt="xxx" width="240" height="84" />
</body>
</html>

```

请求报文和响应报文的首部内容由以下数据组成。现在出现的各种首部字段及状态码稍后进行阐述。

**请求行**

包含用于请求的方法，请求URI和HTTP版本。

**状态行**

包含表明响应结果的状态码，原因短语和HTTP版本。

**首部字段**

包含表示请求和响应的各种条件和属性的各类首部。


一般有4种首部，分别是：通用首部、请求首部、响应首部和实体首部。

**其他**

可能包含HTTP的RFC里未定义的首部（Cookie等）。


## 编码提升传输速率

HTTP在传输数据时可以按照数据原貌直接传输，但也可以在传输过程中通过编码提升传输速率。

通过在传输时编码，能有效地处理大量的访问请求。

但是，编码的操作需要计算机来完成，因此会消耗更多的CPU资源。

1. 报文主体和实体主体的差异

- 报文（message）

是HTTP通信中的基本单位，由8位字节流（octet sequence，其中octet为8个比特）组成，通过HTTP通信传输。

- 实体（entity）

作为请求或响应的有效载荷数据（补充项）被传输，其内容由实体首部和实体主体组成。

HTTP报文的主体用于传输请求或响应的实体主体。

通常，**报文主体等于实体主体**。只有当传输中进行编码操作时，实体主体的内容发生变化，才导致它和报文主体产生差异。

2. 压缩传输的内容编码

向待发送邮件内增加附件时，为了使邮件容量变小，我们会先用ZIP压缩文件之后再添加附件发送。
HTTP协议中有一种被称为内容编码的功能也能进行类似的操作。

内容编码指明应用在实体内容上的编码格式，并保持实体信息原样压缩。内容编码后的实体由客户端接收并负责解码。

常用的内容编码有以下几种。

- gzip（GNU zip）
- compress(UNIX系统的标准压缩)
- deflate(zlib)
- identity(不进行编码)

3. 分隔发送的分块传输编码

在HTTP通信过程中，请求的编码实体资源尚未全部接收到之前，浏览器无法显示请求页面。
**在传输大容量数据时，通过把数据分割成多块，能够让浏览器逐步显示页面。**

这种把实体主体分块的功能称为分块传输编码（Chucked Transfer Coding)。

分块传输编码会将实体主体分成多个部分（块）。
每一块都会用十六进制来标记块的大小，而实体主体的最后一块会使用“0（CR+LF）”来标记。

使用分块传输编码的实体主体会由接收到客户端负责解码，恢复到编码前的实体主体。

HTTP/1.1中存在一种称为传输编码（Transfer Coding）的机制，它可以在通信时按某种编码方式传输，但只定义作用于分块传输编码中。

4. 发送多种数据的多部分对象集合

发送邮件时，我们可以在邮件里写入文字并添加多份附件。

这是因为采用了MIME（Multipurpose Internet Mail Extensions，多用途因特网邮件扩展）机制，它语序邮件处理文本、图片、视频等多个不同类型的数据。

例如，图片等二进制数据以ASCII码字符串编码的方式指明，这是利用MIME来描述标记数据类型。

而在MIME扩展中会使用一种称为多部分对象集合（Multipart）的方法，来容纳多份不同类型的数据。

相应地，HTTP协议中也采纳了多部分对象集合，发送的一份报文主体内可含有多类型实体。

通常是在图片或文本文件等上传时使用。

多部分对象集合包含的对象如下。

- multipart/form-data

在Web表单文件上传时使用。

- multipart/byteranges

状态码206（Partial Content，部分内容）响应报文包含了多个范围的内容时使用。

- multipart/form-data

Content-Type: multipart/form-data;
boudary=AaB03x

--AaB03x
Content-Disposition: form-data;
name="field1"
Joe Blow
--AaB03x
Content-Disposition: form-data;
name="pics"; filename="file1.txt"
Content-Type: text/plain

...(file1.txt的数据)...
--AaB03X--


- multipart/byteranges

HTTP/1.1 206 Partial Content
Date: Fri, 13 Jul 2012 02:45:26 GMT
Last-Modified: Fri,  31 Aug 2007 02:02:20 GMT
Content-Type: multipart/byteranges;
boundary=THIS_STRING_SEPARATES

--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 500-999/8000

...(范围指定的数据)...
--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 7000-7999/8000

...(范围指定的数据)...
--THIS_STRING_SEPARATES--

在HTTP报文中使用多部分对象集合时，需要在首部字段里加上Content-type。

使用boundary字符串来划分多部分对象集合指明的各类实体。
在boundary字符串中指定的各个实体的起始行之前插入"--"标记（例如：--AaB03x、--THIS_STRING_SEPATATES），而在多部分对象集合对应的字符串的最后插入“--”标记（例如：--AaB03x--,--THIS_STRING_SEPAATES--）作为结束。

多部分对象集合的每个部分类型中，都可以含有首部字段。
另外，可以在某个部分中嵌套使用多部分对象集合。
有关多部分对象集合更详细的解释，请看考RFC2046。

5. 获取部分内容的范围请求

以前，用户不能使用现在这种高速的带宽访问互联网，当时，下载一个尺寸稍大的图片或文件就已经很吃力了。

如果下载过程中遇到网络中断的情况，那就必须重头开始。

为了解决上述问题，需要一种可恢复的机制。

所谓恢复是指能从之前下载中断处恢复下载。

要实现该功能需要制定下载的实体范围。像这样，指定范围发送的请求叫做范围请求（Range Request）。

对一份1000字节大小的资源，如果使用范围请求，可以只请求5001~10000字节段的资源。

执行范围请求时，会用到首部字段Range来指定资源的byte范围。

byte范围的指定形式如下。

- 5001~10 000字节

Range: bytes=5001-10000

- 5001字节之后的全部数据

Range: bytes=5001- 

- 从一开始到3000字节和5000~7000字节的多重范围

Range: bytes=-3000, 5000-7000

针对范围请求，响应会返回状态码为206 Partial Content的响应报文。
另外，对于多重范围的范围请求，响应会在首部字段Content-Type标明multipart/byteranges后返回响应报文。

如果服务器无法响应范围请求，在会返回状态码200 OK和完整的实体内容。

6. 内容协商返回最合适的内容

同一个Web网站有可能存在着多份相同内容的页面。
比如英语版和中文版的Web页面，它们内容上虽相同，但使用的语言却不同。

当浏览器的默认语言为英语或中文，访问相同的URI Web页面时，则会显示对象的英语版或中文版的Web页面。

这样的机制成为内容协商（Content Negotiation）

内容协商机制是指客户端和服务器就响应的资源内容进行交涉，然后提供给客户端最为适合的资源。
内容协商会以响应资源的语言、字符集、编码方式等作为判断的基准。

包含在请求报文中的某些首部字段（如下）就是判断的基准。

- Accept
  
- Accept-Charset

- Accept-Encoding

- Accept-Language

- Content-Language

内容协商技术有以下3中类型。

**服务器驱动协商（Server-driven Negotiation）**

由服务器端进行内容协商。以请求的首部字段为参考，在服务器端自动处理。
但对用户来说，以浏览器发送的信息作为判断的依据，并不一定能筛选出最优内容。

**客户端驱动协商（Agent-driven Negotiation）**

由客户端进行内容协商的方式。用户从浏览器显示的可选项列表中手动选择。
还可以利用JavaScript脚本在Web页面上自动进行上述选择。
比如按OS的类型或浏览器类型，自行切换成PC版页面或手机版页面。

**透明协商（Transparent Negotatio）**

是服务器驱动和客户端驱动的结合体，是由服务器端和客户端各自进行内容协商的一种方法。