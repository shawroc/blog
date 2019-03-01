# JS_ES5_Event - 8

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 内存和性能

由于事件处理程序可以为现代Web应用程序提供交互能力，因此许多开发人员会不分青红皂白地向页面添加大量的处理程序。在创建GUI的语言（如C#）中，为GUI中的每个按钮添加一个onclick事件是司空见惯的事，而且这样做也不会导致什么问题。

可是在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能。导致这一问题的原因是多方面的。

首先，每个函数都是对象，都会占用内存。内存中的对象越多，性能就越差。

其次，必须实现指定所有事件处理程序而导致的DOM访问次数，会延迟整个页面的交互就绪事件。

事实上，从如何利用好事件处理程序的角度出发，还是有一些方法能够提升性能的。

### 事件委托

对“事件处理程序过多”问题的解决方案就是事件委托。

事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。

例如，click事件会一直冒泡到document层次。

也就是说，我们可以为整个页面指定一个onclick事件程序，而不必给每个可单击的元素分别添加事件处理程序。

一下面的HTML代码为例。

```
<ul id="myLinks">
    <li id="goSomeWhere">Go Somewhere</li>
    <li id="doSomething">Do Something</li>
    <li id="sayHi">Say hi</li>
</ul>
```

其中包含3个被点击后执行操作的列表项。
按照传统的做法，需要像下面这样为它们添加3个事件处理程序。

```
var item1 = document.getElementById("goSomeWhere");
var item2 = document.getElementById("doSomething");
var item3 = document.getElementById("sayHi");

EventUtil.addHandler(item1, "click", function(event){
    location.href = "http://www.worx.com";
});

EventUtil.addHandler(item2, "click", function(event) {
    document.title = "I changed the document's title";
});

EventUtil.addHandler(item3, "click", function(event) {
    alert("hi");
});

```

如果在一个复杂的Web应用程序中，对所有可点击的元素都采用这种方式，那么结果就会有数不清的代码用于添加事件处理程序。此时，可以利用事件委托技术解决这个问题。使用事件委托，只需在DOM树中尽量最高的层次上添加一个事件处理程序，如下面例子所示。

```
var list =  document.getElementById("myLinks");

EventUtil.addHandler(list, "click", function(event){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);

    switch(target.id) {
        case "doSomething":
            document.title = "I changed the document's title";
            break;
        
        case "goSomewhere":
            location.href = "http://www.worx.com";
            break;
        
        case "sayHi":
            alert("hi");
            break;
    }
});
```

在这段代码里，我们使用事件委托只为\<ul>元素添加了一个onclick事件处理程序。
由于所有列表项都是这个元素的子节点，而且它们的事件会冒泡，所以单击事件最终会被这个函数处理。

我们知道，事件目标是被点击的列表项，故而可以通过检测id属性来决定采取适当的操作。
与前面未使用事件委托的代码比一比，会噶西安这段代码的事前消耗更低，因为只取得了一个DOM元素，只添加了一个事件处理程序。

虽然对用户来说最终的结果相同，但这种技术需要占用的呢村更少。

所有用到按钮的时间（多数鼠标事件和键盘事件）都适合采用事件委托技术。

如果可行的话，也可以考虑为document对象添加一个事件处理程序，用以处理页面上发生的某种特定类型的事件。

这样做与采取传统的做法相比具有如下优点。

- document对象很快就可以访问，而且可以在页面生命周期的任何时间点上为它添加事件处理程序（无需等待DOMContentLoaded或load事件）。**换句话说，只要可单击的元素呈现在页面上，就可以立即具备适当的功能。**

- 在页面中设置事件处理程序所需的时间更少。只添加一个事件处理程序所需的DOM引用更少，所花的时间也更少。

- 整个页面占用的内存空间更少，能够提升整体性能。

**最适合采用事件委托技术的事件包括click、mousedown、mouseup、keydown、keyup和keypress。**

虽然mouseover 和 mouseout 事件也冒泡，但要适当处理它们并不容易，而且经常需要计算元素的位置。（因此当鼠标从一个元素移到其他子节点时，或者当鼠标移出该元素时，都会触发mouseout事件。）。

## 移出事件处理程序

