在 ES6 中，`Symbol` 是新增的基本数据类型。它用于创建独一无二的值，常用于对象的属性名，以避免命名冲突。

## 基本使用

### 创建 Symbol 值

```javascript
// 创建一个 Symbol 值
const s1 = Symbol();
console.log(s1); // 输出 Symbol()
```

- **特点**：每个 Symbol 值都是唯一的，即使描述相同也不相等。



### 使用描述符

```javascript
// 创建 Symbol 时可以传入描述符
const s2 = Symbol('Klaus');
console.log(s2); // 输出 Symbol('Klaus')
```

- **描述符**：仅用于调试和日志记录，不影响 Symbol 的唯一性。



### Symbol 的唯一性

```typescript
const s1 = Symbol();
const s2 = Symbol();
console.log(s1 === s2); // 输出 false
```

- **说明**：每个 Symbol 值都是独一无二的，即使没有描述符。



### 运算与转换

```typescript
const s1 = Symbol('example');

// Symbol 不支持算术运算
// console.log(s1 + 3); // 会报错

// 可以转换为字符串或布尔值
console.log(s1.toString()); // 输出 "Symbol(example)"
console.log(Boolean(s1)); // 输出 true
```

- **注意**：Symbol 不能参与算术运算，但可以显式转换为字符串或布尔值。



### 作为对象属性名

```typescript
const s1 = Symbol();
const obj = {
  [s1]: 'Klaus'
};

// 使用 Symbol 作为属性名
console.log(obj[s1]); // 输出 "Klaus"
```

- **优势**：使用 Symbol 作为属性名可以避免属性名冲突。



### `Symbol.for` 和 `Symbol.keyFor`

```typescript
const s1: symbol = Symbol.for('Klaus');
const s2 = Symbol.for('Klaus');
const s3 = Symbol('Klaus');

console.log(s1 === s2); // 输出 true
console.log(s1 === s3); // 输出 false
```

- **`Symbol.for`**：用来创建或复用全局 Symbol 值。
  - 若已存在相同 key 的 Symbol，则返回该 Symbol。
  - `Symbol.for`不传参数，默认参数为`undefined` 

- **`Symbol.keyFor`**：返回使用 `Symbol.for` 创建的 Symbol 的 key。



### 描述符和 `Symbol.keyFor`

```typescript
const s1 = Symbol('Klaus');
console.log(s1.description); // 输出 "Klaus"
console.log(Symbol.keyFor(s1)); // 输出 undefined

const s2 = Symbol.for('Alex');
console.log(s2.description); // 输出 "Alex"
console.log(Symbol.keyFor(s2)); // 输出 "Alex"
```

- **说明**：`description` 返回 Symbol 的描述符。`Symbol.keyFor` 仅适用于全局 Symbol。



## 迭代

### `for-in`

```js
const s1 = Symbol();

const obj = {
  [s1]: 'Klaus',
  age: 23,
  __proto__: {
    sex: 'male'
  }
};

// for-in 输出自身和原型上所有的可迭代非 Symbol 属性
for (const key in obj) {
  console.log(key);
  // 输出: age, sex
}
```



### `Object.keys` 

`Object.keys`、`Object.values`、`Object.entries`和 `Object.getOwnPropertyNames`等方法都只返回对象自身的非 Symbol 属性

```js
// 仅输出自身上所有的可迭代非 Symbol 属性
console.log(Object.keys(obj)); // 输出: ['age']

// 同样仅输出自身上所有的可迭代非 Symbol 属性
console.log(Object.getOwnPropertyNames(obj)); // 输出: ['age']
```



###  JSON 序列化

```js
// 在 JSON 中不存在 Symbol 类型值，转换时会移除 Symbol 属性
console.log(JSON.stringify(obj)); // 输出: {"age":23}
```



## 获取 Symbol 

```js
// 获取对象自身的所有 Symbol 属性
console.log(Object.getOwnPropertySymbols(obj)); // 输出: [ Symbol() ]

// 获取对象自身的所有属性，包括 Symbol, 可迭代属性和不可迭代属性
console.log(Reflect.ownKeys(obj)); // 输出: ['age', Symbol()]
```

