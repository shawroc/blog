# Array——数组(二)

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 数组的栈方法

ECMAScript数组也提供了一种让数组的行为类似其他数据结构的方法。
具体来说，数组可以表现就像栈一样，
栈是一种可以限制插入和删除项的数据结构。
（那什么是“栈”，请自行维基百科，这对你理解数组的这两个内置方法很有帮助。）

**栈是一种LIFO(last-in-fist-out，后进先出)的数据结构。**
也就是最新添加的项最早被移除。

而栈中项的插入（叫做推入）和移除（叫做弹出），只发生在一个位置——栈的顶部。

**ECMAScript为数组专门提供了push()和pop()，以便实现类似栈的行为。**

- **push()方法可以接收任意数量的参数，把它们逐个添加到数组末尾，并返回修改后数组的长度。**
- **pop()方法则从数组末尾移除最后一项，减少数组的length值，返回移除的项。**

```
var colors = new Array(); 

var count = colors.push("red","green"); //返回值为数组的长度
console.log(count); //2, 返回值为数组的长度
console.log(colors); // "red,green"

count = colors.push("blue");
console.log(count); //3, 返回值为数组的长度
console.log(colors); // ["red","green","blue"];

var item = colors.pop(); //返回值为移除的项
console.log(item); //"blue"
console.log(colors.length); //2
```

## 数组的队列方法

栈数据结构的访问规则是LIFO（后进先出），而队列数据结构的访问规则是FIFO（First-In-First-Out，先进先出）。

可以把队列数据结构，想象成排队就餐。

队列在列表的末端添加项，从列表的前端移除项。

由于push()是向数组末端添加项的方法，因此要模拟队列只需一个从数组前端取得项的方法。
实现这一操作的数组方法就是shift()，它能够移除数组中的第一项并返回该项，同时将数组长度减1。

**结合使用shift()和push()方法，可以像使用队列一样使用数组。**

```
var colors = new Array();
var count = colors.push("red","green"); // 推入两项
console.log(count); //2

count = colors.push("blue"); // 推入另外一项
console.log(count); //3

var item = colors.shift(); //取得第一项，并移除数组中的第一项
console.log(item); //"red"
console.log(colors); // ["green","blue"]
```

这个例子首先使用push()方法创建了一个包含3种颜色名称的数组。
使用shift()方法从数组中取得了第一项，即“red”。
在移除第一项之后，“green"就变成了第一项，而“blue”则变成了第二项，数组也只包含两项了。

ECMAScript还为数组提供了一个unshift()方法。
顾名思义，unshift()与shift()的用途相反：
它能在数组前端添加任意个项并返回新数组的长度。

因此，同时使用unshift()和pop()方法，可以从相反的方向来模拟队列，即在数组的前端添加项，从数组末端移除项。

```
var colors = new Array();
var count = colors.unshift("red","green"); //在数组的前端推入两项
console.log(count); //2

count = colors.unshift("blue"); //在数组的前端推入一项
console.log(count); //3

console.log(colors); // ["blue","red","green"]

var item = colors.pop(); //取得数组的最后一项
console.log(item); //"green"
console.log(colors.length); //2

```

以上代码创建了一个数组并使用unshift()方法先后推入了3个值。
首先是“red”和“green”，然后是“blue”， 数组中各项的顺序为“blue”、“red”、“green”。
在调用pop()方法时，移除并返回的是最后一项，即“green”。


**（此处可以忽略），IE7及更早版本对JavaScript的实现中存在一个偏差，其unshift()总是返回undefined而不是数组的新长度。IE8在非兼容模式下会返回正确的长度值。**

## 数组的重排序方法

数组中存在两个可以直接用来重排序的方法：reverse()和sort()。

- reverse()，倒转。
- sort()，排序

```
var values = [1,2,3,4,5];

values.reverse();

console.log(values); //[5, 4, 3, 2, 1]
```

这里数组的初始值及顺序是1、2、3、4、5。 调用数组的reverse()方法后，其值的顺序变成了5、4、3、2、1。这个方法的作用相当直观明了，但不够灵活，因此才有了sort()方法。

在默认情况下， sort()方法按升序排列数组项——即最小的值位于最前面，最大的值排在最后面。

**为了实现排序，sort()方法会调用每个数组项的toString()转型方法，然后比较得到的字符窜，以确定如何排序。即使数组中的每一项都是数值，sort()方法比较的也是字符串。**

```
var values = [0,1,5,10,15];

values.sort();

console.log(values); // [0,1,10,15,5]
```

即使例子中原先值的顺序没有问题，但sort()方法也会根据测试字符串的结果改变原来的顺序。

**因为数值5虽然小于10，但在进行字符串比较时，"10"则位于"5"的前面。于是数组的顺序就被修改了。**

很反直觉，这种排序方式在很多情况下都不是最佳方案。

**因此，sort()方法可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值的前面。**

比较函数接收两个参数，如果第一个参数应该位于第二个之前则返回一个负数，如果两个参数相等则返回0，如果第一个参数应该位于第二个之后则返回一个正数。

```

function compare(value1, value2) {
    if(value1 < value2) {
        return -1;
    } else if(value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}

```

这个比较函数可以适用于大多数数据类型，只要将其作为参数传递给sort()方法即可。

```
var values = [0,1,5,10,15];

values.sort(compare); 

console.log(values); //[0,1,5,10,15];

function compare(value1, value2) {
    if(value1 < value2) {
        return -1;
    } else if(value1 > value2) {
        return 1;
    } else {
        return 0;
    }
};
```

在将比较函数传递到sort()方法之后，数值仍然保持了正确的升序。当然，也可以通过比较函数产生降序排序的结果，只要交换比较函数返回的值即可。

```

function compare(value1, value2) {
    if(value1 < value2) {
        return 1;
    } else if(value1 > value2) {
        return -1;
    } else {
        return 0;
    }
}

var values = [0,1,5,10,15];

values.sort(compare);

console.log(values); // [15,10,5,1,0]
```

交换返回值的意思是让更大的值排位更靠前，也就是对数组按照降序排列。
当然，如果只想数组原来的顺序，使用reverse()方法更快一些。

**reverse()和sort()方法的返回值是经过排序之后的数组。**

对于数值类型或者其valueOf()方法会返回数值，可以使用一个更简单的比较函数。这个函数只要用第二个值减第一个值即可。

```

var values = [0,1,5,10,15];

function compare(value1, value2) {
    return value2 - value1;
}

values.sort(compare); // [15,10,5,1,0];

function compare2(value1, value2) {
    return value1 - value2; 
}

values.sort(compare2); // [0,1,5,10,15]
```

**由于比较函数通过返回一个小于零、等于零或大于零的值来影响排序结果，因此减法操作就可以适当处理所有这些情况。**