每当将事件处理程序指定给元素时，运行中的浏览器代码与支持页面交互的JavaScript代码之间就会建立一个连接。

这种连接越多，页面执行起来就越慢。

如前所示，可以采用事件委托技术，限制建立的连接数量。
另外，在不需要的时候移除事件处理程序，也是解决这个问题的一种方案。
内存中留有那些过时不用的"空事件处理程序”（dangling event handler)，也是造成Web应用程序内存与性能问题的主要原因。

在两种情况下，可能会造成上述问题。

第一种情况就是从文档中移除带有事件处理程序的元素时。
可能是通过纯粹的DOM操作，例如使用removeChild()和replaceChild()方法，但更多地是发生在使用innerHTML替换页面中某一部分的时候。
如果带有事件处理程序的元素被innerHTML 删除了，那么原来添加到元素中的事件处理程序极有可能无法被当做垃圾回收。

```
<div id="myDiv">
    <input type="button" value="Click Me" id="myBtn">
</div>
<script type="text/javascript">
    var btn = document.getElementById("myBtn");
    btn.onclick = function() {
        //do something
        document.getElementById("myDiv").innerHTML = "Processing..."; //麻烦了
    };
</script>
```

这里，有一个按钮被包含在\<div>元素中。
为避免双击，单击这个按钮时就将按钮移除 并替换成一条消息；
这是网站设计中非常流行的一种做法。

但问题在于，当按钮被从页面中移除时，它还海蜇一个事件处理程序呢。
在\<div>元素上设置innerHTML 可以把按钮移走，但事件处理程序仍然与按钮保持着引用关系。

有的浏览器（尤其是IE）在这种情况下不会做出恰当地处理，它们很有可能会将对元素和对事件处理程序的引用都保存在内存中。

如果你知道某个元素即将被移除，那么最好手工移除事件处理程序。

如下所示：

```
<div id="myDiv">
    <input type="button"  value="Click Me" id="myBtn">
</div>
<script type="text/javascript">
    var btn = document.getElementById("myBtn");
    btn.onclick = function(){
        //先执行某些操作
        btn.onclick = null; //移除事件处理程序

        document.getElementById("myDiv").innerHTML = "Processing..";
    };
</script>
```

在此，我们在设置\<div>的innerHTML 属性之前，先移除了按钮的时间处理程序。这样做就确保了内存可以被再次利用，而从DOM中移除按钮也做到了干净利索。

**注意，在事件处理程序中删除按钮也能阻止事件冒泡。**目标元素在文档中是事件冒泡的前提。

采用事件委托也有助于解决这个问题。如果事件知道将来有可能使用innerHTML替换掉页面中的某一部分，那么就可以不直接把事件处理程序添加到该部分的元素中。而通过把事件处理程序指定给较高层次的元素，同样能够处理区域中的事件。

导致“空事件处理程序”的另一种情况，就是卸载页面的时候。
毫不奇怪，IE8及更早版本在这种情况下依然是问题最多的浏览器，尽管其他浏览器或多或少也有类似的问题。

如果在页面被卸载之前没有清理干净事件处理程序，那它们就会滞留在内存中。
每次加载完页面再卸载页面时（可能是在两个网页间来回切换，也可以是点击了“刷新”按钮），内存中滞留的对象数目就会增加，因此事件处理程序占用的内存并没有被释放。

一般来说，最好的做法是在页面卸载之前，先通过onunload事件处理程序移除所有事件处理程序。

在此，事件委托技术再次表现出它的优势——需要跟踪的事件处理程序越少，移除它们就越容易。对这种类似撤销的操作，我们可以把它想象成：只要是通过onload事件处理程序添加的东西，最后都要通过onunload事件处理程序将它们移除。

**不要忘了，使用onunload事件处理程序意味着页面不会再bfcache中。如果你在以这个问题，那么就只能在IE中通过onunload来移除事件处理程序了。**

## 模拟事件

事件，就是网页中某个特别值得关注的瞬间。

事件经常由用户操作或通过其他浏览器功能来触发。

但很少有人知道，也可以使用JavaScript在任意时刻来触发特定的时间，而此时的事件就如同浏览器创建的事件一样。

也就是说，这些事件该冒泡还会冒泡，而且照样能够导致浏览器执行已经制定的处理它们的事件处理程序。

