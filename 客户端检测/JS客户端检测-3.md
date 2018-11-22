# 客户端检测-3

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 用户代理字符串检测技术

**考虑到历史原因以及现代浏览器中用户代理字符串的使用方式，通过用户代理字符串来检测特定的浏览器并不是一件轻松的事。**

**因此，首先要确定的往往是你需要多么具体的浏览器信息。一般情况下，知道呈现引擎和最低限度的版本就足以决定正确的操作方法了。**

```
//不推荐

if(isIE6 || isIE7) {//不推荐
    //代码
}
```

这个例子是想要在浏览器为IE6或IE7时执行相应代码。 这种代码其实是很脆弱的，因为它要依据特定的版本来决定做什么。如果是IE8怎么办么？只要IE有新版本出来，就必须更新这些代码。不过，像下面这样使用相对版本号则可以避免这个问题：

```

if(ieVer >= 6) {
    //代码
}
```

这个例子首先检测IE的版本号是否至少等于6，如果是则执行相应操作。这样就可以确保相应的代码将来照样能够起作用。

下面的浏览器检测脚本将按照这种思路来编写。

1. 识别呈现引擎

**确切知道浏览器的名字和版本号不如确切知道它使用的是什么呈现引擎。**

如果Firefox、Camino和Netscape都使用相同版本的Gecko，那它们一定支持相同的特性。

类似地，不管是什么浏览器，只要它跟Safari 3使用的是同一个版本的Webkit，那么该浏览器也就跟Safari 3具备同样的功能。

**因此，要编写的脚本将主要检测五大呈现引擎：IE(Trident)、Gecko、WebKit、KHTML和Opera(Presto)。**

为了不在全局作用域中添加多余的变量，我们将使用模块模式来封装检测脚本。检测脚本的基本代码结构如下：

```
var client = function(){
    var engine = {
        //呈现引擎
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,
        //具体的版本号
        ver: null
    };

    return {
        engine: engine
    }

}();

```

这里声明了一个名为client的全局变量，用于保存相关信息。匿名函数内部定义了一个局部变量engine，它是一个包含默认设置的对象字面量。在这个对象字面中，每个呈现引擎都对应着一个属性，属性的值默认为0.如果检测到来了哪个呈现引擎，那么就以浮点数值形式将该引擎的版本号写入相应的属性。而呈现引擎的完整版本（是一个字符串），则被写入了ver属性。作这样的区分可以支持像下面这样编写代码：

```

if (client.engine.ie) { //如果是IE, client.ie的值应该大于0

} else if (client.engine.gecko > 1.5) {
    if(client.engine.gecko == "1.8.1"){
        //针对这个版本执行某些操作
    }
}
```

在检测到一个呈现引擎之后，其client.engine中对应的属性将被设置为一个大于0的值，该值可以转换为布尔值true。这样，就可以在if语句中检测相应的属性，以确定当前使用的呈现引擎，连具体的版本号都不必考虑。鉴于每个属性都包含一个浮点数值，因此有可能丢失某些版本信息。例如，将字符串“1.8.1”传入parseFloat()后得到数值1.8。不过，在必要的时候可以检测ver属性，该属性会保存完整的版本信息。

要正确地识别呈现引擎，关键是检测顺序要正确。**由于用户代理字符串存在诸多不一致的地方，如果检测顺序不对，很可能会导致检测结果不正确。**

为此，第一步就是识别Opera，因为它的用户代理字符串有可能完全模仿其他浏览器。我们不相信Opera，是因为（任何情况下）其用户代理字符串（都） 不会将自己标识为Opera。

**要识别Opera，必须得检测window.opera对象。**Opera 5及更高版本中都有这个对象，用以保存与浏览器相关的标识信息以及与浏览器直接交互。在Opera 7.6及更高版本中，调用version()方法可以返回一个表示浏览器版本的字符串，而这也是确定Opera版本号的最佳方式。要检测更早版本的Opera。可以直接检查用户代理字符串，因为那些版本还不支持隐瞒身份。不过，2007年底Opera的最高版本已经是9.5，所以不太可能有人还在使用7.6之前的版本。那么，检测呈现引擎代码的第一步，就是编写如下代码：

```

if(window.opera) {
    engine.ver = window.opera.version();
    engine.opera = parseFloat(engine.ver);
}
```

这里，将版本的字符串表示保存在了engine.ver中，将浮点数值表示的版本保存在了engine.opera中。如果浏览器是Opera，测试window.opera就会返回true；否则，就要看看是其他的什么浏览器了。

