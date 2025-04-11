```shell
ls # 查看当前目录下所有文件
ls -al # 查看当前目录下所有文件 「 1. 以列表形式进行查看 2. 包含隐藏文件 」

l # Oh My Zsh 对 ls -al 命令的一个别名
```

```shell
touch <file> # 创建文件
cat <file> # 查看文件内容

echo <msg> # 回显信息 「 默认回显到 stdout 」
echo <msg> > <file> # 将内容输入到<file>, 并替换原本的内容
echo <msg> >> <file> # 将内容输入到<file>, 并追加到文件的末尾
```

```shell
vi <file> # 通过vim打开<file> 等价于 vim <file>
# vi 是linux terminal自带终端，vim是vi的增强 => 目前输入vi，一般打开的都是vim

# 刚进入编辑器时，默认是命令模式（Command Mode）
# 想对文件内容进行修改，需要先切换到插入模式（Insert Mode） => 切换方法是按下字母 I
# 编辑完成之后，按下 ESC 键就可以回到命令模式

# 在命令模式下:
# : set number => 查看行号
# : n => 跳转到编号为n的哪一行 => 此时输入dd，可以直接删除对应行
# : q => 文件未修改时，直接退出
# : wq => 保存并退出 => 等价于 shift + zz
# : q! => 强制退出，不保存修改
```

