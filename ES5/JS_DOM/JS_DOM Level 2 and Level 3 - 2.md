# JS_DOM Level 2 and Level 3 - 1

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 样式

在HTML中定义样式的方式有3种：通过\<link>元素包含外部样式表文件、使用\<style>元素定义嵌入样式，以及使用style特性定义针对特定元素的样式。

“DOM2级样式”模块围绕这3种应用样式的机制提供了一套API。

要确定浏览器是否支持DOM2级定义的CSS能力，可以使用下列代码。

```
var supportsDOMCSS = document.implementation.hasFeature("CSS", "2.0");
var supportsDOM2CSS2 = document.implementation.hasFeature("CSS2","2.0");
```

### 访问元素的样式

任何支持style特性的HTML元素在JavaScript中都有一个对应的style属性。

这个style对象是CSSStyleDeclaration的实例，包含着通过HTML的style特性指定的所有样式信息，但不包含与外部样式表或嵌入样式表经层叠而来的样式。

在syle特性中指定的任何CSS属性都将表现为这个style对象的相应属性。

对于使用短划线（分隔不同的词汇，例如background-image）的CSS属性名，必须将其转换成驼峰大小写形式，才能通过JavaScript来访问。

下表列出了几个常见的CSS属性及其在style对象中对应的属性名。

|CSS属性|JavaScript属性|
|background-image|style.backgroundImage|
|color|style.color|
|display|style.display|
|font-family|style.fontFamily|

多数情况下，都可以通过简单地转化属性名的格式来实现转换。
其中一个不能直接转换的CSS属性是float。
**由于float是JavaScript中的保留字，因此不能用作属性名。**
“DOM2级样式”规范规定样式对象上相应的属性名应该是cssFloat；

Firefox、Safari、Opera和Chrome都支持这个属性，而IE支持的则是styleFloat。

只要取得一个有效的DOM元素的引用，就可以随时使用JavaScript为其设置样式。

```
var myDiv = document.getElementById("myDiv");

//设置背景颜色
myDiv.style.backgroundColor = "red";

//改变大小
myDiv.style.width = "100px";
myDiv.style.height = "200px";

//指定边框
myDiv.style.border = "1px solid black"

在以这种方式改变样式时，元素的外观会自动被更新。

**在标准模式下，所有度量值都必须指定一个度量单位。在混杂模式下，可以将style.width设置为"20"，浏览器会假设它是"20px"；但在标准模式下，将style.width设置为"20"会导致被忽略——因为没有度量单位。在实践中，最好始终指定度量单位。**

通过style对象同样可以取得style特性中指定的样式。以下面的HTML代码为例。

```
<div id="myDiv" style="background-color:red; width:10px; height:25px"></div>
```

在style特性中指定的样式信息可以通过下列代码取得

```
console.log(myDiv.style.backgroundColor); //"blue"
console.log(myDiv.style.width); //"10px"
console.log(myDiv.style.height); //"25px"
```

如果没有为元素设置style特性，那么style对象中可能会包含一些默认的值，但这些值并不能准确地反映该元素的样式信息。

1. DOM样式属性和方法

"DOM2级样式"规范还未style对象定义了一些属性和方法。
这些属性和方法在提供元素的style特性值的同时，也可以修改样式。

- cssText: 通过它能够访问到style特性中的CSS代码。

- length：应用给元素的CSS属性的数量。

- parentRule: 表示CSS信息的CSSRule对象。

- getPropertyCSSValue(propertyName): 返回包含给定属性值的CSSValue对象。

- getPropertyPriority(propertyName): 如果给定的属性使用了!important设置，则返回"important"; 否则，返回空字符串。

- item(index): 返回给定位置的CSS属性的名称。

- removeProperty(propertyName): 从样式中删除给定属性。

- setProperty(propertyName, value, priority): 将给定属性设置为相应的值，并加上优先权标志("important"或者一个空字符串)。

通过cssText属性可以访问style特性中的CSS代码。

在读取模式下，cssText返回浏览器对style特性中CSS代码的内部表示。
在写入模式下，赋给cssText的值会重写整个style特性的值。

也就是说，以前通过style特性指定的样式信息都将丢失。

例如，如果通过style特性为元素设置了边框，然后再以不包含边框的规则重写cssText，那么就会抹去元素上的边框。

下面是使用cssText属性的一个例子。

```
myDiv.style.cssText = "width: 25px; height: 100px; background-color: green";

