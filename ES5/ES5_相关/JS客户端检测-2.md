# 客户端检测-2

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 用户代理检测

第三种，也是争议最大的一种客户端检测技术叫做**用户代理检测**。用户代理检测通过检测用户代理字符串来确定实际使用的浏览器。

在每一次HTTP请求过程中，用户代理字符串时作为响应首部发送的，而且该字符串可以通过JavaScript的navigator.userAgent属性访问。在服务器端，通过检测用户代理字符串来确定用户使用的浏览器是一种常用而且广为接受的做法。

**而在客户端，用户代理检测一般被当做一种万不得已才用的做法，其优先级排在能力检测和怪癖检测之后。**

提到与用户代理字符串有关的争议，就不得不提到电子欺骗（spoofing）。所谓电子欺骗，就是指浏览器通过在自己的用户代理字符串加入一些错误或误导性信息，来达到欺骗服务器的目的。要弄清楚这个问题的来龙去脉，必须从web问世初期用户代理字符串的发展讲起。

### 用户代理字符串的历史

HTTP规范（包括1.0和1.1版）明确规定，浏览器应该发送简短的用户代理字符串，指明浏览器的名称和版本号。RFC2616（即HTTP 1.1协议规范）是描述用户代理字符串的：

“产品标识符常用语通信应用标识本身，由软件名和版本组成。使用产品标识符的多数领域也允许列出作为应用程序主要部分的子产品，由空格分隔。按照惯例，产品要按照对应的重要程度依次列出，以便标识应用程序。”

上述规范进一步规定，用户代理字符串应该以一组产品的形式给出，字符串格式为：标识符/版本号。但是，现实中的用户代理字符串则绝没有那么简单。

1. 早期的浏览器

1993年，美国NCSA（National Center for Supercomputing Application。国家超级计算机中心）发布了世界上第一款Web浏览器Mosaic。这款浏览器的用户代理字符串非常简单。

Mosaic/0.9

尽管这个自妇产在不同操作系统和不同平台下会有所变化，但其基本格式还是很简单明了的。正斜杠前面的文本表示产品名称（有时候会出现NCSA Mosaic或其他类似字样），而正斜杠后面的产品的版本号。

Netscape Communication公司介入浏览器开发领域后，遂将自己产品的代号定名为Mozilla（Mosaic killer的简写，意为Mosaic杀手）。该公司第一个公开发行版，Netscape Navigator 2的用户代理字符串具有如下格式。

Mozilla/版本号 \[语言] (平台；加密类型)

Netscape在坚持将产品名和版本号作为用户代理字符串开头的基础上，又在后面依次添加了信息。

- 语言：即语言代码，表示应用程序时针对哪种语言设计。

- 平台: 即操作系统和平台，表示应用程序运行的环境。

- 加密类型：即安全加密的类型。可能的值有U(128位加密)、I（40位加密）和N（未加密）。

典型 的Netscape Navigator 2的用户代理字符串如下所示：

Mozilla/2.02 \[fr] (WinNT; I)

这个字符串表示浏览器是Netscape Navigator 2.02，为法语国家编译，运行在Window NT平台下，加密类型为40。那个时候，通过用户代理字符串中的产品名称，至少还能够轻易地确定用户使用的是什么浏览器。

2. Netscape Navigator 3和Internet Explorer 3

1996年，Netsccape Navigator 3发布，随即超越Mosaic成为当时最流行的Web浏览器。而用户代理字符串只做了一些小的改变，删除了语言标记，同时允许添加操作系统或系统使用的CPU等可选信息。

于是，格式变成如下所示：

Mozilla/版本号 （平台；加密类型 [; 操作系统极品CPU说明]

运行在Windows系统下的Netscape Navigator 3的用户代理字符串大致如下：

Mozilla/3.0 （win95; U）

这个字符串表示Netscape Navigator 3运行在Windows 95中，采用了128位加密技术。可见，在Windows系统中，字符串中的操作系统或CPU说明被省略了。

