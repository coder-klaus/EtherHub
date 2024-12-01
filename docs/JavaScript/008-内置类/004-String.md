## 不可变性

字符串在 JavaScript 中是不可变的，即一旦创建就无法修改。

所以字符串的方法基本都是纯函数

```js
const str = 'Hello World'
str[4] = 'A' // 无效修改
console.log(str) // => Hello World
```



## 长度

字符串在内存中被解析为字符数组。所以存在`length`属性

```js
const str = 'Hello World';
console.log(str.length); // 输出: 11
```



## 获取值

```js
const str = 'Hello World'

console.log(str[4]) // => o
console.log(str.charAt(4))  // => o
```

区别在于获取越界元素上

```js
console.log(str[20]) // => undefined
console.log(str.charAt(20)) // => ''(空字符串)
```



## 迭代

字符串支持三大for循环，但不支持forEach循环



## 转大小写

```js
const str = 'Hello World'

// 将所有的字符转成小写
console.log(str.toLowerCase()) // => hello world

// 将所有的字符转成大写
console.log(str.toUpperCase()) // => HELLO WORLD

// 不改变原字符串值
console.log(str) // => Hello World
```



## 查找

### startsWith/endsWith

```js
const str = 'Hello World'

// 字符串以参数对应的字符串开头
console.log(str.startsWith('Hello')) // => true
console.log(str.startsWith('World', 6)) // => true

// 字符串以参数对应的字符串结尾
console.log(str.endsWith('World')) // => true
console.log(str.endsWith('Hello', 5)) // => true
```

::: tip

```js
'Hello World'.startsWith('World', 6)
```

等价于

```js
'Hello World'.slice(6).startsWith('World')
```

:::



### indexOf

在slice后的字符串中进行查找对应子串, 

```js
const str = 'Hello World'

console.log(str.indexOf('World')) // => 6

// slice后的字符串为 World
console.log(str.indexOf('World', 6)) // => 6

// slice后的字符串为 orld
console.log(str.indexOf('World', 7)) // => -1
```



### ==lastIndexOf==

```js
const str = 'Hello World'

console.log(str.lastIndexOf('World')) // => 6
console.log(str.lastIndexOf('World', 6)) // => 6
console.log(str.lastIndexOf('World', 5)) // => -1
```



### includes

```js
const str = 'Hello World'

console.log(str.includes('World')) // => true

// 截取后的字符串为 orld
console.log(str.includes('World', 7)) // => false
```



## 替换

查找到对应的字符串，并且使用新的字符串进行替代

+ 参数一 既可以是字符串，也可以是RegExp
+ 参数二 既可以是字符串，也可以是一个函数

```js
const str = 'Hello World'

console.log(str.replace('World', 'JavaScript')) // => Hello JavaScript

console.log(str.replace('World', () => 'HTML'))  // => Hello HTML
```

```js
const str = 'Hello World, Hello css'

console.log(str.replace(/Hello/g, 'Bye')) // => Bye World, Bye css

// 等价于
console.log(str.replaceAll('Hello', 'Bye')) // => Bye World, Bye css
```



## 切片

`slice(start, end)` => 截取`[start, index)`对应的子串

+ `end`省略，表示到截取最后
+ `end`支持负数索引
  + 正数索引从0开始
  + 负数索引从-1开始

```js
const str = 'Hello World'

console.log(str.slice(3, 7)) // => lo W
console.log(str.slice(3)) // => lo World
console.log(str.slice(3, -3)) // => lo Wo
```



## 子串

### substr

`substr(start, length)`非标准方法，不推荐使用

```js
const str = 'Hello World'

console.log(str.substr(3, 6)) // => lo Wor
console.log(str.substr(3, 22)) // => lo World
```



### substring

`substring(start, end)` => 截取索引为`[start, end)`的子串

+ `end`省略表示截取到字符串末尾
+ `end`不支持负值，如果为负值自动容错处理
  + 按照`substring(0, start)`进行处理 

```js
const str = 'Hello World'

console.log(str.substring(3, 7)) // => lo W
console.log(str.substring(3)) // => lo World
console.log(str.substring(3, -1)) // => Hel
```



## 拼接

```js
const user1 = 'Klaus'
const user2 = 'Steven'
const user3 = 'Alex'

// 方式一
console.log(user1 + ' ' + user2 + ' ' + user3) // => Klaus Steven Alex

// 方式二
console.log(`${user1} ${user2} ${user3}`) // => Klaus Steven Alex

// 方式三 => concat返回值是拼接后的新字符串
console.log(user1.concat(' ' + user2).concat(' ' + user3)) // => Klaus Steven Alex
```



`concat`方法接收可变参数

```js
console.log(user1.concat(' ' + user2, ' ' + user3)) // => Klaus Steven Alex
```



## 去除空格

```js
const str = '    Hello World    '

console.log(str.trim()) // => Hello World(前后都没有空格)
console.log(str.trimStart()) // => Hello World    (尾部有空格)
console.log(str.trimEnd()) // =>    Hello World(首部有空格)
```



## 分割

`split(separator, limit)`

- `separator`：指定分隔符。
  - 如果不传入，返回包含整个字符串的数组。
  - 如果传入分割符不存在，则静默失效。
- `limit`：限制返回的数组元素个数。

```js
const str = 'Hello World'

console.log(str.split()) // => ['Hello World']
console.log(str.split('*')) // => ['Hello World']
console.log(str.split(' ')) // => [ 'Hello', 'World' ]

console.log(str.split(' ', 1)) // => [ 'Hello' ]
```



## 拼接

`join(separator)` => 将数组的所有元素连接成一个字符串

+ `separator`：指定连接符。如果不传入，默认使用逗号。

```js
const strs = [ 'Hello', 'World' ]

console.log(strs.join('*')) // => Hello*World
console.log(strs.join()) // => Hello,World
```



## 填充

`padStart(num, pad)` / `padEnd(num, pad)`

1. `pad`需要是单个字符 => 不是字符串转字符串并取第一个字符
2. `num`表示填充后字符串的长度
   + 如果原始字符串的长度已经大于`num`, 则静默失效

```js
const str = '1'

console.log(str.padStart(3, 0)) // => 001
console.log(str.padEnd(3, 0)) // => 100
```

