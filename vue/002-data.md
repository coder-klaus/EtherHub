通过 `data` 选项可以将数据转化为组件的状态，Vue 会对这些数据进行响应式拦截，因此它们会自动变成响应式数据。

`data` 的类型需要是一个返回状态对象的函数。



所有挂载到 Vue 实例上的属性都可以直接在视图中使用。而通过 `data` 配置项定义的数据会作为实例的属性挂载到 Vue 实例上，因此可以直接在视图中访问。

与直接在 Vue 实例上挂载属性不同的是，`data` 中定义的数据会被 Vue 自动劫持并转化为响应式数据。

响应式数据的特点是：当数据发生变化时，视图会自动更新并重新渲染。

这正是 MVVM 模式的核心体现。在没有框架的情况下，我们需要手动操作 DOM 来更新视图；而在使用框架时，只需修改数据，视图会随之自动更新。这等于将繁琐的 DOM 操作交由框架处理，大大提升了开发效率。



在 Vue 2 中，`data` 中定义的数据会通过 `getter` 和 `setter` 的拦截机制处理，从而转化为响应式数据。当这些数据发生变化时，会触发视图的更新和重新渲染。

需要注意的是，只有定义在 `data` 中的数据才会被 Vue 劫持并转化为响应式数据



在 `new Vue` 阶段，Vue 会执行一系列初始化工作：

- 其中包括调用 `initState` 方法，用于初始化组件的状态，并对数据进行劫持处理。这是 Vue 响应式数据的核心原理。

- `initProps` 方法负责初始化组件的 `props`，用于接收父组件传递的属性。

- `initMethods` 方法用于初始化组件的 `methods`，将定义的函数挂载到实例上，以便在模板或逻辑中调用。

在 `initData` 方法中：

- Vue 会对 `data` 中的每一个数据项进行 `getter` 和 `setter` 的拦截处理，从而实现数据劫持。
- 同时，这些数据会被挂载到组件实例上，方便直接访问。

当后续修改数据时，会触发 `setter` 函数。这个函数不仅负责更新数据值，还会通知视图重新渲染，从而实现数据驱动视图更新的效果。

经过数据劫持处理的数据被称为响应式数据，也可以简单理解为组件的状态。



## Vue 2 的响应式机制

在 Vue 2 中，响应式系统通过递归的方式对 `data` 中的对象和数组进行深度监听和劫持。它只处理 **普通对象** 和 **数组**，而不会处理字符串、数字、函数对象或正则表达式等其它类型值



### 对象的处理
1. **递归劫持**：Vue 2 会递归遍历对象和数组的每个属性，对其添加 `getter` 和 `setter`，实现数据劫持。
2. **特殊类型排除**：Vue 不会劫持函数、正则对象等非普通对象值，因为这些类型通常不用于存储动态数据。
3. **劫持规则**：
   - Vue 的数据劫持基于 `Object.keys` 方法。
   - 只会对 **自身的可枚举、非 Symbol 类型的实例属性** 进行 `getter` 和 `setter` 的拦截。
4. **冻结对象**：
   - 如果对象被 `Object.freeze` 冻结，其内部成员不会被劫持，因为冻结对象无法通过 `Object.defineProperty` 修改属性。
   - 需要注意，`Object.freeze` 是浅层冻结，虽然顶层属性无法劫持，但 Vue 选择不处理多层对象的非顶层属性。「 即使原生JavaScipt语法可以做到 」
   



### 数组的处理

1. **索引不劫持**：
   - Vue 不会对数组的每个索引进行劫持，因此通过索引直接修改数组项（如 `arr[0] = 10`）不会触发视图更新。「Vue 3 已解决此问题」
2. **重写原型方法**：
   - Vue 通过重写数组的原型方法实现响应式处理。
     - 在数组的原型和数组实例之间额外加了一层 「 实例 => 额外加的一层 => 数组原本的原型对象 」
     - 在该层中重写了以下七个方法：`push`、`pop`、`shift`、`unshift`、`splice`、`sort` 和 `reverse`。
