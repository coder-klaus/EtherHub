# String


[[TOC]]

## 概述

字符串是伪数组对象

```js
new String('abc');
// String {0: "a", 1: "b", 2: "c", length: 3}

(new String('abc'))[1]; // "b"
```

同样`String`方法可以将任意类型转字符串类型

```js
String(true) // "true"
String(5) // "5"
```

==字符串具有不可变性，任何对字符串的操作都将返回一个新的字符串，不改变原字符串。==



## length

返回字符串长度

```js
'abc'.length // 3
```



## 方法

### charAt

类似于通过索引去获取元素

```javascript
'abc'.charAt(1); // 返回 "b"
'abc'[1]; // 返回 "b"
```



如果是越界元素，方括号语法返回`undefined`。`charAt`返回空字符串

```javascript
'abc'[-1]; // 返回 ""
'abc'[3]; // 返回 ""

'abc'.charAt(-1); // 返回 ""
'abc'.charAt(3); // 返回 ""
```





### concat

`concat` 方法用于连接两个或多个字符串，返回一个新字符串，并且不改变原字符串。

- **不改变原字符串**：原始字符串保持不变。
- **多参数**：可以接受多个参数进行连接。
- **自动类型转换**：如果参数不是字符串，会先将其转换为字符串，然后再连接。

```js
const str = 'a'
str.concat('b', 'c') // "abc"
str // 'a'
```

```js
''.concat(1, 2, '3') // "123"
1 + 2 + '3' // '33'
```



### slice

`slice` 方法用于从原字符串中提取子字符串，并返回一个新字符串，不改变原字符串。

#### 参数

- **第一个参数**：子字符串的开始位置。
- **第二个参数**：子字符串的结束位置（不包含该位置）。如果省略，则一直到字符串的结尾。

#### 特点

- **不改变原字符串**：原始字符串保持不变。
- **支持负数索引**：负数表示从字符串末尾开始计数。
- **空字符串情况**：如果第一个参数大于第二个参数（正数情况下），返回空字符串。

```javascript
// 基本用法
'JavaScript'.slice(0, 4); // "Java"

// 省略第二个参数
'JavaScript'.slice(4); // "Script"

// 使用负数索引
'JavaScript'.slice(-6); // "Script"
'JavaScript'.slice(0, -6); // "Java"
'JavaScript'.slice(-2, -1); // "p"

// 参数顺序问题
'JavaScript'.slice(2, 1); // ""
```



### substring

`substring` 方法用于从原字符串中提取子字符串，并返回一个新字符串，不改变原字符串。

#### 参数

- **第一个参数**：子字符串的开始位置。
- **第二个参数**：子字符串的结束位置（不包含该位置）。如果省略，则一直到字符串的结尾。

#### 特点

- **不改变原字符串**：原始字符串保持不变。
- **自动调整参数顺序**：如果第一个参数大于第二个参数，会自动交换两个参数。
- **负数处理**：如果参数是负数，会自动转换为 0。

```javascript
// 基本用法
'JavaScript'.substring(0, 4); // "Java"

// 省略第二个参数
'JavaScript'.substring(4); // "Script"

// 参数顺序自动调整
'JavaScript'.substring(10, 4); // "Script"
// 等同于
'JavaScript'.substring(4, 10); // "Script"

// 负数参数处理
'JavaScript'.substring(-3); // "JavaScript"
'JavaScript'.substring(4, -3); // "Java"
```

> 由于 `substring` 的一些规则可能违反直觉，建议优先使用 `slice` 方法。



### substr

`substr` 方法用于从原字符串中提取子字符串，并返回一个新字符串，不改变原字符串。

#### 参数

- **第一个参数**：子字符串的开始位置（从 0 开始）。负数表示从字符串末尾开始倒数计算。
- **第二个参数**：子字符串的长度。如果省略，则一直到字符串的结尾。负数会被自动转换为 0，返回空字符串。

#### 特点

- **不改变原字符串**：原始字符串保持不变。
- **负数处理**：第一个参数负数表示从末尾开始，第二个参数负数被视为 0。

```javascript
// 基本用法
'JavaScript'.substr(4, 6); // "Script"

// 省略第二个参数
'JavaScript'.substr(4); // "Script"

// 使用负数开始位置
'JavaScript'.substr(-6); // "Script"

// 第二个参数为负数
'JavaScript'.substr(4, -1); // ""
```

> 非标准方法，不推荐使用



### indexOf/lastIndexOf

