## 静态属性

- **`Number.MAX_VALUE`**：表示最大的正数。
- **`Number.MIN_VALUE`**：表示最小的正数。
- **`Number.MAX_SAFE_INTEGER`**：最大安全整数。
- **`Number.MIN_SAFE_INTEGER`**：最小安全整数。



## 实例方法

- **`toString()`**：将数字转换为字符串，可以指定进制。

```javascript
const num = 123;
console.log(num.toString());    // 输出: "123"
console.log(num.toString(2));   // 输出: "1111011"
```

- **`toFixed(digits)`**：格式化数字，保留指定小数位数。

```javascript
const pi = 3.14159;
console.log(pi.toFixed());      // 输出: "3"
console.log(pi.toFixed(3));     // 输出: "3.142"
console.log(typeof pi.toFixed(2)); // 输出: "string"
```



## 静态方法

- **`Number.parseInt()`**：将字符串转换为整数。

```javascript
const numStr = '3.525';
console.log(Number.parseInt(numStr)); // 输出: 3
```

- **`Number.parseFloat()`**：将字符串转换为浮点数。

```javascript
console.log(Number.parseFloat(numStr)); // 输出: 3.525
```

- **`parseInt` 和 `parseFloat`** 也存在于全局对象 `window` 上。

```javascript
console.log(parseInt === Number.parseInt);   // 输出: true
console.log(parseFloat === Number.parseFloat); // 输出: true
```

### 转换规则

- `parseInt` 和 `parseFloat` 会从字符串开头截取合法数字部分进行转换。

```javascript
console.log(parseInt('123a234'));   // 输出: 123
console.log(parseFloat('123.223a24213')); // 输出: 123.223
```

- 如果字符串不是以数字开头，返回 `NaN`。

```javascript
console.log(parseInt('a23')); // 输出: NaN
```

