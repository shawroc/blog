# Git

如何开始使用? 跟着如下步骤

1. 在浏览器中输入url：github.com。

2. 然后输入用户名和密码。

3. 在your repositories菜单栏那里点击New Repository。

4. 输入Repository Name。

5. 点击Create repository。

6. 进入你的Repository页面，点击Clone or download, 点击 Use SSH。

7. 看到如下格式的SSH， git@...com:xxxx/repository.git，复制

8. 打开git bash，在里面输入命令行 git clone git@...com:xxxx/repository.git

9. 但是clone不了，报错了，因为没设置公匙。

10. 怎么办呢？创建公钥私钥对。在git bash上输入命令行 ssh-keygen -t rsa -b 4096 -C "你的github邮箱"

11. 输入命令后，一直按回车，最后变成这个样子，在~/.ssh目录下生成了公钥id_rsa.pub和私钥 id_rsa。

12. 然后显示文件，在git bash输入cat ~/.ssh/id_rsa.pub。 或也直接打开这个文件下，用编辑器打开这个文件直接拷贝。

13. 拷贝好之后，重新打开github网页，点击你的头像，进入setting，左侧SSH and GPG keys。然后单击New SSH Key，输入title，把key完整的拷贝进key

14. 好了，现在你的个人电脑有权限了。重新输入命令行git clone ....

15. clone完毕后，cd到仓库，然后touch个文件，随便写入点内容

16. git add . 

17. git commit -am "say something"。

18. git push origin master

到此，你就基本掌握git bash和git hub的配合使用了。

## Git原理

### 关于版本控制

版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系统。

- 本地版本控制系统
- 集中式版本控制系统(SVN); Software Version Number
- 分布式版本控制系统(Git)
  
### Git优势

诞生自2005， Linux开源社区

- 速度
- 简单的设计
- 允许上千个并行分支
- 分布式

### 重要概念

- 已修改（modified）修改了某个文件，但还没有提交保存。
- 已暂存（staged）把已修改的文件放在下次提交时要保存的清单中。
- 已提交（committed）该文件已经被安全地保存在本地数据库中了。

### 配置用户名和邮箱

git config --global user.name "xxxx"
git config --global user.email xxxx@xx.com

### 检查有没有提交到暂存区

git status

```
noting to commit or something to commit
```

### 把所有的文件（添加删除修改）都放入到暂存区

git add .

### 把暂存区的更新提交到本地库

git commit -am "add file"
(git commit with a message "add file")

### git status 检查文件的状态（在哪儿）

---

## 把当前本地库里的改动推送到远程仓库（origin）的master分支

git push
把本地仓库的文件推送到远程仓库

**第一次使用 git push origin master**

---

修改删除文件

## 把远程仓库的变动更新合并到本地仓库
git pull

## 修改文件
vim a.md
git add . 或者 git add 文件名.文件扩展名

**这里需要注意，如果提交消息包含大量字符窜，提交参数不用加m**

**此时会进入vim界面，按下i进入编辑状态，进行编辑**

**编辑完成后按下esc进入命令状态，输入:wq! 或 :aq! 保存退出vim**

git commit -a | git commit -am
(git commit -ammend) | (git commit -ammend message)

git push origin master

**删除文件**

rm a.md

git add .

git commit -am "删除a.md"

**如果之前已经git push origin master过，后面可以直接简化成git push**

## 问题

- origin代表什么？ 就是仓库主干master的名字, 可以通过git remote -u mastername 主干地址

## 本地创建一个git项目仓库推送到远程空仓库

1. mkdir newProject

2. cd newProject

```
把一个文件夹初始化成一个本地git仓库
注意仓库和文件夹的区别在于仓库下有一个隐藏的.git文件夹，里面有一些信息。

对于一个仓库，删除.git文件夹，就变成一个普通文件夹了。
```

3. git init

4. touch index.html

5. echo "hello" > index.html

6. git commit -am "init"

7. git remote add origin git@github.com:xxxx/xxxx.git, 这里把远程库的地址添加个标签叫origin

8. git push -u origin master

9. 查看本地库里记录的远程库地址 git remote -v

10. 推送到远程库地址 git push origin master。（慎用，这样会强制推送，会覆盖别人的代码，git push -f origin master。）

11. 在添加一个远程库的标签，git remote add gitlab git@gitlab.com:abc/blog.git

12. 推送到gitlab标签的地址上，git push gitlab master

13. 修改origin标签对应的地址，git remote set-url origin git@github.com:xxx/blog3.git

14. 把gitlab标签改名为coding，git remote rename gitlab coding


### 分支操作 很重要的一部分

查看有哪些分支，git branch -a

创建本地仓库dev分支，git branch dev

切换到dev分支，git checkout dev

touch b.md

git add .

git commit -am "add b.md"

推送到origin地址的dev分支上，git push origin dev

**合并分支**，切换回master主干， git checkout master。git merge dev，在主干上合并dev分支。


### 冲突

当自己和别人修改同一个文件的同一个地方，在执行git pull时更新本地合并时， 会出现冲突。

1. 修改冲突文件
2. 重新提交