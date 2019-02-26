# Array——数组(三)

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

## 数组的操作方法

ECMAScript为操作已经包含在数组中的项提供了很多方法。

### contact()方法

其中，concat()方法可以基于当前数组中的所有项创建一个新数组。

具体来说，这个方法会先创建当前数组一个副本，然后将接收到参数添加到这个副本的末尾，最后返回新构建的数组。

在没有给concat()方法传递参数的情况下，它只是复制当前数组并返回副本。
如果传递给concat()方法的是一或多个数组，则该方法会将这些数组中的每一项都添加到结果数组中。

如果传递的值不是数组，这些值就会被简单地添加到结果数组的末尾。

```

var colors = ["red", "green", "blue"];

var colors2 = colors.concat("white", colors);

console.log(colors); // ["red","green","blue"]

console.log(colors2); // ["red", "green", "blue", "white", "red", "green", "blue"];

```

以上代码开始定义了一个包含3个值的数组colors。
然后基于colors调用了concat()方法。
并传入字符串“white”和colors数组。
最终，colors2数组包含了"red", "green", "blue", "white", "red", "green", "blue"。 
原来的数组colors，其值仍然保持不变。

### slice()方法

slice()方法，它能够基于当前数组中的一或多个项创建一个**新数组**。
slice()方法接收一或两个参数，即要返回项的起始和结束为止。

**在只有一个参数的情况下，slice()方法返回从该参数指定位置开始到当前数组末尾的所有项。**

**slice()方法不会影响原始数组。**

```
var colors = ["red","green","blue","yellow","purple"];
var colors2 = colors.slice(1);
var colors3 = colors.slice(1,4);

console.log(colors2); //["green","blue","yellow","purple"]
console.log(colors3); //["green","blue","yellow"]

```

在这个例子中，开始定义的数组colors包含5项。
调用slice()并传入1会得到一个包含4项的新数组。
因为是从位置1开始复制，所以会包含"green"而不会包含"red"。
这个新数组colors2中包含的是"green","blue","yellow","purple"。

再次调用slice()并传入了1和4，表示复制从位置1开始，到位置3结束。

结果数组colors3中包含了"green","blue","yellow"。

**如果slice()方法的参数中有一个负数，则用数组长度加上该数来确定相应的位置。 例如：在一个包含5项的数组上调用slice(-2,-1)与调用slice(3,4)得到的结果相同。 如果结束位置小于起始位置，则返回空数组。**

### splice()方法

splice()方法，算是最强大的数组方法了，它有很多种用法。

**splice()的主要用途是向数组的中部插入项。**

- 删除: 可以删除任意数量的项，只需指定2个参数：要删除的第一个项和要删除的项数。例如： splice(0,2)会删除数组中的前两项。
  
- 插入：可以向指定位置插入任意数量的项，只需提供3个参数：起始位置、要删除的项数和要插入的项。如果要插入多个项，可以再传入第四、第五，以至任意多个项。例如：splice(2,0,"red","green")会从当前数组的位置2开始插入字符串"red"和"green"。
  
- 替换：可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定3个参数：起始位置、要删除的项数和要插入的任意数量的项。插入的项数不必与删除的项数相等。例如：splice(2,1,"red","green")会删除当前数组位置2的项，然后再从位置2开始插入字符窜"red"和"green"。

splice()方法始终会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何项，则返回一个空数组）。

```
var colors = ["red","green","blue"];
var removed = colors.splice(0,1); // removed first item "red"

console.log(colors); // ["green","blue"]
console.log(removed); // ["red"]

removed = colors.splice(1,0,"yellow","orange"); //从位置1开始插入两项
console.log(colors); //["green","yellow","orange","blue"]
console.log(removed); //如果没有删除任何项，则返回一个空数组 []

removed = colors.splice(1,1,"red","purple"); // 插入两项，删除一项
console.log(colors); //["green","red","purple","orange","blue"]
console.log(removed); // ["yellow"]
```

上面的例子首先定义了一个包含3项的数组colors。

第一次调用splice()方法只是删除了这个数组的第一项，之后colors还包含"green"和"blue"两项。

第二次调用splice()方法时在位置1插入了两项，结果colors中包含"green"、"yellow"、"orange"和"blue"。 这一次操作没有删除项，因此返回了一个空数组。

最后一次调用splice()方法删除了位置1处的一项，然后又插入了"red"和"purple"。

在完成以上操作，数组colors中包含的是"green"、"red"、"purple"、"orange"和"blue"。

## 数组的位置方法

ECMAScript5为数组实例添加了两个位置方法: indexOf()和lastIndexOf()。

这两个方法都接收两个参数：

- 要查找的项和（可选的）表示查找起点位置的索引。

其中，indexOf()方法从数组的开头(位置0)开始向后查找, lastIndexOf()方法则从数组的末尾（length-1)开始向前查找。

这两个方法都返回要查找的项在数组中的位置，或者在没找到的情况下返回-1。在标胶第一个参数与数组中的每一项时，会使用全等操作符。 也就是说，要求查找的项必须严格相等（就像使用===一样）。

```
var numbers = [1,2,3,4,5,4,3,2,1];

console.log(numbers.indexOf(4)); // 值4，从左往右，在numbers数组的索引为3
console.log(numbers.lastIndexOf(4)); // 值4，从右往左，在numbers数组的索引为5

console.log(numbers.indexOf(4,4)); // 值4，从左往右, 从numbers数组起始索引4处开始查找，查找到4位于数组的索引为5

console.log(numbers.lastIndexOf(4,4)); //值4，从右往左, 从numbers数组起始索引4处开始查找，查找到4位于数组的索引为3

var person = { name: "Shaw"};
var people = [{ name: "Roc"}];

var morePeople = [person];

console.log(morePeople.indexOf(person)); //0
console.log(people.indexOf(person)); // -1

```

