# AJAX - 3

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 跨域资源共享

通过XHR实现Ajax通信的一个主要限制，来源于跨境安全策略。
默认情况下，XHR对象只能访问与包含它的页面位于同一域中的资源。

这种安全策略可以预防某些恶意行为。
但是，实现合理的跨域请求对开发某些浏览器应用程序也是至关重要的。

CORS( Cross-Origin Resource Sharing，跨域资源共享)是W3C的一个工作草案，定义了在必须访问跨域资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想，就是使用自定义的HTTP头部让浏览器与服务器进行沟通，浏览器从而决定请求或响应是应该成功，还是应该失败。

比如一个简单的使用GET或POST发送的请求，它没有自定义的头部，而主体内容是text/plain。
在发送该请求时，需要给它附加一个额外的Origin头部，其中包含请求页面的源信息（协议、域名和端口），以便服务器根据这个头部信息来决定是否给予响应。

下面是Origin头部的一个示例：

```
Origin: http://www.nczonline.net
```

如果服务器认为这个请求可以接受，就在Access-Control-Allow-Origin头部中回发相同的源信息（如果是公共资源，可以回发"*"。

```
Access-Control-Allow-Origin： http://www.nczonline.net
```

如果没有这个头部，或者有这个头部但源信息不匹配，浏览器就会驳回请求。
正常情况下，浏览器会处理请求。注意，请求和响应都不包含cookie信息。

### IE对CORS的实现

微软只在IE8中引入了XDR(XDomainRequest)类型。
这个对象与XHR类似，但能实现安全可靠的跨域通信。
XDR对象的安全机制部分实现了W3C的CORS规范。
以下是XDR与XHR的一些不同之处。

- cookie不会随请求发送，也不会随响应返回。
- 只能设置请求头部信息中的Content-Type字段。
- 不能访问响应头部信息。
- 只支持GET和POST请求。

这些变化使CSRF（Cross-Site Request Forgery，跨站点请求伪造）和XSS（Cross-Site Scripting，跨站点脚本）都得问题得到了缓解。被请求的资源可以根据它认为合适的任意数据（用户代理、来源页面）来决定是否设置Access-Control-Allow-Origin头部。

作为请求的一部分，Origin头部的值表示请求的来源域，以便远程资源明确地识别XDR请求。

XDR对象的使用方法与XHR对象非常相似。
也是创建一个XDomainRequest的实例，调用open()方法，再调用send()方法。。
但与XHR对象的open()方法不同，XDR对象的open()方法只接收两个参数：请求的类型和URL。

所有XDR请求都是异步执行的，不能用它来创建同步请求。
请求返回之后，会触发load事件，响应的数据也会保存在responseText属性中。

```
var xdr = new XDomianRequest();

xhr.onload = function() {
    console.log(xdr.responseText);
};

xhr.open("get", "http://www.somewhere-else.conm/page/");

xhr.send(null);
```

在接收到响应后，你只能访问响应的原始文本；
没有办法确定响应的状态代码。而且，只要响应有效就会触发load事件，如果失败（包括响应中缺少Access-Control-Allow-Origin 头部）就会触发error事件。
遗憾的是，除了错误本身之外，没有其他信息可用，因此唯一能够确定的就只有请求未成功了。
要检测错误，可以像下面这样指定一个onerror事件处理程序。

```
var xdr = new XDomainRequest();
xhr.onload = function(){
    console.log(xdr.responseText);
};

xdr.onerror = function(){
    console.log("An error occurred");
};

xdr.open("get", "http://www.somewhere-else.com/page/");

xdr.send(null);
```

**鉴于导致XDR请求失败的因素很多，因此建议你不要忘记通过onerror事件处理程序来捕获该事件；否则，即使请求失败也不会有任何提示。**

在请求返回前调用abort()方法可以终止请求:

```
xdr.abort(); //终止请求
```

与XHR一样，XDR对象也支持timeout属性以及ontimeout事件处理程序。

```
var xdr = new XDomianRequest();
xdr.onload = function() {
    alert(xdr.reponseText);
};

xdr.onerror = function(){
    alert("An error occurred.");
};

xdr.timeout = 1000;

xdr.ontimeout = function(){
    alert("Request took too long.");
};

xdr.open("get", "http://www.somewhere-else.com/page/");

xdr.send(null);
```

这个例子会在运行1秒钟后超时，并随即调用ontimeout事件处理程序。

为支持POST请求，XDR对象提供了contentType属性，用来表示发送数据的格式。

