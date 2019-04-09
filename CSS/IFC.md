# IFC（BFC 的兄弟）

## 大纲

[深入理解 CSS：字体度量、line-height 和 vertical-align](https://zhuanlan.zhihu.com/p/25808995)

1. font-size 实际上指的是 em-square
2. line-height 实际占地高度， line-height 默认值为 auto，设计师给的推荐行高
3. 100px 100px -> 103px  跟字体的基线相关
4. vertical top middle bottom text-top text-bottom
5. 图片下面有空隙
    i. vertical-align: top，middle, bottom。 推荐使用top，不容易引起bug。
    ii. img{display: block;}
    iii. font-size: 0 傻逼采用
6. inline-block 元素对不齐 ——无解 —— 用 flex 或 float
7. inline-block 有空隙 ——用 flex 或 float

两个行内元素的字体不一样的话，是永远对不齐的，做梦吧！

图片下面有空隙， 图片是个 inline-block，默认是以某种字体的 baseline 对齐