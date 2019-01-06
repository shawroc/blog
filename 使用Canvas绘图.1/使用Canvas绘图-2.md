# 使用Canvas绘图 - 2

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

### 绘制图像

2D绘图上下文内置了对图像的支持。
如果你想把一幅图像绘制到画布上，可以使用drawImage()方法。
根据期望的最终结构不同，调用这个方法时，可以使用三种不同的参数组合。
最简单的调用方式是传入一个HTML\<img>元素，以及绘制该图像的起点的x和y坐标。例如:

```
var image = document.images[0];
context.drawImage(image, 10, 10);
```

这两行代码取得了文档中的第一幅图像，然后将它绘制到上下文中，起点为(10, 10)。
绘制到画布上的图像大小与原始大小一样。
如果你想改变绘制后图像的大小，可以再多传入两个参数，分别表示目标宽度和目标高度。
通过这种方式来缩放图像并不影响上下文的变换矩阵。

```
context.drawImage(image, 50, 10, 20, 30);
```

执行代码后，绘制出来的图像大小会变成 20x30 像素。

除了上述两种方式，还可以选择把图像中的某个区域绘制到上下文中。
drawImage()方法的这种调用方式总共需要传入9个参数：要绘制的图像、源图像的x坐标、源图像的y坐标、源图像的宽度、源图像的高度、目标图像的 x 坐标、目标图像的 y 坐标、 目标图像的宽度、 目标图像的高度。

这样调用 drawImage() 方法可以获得最多的控制。

```
context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60);
```

这行代码只会把原始图像的一部分绘制到画布上。
原始图像的这一部分的起点为(0,10)，宽和高都是50像素。
最终绘制到上下文中的图像的起点是(0,100)，而大小变成了 40 x 60 像素。

除了给drawImage()方法传入 HTML \<img>元素外，还可以传入另一个\<canvas>元素作为其第一个参数。这样，就可以把另一个画布内容绘制到当前画布上。

组合使用 drawImage() 和其他方法，可以对图像进行各种基本操作。
而操作的结果可以通过 toDataURL()方法获得。

不过，有一个例外，即图像不能来自其他域。
如果图像来自其他域，调用toDataURL() 会抛出一个错误。
打个比方，假如位于 www.example.com 上的页面绘制的图像来自于 www.worx.com，那当前上下文就会被认为“不干净”，因而会抛出错误。

### 阴影

2D上下文会根据以下几个属性的值，自动为形状或路径绘制出阴影。

- shadowColor: 用CSS颜色格式表示的阴影颜色，默认为黑色。

- shadowOffsetX: 形状或路径 x 轴方向的阴影偏移量，默认为0。

- shadowOffsetY: 形状或路径 y 轴方向的阴影偏移量，默认为0。

-  shadowBlur: 模糊的像素数，默认0， 即不模糊。

这些属性都可以通过 context 对象来修改。
只要在绘制前为它们设置适当的值，就会自动产生阴影。

```
var context = drawing.getContext('2d');

//设置阴影
context.shadowOffsetX = 5;
context.shadowOffsetY = 5;
context.shadowBlur = 4;
context.shadowColor = "rgba(0, 0, 0, 0.5)";

//绘制红色矩形
context.fillStyle = "#ff0000";
context.fillRect(10, 10, 50, 50);

//绘制蓝色矩形
context.fillStyle = "rgba(0, 0, 255, 1)";
context.fillRect(30, 30, 50, 50);
```

两个矩形的阴影样式相同。

不同浏览器对阴影的支持有一些差异。
IE9、Firefox 4 和 Opera 11的行为最为规范，其他浏览器多多少少会有一些奇怪的现象，甚至根本不支持阴影。
Chrome不能正确地为描边的形状应用实心阴影。
Chrome 和 Safari 在为带透明像素的图像应用阴影时也会有问题：不透明部分的下方本来是该有阴影的，但此时则一概不见了。Safari 也不能给渐变图形应用阴影，其他浏览器都可以。

### 渐变

渐变由CanvasGradient 实例表示，很容易通过 2D 上下文来创建和修改。
要创建一个新的线性渐变，可以调用 createLinearGradient() 方法。
这个方法接收4个参数： 起点的 x 坐标、起点的 y 坐标， 终点的 x 坐标、终点的 y 坐标。调用这个方法后，它就会创建一个指定大小的渐变，并返回 CanvasGradient 对象的实例。

创建了渐变对象后，下一步就是使用 addColorStop()方法来指定色标。
这个方法接收两个参数： 色标位置和CSS颜色值。
色标位置是一个0（开始的颜色）到1（结束的颜色）之间的数字，例如:

```
var gradient = context.createLinearGradient(30, 30, 70, 70);

gradient.addColorStop(0, "white");
gradient.addColorStop(1, "black");
```

此时，gradient 对象表示的是一个画布上点（30,30）到点（70,70）的渐变。
起点的色标是白色，终点的色标是黑色。
然后就可以把 fillStyle 或  strokeStyle 设置为这个对象，从而使用渐变来绘制形状或描边：

