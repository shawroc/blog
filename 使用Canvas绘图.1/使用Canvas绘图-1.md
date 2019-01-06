# 使用Canvas绘图 - 1

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

不用说，HTML5 添加的最受欢迎的功能就是\<canvas>元素。
这个元素负责在页面中设定一个区域，然后就可以通过JavaScript动态地在这个区域中绘制图形。
\<canvas>元素最早是由苹果公司推出的，当时主要用在其Dashboard软件中。
很快，HTML5加入了这个元素，主流浏览器也迅速开始支持它。
IE9+、Firefox 1.5+、Safari 2+、Opera 9+、Chrome、iOS版Safari以及Android版WebKit都在某种程度上支持\<canvas>。

与浏览器环境中的其他组件类似，\<canvas>由几组API构成，但并非所有浏览器都支持所有这些API。
除了具备基本绘图能力的2D上下文，\<canvas>还建议了一个名为WebGL的3D上下文。
目前，支持该元素的浏览器都支持2D上下文及文本API，但对WebGL的支持还不够好。

## 基本用法

要使用\<canvas>元素，必须先设置其width和height属性，指定可以绘图的区域大小。
出现在开始和结束标签中的内容是后备信息，如果浏览器不支持\<canvas>元素，就会显示这些信息。
下面就是\<canvas>元素的例子。

```
<canvas id="drawing" width="200" height="200">A drawing of something.</canvas>
```

与其他元素一样，\<canvas>元素对应的DOM元素对象也有width和height属性，可以随意修改，而且，也能通过CSS为该元素添加样式，如果不添加任何样式或者不绘制任何图形，在页面中是看不到该元素的。

要在这块画布（canvas)上绘图，需要取得绘图上下文。
而取得绘图上下文对象的引用，需要调用getContext()发放并传入上下文的名字。
传入"2d"，就可以取得2D上下文对象。

```
var drawing = document.getElementById("drawing");

//确定浏览器支持<canvas>元素
if(drawing.getContext){
    var context = drawing.getContext("2d");
}
```

在使用\<canvas>元素之前，首先要检测getContext()方法是否存在，这一步非常重要。
有些浏览器会为HTML规范之外的元素创建默认的HTML元素对象。
在这种情况下，即使drawing变量中保存着一个有效的元素引用，也检测不到getContext()方法。

使用toDataURL()方法，可以导出在\<canvas>元素上绘制的图像。
这个方法接受一个参数，即图像的MIME类型格式，而且适合用于创建图像的任何上下文。

比如，要取得画布中的一幅PNG格式的图像，可以使用以下代码：

```
var  drawing = document.getElementById("drawing");

//确定浏览器支持<canvas>元素
if(drawing.getContext){
    //取得图像的数据URI
    var imgURI = drawing.toDataURL("image/png");
    //显示图像
    var image = document.createElement("img");
    image.src = imgURI;
    document.body.appendChild(image);
}
```

默认情况下，浏览器会将图像编码为PNG格式（除非另行指定）。

## 2D上下文

使用2D绘图上下文提供的方法，可以绘制简单的2D图形，比如矩形、弧线和路径。
2D上下的坐标开始于\<canvas>元素的左上角，原点坐标是(0,0)。
所有坐标值都基于这个原点计算，x值越大表示越靠右，y值越大表示越靠下。

默认情况下，width和height表示水平和垂直两个方向上可用的像素数目。

### 填充和描边

2D 上下文的两种基本绘图操作是填充和描边。
填充，就是用指定的样式（颜色、渐变或图像）填充图形。
描边，就是只在图形的边缘画线。
大多数2D 上下文操作都会细分为填充和描边两个操作，而操作的结果取决于两个属性： fillStyle和 strokeStyle。

这两个属性的值可以是字符串、渐变对象或模式对象，而且它们的默认值都是"#00000"。如果为它们指定表示颜色的字符串值，可以使用CSS中指定颜色值的任何格式，包括颜色名、十六进制码、rgb、rgba、hsl 或 hsla。

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d");
    context.strokeStyle = "red";
    context.fillStyle = "#0000ff";
}
```

以上代码将strokeStyle设置为red（CSS中的颜色名），将fillStyle设置为#0000ff(蓝色)。

然后，所有涉及描边和填充的操作都将使用这两个样式，直至重新设置这两个值。
如前所述，这两个属性的值也可以是渐变对象或模式对象。

### 绘制矩形

矩形是唯一一种可以直接在 2D 上下文中绘制的形状。
与矩形有关的方法包括 fillRect()、strokeRect()和clearRect()。

这三个方法都能接收4个参数：矩形的x坐标、矩形的y坐标、矩形的宽度和矩形高度。这些参数的单位都是像素。

首先，fillRect()在画布上绘制的矩形会填充指定的颜色。
填充的颜色通过 fillStyle 属性指定，比如：

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d");

    //绘制红色矩形
    context.fillStyle = "#ff0000";
    context.fillRect(10,10,50,50);

    //绘制半透明的蓝色矩形
    context.fillStyle = "rgba(0, 0, 255, 0.5)";
    context.fillRect(30, 30, 50, 50);
}
```

