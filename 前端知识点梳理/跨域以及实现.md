## 关于跨域

## **why?**

为什么会有跨域？

我们得先了解下 ==同源策略（SOP, Same Origin Policy)==。

浏览器出于安全方面的考虑，只能访问与包含它的页面位于同一个域中的资源，该策略为通信设置了“相同的协议、相同的域、相同的端口”这一限制。试图访问上述限制之外的资源，都会引发安全错误。这种安全策略可以预防某些恶意行为。

简而言之，
1. 同协议 Same Protocol
2. 同域名 Same Hostname 
3. 同端口号 Same Port

Same Protocol && Same Hostname && Same Port

---

## **What?**

什么是跨域？

==跨域就是采取技术方案突破同源策略的限制，实现不同域之间交互（请求响应）。==

---

## **How?**
那么如何实现跨域呢?
有以下几种方法。

==方法一==

 **CORS (Cross-Origin Resource Sharing，跨域源资源共享)**,是一种ajax跨域请求资源的方式，支持现代浏览器，IE支持10以上，通过XMLHttpRequest实现Ajax通信的一个主要限制就是同源策略。
CORS是W3C的一个工作草案，定义了在必须访问跨境资源时，浏览器和服务器该如何沟通。CORS的基本思想，就时使用自定义的HTTP头部让浏览器和服务器进行沟通，从而决定请求或者响应应该成功还是失败。
实现思路：使用XMLHttpRequest发送请求时，浏览器会给该请求自动添加一个请求头：Origin。服务器经过一系列处理，如果确定请求来源页面属于白名单，则在响应头部加入首部字段：Access-Control-Allow-Origin。浏览器比较请求头部的Origin 和响应头部的 Access-Control-Allow-Origin是否一致，一致的话，浏览器得到响应数据。如果服务器没有设置Access-Control-Allow-Origin 或者这个头部源信息不匹配，浏览器就会驳回请求。

***模拟CORS的实现***

步骤1. 

如何伪装一个网站（在本地）？

1.编辑hosts文件

苹果mac: 直接在git bash上输入命令行操作即可 “sudo vi /etc.hosts” ，或者下载一些图形界面应用软件直接修改。

Windows操作系统: 

 1. win键（四个方块的键）+ R = 弹开运行窗口
 2. 复制该文件路径 c:\windows\system32\drivers\etc
 3. 选中hosts文件，右键-属性-安全-选择组或用户名（添加修改保存的权限的对象）- 编辑 - 再次选择组或用户名（添加修改保存的权限的对象 - 勾选权限（选项在此不表）
 4. 打开hosts文件，写入 127.0.0.1	localhost；127.0.0.1	bai.com；127.0.0.1	google.com；可以写入你任何你想模拟的网站，按照这种对应关系格式即可， ip地址+域名。


步骤2.
所需工具
node.js && git bash（模拟服务器)，一个简单的html页面里面有个跨域请求的Ajax通信。

```
<!-- 前端 -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Google</title>
	<style type="text/css">
		body>h1 {
			text-align: center;
		}
		h1 {
			margin: 0 auto;
		}

	</style>
</head>
<body>
	<h1>hello world</h1>
	<script type="text/javascript">
	//CORS的实现
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if( (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
			var responseData = xhr.responseText;
			console.log(responseData)
			//['NBA Break News','CBA Break News']
		}

	}
	xhr.open('GET', 'http://baidu.com:8080/getNews', true);
	xhr.send()

	</script>
</body>
</html>

```
```
//nodeJS模拟后端响应CORS的实现
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

http.createServer(function(req, res){

 	var urlObj = url.parse(req.url, true)

	switch (urlObj.pathname){

	case '/getNews':
	var news = ['NBA Break News','CBA Break News']
	//CORS的实现
	res.setHeader('Access-Control-Allow-Origin','http://google.com:8080')
    /*res.setHeader('Access-Control-Allow-Origin','*')
    服务器设置公用接口
    */
	res.end(JSON.stringify(news));
	break;

	case '/' :
	if(urlObj.pathname == '/') {
		urlObj.pathname += 'index.html'
	}

	default: 
	var filePath = path.join(__dirname, urlObj.pathname);
	fs.readFile(filePath,'binary', function(error, fileContent){
		if(error){
			console.log('404')
			res.writeHeader(404, 'not found')
			res.end('<h1>404,not found</h1>')
		}else {
			res.write(fileContent, 'binary')
		}
	})
	}

}).listen(8080);
```
上面代码就是CORS实现的过程。

