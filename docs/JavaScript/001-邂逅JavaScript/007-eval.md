`eval` 是 JavaScript 的内建函数，它可以将传入的字符串当作 JavaScript 代码来执行。这意味着你可以动态地生成并运行代码。

```javascript
eval("console.log('Hello from eval')");
```



`eval` 会返回最后一条语句的结果。如果最后一条语句有返回值，`eval` 会返回该值。

```javascript
let result = eval("2 + 2");
console.log(result); // 输出: 4
```



## 使用风险

- **可读性差**：代码变得难以理解和维护。
- **安全风险**：如果传入的字符串是用户输入的，可能会导致代码注入攻击。
- **性能问题**：`eval` 代码无法被 JavaScript 引擎优化，会影响性能。



## 作用域

`eval` 执行的代码在调用它的作用域内运行。这意味着它可以访问和修改该作用域中的变量。

```javascript
let msg = 'Hello World';
eval("console.log(msg)"); // 输出: Hello World
```

`eval` 内部定义的 `var` 变量会成为全局变量：

```javascript
eval("var username = 'Klaus';");
console.log(username); // 输出: Klaus
```

使用 `let` 或 `const` 定义的变量在 `eval` 外部不可访问：

```javascript
eval("let age = 23;");
console.log(age); // 抛出错误: age is not defined
```

