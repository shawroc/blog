# AJAX - 1

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

2005年，Jesse James Garrett 发表了一篇在线文章，题为“Ajax: A new Approach to Web Application”(http://www.adaptivepath.com/ideas/essays/archives/000385.php)。

他在这篇文章里介绍了一种技术，用他的话说，就叫Ajax，是对Asychronous JavaScript + XML的简写。这一技术能够向服务器请求额外的数据而无须卸载页面，会带来更好的用户体验。Garret还解释了怎样使用这一技术改变自从Web诞生以来就一直沿用的“单击，等待”的交互模式。

Ajax技术的核心是XMLHttpRequest对象（简称XHR），这是由微软首先引入的一个特性，其他浏览器提供商后来都提供了相同的实现。在XHR出现之前，Ajax式的通信必须借助一些hack手段来实现，大多数是使用隐藏的框架或内嵌框架。XHR为向服务器发送请求和解析服务器响应提供了流畅的接口。能够以异步方式从服务器取得更多信息，意味着用户点击后，可以不必刷新页面也能取得新数据。也就是说，可以使用XHR对象取得新数据，然后再通过DOM将新数据插入到页面中。另外，虽然名字中包含XML的成分，但Ajax通信与数据格式无关。**这种技术就是无须刷新页面即可从服务器取得数据，但不一定是XML数据。

实际上，Garrett提到的这种技术已经存在很长时间了。在Garrett撰写那篇文章之前，人们通常将这种技术叫做远程脚本（remote scripting)，而且早在1998年就有人采用不同的手段实现了这种浏览器与服务器的通信。再往前推，JavaScript需要通过Java Applet或Flash电影等中间层向服务器发送请求。而XHR则将浏览器原生的通信能力提供给开发人员，简化了实现同样操作的任务。

在重命名为Ajax之后，大约是2005年年底2006年初，这种浏览器与服务器的通信技术可谓红极一时。人们对JavaScript和Web的全新认识，催生了很多使用原有特性的新技术和新模式。就目前来说，熟练使用XHR对象已经成为所有Web开发人员必须掌握的一种技能。

## XMLHttpRequest对象

IE5是第一款引入XHR对象的浏览器。
在IE5中，XHR对象是通过MSXML库中的一个ActiveX对象实现的。
因此，在IE中可能会遇到三种不同版本的XHR对象，即MSXML2.XMLHttp、MSXML2.XMLHttp.3.0和 MSXML2.XMLHtto.6.0。

```
function createXHR(){
    if(typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        if(typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                i, len;
            
            for(i = 0; len=versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch(ex) {
                    //skip
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("NO XHR object available.");
    }
}
```

这个函数中新增的代码首先检测原生XHR对象是否存在，如果存在则返回它的新实例。
如果原生对象不存在，则检测ActiveX对象。如果这两种对象都不存在，就抛出一个错误。
然后，就可以使用下面的代码在浏览器中创建XHR对象了。

```
var xhr = createXHR();
```

由于其他浏览器中对XHR的实现与IE最早的实现是兼容的，因此就可以在所有浏览器中都以相同的方式使用上面创建的xhr对象。

### XHR的用法

在使用XHR对象时，要调用的第一个方法是open()，它接受3个参数：要发送的请求的类型("get"、"post"等)、请求的URL和表示是否异步发送请求的布尔值。下面就是调用这个方法的例子。

```
xhr.open("get", "example.php", false);
```

这行代码会启动一个针对example.php的GET请求。
有关这行代码，需要说明两点：一是URL相对于执行代码的当前页面（当然也可以使用绝对路径）；
二是调用open()方法并不会真正发送请求，而只是启动一个请求以备发送。

**只能向同一个域中使用相同端口和协议的URL发送请求。如果URL与启动请求的页面有任何差别，都会引发安全错误。**

要发送特定的请求，必须像下面这样调用send()方法:

```
xhr.open("get", "example.txt", false);
xhr.send(null);
```

这里的send()方法接收一个参数，即要作为请求主体发送的数据。
如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必须的。
调用send()之后，请求就会被分派到服务器。

由于这次请求是同步的，JavaScript代码会等到服务器响应之后再继续执行。在收到响应后，响应的数据会自动填充XHR对象的属性，相关的属性简介如下。

- responseText: 作为响应主体被返回的文本。
- responseXML: 如果相应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着响应数据的XML DOM文档。

- status: 响应的HTTP状态。

- statusText: HTTP状态的说明。

在接收到响应后，第一步是检查status属性，以确定响应已经成功返回。
**一般来说，可以将HTTP状态码200作为成功的标志。**此时，responseText属性的内容已经就绪，而且在内容类型正确的情况下，respnseXML也应该能够访问了。