```
//绘制红色矩形
context.fillStyle = "#ff0000";
context.fillRect(10, 10, 50, 50);

//绘制渐变矩形
context.fillStyle = gradient;
context.fillRect(30, 30, 50, 50);
```

为了让渐变覆盖整个矩形，而不是仅应用到矩形的一部分，矩形和渐变对象的坐标必须匹配才行。

如果没有把矩形绘制到恰当的位置，那可能就只会显示部分渐变效果。

```
context.fillStyle = gradient;
context.fillRect(50, 50, 50, 50);
```

这两行代码执行后得到的矩形只有左上角稍微有一点白色。
这主要是因为矩形的起点位于渐变的中间位置，而此时渐变差不多已经结束了。
由于渐变不重复，所以矩形的大部分区域都是黑色。
确保渐变与形状对齐非常重要，有时候可以考虑使用函数来确保坐标合适。

```
function createRectLinearGradient(context, x, y, width, height){
    return context.createLinearGradient(x, y, x+width, y+height);
}
```

这个函数基于起点的x 和 y坐标以及宽度和高度值来创建渐变对象，从而让我们可以在 fillRect() 中使用相同的值。

```
var gradient = createRectLinearGradient(context, 30, 30, 50, 50);

gradient.addColorStop(0, "white");
gradient.addColorStop(1, "black");

context.fillStyle = gradient;
context.fillRect(30, 30, 50, 50);
```

要创建径向渐变（或放射渐变），可以使用 createRadialGradient()方法。
这个方法接收6个参数，对应着两个圆的圆心和半径。
前两个参数指定的是起点圆的原心（x 和 y）及半径，后三个参数指定的是终点圆的原心 (x 和 y)及半径。

可以把径向渐变想象成一个长圆桶，而这 6 个参数定义的正是这个桶的两个圆形开头的位置。

如果把一个圆形开口定义得比另一个小一些，那这个圆桶就变成了圆锥体，而通过移动每个圆形开口的位置，就可达到像旋转这个圆锥体一样的效果。

如果想从某个形状的中心点开始创建一个向外扩散的径向渐变效果，就要将两个圆定义为同心圆。

比如，就拿前面创建的矩形来说，径向渐变的两个圆的圆心都应该在(55,55)，因为矩形的区域是从(30,30)到(80,80)。

请看代码：

```
var gradient = context.createRadialGradient(55, 55, 10, 55, 55, 30);

gradient.addColorStop(0, "white");
gradient.addColorStop(1, "black");

//绘制红色矩形
context.fillStyle = "#ff0000";
context.fillRect(10, 10, 50, 50);

//绘制渐变矩形
context.fillStyle = gradient;
context.fillRect(30, 30, 50, 50);
```

因为创建比较麻烦，所以径向渐变并不容易控制。
不过，一般来说，让起点圆和终点圆保持为圆心圆的情况比较多，这时候只要考虑给两个圆设置不同的半径就好了。

### 模式

模式其实就是重复的图像，可以用来填充或描边图形。
要创建一个新模式，可以调用 createPattern() 方法并传入两个参数：

一个 HTML \<img>元素和一个表示如何重复图像的字符串。

其中，第二个参数的值与CSS的background-repeat 属性值相同，包括 "repeat"、"repeat-x"、"repeat-y"和 "no-repeat"。

看一个例子：

```
var image = document.images[0],
    pattern = context.createPattern(image, "repeat");

//绘制矩形
context.fillStyle = pattern;
context.fillRect(10, 10, 150, 150);
```

需要注意的是，模式与渐变一样，都是从画布的原点(0,0)开始的。
将填充样式(fillStyle)设置为模式对象，只表示在某个特定的区域内显示重复的图像，而不是要从某个位置开始绘制重复的图像。

createPattern()方法的第一个参数也可以是一个\<video>元素，或者另一个\<canvas>元素。

### 使用图像数据

2D上下文的一个明显的长处就是，可以通过 getImageData() 取得原始图像数据。
这个方法接收4个参数： 

要取得其数据的画面区域的 x 和 y 坐标以及该区域的像素宽度和高度。

例如，要取得左上角坐标为 (10,5)、大小为 50 x 50 像素的区域的图像数据，可以使用以下代码：

```
var imageData = context.getImageData(10, 5, 50, 50);
```

这里返回的对象是 imageData 的实例。

每个 ImageData 对象都有三个属性：

width、height 和 data。

其中 data 属性是一个数组，保存着图像中每一个像素的数据。
在 data 数组中，每一个像素用个元素来保存，分别表示红、绿、蓝和透明度值。
因此，第一个像素的数据就保存在数组的第0到第3个元素中，例如:

```
var data = imageData.data,
    red = data[0],
    green = data[1],
    blue = data[2],
    alpha = data[3]
```

数组中每个元素的值都介于 0 到 255 之间。
能够直接访问到原始图像数据，就能够以各种方式操作这些数据。
例如，通过修改图像数据，可以像下面这样创建一个简单的灰阶过滤器。

