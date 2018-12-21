# Date类型- 日期类型

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

**ECMAScript中的Date类型是在早期Java中的java.util.Date类基础上构建的。**

为此，Date类型使用自UTC（Universal Time Coordinated，国际协调时间）1970年1月1日午夜（零时）开始经过的毫秒数来保存日期。

在使用这种数据格式存储格式的条件下，**Date类型保存的日期能够精确到1970年1月1日之前或之后的100 000 000年。

要创建一个日期对象，使用new操作符和Date构造函数即可。

```
var now = new Date();
```

**在调用Date构造函数而不传递参数的情况下，新创建的对象自动获得当前日期和时间。**

如果**想根据特定的日期和时间创建日期对象，**必须传入表示该日期的毫秒数（即从UTC时间1970年1月1日午夜起至该日期止经过的毫秒数）。为了简化这一计算过程，ECMAScript提供了两个方法：

- Date.parse();
- Date.UTC();

其中，Date.parse()方法接收一个表示日期的字符窜参数，然后尝试根据这个字符窜返回相应日期的毫秒数。 ECMA-262没有定义Date.parse()应该支持哪种日期格式，因此这个方法的行为因实现而异，而且通常是因地区而异。

将地区设置为美国的浏览器通常都接受下列日期格式：

- “月/日/年”， 如6/13/2004；
- “英文月名 日，年”， 如January 12,2004;
- “英文星期几 英文月名 日 年 时：分：秒 时区”，如Tue May 25 2004 00:00:00 GMT-0700。
- ISO 8601 扩展格式 YYYY-MM-DDTHH:mm:ss.sssZ（例如 2004-05-25T00:00:00）。只有兼容ECMAScript 5的实现支持这种格式。

例如，要为2004年5月25日创建一个日期对象，可以使用下面的代码：

```

// Date.parse("May 25, 2004"); //1085414400000 
var someDate = new Date(Date.parse("May 25,2004"));



console.log(someDate); //Tue May 25 2004 00:00:00 GMT+0800 (中国标准时间)
```

**日期对象及其在不同浏览器中的实现有许多奇怪的行为。其中有一种倾向是将超出范围的值替换成当前的值，以便生出输出。例如，在解析“January 32, 2007”时，有的浏览器会将其解释为“February 1, 2007”。 而Opera则倾向于插入当前的月份的当前日期，返回“January当前日期，2007”。也就是说，如果在2007年9月21日运行前面的代码，将会得到“January 21，2007”（都是21日）。**

Date.UTC()方法同样也返回表示日期的毫秒数，但它与Date.parse()在构建值时使用不同的信息。Date.UTC()的参数分别是年份、基于0的月份（一月是0，二月是1，以此类推），月中的哪一天（1到31），小时数（0到23）、分钟、秒以及毫秒数。在这些参数中，只有前两个参数（年和月）是必须的。如果没有提供月中的天数，则假设天数为1；如果省略其他参数，则统统假设为0。

```
//GMT时间2000年1月1日午夜零时
var year2000 = new Date(Date.UTC(2000,0));
console.log(year2000);//Sat Jan 01 2000 08:00:00 GMT+0800 (中国标准时间) 要注意时区的差异啊

//GMT时间2005年5月5号下午5:55:55
var allFives = new Date(Date.UTC(2005,4,5,17,55,55));
console.log(allFives); // Fri May 06 2005 01:55:55 GMT+0800 (中国标准时间) 要注意时区的差异啊
```

这个例子创建了两个日期对象。第一个对象表示GMT时间2000年1月1日午夜零时，传入的值一个是表示年方的2000，一个是表示月份的0（即一月份）。因为其他参数是自动填充的（即月中的天数为1，其他所有参数均为0），所以结果就是该月第一天的午夜零时。第二个对象表示GMT时间2005年5月5日下午5:55:55，即使日期和时间中只含5，也需要传入不一样的参数：**月份必须是4（因为月份是基于0的）、小时必须设置为17（因为小时以0到23表示），剩下的参数就很直观了。**

