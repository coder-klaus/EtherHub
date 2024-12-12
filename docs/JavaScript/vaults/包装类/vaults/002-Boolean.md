# Boolean


[[TOC]]

# Boolean
使用 `new Boolean(value)` 会创建一个布尔对象，而不是一个基本类型的布尔值。

直接使用 `Boolean(value)` 会将其他类型转换为布尔值。这个过程与使用 `!!value` 是等价的。

```js
if (Boolean(null)) { // null转布尔值为false
  console.log('true');
} // 无输出

if (new Boolean(null)) { // 包装类对象是对象，所以为true
  console.log('true');
} // true
```