**在测试Web应用程序，模拟触发事件是一种极其有用的技术。DOM2级规范为此规定了模拟特定事件的方式， IE9、Opera、Firefox、Chrome和Safari 都支持这种方式。**

### DOM中的事件模拟

可以在document对象上使用createEvent()方法创建event对象。这个方法接收一个参数，即表示要创建的事件类型的字符串。

在DOM2级中，所有这些字符串都使用英文复数形式，而在DOM3级中都变成了单数。

这个字符串可以是下列几个字符串之一。

- UIEvents: 一般化的UI事件。鼠标事件和键盘事件都继承自UI事件。DOM3级中是UIEvent。
- MouseEvents: 一般化的鼠标事件。DOM3级中是MouseEvent。
- MutationEvents: 一般化的DOM变动事件。DOM3级中是MutationEvent。
- HTMLEvents: 一般化的HTML事件，没有对应的DOM3级事件（HTML事件被分散到其他类型中）。

要注意的是，“DOM2级事件”并没有专门规定键盘事件，后来的“DOM3级事件”中才正式将其作为一种事件给出规定。

在创建了event对象之后，还需要使用与事件有关的信息对其初始化。每种类型的event对象都有一个特殊的方法，为它传入适当的数据就可以初始化该event对象。不同类型的这个方法的名字也不相同，具体要取决于createEvent()中使用的参数。

模拟事件的最后一步就是触发事件。这一步需要使用dispatchEvent()方法，所有支持事件的DOM节点都支持这个方法。调用dispatchEvent()方法时，需要传入一个参数，即表示要触发事件的event对象。触发事件之后，该事件就跻身“官方事件”之列了，因而能够照样冒泡并引发相应事件处理程序的执行。

1. 模拟鼠标事件

创建新的鼠标事件对象并为其指定必要的信息，就可以模拟鼠标事件。
创建鼠标对象的方法是为createEvent()传入字符串"MouseEvents"。
返回的对象有一个名为 initMouseEvent()方法，用于指定与该鼠标事件有关的信息。

这个方法接收15个参数，分别与鼠标事件中每个典型的属性一一对应，这些参数的含义如下：

- type（字符串）：表示要触发的事件类型，例如"click"。

- bubbles(布尔值)：表示事件是否应该冒泡。为精确地模拟鼠标事件，应该把这个参数设置为true。

- cancelable(布尔值)：表示事件是否可以取消。为精确地模拟鼠标事件，应该把这个参数设置为true。

- view（AbstractView)：与事件关联的视图。这个参数几乎总是要设置为document.defaultView。

- detail（整数）：与事件有关的详细信息。这个值一般只有事件处理程序使用，但通常设置为0。

- screenX(整数)：事件相对于屏幕的X坐标。

- screenY(整数)：事件相对于屏幕的Y坐标。

- clientX(整数)：事件相对于视口的X坐标。

- clientY(整数)：事件相对于视口的Y坐标。

- ctrlKey(布尔值)： 表示是否按下了Ctrl。默认值为false。

- altKey(布尔值)： 表示是否按下了Alt。默认值为false。

- shiftKey(布尔值)： 表示是否按下了Shift。默认值为false。

- metaKey(布尔值)： 表示是否按下了Meta。默认值为false。

- button（整数）：表示按下了哪一个鼠标键。默认值为0。

- relatedTarget(对象)：表示与事件相关的对象。这个参数只在模拟mouseover或mouseout时使用。

显而易见，initMouseEvent()方法的这些参数是与鼠标事件的event对象所包含的属性一一对应的。其中，前4个参数对正确地激发事件至关重要，因为几乎所有浏览器都要用到这些参数；而剩下的所有参数只有在事件处理程序中才会用到。当把event对象传给dispatchEvent()方法时，这个对象的target属性会自动设置。下面，我们就通过一个例子来理解如果模拟对按钮的单击事件。

```
var btn = document.getElementById("myBtn");

//创建事件对象
var evnt = document.createEvent("MouseEvents");

//初始化事件对象
event.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

//触发事件
btn.dispatchEvent(event);
```

在兼容DOM的浏览器中，也可以通过相同的方式来模拟其他鼠标事件（例如dbclick）。

