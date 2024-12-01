## 属性描述符

**属性描述符**是用于精确控制对象属性的配置对象。它允许我们对对象的属性进行详细的配置和操作。



### Object.defineProperty()

**`Object.defineProperty()` 方法**用于在对象上定义一个新属性或修改现有属性。

它接收三个参数：

- **对象**：要在其上定义属性的对象。
- **属性名**：要定义或修改的属性名。
- **属性描述符**：用于配置属性的对象。

它的返回值: 

+ 需要操作的对象本身
+ `Object.defineProperty()` 会直接修改传入的对象, 是非纯函数
+ 所以返回值很少使用

```js
const user = {
  name: 'Klaus',
  age: 23
};

// 修改属性
Object.defineProperty(user, 'name', {
  value: 'Alex'
});

// 添加新属性
const obj = Object.defineProperty(user, 'address', {
  value: 'shanghai',
  enumerable: true
});

console.log(user.name); // => Alex
console.log(user.address); // => shanghai
console.log(obj === user) // => true
```



### 描述符分类

属性描述符的类型有两种:

1. 数据属性(Data Properties)描述符(Descriptor)
2. 存取属性(Accessor访问器 Properties)描述符(Descriptor)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0de9223530e1451194c5798b47ac4fe7~tplv-k3u1fbpfcp-zoom-1.image)



#### 数据属性描述符

| 属性描述符       | 功能                                                         |
| ---------------- | ------------------------------------------------------------ |
| [[Configurable]] | 属性是否可以使用delete删除，属性的数据描述符是否可以被再次修改 |
| [[Enumerable]]   | 属性是否是可迭代的(即可以使用for-in循环，Object.keys等获取)  |
| [[Writable]]     | 属性是否是只读的                                             |
| [[value]]        | 属性值，读取属性时会返回该值，修改属性时，会对其进行修改     |

对于属性描述符(除[[value]]外)，默认值如下:

+ 当我们直接在一个对象上定义某个属性时，这个属性的默认值为true
+ 当我们通过属性描述符定义一个属性时，这个属性的默认值为false

对于属性描述符[[value]], 默认值为undefined

对于不可枚举的属性，如果直接打印一个对象的时候，依旧可以在打印的对象中看到对应的不可枚举属性，但是其颜色会比正常属性要淡，表明其是一个不可枚举属性，在遍历的时候不会被输出



#### 存储属性描述符

| 属性描述符       | 功能                                       |
| ---------------- | ------------------------------------------ |
| [[Configurable]] | 和数据属性描述符中[[Configurable]]规则一致 |
| [[Enumerable]]   | 和数据属性描述符中[[Enumerable]]规则一致   |
| [[get]]          | 获取属性时会执行的函数。默认为undefined    |
| [[set]]          | 设置属性时会执行的函数。默认为undefined    |



### Object.defineProperties

Object.defineProperties() 方法直接在一个对象上定义 `多个` 新的属性或修改现有属性，并且返回该对象

```js
const user = {}

const obj = Object.defineProperties(user, {
  name: {
    value: 'Klaus',
    enumerable: true
  },

  age: {
    value: 23,
    enumerable: true
  }
})

console.log(user) // => { name: 'Klaus', age: 23 } 
console.log(obj === user) // => true
```



### 获取描述符

```js
const user = {
  name: 'Klaus',
  age: 23
}

// 获取对象单一属性的属性描述符
console.log(Object.getOwnPropertyDescriptor(user, 'name'))

// 获取对象所有属性的属性描述符
console.log(Object.getOwnPropertyDescriptors(user))
```



## 对象限制

**`Object.preventExtensions()`**

```js
const user = {
  name: 'Klaus',
  age: 23
};

// 阻止对象扩展
Object.preventExtensions(user);

user.address = 'Shanghai'; // 无效，不会添加新属性
console.log(user); // => { name: 'Klaus', age: 23 }

// 检测对象是否可扩展
console.log(Object.isExtensible(user)) // false
```



**`Object.seal()`**

