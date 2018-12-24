# AJAX - 2

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## XMLHttpRequest2级

鉴于XHR已经达到广泛接受，成为了事实标准，W3C也着手制定相应的标准以规范其行为。
XMLHttpRequest 1级只是把已有的XHR对象的实现细节描述了出来。
而XMLHttpRequest 2级则进一步发展了XHR。
并非所有浏览器都完整地实现了XMLHttpRequest 2级规范，但所有浏览器实现了它规定的部分内容。

### FormData

现代Web应用中频繁使用的一项功能就是表单数据的序列化，XMLHttpRequest 2级为此定义了FromData类型。
FormData为序列化表单以及创建与表单格式相同的数据(用于通过XHR传输)提供了便利。

下面的代码创建了一个FromData对象，并向其中添加了一些数据。

```
var data = new FormData();
data.append("name", "Nicholas");
```

这个append()方法接收两个参数：键和值，分别对应表单字段的名字和字段中包含的值。
可以像这样添加任意多个键值对儿。
而通过向FormData构造函数中传入表单元素，也可以用表单元素的数据预先向其中填入键值对儿：

```
var data = new FormData(document.forms[0]);
```

创建了FormData的实例后，可以将它直接传给XHR的send()方法。

```

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            console.log(xhr.responseText);
        }else {
            console.log("Request was unsuccessful: " + xhr.status);
        }
    }
}

xhr.open("post", "postexample.php", true);
var form = document.getElementById("user-info");
xhr.send(new FormData(from));

```

使用FormData的方便之处，体现在不必明确地在XHR对象上设置请求头部。
XHR对象能够识别传入的数据类型是FormData的实例，并配置适当的头部信息。

支持FormData的浏览器有Firefox 4+、Safari 5+、Chrome和 Android 3+版WebKit。

### 超时设定

IE8为 XHR 对象添加了一个 timeout 属性，表示请求在等待响应多少毫秒之后就终止。

在给timeout设置一个数值后，如果在规定的时间内浏览器还没有接收到响应，那么就会触发timeout时间，进而会调用ontimeout事件处理程序。这项功能后来也被收入了XMLHttpRequest2级规范中。

来看下面的例子：

```
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4) {
        try {
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                console.log(xhr.responseText);
            }else {
                console.log("Request was unsuccessful " +  xhr.status);
            }
        } catch(ex) {
            //假设由ontimeout事件处理程序处理
        }
    }
}

xhr.open("get", "timeout.php", true);
xhr.timeout = 1000; //将超时设置为1秒钟（仅适用于IE8+）
xhr.ontimeout = function(){
    console.log("Request did not return in a second");
};

xhr.send(null);
```

这个例子示范了如何使用timeout属性。

将这个属性设置为1000毫秒，意味着如果请求在1秒钟内还没有返回，就会自动终止。
请求终止时，会调用ontimeout事件处理程序。
但此时readyState可能已经改变为4了，这意味着会调用onreadystatechange事件处理程序。
可是，如果在超时终止请求之后再访问status属性，就会导致错误。

为避免浏览器报告错误，可以将检查status属性的语句封装在一个try-catch语句当中。

IE8+仍然是唯一支持超时设定的浏览器。

### overrideMimeType()方法

Firefox 最早引入了overrideMimeTyoe()方法，用于重写XHR响应的MIME类型。
这个方法后来也被纳入了XMLHttpRequest 2级规范。

因为返回响应的MIME类型决定了XHR对象如何处理它，所以提供一种方法能够重写服务器返回的MIME类型是很有用的。

比如，服务器返回的MIME类型是text/plain，但数据中实际包含的是XML。
根据MIME类型，即使数据是XML，responseXML属性中仍然是null。

通过调用overrideMimeType()方法，可以保证把响应当做XML而非纯文本来处理。

```
var xhr = new XMLHttpRequest();
xhr.open("get", "text.php", true);
xhr.overrideMimeType("text/xml");
xhr.send(null);
```

这个例子强迫XHR对象将响应当做XML而非纯文本来处理。
调用overrideMimeType()必须在send()方法之前，才能保证重写响应的MIME类型。

支持overrideMimeType()方法的浏览器有Firefox、Safari 4+、Opera 10.5和Chrome。

### 进度事件

Progress Events规范是W3C的一个工作草案，定义了与客户端服务器通信有关的事件。
这些事件最早其实只针对XHR操作，但目前也被其他API借鉴。

有以下6个进度事件。

- loadstart: 在接收到响应数据的第一个字节时触发。
- progress: 在接收响应期间持续不断地触发。
- error: 在请求发生错误时触发。
- abort: 在因为调用abort()方法时而终止连接时触发。
- load: 在接收到完整的响应数据时触发。
- loadend: 在通信完成或者触发error、abort或load事件后出发。

每个请求都从触发loadstart事件开始，接下来是一或多个progress事件，然后触发error、abort或load事件中的一个，最后以触发loadend事件结束。

支持前5个事件的浏览器有 Firefox 3.5+、 Safari 4+、Chrome、iOS版Safari和Android版Webkit。

Opera、IE 8+ 只支持load事件。目前还没有浏览器支持loadend事件。

#### load事件

Firefox 在实现XHR 对象的某个版本时，曾致力于简化异步交互模型。
最终，Firefox实现中引入了load事件，用以代替readystatechange事件。
响应接收完毕后将触发load事件，因此也就没有必要去检查readyState属性了。

而onload事件处理程序会接收到一个event对象，其target属性就指向XHR对象实例，因而可以访问到XHR对象的所有方法和属性。

然而，并非所有浏览器都为这个事件实现了适当的事件对象。

结果，开发人员还是要像下面这样被迫使用XHR对象变量。

```
var xhr = new XMLHttpRequest();

xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        console.log(xhr.responseText);
    }else {
        console.log("Request was unsuccessful: " +  xhr.status);
    }
}

xhr.open("get", "altevents.php", true);
xhr.send(null);
```

只要浏览器收到服务器的响应，不管其状态如何，都会触发load事件。
而这意味着你必须要检查status属性，才能确定数据是否真的已经可用了。
Firefox、Opera、Chrome和 Safari 都支持load事件。

#### progress事件

Mozilla对 XHR的另一个革新是添加了progress事件，这个事件会在浏览器接收新数据期间周期性触发。

而onprogress事件处理程序会接收到一个event对象，其target属性是XHR对象，但包含着三个额外的属性：

lengthComputable、position和totalSize。

其中，lengthComputable是一个表示进度信息是否可用的布尔值，position表示已经接收的字节数，totalSize表示根据Content-Length响应头部确定的预期字节数。

有了这些信息，我们就可以为用户创建一个进度指示器了。

下面展示了为用户创建进度指示器的一个示例。

```
var xhr = new XMLHttpRequest();

xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300 ||  xhr.status === 304) {
        console.log(xhr.responseText);
    }else{
        console.log("Request was unsuccessful: ” +  xhr.status);
    }
};

xhr.onprogress = function(event) {
    var divStatus = document.getElementById("status");
    if(event.lengthComputable) {
        divStatus.innerHTML = "Received " + event.position + " of " + event.totalSize + " bytes";
    }
};

xhr.open("get", "altevents.php", true);

xhr.send(null);
```

为确保正常执行，必须在调用open()方法之前添加onprogress事件处理程序。
在前面例子中每次触发progress事件，都会以新的状态信息更新HTML元素的内容。
如果响应头部中包含Content-Length字段，那么也可以利用此信息来计算从响应中已经接收到的数据的百分比。