1. 在本地修改hosts文件，127.0.0.1	google.com， 页面的url为 http://google.com:8080。

2. 在title为google的页面上添加一个ajax请求,该请求以get方法会向baiduServer的端口（'http://baidu.com:8080/getNews'）发送一个请求。
3. 浏览器会给请求头加上Origin: http://google.com:8080, Request URL: http://baidu.com:8080/getNews。 
4. baiduServer后端，响应头添加首部字段。Access-Control-Allow-Origin: http://google.com:8080。 表明该服务器（baiduServer）接受请求并给予响应。
5. 浏览器比较请求头部的Origin 和响应头部的 Access-Control-Allow-Origin是否一致，一致的话，浏览器得到响应数据。如果服务器没有设置Access-Control-Allow-Origin: http://google.com:8080 或者这个头部源信息不匹配，浏览器就会驳回请求。

当然服务器也可以设置公用接口， res.setHeader('Access-Control-Allow-Origin','*')
    服务器设置公用接口， 任何人都可以使用该服务器这个端口的数据。
    


==方法二==

**JSONP，是JSON with padding的简写（填充式JSON或参数式JSON）。**

JSONP的原理，通过动态<script>元素，使用时可以为该元素的src属性添加一个跨域URL, <script>元素的src有能力不受限制地从其他域中，加载资源。
凡是拥有src这个属性的元素都可以跨域，例如<script><img><iframe>。

JSONP和JSON看起来差不多，只不过是被包含在函数调用中的JSON。

JSONP由两个部分组成：回调函数和数据。回调函数是当响应到来时应该在页面中调用的函数。回调函数的名字一般是在请求中指定的，所以需要对应接口的后端配合才能实现。而数据就是传入回调函数中的JSON数据。

***模拟JSONP的实现***

HTML
```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Google</title>
	<style type="text/css">
		body {
			text-align: center;
		}
		h1 {
			margin: 0 auto;
		}
		ul, li {
			list-style: none;
		}
	
	</style>

</head>
<body>
	
	<h1>hello world</h1>
	<ul class="news">

	</ul>
	
	<!--JSONP的代码实现方法1-->

	<!-- <script type="text/javascript">
	
	function getResponseData(jsonData){
		document.write(jsonData[0] + ', ');
		document.write(jsonData[1]);
		//NBA Break News, CBA Break News
	
	}
	</script>
	<script src="http://baidu.com:8080/getNews?newsData=getResponseData">
	//getResponseData(["NBA Break News","CBA Break News"])
	</script> -->
	
	<!--JSONP的代码实现方法2-->
	<script>
		
		var script = document.createElement('script');
		script.setAttribute('src', 'http://baidu.com:8080/getNews?newsData=getResponseData');
		$('body').appendChild(script);
		$('body').removeChild(script);

		

		function getResponseData(jsonData){
		var nodeStock = document.createDocumentFragment();
		for(var i = 0; i < jsonData.length; i++) {
			var newsNode = document.createElement('li');
			newsNode.innerText = jsonData[i];
			nodeStock.appendChild(newsNode)
		};

		$('.news').appendChild(nodeStock)
		// <li>NBA Break News</li>   <li>CBA Break News</li>
		};

		function $(selector) {
			return document.querySelector(selector);
		};

	</script>



</body>
</html>
```
nodeJS

