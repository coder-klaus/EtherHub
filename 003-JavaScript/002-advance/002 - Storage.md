## 概述

1. 临时存储
2. 比cookie存储更直观简单



### 分类

+ `localStorage` => 持久存储 => 除非手动删除，否则一直存在
+ `sessionStorage` => 会话存储 => 仅在当前浏览器会话阶段生效



### 浏览器会话

浏览器会话 「 Browser Session 」 => 是指用户与浏览器之间的一段交互过程

- **开始**：会话从用户打开浏览器或一个新的标签页时开始。
- **结束**：会话在用户关闭浏览器、关闭标签页，或者会话超时时结束。



## 方法和属性

**属性**

| **属性** | **说明**                           |
| -------- | ---------------------------------- |
| length   | 1. 只读整数<br />2. 表示数据项个数 |



**方法**

| **方法**   | **说明**                                                     |
| ---------- | ------------------------------------------------------------ |
| key        | 通过索引获取数据项<br />如果不存在，返回`null`               |
| getItem    | 根据参数获取数据项值<br />如果没有对应key，则返回null        |
| setItem    | 根据key设置value<br />有则覆盖，无则添加<br />数据项值必须是字符串类型值，否则会自动转换为字符串类型值 |
| removeItem | 删除具体的某一个数据项                                       |
| clear      | 清空storage                                                  |



**清除魔法字符串**

如果一个字符串被使用了两次或以上，这个字符串就应该被抽取为常量

如果没有抽取而直接使用，那么这种字符串就被称之为**魔法字符串**



之所以需要抽取为常量

1. 输入常量值，会存在IDE提示，方便且不易出错
2. 后期修改，只要修改值即可。无需多进行多处修改

```js
const ACCESS_TOKEN = 'access_token'

localStorage.setItem(ACCESS_TOKEN, '6Y3tcPWzEkondDl4is9Lwd8E30hT8u4L7unQ9oph7v/SnIpnMn23OA9JtTZktDffiivEfcxQa1FEtCHYQA==')

console.log(localStorage.getItem(ACCESS_TOKEN));
```



## 简单封装

```js
class Cache {
  constructor(type = 'local') {
    this.cache = type === 'local' ? localStorage : sessionStorage
  }

  setItem(key, value) {
    // JSON.parse(undefined) => error
    if (!key || value !== undefined) {
      throw new TypeError('key 和 value 不能为空')
    }

    if (['object', 'function'].includes(typeof key)) {
      throw new TypeError('key只能是基本数据类型值')
    }

    this.cache.setItem(key, JSON.stringify(value))
  }

  getItem(key) {
    if (!key) {
      throw new TypeError('key不能为空')
    }

    if (['object', 'function'].includes(typeof key)) {
      throw new TypeError('key只能是基本数据类型值')
    }

    return JSON.parse(this.cache.getItem(key))
  }

  removeItem(key) {
    if (!key) {
      throw new TypeError('key不能为空')
    }

    if (['object', 'function'].includes(typeof key)) {
      throw new TypeError('key只能是基本数据类型值')
    }

    this.cache.removeItem(key)
  }

  clear() {
    this.cache.clear()
  }
}
```

