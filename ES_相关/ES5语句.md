# 语句

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

ECMA-262规定了一组语句（也成为流程控制语句）。本质上看，语句定义了ECMAScript中的主要语法，语句通常使用一或多个关键字来完成给定任务。语句可以很简单，例如通知函数退出，也可以比较复杂，例如指定重复执行某个命令的次数。

## if语句

大多数编程语言中最为常用的一个语句就是if语句。if语句的语法：

```
if (condition) statement1 else statement2
```

其中的condition（条件）可以是任意表达式；**而且对这个表达式求值的结果不一定是布尔值。**
**ECMAScript会自动调用Boolean()转换函数将这个表达式的结果转换为一个布尔值。**如果对condition求值的结果是true，则执行statement1（语句1），如果对condition求值的结果是false，则执行statement2（语句2）。而且这两个语句可以是一行代码，也可以是一个代码块（以一对花括号括起来的多行代码）。

```
if ( i > 25 ) console.log("greater than 25."); else console.log("less than 25.");
```

**不过，业界普遍推崇的最佳实践是始终使用代码块，即使要执行的只有一行代码。因为这样可以消除人们的误解，否则可能让人分不清在不同条件下要执行哪些语句。**

另外，也可以像下面这样把整个if语句写在一行代码中：

```
if (condition1) statement1 else if(condition2) statement2 else statement3
```

推荐的做法则是像下面这样：

```
if (i > 25) {
    console.log("Greater than 25.");
} else if (i < 0) {
    console.log("Less than 0.");
} else {
    console.log("another number");
}
```

## do-while语句

do-while语句是一种后测试循环语句，即只有在循环体中的代码执行之后，才会测试出口条件。
换句话说，在对条件表达式求值之前，循坏体内的代码至少会被执行一次。

```

do {
    statement
} while(expression)

```

示例

```
var i = 0;

do {
    i++;
} while(i < 10);

console.log(i); //10
```

**do-while这种后测试循环语句最常用于循环体重的代码至少要被执行一次的情形。**

## while语句

while语句属于前测试循环语句，也就是说，在循环体内的代码被执行之前，就会对出口条件求值。
因此，循环体内的代码有可能永远不会被执行。

while语句的语法：

```
while(expression) statement;
```

示例

```
var i = 0;

while(i < 10) {
    i ++;
    console.log(i); //1,2,3,4,5,6,7,8,9,10
};

console.log(i); //10
```

在这个例子中，变量i开始时的值为0，每次循环都会递增1。而只要i的值小于10，循环就会继续下去。

## for语句

for语句也是一种前测试循环语句，但它具有在执行循环之前初始化变量和定义循环后要执行的代码的能力。

```
for (initialization; expression; post-loop-expression) statement;
```

for循环示例

```
var count = 10;

for (var i = 0; i < count; i ++) {
    console.log(i); //0,1,2,3,4,5,6,7,8,9
}
```

以上代码定义了变量i的初始值为0。只有当条件表达式i < count返回true的情况下才会进入for循环，因此也有可能不会执行循环体内的代码。**如果执行了循环体内的代码，则一定会对循环后的表达式（i++）求值，即递增i的值。这个for循环语句与下面的while语句的功能相同。

```
var count = 10;
var i = 0;

while(i < count) {
    console.log(i); //0,1,2,3,4,5,6,7,8,9
    i ++;
}
```

使用while循环做不到的，使用for循环同样做不到。 也就是说，for循环只是把与循坏有关的代码集中在了一个位置。

**有必要的指出的是，在for循环的变量初始化表达式中，也可以不使用var关键字。该变量的初始化可以在外部执行。**

```
var count = 10;
var i;

// i++在语句执行以后才会完成赋值
for(i = 0; i < count; i ++) {
    console.log(i); // 0,1,2,3,4,5,6,7,8,9
}
```

以上代码与在循环初始化表达式中声明变量的效果是一样的。由于ECMAScript中不存在块级作用域，因此在循环内部定义的变量也可以在外部访问到。

```
var count = 10;
var i = 0;

while(i < count) {
    console.log(i); //0,1,2,3,4,5,6,7,8,9
    i ++;
} 

console.log(i); //10

```

在这个例子中，控制台显示循环完成后变量i的值，这个值是10。这是因为，即使i是在循环内部定义的一个变量，但在循环外部仍然可以访问到它。

此外，**for语句中的初始化表达式、控制表达式和循环后表达式都是可选的。**

**将这三个表达式全部省略，就会创建一个无限循环。**

```
for(;;) {//无限循环
    doSomething();
}
```