如同模仿Date.parse()一样，Date构造函数也会模仿Date.UTC()，**但有一点明显不同：Date构造函数，创建的日期和时间是基于本地时间而非GMT来创建的。**

**不过，Date构造函数接收的参数仍然与Date.UTC()相同。因此，如果第一个参数是数值，Date构造函数就会假设改制是日期中的年份，而第二个参数是月份，以此类推。**

```
//本地时间2000年1月1日午夜零时
var year2000 = new Date(2000,0); //Sat Jan 01 2000 00:00:00 GMT+0800 (中国标准时间)

var allFives = new Date(5555,4,5,17,55,55); //Thu May 05 5555 17:55:55 GMT+0800 (中国标准时间)

```

**这次的日期都是基于系统设置的本地时区创建的。**

**ECMAScript5添加了Date.now()方法，返回表示调用这个方法时的日期和时间的毫秒数。这个方法简化了使用Date对象分析代码的工作。**

```
//取得开始时间
var start = Date.now(); //等价于 var start = new Date() - 0;

//调用函数
//doSomething();

//取得停止时间
var stop = Date.now();

var timeBetween = stop - start;

console.log(timeBetween);

//这个代码，读者朋友们可以浏览器控制台，自己打印出来玩下
```

支持Date.now()方法的浏览器包括IE9+、Firefox 3+、Safari 3+、Opera 10.5和Chrome。

**在不支持它的浏览器中**，使用 “+”运算符 和 “-”运算符，获取Date对象的时间戳，也可以达到同样的目的。

```
// + 运算符得到时间戳的语法示例
var start = + new Date(); 

// - 运算符得到运算符的语法示例
var stop = new Date() - 0;
```

## 继承的方法

与其他引用类型一样，Date类型也重写了toLocaleString()、toString()和valueOf()方法。
但这些方法返回的值与其他类型中的方法不同。

**Date类型的toLocaleString()会按照与浏览器设置的地区相适应的格式返回日期和时间。**

这大致意味着时间格式中会包含AM或PM，但不会包含时区信息（当然，具体的格式会因浏览器而异）。

而toString()方法则通常返回带有时区信息的日期和时间，其中时间一般以军用时间（即小时的范围是0到23）表示。

下面是在不同浏览器中调用toLocaleString()和toString()方法，输出PST（Pacific Standard Time，太平洋标准时间），时间2007年2月1日午夜零时的结果。

```
//IE8
toLocaleString() - Thursday, February 01, 2007 12:00:00 AM
toString() - Thu Feb 1 00:00:00 PST 2007

//Firfox 3.5
toLocaleString() - Thursday, February 01, 2007 12:00:00 AM
toString() - Thu Feb 01 2007 00:00:00 GMT-0800 (Pacific Standard Time)

//Safari4
toLocaleString() - Thursday, February 01, 2007 00:00:00
toString() - Thu Feb 01 2007 00:00:00 GMT-0800 (Pacific Standard Time)

//Chrome4
toLocaleString() - Thu Feb 01 2007 00:00:000 GMT-0800 (Pacific Standard Time)
toString() - Thu Feb 01 2007 00:00:00 GMT-0800 (Pacific Standard Time)

//Opera 10
toLocaleString() - 2/1/2007 12:00:00 AM
toString() - Thu, 01 Feb 2007 00:00:00 GMT-0800
```

显然，这两个方法在不同的浏览器中返回的日期和时间格式可谓大相径庭。
**事实上，toLocaleString()和toString()的这一差别仅在调试代码时比较有用，而在显示日期和时间时没什么价值。**

**至于Date类型的valueOf()方法，则根本不返回字符串，而是返回日期的毫秒表示。因此，可以方便使用比较操作符（小于或大于）来比较日期值。**

```
var date1 = new Date(2007,0,1);
var date2 = new Date(2007,1,1);

console.log(date1 < date2); // true;
console.log(date1 > date2); // false;
```