```
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

http.createServer(function(req,res){
	var urlObj = url.parse(req.url, true);
	switch(urlObj.pathname) {
		case '/getNews' :
		var news = ['NBA Break News','CBA Break News'];
		res.setHeader('Content-Type','text/javascript; charset=utf-8');
		if(urlObj.query.newsData){
			var data = urlObj.query.newsData + '(' + JSON.stringify(news) + ')' ;
			res.end(data);
		} else {
			res.end(JSON.stringify(news))
		}
		break;

		case '/' :
		if(urlObj.pathname == '/') {
			urlObj.pathname +=  'index.html'
		}

		default:
			fs.readFile(path.join(__dirname, urlObj.pathname), function(error, data) {
				if(error) {
					res.writeHeader(404, 'not found');
					res.end('<h1>404, Not Found</h1>');
				} else {
					res.end(data)
				}
			});

	};
}).listen(8080);
```


==方法三==

**降域，主要应用场景是同一页面下不同源的框架iframe请求**

基于iframe实现的跨域，要求两个域都必须属于同一个基础域, 比如 a.xx.com, b.xx.com，都有一个基础域xx.com, 使用同一协议和端口，这样在两个页面中同时添加documet.domain,就可以实现父页面操控子页面（框架）。


关于document.domain, 用来得到当前网页的域名。在浏览器输入URL，wwww.baidu.com。 http://wwww.baidu.com, document.domain 为 "www.baidu.com"。 也可以为document.domain赋值， 不过有限制，就是前面提到的，只能赋值为当前的域名或者基础域名。
范例：

document.domain = "www.baidu.com" //successed 赋值成功， 当前域名。

document.domain = "baidu.com" // successed 赋值成功， 基础域名。

  


但是下面的赋值会报错（参数无效）。

"VM50:1 Uncaught DOMException: Failed to set the 'domain' property on 'Document': 'a.baidu.com' is not a suffix of 'www.baidu.com'.
    at <anonymous>:1:17"。

范例
document.domain = "google.com" // fail, 参数无效

document.domain = "a.baidu.com" // fail， 参数无效

因为google.com 和 a.baidu.com不是当前的域名，也不是当前域名的基础域名。
原因： 浏览器为了防止恶意修改document.domain来实现跨域偷取数据。

-- --
==模拟降域的实现==

错误范例：

hosts 文件设置 win10系统路径为 c:\windows\system32\drivers\etc\hosts
127.0.0.1	a.com
127.0.0.1	b.com

a.com的一个网页（a.html）里面 利用iframe引入一个b.com里的一个网页（b.html ）。在a.html里面可以看到b.html的内容，但不能用Javascript来操作它。
原因: 这两个页面属于不同的域，在操作之前，浏览器会检测两个页面的域是否相等，相等则允许操作，不相等则报错。
这个例子里，不可能把a.html与b.html，利用JS改成同一个域。原因：两个域的基础域名不相等。


在http://a.com:8080/a.html的控制台（console), 输入代码window.frames[0].document.body //VM150:1 Uncaught DOMException: Blocked a frame with origin "http://a.com:8080" from accessing a cross-origin frame.
    at <anonymous>:1:18

