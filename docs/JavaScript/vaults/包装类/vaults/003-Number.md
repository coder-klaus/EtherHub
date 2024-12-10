# Number
[[TOC]]

## 基本使用
```js
var n = new Number(1);
typeof n // "object"

Number('1') // 1
```



## 静态属性

| 常量                       | 描述                                                         |
| -------------------------- | ------------------------------------------------------------ |
| `Number.POSITIVE_INFINITY` | ` Infinity`                                                  |
| `Number.NEGATIVE_INFINITY` | `-Infinity`                                                  |
| `Number.NaN`               | `NaN`                                                        |
| `Number.MAX_VALUE`         | 表示最大的正数                                               |
| `Number.MIN_VALUE`         | 表示==最小的正数（即最接近0的正数4）==<br />相应的，最接近0的负数为 `-Number.MIN_VALUE` |
| `Number.MAX_SAFE_INTEGER`  | 表示最大的整数                                               |
| `Number.MIN_SAFE_INTEGER`  | 表示最小的整数                                               |

```js
Number.POSITIVE_INFINITY // Infinity
Number.NEGATIVE_INFINITY // -Infinity
Number.NaN // NaN

Number.MAX_VALUE < Infinity // true
Number.MIN_VALUE > 0 // true
```



## 实例方法

### toString

重写了`Object`的`toString`，返回调用`String`方法后的结果

```js
(10).toString() // "10"
```

注意`10.toString()`会报错，因为会被解析为`10.0toString()`

对应的解决方法

1. `(10).toString()`
2. `10..toString()`
3. `10.0.toString()` => 可以直接对一个小数使用`toString`
4. `10 .toString()`
5. `new Number(10).toString()`
6. `10['toString']()`



接收第二个参数，表示转换进制

+ 默认进制为十进制
+ 功能是将一个数字转化成某个进制的字符串 => 不带进制前缀
+ 可以表示的进制范围`[2, 36]` => `36`是因为`0-9a-zA-Z`一共有36个字符

```js
(10).toString(2) // "1010"
```



### toFixed

将数值转换为指定位置小数后转字符串

```js
(10).toFixed(2) // "10.00"
10.005.toFixed(2) // "10.01"
```

由于浮点数的原因，小数`5`的四舍五入是不确定的

```js
(10.055).toFixed(2) // 10.05
(10.005).toFixed(2) // 10.01
```



### toExponential

1. 转科学计数法
2. 参数为保留的小数点格式

```js
(1234).toExponential()  // "1.234e+3" => 默认转标准科学计数法
(1234).toExponential(1) // "1.2e+3"
(1234).toExponential(2) // "1.23e+3"
(10).toExponential(2) // "1.00e+1" => 不足补零
```



### toPrecision

1. 用于控制数值的总有效数字, 本质是在**控制数值的显示精度**
2. 当参数小于整数部分的长度时，`toPrecision` 会使用科学计数法
3. 当参数大于或等于整数部分的长度时，`toPrecision` 类似于 `toFixed`，但它控制的是总有效数字，而不是小数位数。

```js
(12.34).toPrecision(1) // "1e+1"
(12.34).toPrecision(2) // "12"
(12.34).toPrecision(3) // "12.3"
(12.34).toPrecision(4) // "12.34"
(12.34).toPrecision(5) // "12.340" => 不足补零
```



### toLocaleString

将日期、时间或数字格式化为特定地区格式 => 可以应用于 `Date`和`Number`

语法格式为`number.toLocaleString([locales[, options]])`

- `locales`（可选）
  - 一个字符串或数组，对应的地区码「如`"en-US"`、`"zh-CN"`」 => 不区分大小写。
  - 如果不指定，默认使用系统默认设置的地区码。
- `options`（可选）：一个对象，配置格式化的选项。
  - `style`: 指定格式化的样式，如 `"decimal"`「 默认值，表示为数值 」、`"currency"`「 表示为货币 」、`"percent"`「表示为百分比」。
  - `currency`: 当 `style` 为 `"currency"` 时可用，用于指定货币类型，如 `"USD"`、`"CNY"`。
  - `minimumFractionDigits` 和 `maximumFractionDigits`: 指定小数部分的最小和最大位数。

```js
(123456789).toLocaleString('zh-CN-u-nu-hanidec');  // '一二三四五六七八九' => 只支持转小写中文，大写中文需要第三方库

(123456789).toLocaleString('zh-CN') // '123,456,789'
(123456789).toLocaleString() // '123,456,789' => 不设置地区码，使用系统地区

(123).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) // "$123.00"
```



参数是字符串，会被作为地区码。如果无法识别，直接报错

```js
(123).toLocaleString('123') // 报错
```



如果参数是函数，直接报错

```js
(123).toLocaleString(() => 123) // 报错
```



如果是其他类型参数，返回数值本身

```js
(123).toLocaleString() // 123
(123).toLocaleString({}) // 123
(123).toLocaleString(123) // 123
```



所以如果想传递第二个参数对象时，必须提供第一个参数

```js
(123).toLocaleString({ style: 'currency', currency: 'CNY' })  // '123'
(123).toLocaleString('zh-cn',{ style: 'currency', currency: 'CNY' })  // '¥123.00'
```



`minimumFractionDigits` 和 `maximumFractionDigits`用于控制转换后小数点个数

```js
(123456789).toLocaleString('en-US') // '123,456,789'

(123456789).toLocaleString('zh-CN', { minimumFractionDigits: 1 }) // '123,456,789.0' => 不足补0
(123.456).toLocaleString('zh-CN', { maximumFractionDigits: 2 }) // '123.46' => 自动截取并四舍五入

(123.456).toLocaleString('zh-CN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
}) // '123.46' => 可以同时指定
```



### parseInt





### parseFloat