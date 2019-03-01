# Linux命令行基础-常用的命令行

## 一些常用命令行以及含义

---
### 一些基本符号的含义

|符号|符号含义|
|:-:|:-:|
|~|用户目录（也称作家目录）|
|/|根路径，即整个系统|
|.|所在当前目录|
|..|当前目录的上一级目录|
|$|提示可以输入命令行了|
|回车 Carriage Return|执行输入的命令行|

绝对路径 "/" 开头的路径就是绝对路径，不是这种开头的就是相对路径。

### 查看路径

|命令行|命令行的英文全写|中文含义|
|:-----:|:---:|:--------------------:|
|pwd|print working directory  |查看当前目录|
|ls|list|查看当前目录下的文件（不包括隐藏文件）|
|ls -a|list all| 查看当前目录下所有文件（包括隐藏文件）|
|ls -al| ls -a & ls -l | 查看当前目录下所有文件（包括隐藏文件）的详细信息|

### 切换目录

|命令行|命令行的英文全写|中文含义|
|:-:|:-:|:-:|
|cd|change directory| 切换目录 |

### 创建删除文件

|命令行|命令行的英文全写|中文含义|
|:-:|:-:|:-:|
|touch||创建文件/改变文件最后更新的时间|
|rm|remove|删除文件|
|rm -f|强制删除文件|


### 创建目录

|命令行|命令行的英文全写|中文含义|
|:-:|:-:|:-:|
|mkdir| make directory|创建目录|
|mkdir -p| make directory -path|创建目录路径|
|rm -r| remove - recusive| 删除目录前确认|
|rm -rf| remove - recusive force| 强制删除目录不用确认|

### 移动，覆盖或重命名文件

|命令行|命令行的英文全写|中文含义|
|:-:|:-:|:-:|
|mv|move|移动，覆盖或重命名文件|

用法

- mv hello.text world  : 将hello.text文件移动到world目录下。
  
- mv hello.text world.text: 将hello.text重命名为world.text, 前提是hello.text文件不存在。
  
- mv hello.text world.text: hello.text被world.text覆盖， 前提是两个文件都是操作前存在的。

### 拷贝

|命令行|命令行的英文全写|中文含义|
|:-:|:-:|:-:|
|cp 文件 目标路径|copy|复制文件|
|cp -r 目录 目标路径|copy -recursive(递归)|复制目录|