```
<!--a.com的一个网页（a.html）里面 利用iframe引入一个b.com里的一个网页（b.html ） -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>a.com:8080/a.html</title>
</head>
<body>
	<iframe src="http://b.com:8080/b.html" frameborder="1"></iframe>
</body>
</html>
```
```
<!-- b.html-->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>b.com:8080/b.html</title>
</head>
<body>
	<h1>this is b.html </h1>
	<input type="text" placeholder="How are you? this is http://b.com:8080/b.html">
</body>
</html>
```
```
//nodeJS 
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

http.createServer(function(req,res){
	var urlObj = url.parse(req.url, true);
	switch(urlObj.pathname) {
		case '/getNews' :
		var news = ['NBA Break News','CBA Break News'];
		res.setHeader('Content-Type','text/javascript; charset=utf-8');
		if(urlObj.query.newsData){
			var data = urlObj.query.newsData + '(' + JSON.stringify(news) + ')' ;
			res.end(data);
		} else {
			res.end(JSON.stringify(news))
		}
		break;

		case '/' :
		if(urlObj.pathname == '/') {
			urlObj.pathname +=  'index.html'
		}

		default:
			var filePath = path.join(__dirname, 'static' ,urlObj.pathname);
			console.log(filePath)
			fs.readFile(filePath, function(error, data) {
				if(error) {
					res.writeHeader(404, 'not found');
					res.end('<h1>404, Not Found</h1>');
				} else {
					res.end(data)
				}
			});

	};
}).listen(8080);
```
可以把iframe的src改变为"http://a.com:8080/b.html"，这样就可以了，是不会有这个问题的，因为域相等。
控制台不会报错，但是这样没完成跨域。可以使用html5中的postMessage来实现，针对基础域不同的框架，这里暂且不表， 在方法四，会用到这种方法。

window.frames[0].document.body

<body>​<h1>​this is b.html ​</h1>​<input type=​"text" placeholder=​"How are you? this is http:​/​/​b.com:​8080/​b.html">​</body>​

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>a.com:8080/a.html</title>
</head>
<body>
	<!-- <iframe src="http://b.com:8080/b.html" frameborder="1"></iframe> -->
	<iframe src="http://a.com:8080/b.html" frameborder="1"></iframe>
</body>
</html>
```
==正确范例：
降域的实现==

hosts文件设置

基础域名相同

127.0.0.1  a.shawroc.com

127.0.0.1  b.shawroc.com


a.shawroc.com的里面一个网页（a.html）引入b.shawroc.com里的一个网页(b.html)，a.shawroc.com还是不能操作b.shawroc.com里面的内容。
原因：document.domain不一样，a.shawroc.com vs b.shawroc.com。
但是两个页面的基础域名是一样的，通过JS，将两个页面的domain改成一样。
在a.html 和 b.html 里都加入
<script type="text/javascript">
document.domian = shawroc.com
</script>

这样在两个页面中同时添加document.domain， 就可以实现父页面操控子页面（框架）。

控制台
window.frames[0].document.body
//console输出
```
<body>
	<h1>this is http://b.shawroc.com:8080/b.html </h1>
	<input type="text" placeholder="How are you? this is http://b.shawroc.com:8080/b.html">
	<script>
	document.domain = 'shawroc.com';
	</script>

</body>
```

代码
```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>a.shawroc.com:8080</title>
</head>
<body>
	<!-- <iframe src="http://b.com:8080/b.html" frameborder="1"></iframe> -->
	<iframe src="http://b.shawroc.com:8080/b.html" frameborder="1" height="400px" width="600px"></iframe>
	<script>
	document.domain = 'shawroc.com';
	</script>
</body>
</html>
```
```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>b.shawroc.com:8080/b.html</title>
</head>
<body>
	<h1>this is http://b.shawroc.com:8080/b.html </h1>
	<input type="text" placeholder="How are you? this is http://b.shawroc.com:8080/b.html">
	<script>
	document.domain = 'shawroc.com';
	</script>