此外，状态码为304表示请求的资源并没有被修改，可以直接使用浏览器中缓存的版本。当然，也就意味着响应是有效的。为确保接收到适当的响应，应该像下面这样检查上述这两种状态代码：

```
xhr.open("get", "example.txt", false);

xhr.send(null);

if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
    //status 304 表示get请求成功，请求的资源未改变，可使用缓存资源。
    console.log(xhr.responseText);
} else {
    console.log("Request was unsuccessful: " + xhr.status);
}
```

根据返回的状态代码，这个例子可能会显示由服务器返回的内容，也可能会显示一条错误信息。
建议通过status来决定下一步的操作，不要依赖statusText，因为后者在跨浏览器使用时不太可靠。
另外，无论内容类型是什么，响应主体的内容都会保存到responseText属性中；
而对于非XML数据而言，responseXML 属性的值将为null。

像前面这样发送同步请求当然没有问题，但多数情况下，我们还是要发送异步请求，才能让JavaScript继续执行而不必等待响应。

此时，可以检测XHR对象的readyState属性，该属性表示请求/响应过程的当前活动阶段。

这个属性可取的值如下：

- 0: 未初始化。尚未调用open()方法。

- 1：启动。已经调用open()方法，但尚未调用send()方法。

- 2：发送。已经调用send()方法，但尚未收到响应。

- 3：接收。已经接收到部分响应数据。

- 4：完成。已经接收到全部响应数据源，而且已经可以在客户端使用了。

只要readyState属性的值由一个值变成另一个值，都会触发一次readystatechange事件。
可以利用这个事件来检测每次状态变化后readyState的值。
通常，我们只对readyState值为4的阶段感兴趣，因为这时所有数据都已经就绪了。
不过，必须在调用open()之前指定onreadystatechange事件处理程序才能确保跨浏览器兼容性。

```
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
    if(xhr.readyState ===  4) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            console.log(xhr.responseText);
        } else {
            console.log("Request was unsuccessful: " + xhr.status);
        }
    }
};

xhr.open("get", "example.text", true);
xhr.send(null);
```

以上代码利用DOM0级方法为XHR对象添加了事件处理程序，原因是并非所有浏览器都支持DOM2级方法。
与其他事件处理程序不同，这里没有向onreadystatechange事件处理程序传递event对象；
必须通过XHR对象本身来确定下一步该怎么做。

另外，在接收到响应之前还可以调用abort()来取消异步请求。

```
xhr.abort();
```

调用这个方法后，XHR对象会停止触发事件，而且也不再允许访问任何与相应有关的对象属性。
在终止请求之后，还应该对XHR对象进行解引用操作。
由于内存原因，不建议重用XHR对象。

### HTTP头部信息

每个HTTP请求和响应都会带有相应的头部信息，其中有的对开发人员有用，有的也没有什么用。
XHR对象提供了操作这两种头部（即请求头部和响应头部）信息的方法。

- Accept: 浏览器能够出来的内容类型。
- Accept-Charset: 浏览器能够显示的字符集。
- Accept-Encoding: 浏览器能够处理的压缩编码。
- Accept-Language: 浏览爱情当前设置的语言。
- Connection: 浏览器与服务器之间连接的类型。
- Cookie:  当前页面设置的任何Cookie。
- Host：发出请求的页面所在的域。
- Referer: 发出请求的页面的URL。注意，HTTP规范将这个头部字段拼写错了，而为保证与规范一致，也只能将错就错了（这个英文单词的正确拼法应该是referrer。）

- User-Agent: 浏览器的用户代理字符串。

虽然不同浏览器实际发送的头部信息会有所不同，但以上列出的基本上是所有浏览器都会发送的。
使用setRequestHeader()方法可以设置自定义的请求头部信息。
这个方法接受两个参数：头部字段的名称和头部字段的值。
要成功发送请求头部信息，必须在调用open()方法之后且调用send()方法之前调用setRequestHeader()。

```
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
        if( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            console.log(xhr.responseText);
        } else {
            console.log("Request was unsuccessful: " +  xhr.status);
        }
    }
}

xhr.open("get", "example.text", true);

xhr.setRequestHeader("MyHeader", "MyValue");

xhr.send(null);
```

服务器在接收到这种自定义的头部信息之后，可以执行相应的后续操作。
建议使用自定义的头部字段名称，不要使用浏览器正常发送的字段名称，否则有可能会影响服务器的响应。
有的刘看齐允许开发人员重写默认的头部信息，但有的浏览器则不允许这样做。

