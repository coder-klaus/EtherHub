`degit` 是一个用于快速克隆 GitHub、GitLab 和 Bitbucket 存储库的工具，适合用于初始化模板项目

它可以克隆某个仓库某个分支的最新提交，而不带`.git`。

因此我们可以自己手动初始化仓库，以便于从一个干净的起点开始我们全新的项目。



## 安装

```shell
npm install -g degit
```



## 基本用法

- **克隆 GitHub 项目**

  ```shell
  degit user/repo
  ```

- **克隆 GitLab 项目**

  ```shell
  degit gitlab:user/repo
  ```

- **克隆 Bitbucket 项目**

  ```shell
  degit bitbucket:user/repo
  ```

+ **克隆到指定目录**

  ```shell
  degit user/repo my-directory
  ```

+ **克隆特定分支或标签** 

  ```shell
  degit user/repo#branch-or-tag
  ```

