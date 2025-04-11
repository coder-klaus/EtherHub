## 限制对象规则

| 方法                | 说明                                              | 检测方法                   |
| ------------------- | ------------------------------------------------- | -------------------------- |
| `preventExtensions` | 阻止扩展                                          | `Object.isExtensible(obj)` |
| `seal`              | 阻止扩展 + 阻止修改描述符 + 阻止删除              | `Object.isSealed(obj)`     |
| `freeze`            | 阻止扩展 + 阻止修改描述符 + 阻止删除 + 阻止修改值 | `Object.isFrozen(obj)`     |



## 对象成员

![img](https://s2.loli.net/2025/04/08/RMXuEgm8oWq2tFN.png) 

```js
let obj = { x: 100 };  

// 查看单个对象成员的属性描述符
let descriptor = Object.getOwnPropertyDescriptor(obj, 'x');  
// 查看整个对象所有成员的属性描述符
let descriptor = Object.getOwnPropertyDescriptors(obj);  
```



数据描述符

- `configurable`：表示该属性是否可以被删除或修改其属性描述符；
- `enumerable`：表示该属性是否可以被枚举；
  - 可枚举的属性可以通过 `for...in` 循环或者 `Object.keys` 方法列举出来
- `writable`：表示该属性是否可以被修改；
- `value`：表示该属性的值。

存储描述符设置和数据描述符基本一致，只不过加上了get/set 因此 `writable`和`value`也就不再需要。他们之间是互斥的



如果点语法或中括号语法设置，`configurable、writable、enumerable`对应结果都是true，value默认值为undefined

通过`defineProperty`，`configurable、writable、enumerable`对应结果都是false，value默认值为undefined



如果因为成员规则导致操作对应成员失效 「 例如修改了只读属性 」，则

1. 在非严格模式下，静默失效
2. 严格模式下，直接报错



当我们使用 `Object.defineProperty` 修改规则时，如果成员已经存在，那么它的规则会被修改；如果成员不存在，则会新增该成员并设置规则。

```js
Object.defineProperty(obj, 'x', {
  configurable: true, // 是否可删除
  enumerable: true,   // 是否可枚举
  writable: true,     // 是否可修改
  value: 'some value' // 属性的值
});
```

```js
Object.defineProperty(obj, 'x', {
  get() {
    console.log('触发了 get 拦截');
    return 'Intercepted Value'; // 返回一个自定义值
  },
  set(newValue) {
    console.log('触发了 set 拦截');
    console.log('新值为:', newValue);
  }
});
```



