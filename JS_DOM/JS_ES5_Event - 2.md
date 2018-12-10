# JS_ES5_Event - 2

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

在出发DOM上的某个事件时，会产生一个事件对象event，这个对象中包含着所有与事件有关的信息。
包括导致事件的元素、事件的类型以及其他与特定事件相关的信息。

例如，鼠标操作导致的事件对象中，会包含鼠标位置的信息，而键盘操作导致的事件对象中，会包含与按下的键有关的信息。

所有浏览器都支持event对象，但支持方式不同。

## DOM 中的事件对象

兼容DOM的浏览器会将一个event 对象传入到事件处理程序中。
无论指定事件处理程序时使用什么方法（DOM0级 或 DOM2级），都会传入event对象。

```
var btn = document.getElementById("myBtn");
btn.onclick = function(event) {
    console.log(event.type); //"click"
};
btn.addEventListener("click", function(event){
    console.log(event.type); //"click" 
}, false);
```

这个例子中的两个事件处理程序都会在控制台输出“click”，显示由event.type 属性表示的事件类型。
这个属性始终都会包9含被触发的事件类型，例如：“click”（与传入 addEventListener() 和 removeEventListener中的事件类型一致）。

在通过HTML特性指定事件处理程序时，变量event中保存着event对象。
请看下面的例子。

```
<input type="button" value="Click Me" onclick="console.log(event.type)">
```

以这种方式提供event对象，可以让HTML特性事件处理程序与JavaScript函数执行相同的操作。

event 对象包含与创建它的特定事件有关的属性和方法。
触发的事件类型不一样，可用的属性和方法也不一样。

不过，所有事件都会有下表列出的成员。

|属性/方法|类型|读/写|说明|
|:-:|:-:|:-:|:-:|
|bubbles|Boolean|只读|表明事件是否冒泡|
|cancelable|Boolean|只读|表明是否可以取消事件的默认行为|
|currentTarget|Element|只读|其事件处理程序当前正在处理事件的那个元素|
|defaultPrevented|Boolean|只读|为true表示已经调用了preventDefault()|
|detail|Integer|只读|与事件相关的细节信息|
|eventPhase|Integer|只读|调用事件处理程序的阶段：1表示捕获阶段，2表示“处于目标”，3表示冒泡阶段|
|preventDefault()|Function|只读|取消事件的默认行为。如果cancelable是true，则可以使用这个方法|
|stopImmediatePropagation()|Function|只读|取消事件的进一步捕获或冒泡，同时促织任何事件处理程序被调动。|
|stopPropagation()|Function|只读|取消事件的进一步捕获或冒泡。如果bubble为true，则可以使用这个方法|
|target|Element|只读|事件的目标|
|trusted|Boolean|只读|为true表示事件是浏览器生成的。为false表示事件是由开发人员通过JavaScript创建的|
|type|String|只读|被触发的事件的类型|
|view|AbstractView|只读|与事件关联的抽象视图。等同于发生事件的window对象|

在事件处理程序内部，对象this始终等于currentTarget的值，而target只包含事件的实际目标。
如果直接将事件处理程序指定给了目标元素，则this、currentTarget和target包含相同的值。

```
var btn = document.getElementById("myBtn");
btn.onclick = function(event){
    console.log(event.currentTarget === this); // true
    console.log(event.target === this); //true
}
```

这个例子检测了currentTarget和target与this的值。
由于click事件的目标是按钮，因此，这三个值是相等的。

**如果事件处理程序存在于按钮的父节点（例如 document.body)，那么这些值是不相同的。**

```
document.body.onclick = function(event) {
    console.log(event.currentTarget === document.body); //true
    console.log(this === document.body); //true
    console.log(event.target === document.getElementById("myBtn")); //true
}
```

当点击这个例子中的按钮时，this和currentTarget都等于document.body，因为事件处理程序都是注册到这个元素上的。然而，target元素却等于按钮元素，因为它是click事件真正的目标。
由于按钮上并没有注册事件处理程序，结果click事件就冒泡到了document.body，在那里事件才得到了处理。

在需要通过一个函数处理多个事件时，可以使用type属性。

```
var btn = document.getElementById("myBtn");
var handler = function(event) {
    switch(event.type) {
        case "click":
        console.log("clicked");
        break;

        case "mouseover":
        event.target.style.backgroundColor = "red";
        break;

        case "mouseout":
        event.target.style.backgroundColor = "";
        break;
    }
};

btn.onclick = handler;
btn.onmouseover = handler;
btn.onmouseout = handler;
```

这个例子定义了一个名为handler的函数，用于处理3种事件：click、mouseover和mouseout。