```
var xdr =  new XDomainRequest();

xdr.onload = function(){
    alert(xdr.reponseText);
};

xdr.onerror = funciton() {
    alert("An Error Occured.");
};

xdr.open("post", "http://www.somewhere-else.com/page/");
xdr.contentType = "application/x-www-form-urlencoded";
xdr.send("name1=value1&name2=value2");
```

这个属性是通过XDR对象影响头部信息的唯一方式。

## 其他浏览器对CORS的实现

Firefox 3.5+、Safari 4+、Chrome、iOS版Safari和Android平台中的WebKit都通过XMLHttpRequest对象实现了对CORS的原生支持。

在尝试打开不同来源的资源时，无需编写额外的代码就可以出发这个行为。

要请求位于另外一个域中的资源，使用标准的XHR对象并在open()方法中传入绝对URL即可。

```
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
    if(xhr.readyState === 4) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            console.log(xhr.responseText)
        } else {
            console.log("Request was unsuccessful:"  + xhr.status);
        }
    }
}

xhr.open("get", "http://www.somewhere-else.com/page/", true);

xhr.send(null);

```

与IE中的XDR对象不同，通过跨域XHR对象可以访问status和statusText属性，而且还支持同步请求。跨域XHR对象也有一些限制，但为了安全这些限制是必需的。

以下就是这些限制。

- 不能使用setRequestHeader()设置自定义头部。

- 不能发送和接收cookie

- 调用getAllResponseHeaders()方法中会返回空字符串

由于无论同源请求还是跨域请求都使用相同的接口，因此对于本地资源，最好使用相对URL，在访问远程资源时再使用绝对URL。这样做能消除歧义，避免出现限制访问头部或本地cookie信息等问题。

###  Preflighted Requests

CORS通过一种叫做Preflighted Requests的透明服务器验证机制支持开发人员使用自定义的头部、GET或POST之外的方法，以及不同类型的主体内容。

在使用下列高级选项来发送请求时，就会向服务器发送一个Preflight请求。这种请求使用OPITIONS方法，发送下列头部。

- Origin： 与简单的请求相同。

- Access-Control-Request-Method: 请求自身使用的方法。

- Access-Control-Request-Headers: 自定义的头部信息，多个头部以逗号分隔。

以下是一个带有自定义头部NCZ的使用POST方法发送的请求。

```
Origin: http://www.nczonline.net
Access-Control-Request-Method: POST
Access-Control-Request-Headers: NCZ
```

发送这个请求后，服务器可以决定是否允许这种类型的请求。
服务器通过在响应中发送如下头部与浏览器进行沟通。

```
- Access-Control-Allow-Origin: 与简单的请求相同
- Access-Control-Allow-Methods: 允许的方法，多个方法以逗号分隔。
- Access-Control-Allow-Headers: 允许的头部，多个头部以逗号分隔。
- Access-Control-Max-Age: 应该将这个Preflight请求缓存多长时间。
```

例如

```
- Access-Control-Allow-Origin: http://www.nczonline.net
- Access-Control-Allow-Methods: POST, GET
- Access-Control-Allow-Headers: NCZ
- Access-Control-Max-Age: 1728000
```

Preflight请求结束后，结果将按照响应中指定的时间缓存起来。
而为此付出的代价只是第一次发送这种请求时多一次HTTP请求。

支持Preflight请求的浏览器包括Firefox 3.5+、Safari 4+ 和 Chrome。

IE 10 及跟早版本都不支持。

### 带凭证的请求

默认情况下，跨域请求不提供凭据（cookie、HTTP认证及客户端SSL证明等）。

通过将withCredentials 属性设置为true，可以指定某个请求应该发送凭证。

如果服务器接受带凭证的请求，会用下面的HTTP头部来响应。

```
Access-Control-Allow-Credentials: true
```

如果发送的是带凭证的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给JavaScript。另外，服务器还可以在Preflight响应中发送这个HTTP头部，表示允许源发送带凭证的请求。

支持widthCredentials属性的浏览器有Firefox 3.5+、Safari 4+和Chrome。

IE10及更早版本都不支持。

### 跨浏览器的CORS

即使浏览器对CORS的支持程度不一样，但所有浏览器都支持简单（非Preflight和不带凭据的）请求，因此有必要实现一个跨浏览器的方案。

检测XHR是否支持CORS的最简单方式，就是检查是否存在withCredentials属性。

再结合检测XDomainRequest对象是否存在，就可以兼顾所有浏览器了。

```
function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();
    if("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

var request = createCORSRequest("get", "http://www.somewhere-else.com/page/");

if(request) {
    request.onload = function(){
        //对request.responseText进行处理
    };
    request.send();
}
```

