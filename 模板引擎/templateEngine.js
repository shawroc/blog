//替换模板引擎-简单版-1
//使用说明。
//var tpl = '<p>Hello World! My name is <%0%>, I\'m <%1%> years older.</p>'
//console.log(stringFormat(tpl, "Shaw", "18"));
//"<p>Hello World! My name is Shaw, I'm 18 years older.</p>"

function stringFormat(tpl) {

    var parameters = [].slice.call(arguments, 1),
    regExp = /<%([^%>]+)?%>/g;

    tpl = tpl.replace(regExp, function(){
        var index = arguments[1];
        return parameters[index];
    })

    return tpl;

}

//替换模板引擎-简单版-2
//使用说明。
//var tpl = '<p>Hello World! My name is <%name%>, I\'m 18 years older.</p>';
/*
var data = {
    name: "Shaw",
    age: 18
}
*/
//  TemplateEngine(tpl, data)
// "<p>Hello World! My name is Shaw, I'm 18 years older.</p>"

function TemplateEngine(tpl, data) {

    var regExp = /<%([^%>]+)?%>/g,
        matchStrArr;
    
    while(matchStrArr = regExp.exec(tpl)) {
        tpl = tpl.replace(matchStrArr[0], data[matchStrArr[1]]);
    }

    return tpl;

}


//替换模板引擎-复杂版1
//使用说明
//var tpl = '<p>Hello World, my name is <%this.friend.name%>, I\'m <%this.friend.age%> years older.</p>';

/*
var data = {
    friend: {
        name: "Shaw",
        age: 18
    }
}
*/
// TemplateEngine(tpl, data)
// "<p>Hello World, my name is Shaw, I'm 18 years older.</p>"

function TemplateEngine(template, data) {

    var templateExtractRegExp = /<%([^%>]+)?%>/g,
        functionBody = 'var arr = [];\n',
        cursor = 0,
        match;

    var codeAdd = function(codeStr, js) {
        if(js) {
            functionBody += 'arr.push(' + codeStr + ');\n';
        } else {
            functionBody += 'arr.push("' + codeStr.replace(/"/g, '\\"') + '");\n';
        }
    }

    while(match = templateExtractRegExp.exec(template)) {
        codeAdd(tpl.slice(cursor, match.index));
        codeAdd(match[1], true);
        cursor = match.index + match[0].length;
    }

    codeAdd(tpl.slice(cursor));

    functionBody += 'return arr.join("")';

    return new Function(functionBody.replace(/[\n\t\r]/g,'')).apply(data);

}


//替换模板引擎-复杂版2
//使用说明
//var tpl = '<p>Hello World, my name is <%for(var index in data){%><%this.friend.name%>, I\'m <%this.friend.age%><%}%> years older.</p>';
/*var data = {
    friend: {
        name: "Shaw",
        age: 18
    }
}
*/
// TemplateEngine(tpl, data)
// "<p>Hello World, my name is Shaw, I'm 18 years older.</p>"

function TemplateEngine(tpl, data) {

    var tplExtractPattern = /<%([^%>]+)?%>/g,
        jsKeyWordsExtractPattern = /(^( )?(if|else|for|switch|break|case|{|})(.*)?)/g,
        functionBody = 'var arr = [];\n',
        cursor = 0,
        match;

    var codeAdd = function(codeStr, js){
        if(js) {
            if(codeStr.match(jsKeyWordsExtractPattern)) {
                functionBody += codeStr + '\n';
            } else {
                functionBody += 'arr.push(' + codeStr + ');\n';
            }
        } else {
            functionBody += 'arr.push("' + codeStr.replace(/"/g, '\\"') + '");';
        }
    } 
    
    while(match = tplExtractPattern.exec(tpl)) {
        codeAdd(tpl.slice(cursor, match.index));
        codeAdd(match[1], true);
        cursor = match.index + match[0].length;
    }

    codeAdd(tpl.slice(cursor));

    functionBody += 'return arr.join("");\n';

    return new Function(functionBody.replace(/[\n\t\r]/g, '')).apply(data);

}