**放在第二位检测的呈现引擎是WebKit。因为WebKit的用户代理字符串中包含"Gecko"和"KHTML"这两个子字符串，所以如果首先检测它们，很可能会得到错误的结论。**

**不过，WebKit的用户代理字符串中的"AppleWebKit"是独一无二的，因此检测这个字符串最合适。**

```
var ua = window.userAgent;

if(window.opera) {
    engine.ver = window.opera.version();
    engine.opera = parseFloat(engine.ver);
} else if (/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp("$1");
    engine.webkit = parseFloat(engine.ver);
}
```

代码首先将用户代理字符串保存在变量ua中。然后通过正则表达式来测试其中是否包含字符串“AppleWebKit"，并使用捕获组来取得版本号。由于实际的版本号中可能会包含数字、小数点和字母，所以捕获组中使用了表示非空格的特殊字符串（\S）。用户代理字符串中的版本号与下一部分的分割符是一个空格，因此这个模式可以保证捕获所有版本信息。test()方法基于用户代理字符串运行正则表达式，如果返回true，就将捕获的版本号保存在engine.ver中，而将版本号的浮点表示保存在engine.webkit中。


接下来要测试的呈现引擎是KHTML。同样，KHTML的用户代理字符串中也包含“Gecko”，因此在排除KHTML之前，无法准确检测基于Gecko的浏览器。KHTML的版本号与WebKit的版本号在用户代理字符串中的格式差不多，因此可以使用类似的正则表达式。此外，由于Konqueror 3.1及更早版本中不包含KHTML的版本，故而就要使用Konqueror的版本来代替。

```
var ua = window.navigator.userAgent;

if(window.opera) {
    engine.ver = window.opera.version();
    engine.opera = parseFloat(engine.ver);
} else if(/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);
} else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.khtml = parseFloat(engine.ver);
}
```

与前面一样，由于KHTML的版本号与后续的标记之间有一个空格，因此仍然要使用特殊的非空格字符来取得与版本有关的所有字符。然后，将字符串形式的版本信息保存在engine.ver中，将浮点数值形式的版本保存在engine.khtml中。如果KHTML不在用户代理字符串中，那么就要匹配Konqueror后跟一个斜杠，再后跟不包含分号的所有字符。

在排除了WebKit和KHTML之后，就可以准确地检测Gecko了。但是，在用户代理字符串中，Gecko的版本号，不会出现在字符串“Gecko”的后面，而是会出现在字符串“rv：”的后面。这样，我们就必须使用一个比前面复杂一些的正则表达式。

```
var ua = window.navigator.userAgent;

if(window.opera) {
    engine.ver = window.opera.version();
    engine.opera = parseFloat(engine.ver);
} else if(/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);
} else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.khtml = parseFloat(engine.ver);
} else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.gecko = parseFloat(engine.ver);
}

```

Gecko的版本号位于字符串"rv:"与一个闭括号之间，因此为了提取出这个版本号，正则表达式要查找所有不是闭括号的字符，还要查找字符串“Gecko/”后跟8个数字。如果上述模式匹配，就提取出版本号并将其保存在相应的属性中。

**与Safari跟WebKit一样，Firefox与Gecko的版本号也不一定严格对应。**

最后一个要检测的呈现引擎就是IE了。IE的版本号位于字符串“MSI”的后面、一个分号的前面，因此相应的正则表达式非常简单。

```
var userAgent = window.navigator.userAgent;

if (window.opera) {
    engine.ver = window.opera.version();
    engine.opera = parseFloat(engine.ver);
} else if (/AppleWebkit\/(\S+)/.test(userAgent)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);
} else if (/KHTML\/(\S+)/.test(userAgent) || /Konqueror\/([^;]+)/.test(userAgent)) {
    engine.ver = RegExp['$1'];
    engine.khtml = parseFloat(engine.ver);
} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(userAgent)) {
    engine.ver = RegExp['$1'];
    engine.gecko = parseFloat(engine.ver);
} else if (/MSIE ([^;]+)/.test(userAgent)) {
    engine.ver = RegExp['$1'];
    engine.ie = parseFloat(engine.ver);
}

```

以上呈现引擎检测脚本的最后一部分，就是在正则表达式中使用取反的字符类来取得不是分号的所有字符。IE通常会保证以标准浮点数值形式给出其版本号，但有时候也不一定。因此，取反的字符类\[^;]可以确保取得多个小数点以及任何可能的字符。