2. 模拟键盘事件

前面曾经提到过，"DOM2级事件" 中没有就键盘事件作出规定，因此模拟键盘事件并没有现成的思路可循。

“DOM2级事件”的草案中本来包含了键盘事件，但在定稿之前又被删除了；

Firefox根据其草案实现了键盘事件。

需要注意的是，“DOM3级事件”中的键盘事件与曾包含在“DOM2级事件”草案中的键盘事件有很大的区别。

DOM3级规定，调用createEvent()并传入"KeyboardEvent"就可以创建一个键盘事件。返回的事件对象会包含一个initKeyEvent()方法，这个方法接收下列参数。

- type(字符串)：表示要触发的事件类型，如“keydown”。
- bubbles（布尔值）：表示事件是否应该冒泡。为精确模拟鼠标事件，应该设置为true。
- cancelable（布尔值）：表示事件是否可以取消。为精确模拟鼠标事件，应该设置为true。
- view（AbstractView）：与事件关联的视图。这个参数几乎总是要设置为document.defaultView。
- key(布尔值)：表示按下的键的键码。
- location（整数）：表示按下了哪里的键。0表示默认的主键盘，1表示左，2表示由，3表示数字键盘，4表示移动设备（即虚拟键盘），5表示手柄。
- modifier（字符串）： 空格分隔的修改键列表，如"Shift"。
- repeat(整数)：在一行中按了这个键多少次。

由于DOM3级不提倡使用keypress事件，因此只能利用这种技术来模拟keydown和keyup事件。

```
var textbox = document.getElementById("myTextbox");

//以DOM3级方式创建事件对象
if(document.implementation.hasFeature("KeyboardEvents", "3.0")) {
    event = document.createEvent("KeyboardEvent");

    //初始化事件对象
    event.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
}

textbox.dispatchEvent(event);
```

这个例子模拟的是按住shift的同时又按下了A键。
在使用document.createEvent("KeyboardEvent")之前，应该先检测刘安琪是否支持DOM3级事件；

3. 模拟其他事件

虽然鼠标事件和键盘事件是在浏览器中最经常模拟的时间，但有时候同样需要模拟变动事件和HTML事件。要模拟变动事件，可以使用 createEvent("MutationEvents")创建一个包含initMutationEvent()方法的变动事件对象。这个方法接受的参数包括：type、bubbles、cancelable、relateNode、preValue、newValue、attrName和 attrChange。

下面来看一个模拟变动事件的例子。

```
var event = document.createEvent("MutationEvents");
event.initMutationEvent("DOMNodeInserted", true, false, someNode, "", "", 0);
target.dispatchEvent(event);
```

以上代码模拟了DOMNodeInserted事件。
其他变动事件也都可以照这个样子来模拟，只要改一改参数就可以了。

要模拟HTML事件，同样需要先创建一个event对象——通过createEvent("HTMLEvents")，然后再使用这个对象的initEvent()方法来初始化它即可，如下面的例子所示。

```
var event = document.createEvent("HTMLEvents");
event.initEvent("focus", true, false);
target.dispatchEvent(event);
```

这个例子展示了如何在给定目标上模拟focus事件。模拟其他HTML事件的方法也是这样。

**浏览器中很少使用变动事件和HTML事件，因为使用它们会受到一些限制。**

4. 自定义DOM事件

DOM3级还定义了“自定义事件”。自定义事件不是由DOM原生触发的，它的目的是让开发人员创建自己的事件。

要创建新的自定义事件，可以调用createEvent("CustomEvent")。返回的对象有一个名为initCustomEvent()的方法。

接收如下4个参数。

- type（字符串）： 触发的事件类型，例如“keydown”。
- bubbles（布尔值）：表示事件是否应该冒泡。
- cancelable（布尔值）：表示事件是否可以取消。
- detail（对象）：任意值，保存在event对象的detail属性中。

可以像分派其他事件一样在DOM中分派创建的自定义事件对象。

