# CSS选择器

## CSS选择器类型

1. 基础选择器
2. 组合选择器
3. 属性选择器
4. 伪类选择器
5. 伪元素选择器

### 基础选择器

|选择器|含义|
|:-|:-|
|*|通用元素选择器，匹配页面任何元素（这也就决定了我们很少使用）|
|#id|id选择器，匹配特定id的元素|
|.class|类选择器，匹配class包含（不是等于）特定类的元素|
|element|标签选择器|

```
/* 基础选择器范例 */

* {
  margin: 0;
  padding: 0;
}

#id-selector {
  color: #333;
}

.class-selector {
  background: #333;
}

p {
  font-size: 20px;
}
```

### 组合选择器

|选择器|含义|
|:-|:-|
|E,F|多元素选择器，用，分隔，同时匹配元素E或元素F|
|E F|后代选择器，用空格分隔，匹配E元素所有的后代|
|E>F|子元素选择器，用 > 分隔，匹配E元素的所有直接子元素|
|E+F|直接相邻选择器，匹配E元素之后的相邻的同级元素F|
|E~F|普通相邻选择器，匹配E元素之后的同级元素F（无论直接相邻与否）|
|.class1.class2|id和class选择器和选择器连写的时候中间没有分隔符，.和 # 本身充当分隔符的元素|
|element#id|id和class选择器和选择器连写的时候没有分隔符，.和 #本身充当分隔符的元素|

### 属性选择器

|选择器|含义|
|:-|:-|
|E[ attr ]|匹配所有具有属性attr的元素，div[id]就能取到所有有id属性的div|
|E[attr = value]|匹配属性attr值为value的元素，div[id=test]，匹配id=test的div|
|E[attr ~= value]|匹配所有属性attr具有多个空格分隔、其中一个值等于value的元素|
|E[attr ^= value]|匹配属性attr的值以value开头的元素|
|E[attr $= value]|匹配属性attr的值以value结尾的元素|
|E[attr *= value]|匹配属性attr的值包含value的元素|

### 伪类选择器

|选择器|含义|
|:-|:-|
|E:first-child|匹配父元素下元素E的第一个子元素|
|E:link|匹配所有未被点击的链接|
|E:visited|匹配所有已被点击的链接|
|E:active|匹配鼠标按下、还没有释放的E元素|
|E:hover|匹配鼠标悬停其上的E元素|
|E:focus|匹配当前获得焦点的E元素|
|E:lang(c)|匹配lang属性等于c的元素|
|E:enabled|匹配表单中可用的元素|
|E:disabled|匹配表单中禁用的元素|
|E:checked|匹配表单中被选中的radio或checkbox元素|
|E::selection|匹配用户当前选中的元素|
|E:root|匹配文档的根元素，对于HTML文档，就是HTML元素|
|E:nth-child(n)|匹配其父元素的第n个子元素，第一个编号为1|
|E:nth-last-child(n)|匹配其父元素的倒数第n个子元素，第一个编号为1|
|E:nth-of-type(n)|与:nth-child()作用类似，但是仅匹配使用同种标签的元素|
|E:nth-last-of-type(n)|与:nth-las-child()作用类似，但是仅匹配使用同种标签的元素|
|E:only-child|匹配父元素下仅有的一个子元素，等同于:first-child :last-child或:nth-child(1) :nth-last-child(1)|
|E:only-of-type|匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type :last-of-type 或 :nth-of-type(1) :nth-last-of-type(1)|

关于n的取值

- 1,2,3,4,5
- 2n+1, 2n, 4n-1
- odd, even

### 伪元素选择器

|选择器|含义|
|E::first-line|匹配E元素内容的第一行|
|E::first-letter|匹配E元素内容的第一行|
|E::before|在E元素内部生成一个子元素，并作为元素内部的第一个子元素|
|E::after|在E元素内部生成一个子元素，并作为元素内部的最后一个子元素|

## 选择器优先级

如果多条规则作用于同一个元素上，且定义的相同属性的不同值。

比如：

```
<style>
  #test {color:#666;}
  p {color: #333}
</style>

<p id="text">Text</p>
<!-- color is red -->
```

这种场景下，p元素文本颜色应该是哪个呢？

### CSS优先级

从高到底分别是

1. 在属性后面使用!important 会覆盖页面内任何位置定义的元素样式。
2. 作为style属性写在元素标签上的内联样式。
3. id选择器
4. 类选择器
5. 伪类选择器
6. 属性选择器 
7. 标签选择器
8. 通配符选择器
9. 浏览器自定义 

相同权重的样式会覆盖

## 选择器使用经验

- 遵守 CSS 书写规范
- 使用合适的命名空间
- 合理的复用class
