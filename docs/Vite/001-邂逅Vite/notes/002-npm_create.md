### npx

- `npx <pkg>`用于临时下载并运行命令行工具。
- 适合一次性执行某个包中的命令，而不需要将其全局安装。
- 使用完毕后，临时下载的包会被移除。



### npm create

- `npm create <pkg>` 等价于 `npm init <pkg>` 等价于 `npx create-<pkg>`。
- 主要用于下载并运行脚手架工具（通常以 `create-` 前缀命名），快速生成项目模板。
- 可以在不同的包管理工具中使用类似的命令，比如 `yarn create <pkg>` 和 `pnpm create <pkg>`。



### 总结

- `npm create` 用于快速生成项目模板，通常是为了初始化新项目。
- `npx` 用于临时下载和运行命令行工具，适合一次性任务。