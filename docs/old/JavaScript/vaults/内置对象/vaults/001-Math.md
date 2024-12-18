# Math

[[TOC]]



## 概述

1. `Math`是提供了各种数学功能的原生工具对象，类似于命令空间
2. 直接调用静态属性或静态方法即可，不可以通过`new`创建实例



## 静态属性

| 属性      | 描述   |
| --------- | ------ |
| `Math.E`  | 常数 e |
| `Math.PI` | 常数 π |



## 静态方法

| 方法            | 描述                 |
| --------------- | -------------------- |
| `Math.abs()`    | 绝对值               |
| `Math.ceil()`   | 向上取整（天花板值） |
| `Math.floor()`  | 向下取整（地板值）   |
| `Math.max()`    | 最大值               |
| `Math.min()`    | 最小值               |
| `Math.pow()`    | 幂运算               |
| `Math.sqrt()`   | 平方根               |
| `Math.round()`  | 四舍五入             |
| `Math.random()` | 随机数               |



### Math.max/Math.min

```js
// 最大值和最小值
Math.max(2, -1, 5) // 5
Math.min(2, -1, 5) // -1

// 如果参数为空，最大值为-Infinity 最小值为Infinity 「 正好反过来了 」
Math.min() // Infinity
Math.max() // -Infinity
```

这两个方法可以结合起来，可以实现一个总是返回数值的整数部分的函数。

```js
function ToInteger(x) {
  x = Number(x);
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

ToInteger(3.2) // 3
ToInteger(3.5) // 3
ToInteger(3.8) // 3
ToInteger(-3.2) // -3
ToInteger(-3.5) // -3
ToInteger(-3.8) // -3
```



### Math.round

1. 功能: 数值类型四舍五入
2. 小数点存储精度可能导致四舍五入出现问题，==所以`Math.round(x)`本质是`Math.floor(x + 0.5)`==

```js
Math.round(0.1) // 0
Math.round(0.5) // 1
Math.round(0.6) // 1

Math.round(-1.1) // -1
Math.round(-1.5) // -1 => Math.floor(-1.5 + 0.5) => Math.floor(-1) => -1
Math.round(-1.6) // -2
```



### Math.pow

```js
Math.pow(2, 3) // 8 => 等同于 2 ** 3
```



### Math.sqrt

1. 返回参数值的平方根
2. 如果参数是负值，则返回`NaN`

```js
Math.sqrt(4) // 2
Math.sqrt(-4) // NaN
```



### Math.random

1. 生成`[0, 1)`之间的随机数
2. ==任意范围的随机数 => `Math.random() * (max - min) + min` => `(大 - 小) + 小`==
3. ==任意范围的随机整数 => `Math.floor(Math.random() * (max - min + 1)) + min`==

```js
// 生成随机字符串
function random_str(length) {
  let ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  ALPHABET += 'abcdefghijklmnopqrstuvwxyz';
  ALPHABET += '0123456789-_';
  let str = '';
  for (let i = 0; i < length; ++i) {
    const rand = Math.floor(Math.random() * ALPHABET.length);
    str += ALPHABET.substring(rand, rand + 1);
  }
  return str;
}

random_str(6) // "NdQKOr"
```

