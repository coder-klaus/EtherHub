在早期的 JavaScript 中，无法准确表示超过 `Number.MAX_SAFE_INTEGER` 的整数。

ES11 引入了 `BigInt` 类型，用于表示任意大小的整

**语法**：在数值后加 `n`，例如 `123n`，表示一个 `BigInt`。



```js
const num = Number.MAX_SAFE_INTEGER;
console.log(num); // 输出: 9007199254740991

// 使用 BigInt 表示超过 MAX_SAFE_INTEGER 的数
const bigInt1 = 9007199254740992n;
console.log(bigInt1); // 输出: 9007199254740992n

// 任意整数加 n 变为 BigInt
console.log(1n); // 输出: 1n

// BigInt 只能与 BigInt 进行运算
console.log(1n + 2n); // 输出: 3n

// BigInt 与普通数字运算会报错
// console.log(1n + 2); // 报错
```



## 特点

1. **任意大小**：可以表示非常大的整数。
2. **类型安全**：`BigInt` 只能与 `BigInt` 进行运算，不能与其他类型混合运算。
3. **存储方式**：与普通数字的存储方式不同，因此不能直接混合使用。