```js
const user = {
  name: 'Klaus',
  age: 23
};

// 密封对象
// 1. 不可扩展
// 2. 属性不可删除
// 3. 不能修改属性描述符
Object.seal(user);

delete user.name; // 无效，不能删除属性
user.age = 30; // 可以修改属性值

// 不能修改属性描述符 => 直接报错
// Object.defineProperty(user, 'address', {
//   value: 'shanghai'
// })

console.log(user); // => { name: 'Klaus', age: 30 }

// 检测对象是否被密封
console.log(Object.isSealed(user)) // true
```



**`Object.freeze()`**

```js
const user = {
  name: 'Klaus',
  age: 23
};

// 冻结对象 => 什么都不能再做了
Object.freeze(user);

user.age = 30; // 无效，不能修改属性值
delete user.name; // 无效，不能删除属性
console.log(user); // => { name: 'Klaus', age: 23 }

// 检测对象是否被冻结
console.log(Object.isFrozen(user)) // true
```



## 原型操作

### **`Object.setPrototypeOf()`**

用于动态修改对象的原型链

```js
const obj = {
  name: 'Klaus',
  age: 23
};

const user = {};

// 设置 user 的原型对象为 obj
Object.setPrototypeOf(user, obj);

console.log(user.name); // => Klaus
```



### **`Object.getPrototypeOf()`**

用于获取一个对象的原型

```js
const obj = {
  name: 'Klaus',
  age: 23
};

const user = {};

Object.setPrototypeOf(user, obj);

// 获取 user 对象的原型对象
console.log(Object.getPrototypeOf(user) === obj); // => true
```



**`Object.create(proto, [propertiesObject])`**

用于创建一个新对象，使用现有的对象作为新对象的原型。

如果传入 `null`，则创建一个没有原型的对象。

```js
const proto = {
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

const user = Object.create(proto, {
  name: {
    value: 'Klaus',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 23,
    writable: false,
    enumerable: true,
    configurable: true
  }
});

user.greet(); // 输出: Hello, my name is Klaus
console.log(user.age); // 输出: 23
```



`Object.setPrototypeOf(obj, proto)` 可以改变对象的原型链

但是JavaScript 引擎会对对象的原型链进行优化，以提高属性查找的速度

动态改变对象的原型会使这些优化失效，需要重新进行优化，从而导致性能下降。

所以更推荐使用 `Object.create(proto)` 来替代`Object.setPrototypeOf(obj, proto)` ，这样可以避免在运行时动态修改原型，保持引擎的优化。



## 属性检测

### `hasOwnProperty`

用来判断一个对象是否包含特定的自身属性，而不是从原型链继承的属性。

```js
const obj = {
  name: 'Klaus',
  age: 23
}

const user = Object.create(obj)
user.address = 'shanghai'

console.log(user.hasOwnProperty('name')) // => false
console.log(user.hasOwnProperty('address')) // => true
```



### `in` 操作符

`in` 操作符用于检查某个属性是否是对象自身或其原型链上的属性, 无论是否可枚举

```js
const obj = {
  name: 'Klaus',
  age: 23
}

const user = Object.create(obj)
user.address = 'shanghai'

Object.defineProperty(obj, 'gender', {
  value: 'male',
  enumerable: false
})

console.log('name' in user) // => true
console.log('address' in user) // => true
console.log('gender' in user) // => true
```



## instanceof

`instanceof` 操作符用于检测某个构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Student(name, age, sno) {
  Person.call(this, name, age);
  this.sno = sno;
}

Object.setPrototypeOf(Student.prototype, Person.prototype);

const stu = new Student('Klaus', 23, 1810166);

console.log(stu instanceof Student); // => true
console.log(stu instanceof Person);  // => true
```



## isPrototypeOf

`instanceof` 是用来判断对象与构造函数之间的关系

而`isPrototypeOf` 方法用于检测一个对象是否存在于另一个对象的原型链上

```js
const obj = {
  name: 'Klaus',
  age: 23
};

const user = Object.create(obj);

console.log(obj.isPrototypeOf(user)); // => true
```



## Object.is

`Object.is`底层使用的依旧是全等判断，但额外对`NaN`进行了特殊处理

```js
console.log(NaN === NaN) // => false
console.log(Object.is(NaN, NaN)) // => true
```



## Object

将参数转函数类型，无法转换则返回空对象

```js
console.log(Object(123)) // [Number: 123]
console.log(Object({ name: 'Klaus' })) // { name: 'Klaus' }
console.log(Object(null)) // {}
```