console.log(myDiv.style.cssText);
```

设置cssText是为元素应用多想变化最快捷的方式，因为可以一次性地应用所有变化。

设计length属性的目的，就是将其与item()方法配套使用，以便迭代在元素中定义的CSS属性，在使用length和item()时，style对象实际上就相当于一个集合，都可以使用方括号语法来代替item()来取得给定位置的CSS属性。

```
for(var i = 0, len = myDiv.style.length; i < len; i++) {
    console.log(document.style[i]);
}

//这个方法有异议
//还是用for in 迭代比较好
```

无论是使用方括号语法还是使用item()方法，都可以取得CSS属性名("background-color", 不是
backgroundColor)。

然后，就可以在getPropertyValue()中使用取得的属性名进一步取得属性的值。

```
for(var prop in document.body.style) {
    var property = prop;
    var propertyValue = document.body.style.getPropertyValue(property);
    console.log(property + " : " + propertyValue );
}
```

getPropertyValue()方法取得的始终都是CSS属性值的字符串表示。
如果你需要更多信息，可以使用getPropertyCSSValue()方法，它返回一个包含两个属性的CSSValue对象，这两个属性分别是：cssText和cssValueType。

其中，cssText属性的值与getPropertyValue()返回的值相同，而cssValueStyle属性则是一个数值常量，表示值的类型：0表示继承的值，1表示基本的值， 2表示列表值，3表示自定义的值。

以下代码即输出CSS属性值，也输出值的类型。

```
//在Chrome中报错
for(let prop in document.body.style) {
    let property = prop;
    let propertyValue = document.body.style.getPropertyCSSValue(property);
    console.log(property + " : " + propertyValue.cssText + " (" + propertyValue.cssValueType + " )");
}
```

在实际开发中，getProperyCSSValue()使用得比getPropertyValue()少得多。
IE9+、safari 3+支持这个方法。

Firefox 7 及之前版本也提供这个访问，但调用总返回null。

要从元素的样式中移除某个CSS属性，需要使用removeProperty()方法。
使用这个方法移除一个属性，意味着将会为该属性应用默认的样式（从其他样式表经层叠而来。）。

例如，要移除通过style特性设置的border属性，可以使用下面的代码。

```
myDiv.style.removeProperty("border");
```

在不确定某个给定的CSS属性拥有什么默认值的情况下，就可以使用这个方法。
只要移除相应的属性，就可以为元素应用默认值。

2. 计算的样式

虽然style对象能够提供支持style特性的任何元素的样式信息，但它不包含那些从其他样式表层叠而来并影响到当前元素的样式信息。

“DOM2级样式”增强了document.defaultView，提供了getComputedStyle()方法。

这个方法接受两个参数： 要取得计算样式的元素和一个伪元素字符串（例如："after"）。

如果不需要伪元素信息，第二个参数可以是null。

getComputedStyle()方法返回一个CSSStyleDeclaration对象（与style属性的类型相同），其中包含当前元素的所有计算的样式。

以下面这个HTML页面为例：

```
<!DOCTYPE html>
<html>
    <title>Computed Styles Example</title>
    <style type="text/css">
        #myDiv {
            background-color: blue;
            width: 100px;
            height: 200px;
        }
    </style>
    <body>
        <div id="myDiv" style="backgrond-color:red; border: 1px soli black"></div>
    </body>
</html>
```

应用给这个例子中\<div>元素的样式一方面来自嵌入式样式表（<style>元素中的样式），另一方面来自其style特性。

但是，style特性中设置了backgroundColor和border，没有设置width和height，后者是通过样式表规则应用的。

以下代码可以取得这个元素计算后的样式。

```
var myDiv = document.getElementById("myDiv");
var view = document.defaultView.getComputedStyle("myDiv", null);