2. 识别浏览器

**大多数情况下，识别了浏览器的呈现引擎就足以为我们采取正确的操作提供依据了。可是，只有呈现引擎还不能说明存在所需的JavaScript功能。**

苹果公司的Safari浏览器和谷歌公司的Chrome浏览器都使用WebKit作为呈现引擎，但它们的JavaScript引擎却不一样。在这两款浏览器中，client.engine.webkit都会返回非0值，但仅知道这一点恐怕还不够。对于它们，有必要像下面这样为client对象添加新的属性。

```

var client = function(){
    var engine = {
        //呈现引擎
        opera: 0,
        webkit: 0,
        khtml: 0,
        gecko: 0,
        ie: 0,

        //具体版本
        ver: null
    };

    var browser = {
        //浏览器
        opera: 0,
        safari: 0,
        chrome: 0,
        firefox: 0,
        ie: 0,
        konq: 0,

        //具体版本
        ver: null
    };

    return {
        engine: engine,
        browser: browser
    };

}();

```

代码中又添加了私有变量browser，用户保存每个主要浏览器的属性。与engine变量一样，除了当前使用的浏览器，其他属性的值将保持为0。如果是当前使用的浏览器，则这个属性中保存的是浮点数值形式的版本号。同样，ver属性中在必要时将会包含字符串形式的浏览器完整版本号。由于大多数浏览器与其呈现引擎密切相关，所以下面示例中检测浏览器的代码与检测呈现引擎的代码是混合在一起的。

```
//检测呈现引擎及浏览器
var userAgent = window.navigator.userAgent;

if(window.opera) {
    engine.ver = window.opera.version();
    engine.opera = parseFloat(engine.ver);
} else if(/AppleWebKit\/(\S+)/.test(userAgent)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);

    //确定是Chrome还是Safari
    if(/Chrome\/(\S+)/.test(userAgent)) {
        browser.ver = RegExp['$1'];
        browser.chrome = parseFloat(brower.ver);
    } else if(/Version\/(\S+).test(userAgent)) {
        browser.ver = RegExp['$1'];
        browser.safari = parseFloat(browser.ver);
    } else {
        //近似地确定版本号
        var safariVersion = 1;
        if(engine.webkit < 100) {
            safariVersion = 1;
        } else if(engine.webkit < 312) {
            safariVersion = 1.2;
        } else if(engine.webkit < 412) {
            safariVersion = 1.3;
        } else {
            safariVersion = 2;
        }
    }
    browser.safari = brower.ver = safariVersion;
} else if (/KHTML\/(\S+)/.test(userAgent) || /Konqueror\/([^;]+)/.test(userAgent)) {
    engine.ver = RegExp['$1'];
    engine.khtml = browser.konq = parseFloat(engine.ver);
} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(userAgent)) {
    engine.ver = RegExp['$1'];
    engine.gecko = parseFloat(engine.ver);

    //确定是不是Firefox
    if(/Firefox\/(\S+)/.test(userAgent)) {
        browser.ver = RegExp['$1'];
        browser.firefox = parseFloat(browser.ver);
    }
} else if(/MSIE ([^;]+)/.test(userAgent)) {
    engine.ver =  browser.ver = RegExp['$1'];
    engine.ie = browser.ie = parseFloat(engine.ver);
}
```

对Opera和IE而言，browser对象中的值等于engine对象的值。对konqueror而言，browser.konq和browser.ver属性分别等于engine.khtml和engine.ver属性。

为了检测Chrome和Safari，我们在检测引擎的代码中添加了if语句。提取Chrome的版本号时，需要查找字符串“Chrome/”并取得该字符串后面的值。而提取Safari的版本号时，则需要查找字符串中的“Version/”并取得其后的数值。这种方式仅适用于Safari 3及更高版本，因此需要一些备用的代码，将WebKit的版本号近似地映射为Safari的版本号。

在检测Firefox的版本时，首先要找到字符串"Firefox/"，然后提取出该字符串后面的数值（即版本号）。当然，只有呈现引擎被判别为Gecko时才会这样做。

有了上面的铺垫，就可以编写下面的逻辑。