以上代码首先将fillStyle 设置为红色，然后从(10,10)处开始绘制矩形，矩形的宽和高均为50像素。

然后，通过rgba()格式再将 fillStyle 设置为半透明的蓝色，在第一个矩形上面绘制第二个矩形。

结果就是可以透过蓝色的矩形看到红色的矩形。

strokeRect() 方法在画布上绘制的矩形会使用指定的颜色描边。
描边颜色通过 strokeStyle 属性指定。

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d");
    //绘制红色描边矩形
    context.strokeStyle = "#ff0000";
    context.strokeRect(10,10,50,50);

    //绘制半透明的蓝色描边矩形
    context.strokeStyle = "rgba(0,0,255,0.5);
    context.strokeRect(30,30,50,50);
}
```

以上代码绘制了两个重叠的矩形。
不过，这两个矩形都只有框线，内部并没有填充颜色。

**描边线条的宽度由lineWidth属性控制，该属性的值可以是任意整数。另外，通过 lineCap 属性可以控制线条末端的形状是平头、圆头还是方头("butt"、"round"或"square")，通过lineJoin属性可以控制线条相交的方式是圆交、斜交还是斜接（"round"、"bevel"或"miter")。**

最后，clearRect()方法用于清除画布上的矩形区域。
本质上，这个方法可以把绘制上下文中的某一矩形区域变透明。
通过绘制形状然后再清除指定区域，就可以生成有意思的效果，例如把某个形状切掉一块。

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d");

    context.fillStyle = "red";
    context.fillRect(10,10, 50,50);

    context.fillStyle = "blue";
    context.fillRect(30,30,50,50);

    context.clearRect(40,40,10,10);
}
```

两个填充矩形重叠在一起，而重叠的地方又被清除了一个小矩形区域。

### 绘制路径

2D 绘制上下文支持很多在画布上绘制路径的方法，
通过路径可以创造出复杂的形状和线条。
要绘制路径，首先必须调用beginPath()方法，表示要开始绘制新路径。
然后，再通过调用下列方法来实际地绘制路径。

- arc(x, y, radius, startAngle, endAngle, counterClockwise): 以(x,y)为圆心绘制一条弧线，弧线半径为radius，起始和结束角度(用弧度表示)分别为startAngle 和 endAngle。最后一个参数表示 startAngle 和 endAngle 是否按逆时针方向计算，值为false表示按顺时针方向计算。

- arcTo(x1, y1, x2, y2, radius): 从上一点开始绘制一条弧线，到(x2, y2)为止，并且以给定的半径radius穿过(x1,y1)。

- bezierCurveTo(c1x, c1y, c2x, c2y, x, y): 从上一点开始绘制一条曲线，到(x,y)为止，并且以(c1x, c1y)为控制点。

- lineTo(x,y): 从上一点开始绘制一条直线，到(x,y)为止。

- moveTo(x,y): 将绘图 游标移动到(x,y)，不画线。

- quadraticCurveTo(cx, cy, x, y): 从上一点开始绘制一条二次曲线，到(x,y)为止，并且以(cx,cy)作为控制点。

- rect(x,y, width, height):  从点(x,y)开始绘制一个矩形，宽度和高度分别由width和height 指定。这个方法绘制的是矩形路径，而不是strokeRect()和fillRect()所绘制的独立的形状。

创建路径后，接下来有几种可能的选择。
如果想绘制一条连接到路径起点的线条，可以调用closePath()。
如果路径已经完成，你想用fillStyle填充它，可以调用fill()方法。
另外，还可以调用stroke()方法对路径描边，描边使用的是strokeStyle。

