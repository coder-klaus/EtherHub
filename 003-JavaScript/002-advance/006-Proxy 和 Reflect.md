## Proxy

`Object.defineProperty` 可以实现数据代理，但存在局限

1. 只能对已有的对象进行`getter/setter`劫持 => 新增属性无法自动代理，需要手动调用`defineProperty`进行代理操作
2. 只能代理`getter/setter`操作 => 其余操作无法进行劫持

```js
const user = {
  name: 'Klaus',
  age: 23
}

Object.keys(user).forEach(key => {
  // 通过闭包实现数据劫持
  let value = user[key]

  Object.defineProperty(user, key, {
    set(newV) {
      console.log(`属性：${key}设置了，值为 ${value}`)
      value = newV
    },

    get() {
      console.log(`获取属性${key}`)
      return value
    }
  })
})

// 现有属性可以通过defineProperty进行劫持
user.name = 'Alex'
console.log(user.name)

// 新增属性无法进行劫持，需要手动再对新增属性调用Object.defineProperty
user.address = 'Shanghai'
console.log(user.address)

// 只能劫持 getter 和 setter操作，其余操作无法劫持
delete user.name

// 删除的属性会自动重置属性描述对象，所以重新使用时，不存在数据劫持
console.log(user.name)
```



为此ES6 提供了一种全新的代理对象 `Proxy`

+ 所有的方法第一个参数 都是 源对象
+ 后续参数 => 原本方法需要传入什么参数，就传入什么后续参数
+ `get` 和 `set` 还存在一个特殊参数 `receiver`

