## 概述

在 JavaScript 中，`Object` 类承担了许多职责：

1. 作为所有对象的基础。
2. 提供用于操作对象的方法。

然而，对对象的某些操作：

- 是方法（如 `getPrototypeOf`、`setPrototypeOf`）。
- 是操作符（如 `delete`、`in`）。

为了解耦这些职责，操作对象的方法（反射方法）被移到了新的内置对象 `Reflect` 上。

这样优化了语义，并统一了行为。例如，以前一些操作会静默失败，现在则会直接报错。

```js
const user = {
  name: 'Klaus',
  age: 23
}

Object.defineProperty(user, 'name', {
  configurable: false
})

// 早期的做法
// 1. delete返回值是该属性的configuration描述符，并不是该属性是否删除成功
// 如果属性删除失败
// + 非严格模式 => 静默失效
// + 严格模式 => 报错
// delete user.name

// 返回布尔值表示属性是否删除成功 => 统一严格模式和非严格模式行为
if (Reflect.deleteProperty(user, 'name')) {
  console.log('删除成功')
} else {
  console.log('删除失败')
}
```





虽然 `Reflect` 首字母大写，但它不是一个类，而是一个工具对象，类似于命名空间。

`Reflect` 上的方法也可以通过 `Object` 访问，以保持向后兼容。

`Reflect` 方法与 `Proxy` 捕获器一一对应，也是13种方法，提供了统一的 API。

```js
const obj = {
  name: "Klaus",
  age: 25
};

const objProxy = new Proxy(obj, {
  has: function(target, key) {
    // 不再使用 target in key 而是 Reflect.has(target, key)
    // 因为Reflect.has方法在原本的基础上进行了优化并具有更好的语义
    return Reflect.has(target, key);
  },
  set: function(target, key, value) {
    return Reflect.set(target, key, value);
  },
  get: function(target, key) {
    return Reflect.get(target, key);
  },
  deleteProperty: function(target, key) {
    return Reflect.deleteProperty(target, key);
  }
});

console.log("name" in objProxy); // true
objProxy.name = "Steven";
console.log(objProxy.name); // "Steven"
delete objProxy.name;
console.log(objProxy); // { age: 18 }
```



## receiver

`Reflect.get` 和 `Reflect.set` 中的 `receiver` 参数用于调整 getter/setter 中的 `this` 指向。

默认情况下，`this` 指向目标对象。通过 `receiver`，可以将`this`修正为代理对象

```js
const obj = {
  _name: 'Klaus',
  get name() {
    console.log(this === obj) // => true
    return this._name
  },
  set name(name) {
    console.log(this === obj) // => true
    this._name = name
  }
}

const proxy = new Proxy(obj, {
  get(target, key) {
    console.log(`${key} getter`)
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    console.log(`${key} setter`)
    return Reflect.set(target, key, value);
  }
});

// 使用代理对象
proxy.name = 'Alex';
console.log(proxy.name); // => Alex
```

此时只能监听`name`的`getter/setter`, 无法监听`_name`的`getter/setter`

输出结果是

```shell
name setter
name getter
```



通过`Reflect.get/Reflect.set`的第三个参数，可以修正`getter/setter`中的this

```js
const obj = {
  _name: 'Klaus',
  get name() {
    console.log(this === proxy) // => true
    return this._name
  },
  set name(name) {
    console.log(this === proxy) // => true
    this._name = name
  }
}

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log(`${key} getter`)
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log(`${key} setter`)
    return Reflect.set(target, key, value, receiver);
  }
});

// 使用代理对象
proxy.name = 'Alex';
console.log(proxy.name); // => Klaus
```

此时输出结果为

```shell
name setter
_name setter

name getter
_name getter
```



## construct

```shell
# 下述代码在功能上等价于
# new target(...argumentsList)
Reflect.construct(target, argumentsList)

# 下述代码在功能上等价于 「 实现借用构造函数基础 」
# const instance = new target(...argumentsList) + Object.setPrototypeOf(instance, newTarget.prototype)
Reflect.construct(target, argumentsList, newTarget)
```

```js
function Student(name, age) {
  this.name = name
  this.age = age
}

Student.prototype.type = 'Student'

function Animal() {
}

Animal.prototype.type = 'Animal'

const stu = Reflect.construct(Student, ["Klaus", 23], Animal)
console.log(stu.__proto__ === Animal.prototype) // true
console.log(stu.type) // Animal
```



### 示例

**借用构造函数继承属性**

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

// 借用构造函数继承属性
function Student(name, age) {
 if (Reflect && Reflect.construct) {
   return Reflect.construct(Person, [name, age], Student) // 等价于 Person.apply(this, [name, age])
 } else {
  return Person.apply(this, [name, age])
 }
}

const stu = new Student('Klaus', 23)
console.log(stu)
```

