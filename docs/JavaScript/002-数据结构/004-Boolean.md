布尔（Boolean）类型是编程中的一种基本数据类型，用于表示逻辑上的真假。

它只有两个可能的值：`true`（真）和 `false`（假）。

逻辑判断语句通常返回布尔值。在流程控制语句中（如 `if` 语句），这些判断的结果决定了代码块是否执行。



## 真值和假值

- **假值 (falsy)**: 这些值会被转换为 `false`。
  - `0`, `+0`, `-0`, `0n` (BigInt)
  - `""` (空字符串)
  - `null`
  - `undefined`
  - `NaN`

- **真值 (truthy)**: 除了假值以外的所有值都会被转换为 `true`。



## 逻辑运算符

**概念**：用于进行逻辑运算。

**运算符列表**：

- `&&`：逻辑与（AND）
- `||`：逻辑或（OR）
- `!`：逻辑非（NOT）

**逻辑运算符的特点**：

- `&&`：如果第一个操作数为 `false`，直接返回第一个操作数；否则返回第二个操作数。
- `||`：如果第一个操作数为 `true`，直接返回第一个操作数；否则返回第二个操作数。
- `!`：对操作数进行布尔值取反。



## 空值合并运算符

我们可以使用空值合并运算符 `??` 来避免逻辑或 `||` 在处理 falsy 值时的意外行为。

```js
let name = '';
let defaultName = name || 'Default';
console.log(defaultName); // 输出 'Default'
```

空值合并运算符 `??` 只在值为`nullish` 时才会返回 `'Default'`。

```javascript
let name = '';
let defaultName = name ?? 'Default';
console.log(defaultName); // 输出 ''
```

在这个例子中，`defaultName` 将会是 `name` 的值，因为 `name` 不是 `null` 或 `undefined`。



## 可选链操作符

可以使用 `&&` 确保对象属性存在时才执行操作

```js
// 传统检查方法
if (user2 && user2.running && typeof user2.running === 'function') {
    user2.running();
}
```

可选链操作符 `?.` 用于简化访问嵌套对象属性时的安全检查。它可以避免在访问不存在的属性时抛出错误。

```js
// 使用可选链操作符
user2?.running?.();
```

- `user2?.running`：如果 `user2` 为 `null` 或 `undefined`，表达式会短路返回 `undefined`，不会抛出错误。
- `?.()`：如果 `running` 存在且为函数，则调用它。