Netscape Navigator 3 发布后不久，微软也发布了其第一款赢得用户广泛认可的Web浏览器，即Internet Explorer 3。由于Netscape浏览器在当时占绝对市场份额，许多服务器在提供网页之前都要专门检测该浏览器。

如果用户通过IE打不开相关网页，那么这个新生的浏览器很可能就会夭折。于是，微软决定将IE的用户代理字符串修改成兼容Netscape的形式。

Mozilla/2.0 (compatible; MSIE 版本号; 操作系统)

Windows 95平台下的Internet Explorer 3.02带有如下用户代理字符串：

Mozilla/2.0 (compatible; MSIE 3.02; Windows 95)

由于当时的大多数浏览器嗅探程序只检测用户字符串中的产品名称部分，结果IE就成功地将自己标识为Mozilla，从而伪装成Netscape Navigator。 微软的这一做法招致了很多批评，因为它违反了浏览器标识的惯例。更不规范的是，IE将真正的浏览器版本号插入到了字符串的中间。

字符串中另外一个有趣的地方是标识符Mozilla 2.0（而不是3.0）。毕竟，当时的主流版本是3.0，改成3.0应该对微软更有利才对。但真正的谜底到现在还没有揭开——但很可能只是认为疏忽所致。

3. Netscape Communicator 4和IE4~IE8

1997年8月，Netscape Communicator 4发布（这一版将浏览器名字中的Navigator换成了Communicator）。Netscape继续遵循了第3版时的用户代理字符串格式。

Mozilla/版本号 （平台；加密类型 \[; 操作系统或CPU说明]

因此，Windows98平台中第4版的用户代理字符串如下所示：

Mozilla/4.0 (Win98; I)

Netscape在发布补丁时，子版本号也会相应提高，用户代理字符串如下的4.79版所示：

Mozilla/4.79 (Win98; I)

但是，微软在发布IE4时，顺便将用户代理字符串修改成了如下格式：

Mozilla/4.0 (compatible; MSIE 4.0; Windows 98)

经过此番修改，Mozilla版本号就与实际的IE版本号一致了，为识别它们的第四代浏览器提供了方便。但令人遗憾的是，两者的一致性仅限于这一个版本。 在IE4.5发布时（只针对Macs），虽然Mozilla版本号还是4，但IE版本号则改成如下所示：

Mozilla/4.0 (compatible; MSIE 4.5; Mac_PowerPc)


此后，IE的版本一直到7都沿袭了这个模式：

Mozilla/4.0 (compatible; MSIE 7.9; Windows NT 5.1)

**而IE8的用户代理字符串中添加了呈现引擎（Trident）的版本号：**

Mozilla/4.0 (compatible; MSIE 版本号; 操作系统；Trident/Trident 版本号)

例如：

Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)

这个新增的Trident记号是为了让开发人员指导IE8是不是在兼容模式下运行。如果是，则MSIE版本号会变成7，但Trident及版本号还会留在用户代码字符串中：

Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0)

增加这个记号有助于分辨浏览器到底是IE7（没有Trident记号），还是运行在兼容模式下的IE8。

IE9对字符串格式做了一点调整。Mozilla版本号增加了5.0，而Trident的版本号也升到了5.0。IE9默认的用户代理字符串如下：

Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)

如果IE9运行在兼容模式下，字符串中的Mozilla版本号和MSIE版本号会恢复旧的值，但Trident的版本号仍然是5.0。例如，下面就是IE9运行在IE7兼容模式下的用户代理字符串：

Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0)

所以这些变化都是为了确保过去的用户代理检测脚本能够继续发挥作用，同时还能给新脚本提供更丰富的信息。

也就是IE7的客户代理字符串没有添加引擎字符串“Trident”。

4. Gecko

**Gecko是Firefox的呈现引擎。**当初的Gecko是作为通用Mozilla浏览器的一部分开发的，而第一个采用Gecko引擎的浏览器是Netscape 6。为Netscape 6编写的一份规范中规定了未来版本中用字符串的构成。这个新格式与4.x版本中相对 简单的字符串相比，有着非常大的区别。

Mozilla/Mozilla版本号 （平台；加密类型；操作系统或CPU；语言； 预先发行版本） Gecko/Gecko版本号 应用程序或产品/应用程序或产品版本号