console.log(view.width);
console.log(view.height);
console.log(view.border);
```

在这个元素计算后的样式中，背景颜色的值是"red"，宽度值是"100px"，高度值是"200px"。

我们注意到，背景颜色不是"blue"，因为这个样式在自身的style特性中已经被覆盖了。
边框属性可能会也可能不会返回样式中实际的border规则（Opera会返回，但其他浏览器不会）.

存在这个差别的原因是不同浏览器解释综合（rollup）属性（如border）的方式不同，因为设置这种属性实际上会涉及到很多其他属性。

在设置border时，实际上是设置了四个边的边框宽度、颜色、样式属性(border-left-width、border-top-color、border-bottom-style，等等)。

因此，即使computedStyle.border不会在所有浏览器都返回值，但computedStyle.borderLeftWidth会返回值）。

需要注意的是，即使有些浏览器支持这种功能，但表示值的方式可能会有区别。
例如，Firefox和Safari会将所有颜色转换成RGB格式。因此，在使用getComputedStyle()方法时，最好多在几种浏览器中测试一下。

IE不支持getComputedStyle()方法，但它也有一种类似的概念。
在IE中，每个具有style属性的元素有一个currentStyle属性。
这个属性是CSSStyleDeclaration的实例，包含当前元素全部计算后的样式。
取得这些样式的方式也差不多。

```
var myDiv = document.getElementById("myDiv");
var computedStyle = myDiv.currentStyle;

console.log(computedStyle.backgroundColor); //"red"
console.log(computedStyle.width); //"100px"
console.log(computedStyle.height); //"200px"
console.log(computedStyle.border); //undefined
```

与DOM版本的方式一样，IE也没有返回border样式，因为这是一个综合属性。

**无论在哪个浏览器中，最重要的一条是要记住所有计算的样式都是只读；**
不能修改计算后样式对象中的CSS属性。

此外，计算后的样式也包含属于浏览器内部样式表的样式信息，因此任何具有默认值的CSS属性都会表现在计算后的样式中。

例如，所有浏览器中的visibility属性都有一个默认值，但这个会因实现而异。
在默认情况下，有的浏览器将visibility属性设置为"visible"，而又的浏览器则将其设置为"inherit"。
换句话说，不能指望某个CSS属性的默认值在不同浏览器中是相同的。
如果，你需要元素具有某个特定的默认值，应该手工在样式表中指定该值。


### 操作样式表

CSSStyleSheet类型表示的是样式表，包括通过\<link>元素包含的样式表和\<style>元素中定义的样式表。

这两个元素本身分别是由HTMLLinkElement和HTMLStyleElement类型表示的。

但是，CSSStyleSheet类型相对更加通用一些，它只表示样式表，而不管这些样式表在HTML中是如何定义的。

此外，上述两个针对元素的类型允许修改HTML特性，但CSSStyleSheet对象则是一套只读的接口（有一个属性例外）。

使用下面的代码可以确定浏览器是否支持DOM2级样式表。

```
var support2DOM2StyleSheets = document.implementation.hasFeature("StyleSheets", "2.0");
```

CSSStyleSheet继承自StyleSheet，后者可以作为一个基础接口来定义非CSS样式表。
从StyleSheet接口继承而来的属性如下。

- disabled: 表示样式表是否被禁用的布尔值。这个属性是可读/写的，将这个值设置为true可以禁用样式表。

- href：如果样式表是通过\<link>包含的，则是样式表哦的URL；否则，是null。

- media: 当前样式表支持的所有媒体类型的集合。与所有DOM集合一样，这个集合也有一个length属性和一个item()方法。也可以使用方括号语法取得集合中特定的项。如果集合是空列表，表示样式表适用于媒体。在IE中，media是一个反映\<link>和\<style>元素media特性值的字符串。

- ownerNode: 指向拥有当前样式表的节点的指针，样式表可能是在HTML中通过\<link>或\<style>引入的（在XML中可能是通过处理指令引入的）。如果当前样式表示其他样式表通过、、\@import导入的，则这个属性值为null。 IE不支持这个属性。

- parentStyleSheet: 在当前样式表中是通过\@import导入的情况下，这个属性是一个指向导入它的样式表的指针。

- title: ownerNode中title属性的值。

- type：表示样式表类型的字符串。对于CSS样式表而言，这个字符串时"type/css"。

除了disabled属性之外，其他属性都是只读的。
在支持以上所有这些属性的基础上，CSSStyleSheet类型还支持下列属性和方法：

- cssRules: 样式表中包含的样式规则的集合。IE不支持这个属性，但有一个类似的rules属性。

- ownerRule: 如果样式表示通过\@import导入的，这个属性就是一个指针，指向表示导入的规则；否则，值为null。IE不支持这个属性。

- deleteRule(index): 删除cssRules集合中指定位置的规则。IE不支持这个方法，但支持一个类似的removeRule()方法。

- insertRule(rule, index): 向cssRules集合中指定的位置插入rule字符串。IE不支持这个方法，但支持一个类似的addRule()方法。

应用于文档的所有样式表示的。通过这个集合的length属性可以获知文档中样式表的数量，而通过方括号语法或item()方法可以访问每一个样式表。

```
var sheet = null;
for(var i=0, len = document.styleSheets.length; i < len; i++) {
    sheet = document.styleSheets[i];
    console.log(sheet.href);
}
```

以上代码可以输出文档中使用的每一个样式表的href属性（style元素包含的样式表没有href属性）。

不同浏览器的document.styleSheets返回的样式表也不同。
所有浏览器都会包含\<style>元素和rel特性被设置为"stylesheet"的\<link>元素引入的样式表。IE和Opera也包含rel特性被设置为"alternate stylesheet"的\<link>元素引入的样式表。

也可以直接通过\<link>或\<style>元素取得CSSStyleSheet对象。
DOM规定了一个包含CSSStyleSheet对象的属性，叫做sheet。
除了IE，其他浏览器都支持这个属性。
IE支持的是styleSheet属性。
要想在不同浏览器中都能取得样式表对象，可以使用如下代码。

```
function getElementStyleSheet(element) {
    return element.sheet || element.styleSheet;
}

