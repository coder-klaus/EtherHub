除了 `null` 和 `undefined`，其他基本数据类型（如 `string`、`number`、`boolean`、`symbol` 和 `bigint`）都有对应的包装类：`String`、`Number`、`Boolean`、`Symbol` 和 `BigInt`。

`Symbol` 和 `BigInt` 的包装类只能通过 `Object` 方法获取，无法通过`new`获取，且实际使用意义不到 「 只有`Symbol.description`这一个使用场景 」



当在基本数据类型上调用属性或方法时，JavaScript 引擎会自动创建一个临时的包装对象。这种临时对象在使用后立即销毁，用户无需关心这个过程。某些现代浏览器，如果可以直接使用对应属性和方法，创建包装类的过程都会被省略。

```js
const s = 'Hello World';
s.x = 123;
// 这是新的包装类了，之前的包装类已经被消耗
// 如果需要挂载属性或方法，需要挂载到包装类的原型对象上
s.x // undefined 
```



直接调用包装类（如 `Number('123')`）用于类型转换，返回基本数据类型。

```js
// 字符串转为数值
Number('123') // 123

// 数值转为字符串
String(123) // "123"

// 数值转为布尔值
Boolean(123) // true
```



使用 `new` 调用（如 `new Number('123')`）会返回包装对象。

```js
Number('123') // 123

new Number('123') // Number {123}
```



## 通用方法

### valueof

返回包装对象实例对应的原始类型的值。

```js
new Number(123).valueOf()  // 123
new String('abc').valueOf() // "abc"
new Boolean(true).valueOf() // true
```



### toString

返回包装类对应的字符串形式。

```js
new Number(123).toString() // "123"
new String('abc').toString() // "abc"
new Boolean(true).toString() // "true"
```