最后还可以调用clip()，这个方法可以在路径上创建一个剪切区域。

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d");

    //开始路径
    context.beginPath();

    //绘制外圆
    context.arc(100, 100, 99, 0, 2 * Math.PI, false);

    //绘制内圆
    context.moveTo(194, 100);
    context.arc(100, 100, 94, 0, 2 * Math.PI, false);

    //绘制分针
    context.moveTo(100, 100);
    context.lineTo(100, 15);

    //绘制时针
    context.moveTo(100, 100);
    context.lineTo(35, 100);

    //描边路径
    context.stroke();
}
```

这个例子使用arc()方法绘制了两个圆形： 一个外圆和一个内圆，构成了表盘的边框。

外圆的半径是99像素，圆心位于点(100,100)，也是画布的中心点。

为了绘制一个完整的原型，我们从0弧度开始，绘制2π弧度（通过 Math.PI 来计算）。

在绘制内圆之前，必须把路径移动到内圆上的某一点，以避免绘制出多余的线条。

第二次调用 arc() 使用了小一点的半径，以便创造边框的效果。

然后，组合使用moveTo()和lineTo()方法来绘制时针和分针。

最后一步是调用stroke()方法，这样才能把图形绘制到画布上。

在2D绘图上下文中，路径是一种主要的绘图方式，因为路径能为要绘制的图形提供更多控制。

由于路径的使用很频繁，所以就有了一个名为 isPointInPath() 的方法。
这个方法接收 x 和 y 坐标作为参数，用于在路径被关闭之前确定画布上的某一点是否位于路径上。

```
if(context.isPointInPath(100, 100)) {
    console.log("Point (100,100) is in the path.");
}
```

2D上下文中的路径API已经非常稳定，可以利用它们结合不同的填充和描边样式，绘制出非常复杂的图形来。

### 绘制文本

文本与图形总是如影随形。
为此，2D 绘图上下文也提供了绘制文本的方法。
绘制文本主要有两个方法： fillText() 和 strokeText()。

这两个方法都可以接收4个参数：

要绘制的文本字符串、x坐标、y坐标和可选的最大像素宽度。

而且，这两个方法都以下列3个属性为基础。

- font: 表示文本样式、大小及字体，用CSS中指定字体的格式来指定，例如"10px Arial"。

- textAlign: 表示文本对其方式。可能的值有"start"、"end"、"left"、"right"和"center"。建议使用"start"和"end"，不要使用"left"和"right"，因为前两者的意思更稳妥，能同时适合从左到右和从右到左显示（阅读）的语言。

- textBaseline: 表示文本的基线。可能的值有"top"、"hanging"、"middle"、"alphabetic"、"ideographic" 和 "bottom"。

这几个属性都有默认值，因此没有必要每次使用它们都重新设置一遍值。
fillText()方法使用fillStyle 属性绘制文本，而strokeText()方法使用strokeStyle 属性为文本描边。相对来说，还是使用fillText() 的时候更多，因为该方法模仿了在网页中正常显示文本。

```
context.font = "bold 14px Arial";
context.textAlign = "center";
context.textBaseline = "middle";
context.fillText("12", 100, 20);
```

因为这里把textAlign 设置为"center"，把textBaseline 设置为 "middle"，所以坐标(100,20)表示的是文本水平和垂直中点的坐标。

如果将 textAlign 设置为 "start"，则 x 坐标表示的是文本左端的位置（从左到右阅读的语言）；

设置为 "end"，则 x 坐标表示的是文本右端的位置（从右到左阅读的语言）。

例如：

```
//正常
context.font = "bold 14px arial";
context.textAlign = "center";
context.textBaseline = "middle";
context.fillText("12", 100, 20);

//起点对齐
context.textAlign = "start";
context.fillText("12", 100, 40);

//终点对齐
context.textAlign = "end";
context.fillText("12", 100, 60);
```

这一回绘制了三个字符串"12"，每个字符窜的 x 坐标值相同，但textAlign 值不同。另外，后两个字符串的y坐标依次增大，以避免相互重叠。

表盘中的分针恰好位于正中间，因此文本的水平对其方式如何变化也能够一目了然。
类似地，修改textBaseline 属性的值可以调整文本的垂直对齐方式：值为"top"，y坐标表示文本顶端；

值为"bottom"，y坐标表示文本底端；

值为"hanging"、"alphabetic"和"ideographic"，则y坐标分别指向字体的特定基线坐标。

由于绘制文本比较复杂，特别是需要把文本控制在某一区域中的时候，2D 上下文提供了辅助确定文本大小的方法 measureText()。这个方法接收一个参数，即要绘制的文本；返回一个TextMetrics对象。返回的对象目前只有一个width属性，但将来还会增加更多度量属性。

measureText()方法利用 font、textAlign和 textBaseline 的当前值计算指定文本的大小。比如，假设你想在一个 140 像素宽的矩形区域绘制文本 Hello World!，下面的代码从100像素的字体大小开始递减，最终会找到合适的字体大小。

```
var fontSize = 100;
context.font = fontSize + "px Arial";

while(context.measureText("Hello world!").width > 140) {
    fontSize --;
    context.font = fontSize + "px Arial";
}

context.fillText("Hello wolrd!", 10, 10);
context.fillText("Font size is " + fontSize + "px", 10, 50);

