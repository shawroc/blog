# 堆叠上下文

## 目录

1. 什么是堆叠顺序
2. 什么是堆叠上下文

参考: http://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/


## 堆叠顺序

1. background
2. border
3. 块级
4. 浮动
5. 内联
6. z-index: 0
7. z-index: +

如果是兄弟元素重叠，那么后面的盖在前面的身上。

## 堆叠上下文

https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context

可以理解为堆叠作用域。跟 BFC 一样，我们只知道一些属性会触发堆叠上下文，但并不知道堆叠上下文是什么。

- 根元素 (HTML),
- **z-index 值不为 "auto"的 绝对/相对定位**，
- 一个 z-index 值不为 "auto"的 flex 项目 (flex item)，即：父元素 display: flex|inline-flex，
- opacity 属性值小于 1 的元素（参考 the specification for opacity），
- transform 属性值不为 "none"的元素，
- mix-blend-mode 属性值不为 "normal"的元素，
- filter值不为“none”的元素，
- perspective值不为“none”的元素，
- isolation 属性被设置为 "isolate"的元素，
- position: fixed
- 在 will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值（参考 这篇文章）
- -webkit-overflow-scrolling 属性被设置 "touch"的元素


### 实验代码

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    .parent {
      width: 200px;
      height: 200px;
      border: 10px solid rgba(255,0,0,1);
      margin: 12px;
      background-color: green;
      color: white;
      text-indent: -10px;
    }
    .child {
      height: 20px;
      background: purple;
      margin-top: -15px;
      color: black;
    }
    /*border比background更靠近用户*/
    /*内联元素或文字在border的上边*/
    /* 块级元素是盖不住内联元素的 */
    /* 谁后出现谁就盖住前面的东西 */
    .float {
      width: 30px;
      height: 30px;
      background-color: blue;
      float: left;
      color: black;
    }
    .relative {
      width: 100px;
      height: 100px;
      background: black;
      position: relative;
      margin-top: -10px;
    }
    /*只能给定位元素加z-index, 元素默认的z-index值是static*/
    /* 如果parent 没有定位的话，我写了一个负的z-index，那这个z-index 出现在background-color后面*/
  </style>
</head>
<body>
  <div class="parent">
    你好
    <!-- <div class="child">
        ○○○○○○○○○○○○○○○○
    </div> -->
    <div class="float">Hello world</div>
    <div class="child"></div>
    <div class="relative"></div>
  </div>
</body>
</html>
```