```
var drawing = document.getElementById("drawing");

if(drawing.getContext){
    var context = drawing.getContext("2d"),
    image = document.images[0],
    imageData, data,
    i, len, average,
    red, green, blue, alpha;

    //绘制原始图像
    context.drawImage(image, 0, 0);

    //取得图像数据
    imageData = context.getImageData(0, 0, image.width, image.height);
    data =  imageData.data;

    for(i=0, len=data.length; i < lenl; i+=4){
        red = data[i];
        green = data[i+1];
        blue = data[i+2];
        alpha = data[i+3];

        //求得rgb平均值
        average = Math.floor((red + green + blue)/3);

        //设置颜色值，透明度不变
        data[i] = average;
        data[i+1] = average;
        data[i+2] = average;
    }

    //回写图像数据并显示结果
    imageData.data = data;
    context.putImageData(imageData, 0, 0);
}
```

这个例子首先在画面上绘制了一幅图像，然后取得了原始图像数据。
其中的for循环遍历了图像数据中的每一个像素。
这里要注意的是，每次循环控制变量i都增4。
在取得每个像素的红、绿、蓝颜色值后，计算出它们的平均值。

再把这个平均值设置为每个颜色的值，结果就是去掉了每个像素的颜色，只保留了亮度接近的灰度值（即彩色变黑白）。

在把 data 数组回写到 imageData 对象之后，调用 putImageData() 方法把图像数据绘制到画布上。最终得到了图像的黑白版。

当然，通过操作原始像素值不仅能实现灰阶过渡，还能实现其他功能。
要了解通过操作原始图像数据实现过滤器的更多信息，请参考 Ilmari Heikkinen的文章 "Making Image Filters with Canvas" （基于Canvas的图像过滤器）：(http://www.html5rocks.com/en/tutorials/canvas/imagefilters)。

**只有在画布“干净”的情况下（即图像并非来自其他域），才可以取得图像数据。如果画布“不干净”，那么访问图像数据时会导致 JavaScript 错误。**

### 合成

还有两个会用用到 2D 上下文中所有绘制操作的属性： globalAlpha 和 globalCompositionOperation。

其中， globalAlpha 是一个介于 0 到 1 之间的值 （包括 0 和 1），用于指定所有绘制的透明度。

默认值为0。如果所有后续操作都要基于相同的透明度，就可以先把 globalAlpha 设置为适当值，然后绘制，最后再把它设置回默认值0。

```
//drawing red rect
context.fillStyle = "#ff0000";
context.fillRect(10, 10, 50, 50);

//修改全局透明度
context.globalAlpha = 0.5;

//drawing blue rect
context.fillStyle = "rgba(0,0,255,1)";
context.fillRect(30, 30, 50, 50);

//重置全局透明度
context.globalAlpha = 0;
```

在这个例子中，我们把蓝色矩形绘制到了红色矩形上面。
因为在绘制蓝色矩形前，globalAlpha 已经被设置为 0.5，所以蓝色矩形会呈现半透明效果，透过它可以看到下面的红色矩形。

第二个属性 globalCompositionOperation 表示后绘制的图形怎样与先绘制的图形结合。
这个属性的值是字符串，可能的值如下：

- source-over（默认值）：会绘制的图形位于先绘制的图形上方。

- source-in：后绘制的图形与先绘制的图形重叠的部分可见，两者其他部分完全透明。

- source-out: 后绘制的图形与先绘制的图形不重叠的部分可见，先绘制图形不受影响。

- source-atop: 后绘制的图形与先绘制的图形重叠的部分可见，先绘制图形不受影响。

- destination-over: 后绘制的图形位于先绘制的图形下方，只有之前透明像素下的部分才可见。

- destination-in: 后绘制的图形位于先绘制的图形下方，两者不重叠的部分完成透明。

- destination-out: 后绘制的图形擦除与先绘制的图形重叠的部分。

- destination-atop: 后绘制的图形位于先绘制的图形下方，在两者不重叠的地方，先绘制的图形会变透明。

- lighter: 后绘制的图形与先绘制的图形重叠部分的值相加，使该部分变亮。

- copy: 后绘制的图形完全替代与之重叠的先绘制图形。

- xor: 后绘制的图形与先绘制的图形重叠的部分执行"异或"操作。

```
context.fillStyle = "#ff0000";
context.fillRect(10, 10, 50, 50);

context.globalCompositionOperation = "destination-over";

context.fillStyle = "rgba(0, 0, 255, 1)";
context.fillRect(30, 30, 50, 50);
```

如果不修改 globalCompositionOperation，那么蓝色矩形应该位于红色矩形之上。但把 globalCompositionOperation 设置为 "destination-over"之后，红色矩形跑到了蓝色矩形上面。

在使用 globalCompositionOperation 的情况下，一定要多测试一些浏览器。
因为不同浏览器对这个属性的实现仍然存在较大的差别。

Safari 和 Chrome 在这方面还有问题，至于有什么问题，大家自己去尝试咯！