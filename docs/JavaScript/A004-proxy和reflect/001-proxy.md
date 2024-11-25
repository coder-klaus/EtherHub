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

但``Object.definePropert`有一定的局限性

1. **只能监听单个属性**， 需要手动为每个属性定义 `get` 和 `set`。
2. **无法监听新增/删除操作**：
   + `Object.defineProperty` 无法处理对象的结构变化
   + 如果新增了属性，该属性默认是没有`getter/setter`的，需要单独设置



为了解决这个问题，ES6引入了`proxy`



## proxy

`Proxy` 是 ES6 中引入的一个类，用于创建一个代理对象。

代理对象可以拦截并自定义对另一个对象的基本操作，比如属性的读取、写入、删除等。



`proxy`是对整个对象的监听，而不是对单个属性的监听。

+ 如果新增了属性，则新增的属性会直接可以被监听，而不需要再手动添加对应监听



### 基本结构

```javascript
const proxy = new Proxy(target, handler);
```

- **`target`**：被代理的对象，可以是任何引用类型，如对象、数组、函数等。
- **`handler`**：处理对象，包含捕获器方法，用于定义拦截行为。

  - 自定义了对应拦截，则执行对应拦截
  - 没有自定义对象拦截，执行默认逻辑

  

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
    // setter需要返回布尔值标识是否赋值成功
    return true;
  }
});

// 后续操作的都是代理对象，只有操作代理对象才会触发捕获器 [!code warning]
console.log(objProxy.name);
objProxy.name = "Steven";
console.log(objProxy.name);
console.log(obj);
/*
=>
  name getter
  Klaus
  name setter => Steven
  name getter
  Steven
  { name: 'Steven', age: 25 }
*/
```



### 捕获器

`proxy`是专门用于进行对象代理的API，相比`Object.defineProperty`可以监听更多的操作

`proxy`一共提供了13种捕获器 => 所有的代理操作都可以通过**捕获器（Handler Traps）**进行设置

| 方法                                             | 描述                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| handler.getPrototypeOf(target)                   | `Object.getPrototypeOf` 方法的捕捉器。                       |
| handler.setPrototypeOf(target, proto)            | `Object.setPrototypeOf` 方法的捕捉器。                       |
|                                                  |                                                              |
| handler.isExtensible(target)                     | `Object.isExtensible` 方法的捕捉器（判断是否可以新增属性）。 |
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
    delete target[key]
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