```
if(client.engine.webkit) {//如果是WebKit引擎
    if(client.browser.chrome) {
        //执行针对Chrome的代码
    } else if(client.browser.safari) {
        //执行针对Safari的代码
    } else if(client.engine.gecko) {
        if (client.browser.firefox) {
            //执行针对Firefox的代码
        } else {
            //执行针对其他Gecko浏览器的代码
        }
    }
} 
```

3. 识别平台

**很多时候，只要知道呈现引擎就足以编写出适当的代码了。但在某些条件下，平台可能是必须关注的。**

那些具有各种平台版本的浏览器（如Safari、Firefox和Opera）在不同的平台下可能会有不同的问题。

目前的三大主流平台是Windows、Mac和Unix（包括各种Linux）。为了检测这些平台，还需要像下面这样再添加一个新对象。

```
var client = function() {

    var engine = {
        //呈现引擎
        opera: 0,
        webkit: 0,
        konq: 0,
        gecko: 0,
        ie: 0,
        //具体的版本号
        ver: null
    };

    var browser = {
        opera: 0,
        safari: 0,
        chrome: 0,
        khtml: 0,
        fireforx: 0,
        ie: 0,
        //具体的版本号
        ver: null
    };

    var system = {
        win: false;
        mac: false;
        x11: false;
    }

    //在此检测呈现引擎、平台和设备
    return {
        engine: engine,
        browser: browser,
        system: system
    }

}();

```

上面的代码中又添加了一个包含3个属性的新变量system。其中，win属性表示是否为Windows平台，mac表示Mac，而x11表示Unix。与呈现引擎不同，在不能访问操作系统或版本的情况下，平台信息通常是很有限的。对这三个平台而言，浏览器一般只报告Windows版本。为此，新变量system的每个属性最初都保存着布尔值false，而不是像呈现引擎那样保存着数字。

在确定平台时，检测navigator.platform要比检测用户代理字符串更简单，后者在不同浏览器中会给出不同的平台信息。 而navigator.platform属性可能的值包括"Win32"、"Win64"、"MacPPC"、"MacIntel"、"X11"和"Linux i686"，这些值在不同的浏览器中都是一致的。检测平台的代码非常直观。

```
var navigatorPlatform = window.navigator.platform;

system.win = navigatorPlatform.indexOf("Win") == 0;

system.mac = navigatorPlatform.indexOf("Mac") == 0;

system.x11 = (navigatorPlatform.indexOf("X11")) == 0 || (navigatorPlatform.indexOf("Linux") == 0);
```

以上代码使用indexOf()方法来查找平台字符串的开始位置。

虽然"Win32"是当前浏览器唯一支持的Windows字符串，但随着向64位Windows架构的迁移，将来很可能会出现"Win64"平台信息值。

为了对此有所准备，检测平台的代码中查找的只是字符串"Win"的开始位置。而检测Mac平台的方式也类似，同样是考虑到了MacPPC和MacIntel。在检测Unix时，则同时检测字符串"X11"和"Linux"在平台字符串中的开始位置，从而确保了代码能够先前兼容其他变体。

4. 识别Windows操作系统

在Windows平台下，还可以从用户代理字符串中进一步取得具体的操作系统信息。

在WindowsXP之前，Windows有两种版本，分别针对家庭用户和商业用户。针对家庭用户的版本分别是Windows 95、Windows 98和Windows ME。

而针对商业用户的版本则一直叫做Window NT，最后由于市场原因改名为Windows 2000。

这两个产品线后来又合并成一个由Windows NT发展而来的公共的代码基，代表产品就是Windows XP。

随后，微软在Windows XP基础上又构建了Windows Vista。

了解了这些信息，才能搞清楚用户代理字符串中Windows操作系统的具体版本。

由于用户代理字符串中的Windows操作系统版本表示方法各异，因此检测代码并不十分直观。好在，从Windows 2000开始，表示操作系统的字符串大部分都还相同。只有版本号有变化。为了检测不同的Windows操作系统，必须使用正则表达式。由于使用Opera 7之前版本的用户已经不多了，因此可以忽略。

第一步是匹配Windows 95和windows 98这两个字符串。对这两个字符串，只有Gecko与其他浏览器不同，即没有"dows"，而且“Win”与版本号之间没有空格。要匹配这个模式，可以使用下面这个简单的正则表达式。

```
/Win(?:dows )?([^do]{2})/
```

这个正则表达式中的捕获组会返回操作系统的版本。由于版本可能是任何两个字符编码（例如95、98、9x、NT、ME及XP），因此要使用两个非空字符。