调用XHR对象的getResponseHeader()方法并传入头部字段名称，可以取得响应的响应头部信息。
而调用getAllResponseHeaders()方法则可以取得一个包含所有头部信息的长字符串。

```
var myHeader = xhr.getResponseHeader("MyHeader");
var allHeaders = xhr.getAllResponseHeaders();
```

在服务器端，也可以利用头部信息向浏览器发送额外的、结构化的数据。
在没有自定义信息的情况下，getAllResponseHeader()方法通常会返回如下所示的多行文本内容。

```
Date: Sun, 14 Nov 2004 18:04:03 GMT
Server: Apache/1.3.29 (Unix)
Vary: Accept
X-Power-By: PHP/4.3.8
Connection： close
Content-Type: text/html; charset=iso-8859-1
```

这种格式化的输出可以方便我们检查响应中所有头部字段的名称，而不必一个一个地检查某个字段是否存在。

### GET请求

GET是最常见的请求类型，最常用于向服务器查询某些信息。
必要时，可以将查询字符串参数追加到URL的末尾，以便将信息发送给服务器。
对XHR而言，位于传入open()方法的URL末尾的查询字符换必须经过正确的编码才行。

**使用GET请求经常会发生的一个错误，就是哈讯字符串的格式有问题。**
查询字符串中每个参数的名称和值都必须使用encodeURIComponent()进行编码，然后才能放到URL的末尾。
而且所有名-值对儿都必须由和号（&）分隔。

```
xhr.open("get", "example.php?name1=value&name2=value2", true);
```

下面这个函数可以辅助向现有URL的末尾添加查询字符串参数：

```
function addURLParam(url, name, value) {
    url += (url.indexOf("?") === -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}
```

这个addURLParam 函数接受三个参数：
要添加参数的URL、参数的名称和参数的值。

这个函数首先检查URL是否包含问号（以确定参数是否已有参数存在）。
如果没有，就添加了一个问号；
否则，就添加了一个和号。

然后，将参数名称和值进行编码，再添加到URL的末尾。
最后返回添加参数之后的URL.

下面是使用这个函数来构建请求URL的示例。

```
var url = "example.php";

url = addURLParam(url, "name", "Nicholas");
url = addURLParam(url, "book", "Professional JavaScript");

xhr.open("get", url, false);
```

在这里使用addURLParam()函数可以确保查询字符串的格式良好，并可靠地用于XHR对象。


### POST请求

使用频率仅次于GET的是POST请求，通常用于向服务器发送应该被保存的数据。

POST请求应该把数据作为请求的主体提交，而GET请求不是这样。

POST请求的主体可以包含非常多的数据，而且格式不限。

在open()方法第一个参数的位置传入"post"，就可以初始化一个POST请求，如下面的例子所示:

```
xhr.open("post", "example.php", true)
```

发送POST请求 第二部就是向send()方法中传入某些数据。
由于XHR最初的设计主要是为了处理XML，因此可以在此传入XML DOM文档，传入的文档经序列化之后将作为请求主体被提交到服务器。当然，也可以在此传入任何想发送到服务器的字符串。

默认情况下，服务器对POST请求和提交Web表单的请求并不会一视同仁。
因此，服务器端必须有程序来读取发送过来的数据，并从中解析出有用的部分。
不过，我们可以使用XHR来模仿表单提交，首先将Content-Type头部信息设置为application/x-www-form-urlencoded，也就是表单提交时的内容类型，其次是以适当的格式创建一个字符串。

POST数据的格式与查询字符串格式相同。

```
function submitData(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 ) {
            if(xhr.status >= 200 && hr.status < 300 || xhr.status === 304) {
                console.log(xhr.responseText);
            } else {
                console.log("Request was unsuccessful: " + xhr.status);
            }
        }
    }
}

xhr.open("post", "postexample.php", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

var form = document.getElementById("user-info");
xhr.send(serialize(form));

这个函数可以将ID为"user-info"表单中的数据序列化之后发送给服务器。
而下面的示例PHP文件postexample.php就可以通过$_POST取得提交的数据了：

```
<?php
    header("Content-Type: text/plain");
    echo <<<EOF
    Name: {$_POST['user-name']}
    Email: {$_POST['user-email']}
    EOF;
?>
```

如果不设置Content-Type头部信息，那么发送给服务器的数据就不会出现在$_POST超级局部变量中。
这时候，要访问同样的数据，就必须借助$HTTP_RAW_POST_DATA。

**与GET请求相比，POST请求消耗的资源会更多一些。从性能角度来看，以发送相同的 数据计，GET请求的速度最多可达到POST请求的两倍。**