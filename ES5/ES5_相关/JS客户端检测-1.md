# 客户端检测-1

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

浏览器提供商虽然在实现公共接口方面投入了很多精力，但结果仍然是每一种浏览器都有各自的长处，也有各自的缺点。即使是那些跨平台的浏览器，虽然从技术上看版本相同，也照样存在不一致性问题。面对普遍存在的不一致性问题，开发人员要么采取迁就各方的“最小公分母”策略，要么（也是更常见的）就得利用各种客户端检测方法，来突破或者规避种种局限性。

迄今为止，客户端检测仍然是Web开发领域中一个饱受争议的话题。一谈到这个话题，人们总会不约而同和地提到浏览器应该支持一组最常用的公共功能。在理想状态下，确实应该如此。但是，在现实当中，浏览器之间的差异以及不同浏览器的“怪癖”（quirk），多得简直不胜枚举。

**因此，客户端检测除了是一种补救措施之外，更是一种行之有效的开发策略。**

**检测Web客户端的手段很多，而且各有利弊。但最重要的还是要知道，不到万不得已，就不要使用客户端检测。**只要能找到更通用的方法，就应该优先采用更通用的方法。一言蔽之，先设计最通用的方案，然后再使用特定于浏览器的技术增强该方案。

## 能力检测

最常用也最广为人们接收的客户端检测形式是能力检测（又称特性检测）。

**能力检测的目标不是识别特定的浏览器，而是识别浏览器的能力。**

采用这种方式不比顾及特定的浏览器如何如何，只要确定浏览器支持特定的能力，就可以给出方案。

```
if(object.propertyInQuestion){
    //使用object.propertyInQuestion
}
```

举例来说，IE5.0 之前的版本不支持document.getElementById()这个DOM方法。尽管可以使用非标准的document.all属性实现相同的目的，但IE的早起版本中确实不存在document.getElementById()。于是，也就有了类似下面的能力检测代码：

```
function getElementById(id) {
    if(document.getElementById){
        return document.getElementById(id);
    } else if(document.all[id]) {
        return document.all[id];
    } else {
        throw new Error("No way to select element!");
    }
}
```

这里的getElement()函数的用途是返回具有给定ID的元素。因为document.getElementById()是实现这一目的的标准方式，所以一开始就测试了这个方法。如果该函数存在（不是未定义），则使用该函数。否则，就要继续检测document.all是否存在，如果是，则使用它。如果上述两个特性都存在（很有可能），则创建并抛出错误，表示这个函数无法使用。

**要理解能力检测，首先必须理解两个重要的概念。**

- 第一个概念就是先检测达成目的的最常用的特性。对上面的例子来说，就要先检测document.getElementById()，后检测document.all。**先检测最常用的特性可以保证代码最优化，因为在多数情况下都可以避免测试多个条件。**

- 第二个重要的概念就是必须测试实际要用到的特性。一个特性存在，不一定意味着另一个特性也存在。

```
function gerWindowWidth() {
    if(document.all) {
        return document.documentElement.clientWidth;//错误的用法
    } esle {
        return window.innerWidth;
    }
}
```

这是一个错误使用能力检测的例子。getWindowWidth()函数首先检查document.all是否存在，如果是则返回document.documentElement.clientWidth。IE8及之前的版本确实不支持window.innerWidth属性。但问题是document.all存在也不一定表示浏览器就是IE。实际上，也可能是Opera。Opera支持document.all，也支持window.innerWidth。

### 更可靠的能力检测

能力检测对于想知道某个特性是否会按照适当方式行事（而不仅仅是讴歌特性存在）非常有用。利用类型转换来确定某个对象成员是否存在，但这样你还是不知道该成员是不是你想要的。

```
//不要这样做！这不是能力检测——只检测了是否存在相应的方法
function isSortable(object) {
    return !!object.sort;
}
```

这个函数通过检测对象是否存在sort()方法，来确定对象是否支持排序。问题是，任何包含sort的属性的对象也都会返回true。

```
var result = isSortable({sort:true});
```

**检测某个属性是否存在并不确定对象是否支持排序。更好的方式是检测sort是不是一个函数。**

```
//这样更好：检查sort是不是函数

function isSortable(object){
    return typeof object.sort == "function";
    //typeof的操作符的优先级很高
}
```

这里的typeof操作符用于确定sort是否是一个函数，因此可以判断对象是否有排序方法。

**在可能的情况下，要尽量使用typeof进行能力检测。**
有些宿主对象没有义务让typeof返回合理的值。这事儿发生在IE中，大多数浏览器在检测到document.createElement()存在时，都会返回true。

```
//在IE8及之前版本中不行
function hasCreateElement() {
    return typeof document.createElement == "function";
}
```

在IE8及之前版本中，这个返回false，因为typeof document.createElement返回的是"object"，而不是"function"。

**DOM对象是宿主对象，IE及更早版本中的宿主对象是通过COM而非JScript实现的。因此，document.createElement()函数确实是一个COM对象，所以typeof才会返回"object"。**

