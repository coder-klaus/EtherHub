## 概述

`Object`职责太重了

1. 所有类的父类
2. 可以操作对象自身的方法也被挂载到了Object类上

其次操作对象自身的操作

1. 有些是方法 「 如`getPrototypeOf`、`setPrototypeOf`等 」
2. 有些是操作符 「 如`delete`、`in`等 」



所以将操作对象自身的方法「 反射方法 」单独抽离并挂载到一个新的`内置对象Reflect`上，从而实现职责分离

同时在抽离的过程中，优化了语义。一些原本静默失效的操作，现在直接报错

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

// Reflect.deleteProperty方法返回布尔值表示属性是否删除成功 => 严格模式和非严格模式行为统一了
if (Reflect.deleteProperty(user, 'name')) {
  console.log('删除成功')
} else {
  console.log('删除失败')
}
```





虽然Reflect首字母大写，但不是类，只是工具对象「 类似于命名空间 」，直接使用Reflect上方法即可

为了向后兼容，这些反射方法即可以通过`Object`操作，也可以通过`Reflect`操作

Reflect 提供的方法与 Proxy 的捕获器方法一一对应，也是13种操作

```js
const obj = {
  name: "why",
  age: 18,
  set height(newValue) {}
};

const objProxy = new Proxy(obj, {
  has: function(target, key) {
    // 不再使用 target in key 而是 Reflect.has(target, key)
    // 将对象操作交给浏览器自己完成，而不是我们操作，降低了代理对象和源对象之间的耦合度
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
objProxy.name = "kobe";
console.log(objProxy.name); // "kobe"
delete objProxy.name;
console.log(objProxy); // { age: 18, set height: [Function: set height] }
```





## receiver

用于修正`getter/setter`中的this指向



默认情况下，`getter/setter`中的this是源对象

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

::: info

```shell
# 下述代码在功能上等价于
# new target(...argumentsList)
Reflect.construct(target, argumentsList)

# 下述代码在功能上等价于 
# const instance = new target(...argumentsList) + Object.setPrototypeOf(instance, newTarget.prototype)
# 还等价于 newTarget.apply(this, argumentsList) => this是target的实例
Reflect.construct(target, argumentsList, newTarget)
```

:::

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

**实现原型链继承**

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

// 借用构造函数继承属性
function Student(name, age) {
 // 如果存在 Reflect.construct
 if (Reflect && Reflect.construct) {
   // Reflect.construct(需要调用构造函数, 参数列表构成的数组，实际需要的类型对应的构造函数)
   return Reflect.construct(Person, [name, age], Student)
  // 上述代码的含义是 调用Person的构造函数，传入name和age，但是创建出的实例类型是Student的实例
  // 等价于 Person.apply(this, [name, age])
 } else {
  // Person.apply(Student, [name, age])
  return Person.apply(this, [name, age])
 }
}

const stu = new Student('Klaus', 23)
console.log(stu)
```

