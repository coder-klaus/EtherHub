# proxy

## 诞生原因

在 JavaScript 中，我们有时需要监听对象属性的变化，比如获取或设置属性的操作。

可以通过 `Object.defineProperty` 实现这一点。

```js
const user = {
  name: 'Klaus',
  age: 23
}

// Object.defineProperty是属性级别的，只能一个个属性单独进行设置
Object.keys(user).forEach(key => {
  let value = user[key]

  Object.defineProperty(user, key, {
    set(newV) {
      console.log(`${key} setter => ${value}`)
      // 闭包
      value = newV
    },

    get () {
      console.log(`${key} getter`)
      return value
    }
  })
})

user.name = 'Alex'
console.log(user.name) // => Alex

user.age = 18
console.log(user.age) // => 18

/*
  name setter => Klaus
  name getter

  age setter => 23
  age getter
*/
```

### 局限性

1. **属性级别**
   + `Object.defineProperty` 只能用于单个属性的设置，无法直接应用于整个对象。如果需要监听对象的每个属性，必须逐个迭代并进行设置。
   + 新增属性时，这些属性不会自动具有 `getter/setter`，需要手动为其设置。

2. **功能有限**
   + 只能监听属性的 `getter` 和 `setter` 操作。
   + 无法监听其他类型的操作。



## proxy

为了解决这个问题，ES6 引入了 `Proxy`。`Proxy` 是 ES6 中提供的一个类，用于创建代理对象。

代理对象能够拦截并自定义对另一个对象的基本操作，例如属性的读取、写入和删除等。

`Proxy` 允许对整个对象进行监听，而不仅仅是单个属性。所以当新增属性时，这些属性会自动被监听，无需手动添加监听器。



### 基本结构

```javascript
const proxy = new Proxy(target, handler);
```

- **`target`**：被代理的对象，可以是任何引用类型，如对象、数组、函数等。

- **`handler`**：处理对象，包含捕获器方法，用于定义拦截行为。

  - 如果自定义了拦截器，则执行自定义拦截。
  - 如果没有自定义拦截器，则执行默认逻辑。

  

```js
const obj = {
  name: "Klaus",
  age: 25
};

// 创建一个 Proxy 对象
const objProxy = new Proxy(obj, {
  get(target, key) {
    console.log(`${key} getter`);
    return target[key];
  },
  set(target, key, value) {
    console.log(`${key} setter => ${value}`);
    target[key] = value;
    // 返回布尔值标识属性是否设置成功
    return true;
  }
});

// [!code warning] 操作代理对象才能触发拦截，不要操作源对象
console.log(objProxy.name);
objProxy.name = "Steven";
console.log(objProxy.name);
console.log(obj);
/*
  name getter
  Klaus
  name setter => Steven
  name getter
  Steven
  { name: 'Steven', age: 25 }
*/
```



### 捕获器

`Proxy` 是专门用于对象代理的 API，相比 `Object.defineProperty`，它可以监听更多的操作。

`Proxy` 提供了 13 种捕获器，所有的代理操作都可以通过`捕获器（Handler Traps)`进行设置。

| 方法                                             | 描述                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| handler.getPrototypeOf(target)                   | `Object.getPrototypeOf` 方法的捕捉器。                       |
| handler.setPrototypeOf(target, proto)            | `Object.setPrototypeOf` 方法的捕捉器。                       |
|                                                  |                                                              |
| handler.isExtensible(target)                     | `Object.isExtensible` 方法的捕捉器。                         |
| handler.preventExtensions(target)                | `Object.preventExtensions` 方法的捕捉器。                    |
|                                                  |                                                              |
| handler.getOwnPropertyDescriptor(target, prop)   | `Object.getOwnPropertyDescriptor` 方法的捕捉器。             |
| handler.defineProperty(target, prop, descriptor) | `Object.defineProperty` 方法的捕捉器。                       |
|                                                  |                                                              |
| handler.ownKeys(target)                          | `Object.getOwnPropertyNames` 方法和 `Object.getOwnPropertySymbols` 方法的捕捉器。 |
| handler.has(target, prop)                        | `in` 操作符的捕捉器。                                        |
| handler.get(target, prop, receiver)              | 属性读取操作的捕捉器。                                       |
| handler.set(target, prop, value, receiver)       | 属性设置操作的捕捉器。                                       |
| handler.deleteProperty(target, prop)             | `delete` 操作符的捕捉器。                                    |
| handler.apply(target, thisArg, args)             | 函数调用操作的捕捉器。「 只有`apply`, 没有`call` 」          |
| handler.construct(target, args, newTarget)       | `new` 操作符的捕捉器。                                       |

```js
const obj = {
  name: "Klaus",
  age: 25
};

// 仅getter和setter存在receiver参数
// 其余捕获器方法参数都是 [target, ...原本的参数列表]
const objProxy = new Proxy(obj, {
  /*
    target => 源对象
    key => 属性名
    receiver => 代理对象本身
  */
  get(target, key, receiver) {
    console.log(`${key} getter`);
    return Reflect.get(target, key, receiver);
  },
  /*
    target => 源对象
    key => 属性名
    newValue => 属性值
    receiver => 代理对象本身
  */
  set(target, key, newValue, receiver) {
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
const obj = {
  name: "Klaus",
  age: 18
}

const objProxy = new Proxy(obj, {
  has(target, key) {
    console.log("has捕捉器", key)
    return key in target
  },
  deleteProperty(target, key) {
    console.log("delete捕捉器")
    // deleteProperty需要返回布尔值标识是否删除属性成功
    reutrn delete target[key]
  }
})

console.log("name" in objProxy) // true
delete objProxy.name
```



```js
function foo(...args) {
  console.log(this) // => { name: 'Klaus' }
  console.log(args) // => [ 'Klaus', 'Steven' ]
}

// 只有apply捕获器，没有call捕获器
const proxy = new Proxy(foo, {
  apply(target, thisArg, args) {
    console.log("函数的apply侦听")
    return target.apply(thisArg, args)
  }
})

proxy.apply({name: "Klaus"}, ["Klaus", "Steven"])
```



```js
function Person(name, age) {
  this.name = name
  this.age = age
}

const proxy = new Proxy(Person, {
  // 参数params是数组类型参数
  construct(target, params, newTarget) {
    console.log(target, params, newTarget) // => [Function: Person] [ 'Klaus', 23 ] [Function: Person]
    return new target(...params)
  }
})

const per = new proxy('Klaus', 23)
console.log(per) // => Person { name: 'Klaus', age: 23 }
```



### 应用场景

- **数据验证**：使用 Proxy 拦截 `set` 操作来进行数据验证。
- **属性访问日志**：通过 `get` 拦截器记录属性的访问日志。
- **默认值**：为对象属性提供默认值，当访问未定义的属性时返回默认值。

```js
const withDefault = (target, defaultValue) => new Proxy(target, {
  get: (obj, key) => (key in obj ? obj[key] : defaultValue)
});

const data = withDefault({}, 'default value');
console.log(data.someKey); // 输出: default value
```

