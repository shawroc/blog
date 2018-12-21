# 闭包

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方翻译的差强人意，所以用自己所理解的，尝试解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

**闭包是指有权访问另一个作用域中的变量的函数。**

创建闭包的常见方式， 就是在一个函数内部创建另外一个函数。

```

function createComparisonFunction(propertyName) {

    return function(object1, object2) {

        var value1 = object1[propertyName]; 
        // 注意， return出的匿名函数访问了外部函数中的变量propertyname
        var value2 = object2[propertyName];
        // 注意， return出的匿名函数访问了外部函数中的变量propertyname

        if(value1 < value2) {
            return -1;
        } else if (value > value2) {
            return 1;
        } else {
            return 0;
        }

    }
}

```

在这个例子中，突出的那两行代码是内部函数（一个匿名函数）中的代码，这两行代码访问了外部函数中的变量propertyName。

即使这个内部函数被返回了，而且是在其他地方被调用了，但它仍然可以访问变量propertyName。

之所以还能够访问这个变量，是因为内部函数的作用域链中包含createComparisonFunction()的作用域。

**当某个函数被调用时，会创建有一个执行环境（execution context）以及相应的作用域链。**
**然后，使用arguments和其他命名参数的值来初始化函数的活动对象（activation object)。**

但在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象始终处于第三位，...直至作为作用域链重点的全局执行环境。

**在函数执行过程中，为读取和写入变量的值，就需要在作用链中查找变量。**

```
function compare(value1, value2) {
    if(value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}

var result = compare(5,10);
```

以上代码先定义了compare()函数，然后又在全局作用中调用了它。

当调用compare()时，会创建一个包含arguments、value1和value2的活动对象。

全局执行环境的变量对象(包含result和compare)在compare()执行环境的作用链中处于第二位。

```

function compare(value1, value2) {
    if(value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}

var result = compare(5,10);

//作用域链伪代码
/*
compare[[scope]] = {
    global variable: {
        result, compare
    }, 
    local variable: {
        arguments: [5, 10],
        value1 : 5,
        value2： 10
    }
}
*/

```

**后台的每个执行环境都有一个表示变量的对象——变量对象。**
**全局环境的变量对象始终存在，而compare()函数这样的局部环境的变量对象，则只在函数执行的过程中存在。**

在创建compare()函数时，会创建一个预先包含全局变量对象的作用域链，这个作用域链被保存在内部的\[[Scope]]属性中。

当调用compare()函数时，会为函数创建一个执行环境，然后通过复制函数的\[[Scope]]属性中的对象构建起执行环境的作用域链。此后，本地活动对象（也可以说是函数执行时，内部的变量）被创建并被推入执行环境作用域的前端。

**对于函数的执行环境而言，其作用域链中包含两个变量对象:**

**1. 本地活动对象。**

**2. 全局变量对象。**


**作用域链本质上是一个指向变量对象的指针列表，它只引用但不包含变量对象。**

无论什么时候在函数中访问一个变量时，就会从作用域链中搜索具有相应名字的变量。一般来讲，当函数执行完毕后，局部活动对象就会被销毁，内存中仅保存全局作用域（全局执行环境的变量对象）。

但是，闭包的情况又有所不同。

在另一个函数内部定义的函数会将包含函数（即外部函数）的活动对象添加到它的作用链中。
因此， 在createComparisonFunction()函数内部定义的匿名函数的作用域链中，实际上将会包含外部函数createComparisonFunction()的活动对象。

```

function createComparisonFunction(propertyName) {

    return function(object1, object2) {

        var value1 = object1[propertyName];
        var value2 = object2[propertyName];

        if(value1 < value2) {
            return -1;
        } else if(value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }

}

// 注意调用createComparisonFunction的返回值仍然是一个函数。
var compare = createComparisonFunction("name");
/*
createComparisonFunction[[Scope]] = {
    global Variable: {
        createComparisionFunction
    },
    local Variable: {
        arguments: ["name"],
        propertyName: "name"
    }
}

*/

var result = compare({name: "Nicholas"}, {name:"Greg"});

/*
compare[[Scope]] = {
    global Variable: {
        createComparisonFunction
    },
    local Variable: {
        arguments: [{name: "Nicholas"}, {name:"Greg"}],
        value1: arguments[0][propertyName],
        value2: arguments[1][propertyName]
    }
}

//propertyName仍然引用createComparisonFunction中的propertyName
*/

```

**createComparisonFuncion()函数在执行完毕后，其活动对象也不会被销毁，因为匿名函数的作用域链仍然在引用这个活动对象。**

换句话说， 当createComparisonFunction()函数返回后， 其执行环境的作用域链会被销毁，但它的活动对象仍然会留在内存中；直到匿名函数被销毁后，createComparisonFunction()的活动对象想象才会销毁。

```

//创建函数
var compareNames = createComparisonFunction("name");

//调用函数
var result = compareNames({name: "Nicolas"}, { name: "Greg"});

//接触对匿名函数的引用（以便释放内存），当然如果你就是需要使用该变量，那么就不用释放了，也要看情况的。
compareNames = null;
```

由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存。过度使用闭包可能会导致内存占用过多，因此建议只在绝对必要时再考虑使用闭包。虽然像V8等优化后的JavaScript引擎会尝试回收被闭包占用的内存，但是还是要慎重的使用闭包。