```

前面提到过, fillText()和 strokeText() 方法都可以接收第四个参数，也就是文本的最大像素宽度。

不过，这个可选的参数尚未得到所有浏览器支持。

提供这个参数后，调用 fillText() 或 strokeText() 时如果传入的字符串大于最大宽度，则绘制的文本字符的高度正确，但宽度会收缩以适应最大宽度。

绘制文本还是相对比较复杂的操作，因为支持\<canvas>元素的浏览器也并未完全实现所有与绘制文本相关的API。

### 变换

通过上下文的变换，可以把处理后的图像绘制到画布上。
2D绘制上下文支持各种基本的绘制变换。
创建绘制上下文时，会以默认值初始化变换矩阵，在默认的变换矩阵下，所有处理都按描述直接绘制。为绘制上下文应用变换，会导致使用不同的变换矩阵应用处理，从而产生不同的结果。

- rotate(angle): 围绕原点旋转图像angle弧度。

- scale(scaleX, scaleY): 缩放图像，在 x 方向乘以 scaleX，在 y 方向乘以 scaleY。 scaleX 和 scaleY 的默认值都是1.0。

- translate(x,y): 将坐标原点移动到(x,y)。执行这个变换之后，坐标(0,0)会变成之前由(x,y)表示的点。

- transform(m1_1, m1_2, m2_1, m2_2, dx, dy): 直接修改变换矩阵，方式是乘以如下矩阵。

- setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy): 将变换矩阵重置为默认状态，然后再调用 transform();

变换有可能很简单，但也可能很复杂，这都要视情况而定。
比如，就拿前面例子中绘制表针来说，如果把原点变换到表盘的中心，然后再绘制表针就容易多了。

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d");

    context.beginPath();

    context.arc(100, 100, 99, 0, 2 * Math.PI, false);

    context.moveTo(194,100);
    context.arc(100, 100, 94, 0, 2 * Math.PI, false);

    context.translate(100, 100);

    context.moveTo(0,0);
    context.lineTo(0, -85);

    context.moveTo(0,0);
    context.lineTo(-65, 0);

    //描边路径
    context.stroke();
}
```

把原点变换到时钟表盘的中心点(100,100)后，在同一方向上绘制显线条就变成了简单的数学问题了。

所有数学计算都基于(0,0)，而不是(100,100)。还可以更进一步，像下面这样使用 rotate() 方法旋转时钟的表针。

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d");

    context.beginPath();

    context.arc(100, 100, 99, 0, 2 * Math.PI, false);

    context.moveTo(194, 100);
    context.arc(100, 100, 94, 0, 2 * Math.PI, false);

    context.translate(100, 100);
    
    context.rotate(1);

    context.moveTo(0,0);
    context.lineTo(0, -85);

    context.moveTo(0,0);
    context.lineTo(-65, 0);

    context.stroke();
}
```

因为原点已经变换到了时钟表盘的中心点，所以旋转也是以该点为圆心的。
结果就像是表针真的被固定在表盘中心一样，然后向右旋转了一定角度。

无论是刚才执行的变换，还是 fillStyle、strokeStyle等属性，都会在当前上下文中一直有效，除非再对上下文进行什么修改。

虽然没有什么办法把上下文中的一切都重置回默认值，但有两个方法可以跟踪上下文的状态变化。

如果你知道将来还要返回某组属性与变换的组合，可以调用 save() 方法。
调用这个方法后，当时的所有设置都会进入一个栈结构，得以妥善保管。

然后可以对上下文进行其他修改。

等想要回到之前保存的设置时，可以调用restore()方法，在保存设置的栈结构中向前返回一级，恢复之前的状态。

连续调用 save() 可以把更多设置保存到栈结构中，之后再连续调用 restore() 则可以一级一级返回。

还是看例子吧！

```
context.fillStyle = "#ff0000"; //red
context.save();

context.fillStyle = "#00ff00"; //green
context.translate(100, 100);
context.save();

context.fillStyle = "#0000ff"; // blue
context.fillRect(0, 0, 100, 200); //从点(100,100)开始绘制蓝色矩形
context.restore();//restore 只对fillStyle 和 strokeStyle有效

context.fillRect(10, 10, 100, 200); //从点(110, 110)开始绘制绿色矩形
context.restore();

context.fillRect(0, 0, 100, 200); //从点（0,0）开始绘制红色矩形
```

首先，将 fillStyle 设置为红色，并调用 save() 保存上下文 状态。
接下来，把 fillStyle 修改为绿色，再调用 save() 保存上下文 状态。

然后，把fillStyle 修改为蓝色并绘制蓝色的矩形。
因为此时的坐标原点已经变了，所以矩形的左上角坐标实际上是（100,100）。

然后调用 restore()，之后fillStyle变回了绿色，因而第二个矩形就是绿色。

之所以，第二个矩形的起点坐标是（110,110），是因为坐标位置的变换仍然其作用。

再调用一次 restore()，变换就被取消了，而fillStyle 也返回了红色。
所以最后一个矩形是红色的，而且绘制的起点是（0,0）。

需要注意的是，save()方法保存的只是对绘图上下文的设置和变换，不会保存绘图上下文的内容。