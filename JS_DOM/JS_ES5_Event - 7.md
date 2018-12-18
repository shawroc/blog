# JS_ES5_Event - 7

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 设备事件

智能手机和平板电脑的普及，为用户与浏览器交互引入了一种新的方式，而一类新事件也应运而生。

设备事件（device event）可以让开发人员确定用户在怎么使用设备。

W3C从2011年开始着手制定一份关于设备事件的新草案，以涵盖不断增长的设备类型并为它们定义相关的事件。

1. orientationchange事件

苹果公司为移动Safari中添加了oritentation事件，以便开发人员能够确定用户何时将设备由横向查看模式切换为纵向查看方式。

移动Safari的window.orientation 属性中可能包含3个值：

0表示肖像模式，90表示向左旋转的横向模式（“主屏幕”按钮在右侧），-90 表示向右旋转的横向模式（“主屏幕”按钮在左侧）。相关文档中还提到一个值，即180表示iPhone头朝下。但这种模式至今尚未得到支持。

只要用户改变了设备的查看模式，就会触发orientationchange事件。
此时的event对象不包含任何有价值的信息，因为唯一相关的信息可以通过window.orientation访问到。

下面是使用这个事件的典型事例。

```
EventUtil.addHandler(window, "load", function(event) {
    var div = document.getElementById("myDiv");
    div.innerHTML = "Current orientation is " + window.orientation;
});

EventUtil.addHandler(window, "orientationchange", function(event){
    div.innerHTML = "Current orientation is " + window.orientation;
});
```

在这个例子中，当触发load事件时会显示最初的方向信息。
然后，添加了处理orientationchange事件的处理程序。
只要发生这个事件，就会有表示新方向的信息更新页面中的消息。

所有iOS设备都支持orientationchange事件和window.orientation属性。

**由于可以将orientationchange看成window事件，所以也可以通过指定\<body>元素的onorientationchange特性来指定事件处理程序。**

2. MozOrientation事件

Firefox 3.6 为检测设备的方向引入了一个名为MozOrientation 的新事件。

（前缀Moz 表示这是特定于浏览器开发商的事件，不是标准事件）。

当设备的加速计检测到设备方向改变时，就会触发这个事件。

但这个事件与iOS的orientationchange事件不同，该事件只能提供一个平面的方向变化。由于MozOrientation事件是在window对象上触发的，所以可以使用以下代码来处理。

```
Event.addHandler(window, "MozOrientation", function(event){
    //响应事件
});
```

此时的event对象包含三个属性：x、y和z。
这几个属性的值都介于1到-1之间，表示不同坐标轴上的方向。
在静止状态下，x值为0， y值为0，z值为1（表示设备处于竖直状态）。

如果设备向右倾斜，x值会减小；
反之，向左倾斜，x值会增大。

类似，如果设备向远离用户的方向倾斜，y值会减少，向接近用户的方向倾斜，y值会增大。

z轴检测垂直加速速度，1表示静止不动，在设备换移动时值会减小。
（失重状态下值为0）。

以下是输出这三个值的一个简单的例子。

```
EventUtil.addHandler(window, "MozOrientation", function(event){
    var output = document.getElementById("output");
    output.innerHTML = "X=" + event.x + ", Y=" + event.y + ", Z=" + event.z + "<br>";
});
```

只要带加速计的设备才支持MozOrientation 事件，包括Macbook、Lenovo Thinkpad、Windows Mobile和 Android 设备。

请大家注意，这是一个实验性API，将来可能会变（可能会被其他事件取代）。

3. deviceorientation 事件

本质上，DeviceOrientation Event规范定义的deviceorientation时间与MozOrientation事件类似。

它也是在加速计检测到设备方向变化时在window对象上触发，而且具有与MozOrientation事件相同的支持限制。

不过，deviceorientation事件的意图是告诉开发人员设备在空间中朝向哪儿，而不是如何移动。

设备在三维空间中是靠x、y和z轴来定位的。
当设备静止放在水平水面上时，这三个值都是0。
x轴方向是从左向右，y轴方向是从下往上，z轴方向是从后向前。

触发deviceorientation事件时，事件对象中包含着每个轴相对于设备静止状态发生变化的信息。

事件对象包含以下5个属性：

- alpha: 在围绕z轴旋转时（即左右旋转时），y轴的度数差；是一个介于0到360之间的浮点数。

- beta：在围绕x轴旋转时（即前后旋转时），z轴的度数差；是一个介于-180到180之间的浮点数。

- gamma: 在围绕y轴旋转时（即扭转设备时），z轴的度数差；是一个介于-90到90之间的浮点数。

- absolute: 布尔值，表示设备是否返回一个绝对值。

- compassCalibrated: 布尔值，表示设备的指南针是否校准过。

下面是一个输出alpha、beta和gamma值的例子。