而只给出控制表达式实际上就把for循环转换成了while循坏。

```
var count = 10;
var i = 0;

for(; i < count; ) {
    console.log(i); //0, 1,2,3,4,5,6,7,8,9
    i ++;
    console.log(i); //1,2,3,4,5,6,7,8,9,10
}
```

由于for语句存在极大的灵活性，因此它也是ECMAScript中最常用的一个语句。

## for-in 语句

**for-in语句是一种精准的迭代语句，可以用来枚举对象的属性。**以下是for-in语句的语法。

```
for (property in expression) statement
```

示例

```
for (var propName in window) {
    document.write(propName);
}
```

在这个例子中，使用for-in循环来显示了BOM中window对象的所有属性。每次执行循环时，都会将window对象中存在的一个属性名赋值给变量propName。这个过程会一直持续到对象中的所有属性都被枚举一遍为止。与for语句类似，这里控制语句中的var操作符也不是必需的，为了保证使用局部变量，推荐上面例子中的这种做法。

ECMAScript对象的属性没有顺序。因此，通过for-in循环输出的属性名的属性是不可预测的。具体来讲，所有属性都会被返回一次，但返回的先后次序可能会因浏览器而异。

**但是，如果表示要迭代的对象的变量值为null或undefined，for-in语句会抛出错误。ES5更正了这一行为；对这种情况不再抛出错误，而只是不执行循环。为了保证最大限度的的兼容性，建议在使用for-in循环之前，先检测该对象的值不是null或undefined。**

## label语句

使用label语句可以在代码中添加标签，以便将来使用。

label: statement

示例

```
start: for(var i = 0; i < count; i++) {
    console.log(i); 
}
```

这个例子中定义的start标签可以在将来由break或continue语句引用。加标签的语句一般都要与for语句等循环语句配合使用。

## break和continue语句

break和continue语句用于在循环中精确地控制代码的执行。其中，break语句会立刻退出循环，强制继续执行循环后面的语句。而continue语句虽然也是立即退出循环，但退出循环后从循坏的顶部继续执行。

```
var num = 0;

for(var i = 1; i < 10; i ++) {
    if (i % 5 === 0) {
        break;
    }
    num ++; //1,2,3,4
}

console.log(num); //4
```

这个例子中的for循环会将变量i由1递增至10。在循环体内，有一个if语句检查i的值是否可以被5整除（使用求模操作符）。如果是，则执行break语句退出循环。另一方面，变量num从0开始，用于记录循环执行的次数。在执行break语句之后，要执行的下一行代码是console.log(num)，结果显示4。也就是说，在变量i等于5时，num++总共执行了4次；而break语句的执行，导致了循环在num再次递增之前就退出了。如果在这里把break替换成continue，则可以看到另外一种结果。

```
var num = 0;

for(var i = 1; i < 10; i ++) {
    if( i % 5 === 0) {
        continue;
    }
    num ++; //1,2,3,4,5,6,7,8
}

console.log(num); //8
```

例子的结果显示8，也就是num++总共执行了8次。当变量i等于5时，循环会在num再次递增之前退出，但接下来执行的是下一次循环，即i的值等于6的循环。于是，循环又继续执行，直到i等于10时自然结束。而num的最终值之所以是8，是因为continue语句导致它少递增了一次。

break和continue语句都可以与label语句联合使用，从而返回代码中特定的位置。
这种联合使用的情况多发生在循环嵌套的情况下。

```
var num = 0;

outermost:
for(var i = 0; i < 10; i++) {
    for(var j = 0; j < 10; j++) {
        if( i == 5 && j == 5) {
            break outermost; //break打断的是外层循环
        }
        num ++;
    }
}

console.log(num); //55

```

在这个例子中，outermost标签表示外部的for语句。如果每个循环正常执行10次，则num++语句就会正常执行100次。换句话说，如果两个循环都自然结束，num的值应该是100。但内部循环中的break语句带了一个参数：要返回到的标签。添加这个标签的结果将导致break语句不仅会退出内部的for语句（即使用变量j的循环），而且也会退出外部的for语句（即使用变量i的循环）。为此，当变量i和j都等于5时，num的值正好是55。同样，continue语句也可以像这样与label语句联用。

```
var num = 0;

outermost: 
for(var i = 0; i < 10; i ++) {
    for(var j = 0; j < 10; j ++) {
        if(i == 5 && j == 5) {
            continue outermost;
        }
        num ++;
    }
}

console.log(num); //95
```