</body>
</html>
```

==方法四==

html5的postMessage API

html5引入的postMessage()方法，允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

postMessage(data, origin) 方法，接受两个参数。

 1.data:要传递的数据，html5规范中提到该参数可以是JavaScript的任意基本类型或可复制的对象，然而并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以我们在传递参数的时候需要使用JSON.stringify()方法对对象参数序列化，在低版本IE中引用json2.js可以实现类似效果。

2.origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然如果愿意也可以建参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。

范例

**模拟postMessage的工作机制**

改写hosts文件

127.0.0.1 a.com

127.0.0.1 b.com



```
<!--a.html-->

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>a.com:8080</title>
</head>
<body>
	<div class="textMessageInACom">
		<input type="text" placeholder="http://a.com:8080/a.html">
	</div>
	<iframe src="http://b.com:8080/b.html" frameborder="1" height="400px" width="600px"></iframe>
	<script>

	$('.textMessageInACom input').addEventListener('input', function(){
		window.frames[0].postMessage(this.value, 'http://b.com:8080');
	})
	//步骤1 a.com:8080/a.html页面下的input发生输入事件时， 向目标窗口发一个MessageEvent事件<iframe src="http://b.com:8080/b.html">, MessageEvent.data可以获得this.value的值。接下来切换到b.html页面

	window.addEventListener('message', function(messageEvent){
		$('.textMessageInACom input').value = messageEvent.data
	})
	// 步骤4 监听嵌套页面b.com:8080的message事件，把b.com:8080的input.value（message.data)赋值给a.com:8080的input.value， 就可以实现输入内容的同步啦。
	
	function $(selector){
		return document.querySelector(selector);
	}

	</script>
</body>
</html>
```
```
<!--b.html-->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>b.shawroc.com:8080/b.html</title>
</head>
<body>
	<h1>this is http://b.com:8080/b.html </h1>
	<input id="input" type="text" placeholder="How are you? this is http://b.com:8080/b.html">

</body>
<script>
 window.addEventListener('message', function(e){
 	$('#input').value = e.data;
 })
 //步骤2, 在b.com:8080/b.html监听message事件
 
 $('#input').addEventListener('input', function() {
 	window.parent.postMessage(this.value, 'http://a.com:8080');
 })
 //步骤3，b.com的input发生输入事件时，向嵌套页面的父页面window.parent, a.com:8080 postMessage，然后切回到a.html，


function $(selector){
		return document.querySelector(selector);
	}

</script>
	
</html>
```
```
//nodeJS  模拟后端
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

http.createServer(function(req,res){
	var urlObj = url.parse(req.url, true);
	switch(urlObj.pathname) {
		case '/getNews' :
		var news = ['NBA Break News','CBA Break News'];
		res.setHeader('Content-Type','text/javascript; charset=utf-8');
		if(urlObj.query.newsData){
			var data = urlObj.query.newsData + '(' + JSON.stringify(news) + ')' ;
			res.end(data);
		} else {
			res.end(JSON.stringify(news))
		}
		break;

		case '/' :
		if(urlObj.pathname == '/') {
			urlObj.pathname +=  'index.html'
		}

		default:
			var filePath = path.join(__dirname, 'postMessage' ,urlObj.pathname);
			fs.readFile(filePath, function(error, data) {
				if(error) {
					res.writeHeader(404, 'not found');
					res.end('<h1>404, Not Found</h1>');
				} else {
					res.end(data)
				}
			});

	};
}).listen(8080);
```
解析代码
步骤1， a.com:8080/a.html页面下的input发生输入事件时， 向目标窗口发一个MessageEvent事件<iframe src="http://b.com:8080/b.html">, MessageEvent.data可以获得this.value的值。接下来切换到b.html页面。

步骤2， 在b.com:8080/b.html监听message事件，在这，就可以实现 a.com:8080/a. html的input标签输入什么，嵌入在 a.com:8080/a. html的iframe框架（b.com:8080/b.html）同步父页面（a.com:8080/a. html）的输入内容了。

步骤3，b.com:8080/b.html的input发生输入事件时，向嵌套页面的父页面window.parent（a.com:8080 ）postMessage，然后切回到a.html。

步骤4， 监听嵌套页面b.com:8080/b.html的messageEvent事件，把b.com:8080/b.html的input.value（message.data)赋值给a.com:8080的input.value， 实现输入内容的双向同步。





