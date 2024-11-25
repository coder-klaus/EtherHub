## 监听对象操作

在 JavaScript 中，我们有时需要监听对象属性的变化，比如获取或设置属性的操作。可以通过 `Object.defineProperty` 实现这一点。

```js
const obj = {
  name: "Klaus",
  age: 25
};

Object.defineProperty(obj, "name", {
  get: function() {
    console.log('监听到该name属性被访问');
    return obj.name;
  },
  set: function(newValue) {
    console.log("监听到该name属性被设置");
  }
});

console.log(obj.name); // 输出: 监听到该name属性被访问 Klaus
obj.name = 'Steven'; // 输出: 监听到该name属性被设置
```

但``Object.definePropert`有一定的局限性

1. **只能监听单个属性**， 需要手动为每个属性定义 `get` 和 `set`。
2. **无法监听新增/删除操作**：
   + `Object.defineProperty` 无法处理对象的结构变化
   + 如果新增了属性，该属性默认是没有`getter/setter`的，需要单独设置



为了解决这个问题，ES6引入了`proxy`



## proxy

`Proxy` 是 ES6 中引入的一个类，用于创建一个代理对象。代理对象可以拦截并自定义对另一个对象的基本操作，比如属性的读取、写入、删除等。



### Proxy 的基本结构

```javascript
const proxy = new Proxy(target, handler);
```

- **`target`**：被代理的对象，可以是任何类型，如对象、数组、函数等。
- **`handler`**：处理对象，包含捕获器方法，用于定义拦截行为。



`proxy`是对整个对象的监听，而不是对单个属性的监听。

+ 如果新增了属性，则新增的属性会直接可以被监听，而不需要再手动添加对应监听

```js
const obj = {
  name: "Klaus",
  age: 25
};

// 创建一个 Proxy 对象
const objProxy = new Proxy(obj, {
  get(target, prop) {
    console.log(`属性 ${prop} 被访问`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`属性 ${prop} 被设置为 ${value}`);
    target[prop] = value;
    return true;
  }
});

// 对 objProxy 的操作
console.log(objProxy.name); // 输出: 属性 name 被访问
objProxy.name = "Steven";     // 输出: 属性 name 被设置为 Steven
console.log(objProxy.name); // 输出: 属性 name 被访问
console.log(obj);           // 输出: { name: 'Steven', age: 25 }
```



`proxy`是专门用于进行代理操作的API，可以监听更多的操作，包括但不限于:

- `get(target, prop, receiver)`：拦截属性读取。
- `set(target, prop, value, receiver)`：拦截属性设置。
- `has(target, prop)`：拦截 `in` 操作符。
- `deleteProperty(target, prop)`：拦截属性删除操作。
- `apply(target, thisArg, args)`：拦截函数调用。

所有的代理操作都可以通过**捕获器（Handler Traps）**进行设置



### getter/setter

#### `get` 捕获器

- **功能**：拦截属性的读取操作。
- **参数**：
  - `target`：被代理的目标对象。
  - `key`：被访问的属性名。
  - `receiver`：代理对象本身（或继承自代理的对象）。

#### `set` 捕获器

- **功能**：拦截属性的设置操作。
- **参数**：
  - `target`：被代理的目标对象。
  - `key`：被设置的属性名。
  - `newValue`：新的属性值。
  - `receiver`：代理对象本身（或继承自代理的对象）。

```js
const obj = {
  name: "Klaus",
  age: 25
};

const objProxy = new Proxy(obj, {
  get: function(target, key, receiver) {
    console.log(`${key} getter`);
    return Reflect.get(target, key, receiver);
  },
  set: function(target, key, newValue, receiver) {
    console.log(`${key} setter: ${newValue}`);
    return Reflect.set(target, key, newValue, receiver);
  }
});

objProxy.name = 'Steven';
console.log(objProxy.name);
/*
=>
  name setter: Steven
  name getter
  Steven
*/
```





```js
const handler = {
  get: function(target, prop) {
    console.log(`监听到${prop}属性被访问`);
    return target[prop];
  },
  set: function(target, prop, value) {
    console.log(`监听到${prop}属性被设置值`);
    target[prop] = value;
    return true;
  }
};

const proxyObj = new Proxy(obj, handler);

proxyObj.name; // 输出: 监听到name属性被访问
proxyObj.age = 18; // 输出: 监听到age属性被设置值
```







![image.png](https://s2.loli.net/2024/11/24/6gj7cUrPxu4yzLw.png)



















Proxy 是 ES6 引入的一个新特性，可以用来创建一个代理对象，代理对象可以拦截并自定义对另一个对象的基本操作。

```js
const target = {};
const handler = {
  get: function(obj, prop) {
    return prop in obj ? obj[prop] : `Property ${prop} does not exist`;
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.someProperty); // 输出: Property someProperty does not exist
```

1. 操作的是代理对象，不是源对象 => 可以理解为代理对象在源对象的基础上进行了包装

2. 如果代理对象拦截了对应操作，则执行代理对象对应操作

   如果代理对象没有拦截对应操作，则直接交给源对象执行默认逻辑



Proxy 可以拦截多种操作，包括但不限于：

- `get`：读取属性
- `set`：写入属性
- `has`：检查属性是否存在
- `deleteProperty`：删除属性
- `apply`：调用函数

```js
const handler = {
  set: function(obj, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    obj[prop] = value;
    return true;
  }
};

const person = new Proxy({}, handler);
person.age = 25; // 正常赋值
// person.age = 'twenty-five'; // 抛出错误: Age must be a number
```



#### 实际应用场景

- **数据验证**：使用 Proxy 拦截 `set` 操作来进行数据验证。
- **属性访问日志**：通过 `get` 拦截器记录属性的访问日志。
- **默认值**：为对象属性提供默认值，当访问未定义的属性时返回默认值。

```js
const withDefault = (target, defaultValue) => new Proxy(target, {
  get: (obj, prop) => (prop in obj ? obj[prop] : defaultValue)
});

const data = withDefault({}, 'default value');
console.log(data.someKey); // 输出: default value
```