![image.png](https://s2.loli.net/2025/02/19/9h2vEwMXnbJDOPo.png) 

```js
const user = {
  name: 'Klaus',
  age: 23
}

// const proxy实例 = new Proxy(原始对象, 侦听器对象 「 handler 」)
const userProxy = new Proxy(user, {
  // set 是其中的一个侦听器函数
  set(target, key, value, receiver) {
    console.log(`属性：${key}设置了，值为 ${value}`)
    // 执行完自定义逻辑后，执行原本的逻辑值修改
    target[key] = value

    // setter侦听器函数需要返回布尔值，标识是否修改值成功
    return true
  }
})

// getter侦听器函数没有被实现 => 执行默认逻辑
console.log(userProxy.name) // => Klaus

// 设置了setter侦听器函数 => 执行侦听器函数
userProxy.name = 'Alex'

console.log(userProxy.name) // => Alex
```

```js
const user = {
  name: 'Klaus',
  age: 23
}

const proxy = new Proxy(user, {
  has(target, key) {
    console.log(`${key} 正在执行in判断`)
    return key in target
  },

  deleteProperty(target, key) {
    console.log(`${key} 正在执行delete操作`)
    return delete target[key]
  }
})

console.log('name' in proxy)
delete proxy.age
```

```js
function Foo(num1, num2) {
  console.log(this, num1, num2)
}

const proxy = new Proxy(Foo, {
  construct(target, args) {
    console.log(`正在新建${target.name}的实例对象`)
    return new target(...args)
  },

  // 只有apply 侦听器函数，没有call侦听器函数
  apply(target, thisArg, args) {
    console.log(`${target.name}正在执行apply方法`)
    return target.apply(thisArg, args)
  }
})

proxy.apply({ name: 'Klaus' }, [23, 32])
const foo = new proxy(10, 20)
```



### receiver

```js
const user = {
  _name: 'Klaus',
  // 对于通过存储器设置的属性而言，在获取和设置值的时候，内置this为对象本身，而不是代理对象
  get name() {
    console.log(this === user)  // => true
    // 这就导致了 存储器操作私有属性时，无法被代理对象监听到
    return this._name
  },
  set name(v) {
    console.log(this === user)  // => true
    this._name = v
  }
}

const proxy = new Proxy(user,  {
  get(target, key) {
    console.log('getter')
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    console.log('setter')
    return Reflect.set(target, key, value)
  }
})

proxy.name = 'Alex'
console.log(proxy.name)
```

```js
const user = {
  _name: 'Klaus',
  // 传入receiver后，存储器中的this就变成代理对象了
  // 所以存储器中操作私有属性时，也可以被正常监听到
  get name() {
    console.log(this === user)  // => false
    return this._name
  },
  set name(v) {
    console.log(this === user)  // => false
    this._name = v
  }
}

const proxy = new Proxy(user,  {
  // receiver 就是 代理对象本身
  get(target, key, receiver) {
    console.log(`getter => ${key}`)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(`setter => ${key} : ${value}`)
    return Reflect.set(target, key, value, receiver)
  }
})

proxy.name = 'Alex'
console.log(proxy.name)
```



## Reflect

 在早期的 JavaScript 中，`Object` 作为所有对象的基础类，承担了大量职责，不仅提供了公共实例属性和方法，还包含了一系列与元编程相关的静态方法（如 `Object.defineProperty`、`Object.getOwnPropertyDescriptor` 等）。

此外，一些元编程操作是通过操作符（如 `in`、`delete`）实现的，而不是通过方法调用。

这种设计导致 `Object` 的职责过于庞杂，违背了单一职责原则。同时，由于操作符的存在，元编程操作的调用方式不统一，语义化也不够明确。

另一个问题是，许多操作在非严格模式下会静默失败，而在严格模式下则会直接抛出错误。这种不一致的行为增加了开发的复杂性。



为了解决这些问题，`ES6` 引入了 `Reflect` 对象，

`Reflect`是一个类似于 `Math` 的静态工具对象，所以 `Reflect` 的所有方法都通过静态调用实现，不能使用 `new` 关键字创建实例

`Reflect`专门用于封装与元编程相关的方法。



`Reflect` 的设计目标包括：

1. **分离职责**：将元编程相关方法从 `Object` 中分离出来，避免 `Object` 职责过于庞杂。
2. **统一接口**：将一些操作符（如 `in`、`delete`）的功能封装为方法，提供统一的调用方式「 都定义成了方法调用 」。
3. **提升语义化**：通过返回值而非抛出异常来表示操作结果，从而使代码更加清晰、可预测。
4. **向后兼容**：`Reflect` 的许多方法功能与 `Object` 上的现有方法一致（例如 `Reflect.defineProperty` 等价于 `Object.defineProperty`），以确保旧代码仍然可用。



![image.png](https://s2.loli.net/2025/02/19/V4YqlNPBAdoS538.png) 



此外，`Reflect` 和 `Proxy` 的方法是一一对应的，一共也是13个

```js
const user = {
  name: 'Klaus',
  age: 23
}

Object.defineProperty(user, 'name', {
  configurable: false
})

// 早期的做法
// delete user.name
// 1. delete是操作符，不是方法
// 2. delete的返回值是布尔值，但仅仅表示该属性的属性描述符enurmable的值，并不表示是否真正删除成功
// 3. delete操作符在严格模式下，会报错，而在非严格模式下，是静默错误

// Reflect方法
// 1. 统一成了方法，不在使用操作符
// 2. 方法返回布尔值，标识是否删除成功 => 不会在非严格模式和严格模式下出现不一样的表现
if (Reflect.deleteProperty(user, 'name')) {
  console.log('删除成功')
} else {
  console.log('删除失败')
}
```



多数情况下，`Reflect`会和`Proxy`一起结合使用

```js
const user = {
  name: 'Klaus',
  age: 23
}

const proxy = new Proxy(user, {
  // target 就是 源对象 「 在这里就是 user 」
  set(target, key, value) {
    console.log('setter')
    // target === user -> true

    // target[key] = value => 使用这种方式修改，如果key是只读属性，则在严格模式会报错，在非严格模式会静默失效
    // 所以在这里推荐使用 Reflect.set(target, key, value)来修改属性值，以规范化对应操作
    Reflect.set(target, key, value) // true => 返回布尔值标识修改值是否成功
  },

  get(target, key) {
    console.log('getter')
    // return target[key]
    return Reflect.get(target, key)
  }
})

proxy.name = 'Alex'
console.log(proxy.name)
```



虽然`Reflect`更为规定，但毕竟写起来比较繁琐，所以在获取和设置属性时，更多的还是推荐使用点语法

仅在如下情况下，推荐使用`Reflect`

1. 需要使用中括号来获取和设置属性值时
2. 和`Proxy`一起结合使用时
3. 需要判断操作结果 或 需要统一严格模式和非严格模式行为差异时

其余操作都推荐优先使用`Reflect`



### `Reflect.construct`

```javascript
Reflect.construct(target, argumentsList, newTarget)
```

- `target`：目标构造函数（即要调用的构造函数）。
- `argumentsList`：传递给目标构造函数的参数数组。
- `newTarget`：可选参数，指定新创建对象的原型链。如果不指定，则默认为 `target`。
  + 新建 `newTarget`的实例 且 `newTarget`继承自`target` => 即`newTarget`参数的主要功能是用于实现继承

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Student(name, age) {
  // 在构造函数中， this表示组件实例，在这里就是Student的实例
  // 而 new.target指向构造函数本身，在这里就是Student
  return Reflect.construct(Person, [name, age], new.target);
}

// 测试
const stu = new Student('Klaus', 23);
console.log(stu); // Student { name: 'Klaus', age: 23 }
console.log(stu instanceof Student); // true
console.log(stu instanceof Person); // true
```