3. **数组项劫持**：
   - 如果数组中的某一项是对象，那么对象的每个成员依然会被 Vue 通过 `getter` 和 `setter` 劫持。



### 劫持时机

Vue 的数据劫持仅发生在 `new Vue` 的初始化阶段。在这个阶段定义的数据会被劫持，而动态添加的属性不会被劫持。因此，在项目开发中，所有需要的数据都应提前在 `data` 中声明，即使不知道具体的值，也可以赋予一个初始值，以确保其被劫持。



## Vue 2 的特殊方法

### `$set`
1. **新增成员**：
   
   - 可以在对象中新增一个成员，使其成为响应式数据，同时触发视图更新。
   - 如果成员已经存在但非响应式，直接修改其值不会触发视图更新。
   
2. **修改数组索引**：
   - 可以通过 `$set` 修改数组的某一项值，同时触发视图更新。
   - 但数组的索引依旧是没有进行响应式处理的
   
   

**语法**：`vm.$set(obj, key, value)`  

- `obj`：目标对象  
- `key`：属性名  
- `value`：属性值  

> `$set` 不能用于 Vue 实例本身，只能用于实例上的对象。
>
> 如果尝试 `vm.$set(vm, 'prop', 'value')`，会报错。



### `$forceUpdate`

- 强制视图更新，无论修改的是响应式数据还是非响应式数据，都可以通过 `$forceUpdate` 触发视图重新渲染。



## 面试题

假设有一个数组状态 `ary = [10, 20, 30]`，我们想把第一项修改为 `1000`，并让视图更新。问：有哪些方法可以实现？

+ `vm.ary.splice(0, 1, 1000)`
+ `vm.ary = [1000, ...vm.ary.slice(1)]`
+ `vm.$set(vm.ary, 0, 1000)`
+ `vm.ary[0] = 1000` +  `vm.$forceUpdate();`



## 伪代码

```javascript
// 核心响应式处理函数
function defineReactive(obj, key, val) {
  // 如果值是普通对象或数组，则进行响应式处理
  observe(val);

  // 确保重写的数组方法是不可枚举的
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 依赖收集
      console.log(`获取属性 ${key}:`, val);
      return val;
    },
    set(newVal) {
      // 如果新值与旧值相同，则不进行处理
      if (newVal === val) return;

      val = newVal;
      notify()

      // 如果设置的新增是普通对象或数组，需要进行响应式处理
      observe(newVal);
    }
  });
}

// 响应式处理
function observe(value) {
  // 只处理普通对象 和 数组，其余对象一律不处理
  // 普通对象 => 普通对象通常指的是通过 对象字面量 或 Object 构造函数 创建的对象
  // 纯对象 => 普通对象 或者通过 Object.create(null) 创建的对象
  if (Object.prototype.toString.call(obj) !== '[object Object]') return value;

  if (Array.isArray(value)) {
    // 重写数组原型方法
    const arrayMethods = Object.create(Array.prototype);

    // 在数组中的非纯方法被称之为变异方法，其余被诚之为非变异方法
    // 数组的变异方法为 'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
      arrayMethods[method] = function (...args) {
        // 调用原始方法 「 this 指向数组本身 !!! 」
        const result = Array.prototype[method].apply(this, args);
        let inserted;

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args; // 新增的元素
            break;
          case 'splice':
            inserted = args.slice(2); // splice(索引，需要删除几个元素, ...新增元素)
            break;
        }

        if (inserted) {
          // 对新插入的元素做响应式处理
          inserted.forEach(item => observe(item));
        }

        // 通知更新
        notify();

        return result;
      };
    });

    // 设置数组原型
    Object.setPrototypeOf(value, arrayMethods);

    // 对数组中的每个元素做响应式处理
    value.forEach(item => observe(item));

    return value;
  } else {
    // 如果对象被冻结，则不进行响应式处理
    if (Object.isFrozen(value)) return value;

    // 遍历对象属性，添加响应式
    Object.keys(value).forEach(key => defineReactive(value, key, value[key]));
    return value;
  }
}

function notify() {
  console.log('通知视图更新 「 模拟 」')
}

export {
  observe,
  defineReactive,
  notify
};
```