```
EventUtil.addHandler(window, "deviceorientation", function(event){
    var output = document.getElementById("output");
    output.innerHTML = "Alpha=" + event.alpha + ", Beta=" + event.beta + ", Gamma=" + event.gamama + "<br>";
});
```

通过这些信息，可以响应设备的方向，重新排列或修改屏幕上的元素。
要响应设备方向的改变而旋转元素。

```
EventUtil.addHandler(window, "deviceorientation", function(event){
    var arrow = document.getElementById("arrow");
    arrow.style.webkitTransform = "rotate(" + Math.round(event.alpha) + "deg)";
});
```

这个例子只能在移动WebKit浏览器中运行，因为它使用了专有的webkitTransform属性（即CSS标准属性transform的临时版）。

元素"arrow"会随着event.alpha的值变化而旋转，给人一种指南针的感觉。
为了保证旋转平滑，这里的CSS3变化使用舍入之后的值。

到2011年，支持deviceorientation事件的浏览器有iOS4.2+中的Safari、Chrome和Android版的WebKit。

4. devicemotion事件

DeviceOrientation Event规范还定义了一个devicemotion事件。
这个事件是要告诉开发人员设备什么时候移动，而不仅仅是设备方向如何改变。

例如，通过devicemotion能够检测到设备是不是正在往下掉，或者是不是被走着的人拿在手里。

触发devicemotion事件，事件对象包含以下属性。

- acceleration: 一个包含x、y和z属性的对象，在不考虑重力的情况下，告诉你在每个方向上的加速度。
- accelerationIncludingGravity: 一个包含x、y和z属性的对象，在考虑z轴自然重力加速度的情况下，告诉你在每个方向上的加速度。
- interval: 以毫秒表示的时间值，必须在另一个devicemotion事件触发前传入。这个值在每个事件中应该是一个常量。

- rotationRate: 一个包含表示方向的alpha、beta和gamma属性的对象。

如果读取不到acceleration、accelerationIncludingGravity和rotationRate值，则它们的值为null。 因此，在使用这三个属性之前，应该先检测它们的值不是null。

```
EventUtil.addHandler(window, "devicemotion", function(event){
    var output = document.getElementById("output");
    if (event.rotationRate !== null) {
        output.innerHTML += "Alpha" + event.rotationRate.alpha + ", Beta=" + event.rotationRate.beta + ", Gamma=" + event.rotationRate.gamma;
    }
});
```

与deviceorientation事件类似，只有iOS 4.2+的Safari、Chrome和Android版WebKit实现了devicemotion事件。

## 触摸与手势事件

iOS 版 Safari 为了向开发人员传达一些特殊信息，新增一些专有事件。

因为iOS设备既没有鼠标也没有键盘，所以在为移动Safari开发交互性网页时，常规的鼠标和键盘事件根本不够用。随着Android中的WebKit的加入，很多这样的专有事件变成了事实标准，导致W3C开始制定Touch Events规范。

1. 触摸事件

包含 iOS 2.0 软件的iPhone 3G发布时，也包含了一个新版本的Safari浏览器。
这款新的移动Safari提供了一些与触摸(touch)操作相关的新事件。
后来，Android上的浏览器也实现了相同的事件。
触摸事件会在用户手指放在屏幕上面时、在屏幕上滑动时或从屏幕上移开时触发。

具体来说，有以下几个触摸事件。

- touchstart: 当手指触摸屏幕时触发；即使已经有一个手指放在了屏幕上也会触发 。

- touchmove：当手指在屏幕上滑动时连续地触发。在这个事件发生期间，调用preventDefault()可以阻止滚动。

- touchend：当手指从屏幕上移开时触发。

- touchcancel: 当系统停止跟踪触摸时触发。关于此事件的确切触发事件，文档中没有明确说明。

上面这几个事件都会冒泡，也都可以取消。虽然这些触摸事件没有在DOM规范中定义，但它们却是以兼容DOM的方式实现的。

因此，每个触摸事件的event对象都提供了在鼠标事件中常见的属性：
bubbles、cancelable、view、clientX、clientY、screenX、screenY、detail、altKey、shiftKey、ctrlKey和metaKey。

除了常见的DOM属性外，触摸事件还包含下列三个和用户跟踪触摸的属性。

- touches: 表示当前跟踪的触摸操作的Touch对象的数组。
- targetTouches: 特定于事件目标的Touch对象的数组。
- changeTouches: 表示自上次触发已来发生了什么改变的Touch对象的数组。

每个Touch对象包含下列属性。

- clientX: 触摸目标在视口中的x坐标。

- clientY: 触摸目标在视口中的y坐标。

- identifier: 标识触摸的唯一ID。

- pageX: 触摸目标在页面中的x坐标。

- pageY: 触摸目标在页面中的y坐标。

- screenX: 触摸目标在屏幕中的x坐标。
  
- screenY: 触摸目标在屏幕中的y坐标。

