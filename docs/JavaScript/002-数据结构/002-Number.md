**Number 类型**用于表示整数或浮点数。JavaScript 中所有数字都是 `Number` 类型。



## 特殊数值

### Infinity

- 代表无穷大，可以通过 `1 / 0` 获得。

- 负无穷大用 `-Infinity` 表示。

- 示例代码：

  ```javascript
  let n = Infinity;
  console.log(n); // Infinity
  ```

- 使用 `isFinite` 判断是否是有限数：

  ```javascript
  console.log(Number.isFinite(n)); // false
  console.log(isFinite(n)); // false
  ```



### NaN (Not a Number)

- 表示计算错误的结果，例如字符串与数字相乘。

- 使用 `isNaN` 来判断：

  ```javascript
  const foo = 'asv' * 2;
  console.log(Number.isNaN(foo)); // true
  ```

- `NaN` 与任何值（包括自身）比较都返回 `false`，但 `Object.is` 可以正确判断：

  ```javascript
  console.log(NaN === NaN); // false
  console.log(Object.is(NaN, NaN)); // true
  ```



## 进制表示

JavaScript 支持多种进制表示：

- **十进制**: `100`
- **二进制**: `0b100`
- **八进制**: `0o100`
- **十六进制**: `0x100`

```javascript
const num = 100;
const bin = 0b100;
const oct = 0o100;
const hex = 0x100;

console.log(num, bin, oct, hex); // 100 4 64 256
```



**注意:**

1. 进制前缀不区分大小写 例如: `ob` 等价于 `0B`
2. 无论什么进制，控制台输出一律为十进制
3. 如果需要输出进制数本身，需要使用`tostring(n)`且输出的进制数没有进制前缀



## 数字范围

- **最小数字**: `Number.MIN_VALUE`
- **最大数字**: `Number.MAX_VALUE`
- **安全整数范围**:
  - 最小安全整数: `Number.MIN_SAFE_INTEGER`
  - 最大安全整数: `Number.MAX_SAFE_INTEGER`

判断是否为安全整数：

```javascript
const num = Infinity;
console.log(Number.isSafeInteger(num)); // false
```

注意：虽然绝大多数`Number`的方法即在`Number`上存在一份，在`windows`上也存在一份。但`isSafeInteger` 方法不在 `window` 对象上。