//取得第一个\<link>元素引入的样式表
var link = document.getElementsByTagName('link')[0];
var sheet = getElementStyleSheet(link);
```

这里的getStyleSheet()返回的样式表对象与document.styleSheets集合中的样式表对象相同。


### CSS规则

CSSRule 对象表示样式表中的每一条规则。
实际上，CSSRule是一个供其他多种类型继承的基类型，
其中最常见的就是CSSStyleRule类型，表示样式信息（其他规则还有\@import、@font-face、@page和@charset，但这些规则很少有必要通过脚本来访问）。

CSSStyleRule对象包含下列属性。

- cssText: 返回整条规则对应的文本。由于浏览器对样式表的内部处理方式不同，返回的文本可能会与样式表中实际的文本不一样。Safari始终都会讲文本转换成全部小写。IE不支持这个属性。

- parentRule: 如果当前规则是导入的规则，这个属性引用的就是导入规则。否则，这个值为null。IE不支持这个属性。

- parentStyleSheet：当前规则所属的样式表，IE不支持这个属性。

- selectorText：返回当前规则的选择符文本。由于浏览器对样式表的内部处理方式不同，返回的文本可能会与样式表中实际的文本不一样。在Firefox、Safari、Chrome和IE中这个属性是只读的。Opera允许修改SelectorText。

- style: 一个CSSStyleDeclaration对象，可以通过它设置和取得规则中特定的样式值。

- type: 表示规则类型的常量值。对于样式规则，这个值是1。IE不支持这个属性。

其中三个最常用的属性是cssText、selectorText和style。

cssText属性与style.cssText属性类似，但并不相同。

前者包含选择符文本和围绕样式信息的花括号，后者只包含样式信息（类似于元素的style.cssText)。

此外，cssText是只读的，而style.cssText也可以被重写。

大多数情况下，仅适用style属性就可以满足所有操作样式规则的需求了。
这个对象就像每个元素上的style属性一样，可以通过它读取和修改规则中的样式信息。

以下面的CSS规则为例：

```
div.box {
    background-color: blue;
    width: 100px;
    height： 200px;
}
```

假设这条规则位于页面中的第一个样式表中，而且这个样式中只有这一条样式规则，那么通过下列代码可以取得这条规则的各种信息。

```
var sheet = document.styleSheets[0];

