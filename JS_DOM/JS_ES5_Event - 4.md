# JS_ES5_Event - 4

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 焦点事件

焦点事件会在页面元素获得或失去焦点时触发。利用这些事件并与document.hasFocus()方法及document.activeElement 属性配合，可以知晓用户在页面的行踪。有以下6个焦点事件。

- blur： 在元素失去焦点时触发。这个事件不会冒泡；所有浏览器都支持它。
- DOMFocusIn: 在元素获得焦点时触发。这个事件与HTML事件focus等价，但它冒泡。只有Opera支持这个事件。DOM3级事件废弃了DOMFocusIn，选择了focusin。
- DOMFocusOut: 在元素失去焦点时触发。这个事件是HTML事件blur的通用版本。只有Opera支持这个事件。DOM3级事件废弃了DOMFocusOut，选择了focusout。
- focus: 在元素获得焦点时触发。这个事件不会冒泡；所有浏览器都支持它。
- focusin：在元素获得焦点时触发。这个事件与HTML事件 focus 等价，但它冒泡。支持这个事件的浏览器有IE5.5+、Safari 5.1+、Opera 11.5+和Chrome。
- focusout: 在元素失去焦点时触发。这个事件是HTML事件blur的通用版本。支持这个事件的浏览器有IE 5.5+、Safari 5.1+、Opera 11.5+和Chrome。

**这一类事件中最主要的两个是focus和blur，它们都是JavaScript早起就得到所有浏览器支持的事件。**这些事件的最大问题是它们不冒泡。因此，IE的focusin和focusout与Opera的DOMFocusIn和DOMFocusOut才会发生重叠。IE的方式最后被DOM3级事件采纳为标准方式。

当焦点从页面中的一个元素移动到另一个元素，会依次触发下列事件：

- focusout 在失去焦点的元素上触发。
- focusin 在获得焦点的元素上触发。
- blur 在失去焦点的元素上触发。
- DOMFocusOut 在失去焦点的元素上触发。
- focus 在获取焦点的元素触发。
- DOMFocusIn 在获得焦点的元素上触发。

其中，blur、DOMFocusOut 和 focusout的事件目标是失去焦点的元素。而focus、DOMFocusIn和focusin的事件目标是获得焦点的元素。

要确定浏览器是否支持这些事件，可以使用如下代码：

```
var isSupported = document.implementation.hasFeature("FocusEvent", "3.0");
```

**即使focus和blur不冒泡，也可以在捕获阶段侦听到它们。**

## 鼠标与滚轮事件

鼠标事件是Web开发中最常用的一类事件，毕竟鼠标还是最主要的定位设备。DOM3级事件中定义了9个鼠标事件，简介如下。

- click: 在用户点击鼠标按钮（一般是左边的按钮）或者按下回车时触发。这一点对确保易访问性很重要，意味着onclick事件处理程序既可以通过键盘也可以通过鼠标执行。

- dbclick: 在用户双击主鼠标按钮（一般是左边的按钮）时触发。从技术上说，这个事件并不是DOM2级事件规范中规定的，但鉴于它得到了广泛支持，所以DOM3级事件将其纳入标准。

- mousedown：在用户按下了任意鼠标按钮时触发。不能通过键盘触发这个事件。

- mouoseenter：在鼠标光标从元素外部首次移动到元素范围之内时触发。这个事件不冒泡，而且在光标移动到后代元素上不会触发。DOM2级事件并没有定义这个事件，但DOM3级事件将它纳入了规范。IE、Firefox 9+和Opera支持这个事件。

- mouseleave: 在位于元素上方的鼠标光标移动到元素范围之外时触发。这个事件不冒泡，而且在光标移动到后代元素上不会触发。DOM2级事件并没有定义这个事件，但DOM3级事件将它纳入了规范。IE、Firefox 9+和Opera 支持这个事件。

- mousemove: 当鼠标指针在元素内部移动时重复地触发。不能通过键盘触发这个事件。

- mouseout: 在鼠标指针位于一个元素上方，然后用户将其移入另一个元素时触发。又移入的另一个元素位于前一个元素的外部，也可以是这个元素的子元素。不能通过键盘触发这个事件。

- mouseup: 在用户释放鼠标按钮时触发。不能通过键盘触发这个事件。