从逻辑上讲，2007年1月1日要早于2007年2月1日，此时如果我们说前者小于后者比较符合常理。而表示2007年1月1日的毫秒值小于表示2007年2月1日的毫秒值，因此在首先使用小于操作符比较日期时，返回的结果是true。 这样，就为我们比较日期提供了极大方便。

## 日期格式化方法

Date类型还有一些专门用于将日期格式化为字符串的方法，这些方法如下。

- toDateString() ——以特定于实现的格式显示星期几、月、日和年；
- toTimeString() ——以特定于实现的格式显示时、分、秒和时区；
- toLocaleDateString() ——以特定于地区的格式显示星期几、月、日和年；
- toLocaleTimeString() ——以特定于实现的格式显示时、分、秒；
- toUTCString() ——以特定于实现的格式显示完整的UTC日期；

**与toLocaleString()和toString()方法一样，以上这些字符窜格式方法的输出也是因浏览器而异的，因此没有哪一个方法能够用来在用户界面中显示一直的日期信息。**

**除了前面介绍的方法之外，还有一个名叫toGMTString()的方法，这是一个与toUTCString()等价的方法，其存在目的在于确保向后兼容。不过，ECMAScript推荐现在编写的代码一律使用toUTCString()方法。**

## 日期/时间组件方法

Date类型的方法（如下所示），都是直接取得和设置日期中特定部分的方法了。
**需要注意的是，UTC日期指的是在没有时区偏差的情况的日期值（将日期转换为GMT时间）。**

|方法|说明|
|:-:|:-:|
|getTime()|返回表示日期的毫秒数；与valueOf()方法返回的值相同|
|setTime()|以毫秒数设置日期，会改变整个日期|
|getFullYear()|取得4位数的年份|
|setFullYear()|设置日期的年份。传入的年份值必须是4位数字|
|setUTCFullYear()|设置UTC日期的年份。传入的年份值必须是4位数字|
|getMonth()|返回日期中的月份，其中0表示一月，11表示十二月|
|getUTCMonth()|返回UTC日期中的月份，其中0表示一月，11表示十二月|
|getDate()|返回日期月份中的天数（1到31天）|
|getUTCDate()|返回UTC日期月份中的天数（1到31天）|
|setDate()|设置日期月份中的天数。如果传入的值超过了该月中应有的天数，则增加月份|
|setUTCDate()|设置UTC日期月份中的天数。如果传入的值超过了该月中应有的天数，则增加月份|
|getDay()|返回日期中的星期几（其中0表示星期日，6表示星期六）|
|getUTCDay()|返回UTC日期中的星期几（其中0表示星期日，6表示星期六|
|getHours|返回日期中的小时数（0到23）|
|getUTCHours()|返回UTC日期中的小时数（0到23）|
|setHours()|设置日期中的小时数。传入的值超过了23则增加月份中的天数|
|setUTCHours()|设置UTC日期中的小时数。传入的值超过了23则增加月份中的天数|
|getMinutes()|返回日期的分钟数（0到59）|
|getUTCMinutes()|返回UTC日期中的分钟数（0到59）|
|setMinutes()|设置日期中的分钟数。传入的值超过59则增加小时数|
|setUTCMinutes()|设置UTC日期中的分钟数。传入的值超过59则增加小时数|
|getSeconds()|返回日期中的秒数（0到59）|
|getUTCSeconds()|返回UTC日期中的秒数（0到59）|
|setSeconds()|设置日期中的秒数。传入的值超过了59则增加小时数|
|setUTCSeconds()|设置UTC日期中的秒数。传入的值超过了59会增加分钟数|
|getMilliseconds()|返回日期中的毫秒数|
|getUTCMilliseconds()|返回UTC日期中的毫秒数|
|setMilliseconds()|设置日期中的毫秒数|
|setUTCMilliseconds()|设置UTC日期中的毫秒数|
|getTimezoneOffset()|返回本地时间与UTC时间相差的分钟数。例如，美国东部标准时间返回300。在某地进入夏令时的情况下，这个值会有所变化。|