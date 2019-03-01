# 翻译_只需20行代码创造JavaScript模板引擎（二）

## 上文链接[翻译_只需20行代码创造JavaScript模板引擎（一）](https://segmentfault.com/a/1190000016678647)


但是这还不够好，数据是非常简单的对象，并且很容易使用object['property']对象的中括号语法，去读取对象的值。

但在实践中，我们用到的数据中，可能有复杂的嵌套对象。

```
//嵌套对象
data = {
    name: "Krasimir Tsonev",
    profile: {age:29}
}
```

如果有复杂的嵌套对象，就不能用对象的中括号语法读取值了。

所以String.prototype.replace(matchedStr, data["profile.age"]) 就行不通了。

因为data["profile.age"]，每次返回undefined。

```
//对象的中括号语法读取值 object["property"]

var obj = {
    name: "Shaw",
    age: 18
}

console.log(obj["name"]); //"Shaw"
console.log(obj["age"]); // 18  


//复杂的嵌套对象，就不能用对象的中括号语法读取值了。

var obj = {
    name: "Shaw",
    profile: {
        age: 18
    }
}

console.log(obj["profile.age"]); // undefined

```

那么，怎么解决这个问题？
最好的办法是在模板中<%和%>之间放置真正的JavaScript代码。

```
var tpl = '<p>Hello, my name is <%this.name%>. I\'m <%this.profile.age%> years old.</p>';
```

这怎么可能呢？ John使用了new Function()语法, 没有显式的声明函数。

```

var fn = new Function("arg", "console.log(arg+1);");
fn(2); // 3

//fn是一个可以传入一个参数的函数
//fn函数体内的语句，就是 console.log(arg+1);

/* 等价于*/

function fn(arg) {
    console.log(arg +1);
}

fn(2); //3

```

我们可以利用这个语法，在一行代码中，定义函数、参数和函数体。这正是我们需要的。

在利用这种语法，创建函数之前。

我们必须设计好，函数体怎么写。函数执行后应该返回最终编译的模板。

回想一下，我们经常使用的字符窜拼接方法。

```

"<p>Hello, my name is " +
this.name +
". I\'m" +
this.profile.age +
" years old.</p>";

```

这说明，我们可以把字符窜模板里面的内容拆解，拆解为html和JavaScript代码。

一般情况下，我们都是使用for循环去遍历数据。

```
// 传入的字符窜模块
var template =
'My Skill:' +
'<%for(var index in this.skills) {%>' +
'<a href=""><%this.skills[index]%></a>' +
'<%}%>';
```

```
// 预想的返回结果

return 
'My skills:' +
for(var index in this.skills) { +
'<a href="">' +
this.skills[index] +
'</a>' +
}
```

当然，这将产生一个错误。这就是为什么我决定遵循约翰文章中使用的逻辑，把所有的字符串放到一个数组中。

```
var r = [];
r.push('My skills:');
for(var index in this.skills) {
    r.push('<a href="">');
    r.push(this.skills[index]);
    r.push('</a>');
}
return r.join('');
```

下一个逻辑步骤是收集定制生成函数的不同行。
我们已经从模板中提取了一些信息。我们知道占位符的内容和它们的位置。所以，通过使用一个辅助变量（游标）

```

function TemplateEngine(tpl, data) {

    var tplExtractPattern = /<%([^%>]+)?%>/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;

    function addCode(line) {
        code += 'r.push("' + line.replace(/"/g,'\\"') +'"); \n';
    }

    while(match = tplExtractPattern.exec(tpl)) {
        addCode(tpl.slice(cursor, match.index));
        addCode(match[1]);
        cursor = match.index + match[0].length;
    }

    code += 'return r.join("");';

    console.log(code);

    return tpl;

}

var template = '<p>Hello, my name is <%this.name%>. I\'m <%this.profile.age%> years old.</p>';

TemplateEngine(template, {
    name: "Shaw",
    profile: { age: 18 }
});

```

变量code保存着函数体的代码。
在while循环语句中，我们也需要变量cursor游标，告诉我们字符窜slice()方法截取的起始坐标和末尾坐标。
变量code在while循环语句中，不断的拼接。

但是code的最终结果是

```
/*
var r=[];
r.push("<p>Hello, my name is "); 
r.push("this.name"); 
r.push(". I'm "); 
r.push("this.profile.age"); 
return r.join("");
<p>Hello, my name is <%this.name%>. I'm <%this.profile.age%> years old.</p>
*/
```

这不是我们想要的。 "this.name" 和 "this.profile.name" 不应该被引号包裹。

所以我们需要addCode函数做一个小小的改动

```
function TemplateEngine(tpl,data){

    var tplExtractPattern = /<%([^%>]+)?%>/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;

    function addCode(line, js) {
        if(js) {
            code += 'r.push(' + line + ');\n';
        } else {
            code += 'r.push("' + line.replace(/"/g,'\\"') + '");\n';
        }
    }

    while(match = tplExtractPattern.exec(tpl)) {
        addCode(tpl.slice(cursor, match.index));
        addCode(match[1], true);
        cursor = match.index + match[0].length;
    }

    code += 'return r.join("");';

    console.log(code);

    return tpl;

}

var template = '<p>Hello, my name is <%this.name%>. I\'m <%this.profile.age%> years old.</p>';

TemplateEngine(template, {
    name: "Shaw",
    profile: { age: 18 }
});

```

现在this可以正确指向执行对象了。

```
var r=[];
r.push("<p>Hello, my name is ");
r.push(this.name);
r.push(". I'm ");
r.push(this.profile.age);
return r.join("");
```

到了这里，我们只需要创建函数并执行它。
在TemplateEngine函数里把return tpl 替换成 

```
return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
```