在这种情况，continue语句会强制继续执行循环——退出内部循环，执行外部循环。当j是5时，continue语句执行，而这也意味着内部循环少执行了5次，因此num的结果是95。

虽然联用break、continue和label语句能够执行复杂的操作，但如果使用过度，也会给调试带来麻烦。在此，我们建议如果使用label语句，一定要使用描述性的标签，同时不要使用过多的循环。

## with语句

**with语句的作用是将代码的作用域设置到一个特定的对象中。with语句的语法如下：

```
with (expression) statement
```

定义with语句的目的主要是为了简化多次编写同一个对象的工作。

```
var qs = location.search.substring(1);
var hostName = location.hostname;
var url = location.href;
```

上面几行代码都包含location对象。如果使用with语句，可以把上面的代码改写成如下所示：

```
with(location) {
    var qs = search.substring(1);
    var hostName = hostname;
    var url = href;
}
```

在这个重写后的例子中，使用with语句关联了location对象。这意味着在with语句的代码内部，每个变量首先被认为是一个局部变量，而如果在局部环境中找不到该变量的定义，就会查询location对象中是否有同名的属性。如果发现了同名属性，则以location对象属性的值作为变量的值。

**严格模式下不允许使用with语句，否则将被视为语法错误。**

由于大量使用with语句会导致性能下降，同时也会给调试代码造成困难，因此在开发大型应用程序时，不建议使用with语句。

## switch语句

switch语句与if语句的关系最为亲密，而且也是在其他语言中普遍使用的一种流程控制语句。
ECMAScript中switch语句的语法与其他基于C语言非常接近。

```
switch (expression) {
    case value: statement
        break;
    case value: statement
        break;
    case value: statement
        break;
    case value: statement
        break;
    
    default: statement
}
```

switch语句中的每一种情形（case）的含义是：“如果表达式等于这个值（value）。则执行后面的语句（statement）”。而break关键字会导致代码执行流跳出switch语句。如果省略break关键字，就会导致执行完当前case后，继续执行下一个case。最后的default关键字则用于在表达式不匹配前面任何一种情形的时候，执行机动代码（因此，也相当于一个else语句）。


从根本上讲，switch语句就是为了让开发人员免于编写像下面这样的代码：

```
if( i == 25 ) {
    console.log("25");
} else if( i == 35) {
    console.log("35");
} else if ( i == 45) {
    console.log("45")
} else {
    console.log("other");
}
```

而与此等价的switch语句如下：

```
switch(i) {
    case 25: 
    console.log("25");
    break;

    case 35:
    console.log("35");
    break;

    case 45:
    console.log("45");
    break;

    default:
    console.log("other");
}

```

通过为每个case后面都添加一个break语句，就可以避免同时执行多个case代码的情况。
假如确实需要混合几种情形，不要忘了在代码中添加注释，说明你是有意省略了break关键字。

```
switch(i) {
    case 25:
        /*合并两种情形*/
    case 35:
    console.log("25 or 35");
    break;

    case 45:
    console.log("45");
    break;

    default:
    console.log(other);
}
```

**虽然ECMAScript中的switch语句借鉴自其它语言，但这个语句也有自己的特色。**
**首先，可以在switch语句中使用任何数据类型（在很多其它语言中只能使用数值），无论是字符串，还是对象都没有问题。其次，每个case的值不一定是常量，可以是变量，甚至是表达式。**

```
switch("hello world") {
    case "hello" + " world":
    console.log("Greeting was found.");
    break;

    case "goodbye":
    console.log("Closing was found.");
    break;

    default:
    console.log("Unexpected message was found.");
}

//"Greeting was found."
```

在这个例子中，switch语句使用的就是字符串。
其中，第一种情形实际上是一个队字符串拼接操作求值的表达式。由于这个字符串拼接表达式的结果与switch的参数相等，因此结果就会显示"Greeting was found."。而且，使用表达式作为case值还可以实现下列操作：

```
var num = 25;
switch(true) {
    case num < 0:
    console.log("less than 0.");
    break;

    case num >=0 && num <- 10:
    console.log("Between 0 and 10.");
    break;

    case num > 10 && num <= 20:
    console.log("Between 11 and 20.");
    break;

    default:
    console.log("More than 20.");
}

```

这个例子首先在switch语句外面声明了变量num。而之所以给switch语句传递表达式true，是因为每个case值都可以返回一个布尔值。

这样，每个case按照顺序被求值，直到找到匹配的值或者遇到default语句为止。

**switch语句在比较值时使用的是全等操作符，因此不会发生类型转换（例如，字符串“10”不等于数值10）。**