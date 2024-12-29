- Object是所有类的父类，JavaScript 的所有其他对象都继承自 Object 对象
- Object 对象的原生方法分成两类：
  - 定义在Object 上的方法，静态方法 「 Object.xxx 」
  - 定义在Object.prototype上的方法 实例方法「 Object实例.xxx 」



## Object

`Object`本身是一个函数，可以当作工具方法使用，将任意值转为对象。这个方法常用于保证某个值一定是对象。

如果参数为空（或者为`undefined`和`null`），`Object()`返回一个空对象。

```js
Object() // {}
Object(undefined) // {}
Object(null) // {}
```

如果参数是原始类型的值，`Object`方法将其转为对应的包装对象的实例

```js
Object(1) // Number { 1 }
Object('Hello') // String { 'Hello' }
```



如果`Object`方法的参数是一个对象，它总是返回该对象，即不用转换。

```js
const o = {}
console.log(o === Object(o)) // true
```



利用这一点，可以写一个判断变量是否为对象的函数。

```js
function isObject(value) {
  return value === Object(value);
}

isObject([]) // true
isObject(true) // false
```



## new Object

字面量创建对象是`new Object()`的语法糖写法

```js
const o = {}
console.log(o === new Object(o)) // true
```

```js
new Object(123) // Number { 123 }
```

`new Object`用法和`Object`基本完全一致

但 `Object(value)`表示将`value`转成一个对象，`new Object(value)`则表示新生成一个对象，它的值是`value`