我们不需要传入参数，这里我使用apply()方法，改变了作用域，现在this.name指向了data。

几乎已经完成了。但是我们还需要支持更多JavaScript关键字，比如if/else，循环流程语句。
让我们从相同的例子，再次进行构思。

```

function TemplateEngine(tpl,data){

    var tplExtractPattern = /<%([^%>]+)?%>/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;

    function addCode(line, js) {
        if(js) {
            code += 'r.push(' + line + ');\n';
        } else {
            code += 'r.push("' + line.replace(/"/g,'\\"') + '");\n';
        }
    }

    while(match = tplExtractPattern.exec(tpl)) {
        addCode(tpl.slice(cursor, match.index));
        addCode(match[1], true);
        cursor = match.index + match[0].length;
    }

    code += 'return r.join("");';

    console.log(code);

    return new Function(code.replace(/[\t\n\t]/g, '')).apply(data);
}

var template = 
'My skill:' +
'<%for(var index in this.skills) {%>' +
'<a href="#"><%this.skills[index]%></a>' +
'<%}%>';

TemplateEngine(template, {
    skills: ["js", "html", "css"]
}); 
// Uncaught SyntaxError: Unexpected token for
```

调用TemplateEngine()，控制台报错了，Uncaught SyntaxError: Unexpected token for。
在控制台打印出，拼接的代码

```
var r=[];
r.push("My skill:");
r.push(for(var index in this.skills) {);
r.push("<a href=\"#\">");
r.push(this.skills[index]);
r.push("</a>");
r.push(});
return r.join("");
```

带有for循环的语句不应该被直接放到数组里面，而是应该作为脚本的一部分直接运行。所以在把代码语句添加到code变量之前还要多做一个判断。

```

var re = /<%([^%>]+)?%>/g,
    reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
    code = 'var Arr = [];\n',
    cursor = 0;

function addCode(line,js) {
    if(js){
        if(line.match(reExp)) {
            code += line +'\n';
        } else {
            code += 'r.push(' + line + ');\n';
        }
    } else {
        code += 'r.push("' + line.replace(/"/g,'\\"')) + '");\n';
    }
}

```

添加一个新的正则表达式。它会判断代码中是否包含if、for、else等关键字。
如果有的话就直接添加到脚本代码中去，否则就添加到数组中去。

```
function TemplateEngine(tpl,data){

    var tplExtractPattern = /<%([^%>]+)?%>/g,
    jsExtractReExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
    code = 'var arr = [];\n',
    cursor = 0,
    match;

    function addCode(line,js) {
        if(js){
            if(line.match(jsExtractReExp)) {
                code += line +'\n';
            } else {
                code += 'arr.push(' + line + ');\n';
            }
        } else {
            code += 'arr.push("' + line.replace(/"/g,'\\"') + '");\n';
        }
    }


    while(match = tplExtractPattern.exec(tpl)) {
        addCode(tpl.slice(cursor, match.index));
        addCode(match[1], true);
        cursor = match.index + match[0].length;
    }

    code += 'return arr.join("");';

    console.log(code);

    return new Function(code.replace(/[\t\n\t]/g, '')).apply(data);
}

var template = 
'My skill:' +
'<%for(var index in this.skills) {%>' +
'<a href="#"><%this.skills[index]%></a>' +
'<%}%>';

TemplateEngine(template, {
    skills: ["js", "html", "css"]
});


/*
var arr = [];
arr.push("My skill:");
for(var index in this.skills) {
arr.push("<a href=\"#\">");
arr.push(this.skills[index]);
arr.push("</a>");
}
return arr.join("");
*/

//"My skill:<a href="#">js</a><a href="#">html</a><a href="#">css</a>"
```

一切都是正常编译的 :)。

最后的修改，实际上给了我们更强大的处理能力。

我们可以直接将复杂的逻辑应用到模板中。例如

```
var template = 
'My skills:' + 
'<%if(this.showSkills) {%>' +
    '<%for(var index in this.skills) {%>' + 
    '<a href="#"><%this.skills[index]%></a>' +
    '<%}%>' +
'<%} else {%>' +
    '<p>none</p>' +
'<%}%>';
console.log(TemplateEngine(template, {
    skills: ["js", "html", "css"],
    showSkills: true
}));

/*
var arr = [];
arr.push("My skills:");
if(this.showSkills) {
arr.push("");
for(var index in this.skills) {
arr.push("<a href=\"#\">");
arr.push(this.skills[index]);
arr.push("</a>");
}
arr.push("");
} else {
arr.push("<p>none</p>");
}
return arr.join("");
*/

//"My skills:<a href="#">js</a><a href="#">html</a><a href="#">css</a>"

```

最后，我进一步做了一些优化，最终版本如下

```

var TemplateEngine = function(templateStr, data) {
    var tplStrExtractPattern = /<%([^%>]+)?%>/g,
        jsKeyWordsExtractPattern = /(^( )?(for|if|else|switch|case|break|{|}))(.*)?/g,
        code = 'var arr = [];\n',
        cursor = 0,
        match;
    var addCode = function(templateStr, jsCode) {
        if(jsCode) {
            if(templateStr.match(jsKeyWordsExtractPattern)) {
                code += templateStr + '\n';
            } else {
                code += 'arr.push(' + templateStr + ');\n';
            }
        } else {
            code += 'arr.push("' + templateStr.replace(/"/g, '\\"') + '");\n';
        }
    }
    while(match = tplStrExtractPattern.exec(templateStr)){
        addCode(templateStr.slice(cursor, match.index));
        addCode(match[1], true);
        cursor = match.index + match[0].length;
    }
    code += 'return arr.join("");';
    return new Function(code.replace(/[\r\n\t]/g, '')).apply(data);
}

```