## 数组的迭代方法

ECMAScript5为数组定义了5个迭代方法。

每个方法都接收两个参数：要在每一项上运行的函数和 **（可选的）运行该函数的作用域对象——影响this的值。**

**传入这些方法中的函数会接收三个参数：**

1. **数组项的值**
2. **该项在数组中的位置**
3. **数组对象本身**

根据使用的方法不同，这个函数执行后的返回值可能会也可能不会影响方法的返回值。以下是这5个迭代方法的作用。

- every(): 对数组中的每一项运行给定函数，如果该函数对每一项都返回true，则返回true。
- filter(): 对数组中的每一项运行给定函数，返回该函数会返回true的项组成的数组。
- forEach(): 对数组中的每一项运行给定函数，这个方法没有返回值。
- map(): 对数组中的每一项运行给定函数，返回每次调用的函数结果组成的数组。
- some(): 对数组中的每一项运行给定函数，如果该函数对任一项返回true，则返回true。

**以上方法都不会修改数组中的包含的值。**

在这些方法，**最相似的是every()和some()，它们都用于查询数组中的项是否某个条件。**

**对every()来说，传入的函数必须对每一项返回true，这个方法才返回true；否则，它就返回false。**

**而some()方法则是只要传入的函数对数组中的某一项返回true，就会返回true。**

```

var numbers = [1,2,3,4,5,4,3,2,1];

var everyResult = numbers.every(function(item, index, array) {
    return (item > 2);
});

console.log(everyResult); //false

var someResult = numbers.some(function(item, index, array) {
    return (item > 2);
});

console.log(someResult); // true

```

以上代码调用了every()和some()，传入的函数只要给定项大于2就会返回true。

对于every()，它返回的是false，因为只有部分数组项符合条件。

对于some(), 结果就是true，因为至少有一项是大于2的。

### filter()方法

filter是过滤器的意思，这个方法很好记。

filter()方法，它利用指定的函数确定是否在返回的数组中包含某一项。

例如，要返回一个所有数值都大于2的数组。

```

var numbers = [1,2,3,4,5,4,3,2,1];

var filterResult = numbers.filter(function(item, index, array) {
    return (item > 2);
});

console.log(filterResult); //[3,4,5,4,3]
```

通过调用filter()方法创建并返回了包含3、4、5、4、3的数组，因为传入的函数对它们每一项都返回true。**这个方法对查询符合某些条件的所有数组项非常有用。**

### map()方法

map是映射的意思。

**map()也返回一个数组，而这个数组的每一项都是在原始数组中的对应项上运行传入函数的结果。**

例如，可以给数组中的每一项乘以2，然后返回这些乘积组成的数组。

```
var numbers = [1,2,3,4,5,4,3,2,1];

var mapResult = numbers.map(function(item, index, array) {
    return item * 2;
})

console.log(mapResult); //[2, 4, 6, 8, 10, 8, 6, 4, 2]
```

以上代码返回的数组中包含给每个数乘以2之后的结果。这个方法适合创建包含的项与另一个数组，一一对应的数组。

### forEach()方法

forEach()方法，它只是对数组中的每一项运行传入的函数。**这个方法没有返回值，本质上与使用for循环迭代数组一样。**

```

var numbers = [1,2,3,4,5];

//这个方法没有返回值
numbers.forEach(function(item, index, array) {
    //执行某些操作
});

/*
//本质上与使用for循环迭代数组一样。
for(var i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}
*/

```

支持这些迭代方法的浏览器有IE9+、Firefox 2+、Safari 3+、Opera 9.5+和Chrome。


## 数组的归并方法

**ECMAScript 5还新增了两个归并数组的方法：reduce()方法和reduceRight()方法。**

这两个方法都会迭代数组的所有项，然后构建一个最终返回的值。

**其中，reduce()方法从数组的第一项开始，逐个遍历的最后。**

**而reduceRight()则从数组的最后一项开始，向前遍历到第一项。**

这两个方法都接收两个参数：一个在每一项上调用的函数和（可选的）作为基础的初始值。

传给reduce()和reduceRight()的函数接收4个参数：

- 前一个值（previous value）
- 当前值 （current value）
- 项的索引（index）
- 数组对象（array）

这个函数返回的任何值都会作为第一个参数自动传给下一项。
第一次迭代发生在数组的第二项上，因此第一个参数是数组的第一项，第二个参数就是数组的第二项。

使用reduce()方法可以执行球数组中所有值之和的操作。

```
var numbers = [1,2,3,4,5];

var sum =  numbers.reduce(function(preValue, curValue, index, array) {
    return preValue + curValue;
});

console.log(sum); //15
```

**第一次执行回调函数，preValue是1，curValue是2。**

**第二次，preValue是3，curValue是3。**

**第三次，preValue是6，curValue是4。**

...以此类推

这个过程会持续到把数组中的每一项都访问一遍，最后返回结果。

reduceRight()的作用类似，只不过方向相反而已。

```
var values = [1,2,3,4,5];

var sum = values.reduceRight(function(pre, cur, index, array) {
    return pre + cur;
});

console.log(sum); //15
```

**在reduceRight()中，第一次执行回调函数，prev是5，cur是4。**
当然最终结果相同，，因为执行的都是简单相加的操作。

**使用reduce()还是reduceRight()，主要取决于要从哪头开始遍历数组。除此之外，它们完全相同。**

支持这两个归并函数的浏览器有IE9+、Firefox 3+、Safari 4+、Opera 10.5和Chrome。