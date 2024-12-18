# null和undefined

[[TOC]]

在 JavaScript 中，`null` 和 `undefined` 都可以表示“没有”的状态，虽然它们的含义相似，但在使用上有一些区别。值得注意的是，使用相等运算符（`==`）时，它们会被认为是相等的：

```js
undefined == null // true
```



## `nullish`

`nullish` 是 `null` 和 `undefined` 的统称，用于表示这两者之一的状态。



## `null`

1. **空对象引用**：`null` 表示一个“空”的对象引用，意味着变量未来可能指向一个对象，但当前没有指向任何对象。

2. **数值转换**：将 `null` 转换为数值时，其值为 `0`。

   

## `undefined`

1. **未赋值变量**：`undefined` 表示变量已声明但未赋值，未来可以赋值为任何类型的值。
2. **数值转换**：将 `undefined` 转换为数值时，其值为 `NaN`（非数字）。



### 以下场景中的变量的默认值为 `undefined`：

```js
// 变量声明了，但没有赋值
let i;
console.log(i); // 输出: undefined

// 调用函数时，未提供参数，该参数为 undefined
function f(x) {
  return x;
}
console.log(f()); // 输出: undefined

// 对象中未赋值的属性
const o = {};
console.log(o.p); // 输出: undefined

// 函数没有返回值时，默认返回 undefined
function g() {}
console.log(g()); // 输出: undefined
```

