## 概述

Set是元素不能重复的**特殊数组** => 可以进行数组去重

Map是元素可以是任意类型的**特殊对象**

+ 普通对象
  + key只能是`string | number | symbol`
  + 其余任意类型都会直接转字符串后使用
+ Map
  + key可以是任意数据类型，既可以是`stirng | number | symbol`，也可以是对象类型值



### 共同点

1. Set 和 Map => 只能通过构造函数创建，没有字面量创建方法
2. Set 和 Map => 都存在size属性 => 表示元素的个数
3. Set 和 Map => 没有任何可迭代的非Symbol属性 => 可以使用`for-in`但迭代不出任何内容
4. Set 和 Map => 都是可迭代对象 => 可以使用`for - of`进行迭代
5. Set 和 Map => 都可以使用 `forEach(callback, [, thisArg])`进行遍历



## Set

| 方法            | 说明                         |
| --------------- | ---------------------------- |
| `add(value)`    | 新增元素，返回set实例自身    |
| `delete(value)` | 删除元素，返回布尔值         |
| `has(value)`    | 判断元素是否存在，返回布尔值 |
| `clear()`       | 清空元素，无返回值           |

```js
// 参数可以不传 或传递 任意可迭代对象
const set = new Set([1, 2, 3, 4, 1])

// set转普通数组 => set无法通过索引访问元素 => 如果需要，则必须优先转换为数组
console.log(Array.from(set)) // => [ 1, 2, 3, 4 ]
console.log([...set]) // => [ 1, 2, 3, 4 ]
```

```js
const set = new Set([1, 2, 3, 4])

// 在set中, set中的索引值 和 set对应的元素值 是一致的
set.forEach((item, index) => console.log(item, index))
/*
  =>
    1 1
    2 2
    3 3
    4 4
*/
```



## Map

| 方法              | 说明                            |
| ----------------- | ------------------------------- |
| `set(key, value)` | 设置元素，返回map实例自身       |
| `get(key)`        | 获取元素值，不存在返回undefined |
| `has(key)`        | 判断元素是否存在，返回布尔值    |
| `delete(key)`     | 删除元素孩子，返回布尔值        |
| `clear()`         | 清空map                         |

```js
const map = new Map()

map.set(123, 123)
map.set({name: 'Klaus'}, 'Klaus')
map.set([], [1, 2, 3])

console.log(map)
// => Map(3) { 123 => 123, { name: 'Klaus' } => 'Klaus', [] => [ 1, 2, 3 ] }
```

```js
// Map构造函数的参数可以是空的参数列表 也可以是一个entries结构的二维数组
const map = new Map([['name', 'Klaus'], [{name: 'Alex'}, 'Alex']])

console.log(map)
// => Map(2) { 'name' => 'Klaus', { name: 'Alex' } => 'Alex' }
```

```js
const map = new Map()

map.set('name', 'Klaus')
map.set({ name: 'Klaus' }, 'object')
map.set([], 'array')

map.forEach((item, key) => console.log(key, item))
/*
  =>
    name Klaus
    { name: 'Klaus' } object
    [] array
*/


// 获取到的是每一个entry对象
for (const mapEntry of map) {
  console.log(mapEntry)
  /*
    =>
      [ 'name', 'Klaus' ]
      [ { name: 'Klaus' }, 'object' ]
      [ [], 'array' ]
  */
}
```



## 弱引用

在 JavaScript 中，默认情况下，所有的引用都是强引用（strong reference）。这意味着，在垃圾回收（GC）机制的标记清除过程中，强引用会被纳入可达性计算。如果一个对象被强引用所指向，那么即使它不再被实际使用，GC 也不会将其视为垃圾对象来清除。

然而，从 ES6 开始，JavaScript 引入了弱引用（weak reference）的概念。弱引用不会被纳入垃圾回收的可达性计算中。也就是说，如果一个对象没有任何强引用指向它，即使有多个弱引用指向它，GC 仍然会将该对象视为垃圾对象，并将其清除。

因此，当我们需要引用某个对象，但又不希望因为该引用的存在而阻止该对象被垃圾回收清除时，就可以使用弱引用。弱引用允许我们在不干扰垃圾回收机制的情况下，保持对对象的引用。

简单来说，就是如果移除了对象后，对应成员也会被自动移除



JavaScript使用弱引用的是`weakXxxx` 「 例如 `weakRef`、`weakMap`、`weakSet`等 」

对于这些弱引用，因为当外部引用值被移除，对应内部弱引用也会对应失效

=> 对于弱引用系列无法进行迭代，也无法获取元素个数

=> 因为不同时候得到的结果都是不一样的



### weakRef

```js
const user = { name: 'Klaus' }

const weak = new WeakRef(user) // => 此时weak对于user对象的引用就是弱引用

// 通过deref解包引用值，如果对象引用已经失效，则返回undefined
if (weak.deref()) {
  // 只能通过 weak.deref().name，不能 let ref = weak.deref()
  // 因为 ref会对解包后对象产生强引用，需要手动 ref = null
  
  // 不能直接打印 weak.deref() 解包后的引用 => 控制台的打印也是对引用类型的强引用
  // 可以直接打印属性，就不是对 解包对象的 强引用
  console.log(weak.deref().name) // => Klaus
}
```



### weakSet

1. 参数只能是引用类型值
2. 对应的引用是弱引用
3. 和`set`一样，无法通过key获取对应元素 => `weakSet`也没有转数组的必要

```js
const weakset = new WeakSet()

weakset.add({name: 'Klaus'})
console.log(weakset) // => WeakSet { <items unknown> }

// 参数是基本数据类型 => 直接报错，不进行类型转换
weakset.add(123) // error
```

| 方法          | 说明                         |
| ------------- | ---------------------------- |
| add(value)    | 添加元素，返回`weakSet`实例  |
| delete(value) | 删除元素，返回布尔值         |
| has(value)    | 判断元素是否存在，返回布尔值 |

```js
class Person {
  static #weakset = new WeakSet()

  constructor() {
    Person.#weakset.add(this)
  }
  
  // 确保对应方法只能被Person的实例调用
  running() {
    if (Person.#weakset.has(this)) {
      console.log('running')
    } else {
      throw new TypeError('type error')
    }
  }
}

class Student extends Person {}

const per = new Person()
const stu = new Student()

per.running() // => running
stu.running() // => running

const running = per.running
running() // error
```



### weakMap

1. `key`只能是引用类型值
2. `key`对应的是弱引用

| 方法            | 说明                                       |
| --------------- | ------------------------------------------ |
| set(key, value) | 新增元素，返回`weakMap`实例本身            |
| get(key)        | 获取元素，如果不存在返回undefined          |
| has(key)        | 判断是否包含某一个 key，返回 Boolean 类型  |
| delete(key)     | 根据 key 删除一个键值对，返回 Boolean 类型 |



## FinalizationRegistry

1. 用于测试
2. 当注册引用被移除，可以执行清理回调 「 `finalizer` 」 => 用于观测对象何时被GC移除

```js
// 创建注册表对象，参数为清理回调
const finalRegister = new FinalizationRegistry(value => {
  console.log(`${value}被GC清除了`)
})

let obj = { name: 'obj' }
let foo = { name: 'foo' }

// 将需要观测的对象加入注册表对象
// 参数1 => 观察对象
// 参数2 => 标识符 => 可以是任意类型 => 作为清理回调的参数「 value 」传入
finalRegister.register(foo, 'foo')
finalRegister.register(obj, 'obj')

// 清除对象，等待GC批量清理
obj = null
foo = null
```