这个明显复杂了很多的用户代理字符串中蕴含很多新想法。

下表为字符串中各项的用意

|字符串项|必须吗|说明|
|:-:|:-:|:-:|
|Mozilla版本号|是|Mozilla的版本号|
|平台|是|浏览器运行的平台。可能的值包括Windows、Mac和X11（指Unix的X窗口系统|
|加密类型|是|加密技术的类型：U表示128位、I表示40位、N表示未加密|
|操作系统版本或CPU|是|浏览器运行的操作系统或计算机系统使用的CPU。在Windows平台中，这一项指Windows的版本（如WindNT、Win95,等等）。如果平台是Macintosh，这一项指CPU（针对PowerPC的68K、PPC、或MacIntel）。如果平台是X11，这一项是Unix操作系统的名称，与使用Unix命令uname-sm得到的名称相同|
|语言|是|浏览器设计时所针对的目标用户语言|
|预先发行版本|否|最初用于表示Mozilla的预先发行版本，现在则用来表示Gecko呈现引擎的版本号|
|Gecko版本号|是|Gecko呈现引擎的版本号，但由yyyymmdd格式的日期表示|
|应用程序或产品|否|使用Gecko的产品名|可能是Netscape、Firefox|
|应用程序或产品版本号|否|应用程序或产品的版本号；用于区分Mozilla版本号和Gecko版本号|

为了更好地理解Gecko的用户代理字符串，下面几个例子是基于Gecko的浏览器中取得的字符串。

Windows XP下的Netscape 6.21:

Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv: 0.9.4) Gecko/20011128 Netscape6/6.2.1


Linux下的SeaMonkey 1.1a:

Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1b2) Gecko/20060823 SeaMonkey/1.1a


WindowsXP下的Firefox 2.0.0.11:

Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11


Mac OS X下的Camino 1.5.1:

Mozilla/5.0 (Macintosh; U;  Intel Mac OS X; en; rv:1.8.16) Gecko/20070809 Camino/1.5.1


以上这些用户代理字符串都取自基于Gecko的浏览器（只是版本有所不同）。很多时候，检测特定的浏览器还不如搞清楚它是否基于Gecko更重要。每个字符串中的Mozilla版本都是5.0，自从第一个基于Gecko的浏览器发布时修改成这个样子，至今就没有改变过；而且，看起来以后似乎也不会有什么变化。

随着Firefox 4发布，Mozilla简化了这个用户代理字符串。

- 删除了“语言”记号（例如，前面例子中的“en-US”）。

- 在浏览器使用强加密（默认设置）时，不显示“加密类型”。也就是说，Mozilla用户代理字符串中不会再出现“U”，而“I”和“N”还会照常出现。

- “平台”记号从Windows用户代理字符串中删除了，“操作系统或CPU”中始终都包含“Windows”字符串。

- “Gecko版本号”固定为“Gecko/20100101”

最后，**Firefox 4用户代理字符串变成了下面这个样子：**

**Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox 4.0.1**

5. Webkit

2003年，Apple公司宣布要发布自己的Web浏览器，名字定为Safari。Safari的呈现引擎叫WebKit，是Linux平台中Konqueror浏览器的呈现引擎KHTML的一个分支。几年后，WebKit独立出来成为了一个开源项目，专注于呈现引擎的开发。

这款新浏览器和呈现引擎的开发人员也遇到了与Internet Explorer 3.0类似的问题：如何确保这款浏览器不被流行的站点拒之门外？答案就是向用户代理字符串放入足够多的信息，以便站点能够信任它与其他流行的浏览器是兼容的。于是，WebKit的用户代理字符串就具备了如下格式：

Mozilla/5.0 (平台；加密类型；操作系统或CPU；语言) AppleWebKit/AppleWebKit版本号 (KHTML, like Gecko) Safari/Safari版本号

示例：

Mozilla/5.0 (Macintosh; U; PPC MAC OS X; en) AppleWebKit/124 (KHTML, like Gecko) Safari/125.1

