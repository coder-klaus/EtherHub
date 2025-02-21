## 概述

1. JavaScript Object Notation
2. 用于前后端数据交换，或本地数据存储文件 或 配置文件

>  其它数据交互格式 有 `xml` 和 `protobuf` 「 google发明的新数据交换格式 」



## 支持类型

1. 简单值
   + 仅支持 `string | number | boolean | null`
2. 普通对象值
   + key 必须加上双引号
   + 值类型只能是 `简单值 | 普通对象值 | 数组值`
   + 最后一个键值对不要以引号结尾
3. 数组值
   + 值类型只能是 `简单值 | 普通对象值 | 数组值`
   + 最后一个键值对不要以引号结尾



## 方法

+ 序列化 => `JSON => string` => `JSON.stringify`
  + 转字符串时，会过滤所有非法JSON格式数据
  + `JSON.stringify() 的返回值 是 undefined`
+ 反序列化 => `string => JSON` => `JSON.parse` 
  + 如果没有参数 「 即解析undefined 」或 参数不是 合法有效的JSON字符串 会直接报错

```js
const user = {
  name: 'Klaus',
  age: 23,
  friend: {
    name: 'Alex',
    age: 22
  }
}

// 默认转换为单行字符串
console.log(JSON.stringify(user))
// => {"name":"Klaus","age":23,"friend":{"name":"Alex","age":22}}

// 第二个参数表示劫持函数，如果不需要可以传入null
console.log(JSON.stringify(user, (key, value) => {
  if (key === 'age') {
    return value + 2
  }

  return value
}))
// => {"name":"Klaus","age":25,"friend":{"name":"Alex","age":24}}

// 第三个参数表示  占位符 => 只能是 number | string => 其余类型静默失效
// 1. number => number个空格进行缩进占位
// 2. stirng => 使用字符串进行缩进占位
console.log(JSON.stringify(user, null, 2))
/*
=>
{
  "name": "Klaus",
  "age": 23,
  "friend": {
     "name": "Alex",
     "age": 22
   }
 }
*/

console.log(JSON.stringify(user, null, 'xxx'))
/*
=>
{
xxx"name": "Klaus",
xxx"age": 23,
xxx"friend": {
xxxxxx"name": "Alex",
xxxxxx"age": 22
xxx}
}
*/
```

```js
const jsonStr = '{"name":"Klaus","age":23,"friend":{"name":"Alex","age":22}}'

// 基本使用
console.log(JSON.parse(jsonStr))
// => { name: 'Klaus', age: 23, friend: { name: 'Alex', age: 22 } }

// 可以传入第二个参数 => 劫持函数
console.log(JSON.parse(jsonStr, (key, value) => {
  if (key === 'age') {
    return value + 2
  }

  return value
}))
// => { name: 'Klaus', age: 25, friend: { name: 'Alex', age: 24 } }
```



## toJSON

```js
const user = {
  name: 'Klaus',
  age: 23,
  friend: {
    name: 'Alex',
    age: 22
  },
  toJSON() {
    // 调用方式为 user.toJSON, 所以this的值是 user
    return this.name + ' ' + this.age
  }
}

// 如果当前对象实现了toJSON方法，那么在序列化的时候会使用对象的toJSON方法来替代默认的序列化方法
console.log(JSON.stringify(user)) // => Klaus 23
```