页面上的所有元素都支持鼠标事件。除了mouseenter和mouseleave，所有鼠标事件都会冒泡，也可以被取消，而取消鼠标事件将会影响浏览器的默认行为。取消鼠标事件的默认行为还会影响其他事件，因为鼠标事件与其他事件是密不可分的关系。

只有在同一个元素上相继触发mousedown 和 mouseup 事件，才会触发click事件；如果mousedown 或 mouseup 中的一个被取消，就不会触发click事件。类似地，只有触发两次click事件，才会触发一次dbclick事件。如果有代码阻止了连续两次触发click事件（可能是直接取消click事件，也可能通过取消mousedown 或 mouseup 间接实现），那么就不会触发dbclick事件了。

这4个事件触发的顺序始终如下：

1. mousedown
2. mouseup
3. click
4. mousedown
5. mouseup
6. click
7. dbclick

显然，click 和 dbclick 事件都会依赖于其他先行事件的触发。而mousedown和mouseup 则不受其他事件的影响。

IE8及之前版本中的实现有一个小bug，因此在双击事件中，会跳过第二个 mousedown和 click事件，其顺序如下：

1. mousedown
2. mouseup
3. click
4. mouseup
5. dbclick

IE9 修复了这个bug，之后顺序就正确了。

使用以下代码可以检测浏览器是否支持以上DOM2级事件（除 dbcloick、mouseenter 和 mouseleave之外）：

```
var isSupported = document.implementation.hasFeature("MouseEvents", "2.0");
```

要检测浏览器是否支持上面的所有事件，可以使用以下代码：

```
var isSupported = document.implementation.hasFeature("MouseEvent", "3.0");
```

注意，DOM3级事件的feature名是"MouseEvent"，而非"MouseEvents"。

鼠标事件中还有一类滚轮事件。而说是一类事件，其实就是一个mousewheel事件。这个事件跟踪鼠标滚轮，类似于于Mac的触控板。

### 客户区坐标位置

鼠标事件都是在浏览器视口中的特定位置上发生的。这个位置信息保存在事件对象的clientX和clientY属性中。
所有浏览器都支持这两个属性，它们的值表示事件发生时鼠标指针在视口中的水平和垂直坐标。

可以使用类似下列代码取得鼠标事件的客户端坐标信息：

```
var div = document.getElementById("myDiv");
EventUtil.addHandler(div, "click", function(event){
    event = EventUtil.getEvent(event);
    console.log("Client coordinates: " + event.clientX + "," + event.clientY);
});
```

这里为一个\<div>元素指定了 onclick 事件处理程序。当用户点击这个元素时，就会看到事件的客户端坐标信息。注意，这些值中不包括页面滚动的距离，因此这个位置并不表示鼠标在页面上的位置。

### 页面坐标位置

通过客户区坐标能够知道鼠标是在视口中什么位置发生的，而页面坐标通过事件对象的pageX 和 pageY 属性，能告诉你事件是在页面中的什么位置发生的。换句话说，这两个属性表示鼠标光标在页面中的位置，因此坐标是从页面本身而非视口的左边和顶边计算的。

以下代码可以取得鼠标事件在页面中的坐标:

```
var div = document.getElementById("myDiv");
EventUtil.addHandler(div, "click", function(event) {
    event = EventUtil.getEvent(event);
    console.log("Page coordinates: " + event.pageX + "," + event.pageY);
});
```

在页面没有滚动的情况下，pageX和pageY的值与clientX和clientY的值相等。

IE8及更早版本不支持事件对象上的页面坐标，不过使用客户区坐标和滚动信息可以计算出来。
这时候需要用到document.body(混杂模式) 或 document.documentElement(标准模式)中的scrollLeft和scrollTop属性。计算过程如下所示：

```
var div = document.getElementById("myDiv");
EventUtil.addHandler(div, "click", function(event){
    event = EventUtil.getEvent(event);
    var pageX = event.pageX,
        pageY = event.pageY;
    
    if(pageX === undefined) {
        pageX = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
    }

    if(pageY === undefined) {
        pageY = event.clientY + (document.body.scrollTop || document.documentElement.scrollTop);
    }

    console.log("Page coordinates: " + pageX + "," + pageY);
});
```

3. 屏幕坐标位置

鼠标事件发生时， 不仅会有相对于浏览器窗口的位置，还有一个相对于整个电脑屏幕的位置。
而通过screenX 和 screeY 属性就可以确定鼠标事件发生时鼠标指针相对于整个屏幕的坐标信息。

