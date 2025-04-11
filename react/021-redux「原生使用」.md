如果组件关系较远，可以创建一个全局公共状态管理容器，用来存储组件之间需要通信的内容

每个组件都可以通过某种方式从这个容器中获取信息，也可以通过某种方式去修改这些信息



在react中，我们一般使用redux，zustand，mobx等作为公共状态管理解决方案来实现

而他们其中任意一中状态管理方案都是单独的JavaScript状态管理工具，可以在非 React 的项目中使用

> 这和vuex 和 pinia 只能在vue中使用是不一样的



## 使用步骤

1. 创建一个公共容器（**store**）

2. 指定一个 **reducer**，用来管理状态更新逻辑

3. 通过 **dispatch** 方法，将 **action** 传递给 **reducer**

4. 在 **reducer** 中，根据 **action.type** 执行对应的状态更新逻辑

5. 返回新的状态，替换旧的状态




`store` 

1. 这个 `store` 分为两部分：

   1. 公共状态
   2. 事件池（Event Pool) 
      + 组件订阅了store后，在状态发生改变时需要执行的事件集合
      + 当store中状态改变后，会依次执行事件池中对应方法

2. 提供了一些与状态管理相关的方法

   + getState => 获取公共状态

   + dispatch => 派发更新事件，通知reducer执行 「 可以理解为reducer就是操作状态更新的管理员 」

   + subscribe

     + 订阅事件，也就是哪些状态更新后，组件需要执行的回调
     + 一般常见的订阅逻辑是，状态更新后让组件更新，获取最新的公共状态并重新渲染



## 示例


::: code-group

```shell [目录结构]
.
├── App.jsx
├── main.jsx
└── store # 和store相关逻辑都放置在store目录下
    ├── const
    │   └── store.js
    ├── context
    │   └── store.js
    └── index.js
```

```js [行为常量 - const/store.js]
// 定义操作类型
// 1. 事件类型定义为公共常量
// 2. 一般单独抽取到一个独立文件中
//    + 方便管理和复用 「 避免形成魔法常量 」
//    + 所有操作都在一个文件中，可以避免操作类型重复定义
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
```

```js [上下文对象 - context/store.js]
import { createContext } from 'react'

const StoreContext = createContext()
const { Provider, Consumer } = StoreContext

export { Provider, Consumer }
export default StoreContext
```

```jsx [入口文件 - main.jsx]
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import store from './store'
import { Provider } from './store/context/store.js'

const root = createRoot(document.getElementById('root'))

// 全局注入store对象，避免每个文件都需要引入 「 解耦操作 」
root.render((
  <Provider value={store}>
    <App />
  </Provider>
))
```

```js [公共容器 - store.js]
// 创建公共容器
import { createStore } from 'redux';
import { INCREMENT, DECREMENT } from './const/store';


// 定义初始状态
const initalState = {
  count: 0
}

// 创建reducer => 必须是纯函数，返回新状态用于替换原本的旧状态
// + redux 通过 返回的状态引用不同来判断状态是否发生了更新, 这和vue不一样，vue通过自动监听来实现
// + 其次，每次都是全新独立的状态方便进行状态版本穿梭，也方便实现devtool，方便进行调试
// + 不会修改参数，确保了是纯函数，即状态可预测 「 执行方法就可以明确对应结果，而不会因为副作用原因无法预测结果 」

// state 为当前store最新状态值 「 首次执行，store中没有状态，使用initalState 」
// action 为派发行为对象
// + 派发行为对象中必须有type属性，用于描述操作类型 「 必填 」
// + 可以存在其余参数，作为参数传递给reducer函数 「 非必填 」
//   + 多个参数可以整合为一个名为payload的对象参数，一起传递
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case INCREMENT:
        // 浅拷贝能够生成一个新的对象，并为需要更新的部分创建新的内存地址，同时复用未变化部分的引用，从而满足状态不可变性的要求
        // 相比深拷贝，浅拷贝避免了递归拷贝整个对象的性能开销，仅对必要的部分进行更新，最大程度地提升效率
        // 这种方式既能满足 Redux 的设计需求，又能节约性能资源。
            return {
                ...state,
                count: state.count + action.step // 接收参数方法1
            }
        case DECREMENT:
            return {
                ...state,
                count: state.count - action.payload.step // 接收参数方法2
            }
        default:
            // 1. 没有匹配到任何类型，返回旧状态
            // 2. 首次执行，redux内部会自动派发一次 「 type: '@@redux/INIT' 」
            //    所以必须存在default 逻辑块 以进行状态初始化
            return {...state};
    }
}

// 创建store => createStore 有两个重载实现
// 1. createStore(reducer, enhancer)
// 2. createStore(reducer, initalState, enhancer)

// + reducer 为reducer函数 「 处理reducer逻辑的处理函数 」
// + initalState 初始化值
//   => 也就是说我们可以不用显示在reducer中通过第一个参数设置初始值
//   => 我们也可以通过createStore的第二个参数来设置对应默认值
// + enhancer 为增强器，用于增强store的功能 「 redux的中间件 」
const store = createStore(reducer);

export default store;
```