```
var div = document.getElementById("myDiv"),
    event;

EventUtil.addHandler(div, "myevent", function(event){
    console.log("DIV: " + event.detail);
});

EventUtil.addHandler(document, "myevent", function(event) {
    console.log("DOCUMENT" + event.detail);
});

if(document.implementation.hasFeature("CustomEvents", "3.0")){
    event = document.createEvent("CustomEvent");
    event.initCustomEvent("myevent", true, false, "Hello World!");
    div.dispatchEvent(event);
}
```

这个例子创建了一个冒泡事件"myevent"。
而event.detail的值被设置成了一个简单的字符串，然后在\<div>元素和document上侦听这个事件。因为initCustomEvent()方法已经指定这个事件应该冒泡，所以浏览器会负责将事件向上冒泡到document。

支持自定义DOM事件的浏览器有IE 9+ 和 Firefox 6+。

## IE中的事件模拟

在IE8及之前版本中模拟事件与在DOM中模拟事件的思路相似：先创建event对象，然后为其指定相应的信息，然后再使用该对象来触发事件。当然，IE在实现每个步骤时都采用了不一样的方式。

调用document.createEventObject()方法可以在IE中创建event对象。但与DOM方式不同的是，这个方法不接受参数，结果会返回一个通用的event对象。

然后，你必须手工为这个对象添加所有必要的信息（没有方法来辅助完成这一步骤）。

最后一步就是在目标上调用fireEvent()方法，这个方法接受两个函数：事件处理程序的名称和event对象。

在调用fireEvent()方法时，会自动为event对象添加srcElement 和 type属性；
其他属性则都是必须通过手工添加的。
换句话说，模拟任何IE支持的时间都采用相同的模式。

例如，下面的代码模拟了在一个按钮上触发click事件过程。

```
var btn = document.getElementById("myBtn");

//创建事件对象
var event = document.createEventObject();

//初始化事件对象
event.screenX = 100;
event.screenY = 0;
event.clientX = 0;
event.clientY = 0;
event.ctrlKey = false;
event.altKey = false;
event.shiftKey = false;
event.button = 0;

//触发事件
btn.fireEvent("onclick", event);
```

这个例子先创建了一个event对象，然后又用一些信息对其进行了初始化。
注意，这里可以为对象随意添加属性，不会有任何限制——即使添加的属性IE8及更早版本并不支持也无所谓。在此添加的属性对事件没有什么影响，因为只有事件处理程序才会用到它们。

采用相同的模式也可以模拟触发keypress事件，如下面的例子所示。

```
var textbox = document.getElementById("myTextbox");

//创建事件对象
var event = document.createEventObject();

//初始化事件对象
event.altKey = false;
event.ctrlKey = false;
event.shiftKey =  false;
event.keyCode = 65;

//触发事件

textbox.fireEvent("onkeypress", event);
```

由于鼠标事件、键盘事件以及其他事件的event对象并没有什么不同，所以可以使用通用对象来触发任何类型的事件。

不过，正如在DOM中模拟键盘事件一样，运行这个例子也不会因模拟了keypress而在文本框中看到任何字符，即使触发了事件处理程序也没有用。

## 小结

事件是将JavaScript与网页联系在一起的主要方式。
“DOM3级事件”规范和HTML5定义了常见的大多数事件。
即使有规范定义了基本事件，但很多浏览器仍然在规范之外实现了自己的专有事件，从而为开发人员提供更多掌握用户交互的手段。
有些专有事件与特定设备关联，例如移动Safari中的orientationchange事件就是特定关联iOS设备的。

在使用事件时，需要考虑如下一些内存与性能方面的问题。

- 有必要限制一个页面中事件处理程序的数量，数量太多会导致占用大量内存，而且也会让用户感觉页面反应不够灵敏。
- 建立在事件冒泡机制之上的事件委托技术，可以有效地减少事件处理程序的数量。
- 建议在浏览器卸载页面之前移除页面中的所有事件处理程序。

可以使用JavaScript在浏览器中模拟事件。
“DOM2级事件”和“DOM3级事件”规范规定了模拟事件的方法，为模拟各种有定义的事件提供了方便。此外，通过组合使用一些技术，还可以在某种程度上模拟键盘事件。IE8及之前版本同样支持事件模拟，只不过模拟的过程有些差异。

事件是JavaScript中最重要的主题之一，深入理解事件的工作机制以及它们对性能的影响至关重要。