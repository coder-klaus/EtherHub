JS 提供的用于操作请求头的类

```js
// 创建方式1
const header1 = new Headers()

// 创建方式2
const header2 = new Headers({
  // 请求头一般为 Xxxx 或 Xxxx-Xxxx
  'Content-Type': 'application/json'
})

// 创建方式3
const header3 = new Headers([
  ['Content-Type', 'application/json']
])

// 创建方式4
const header4 = new Headers(header3)

console.log(header1, header2, header3, header4)
```

```js
const headers = new Headers()

// 常见方法
// 1. 添加 「 追加 」
headers.append('Content-Type', 'application/json')
headers.append('Content-Type', 'application/xml')
// 多个值用逗号拼接，没有getAll方法
console.log(headers.get('Content-Type')) // application/json, application/xml

// 2. 删除
headers.delete('Content-Type')
// 通过has方法进行获取  => 获取不到值一律为null
console.log(headers.get('Content-Type')) // null
// 通过has方法判断是否存在
console.log(headers.has('Content-Type')) // false

// 3.添加 「 覆盖 」
headers.set('Set-Cookie', 'name=Alex')
headers.set('Set-Cookie', 'name=Klaus')
console.log(headers.get('Set-Cookie')) // name=Klaus

// 4. 迭代 「 forEach 」
headers.forEach((value, key) => {
  console.log(key, value)
})

// Headers的默认迭代器就是 entries方法
for (const [key, value] of headers) {
  console.log(`${key} -> ${value}`)
}

// 以下三个方法即是迭代器也是可迭代对象
// + 可以调用自己的next方法进行迭代
// + 也可以调用for of进行迭代 「 存在合法的Symbol.iterator方法 」

// 5. 获取所有键值对
console.log(headers.entries())
// 6. 获取所有键
console.log(headers.keys())
// 7. 获取所有值
console.log(headers.values())

// Headers实例不存在size属性和toString方法
```

