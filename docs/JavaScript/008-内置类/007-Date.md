- **GMT (Greenwich Mean Time)**
  - 是以英国伦敦的皇家格林威治天文台为基准的时间。
  - 通常用于描述全球统一的时间标准。

- **UTC (Coordinated Universal Time)**
  - 是现代标准时间，基于原子钟计算。
  - 更加精确，取代了 GMT 作为全球时间标准。

+ 时区

  - 往东的时区是 GMT+，例如中国是 GMT+8。

  - 往西的时区是 GMT-。

在浏览器中，使用的时区一律为`UTC`时间戳



## 时间戳

1970年一月一日零食零分零秒距离现在的秒数或毫秒数

如果是毫秒数，时间戳为13位，是JavaScript使用的时间戳

如果是秒数，时间戳为10位，是Go等语言使用的时间戳，也是Unix时间戳



## 使用

```js
// 没有参数 生成当前时间
const date = new Date()

// 直接打印，自动转字符串
console.log(date)
```

```js
// 加不加new 输出的都是Date实例
const date1 = new Date() // 推荐
const date2 = Date() // 不推荐
```

```js
// 传入一个时间戳
const date = new Date(1652693601880)
console.log(date) // => Mon May 16 2022 17:33:21 GMT+0800 (中国标准时间)
```

```js
// 传入日期字符串 => 只有年份是必传的
const date = new Date('2022-02-13')
console.log(date) // => Sun Feb 13 2022 08:00:00 GMT+0800 (中国标准时间)
```

```js
// 传入多个参数，分别对应 年，月，日，时，分，秒，毫秒
// 年和月是不能省略的
const date = new Date(2022, 02, 13, 08, 22, 45, 222) 
```



## 日期表示标准

### 标准分类

- **RFC 2822 标准**
  - 主要用于电子邮件中的日期和时间表示。
  - 日期格式：`日-月-年`，使用英文月份和星期缩写。
  - 时间格式：24小时制，时区用四位数偏移量或 GMT 表示。

- **ISO 8601 标准**
  - 通用的日期和时间表示标准，广泛应用于数据交换和软件开发。
  - 日期格式：`年-月-日`。
  - 时间格式：24小时制，用冒号分隔小时、分钟和秒。
  - 时区用正负号偏移量或字母 "Z"（表示 UTC）表示。

### 示例说明

- **RFC 2822 示例**
  - `Thu, 07 Oct 2023 12:00:00 GMT`
  - `Thu, 07 Oct 2023 09:30:00 -0400`

- **ISO 8601 示例**
  - `2022-05-16T09:24:22.113Z`
  - `2022-05-03T17:30:08+08:00`

### 日期处理

- **浏览器**
  - 默认使用 ISO 8601 格式。
  - 自动进行时区转换。
- **Node.js**
  - 默认使用 ISO 8601 格式。
  - 不自动进行时区转换。

### 非标准格式

- 常见的非标准格式：
  - `Sat Oct 07 2023 17:20:59 GMT+0800 (中国标准时间)`
  - `2022-02-12 12:03:25.333`
  - `2022/02/12 12:03:25.333`
- 这些格式通常没有时区概念，默认使用系统所在的时区

### ISO格式格式化

| 标识 | 说明                                                         |
| ---- | ------------------------------------------------------------ |
| YYYY | 年份，0000 ~ 9999<br>YYYY表示四位年份<br>YY表示两位年份      |
| MM   | 月份，01 ~ 12<br>月份使用MM表示，以区分 分钟                 |
| DD   | 日，01 ~ 31                                                  |
| T    | 分隔日期和时间，没有特殊含义，可以省略                       |
| HH   | 小时，00 ~ 23<br>HH表示24小时制<br>hh表示12小时制            |
| mm   | 分钟，00 ~ 59<br>分钟使用mm表示，以区分 月份                 |
| ss   | 秒，00 ~ 59                                                  |
| .sss | 毫秒                                                         |
| Z    | 时区<br>Z表示零时区<br>其他时区可以用±HH:mm表示，例如+08:00表示东八区 |



## 日期格式转换示例

在 JavaScript 中，`Date` 对象提供了多种方法来格式化日期。以下是一些常见格式及其转换方法：

#### 默认格式

```javascript
const date = new Date();

// 完整日期和时间
console.log(date.toString()); 
// 示例输出: "Wed Aug 07 2024 20:33:17 GMT+0800 (中国标准时间)"

// 仅日期
console.log(date.toDateString()); 
// 示例输出: "Wed Aug 07 2024"

// 仅时间
console.log(date.toTimeString()); 
// 示例输出: "20:33:17 GMT+0800"
```

#### ISO 格式

```javascript
const date = new Date();

// ISO 8601 格式
console.log(date.toISOString()); 
// 示例输出: "2024-08-07T12:33:17.768Z"

// JSON 格式（与 ISO 8601 相同）
console.log(date.toJSON()); 
// 示例输出: "2024-08-07T12:33:17.768Z"
```