- target: 触摸的DOM节点目标。

使用这些属性可以跟踪用户对屏幕的触摸操作。

```
function handleTouchEvent(event) {
    //只跟踪一次触摸
    if(event.touches.length === 1) {
        var output = document.getElementById("output");
        switch(event.type) {
            case "touchstart":
            output.innerHTML = "Touch started (" + event.touches[0].clientX + "," + event.touches[0].clentY + ")";
            break;

            case "touchend":
            output.innerHTML = "<br>Touch ended (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")";
            break;

            case "touchmove":
            event.preventDefault(); //阻止滚动
            output.innerHTML += "<br>Touch moved (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")";
            break;
        }
    }
}

EventUtil.addHandler(document, "touchstart", handlerTouchEvent);
EventUtil.addHandler(document, "touchend", handlerTouchEvent);
EventUtil.addHandler(document, "touchmove", handlerTouchEvent);

```

以上代码会跟踪屏幕上发生的一次触摸操作。
为简单起见，只会在有一次活动触摸操作的情况下输出信息。
当touchstart事件发生时，会将触摸的位置信息输入到\<div>元素中。
当touchmove事件发生时，会取消其默认行为，阻止滚动（触摸移动的默认行为是滚动页面），然后输出触摸操作的变化信息。而touchend事件则会输出有关触摸操作的最终信息。注意，在touchend事件发生时，touches集合中就没有任何Touch对象了，因为不存在活动的触摸操作；此时，就必须转而使用changeTouches集合。

这些事件会在文档的所有元素上面触发，因而可以分别操作页面的不同部分。

在触摸屏幕上的元素时，这些事件（包括鼠标事件）发生的顺序如下：

1. touchstart
2. mouseover
3. mousemove
4. mousedown
5. mouseup
6. click
7. touchend

支持触摸事件的浏览器包括iOS版Safari、Android版WebKit、bada版Dolfin、OS6+中的BlackBerry WebKit、Opera Mobile 10.1+ 和 LG专有OS中Phantom浏览器。 

目前只有iOS版Safari支持多点触摸。
桌面版Firefox 6+和Chrome也支持触摸事件。

2. 手势事件

iOS 2.0中的Safari还引入了一组手势事件。
当两个手指触摸屏幕时就会产生手势，手势通常会改变显示项的大小，或者旋转显示项。有三个手势事件，分别介绍如下。

- gesturestart: 当一个手指已经按在屏幕上而另一个手指又触摸屏幕时触发。

- gesturechange: 当触摸屏幕的任何一个手指的位置发生变化时触发。

- gestureend: 当任何一个手指从屏幕上面移开时触发。

只有两个手指都触摸到事件的接收容器时才会触发这些事件。
在一个元素上设置事件处理程序，意味着两个手指必须同时位于该元素的范围之内，才能发出手势事件（这个元素就是目标）。由于这些事件冒泡，所以将事件处理程序放在文档上也可以处理所有手势事件。此时，事件的目标就是两个手指都位于其范围内的那个元素。

触摸事件和手势事件之间存在某种关系。
当一个手指放在屏幕上时，就会触发touchstart事件。
如果另一个手指又放在屏幕上，则会触发gesturestart事件，随后触发基于该手指的touchstart事件。如果一个或两个手指在屏幕上活动，将会触发gesturechange事件。但只要有一个手指移开，就会触发gestureend事件，紧接着又会触发基于该手指的touchend事件。

与触摸事件一样，每个手势事件的event对象都包含这标准的鼠标事件属性：

bubbles、cancelable、view、clientX、clientY、screenX、screenY、detail、altKey、shiftKey、ctrlKey和metaKey。

此外，还包含两个额外的属性： rotation和scale。

其中，rotation属性表示手指变化引起的旋转角度，负值表示逆时针旋转，正值表示顺时针旋转（该值从0开始）。

而scale属性表示两个手指间距离的变化情况(例如向内收缩会缩短距离)；
这个值从1开始，并随距离拉大而增长，随距离缩短而减小。

下面是使用手势事件的一个示例。

```
function handleGestureEvent(event) {
    var output = document.getElementById("output");
    switch(event.type){
        case: "gesturestart" : .... ;
        break;

        case "gestureend":
        ...;
        break;

        case "gesturechange":
        ...;
        break;
    }
}

document.addEventListener("gesturestart", handleGestureEvent, false);

document.addEventListener("gestureend", handleGestureEvent, false);

document.addEventListener("gesturechange", handleGestureEvent, false);
```

与前面延时触摸事件的例子一样，这里的代码只是将每个事件都关联到同一个函数中，然后通过该函数输出每个事件的相关信息。

**触摸事件也会返回rotation和scale属性，这两个属性都只会在两个手指与屏幕保持接触时才会发生变化。一般来说，使用基于两个手指的手势事件，要比管理触摸事件中的所有交互要容易得多。**