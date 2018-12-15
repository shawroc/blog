# JS_ES5_Event - 5

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 键盘与文本事件

用户在使用键盘时会触发键盘事件。
“DOM2级事件”最初规定了键盘事件，但在最终定稿之前又删除了相应的内容。结果，对键盘事件的支持主要遵循的是DOM0级。

“DOM3级事件”为键盘事件制定了规范，IE9率先完成时限了该规范。其他浏览器也在着手实现这一标准，但仍然有很多遗留的问题。

有3个键盘事件，简述如下。

- keydown：当用户按下键盘上的任意键时触发，而且如果按住不放的话，会重复触发此事件。
- keypress: 当用户按下键盘上的字符键时触发，而且如果按住不放的话，会重复触发此事件。按下Esc键也会触发这个事件。Safari 3.1之前的版本也会在用户按下非字符键时触发keypress事件。

- keyup：当用户释放键盘上的键时触发。

虽然所有元素都支持以上3个事件，但只有在用户通过文本框输入文本时才最常用到。

只有一个文本事件：textInput。这个事件是对keypress的补充，用意是在将文本显示给用户之前更容易拦截文本。在文本插入文本框之前会触发textInput事件。

在用户按了一下键盘上的字符键时，首先会触发keydown事件，然后紧跟着是keypress事件，最后会触发keyup事件。其中，keydown和 keypress 都是在文本框发生变化之前被触发的。而key
up事件则是在文本框已经发生变化之后被触发的。如果用户按下了一个字符键不放，就会重复keydown和keypress事件，直到用户松开该键为止。

如果用户按下的是一个非字符键，那么首先会触发keydown事件，然后就是keyup事件。
如果按住这个非字符键不放，那么就会一直重复触发keydown事件，直到用户松开这个键，此时会触发keyup事件。

### 键码

在发生keydown 和 keyup 事件时，event 对象的 keyCode 属性中会包含有一个代码，与键盘上一个特定的键对应。 对数字字母字符键，keyCode 属性的值与 ASCII码中对应小写字母或数字的编码相同。因此，数字键7的keyCode值为55，而字母A键的keyCode值为65——与Shift键的状态无关。DOM和IE的event对象都支持keyCode属性。

```
var textbox = document.getElementById("myText");
EventUtil.addHandler(textbox, "keyup", function(event) {
    event = EventUtil.getEvent(event);
    console.log(event.keyCode);
});
```

在这个例子中，用户每次在文本框中按键触发keyup事件时，都会显示keyCode的值。

下表列出了所有非字符键的键码。

