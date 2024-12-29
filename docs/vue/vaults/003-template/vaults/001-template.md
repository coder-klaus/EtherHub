在 Vue 2 和 Vue 3 中，构建视图时最常用的语法有两种：模板（template）和 JSX。通常情况下，开发者更倾向于使用模板语法。

模板语法主要由两部分组成：插值语法 「 `{{ expression }}` 」和指令 「 `v-xxx="expression"` 」



## 插值语法

在 Vue 中，插值语法（也称为小胡子语法）用于在 HTML 模板中嵌入动态数据。通过双大括号 `{{ }}`，

你可以插入**任何合法的 JavaScript 表达式**。 Vue在渲染时会计算表达式并获取表达式的返回值进行渲染

这些表达式可以是以下几种：

1. 变量、状态和属性
2. 数学运算
3. 三元运算
4. `map`、`filter`、`find` 等方法
5. 一些被加入到 [Vue 白名单](https://github.com/vuejs/vue/blob/v2.6.10/src/core/instance/proxy.js#L9) 中的全局方法

> 在 React 中，类似的功能通过大括号 `{}` 实现，这被称为大胡子语法。
>
> 而在 Vue 中，我们使用 `{{ }}` 实现插值，这就是小胡子语法或插值语法



## 可渲染的值

在Mustache语法中：

- **`null` 和 `undefined`**：这些值在渲染时会显示为空
- **普通对象和数组**：这些类型会通过 `JSON.stringify()` 转换为字符串形式进行渲染
- **其他对象**：会调用它们的 `String()` 方法来转换为字符串。
  - 在 Vue 2 中，`Symbol` 不能直接作为插值语法的表达式值使用。你需要将它作为状态的值，在data配置项中定义后再通过 Mustache 进行渲染。而在 Vue 3 中，这个限制已经被移除，你可以直接使用 `Symbol`。
  - ``String(10n)` => "10"`



### 实现细节:

`new Vue()` => `_init()` => `initState()`

1. 如果有props options，初始化props
2. 执行setup
3. 如果有methods options，初始化methods
4. 如果有data options，初始化data => 执行`initData`
5. 如果有computed options，初始化computed
6. 如果有watch options，初始化watch

所以对应状态只会在组件实例化时被数据劫持，后续再往data上添加的数据将不再具备响应式



#### initData中处理的事情

+ 把data中的数据挂载到实例上
+ 并且对data中的每一项数据进行数据劫持



## 注意点

1. **深度响应式** 

   + 在 Vue2 中，`data` 选项通常是一个对象，Vue 会对这个对象进行深度响应式处理。

   + 如果 `data` 中包含嵌套的普通对象或数组，这些也会被响应式处理

   + 函数或正则等其余对象不会被响应式处理。

   + 如果对象被冻结（使用 `Object.freeze`），它将不会被响应式处理，因为冻结对象没有办法进行数据劫持。

```js
// 冻结的是frozenObj，而不是Vue的实力对象vm
vm.frozenObj.x = 10  // 不会触发响应式
vm.frozenObj = {x: 10}  // 触发响应式
```

2. **数组的响应式**

   + Vue2 对数组的响应式处理与对象不同。
   + 对象通过修改属性成员的getter/setter描述符实现的
   + 数组是通过重写数组原型链实现的
   + 在数组实例和数组原型链中插入了自定义原型对象 「 `数组.__proto__` => `自定义原型` => `Array.prototype` 」
   + 该原型中重写了数组的 `pop`、`push`、`unshift`、`shift`、`reverse`、`splice` 和 `sort` 这七个方法
   + 所以直接通过索引修改数组不会触发响应式

   ```js
   vm.arr.push(10);  // 触发响应式
   vm.arr[0] = 200;  // 不会触发响应式
   ```
   
3. **获取属性**

   + Vue 内部通过 `Object.keys`获取对象的所有可迭代非Symbol类型属性进行数据劫持
   + 哪些不可迭代属性或 Symbol 类型属性无法被`Object.keys`获取进行响应式处理，更不会被挂载到vue实例上





## $set

数据劫持发生在实例化 Vue 对象的过程中。当你使用 `new Vue()` 时，`data` 中定义的所有数据会被劫持。

在 `new` 之后，如果你手动为对象添加新属性，这些属性默认不会被劫持。

```js
const vm = new Vue({
  data: {
    message: 'Hello Vue!' // 响应式数据
  }
});

vm.newProperty = 'I am new';  // 非响应式
```

因此在项目开发中，建议将所有需要的数据预先在 `data` 中声明并赋予初始值。这样可以确保这些数据被 Vue 的响应式系统正常劫持。



如果必须需要在后续动态添加属性，可以使用 Vue 提供的 `$set` 方法。 「 其中 `Vue.set`方法 等价于 `vm.$set`方法 」



### 注意点

1. **不能直接给 `vm` 实例添加属性**：
   + 不能使用 `$set` 给 `vm` 或 `vm.$data` 添加一级属性。
     + `vm.$data`中添加的一级属性最终也是要挂载到`vm`上的，等价于直接给`vm`挂载属性
   + 简单来说，你不能在 `data` 的一级属性上动态添加新属性。

```js
// 不推荐
vm.$set(vm, 'newProp', 'value');  // 不会生效
```

2. **可以给深层次属性添加新成员**：
   + 可以使用 `$set` 给 `data` 中的二级或更深层次的属性添加新成员。这些新成员会被劫持，并触发界面更新。

```javascript
// 推荐
vm.$set(vm.someObject, 'newKey', 'newValue');
```

3. 如果尝试使用 `$set` 修改之前的非响应式数据，该数据不会自动变为响应式, 界面也不会发生任何的更新

4. **数组更新**
   + `$set` 可以通过索引更新数组元素，并触发界面重新渲染。但对应元素并不会变成响应式的

```js
vm.$set(vm.arr, 0, 100);  // 更新数组第一个元素
```



## $forceUpdate

`vm.$forceUpdate` 是 Vue 提供的一种方法，用于强制组件重新渲染



## 示例

**如何更新数组的第一项并刷新视图？**

```js
// 方法一
vm.arr.splice(0, 1, 1000);

// 方法二
vm.arr = [1000, ...vm.arr.slice(1)];

// 方法三
vm.arr.shift();
vm.arr = [1000, ...vm.arr];

// 方法四
vm.arr[0] = 1000;
vm.$forceUpdate();
```