Firefox、Safari和Chrome中的XMLHttpRequest对象与IE中的XDomainRequest对象类似，都提供了够用的接口，因此以上模式还是相当有用的。

- abort(): 用于停止正在进行的请求。
- onerror: 用于替代 onreadystatechange 检测错误。
- onload: 用于替代 onreadystatechange 检测成功。
- responseText: 用于取得相应内容。
- send(): 用于发送请求

以上成员都包含在createCORSRequest()函数返回的对象中，在所有浏览器中都能正常使用。

## 其他跨域技术

在CORS出现之前，要显示跨域Ajax通信颇费一些周折。
开发人员想出了一些办法，利用DOM中能够执行跨域请求的功能，在不依赖XHR对象的情况下也能发送某种请求。虽然CORS技术已经无处不在，但开发人员自己发明的这些技术仍然被广泛使用，毕竟这样不需要修改服务器端代码。

### 图像Ping

上述第一种跨域请求技术是使用\<img>标签。
我们知道，一个网页可以从任何网页中加载图像，不用担心跨域不跨域。
这也是在线广告跟踪浏览器量的主要方式。

可以动态地创建图像，使用它们的onload和onerror事件处理程序来确定是否接收到了响应。

动态创建图像经常用于图像Ping。
图像Ping是与服务器进行简单、单向的跨域通信的一种方式，

请求的数据是通过查询字符串形式发送的，而响应可以是任意内容，但通常是像素图或204响应。

通过图像 Ping，浏览器得不到任何具体的数据，但通过侦听load和error事件，它能知道响应是什么时候接收到的。

```
var img = new Image();
img.onload = img.onerror = function(){
    console.log("done");
};

img.src = "http://www.example.com/test?name=Nicholas";
```

这里创建了一个Image的实例，然后将onload和onerror事件处理程序指定为同一个函数。
这样无论是什么响应，只要请求完成，就能得到通知。

请求从设置src属性那一刻开始，而这个例子在请求发送了一个name参数。

图像Ping最常用于跟踪用户点击页面或动态广告曝光次数。

图像Ping有两个主要的缺点，一是只能发送GET请求，二是无法访问服务器的响应文本。

因此，图像Ping只能用于浏览器与服务器间的单向通信。

### JSONP

JSONP是JSON with padding（填充式JSON或参数式JSON）的简写，是应用JSON的一种新方法，在后来的Web服务中非常流行。

JSONP看起来与JSON差不多，只不过是被包含在函数调用中的JSON，就像下面这样。

```
callback({"name":"Nicholas"});
```

JSONP由两个部分组成：回调函数和数据。

回调函数是当响应到来时应该在页面中调用的函数，回调函数的名字一般是在请求中指定的。

而数据就是传入回调函数中的JSON数据。

下面是一个典型的JSONP请求。

```
http://freegeoip.net/json?callback=handleRespnse
```

这个URL是在请求一个JSONP地理定位服务。
通过查询字符串来指定JSONP服务的回调参数是很常见的，就像上面的URL所示，这里指定的回调函数的名字叫handleResponse();

JSONP是通过动态\<script>元素来使用，使用时可以为src属性指定一个跨域URL。
这里的\<script>元素与</img>元素类似，都有能力李不受限制地从其他域加载资源。
因为JSONP是有效的JavaScript代码，所以在请求完成后，即在JSONP响应加载到页面中以后，就会立即执行。

```
function handleResponse(response) {
    console.log("You're at IP address " + response.ip + ", which is in " + response.city + ", " +  response.region_name);
}

var script = document.createElement("script");

script.src = "http://freegeoip.net/json/?callback=handleResponse";

document.body.insertBefore(script, document.body.firstChild);
```

JSONP之所以在开发人员中纪委流行，主要原因是它非常简单易用。
与图像Ping相比，它的优点在于能够直接响应文本，支持在浏览器与浏览器之间双向通信。

不过，JSONP也有两点不足。

首先，JSONP是从其他域中加载代码执行。如果其他域不安全，很可能会在响应中夹带一些恶意代码。而此时除了完全放弃JSONP调用之外，没有办法追究。因此在使用不是你自己运维的Web服务时，一定得保证它安全可靠。

其次，要确定JSONP请求是否失败并不容易。虽然HTML5给\<script>元素新增了一个onerror事件处理程序，但目前还有得到任何浏览器支持。为此，开发人员不得不使用计时器检测指定时间内是否接收到响应。但就算这样也不能尽如人意，毕竟不是每个用户上网的速度和带宽一样。