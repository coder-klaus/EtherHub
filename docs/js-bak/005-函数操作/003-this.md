## this

`this`是函数内部特殊变量，值是当前函数对应的执行上下文

函数的执行上下文是在函数被调用时动态创建的，也就是说this的值是在运行时被指定的，和函数的编写位置没有任何关系

在Javascript中， this的值一般可以分为以下四种情况:

1. 默认绑定 「 独立函数调用 」
2. 隐式绑定
3. 显示绑定
4. new绑定

### 默认绑定

默认绑定又被称之为独立函数调用 即函数没有被绑定到某个对象上进行调用

```js
// 在非严格模式中 this指向 globalThis
function foo() {
  console.log(this)
}

foo()
```

```ts
// 在严格模式中 this指向 undefined
"use strict"

function foo() {
  console.log(this)
}

foo()
```



### 隐式绑定

隐式绑定就意味着该函数的调用发起方式是通过某个对象的调用而发起的

也就是说对应的this是通过JavaScript解析引擎来进行绑定的

```js
const obj = {
  foo() {
    console.log(this)
  }
}

obj.foo()
```



### New 绑定

`new绑定`表示通过new关键字进行函数调用

```js
function Person() {
  console.log(this) // Person{}
}

const per = new Person()
```



### 显示绑定

所谓显示绑定就是我们明确告诉JavaScript Engine 调用函数的时候 this所指向的值

常见的用于显示this绑定的方法有call，apply和bind

#### `call` 和 `apply` 

这两个方法都可以在函数调用时指定 `this` 的值，并传递参数。

**相同点**

两者的第一个参数都是用于指定 `this` 的值。

+ **非严格模式下**
  1. 传入的是对象，this值就是对象
  2. 传入的是除nullish值之外的原始类型，this值是对应包装类
  3. 传入的是nullish值，this的值是globalThis

+ **严格模式下**
  1. 传入的是对象，this值就是对象
  2. 其余情况，传入什么，this的值就是什么，不会转换为对应包装类

**不同点**

**参数传递**：

- `call`：后续参数以逗号分隔的形式传递。
- `apply`：后续参数以数组的形式传递。

```js
function foo(name, age) {
  console.log(this, name, age);
}

// 使用 call
foo.call({ name: 'thisArg' }, 'Klaus', 23);
// 输出: { name: 'thisArg' } 'Klaus' 23

// 使用 apply
foo.apply({ name: 'thisArg' }, ['Klaus', 23]);
// 输出: { name: 'thisArg' } 'Klaus' 23
```



#### `bind` 

`bind` 方法用于创建一个新的函数，并将 `this` 绑定到指定的对象。与 `call` 和 `apply` 不同，`bind` 不会立即调用函数，而是返回一个新的“绑定函数”

1. **返回绑定函数**
   + `bind` 返回一个新的函数，该函数的 `this` 值被永久绑定到指定的对象。
   + 由于绑定函数的 `this` 和参数行为与普通函数不同，因此有时被称为“怪异函数对象”。
2. **参数传递**：
   - 可以在调用 `bind` 时传入部分参数, 这些参数会被预置到返回的绑定函数中。
   - 在调用绑定函数时，可以继续传入其他参数，这些参数会附加在预置参数的后面。

```js
function fun(name, age) {
  console.log(this, name, age);
}

const foo = fun.bind({ name: 'thisArg' }, 'Klaus');

// 实际传入的参数为 [...bind传入的除this外的所有参数, ...调用foo传入的参数] 
foo(23); // 输出: { name: 'thisArg' } 'Klaus' 23
```



## 优先级

`new > bind > apply/call > 隐式绑定 > 默认绑定`

1. `new绑定和call、apply是不允许同时使用`，所以不存在谁的优先级更高

2. `call 和 apply 不可能同时使用`，所以也不存在谁的优先级更高 



## 特殊情况

1. **箭头函数**

   箭头函数内部没有this，this被视为普通变量，按照作用域链进行查找

   所以对于箭头函数的this取决于箭头函数定义的位置，而不是调用时决定

   因此箭头函数的this是静态绑定

2. **间接函数引用**

   当函数通过间接引用调用时，`this` 使用默认绑定规则：

   ```js
   const obj = {
     fun() {
       console.log(this);
     }
   };
   
   const obj2 = {};
   
   // (obj2.fun = obj.fun)() 等价于 fun()，因此 this 是 undefined 或 globalThis
   (obj2.fun = obj.fun)();
   ```

   



## 内置函数的this

1. 定时器函数中的this 无论在严格模式还是非严格模式下 指向的都是globalThis

2. 对于DOM事件，内部callback中的this指向的都是 唤起事件的那个dom对象

3. 对于大部分JavaScript内置高阶函数，如果指定了thisArg，那么this指向的就是thisArg，如果没有指定thisArg，那么此时内部callback中的this遵循独立函数调用


```js
const arr = ['Klaus', 'Alex']

arr.forEach(function() {
  console.log(this) // => { name: 'Klaus' }
}, { name: 'Klaus' })
```



## globalThis

**全局对象**是 JavaScript 运行环境中提供的一个特殊对象，它在任何地方都可以访问到。

不同的宿主环境「 运行环境 」提供不同的全局对象：

- **浏览器环境**：全局对象是 `window`。
- **Node.js 环境**：全局对象是 `global`。
- **Web Worker 环境**：全局对象是 `self`。



在早期的 JavaScript 中，不同宿主环境的全局对象不统一，导致跨环境代码编写复杂。`globalThis` 的引入解决了这个问题，提供了一种统一的方式来访问全局对象。

**`globalThis`** 是 ECMAScript 提供的一个统一的全局对象访问方式，它根据当前的宿主环境映射到相应的全局对象。



### 全局对象的作用

- **变量查找的最终位置**：如果在当前作用域中找不到某个变量，JavaScript 会一直向上查找，最终在全局对象上查找。

- **挂载全局变量、函数和对象**：全局对象可以用来挂载全局变量、函数和对象。例如，在浏览器中，`console`、`alert`、`document` 等都是挂载在 `window` 上的。

- **`var` 定义的变量**：使用 `var` 定义的变量以及隐式全局变量会被自动挂载到全局对象上，但这种做法在 ES6 之后不推荐，因为它可能导致意外的全局变量污染。

```js
// 宿主环境: 浏览器

// 定义全局变量
var myVar = "Hello, world!";
console.log(globalThis.myVar); // "Hello, world!"

// 隐式全局变量
globalVar = "global value"
console.log(globalThis.globalVar) // "global value"

// 定义全局函数
function myFunction() {
  console.log("This is a global function.");
}
globalThis.myFunction(); // "This is a global function."
```

```js
// 宿主环境: node

// 定义全局变量
var myVar = "Hello, world!";
console.log(globalThis.myVar); // undefined

// 隐式全局变量 => node中依旧存在隐式全局变量问题
globalVar = "global value"
console.log(globalThis.globalVar) // "global value"

// 定义全局函数
function myFunction() {
  console.log("This is a global function.");
}
globalThis.myFunction(); // Error
```



### 自指向性

`globalThis` 对象有一个特殊的属性 `globalThis`，它指向自身。这意味着你可以无限地访问 `globalThis.globalThis.globalThis...`，最终结果都是 `globalThis` 本身。

```js
// 在浏览器环境中
console.log(window === globalThis); // true

// 在 Node.js 环境中
console.log(global === globalThis); // true
```