var rules = sheet.cssRules || sheet.rules;

var rule = rules[0];

console.log(rule.selectorText); //"div.box"
console.log(rule.style.cssText); //完整的CSS代码
console.log(rule.style.backgroundColor); //"blue"
console.log(rule.style.width); //"100px"
console.log(rule.style.height); //"200px"

```

使用这种方式，可以像确定元素的行内样式信息一样，确定与规则相关的样式信息。
与使用元素的方式一样，在这种方式下也可以修改样式信息。

```
var sheet = document.styleSheets[0];

var rules = sheet.cssRules || sheet.rules;

var rule = rules[0];

rule.style.backgroundColor = "red"
```

必须要注意的是，以这种方式修改规则会影响页面中适用于该规则的所有元素。
换句话说，如果有两个带有box类的\<div>元素，那么这两个元素都会应用修改后的样式。


### 创建规则

DOM规定，要向现有样式表中国添加新规则，需要使用insertRule()方法。这个方法接受两个参数：规则文本和表示在哪里插入规则的索引。

```
sheet.insertRule("body { background-color: silver}", 0); //DOM方法
```

这个例子插入的规则会改变元素的背景颜色。
插入的规则将成为样式表中的第一条规则（插入到了位置0）—— 规则的次序在确定层叠之后应用到文档的规则时至关重要。Firefox、Safari、Opera和Chrome都支持insertRule()方法。

IE8及更早版本支持一个类似的方法，名叫addRule()，也接收两个必选参数：选择符文本和CSS样式信息；一个可选参数：插入规则的位置。在IE中插入与前面例子相同的规则，可使用如下代码。

```
sheet.addRule("body", "background-color: silver", 0); //仅对IE有效
```

有关这个方法的规定中说，最多可以使用addRule()添加4095条样式规则。
超出这个上限的调用将会导致错误。

要以跨浏览器的方式向样式表中插入规则，可以使用下面的函数。这个函数接收4个参数：要向其中添加规则的样式表以及与addRule相同的3个参数。

```
function insertRule(sheet, selectorText, cssText, position) {
    if(sheet.insertRule) {
        sheet.insertRule(selectorText + '{' + cssText + '}', position);
    } else if(sheet.addRule) {
        sheet.addRule(selectorText, cssText, position);
    }
}
```

下面是调用这个函数的示例代码。

```
insertRule(document.styleSheets[0], "body", "background: silver", 0);
```

虽然可以像这样来添加规则，但随着要添加规则的增多，这个方法就会变得非常繁琐。
因此，如果要添加的规则非常多，建议采用动态加载样式表的技术。

### 删除规则

从样式表中删除规则的方法是deleteRule()，这个方法接受一个参数：要删除的规则的位置。
例如，要删除样式表中的第一条规则，可以使用如下代码。

```
sheet.deleteRule(0); //DOM方法
```

IE支持的类似方法叫removeRule()，使用方法相同，如下所示。

```
sheet.removeRule(0); //仅对IE有效
```

下面是一个能够跨浏览器删除规则的函数。

第一个参数是要操作的样式表，第二个参数是要的删除的规则的索引。

```
function deleteRule(sheet, index) {
    if(sheet.deleteRule) {
        sheet.deleteRule(index);
    } else if (sheet.removeRule) {
        sheet.removeRule(index);
    }
}
```

与添加规则相似，删除规则也不是实际Web开发中常见的做法。
考虑到删除规则可能会影响CSS层叠的效果，因此请大家慎重使用。