Gecko在表示Windows NT时会在末尾添加"4.0"，与其查找实际的字符串，不如像下面这样查找小数值合适。

```
/Win(?:dows )?([^do]{2})(\d+\.\d+)?/
```

这样，正则表达式中就包含了第二个捕获组，用于取得NT的版本号。由于该版本号对于Windows 95和Windows 98而言是不存在的，所以必须设置为可选。 这个模式与Opera表示Windows NT的字符串之间唯一的区别，就是"NT"与"4.0"之间的空格，这在模式中很容易添加。

```
/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/
```

经过一番修改之后，这个正则表达式可以成功匹配Windows ME，Windows XP和Windows Vista的字符串了。具体来说，第一个捕获组将会匹配95、98、9x、NT、ME或XP。第二个捕获组则只针对Windows ME及所有的Windows NT的变体。这个信息可以作为具体的操作系统信息保存在system.win属性中。

```

if(system.win) {
    if (/Win(?:dows )([^do]{2})\s?(\d+\.\d+)/.test(userAgent)) {
        if(RegExp['$1'] == "NT") {
            switch(RegExp['$2']) {
                case "5.0":
                    system.win = "2000";
                    break;
                case "5.1":
                    system.win = "XP";
                    break;
                case "6.0":
                    system.win = "Vista";
                    break;
                case "6.1":
                    system.win = "7";
                    break;
                case: "10.0": 
                    system.win = "10";
                    break;
                default:
                    system.win = "NT";
                    break;
            }
        } else if (RegExp['$1'] == "9x") {
            system.win = "ME";
        } else {
            system.win = RegExp['$1'];
        }
    }
}
```

如果system.win的值为true，那么就使用这个正则表达式从用户代理字符串中提取具体的信息。
鉴于Windows将来的某个版本也许不能使用这个方法来检测，所以第一步应该先检测用户代理字符串是否与这个模式匹配。在模式匹配的情况下，第一个捕获组中可能会包含“95”、“98”、“9x”或“NT”。如果这个值是“NT”，可以将system.win设置为相应操作系统的字符串。

如果是“9X”，就要设置成“ME”。

如果是其他值，则将所捕获的值直接赋给system.win。有些这些检测平台的代码后，我们就可以编写如下代码。

```
if(client.system.win) {
    if(client.system.win == "XP") {
        //说明是XP
        //做点什么
    } else if(client.system.win == "Vista") {
        //说明是Vista
        //做点什么
    }
}
```

由于非空字符串会转换为布尔值true，因此可以将client.system.win作为布尔值用在if语句中。而需要更多有关操作系统的信息时，则可以使用其中保存的字符串中值。

5. 识别移动设备

2006年到2007年，移动设备中Web浏览器的应用呈爆炸性增长。

四大主要浏览器都推出了手机版和其他设备中运行的版本。

要检测相应的设备，第一步是为要检测的所有移动设备添加属性。

```
var client = function(){

    var engine = {
        //呈现引擎
        opera: 0,
        webkit: 0,
        konq: 0,
        gecko: 0,
        ie: 0,

        //具体的版本号
        ver: null
    };

    var browser = {
        //浏览器
        opera: 0,
        safari: 0,
        chrome: 0,
        khtml: 0,
        firefox: 0,
        ie: 0,

        //浏览器的具体版本号
        ver: null
    };

    var system = {
        win: false,
        mac: false,
        x11: false,

        //移动设备
        iphone: false,
        ipod: false,
        ipad:  false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false
    };

    //在此检测呈现引擎、平台和设备
    return {
        engine: engine,
        browser: browser,
        system: system
    }

}();
```

然后，通常简单地检测字符串"iphone"、"iPod"和"iPad"，就可以分别设置相应属性的值了。

```
system.iphone = userAgent.indexOf("iPhone") > -1;
system.ipod = userAgent.indexOf("iPod") > -1;
system.ipad = userAgent.indexOf("iPad") > -1;
```

除了知道iOS设备，最好还能知道iOS的版本号。在iOS 3之前，用户代理字符串中只包含"CPU Mac OS"，后来iPhone中又改成"CPU iPhone OS 3_0 like Mac OS X"，iPad中又改成"CPU OS 3_2 like Mac OS X"。也就是说，检测iOS需要正则表达式反映这些变化。

