## 基本使用

```js
// 如果在FormData构造器中提供了form元素对应的DOM元素，它会自动捕获对应form中的元素字段
const formData = new FormData(formEl)
```

```js
// 创建一个空的FormData对象，然后调用它的append()方法来添加字段并使用
const formData = new FormData()
```



## 实例方法

> 在FormData中添加的值的数据类型应为 `string | Blob` 中的一种
>
> 如果添加的数据类型不是`string | Blob`的时候，FormData会先尽可能将对应的值转换为字符串类型后在进行添加

| 方法               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| append(key, value) | 添加数据 无则添加，有则追加                                  |
| set(key, value)    | 修改数据 无则添加，有则覆盖                                  |
| get(key)           | 根据key去查找key对应的value get方法只能获取第一个满足条件的值 key对应的value不存在的时候，默认返回null |
| getAll(key)        | 根据key去查找key对应的value getAll方法会获取key对应的所有的value值组成的数组 key对应的value不存在的时候，默认返回空数组 |
| has(key)           | 判断key对应的value是否存在，返回值是boolean类型值            |
| delete(key)        | 移除key对应的所有value值                                     |
| keys()             | 返回所有key值组成的迭代器对象，可以使用for-of遍历            |
| values()           | 返回所有value值组成的迭代器对象，可以使用for-of遍历          |
| entries()          | 返回所有键值对组成的迭代器对象，可以使用for-of遍历           |
| forEach()          | formData可以使用forEach进行遍历                              |
| for-of             | 实现了 FormData 接口的对象可以直接在for...of结构中使用，而不需要调用entries() for (var p of myFormData) 的作用和 for (var p of myFormData.entries()) 是相同的 |



```js
const btnEl = document.getElementById('btn')

btnEl.addEventListener('click', () => {
  const inputEl = document.querySelector('input')

  const formData = new FormData()

  // 如果input的type值为file的时候
  // 该input对应的dom元素就会存在属性files
  // 其值是对应的上传文件对应的File对象构成的伪数组对象
  formData.append('file', inputEl.files[0])

  console.log(formData.get('file'))
})
```

```js
// 如果传输的是二进制信息时
// + 会自动读取文件名，如果读取不到默认为`blob`
// + 也可以通过append第三个参数来显示指定文件名
formData.append('file', inputEl.files[0], 'foo.txt')
```

