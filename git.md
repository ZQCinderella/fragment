# git

## 一、 git rebase

> 1、dev:  git rebase master

	将dev分支的起始位置变基到master的最新commit上, master - dev - dev2 (dev2是从dev打出来的分支)

> 2、dev2:  git rebase —preserve-merges master dev

	先将dev2分支其实位置变基到dev最新commit，再把dev2 的起始位置变基到master的最新commit

> 3、如果有冲突，解决完之后

	1) git add 

	2) git rebase  —continue

> 4、在rebase的任何时间，都可以用git rebase —abort终止，并且回到rebase之前的状态

## 二、git stash

	当在dev分支上有修改，现在需要切换到master分支，但是不想提交，可以使用 stash暂存修改

> 1、git stash save    将修改存储

> 2、git checkout master ….. 然后 git checkout dev

> 3、git stash pop  修改又回来了。

## 三、 git tag

> 1、git tag  -a v1.0 -m “my tag” 带描述的tag

> 2、git tag v1.0   不带描述的tag, 如果存在tag就不会再创建

> 3、git show v1.0 显示某个tag的详细信息

> 4、git tag 显示所有tag

> 5、通常的git push不会将标签对象提交到git服务器，我们需要进行显式的操作：
  $ git push origin v0.1.2 # 将v0.1.2标签提交到git服务器
  $ git push origin –tags # 将本地所有标签一次性提交到git服务器

>6、git tag -d v1.0 删除版本

## 四、git cherry-pick
```应用： dev分支， dev_2分支 （从dev分支打出来的）

dev_2分支现在 有三个commit , ( commit1, commit2, commit3)

现在有一个需求，需要把commit2 提交的内容合并到dev上，怎

么办，不能新建分支，然后eset回去再合并吧。```

>1、拿到commit2  的版本号

>2、git checkout master

>3、git cherry-pick 版本号  

```三步即可吧commit2的提交更新到master,  但是commit1并不会提交，单纯只有commit 2这次修改注：如果有冲突，解决了继续commit就可以了。```

##五、恢复到之前的状态最绝望的招数

```git checkout . && git clean -xdf```

>1、git checkout .  是本地所有修改都撤销，只针对已存在文件的修改

>2、git clean -df 是删除新增的文件，目录

>3、git checkout 文件名，   撤销对某个已存在文件的修改

##六、更新远程分支到本地

>1、 git fetch 
>2、git fetch -p  fetch之后删除掉没有与远程分支对应的本地分支

##七、分支重命名

>1、git branch -m newName oldName
>2、git push —delete origin branchName
