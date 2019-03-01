## 模块模式

---
前言：最近在细读Javascript高级程序设计，对于我而言，中文版，书中很多地方一笔带过，所以用自己所理解的，尝试细致解读下。如有纰漏或错误，会非常感谢您的指出。文中绝大部分内容引用自《JavaScript高级程序设计第三版》。

---

模块模式（module pattern），是由道格拉斯提出的。

何为“模块模式”，为单例对象创建私有变量和特权方法。

何为“单例对象”，singleton，指的是只有一个实例对象。

按照惯例，JavaScript是以对象字面量的方式来创建单例对象的。

```

var singleton = {
    name: value,
    method: function() {
        //这里是方法的代码
    }
}

```

模块模式通过为单例添加私有变量和特权方法能够使其得到增强，其语法形式如下：

```

var singleTon = function() {

    //私有变量
    var privateVariable = 10;
    
    //私有函数
    function privateMethod() {
        return false;
    }

    //特权方法（公有方法） 和 属性
    return {

        publicProperty: true,

        publicMethod: function(){
            privateVariable ++;
            return privateMethod();
        }
    }

}

```

这个模块模式使用了一个返回对象的匿名函数。
在这个匿名函数内部，首先定义了私有变量和函数。
然后，将一个对象字面量作为函数的值返回。
返回的对象字面量只包含可以公开的属性和方法。
由于这个对象是在匿名函数内部定义的，因此它的公有方法有权访问私有变量和函数。

从本质上讲，这个对象字面量定义的是单例的公共接口。

这种模式在需要对单例进行某些初始化，同时又需要维护其私有变量时是非常有用的。

```

var application = function() {

    //私有变量和函数
    var components = new Array();

    //初始化
    components.push(new BaseComponent());

    return {
        getComponentCount: function() {
            return components.length;
        },

        registerComponent: function(component) {
            if(typeof component == "object")  {
                components.push(component);
            }
        }
    };

}();

```

在web应用程序中，经常需要使用一个单例来管理应用程序级的信息。

这个简单的例子创建了一个用于管理组件的application对象。

在创建这个对象的过程中，首先声明了一个私有的components数组，并向数组添加了一个BaseComponent的新实例对象（在这里不需要关心BaseComponent的代码，我们只是用它来展示初始化操作）。

而返回对象的getComponentCount()和registerComponent()方法，都是有权访问数组components的特权方法。

前者返回只是返回已注册的组件数目，后者用于注册新组件。

**简而言之，如果必须创建一个对象并以某些数据对其进行初始化，同时还要公开一些能够访问这些私有数据的方法，那么就可以使用模块模式。**

以这种模式创建的每个单例都是Object的实例， 因为最终要遵循通过一个对象字面量来表示它。

事实上，这也没什么；毕竟，单例通常都是作为全局对象存在的，我们不会将它传递给一个函数。

因此，也就没有必要使用instanceof操作符来检查其对象类型了。


## 增强的模块模式

有人进一步改进了模块模式，即在返回对象之前加入对其增强的代码。

这种增强的模块模式适合那些单例必须是某种类型的实例对象，同时还必须添加某些属性和（或）方法对其加以增强的情况。。

```

var singleton = function() {

    //私有变量
    var privateVariable = 10;

    //私有函数（方法）
    function privateMethod() {
        return false;
    }

    //创建对象, object是CustomType的实例对象
    var object = new CustomType();

    //为CustomType的实例对象object添加公有属性和方法
    object.publicProperty = true;

    object.publicMethod = function() {
        privateVariable ++;
        return privateMethod();
    }

    //返回这个实例对象
    return object;

}();

```

如果前面演示模块模式的例子中的application对象，必须是BaseComponent的实例对象， 那么就可以这样改写代码：

```

var application = function() {

    //私有变量和函数
    var components = new Array();

    //初始化
    components.push(new BaseComponent());

    //创建application的一个局部副本
    var app =  new BaseComponent();

    //公共接口
    app.getComponentCount = function(){
        return components.length;
    }

    app.registerComponent = function(component) {
        if (typeof component == "object" ) {
            components.push(component);
        }
    }

    //返回这个副本
    return app;

}();

```

在这个重写后的应用程序（application）单例中农，首先也是像前面例子中一样定义了私有变量。
主要的不同之处在于命名变量app的创建过程，因为它必须是BaseComponent的实例对象。
这个实例对象实际上是application对象的局部变量版。
此后，又为app对象添加了能够访问私有变量的公有方法。
**最后一步是返回app对象，结果仍然是将它赋值给全局变量application。**