IE9纠正了这个问题，对所有DOM方法都返回"function"。

**关于typeof的行为不标准，IE中还可以举出例子来。ActiveX对象（只有IE支持）与其他对象的行为差异很大。**例如，不使用typeof测试某个属性会导致错误。

```
//在IE中会导致错误
var xhr = new ActiveXObject("Microsoft.XMLHttp");

if(xhr.open) { //这里会发生错误
    //执行操作
}
```

像这样直接把函数作为属性访问会导致JavaScript错误。使用typeof操作符会更靠谱一点。但IE对typeof xhr.open会返回"unknown"。这就意味着，在浏览器环境下测试任何对象的某个特性是否存在，要使用下面这个函数。

```
//作者：Peter Michaux

function isHostMethod(object, property) {
    var type = typeof object[property];
    return type == "function" || (!!(type == "object" && object[property])) || type == "unknown";
}
```

可以像下面这样使用这个函数：

```
result = isHostMethod(xhr,"open"); //true
result = isHostMethod(xhr,"foo"); //false
```

目前使用isHostMethod()方法还是比较可靠的，因为它考虑到了浏览器的怪异行为。不过也要注意，宿主对象没有义务保持目前的实现方式不变，也不一定会模仿已有宿主对象的行为。所以，这个函数——以及其他类似函数，都不能百分之百地保证永远可靠。作为开发人员，必须对自己要使用某个功能的风险作出理性的估计。


### 能力检测，不是浏览器检测

检测某个或某几个特性并不确定浏览器。

下面给出的这段代码(或与之差不多的代码)可以在许多网站中看到，这种“浏览器检测”代码就是错误地依赖能力检测的典型示例。

```
//错误，还不够具体
var isFirefox = !!(navigator.vendor && navigator.vendorSub);

//错误！假设过头了
var isIE = !!(document.all && document.uqinueID);
```

这两行代码代表了对能力检测典型误用。以前，确实可以通过检测navigator.vendor和navigator.vendorSub来确定Firefox浏览器。但是，Safari也依葫芦画瓢实现了相同的属性。于是，这段代码就会导致人们作出错误的判断。为检测IE，代码测试了document.all和document.uniqueID。这就相当于假设IE将来仍然会继续存在这两个属性，同时还假设其他浏览器都不会实现这两个属性。最后，这两个检测都使用了双逻辑非操作符来得到布尔值（比西安存储后访问的效果更好）。

实际上，根据浏览器不同将能力组合起来是更可取的方式。如果你知道自己的应用程序需要使用某些特定的浏览器特性，那么最好是一次性检测所有相关特性，而不要分别检测。

```
//确定浏览器是否支持Netscape风格的插件
var hasNSPlugins = !!(navigator.plugins && navigator.plugins.length);

//确定浏览器是否具有DOM1级规定的能力
var hasDOM1 = !!(document.getElementById && document.createElement && document.getElementByTagName);
```

以上例子展示了两个检测：一个检测浏览器是否支持Netscape风格的插件；另一个检测浏览器是否具备DOM1级所规定的能力。得到的布尔值可以以后继续使用，从而节省重新检测能力的时间。

**在实际开发中，应该将能力检测作为确定下一步解决方案的依据，而不是用来判断用户使用的是什么浏览器。**

## 怪癖检测

与能力检测类似，怪癖检测（quirks detection)的目标是识别浏览器的特殊行为。但与能力检测确认浏览器支持什么能力不同，怪癖检测是想要知道浏览器存在什么缺陷（quirks也就是bug）。这通常需要运行一小段代码，以确定某一特性不能正常工作。例如，IE8及更早版本中存在一个bug，即如果某个实例属性与[[Enumerable]]标记为false的某个原型属性同名，那么该实例属性将不会出现在for-in循环当中。可以使用如下代码来检测这种“怪癖”。

```
var hasDontEnumQuirk = function() {
    var o = {toString: function(){}};
    for(var prop in o) {
        if(prop == "toString") {
            return false;
        }
    }
    return true;
}();
```

以上代码通过一个匿名函数来测试该“怪癖”，函数中创建了一个带有toString()方法的对象。
在正确的ECMAScript实现中，toString应该在for-in循环中作为属性返回。

另一个经常需要检测的“怪癖”是Safari 3以前版本会枚举被隐藏的属性。
可以用下面的函数来检测该怪癖。

```
var hasEnumShadowQuirk = function() {
    var o = {toString: function(){}};
    var count = 0;
    for(var prop in o) {
        if(prop == "toString"){
            count ++;
        }
    }
    return (count > 1);
}();
```

如果浏览器存在这个bug，那么使用for-in循环枚举带有自定义的toString()方法的对象，就会返回两个toString的实例对象。

一般来说，“怪癖”都是个别浏览器所独有的，而且通常被归为bug。在相关浏览器的新版本中，这些问题可能会也可能不会被修复。由于检测“怪癖”涉及运行代码，因此建议仅检测那些对你有直接影响到“怪癖”，而且最好在脚本一开始就执行此类检测，以便尽早解决问题。