```
//检测iOS版本

if(system.mac && userAgent.indexOf("Mobile") > -1) {
    if(/CPU (?:iPhone)?OS (\d+_\d+)/.test(userAgent)) {
        system.ios = parseFloat(RegExp.$1.replace("_", "."));
    } else {
        system.ios = 2; //不能真正检测出来，所以只能猜测
    }
}
```

检测系统是不是Mac OS、字符串中是否存在“Mobile”，可以保证无论是什么版本，system.ios中都不会是0。然后，使用正则表达式确定是否存在iOS的版本号。如果有，将system.ios设置为表示版本号的浮点值。否则，将版本设置为2。（因为没有办法确定到底是什么版本，所以设置为更早的版本比较稳妥）。

检测Android操作系统也很简单，也就是搜索字符串“Android”并取得紧随其后的版本号。

```
//检测Android版本
if(/Android (\d+\.\d+)/.test(userAgent)) {
    system.android = parseFloat(RegExp.$1);
}
```

由于所有版本的Android都有版本值，因此这个正则表达式可以精确地检测所有版本，并将system.android设置为正确的值。

诺基亚N系列手机使用的也是WebKit，其用户代理字符串与其他基于WebKit的手机很相似，例如：

Mozilla/5.0 (Symbian0S/9.2; U; Series60/3.1 NokiaN95/11.0.026; Profile MIDP-2.0 Configiration/CLDC-1.1) AppleWebKit/413 (KHTML, like Gecko) Safari/413

虽然诺基亚N系列手机在用户代理字符串中声称使用的是“Safari”，但实际上并不是Safari，尽管确实是基于WebKit引擎。只要像下面检测一下用户代理字符串中是否存在“NokiaN”，就足以确定是不是该系列的手机了。

```
system.nokia = userAgent.indexOf("NokiaN") > -1;
```

在了解这些设备信息的基础上，就可以通过下列代码来确定用户使用的是什么设备中的WebKit来访问网页：

```
if(client.engine.webkit) {
    if(client.system.ios) {
        //iOS手机的内容
    } else if(client.system.android) {
        //Android手机的内容
    } else if(client.system.nokiaN) {
        //Nokia手机的内容
    }
}
```

最后一种主要的移动设备平台是Windows Mobile（也称为 Windows CE），用于Pocket SamrtPhone中。由于从技术上说这些平台都属于Windows平台 ，因此Windows平台和操作系统都会返回正确的值。对于Windows Mobile 5.0及以前的版本，这两种设备的用户带来字符串非常相似。

```
Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320)
Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Smartphone; 176x220)
```

第一个来自PocketPC中的移动Internet Explorer 4.01，第二个来自Smartphone中的同一个浏览器。当Windows操作系统检测脚本检测这两个字符串时，system.win将被设置为"CE"，因此只在检测Windows Mobile时可以使用这个值：

```
system.winMobile = (system.win == "CE");
```

不建议测试字符串中的"PPC"或"Smartphone"，因为在Windows Mobile 5.0以后版本的浏览器中，这些记号已经被移除了。不过，一般情况下，只知道某个设备使用的是Windows Mobile也就足够了。

Windows Phone 7的用户代理字符串稍有改进，基本格式如下：

```
Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0) Asus; Galaxy6
```

其中，Windows操作符的标识符与以往完全不同，因此在这个用户代理中client.system.win等于"Ph"。从中可以取得有关系统的更多信息:

```
//Window mobile
if (system.win == "CE") {
    system.winMobile = system.win;
} else if (system.win == "Ph") {
    if(/Windows Phone OS (\d+.\d+)/.test(ua)) {
    system.win = "Phone";
    system.winMobile = parseFloat(RegExp['$1']);
    };
}
```

如果system.win的值是“CE",就说明是老版本的Windows Mobile，因此system.winMobile会被设置为相同的值（只能知道这个信息。）。如果system.win的值是"Ph"，那么这个设备就可能是Windows Phone 7或更新版本。因此就用正则表达式来测试格式并提取版本号，将system.win的值重置为"Phone"，而将system.winMobile设置为版本号。

6. 识别游戏系统

除了移动设备之外，视频游戏系统中的Web浏览器也开始日益【普及。任天堂Wii和Playstation 3或者内置Web浏览器，或者提供了浏览器下载。 Wii中的浏览器实际是定制版的Opera，是专门为Wii Remote设计的。Playstation的浏览器是自己开发的，没有基于前面提到的任何呈现引擎。

这两个浏览器中的用户代理字符串如下所示：