#### RFC 格式

```javascript
const date = new Date();

// RFC 2822 格式
console.log(date.toUTCString()); 
// 示例输出: "Wed, 07 Aug 2024 12:40:45 GMT"
```

#### 本地格式

```javascript
const date = new Date();

// 本地日期和时间
console.log(date.toLocaleString()); 
// 示例输出: "2024/8/7 20:33:17"

// 本地日期
console.log(date.toLocaleDateString()); 
// 示例输出: "2024/8/7"

// 本地时间
console.log(date.toLocaleTimeString()); 
// 示例输出: "20:33:17"
```



## 获取和设置时间信息

在 JavaScript 中，`Date` 对象提供了多种方法来获取和设置日期与时间的详细信息。以下是常用的方法：

#### 获取时间信息

- `getFullYear()`: 获取年份（4 位数）
- `getMonth()`: 获取月份，从 0 到 11（注意：月份从 0 开始）
- `getDate()`: 获取当月的具体日期，从 1 到该月的最大值
- `getHours()`: 获取小时
- `getMinutes()`: 获取分钟
- `getSeconds()`: 获取秒钟
- `getMilliseconds()`: 获取毫秒
- `getDay()`: 获取一周中的第几天，从 0（星期日）到 6（星期六）
- `getTime()`: 获取时间戳（从 1970 年 1 月 1 日至今的毫秒数）

#### 设置时间信息

- `setFullYear(year, month, date, hours, minutes, seconds, milliseconds)`: 设置年份

- `setMonth(month, date, hours, minutes, seconds, milliseconds)`: 设置月份（0-11）

- `setDate(date, hours, minutes, seconds, milliseconds)`: 设置日期

- `setHours(hours, minutes, seconds, milliseconds)`: 设置小时

- `setMinutes(minutes, seconds, milliseconds)`: 设置分钟

- `setSeconds(seconds, milliseconds)`: 设置秒钟

- `setMilliseconds(milliseconds)`: 设置毫秒

- `setTime(time)`: 设置时间戳

- `setDay()`： 不存在该方法

  

#### 获取时间信息

```javascript
const date = new Date();

console.log(date.getFullYear());   // 示例输出: 2022
console.log(date.getMonth() + 1);  // 示例输出: 5
console.log(date.getDate());       // 示例输出: 16
console.log(date.getHours());      // 示例输出: 18
console.log(date.getMinutes());    // 示例输出: 59
console.log(date.getSeconds());    // 示例输出: 12
console.log(date.getMilliseconds()); // 示例输出: 232
console.log(date.getDay() + 1);    // 示例输出: 2
```

#### 设置时间信息

```javascript
const date = new Date();

date.setDate(32);  // 设置为5月32日，自动校准为6月1日
console.log(date); // 示例输出: 2022-06-01T11:01:18.820Z
```



## 获取时间戳

### 当前时间的时间戳

```javascript
const now = Date.now();
console.log(now); // 输出当前时间的时间戳，例如：1652700765000
```

`Date.now()` 返回自 1970 年 1 月 1 日 00:00:00 UTC 到当前时间的毫秒数。

### 特定日期的时间戳

```javascript
const date = new Date('2022-02-13');

// 使用实例方法获取时间戳
console.log(date.getTime());  // => 1644710400000
console.log(date.valueOf());  // => 1644710400000
```

`getTime()` 和 `valueOf()` 方法都返回该日期对象的时间戳。

### 转换为数值类型

```javascript
console.log(+date); // => 1644710400000
```

在 `Date` 对象前加上 `+` 号，可以将其转换为时间戳。



## 日期字符串解析

```javascript
console.log(Date.parse('Mon May 16 2022 19:32:45 GMT+0800 (中国标准时间)')); // => 1652700765000
```

- `Date.parse(str)` 可以将符合 RFC2822 或 ISO 8601 格式的日期字符串转换为时间戳。
- 如果字符串格式不正确，`Date.parse()` 将返回 `NaN`。



## 计算时、分、秒

假设我们有一个时间戳，并希望计算出当前时间距当天零点的时、分、秒。

```javascript
const now = new Date();

console.log(now); // 当前时间，例如：2022-05-21T04:57:40.413Z

// 创建一个新的日期对象，并将其设置为当天的零点
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

// 计算当前时间与当天零点的时间戳差值（以秒为单位）
const intervalTime = Math.floor((now - startOfDay) / 1000);

// 根据时间戳差值计算时、分、秒
const hours = Math.floor(intervalTime / 3600); // 每小时3600秒
const minutes = Math.floor((intervalTime % 3600) / 60); // 每分钟60秒
const seconds = intervalTime % 60;

console.log(hours);   // 输出当前时间的小时数
console.log(minutes); // 输出当前时间的分钟数
console.log(seconds); // 输出当前时间的秒数
```