当点击按钮时，会出现一个与前面例子中一样的警告框。当按钮移动到按钮上面时，背景颜色应该会变成红色，而当鼠标移动出按钮的范围时，背景颜色应该会恢复为默认值。

**这里通过检测 event.type属性，让函数能够确定发生了什么时间，并执行相应的操作。**

**要阻止特定事件的默认行为，可以使用preventDefault方法。例如，链接的默认行为就是在被点击时会导航到其href特定指定的URL。如果你想阻止链接导航这一默认行为，那么通过链接的onclick事件处理程序可以取消它。**

```
var link = document.getElementById("myLink");
link.onclick = function(event) {
    event.prevetDefault();
}
```

**只有cancelable属性设置为true的事件，才可以使用preventDefault()来取消其默认行为。**

另外，**stopPropagation()方法用于立即停止事件在DOM层次中的传播，即取消进一步的事件捕获或冒泡。**例如，直接添加到一个按钮的事件处理程序可以调用stopPropagation()， 从而避免出发注册在document.body上面的事件处理程序。

```
var btn = document.getElementById("myBtn");

btn.onclick = function(event) {
    console.log("clicked");
    event.stopPropagation();
}

document.body.onclick = function(event) {
    console.log("Body clicked");
}
```

对于这个例子而言，如果不调用stopPropagation()，就会在点击按钮时出现两个警告框、
可是，由于click事件根本不会传播到document.body，因此就不会触发注册在这个元素上的onclick事件处理程序。

事件对象的eventPhase属性，可以用来确定事件当前位于事件流的哪个阶段。如果是在捕获阶段调用的事件处理程序，那么eventPhase 等于 1；如果事件处理程序处于目标对象上，则eventPhase等于 2；如果是在冒泡阶段调用的事件处理程序，eventPhase 等于 3。

**这里要注意的是，尽管“处于目标” 发生在冒泡阶段，但eventPhase 仍然一直等于2。**

```
var btn = document.getElementById("myBtn");

btn.onclick = function(event) {
    console.log(event.eventPhase); //2
};

document.body.addEventListener("click", function(event){
    console.log(event.eventPhase); //1
}, true);

document.body.onclick = function(event) {
    console.log(event.eventPhase); //3
}
```

当点击这个例子中的按钮时，首先执行的事件处理程序时在捕获阶段出发的添加到document.body中的那一个，结果会弹出一个警告框显示表示eventPhase的1。
接着，会触发在按钮上注册的事件处理程序，此时的eventPhase值是2。
最后一个被触发的事件处理程序，是在冒泡阶段执行的添加到document.body上的那一个，显示eventPhase的值为3。而当eventPhase等于2时，this、target和currentTarget始终是相等的。

**只有在事件处理程序执行期间，event对象才会存在；一旦事件处理程序执行完成，event对象就会销毁。很节约内存和性能**


### IE中的事件对象

与访问DOM中的event对象不同，要访问IE中的event对象有几种不同的方式，取决于执行事件处理程序的方法。**在使用DOM0级方法添加事件处理程序时，event对象作为window对象的一个属性存在。**

```

var btn = document.getElementById("myBtn");
btn.onclick = function(){
    var event = window.event;
    console.log(event.type); //"clicked"
};
```

在此，我们通过window.event 取得了 event对象，并检测了被触发事件的类型（IE中的type属性与DOM中的type属性是相同的）。可是，如果事件处理程序时使用attchEvent()添加的，那么就会有一个event对象作为参数被传入事件处理函数中，如下所示。

```
var btn = document.getElementById("myBtn");
btn.attachEvent("onclick", function(event){
    console.log(event.type);
});
```

在像这样使用attachEvent()的情况下，也可以通过window对象来访问event对象，就像使用DOM0级方法一样。不过为了方便起见，同一个对象也会作为参数传递。

如果是通过HTML特性指定的事件处理程序，那么还可以通过一个名叫event的变量来访问event对象（与DOM中的事件模型相同）。

```
<input type="button" value="Click Me" onclick="alert(event.type)">
```

IE的event对象同样也包含与创建它的事件相关的属性和方法。
其中很多属性和方法都有对应的或者相关的DOM属性和方法。
与DOM的event对象一样，这些属性和方法也会因为事件类型的不同而不同，但所有事件对象都会包含下表所列的属性和方法。

|属性/方法|类型|读/写|说明|
|cancelBubble|Boolean|读/写|默认值为false，将其设置为true就可以取消事件冒泡（与DOM中的stopPropagation()方法的作用相同）。|
|returnValue|Boolean|读/写|默认值为true，将其设置为false就可以取消事件的默认行为（与DOM中的preventDefault()方法的作用相同）|
|srcElement|Element|只读|事件的目标（与DOM中的target属性相同）|
|type|String|只读|被触发的类型|