|键|键码|
|:-:|:-:|
|退格(Backspace)|8|
|制表（Tab）|9|
|回车（Enter）|13|
|上档（Shift）|16|
|控制（Ctrl）|17|
|Alt|18|
|暂停/中断（Pause/Break）|19|
|大写锁定(Caps Lock)|20|
|退出（Esc）|27|
|上翻页（Page Up）|33|
|下翻页（Page Down）|34|
|结尾 （End）|35|
|开头（Home）|36|
|左箭头（Left Arrow)| 37|
|上箭头(Up Arrow)| 38|
|右箭头（Right Arrow）| 39|
|下箭头（Down Arrow）|40|
|插入(Ins)|45|
|删除（Del）|46|
|左Windows键|91|
|右Windows键|92|
|上下文菜单键|93|
|数字小键盘0|96|
|数字小键盘1|97|
|数字小键盘2|98|
|数字小键盘3|99|
|数字小键盘4|100|
|数字小键盘5|101|
|数字小键盘6|102|
|数字小键盘7|103|
|数字小键盘8|104|
|数字小键盘9|105|
|数字小键盘+|107|
|数字小键盘及大键盘上的-|109|
|数字小键盘.|110|
|数字小键盘/|111|
|F1|112|
|F2|113|
|F3|114|
|F4|115|
|F5|116|
|F6|117|
|F7|118|
|F8|119|
|F9|120|
|F10|121|
|F11|122|
|F12|123|
|数字锁（Num Lock）|144|
|滚动锁（Scroll Lock) | 145|
|分号（IE/Safari/Chrome中）|186|
|分号（Opera/FF中）|59|
|小于|188|
|大于|190|
|正斜杠|191|
|沉音符（`）| 192|
|等于| 187|
|左方括号|219|
|反斜杠（\\）|220|
|右方括号|221|
|单引号|222|

### 字符编码

发生keypress 事件意味着按下的键会影响到屏幕中文本的显示。
在所有浏览器中，按下能够插入或删除字符的键都会出发keypress事件；按下其他键能否触发此事件因浏览器而异。由于截止到2008年，尚无浏览器实现“DOM3级事件”规范，所以浏览器之间的键盘事件并没有多大的差异。

IE9、Firefox、Chrome和Safari的 event 对象都支持一个 charCode属性，这个属性只有在发生keypress事件时才会包含值，而且这个值是按下的那个键所代表的字符的ASCII编码。此时的keyCode通常等于0或者也可能等于所按键的键码。IE8及之前版本和Opera则是在keyCode
中保存字符的ASCII编码。要想以跨浏览器的方式取得字符编码，必须首先检测charCode属性是否可用，如果不可用则使用keyCode。

```
var EventUtil = {
    //省略的代码
    getCharCode: function(event) {
        if(typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },
    //省略的代码
}
```

这个方法首先检测charCode属性是否包含数值（在不支持这个属性的浏览器中，只为undefined)，如果是，则返回该值。否则，就返回keyCode属性值。

```
var textbox = document.getElementById("myText");
EventUtil.addHandler(textbox, "keypress", function(event) {
    event = EventUtil.getEvent(event);
    console.log(EventUtil.getCharCode(event));
});
```

在取得了字符编码之后，就可以使用String.fromCharCode()将其转换成实际的字符串。

### DOM3级变化

尽管所有浏览器都实现了某种形式的键盘事件，DOM3级事件还是做出了一些改变。比如，DOM3级事件中的键盘事件，不再包含charCode属性，而是包含两个新属性：key和char。

其中，key属性是为了取代keyCode新增的，它的值是一个字符串。
在按下某个字符键时，key的值就是相应的文本字符(如“k”或“M”);
在按下非字符键时，key的值是相应键的名（如“Shift”或“Down”）。
而char属性在按下字符键时的行为与key相同，但在按下非字符键时值为null。

IE9支持key属性，但不支持char属性。Safari 5和 Chrome 支持名为keyIdentifier的属性，在按下非字符键（例如Shift）的情况下与key的值相同。对于字符键，keyIdentifier 返回一个格式类似“U+0000”的字符串，表示Unicode值。

```
var textbox = document.getElementById("myText");
EventUtil.addHandler(textBox, "keypress", function(event){
    event = EventUtil.getEvent(event);
    var identifier = event.key || event.keyIdentifier;
    if(identifier) {
        console.log(identifier);
    };
})
```

由于存在跨浏览器问题，因此本书不推荐使用key、keyIdentifier 或 char。

DOM3级事件还添加了一个名为location的属性，这是一个数值， 表示按下了什么位置上的键：

0 表示默认键盘，
1 表示左侧位置（例如左位的Alt键），
2 表示右侧位置（例如右侧的Shift键），
3 表示数字小键盘，
4 表示移动设备键盘（也就是虚拟键盘），
5 表示手柄（如任天堂Wii控制器）。

IE9 支持这个属性。Safari 和 Chrome 支持名为 keyLocation的等价属性，但有bug——值始终是0，除非按下了数字键盘（此时，值为3）；否则，不会是1、2、4、5。

```
var textbox = document.getElementById("myText");
EventUtil.addHandler(textbox, "keypress", function(event){
    event = EventUtil.getEvent(event);
    var loc = event.location || event.keyLocation
    if(loc) {
        alert(loc);
    };
});
```

与key属性一样，支持location的浏览器也不多，所以在跨浏览器开发中不推荐使用。

最后是给event对象添加了getModifierState()方法。
这个方法接收一个参数，即等于Shift、Control、AltGraph或 Meta的字符串，表示还要检测的修改键。
如果指定的修改键是活动的（也就是处于被按下的状态），这个方法返回true，否则返回false。

```
var textbox = document.getElementById("myText");
EventUtil.addHandler(textbox, "keypress", function(event) {
    event = EventUtil.getEvent(event);
    if(event.getModifierState) {
        console.log(event.getModifierState("Shift")); // true or false
    }
});
```

实际上，通过event对象的shifeKey、altKey、ctrlKey 和 metaKey 属性已经取得类似的属性了。
IE9是唯一支持getModifierState()方法的浏览器。

### textInput事件

“DOM3级事件”规范中引入了一个新事件，名叫textInput。
根据规范，当用户在可编辑区域中输入字符时，就会触发这个事件。

这个用于替代keypress的textInput事件的行为稍有不同。
区别之一就是任何可以获得焦点的元素都可以触发keypress事件，但只有可编辑区域才能触发textInput事件。

区别之二是textInput事件只会在用户按下能够输入实际字符的键时才会被触发，而keypress事件则在按下那些能够影响文本显示的键时也会触发（例如退格键）。

由于textInput 事件主要考虑的是字符，因此它的event对象中还包含一个data属性，这个属性的值就是用户输入的字符（而非字符编码）。
换句话说，用户在没有按上档键的情况下按下了S键，data的值就是“s”。
而如果在按上上档键时按下该键，data的值就是“S”。

以下是一个使用textInput 事件的例子：

```
var textbox = document.getElementById("myText");
EventUtil.addHandler(Textbox, "textInput", function(event){
    event = EventUtil.getEvent(event);
    console.log(event.data);
});
```

在这个例子中，插入到文本框中的字符会通过一个警告框显示出来。

另外，event对象上还有一个属性，叫inputMethod，表示把文本输入到文本框中的方式。

- 0，表示浏览器不确定是怎么输入的。
- 1，表示是使用键盘输入的。
- 2，表示文本是粘贴进来的。
- 3，表示文本是拖放进来的。
- 4，表示文本是使用IME输入的。
- 5，表示文本时通过在表单中选择某一项输入的。
- 6，表示文本是通过手写输入的（比如使用手写笔）。
- 7，表示文本时通过语音输入的。
- 8，表示文本时通过几种方法组合输入的。
- 9，表示文本是通过脚本输入的。

使用这个属性可以确认文本是如何输入到控件中的，从而可以验证其有效性。支持textInput属性的浏览器有IE9+、Safari 和 Chrome。只有IE支持inputMethod属性。

### 设备中的键盘事件

任天堂Wii会在用户按下Wii遥控器上的按键时触发键盘事件。
尽管没有办法访问Wii遥控器中的所有按键，但还是有一些键可以触发键盘事件。

当用户按下十字键盘（键码为175-178）、减号（170）、加号（174）、1（172）或2（173）按键时就会触发键盘事件。但没有办法得知用户是否按下了电源开关、A、B或主页键。

iOS版Safari和Android版WebKit在使用屏幕键盘时会触发键盘事件。

### 复合事件

复合事件（composition event）是DOM3级事件中新添加的一类事件，用于处理IME的输入序列。
IME（Input Method Editor，输入法编辑器）可以让用户输入在物理键盘上找不到的字符。

例如，使用拉丁文键盘的用户通过IME照样能输入日文字符。ME通常需要同时按住多个键，但最终只输入一个字符。复合事件就是针对检测和处理这种输入而设计的。

有以下三种复合事件。

- compositionstart：在IME的文本复合系统打开时触发，表示还要开始输入了。
- compositionupdate: 在向输入字段中插入新字符时触发。
- compositionend: 在IME的文本复合系统关闭时触发，表示返回正常键盘输入状态。

复合事件与文本事件在很多方面都很相似。在触发复合事件时，目标是接收文本的输入字段。
但它比文本事件的事件对象多一个属性data，其中包含以下几个值中的一个：

- 如果在compositionstart 事件发生时访问，包含正在编辑的文本（例如，已经选中的需要马上替换的文本）；
- 如果在compositionupdate事件发生时访问，包含正插入的新字符；
- 如果在compositionend事件发生时访问，包含此次输入会话中插入的所有字符。

与文本事件一样，必要时可以利用复合事件来筛选输入。可以像下面这样使用它们：

```
var textbox = document.getElementById("myText");
EventUtil.addHandler(textbox, "compositionstart", function(event){
    event = EventUtil.getEvent(event);
    console.log(event.data);
});

EventUtil.addHandler(textbox, "compositionuppdate", function(event){
    event = EventUtil.getEvent(event);
    console.log(event.data);
});

EventUtil.addHandler(textbox, "compositionend", function(event){
    event = EventUtil.getEvent(event);
    console.log(event.data);
});

```

IE9+ 是到2011年唯一支持复合事件的浏览器。
由于缺少支持，对于需要开发跨浏览器应用的开发人员，它的用处不大。
要确定浏览器是否支持复合事件，可以使用以下代码：

```
var isSupported = document.implementation.hasFeature("CompositionEvent", "3.0");
```

### 变动事件

DOM2级的变动（mutation）事件能在DOM中的某一部分发生变化时给出提示。
变动事件是为XML或HTML DOM设计的，并不特定于某种语言。
DOM2级定义了如下变动事件。

- DOMSubTreeModified：在DOM结构中发生任何变化时触发。这个事件在其他任何事件触发后都会触发。
  
- DOMNodeInserted: 在一个节点作为子节点被插入到另一个节点中时触发。

- DOMNodeRemoved：在节点从其父节点中被移除时触发。

- DOMNodeInsertedIntoDocument: 在一个节点被直接插入文档或通过子树间插入文档之后触发。这个事件在DOMNodeInseted 之后触发。

- DOMAttrModified: 在特性被修改之后触发。

- DOMCharacterDataModified：在文本节点的值发生变化时触发。

使用下列代码可以检测出浏览器是否支持变动事件：

```
var isSupported = document.implementation.hasFeature("MutationEvents", "2.0");
```

IE8及更早版本不支持任何变动事件。

由于DOM3级事件模块作废了很多变动事件，所以本节只介绍那些将来仍然会得到支持的事件。

1. 删除节点

在使用removeChild()或replaceChild()从DOM中删除节点时，首先会触发DOMNodeRemoved事件。这个事件的目标（event.target）是被删除的节点，而event.relatedNode属性中包含着对目标节点父节点的引用。在这个事件触发时，节点尚未从其父节点删除，因此其parentNode属性仍然指向父节点（与event.relatedNode相同）。这个事件会冒泡，因而可以在DOM的任何层次上面处理它。

如果被移除的节点包含子节点，那么在其所有子节点以及这个被移除的节点上回相继触发DOMNodeRemovedFromDocument事件。但这个事件不会冒泡，所以只有直接指定给其中一个子节点的事件处理程序才会被调用。这个事件的目标是相应的子节点或者那个被移除的节点，除此之外event对象中不包含其他信息。

紧随其后触发的是DOMSubtreeModified事件。这个事件的目标是被移除节点的父节点；此时的event对象也不会提供与事件相关的其他信息。

为了理解上述事件的触发过程，下面我们就以一个简单的HTML页面为例。

```
<! DOCTYPE html>
<html>
<head>
    <title>Node Removal Events Example</title>
</head>
<body>
    <ul id="myList">
        <li>Item1</li>
        <li>Item2</li>
        <li>Item3</li>
    </ul>
</body>
</html>
```

在这个例子中，我们假设要移除\<ul>元素。此时，就会依次触发以下事件。

1. 在\<ul>元素上触发DOMNodeRemoved事件。relatedNode属性等于document.body。
2. 在\<ul>元素上触发DOMNodeRemovedFromDocument事件。
3. 在身为\<ul>元素子节点的每个\<li>元素及文本节点上触发DOMNodeRemovedFromDocument事件。
4. 在document.body上触发DOMSubtreeModified事件，因为\<ul>元素时document.body的直接子元素。

运行下列代码验证以上事件发生的顺序。

```
EventUtil.addHandler(window, "load", function(event) {
    var list = document.getElementById("myList");

    EventUtil.addHandler(document, "DOMSubtreeModified", function(event){
        console.log(event.type);
        console.log(event.target);
    });

    EventUtil.addHandler(document, "DOMNodeRemoved", function(event){
        console.log(event.type);
        console.log(event.target);
        console.log(event.relatedNode);
    });

    EventUtil.addHandler(list.firstChild, "DOMNodeRemovedFromDocument", function(event) {
        console.log(event.type);
        console.log(event.target);
    });

    list.parentNode.removeChild(list);
});
```



以上代码为document添加了针对DOMSubtreeModified 和 DOMNodeRemoved 事件的处理程序，以便在页面上处理这些事件。由于DOMNodeRemovedFromDocument 不会冒泡，所以我们将针对它的事件处理程序直接添加给了\<ul>元素的第一个子节点（在兼容DOM的浏览器中是一个文本节点）。
在设置了以上事件处理程序后，代码从文档中移除了\<ul>元素。

2. 插入节点

在使用appendChild()、replaceChild()或insertBefore()向DOM中插入节点时，首先会触发DOMNodeInserted事件。这个事件的目标是被插入的节点，而event.relatedNode属性中包含一个对父节点的引用。在这个事件触发时，节点已经被插入到了新的父节点。这个事件是冒泡的，因此可以在DOM的各个层次上处理它。

紧接着，会在新插入的节点上触发DOMNodeInsertedIntoDocument事件。这个事件不冒泡，因此必须在插入节点之前为它添加这个事件处理程序。这个事件的目标是被插入的节点，除此之外event对象中不包含其他信息。

最后一个触发的事件是DOMSubtreeModified，触发于新插入节点的父节点。

仍以前面的HTML文档为例，通过下列JavaScript代码来验证上述事件的触发顺序。

```
EventUtil.addHandler(window, "load", function(event){
    var list = document.getElementById("myList");
    var item = document.createElement("li");
    item.appendChild(document.createTextNode("item4"));

    EventUtil.addHandler(document, "DOMSubtreeModified", function(event) {
        console.log(event.type);
        console.log(event.target);
    });

    EventUtil.addHandler(document, "DOMNodeInserted", function(event) {
        console.log(event.type);
        console.log(event.target);
        console.log(event.relatedNode);
    });

    EventUtil.addHandler(item, "DOMNodeInsertedIntoDocument", function(event){
        console.log(event.type);
    });

    list.appendChild(item);
});

```

以上代码首先创建了一个包含文本"Item 4"的新\<li>元素。

由于DOMSubtreeModified 和 DOMNodeInserted事件是冒泡的，所以把它们的时间处理程序添加到了文档中。
在将列表项插入到其父节点之前，先将DOMNodeInsertedIntoDocument事件的事件处理程序添加给它。最后一步就是appendChild()来添加这个列表项。

此时，事件开始依次触发。

首先是在新\<li>元素项上触发DOMNodeInserted 事件，其relatedNode 是\<ul>元素。

然后是触发新\<li>元素上的DOMNodeInsertdIntoDocument事件，最后触发的是\<ul>元素上的DOMSubtreeModified 事件。