这又是一个很长的用户代理字符串。其中不仅包含了Apple WebKit的版本号，也包含了Safari的版本号。出于兼容性的考虑，有关人员就决定了将Safari标识为Mozilla。至今，基于WebKit的所有浏览器都将自己标识为Mozilla 5.0，与基于Gecko的浏览器完全一样。但Safari的版本号则通常是浏览器的编译版本号，不一定与发布时的版本号对应。虽然Safari 1.25的用户代理字符串包含数字125.1，但两者却一定一一对应。

Safari预发行1.0版用户代理字符串中最耐人寻味，也是最饱受诟病的部分就是字符串“（KHTML, like Gecko）”。Apple因此收到许多开发人员的反馈，他们认为这个字符串明显是在欺骗客户端和服务器，实际上是想让它们把Safari当成Gecko（好像光添加Mozilla/5.0，还嫌不够）。Apple的回应与微软在IE的用户代理字符串遭到责难时如出一辙：Safari与Mozilla兼容，因此网站不应该将Safari用户拒之门外，否则用户就会认为自己的浏览器不受支持。

到了Safari 3.0发布时，其用户代理字符串又稍微变长了一点。下面这个新增的Version记号一直到现在都被用来标识Safari实际的版本号：

Mozilla/5.0 (Macintosh; U; PPC Mac OS XX; en) AppleWebKit/522.15.5 (KHTML, like Gecko) Version/3.0.3 Safari/522.15.5

需要注意的是，这个变化只在Safari中有，在WebKit中没有。换句话说，其他基于WebKit的浏览器可能没有这个变化。 一般来说，确定浏览器是否基于WebKit要比确定它是不是Safari更有价值就像针对Gecko一样。

6. Konqueror

与KDE Linux集成的Konqueror，是一款基于KHTML开源呈现引擎的浏览器。
尽管Konqueror只能在Linux中使用，但它也有数量可观的用户。
为确保最大限度的兼容性，Konqueror效仿IE选择了以下用户代理字符串格式：

Mozilla/5.0 (compatible; Konqueror/版本号; 操作系统或CPU)

不过，为了与WebKit的用户代理字符串的变化保持一致，Konqueror 3.2又有了变化，以如下格式将自己标识为KHTML：

Mozilla/5.0 (compatible; Konqueror/版本号；操作系统或CPU) KHTML/KHTML版本号 (like Gecko)

示例

Mozilla/5.0 (compatible; Konqueror/3.5; SunOS) KHTML/3.5.0 (like Gecko)

其中，Konqueror与KHTML的版本号比较一致，即使有差别也很小，例如Konqueror3.5使用KHTML3.5.1。

7. Chrome

谷歌公司的Chrome浏览器以WebKit作为呈现引擎，但使用了不同的JavaScript引擎。在Chrome 0.2这个最初的beta版中，用户代理字符串完全取自WebKit，只添加了一段表示Chrome版本号的信息。

格式如下：

Mozilla/5.0 (平台；加密类型；操作系统或CPU；语言) AppleWebKit/AppleWebkit版本号 (KHTML,like Gecko) Chrome/Chrome版本号 Safari/Safari 版本

Chrome 7的完整的用户代理字符串如下：

Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.44 Safari/534.7

其中，WebKit版本与Safari版本看起来似乎始终会保持一致，尽管没有十分的把握。

8. Opera

仅就用户代理字符串而言，Opera应该是最有争议的一款浏览器。Opera默认的用户代理字符串是所有现代浏览器中最合理的——正确地标识了自身及其版本号。在Opera 8.0之前，其用户代理字符串采用如下格式:

Opera/ 版本号 (操作系统或CPU; 加密类型) \[语言]

Windows XP中的Opera 7.54会显示下面的用户代理字符串：

Opera/7.54 (Windows NT 5.1; U) \[en]

Opera 8发布后，用户代理字符串的“语言”部分被移到圆括号内，以便更好地与其他浏览器匹配。

Opera/版本号 （操作系统或CPU； 加密类型； 语言）

Windows XP中的Opera 8会显示下面的用户代理字符串：

Opera/8.0 (Windows NT 5.1; U; en)