因为事件处理程序的作用域是根据执行它的方式来确定的，所以不能认为this会始终等于事件目标。
故而，最好还是使用event.srcElement比较保险。

```
var btn = document.getElementById("myBtn");
btn.onclick = function(){
    console.log(window.event.srcElement === this); // true
};

btn.attachEvent("onclick", function(event){
    alert(event.srcElement === this); //false
});
```

在第一个事件处理程序中（使用DOM0 级方法指定的），srElement 属性等于this，但在第二个事件处理了程序中，这两者的值不相同。

如前所述，returnValue 属性相当于 DOM中的preventDefault()方法，它们的作用都是取消给定事件的默认行为。只要将returnValue 设置为false，就可以阻止默认行为。

```
var link = document.getElementById("mylink");
link.onclick = function(){
    window.event.returnValue = false;
};
```

这个例子在onclick事件处理程序中使用returnValue达到了阻止链接默认行为的目的。
与DOM不同的是，在此没有办法确定事件是否能被取消。

相应地，cancelBubble属性与DOM中的stopPropagation()方法作用相同，都是用来停止事件冒泡的。
由于IE不支持事件捕获，因而只能取消事件冒泡。
**但stopPropagation()可以同时取消事件捕获和冒泡。**

```
var btn = document.getElementById("myBtn");

btn.onclick = function(){
    console.log("Clicked");
    window.event.cancelBubble = true;
};

document.body.onclick = function(){
    console.log("Body Clicked");
};
```

通过在onclick事件处理程序中将cancelBubble 设置为true，就可阻止事件通过冒泡而触发document.body 中注册的事件处理程序。结果，在点击按钮之后，只会显示一个警告框。

### 跨浏览器的事件对象

虽然DOM和IE中的event对象不同，但基于它们之间的相似性依旧可以拿出跨浏览器的方案。

IE中 event 对象的全部信息和方法 DOM对象中都有，只不过实现方式不一样。

不过，这种对应关系让实现两种事件模型之间的映射非常容易。

可以对前面介绍的EventUtil对象加以增强，添加如下以求同存异。

```
var EventUtil = {
    addHandler: function(element,type, handler) {

    },

    getEvent: function(event) {
        return event ? event : window.event;
    },

    getTarget: function(event) {
        return event.target || event.srcElement;
    },

    preventDefault: function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    removeHandler: function(element, type, handler) {
        //省略代码
    },

    stopPropagation: function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};
```

以上代码显示，我们为EventUtil添加了4个新方法。
第一个是getEvent()，它返回对event对象的引用。
考虑到IE中事件对象的位置不同，可以使用这个方法来取得event对象，而不必担心指定事件处理程序的方式。在使用这个方法时，必须假设有一个事件对象传入到事件处理程序中，而且要把该变量传给这个方法。

```
btn.onclick = function(event) {
    event = EventUtil.getEvent(event);
}
```

在兼容DOM的浏览器中，event变量只是简单地传入和返回。而在IE中，event 参数是未定义的(undefined)，因此就会返回window.event。将这一行代码添加到事件处理程序的开头，就可以确保随时都能使用event对象，而不必担心用户使用的是什么浏览器。

第二个方法是getTarget()，它返回事件的目标。在这个方法内部，会检测event对象的target属性，如果存在则返回该属性的值；否则，返回srcElement属性的值。

```
btn.onclick = function(event) {
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
};
```

第三个方法是preventDefault()，用于取消事件的默认行为。在传入event对象后，这个方法会检查是否存在preventDefault()方法，如果存在则调用该方法。如果preventDefault()方法不存在，则将returnValue设置为false。下面是使用这个方法的例子。

```
var link = document.getElementById("myLink");
link.onclick = function(event) {
    event = EventUtil.getEvent(event);
    EventUtil.preventDefault(event);
};
```

以上代码可以确保在所有浏览器中单击该链接都不会打开另外一个页面。
首先，使用EventUtil.getEvent()取得event对象，然后将其传入到EventUtil.preventDefault()以取消默认行为。

第四个方法是stopPropagation()，其实现方式类似。
首先尝试使用DOM方法阻止事件流，否则就使用cancelBubble的属性。

```
var btn = document.getElementById("myBtn");
btn.onclick = function(event){
    console.log("Clicked");
    event =  EventUtil.getEvent(event);
    EventUtil.stopPropagation(event);
};

document.body.onclick = function(event) {
    console.log("Body Clicked");
}
```

在此，首先使用EventUtil.getEvent()取得了 event对象，然后又将其传入到EventUtil.stopPropagation()。别忘了由于IE不支持事件捕获，因此这个方法在跨浏览器的情况下，也只能阻止事件冒泡。