```jsx [业务组件 - App.jsx]
import { memo, useContext, useEffect, useState } from 'react'
import StoreContext from './store/context/store'
import { INCREMENT, DECREMENT } from './store/const/store'

const Count = memo(() => {
  const [_, setCount] = useState(0)

  // 通过context获取store对象
  const { getState, subscribe } = useContext(StoreContext)
  // 通过store的getState方法获取全局公共状态
  const { count } = getState()

  // 依赖数组store是全局的，所以subscribe方法是全局的
  // 换句话来说，这里的effect回调只会被执行一次
  useEffect(() => {
    const unSubscribe = subscribe(() => setCount(Date.now()))

    // 返回一个取消订阅的方法，以便于在组件卸载时取消订阅
    return unSubscribe
  }, [])

  return (
    <div>Count: {count}</div>
  )
})

const Action = memo(() => {
  const [_, setCount] = useState(0)

  // 从store对象中解构出 派发事件的方法 和 订阅状态变化的方法
  const { dispatch, subscribe } = useContext(StoreContext)

  useEffect(() => {
    // 订阅状态变化 => 就是往store的事件池中加入监听方法
    // 加入的监听方法需要是可以让组件更新的方法，以便于组件重新调用getState获取最新状态值后重新进行渲染
    // + 类组件 => 通过forceUpdate方法强制更新组件
    // + 函数组件 => 通过useState方法强制更新组件 「 创建一个临时变量，以触发强制更新 」
    const unSubscribe = subscribe(() => setCount(Date.now()))

    return unSubscribe
  }, [subscribe])

  return (
    <>
      {/*
          { type: <事件名>, ...参数 } => 这样的对象叫事件行为对象
          以下是传递参数的两种方式
          + 方式一：直接传递参数
          + 方式二：将多个参数包裹在payload参数中统一传递
       */}
      <button onClick={() => dispatch({ type: INCREMENT, step: 2 })}>+</button>
      <button onClick={() => dispatch({ type: DECREMENT, payload:{ step: 2 } })}>-</button>
    </>
  )
})

const App = memo(() => {
  return (
    <>
      <Count />
      <Action />
    </>
  )
})

export default App
```


:::



## 注意事项

1. 状态不能直接修改「 如 store.foo = 'bar' => 这是不行的 」

   而是应该要生成一个全新的状态，用于替代原本的老状态 「 这就是react中数据不可变性 」

   这也是为什么要求reducer必须是一个纯函数



2. 状态行为对象中的type在多处都被使用，所以推荐抽离为常量值，以避免魔法变量

   **魔法常量**（Magic Constants）是编程中一种特殊的概念，通常指那些在程序中直接使用的**固定值**，而没有通过变量或命名来表示。这些值往往在代码中显得神秘，因为它们的含义并不直观，可能让代码的可读性和可维护性变差。

   **魔法常量的特点**

   1. **直接写在代码中**：魔法常量通常是一些硬编码的值，比如数字、字符串等。
   2. **不可解释**：它们的意义不明确，可能需要额外的注释或文档才能理解。
   3. **难以维护**：如果魔法常量在多个地方使用，后续修改时可能会遗漏，或者需要在代码中逐个查找替换。



## 伪代码实现

```jsx
// 创建store => 暂不考虑中间件
export function createStore(reducer, initialState) {
  // edge case
  if (typeof reducer !== 'function') {
    throw new Error('reducer must be a function')
  }

  // store中存储公共状态的容器
  let state = initialState
  // store中的事件池 「 就是存储事件对象的数组 」
  let listeners = []

  // 返回当前状态
  function getState() {
    return state
  }

  // 派发事件，修改公共状态
  function dispatch(action) {
    // edge case
    if (typeof action !== 'object' && action !== null) {
      throw new Error('action must be an object')
    }

    if (typeof action.type === 'undefined') {
      throw new Error('action must have a type property')
    }

    // 调用reducer函数，修改公共状态
    state = reducer(state, action)

    // 遍历事件池，执行所有事件监听器
    listeners.forEach(listener => listener())

    // 返回派发的事件对象 「 用于链式调用 => 例如 dispatch(dispatch({ type: 'INCREMENT' })) ???? 」
    return action
  }

  // 订阅事件，将事件监听器添加到事件池中
  function subscribe(listener) {
    // edge case
    if (typeof listener !== 'function') {
      throw new Error('listener must be a function')
    }

    // 避免重复添加
    if (!listeners.includes(listener)) {
      listeners.push(listener)
    }

    // 返回一个取消订阅的方法
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  // 内部默认派发一次，以初始化状态
  // type值只要是唯一的即可
  // 1. ES6 直接派发symbol值即可
  // 2. ES5 使用一个唯一的字符串即可
  //   + Math.random().toString(36).substring(7).split('').join('.')
  //     => 之所以是36进制，是因为36进制可以包含所有数字和字母 「 是能表示的最大进制数 」
  //     => 实际派发的type值是 「 `@@redux/INIT${之前生成的随机字符串}`」
  dispatch({ type: Symbol('@@redux/INIT') })

  // 向外暴露常用方法
  return {
    getState,
    dispatch,
    subscribe
  }
}
```



## 为什么要用dispatch

1. `dispatch`在修改状态后，会通知事件池中订阅方法依次执行
2. 状态修改和状态定义在同一个地方，其余地方只是通知更新，方便后期维护和扩展