Opera/9.10 (Nintendo Wii; U; 1621; en)
Mozilla/5.0 (PLAYSTATION 3; 2.00)

第一个字符串来自运行在Wii中的Opera，它忠诚地继承了Opera最初的用户代理字符串格式（Wii上的Opera不具备隐瞒身份的能力）。第二个字符串来自Playsation3，虽然它为了兼容性而将自己标识为Mozilla 5.0，但并没有给出太多信息。而且，设备名称居然全部使用了大写字母，让人觉得奇怪；强烈希望将来的版本能够改变这种情况。

在检测这些设备以前，我们必须先为client。system中添加适当的属性，如下所示：

```
var client = function(){
    //应用程序的引擎
    var engine = {
        //呈现引擎
        opera: 0,
        webkit: 0,
        konq: 0,
        gecko: 0,
        ie: 0,
        //具体版本
        ver: null
    };

    //浏览器类型
    var browser = {
        //浏览器
        opera: 0,
        safari: 0,
        chrome: 0,
        khtml: 0,
        firefox: 0,
        ie: 0,
        //具体版本
        ver: null
    };

    //浏览器所在的系统
    var system = {
        win: false,
        mac: false,
        x11: false,

        //移动设备
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        
        //游戏检测呈现引擎、平台和设备

        return {
            engine: engine,
            browser: browser,
            system: system
        };
    }

}();

```

检测前述游戏系统的代码如下:

```
system.wii = userAgent.indexOf("Wii") > -1;
system.ps = /playstation/i.test(userAgent);
```

对于Wii，只要检测字符串"Wii"就够了，而其他代码将发现这是一个Opera浏览器，并将正确版本号保存在client.browser.opera中。对于, Playstation，则使用正则表达式来以不区分大小写的方式测试用户代理字符串。

完整版代码[客户端检测完整版代码github](https://github.com/shawroc/blog/blob/master/%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%A3%80%E6%B5%8B/%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%A3%80%E6%B5%8B.js)


**用户代理检测是客户端检测的最后一个选择。只要可能，都应该优先采取能力检测和怪癖检测。用户代理检测一般适用于下列情形。**

- 不能直接准确地使用能力检测或怪癖检测。例如，某些浏览器实现了为将来功能预留的存根（stub）函数。在这种情况下，仅测试相应的函数是否存在还得不到足够的信息。

- 同一款浏览器在不同平台下具备不同的能力。这时候，可能就有必要确定浏览器位于哪个平台下。

- 为了跟踪分析等目的需要知道确切的浏览器。


## 小结

客户端检测是JavaScript开发中最具争议的一个话题。由于浏览器间存在差别，通常需要根据不同的浏览器的能力分别编写不同的代码。 有不少客户端检测方法，但下列是最经常使用的。

- 能力检测：在编写代码之前先检测特定浏览器的能力。例如，脚本在调用某个函数之前，可能要先检测该函数是否存在。这种检测方法将开发人员从考虑具体的浏览器类型和版本中解放出来，让他们把注意力集中到相应的 能力李是否存在上。能力检测无法精确地检测特定的浏览器和版本。

- 怪癖检测：怪癖实际上是浏览器实现中存在的bug，例如早起的WebKit中存在一个怪癖，即它会在for-in循环中返回被隐藏的属性。怪癖检测通常涉及到运行一小段代码，然后确定浏览器是否存在某个怪癖。由于怪癖检测与能力检测相比效率更低，因此应该值在某个怪癖会干扰脚本运行的情况下使用。怪癖检测无法精确地检测特定的浏览器和版本。

- 用户代理检测：通过检测用户代理字符串来识别浏览器。用户代理字符串中包含大量与浏览器有关的信息，包括浏览器、平台、操作系统及浏览器版本。用户代理字符串有过一段相当长的发展历史，在此期间，浏览器提供商试图通过在用户代理字符串中添加一些欺骗性信息，欺骗网站相信自己的浏览器是另外一种浏览器。用户代理代理检测需要特殊的技巧，特别是要注意Opera会隐瞒其用户代理字符串的情况。即便如此，通过用户代理字符串仍然能够检测出浏览器所用的呈现引擎以及所在的平台，包括移动设备和游戏系统。

**在决定使用哪种客户端检测方法时，一般应优先考虑使用能力检测。怪癖检测是确定应该如何处理代码的第二选择。而用户代理检测则是客户端检测的最后一种方案，因为这种方法对用户代理字符串有很强的依赖性。**

