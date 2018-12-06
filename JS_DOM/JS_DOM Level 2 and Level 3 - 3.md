# JS_DOM Level 2 and Level 3 - 3

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

这里介绍的属性和方法并不属于"DOM2级样式"规范，但却郁HTML元素的样式信息息息相关。

**DOM中没有规定如何确定页面中元素的大小。IE为此率先引入了一些属性，以便开发人员使用。**

目前，所有主要的浏览器都已经支持这些属性。

## 偏移量

首先要介绍的属性涉及**偏移量(offset dimension)**，指的是元素在屏幕上占用的所有可见的空间。
元素的可见大小由其高度、宽度决定，包括所有内边距、滚动条和边框大小（注意，不包括外边距）。

通过下列4个属性可以取得元素的偏移量。

- offsetHeight: 元素在垂直方向上占用的空间大小，以像素计。包括元素的高度、水平滚动条的高度、上边框高度和下边框高度。

- offsetWidth: 元素在水平方向上占用的空间大小，以像素计。包括元素的宽度、垂直滚动条的宽度、左边框宽度和右边框宽度。

- offsetLeft: 元素的左外边框至包含元素的左内边框之间的像素距离。

- offsetTop: 元素的上外边框至包含元素的上内边框之间的像素距离。


其中，offsetLeft和offsetTop属性与包含元素有关，包含元素的引用保存在offsetParent属性中。

offsetParent属性不一定与parentNode的值相等。

例如，\<td>元素的offsetParent是作为其祖先元素的\<table>元素，因为\<table>是在DOM层次中距\<td>最近的一个具有大小的元素。

**要想知道某个元素在页面上的偏移量，**将这个元素的offsetLeft和offsetTop与其offsetParent的相同属性相加，如此循环直至根元素，就可以得到一个基本准确的值。

```
function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;

    while(current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    
    return actualLeft;
}

function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while(current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetTop;
    }

    return actualTop;
}

```

这两个函数利用offsetParent属性在DOM层次中逐级向上回溯，将每个层次中的偏移量属性合计到一块块。

对于简单的CSS布局的页面，这两函数可以得到非常精确的结果。

对于使用表格和内嵌框架的页面，由于不同浏览器实现这些元素的方式不同，因此得到的值就不太精确了。

一般来说，页面中的所有元素都会被包含在几个\<div>元素中，而这些\<div>元素的offsetParent 又是\<body>元素，所以getElementLeft()与getElementTop()会返回与offsetLeft和offsetTop相同的值。

所以这些偏移量属性都是只读的，而且每次访问它们都需要重新计算。
因此，应该尽量避免重复访问这些属性。
如果需要重复使用其中某些属性的值，可以将它们保存在局部变量中，以提高性能。


### 客户区大小

元素的客户区大小（client dimension)，指的是元素内容及其内边距所占据的空间大小。

有关客户区大小的属性有两个：clientWidth和clientHeight。

其中，clientWidth属性是元素内容区宽度加上左右内边距宽度；
clientHeight属性是元素内容区高度加上上下内边距高度。

**注意，不包含边框。**

从字面上看，客户区大小就是元素内部的空间大小，因此滚动条占用的空间不计算在内。

最常用到这些属性的情况，就是确定浏览器视口大小，可以使用document.documentElement或document.body（在IE7之前的版本中）的clientWidth和clientHeight。

```
function getViewPort(){
    if(document.compatMode === "BackCompat"){
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    };
}
```

这个函数首先检查document.compatMode属性，以确定浏览器是否运行在模式混杂。
Safari 3.1之前的版本不支持这个属性，因此就会自动执行else语句。

Chrome、Opera和 Firefox大多数情况下都运行在标准模式下，因此它们也会前进到else语句。

这个函数会返回一个对象，包含两个属性：width和height；

表示浏览器视口的大小。

**与偏移量相似，客户区大小也是只读的，也是每次访问都要重新计算。**


### 滚动大小

最后要介绍的是滚动大小（Scroll dimension），指的是包含滚动内容的元素的大小。
有些元素（例如\<html>)，即使没有执行任何代码也能自动地添加滚动条。
但另外一些元素，则需要通过CSS的overflow属性进行设置才能滚动。

以下是4个与滚动大小相关的属性。

- scrollHeight: 在没有滚动条的情况下，元素内容的总高度。
- scrollWidth: 在没有滚动条的情况下，元素内容的总宽度。
- scrollLeft：被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置。
- scrollTop: 被隐藏在内容区上方的像素数。通过设置这个属性可以改变元素的滚动位置。

scrollWidth和scrollHeight 主要用于确定元素内容的实际大小。
例如，**通常认为\<html>元素是在Web浏览器的视口中滚动的元素（IE6之前版本运行在混杂模式下是\<body>元素）。**
因此，**带有垂直滚动条的页面总高度就是document.documentElement.scrollHeight。**

对于不包含滚动条的页面而言，scrollWidth 和 scrollHeight 与 clientWidth 和 clientHeight 之间的关系并不十分清晰。

在这种情况下，基于 document.documentElement 查看这些属性会在不同浏览器间发现一些不一致性问题，如下所述。

- Firefox 中这两组属性始终是相等，但大小代表是文档内容区域的实际尺寸，而非视口的尺寸。

- Opera、Safari 3.1 及更高版本、Chrome中的这两组属性是由差别的。起哄scrollWidth 和 scrollHeight 等于视口大小（Chrome现在不是这样的，现在也等于内容区大小），而clientWidth 和 clientHeight等于文档内容区域的大小。

