实际项目开发时，会存在很多公共状态，为了让代码更容易维护、更方便管理，同时避免团队协作时的冲突问题，我们一般需要对公共状态进行模块化拆分，而使用了模块化状态的项目就是**reducer 的工程化开发**



**项目目录结构**

```shell
.
├── App.jsx
├── main.jsx
└── store
    ├── action # 存在所有的action文件
    │   ├── counterAction.js # 模块化action文件
    │   ├── index.js # 合并模块化action，并导出完整的action对象
    │   └── userAction.js
    ├── actionType.js # 存放行为标识的文件一般命名为actionType
    ├── index.js # 导出整个store容器
    ├── reducer # 存在所有的reducer文件
    │   ├── counterReducer.js # 模块化reducer文件
    │   ├── index.js # 合并模块化reducer，并导出完整的reducer函数
    │   └── userReducer.js
    └── storeContext.js
```



::: code-group

``` jsx [主入口文件 - App.jsx]
import { memo, useContext, useState, useEffect } from 'react'
import StoreContext from './store/storeContext'
import actions from './store/action'

const Count = memo(() => {
  // 状态已经通过模块化处理，所以在获取时需要额外解构一次
  const { getState, dispatch, subscribe } = useContext(StoreContext)
  const { counter } = getState()

  const [_, forceUpdate] = useState(0)
  useEffect(() => subscribe(() => forceUpdate(Date.now())), [subscribe])

  return (
    <div>
      <p>计数器：{counter.count}</p>
      {/* 通过模块去获取实际方法，调用传入参数，以获取实际派发对象 */}
      <button onClick={() => dispatch(actions.count.increment({ step: 1 }))}>+</button>
      <button onClick={() => dispatch(actions.count.decrement({ step: 1 }))}>-</button>
    </div>
  )
})

const User = memo(() => {
  const { getState, dispatch, subscribe } = useContext(StoreContext)
  const { user } = getState()

  const [_, forceUpdate] = useState(0)
  useEffect(() => subscribe(() => forceUpdate(Date.now())), [subscribe])

  return (
    <div>
      <p>用户名：{user.name}</p>
      <p>用户年龄：{user.age}</p>
      <button onClick={() => dispatch(actions.user.setName({ name: '李四' }))}>change name</button>
      <button onClick={() => dispatch(actions.user.setAge({ age: 20 }))}>change age</button>
    </div>
  )
})

const App = memo(() => {
  return (
    <div>
      <Count />
      <User />
    </div>
  )
})

export default App
```

```jsx [根组件 - main.jsx]
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import store from './store'
import { Provider } from './store/storeContext'

const root = createRoot(document.getElementById('root'))

root.render((
  <Provider value={store}>
    <App />
  </Provider>
))
```

:::

::: code-group

```js [store入口文件 - store/index.js]
import { createStore } from 'redux'
import reducer from './reducer'

// 使用合并后的reducer即可
const store = createStore(reducer)

/* 输出的状态已经被模块化处理了 */
// console.log(store.getState()) // {count: {…}, user: {…}}

export default store
```

```jsx [上下文对象 - storeContext.js]
import { createContext } from 'react'

const StoreContext = createContext()
const { Provider, Consumer } = StoreContext

export default StoreContext
export { Provider, Consumer }
```

```js [事件行为标识 - actionType.js]
// 将所有事件行为标识都统一定义在一个文件中
// 1. 利用变量不能重复定义的特性，来保证事件行为标识的唯一性 「 这需要确保变量名和变量值相同才可以 」
// 2. 导入时可以使用类似于 import * as actionType from './actionType' 的方式，来导入所有的事件行为标识 「 在使用时存在IDE提示，提高效率，减少错误概率 」


// 行为标识的命名规则为 <模块名>_<行为标识>
export const COUNT_INCREMENT = 'COUNT_INCREMENT'
export const COUNT_DECREMENT = 'COUNT_DECREMENT'

export const USER_SET_NAME = 'USER_SET_NAME'
export const USER_SET_AGE = 'USER_SET_AGE'
```

:::



::: code-group

``` js [派发行为 - 入口]
import counterAction from './counterAction'
import userAction from './userAction'

// 实现类似于combineReducers的效果
// 只不过react没有提供 combineActions，需要自己手动实现
export default { count: counterAction, user: userAction }
```

```js [counterAction.js]
import { COUNT_INCREMENT, COUNT_DECREMENT } from '../actionType'

// action creator
// 1. 一个有函数组成的对象
// 2. 调用函数后，会返回对应的行为对象 「 action对象 」
export default {
  increment: payload => ({
    type: COUNT_INCREMENT,
    payload
  }),
  decrement: payload => ({
    type: COUNT_DECREMENT,
    payload
  })
}
```

```js [userAction.js]
import { USER_SET_NAME, USER_SET_AGE } from '../actionType'

export default {
  setName: payload => ({
    type: USER_SET_NAME,
    payload
  }),
  setAge: payload => ({
    type: USER_SET_AGE,
    payload
  })
}
```

:::



::: code-group

```js [reducer 入口文件]
import { combineReducers } from 'redux'
import counterReducer from './counterReducer'
import userReducer from './userReducer'

// 合并多个reducer函数，返回一个总的reducer函数
const reducer = combineReducers({
  counter: counterReducer,
  user: userReducer
})

export default reducer
```

```js [counterReducer.js]
// 模块化reducer的写法和普通reducer写法完全一致
import { COUNT_INCREMENT, COUNT_DECREMENT } from '../actionType'

const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case COUNT_INCREMENT:
      return {
        ...state,
        count: state.count + action.payload.step
      }
    case COUNT_DECREMENT:
      return {
        ...state,
        count: state.count - action.payload.step
      }
    default:
      return state
  }
}

export default counterReducer
```

```js [countReducer.js]
import { USER_SET_NAME, USER_SET_AGE } from '../actionType'

const userReducer = (state = { name: '张三', age: 18 }, action) => {
  switch (action.type) {
    case USER_SET_NAME:
      return {
        ...state,
        name: action.payload.name
      }
    case USER_SET_AGE:
      return {
        ...state,
        age: action.payload.age
      }
    default:
      return state
  }
}

export default userReducer
```

:::



## combineReducers伪代码实现

```jsx
export const combineReducers = (reducers) => {
  // 将所有reducer模块进行合并并返回一个大的reducer函数
  return (state = {}, action) => {
    // 遍历所有reducer模块，将每个模块的state和action进行合并
    // combineState 是 合并后的总的 模块状态对象
    return Object.keys(reducers).reduce((combineState, key) => {
      // 将每个模块的state和action进行合并
      combineState[key] = reducers[key](state[key], action)
      // 返回合并后的state
      return combineState
    }, {})
  }
}
```

注意: 

1. dispatch时候，会迭代事件池中listeners依次执行。如果存在同名type，就会派发多次，而不是仅派发匹配到的第一个行为对象

   因为 Redux 会遍历所有模块的 reducer，找到所有与 `action.type` 匹配的逻辑并执行。这就是为什么派发标识需要进行宏管理「 放在一起统一进行管理 」的原因