默认情况下，Opera会以上面这种简单的格式返回一个用户代理字符串。目前来看，Opera也是主要浏览器中唯一一个使用产品名和版本号来完全彻底地标识自身的浏览器。**可是，与其他浏览器一样，Opera在使用自己的用户代理字符串时也遇到了问题。即使技术上正确，但因特网上仍然有不少浏览器嗅探代码，只钟情于报告Mozilla产品名的那些用户代理字符串。**另外还有相当数量的代码则只对IE或Gecko感兴趣。Opera没有选择通过修改吱声的用户代理字符串来迷惑嗅探代码，而是干脆选择通过修改自身的用户代理字符串将自身标识为一个完全不同的浏览器。

Opera 9以后，出现了两种修改用户代理字符串的方式。一种方式是将自身标识为另外一个浏览器。如Firefox或者IE。在这种方式下，用户代理字符串就如同Firefox或IE的用户代理字符串一样，只不过末尾追加了字符串Opera及Opera的版本号。

Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.1) Gecko/200161208 Firefox/2.0.0 Opera 9.50

Mozilla/4.o (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.50

第一个字符串将Opera 9.5标识为Firefox 2，同时带有Opera版本信息。第二个字符串将Opera 9.5标识为IE6，也包含了Opera版本信息。这两个用户代理字符串可以通过针对Firefox或IE的大多数测试，不过还是为识别Opera留下了余地。

**Opera标识自身的另一种方式，就是把自己装扮成Firefox或IE。在这种隐瞒真实身份的情况下，用户代理字符串实际上与其他浏览器返回的相同——既没有Opera字样，也不包含Opera版本信息。也就是说，在启动了身份隐瞒功能的情况下，无法将Opera和其他浏览器区别开来。**另外，由于Opera喜欢在不告知用户的情况下针对站点来设置用户代理字符串，因此问题就更复杂化了。

例如，打开MyYahoo!站点（http://my.yahoo.com)会自动导致Opera将自己装扮成Firefox。如此一来，要想识别Opera就难上加难了。

在Opera 7以前的版本中，Opera会解析Windows操作系统字符串的含义。例如，Windows NT 5.1 实际上就是Windows XP，因此Opera会在用户代理字符串中包含Windows XP而非 Windows Nt 5.1。为了与其他浏览器更兼容，Opera 7开始包含正式的操作系统版本。而非解析后的版本。

Opera 10对代理字符串进行了修改。现在的格式是：

Opera/9.80 (操作系统或CPU；加密类型；语言) Presto/presto 版本 Version/版本号

注意，初始的版本号Opera/9.80是固定不变的。但工程师们担心写得不好的浏览器嗅探脚本会将Opera/10.0错误的解释为Opera 1，而不是Opera 10。因此，Opera 10又增加了Presto记号（Presto是Opera的呈现引擎）和Version记号，后者用以保存实际的版本号。以下是Windows 7中的Opera 10.63的用户代理字符串：

Opera/9.80 (Windows NT 6.1; U; en) Presto/2.6.30 Version/10.63

9. iOS和Android

移动操作系统iOS和Android默认的浏览器都基于WebKit，而且都像它们的桌面版一样，共享相同的基本用户代理字符串格式。iOS设备的基本格式如下：

Mozilla/5.0 (平台；加密类型；操作系统内或CPU like Mac OS X；语言) AppleWebKit/AppleWebKit版本号 (KHTML, like Gecko) Version/浏览器版本号 Mobile/移动版本号 Safari/Safari版本号

**注意用于辅助确定Mac操作系统的"like Mac OS X"和额外的Mobile记号。一般来说，Mobile记号的版本（或移动版本号）没什么用，主要是用来确定WebKit是移动版，而非桌面版。而平台则可能是"iPhone"、"iPod"或"iPad"。**

Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en-us) AppleWebkit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/528.16

在iOS3之前，用户代理字符串中不会出现操作系统版本号。

**Android浏览器中的默认格式与iOS的格式相似，没有移动版本号（但有Mobile记号）。**

Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1

这是Google Nexus One手机的用户代理字符串。不过，其他Android设备的模式也一样。