- IE（在标准模式）中的这两组属性不相等，其中scrollWidth 和 scrollHeight 等于文档内容的大小，而clientWidth和clientHeight 等于视口大小。


在确定文档的总高度时（包括基于视口的最小高度时），必须取得scrollWidth/clientWidth 和 scrollHeight/ clientHeight中的最大值，才能保证在跨浏览器的环境下得到精确的结果。

```
var docHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);

var docWidth = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
```

注意，对于运行在混杂模式下的IE，则需要用document.body 代替 document.documentElement。

通过scrollLeft 和 scrollTop属性既可以确定当前滚动的状态，也可以设置元素的滚动位置。
在元素尚未被滚动时，这两个属性的值都等于0。
如果元素被垂直滚动了，那么scrollTop的值会大于0，且表示元素上方不可见内容的像素高度。
如果元素被水平滚动了，那么scrollLeft的值会大于0，且表示元素左侧不接见内容的像素宽度。

**这两个属性都是可以设置的，因此将元素的scrollLeft 和 scrollTop 设置为0， 就可以重置元素的滚动位置。**

```
function scrollToTop(element) {
    if (element.scrollTop !== 0) {
        element.scrollTop = 0;
    }
}
```

这个函数既取得了scrollTop的值，也设置了它的值。

### 确定元素大小

**IE、Firefox 3+、Safari 4+、Opera 9.5及 Chrome为每个元素都提供了一个getBoundingClientRect()方法。**
这个方法返回一个矩形对象，包含4个属性：left、top、right和bottom。

这些属性给出了元素在页面中相对于视口的位置。
但是，浏览器的实现稍有不同。

**IE8及更早版本认为文档的左上角坐标是（2，2），而其他浏览器包括IE9则将传统的（0，0）作为坐标起点。**

因此，就需要在一开始检查一下位于(0,0)处的元素的位置，在IE8及更早版本中，会返回（2，2），而爱其他浏览器中会返回（0,0)。

```

function getBoundingClientRect(element){
    if(typeof arguments.callee.offset !== "number"){
        var scrollTop = document.documentElement.scrollTop;
        var temp = document.createElement("div");
        temp.style.cssText = "position: absolute; left: 0; top:0;";
        documnt.body.appendChild(temp);
        arguments.callee.offset = -temp.getBoundingClientRect().top + scrollTop;
        document.body.removeChild(temp);
        temp = null;
    }

    var rect = element.getBoundingClientRect();
    var offset = arguments.callee.offset;

    return {
        left: rect.left + offset,
        right:  rect.right + offset,
        top: rect.top + offset,
        bottm: rect.bottom + offset
    };
}
```

这个函数使用了它自身的属性来确定是否要对坐标进行调整。

第一步是检测属性是否有定义，如果没有就定义一个。
最终的offset会被设置为新元素上坐标的负值，实际上就是在IE中设置为-2，在Firefox 和 Opera 中设置为 -0。

为此，需要创建有一个临时的元素，将其位置设置在（0,0），然后再调用其getBoundingClientRect()。

之所以要减去视口的scrollTop，是为了防止调用这个函数时窗口被滚动了。

这样编码代码，就无需每次调用这个函数都执行两次getBoundingClientRect()了。
接下来，再在传入的元素上调用这个方法并给予新的计算公司创建一个对象。

对于不支持getBoundingClientRect()的浏览器，可以通过其他手段取得相同的 信息。
一般来说，right和left的差值与offsetWidth的值相等，而bottom和top的差值与offsetHeight相等。

而且，left和top属性大致等于之前封装过的函数getElementLeft()和getElementTop()函数取得的值。

```

function getElementLeft(element) {
    var elementLeft = element.offsetLeft;
    var current = element.offsetParent;
    while(current !== null) {
        elementLeft += current.offsetLeft;
        current = current.offsetParent;
    };
    return elementLeft;
}

function getElementTop(element) {
    var elementTop = element.offsetTop;
    var current = element.offsetParent;
    while(current !== null){
        elementTop += current.offsetTop;
        current = current.offsetTop;
    }
    return elementTop;
}


function getBoundingClientRect(element) {
    var scrollTop = document.documentElement.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft;

    if(element.getBoundingClientRect) {
        if(arguments.callee.offset !== null) {
            var temp = document.createElement("div");
            temp.style.cssText = "position: absolute; left: 0; top: 0;";
            document.body.appendChild(temp);
            arguments.callee.offset = -temp.getBoundingClientRect().top + scrollTop;
            document.body.removeChild(temp);
            temp = null;
        }

        var rect = element.getBoundingClientRect();
        var offset = arguments.callee.offset;

        return {
            left: rect.left + offset,
            right: rect.right + offset,
            top: rect.top + offset,
            bottom: rect.bottom + offset
        }
    } else {
        var actualLeft = getElementLeft(element);
        var actualTop = getElementTop(element);

        return {
            left: actualLeft - scrollLeft,
            right: actualLeft + element.offsetWidth - scrollLeft,
            top: actualTop - scrollTop,
            bottom: actualTop + element.offsetHeight - scrolLTop
        }
    }
}

```

这个函数在getBoundingClientRect()有效时，就使用这个原生方法，而在这个方法无效时则使用默认的计算公式。
在某些情况下，这个函数返回的值可能会有所不同，例如使用表格布局或使用滚动元素的情况下。

**由于这里使用了arguments.callee，所有这个方法不能在严格模式下使用。**