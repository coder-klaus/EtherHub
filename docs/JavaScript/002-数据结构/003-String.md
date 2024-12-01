## 基本表示

在 JavaScript 中，字符串可以用三种方式表示：

- **单引号**: `'Hello'`
- **双引号**: `"World"`
- **反引号**: `` `Hello World` ``

### 反引号的特殊用法

- 可以嵌入表达式：使用 `${}` 语法。
- 支持多行字符串。

```javascript
const firstWord = "Hello";
const lastWord = 'World';
const word = `${firstWord} ${lastWord} ${1 + 2}`; // "Hello World 3"
```



## 注意事项

- 字符串的引号类型必须一致。
- 不同引号类型不能混用。
- 字符串具有不可变性。每次操作字符串都是生成一个全新的新的字符串。



## 字符串拼接

### 传统拼接

- 使用 `+` 进行拼接：

  ```javascript
  const firstName = 'Klaus';
  const lastName = 'Wang';
  let fullName = firstName + ' ' + lastName; // "Klaus Wang"
  ```

### 模板字符串

- 使用模板字符串进行拼接：

  ```javascript
  fullName = `${firstName} ${lastName}`; // "Klaus Wang"
  ```



## 特殊字符和转义字符

- 可以通过转义字符 `\` 来插入特殊字符，例如换行 `\n`、制表符 `\t` 等。

![image.png](https://s2.loli.net/2024/12/01/lRMvoCHZ6wIKzgU.png) 



## length 属性

+ 字符串在底层解析时，按照字符数组进行解析。
+ 所以部分数组的方法和属性也能在字符串中使用，但javascript中没有字符这个数据类型。
+ 例如`length` 属性返回字符串的长度：

```javascript
const str = 'Hello World';
console.log(str.length); // 11
```