可以使用类似下面的代码取得鼠标事件的屏幕坐标：

```
var div = document.getElementById("myDiv");
EventUtil.addHandler(div, "click", function(event){
    event = EventUtil.getEvent(event);
    console.log("Screen coordinates: " + event.screenX + "," + event.screenY);
});
```

与前一个例子类似，这里也是为\<div>元素指定了一个onclick 事件处理程序。当这个元素被单击时，就会显示出时间的屏幕坐标信息。

### 修改键

虽然鼠标事件主要是通过使用鼠标来触发的，但在按下鼠标时键盘上的某些键的状态也可以影响到所要采取的操作。这些修改键就是Shift、Ctrl、Alt和Meta（在Windows键盘中是Windows键，在苹果机中是Cmd键），它们经常被用来修改鼠标事件的行为。

DOM为此规定了4个属性，表示这些修改键目的状态：shiftKey、ctrlKey、altKey和 metaKey。这些属性中包含的都是布尔值，如果相应的键被按下了，则值为true，否则值为false。当某个鼠标事件发生时，通过检测这几个属性就可以确定用户是否同时按下了其中的键。

```

var div = document.getElementById("myDiv");

EventUtil.addHandler(div, "click", function(event){
    event = EventUtil.getEvent(event);
    var keys = new Array();

    if(event.shiftKey) {
        keys.push("shift");
    }

    if(event.ctrlKey) {
        keys.push("ctrl");
    }

    if(event.altKey) {
        keys.push("alt");
    }

    if(event.metaKey) {
        keys.push("meta");
    }

    console.log("Keys" + keys.join(","));
});
```

在这个例子中，我们通过一个onclick事件处理程序检测了不同修改键的状态。数组keys中包含着被案子下的修改键的名称。换句话说，如果有属性值为true，就会将对应修改键的名称添加到keys数组中。在数组处理程序的最后，有一个警告框将检测到的键的信息显示给用户。

### 相关元素

在发生mouseover 和 mouseout 事件时，还会涉及更多的元素。这两个事件都会涉及把鼠标指针从一个元素的边界之内移动到另一个元素的边界之内。对mouseover事件而言，事件的主目标是获得光标的元素，而相关元素就是那个失去光标的元素。类似地，对mouseout 事件而言，事件的主要目标是失去光标的元素，而相关元素则是获得光标的元素。

```
<!DOCTYPE html>
<html>
<head>
    <title>Related Elements Example</title>
<head>
<body>
    <div id="myDiv" style="background-color:red;height:100px;width:100px"></div>
</body>
</html>
```

这个例子会在页面上显示一个\<div>元素。如果鼠标指针一开始位于这个\<div>元素上，然后移出了这个元素，那么就会在\<div>元素上触发 mouseout 事件，相关元素就是\<body>元素。与此同时，\<body>元素上面会触发mouseover事件，而相关元素变成了\<div。

DOM通过event对象的relateddTarget属性提供了相关元素的信息。这个属性只对于mouseover和mouseout事件才包含值。对于其他事件，这个属性的值是null。IE8及之前版本不支持relatedTarget属性，但提供了保持着同样信息的不同属性。在mouseover 事件触发时，IE的 fromElement 属性中保存了相关元素。在mouseout事件触发时，IE的toElement属性中保存着相关元素。

可以把下面这个跨浏览器取得相关元素的方法添加到EventUtil对象中。

```
var EventUtil = {
    //省略了其他代码
    getRelatedTarget: function(event) {
        if(event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if(event.fromElement) {
            return event.fromElement
        } else {
            return null
        };
    },

    //省略其他代码
};
```

与以前添加的跨浏览器方法一样，这个方法也使用特性检测来确定返回哪个值。可以像下面这样使用EventUtil.getRelatedTarget()方法：

```
var div = document.getElementById("myDiv");
EventUtil.addHandler(div, "mouseout", function(event) {
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
    var relatedTarget = EventUtil.getRelatedTarget(event);
    console.log("Moused out of " + target.tagName + " to " + relatedTarget.tagName);
});
```

这个例子为\<div>元素的mouseout事件注册来了一个事件处理程序。当事件触发时，会有一个警告框显示鼠标移出和移入的元素信息。

### 鼠标按钮