#### indexOf

`indexOf` 方法用于确定一个字符串在另一个字符串中第一次出现的位置。

#### 参数

- **第一个参数**：要查找的子字符串。
- **第二个参数（可选）**：从该位置开始向后查找。

#### 返回值

- 返回子字符串首次出现的起始位置。
- 如果未找到，返回 -1。

```javascript
'hello world'.indexOf('o'); // 4
'JavaScript'.indexOf('script'); // -1
'hello world'.indexOf('o', 6); // 7
```



#### lastIndexOf

`lastIndexOf` 方法用于确定一个字符串在另一个字符串中最后一次出现的位置。

#### 参数

- **第一个参数**：要查找的子字符串。
- **第二个参数（可选）**：从该位置开始向前查找。

#### 返回值

- 返回子字符串最后出现的起始位置。
- 如果未找到，返回 -1。

```javascript
'hello world'.lastIndexOf('o'); // 7
'hello world'.lastIndexOf('o', 6); // 4
```



### trim/trimStart/trimEnd

`trim` 方法用于去除字符串两端的==空白字符==，并返回一个新字符串，不改变原字符串。

```javascript
'  hello world  '.trim(); // "hello world"
'\r\nabc \t'.trim(); // "abc"
```

`trimStart` 方法用于去除字符串开启位置的==空白字符==，并返回一个新字符串，不改变原字符串。

```js
'  hello world  '.trimStart(); // "hello world  "
'\r\nabc \t'.trimStart(); // "abc \t"
```

`trimEnd` 方法用于去除字符串结束位置的==空白字符==，并返回一个新字符串，不改变原字符串。

```js
'  hello world  '.trimEnd(); // "  hello world"
'\r\nabc \t'.trimEnd(); // "\r\nabc"
```



### toLowerCase/toUpperCase

`toLowerCase`方法用于将一个字符串全部转为小写，`toUpperCase`则是全部转为大写

```js
'Hello World'.toLowerCase() // "hello world"

'Hello World'.toUpperCase() // "HELLO WORLD"
```



### match

1. 功能: ==字符串匹配 => 是字符串的方法，不是正则的方法==
2. 匹配子串
3. 返回匹配的第一个字符串组成的数组
4. 如果没有找到匹配，则返回`null`

```js
'cat, bat, sat, fat'.match('at') // ["at"]
'cat, bat, sat, fat'.match('xt') // null
```



==返回的数组还有`index`属性和`input`属性，分别表示匹配字符串开始的位置和原始字符串==

```js
const matches = 'cat, bat, sat, fat'.match('at');
matches.index // 1
matches.input // "cat, bat, sat, fat"
```



### search

1. 功能和`match`类似
2. 只不过返回的第一个匹配元素对应索引
3. 没有找到返回`-1`

```js
'cat, bat, sat, fat'.search('at') // 1
```



### replace/replaceAll

1. 功能: 替换子串
2. ==某个方法可以传入正则，且方法名以`All`结尾，则传入的正则必须是全局正则，否则会报错, 因为内部需要进行全局匹配==

```js
'aaa'.replace('a', 'b') // "baa"
'aaa'.replace(/a/, 'b') // "baa"
'aaa'.replace(/a/g, 'b') // "bbb"

'aaa'.replaceAll(/a/g, 'b') // "bbb"
'aaa'.replaceAll('a', 'b') // "bbb"
'aaa'.replaceAll(/a/, 'b') // error
```



### split

按照给定规则分割字符串，返回一个由分割出来的子字符串组成的数组

```js
'a|b|c'.split('|') // ["a", "b", "c"]
'a|b|c'.split('') // ["a", "|", "b", "|", "c"] => 空字符串就是字符串拆分

// 分隔符前后如果没有字符，则使用空字符串
'a||c'.split('|') // ['a', '', 'c']
'|b|c'.split('|') // ["", "b", "c"]
'a|b|'.split('|') // ["a", "b", ""]
```

如果省略参数，则返回数组的唯一成员就是原字符串。

```js
'a|b|c'.split() // ["a|b|c"]
```

可以接受第二个参数，限定返回数组的最大成员数。

```js
'a|b|c'.split('|', 0) // []
'a|b|c'.split('|', 1) // ["a"]
'a|b|c'.split('|', 2) // ["a", "b"]
'a|b|c'.split('|', 3) // ["a", "b", "c"]
'a|b|c'.split('|', 4) // ["a", "b", "c"] => 越界按照最大的来
```