只有在主鼠标按钮被点击（或键盘回车键被按下）时才会触发click事件，因此检测按钮的信息并不是必要的。但对于mousedown和 mouseup事件来说，则在event对象存在一个button属性，表示按下或释放的按钮。DOM的button属性可能有如下3个值：0 表示主鼠标按钮，1表示中间的鼠标按钮（鼠标滚轮按钮），2 表示 次鼠标按钮。在常规的设置中，主书报表按钮就是鼠标左键，而次鼠标按钮就是鼠标右键。

### 更多的事件信息

“DOM2级事件”规范在event对象中还提供了detail属性，用于给出有关事件的更多信息。
对于鼠标事件来说，detail 中包含来了一个数值，表示给定位置上发生了多少次点击。
在同一个元素上相继地发生一次mousedown和一次mouseup事件算作一次点击。detail属性从1开始计数，每次点击发生后都会递增。如果鼠标在mousedown和mouseup之间移动了位置，则detail会被重置为0.

这个属性的用处不大，它们提供的信息要么没有什么价值，要么可以通过其他方式计算出来。

### 鼠标滚轮事件

当用户通过鼠标滚轮与页面交互、在垂直方向上滚动页面时（无论是向上还是向下），就会触发 mousewheel事件。这个事件可以在任何元素上面触发，最终会冒牌到document(IE8) 或 window（IE9、Opera、Chrome及Safari）对象。与mousewheel事件对应的event对象除包含鼠标事件的所有标准信息外，还包含一个特殊的wheelDelta属性。当用户向前滚动鼠标滚轮时，wheelDelta是120的倍数，当用户向后滚动鼠标滚轮时，wheelDelta是-120的倍数。

将 mousewheel 事件处理程序指定给页面中的任何元素或document对象，即可处理鼠标滚轮的交互操作。来看下面的例子。

```
EventUtil.addHandler(document, "mousewheel", function(event) {
    event = EventUtil.getEvent(event);
    console.log(event.wheelDelta);
});
```

这个例子会在发生mousewheel事件时显示wheelDelta的值。多数情况下，只要知道鼠标滚轮的方向就够了，而这通过检测wheelDelta的正负号就可以确定。

有一点注意：在Opera 9.5 之前的版本中，wheelDelta值的正负号是颠倒的。如果你打算支持早期的Opera版本，就需要使用浏览器检测技术来确定实际的值。

```
EventUtil.addHandler(document, "mousewheel", function(event) {
    event = EventUtil.getEvent(event);
    var delta = (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
    console.log(delta);
});
```

**由于mousewheel事件非常流行，而且所有浏览器都支持它，所以HTML5也加入了该事件。**

**Delta是鼠标增量值的意思。**

### 触摸设备

iOS和 Android 设置的实现非常而别，因为这些设备没有鼠标。

在面向iPhone和iPod中的Safari开发时，要记住以下几点。

- 不支持dbclick事件。双击浏览器窗口会放大画面，而且没有办法改变该行为。

- 轻击可点击元素会触发mousemove事件。如果此操作会导致内容变化，将不再有其他事件发生。如果屏幕没有因此变化，那么会依次发生mousedown、mouseup和click事件。轻击不可点击的元素不会触发任何事件，可单击的元素是指那些单击可产生默认操作的元素（如链接），或者那些已经被指定了onclick事件处理程序的元素。

- mousemove事件也会触发mouseover和mouseout事件。

- 两个手指放在屏幕上且页面随手指一动而滚动时会触发mousewheel和 scroll事件。

### 无障碍性问题

如果你的Web应用程序或网站要确保残疾人特别是那些使用屏幕阅读器的人都能访问，那么在使用鼠标事件时就要格外小心。**前面提到过，可以通过键盘上的回车键来触发click事件，但其他鼠标事件却无法通过键盘来触发。**为此，我们不建议使用click之外的其他鼠标事件来展示功能或引发代码执行。因为这样会给盲人或视障用户造成极大不方便。

- 使用click事件执行代码。有人指出通过onmousedown执行代码会让人觉得速度更快，对视力正常的人来说这是没错的。但是，在屏幕阅读器中，由于无法触发mousedown事件，结果就会造成代码无法执行。

- 不要使用onmouseover向用户显示新的选项。原因同上，屏幕阅读器无法触发这个事件。如果确实非要通过这种方式来显示新选项，可以考虑添加显示相同信息的键盘快捷方式。

- 不要使用dblclick执行重要的操作。键盘无法触发这个事件。

**遵照以上提示可以极大地提升残疾人在访问你的Web应用程序或网站时的易访问性。**