`react-redux`是`redux`的插件，目的是简化`redux`在`react`中的使用方式

`react-redux`没有修改redux的定义方式，只是简化了在react组件中的使用方式

+ 不需要自己创建上下文对象来全局注入store对象
+ 不需要手动调用 `getState` 或通过 `subscribe` 添加组件更新逻辑



`main.js`

```js
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import store from './store'
// react-redux的第一个便利，是内部自己维护了上下文对象
// 我们只需要导入Provider组件，并传入store对象即可
import { Provider } from 'react-redux'

const root = createRoot(document.getElementById('root'))

root.render((
  <Provider store={store}>
    <App />
  </Provider>
))
```



**组件使用**

```jsx
import { memo} from 'react'
import { connect } from 'react-redux'
import actions from './store/action'

const Count = memo(props => {
  return (
    <div>
      <p>计数器：{props.count}</p>
      <button onClick={() => props.increment(5)}>+</button>
      <button onClick={props.decrement}>-</button>
    </div>
  )
})

// connect(mapStateToProps, mapDispatchToProps)(组件)
// 1. connect函数会返回一个高阶组件
// 2. connect函数会传入两个参数，第一个参数是mapStateToProps，第二个参数是mapDispatchToProps
//    + mapStateToProps是一个函数，用于将state映射为组件的props
//      + 如果只要注入dispatch，无需注入状态 => 则mapStateToProps可以传入null
//    + mapDispatchToProps是一个函数，用于将dispatch映射为组件的props
export default connect(
  state => ({ // 这里传入的state是总的state
    count: state.counter.count
  }),
  dispatch => ({
    // 从外部接收参数
    increment: step => dispatch(actions.count.increment({ step })),
    decrement: () => dispatch(actions.count.decrement({ step: 1 }))
  })
)(Count)
```



::: code-group

```js [counterReducer.js]
import { COUNT_INCREMENT, COUNT_DECREMENT, TEST_INCREMENT } from '../actionType'

const counterReducer = (state = { count: 0, testCount: 100 }, { type, payload }) => {
  switch (type) {
    case COUNT_INCREMENT:
      return {
        ...state,
        count: state.count + payload.step
      }
    case COUNT_DECREMENT:
      return {
        ...state,
        count: state.count - payload.step
      }
    case TEST_INCREMENT:
      return {
        ...state,
        testCount: state.testCount + payload.step
      }
    default:
      return state
  }
}

export default counterReducer
```

```jsx [组件 - Count]
import { memo} from 'react'
import { connect } from 'react-redux'
import actions from './store/action'

const Count = memo(props => {
  return (
    <div>
      <p>计数器：{props.count}</p>
      <button onClick={() => props.increment({ step: 5 })}>+</button>
      <button onClick={() => props.decrement({ step: 1 })}>-</button>
    </div>
  )
})

// react-redux 中 只有注入的状态发生变化，才会重新渲染组件
// 如果mapStateToProps写法如下
// + state => state.counter 则 testCount 发生变化时，Count 组件也会重新渲染
// + 如果按照如下写法，则只有 count 发生变化时，Count 组件才会重新渲染
//   testCount 发生变化时，Count 组件不会重新渲染
export default connect(
  state => ({
    count: state.counter.count
  }),
  actions.count
)(Count)
```

```jsx [组件 - TestCount]
import React, { memo } from 'react'
import { connect } from 'react-redux'
import actions from './store/action'

const TestCount = memo(props => {
  console.log('testCount render')
  return (
    <>
      <p>测试计数器：{props.testCount}</p>
      <button onClick={() => props.testIncrement({ step: 1 })}>+</button>
    </>
  )
})

export default connect(
  state => ({
    testCount: state.counter.testCount
  }),
  dispatch => ({
    testIncrement: payload => dispatch(actions.count.testIncrement(payload))
  })
)(TestCount)
```

:::



::: code-group

```js [action对象]
import { COUNT_INCREMENT, COUNT_DECREMENT } from '../actionType'

// action creator组成的对象，就是action creators 「 action creator对象  」
export default {
  // 调用该方法后会返回action对象 「 行为对象 」
  // 这种定义为一个返回action对象方法的函数，称为action creator
  increment: payload => ( {
    type: COUNT_INCREMENT,
    payload
  }),
  decrement: payload => ({
    type: COUNT_DECREMENT,
    payload
  }),
  testIncrement: payload => ({
    type: 'TEST_INCREMENT',
    payload
  })
}
```

```jsx
import { memo} from 'react'
import { connect } from 'react-redux'
import actions from './store/action'

const Count = memo(props => {
  return (
    <div>
      <p>计数器：{props.count}</p>
      <button onClick={() => props.increment({ step: 5 })}>+</button>
      <button onClick={() => props.decrement({ step: 1 })}>-</button>
    </div>
  )
})

export default connect(
  state => ({
    count: state.counter.count
  }),
  // connect的第二个参数可以直接传入action creators对象
  // connect内部会调用名为 bindActionCreators 的方法
  // 将action creators对象中的方法转换为mapDispatchToProps所需要的那种格式
  // 也就是所谓的 boundActionCreators格式对象
  actions.count
)(Count)
```

:::



## 伪代码 - bindActionCreators

```js
import { memo} from 'react'
import { connect } from 'react-redux'
import actions from './store/action'



const Count = memo(props => {
  return (
    <div>
      <p>计数器：{props.count}</p>
      <button onClick={() => props.increment({ step: 5 })}>+</button>
      <button onClick={() => props.decrement({ step: 1 })}>-</button>
    </div>
  )
})

export default connect(
  state => ({
    count: state.counter.count
  }),
  dispatch => bindActionCreators(actions.count, dispatch)
)(Count)
```



## 伪代码 - react-redux

> React的HMR 基于 **Fast Refresh**。然而，Fast Refresh 有一个限制：**它只能正确处理那些文件中只导出 React 组件的情况**。
>
> 如果一个文件同时导出了非组件的内容（例如常量、纯函数等），Fast Refresh 可能无法正常工作。因此下述示例可能存在 ESLint警告 `react-refresh/only-export-components`
>
> 但示例仅仅为了方便演示，真实开发中只需要将组件和非组件内容拆分为多个不同的模块即可

```jsx
import { createContext, useContext, useState, useEffect } from 'react'

// 模拟实现bindActionCreators => bindActionCreators(<action creators对象>, dispatch)
export function bindActionCreators(actionCreators, dispatch) {
  return Object.keys(actionCreators).reduce((boundActionCreators, key) => {
    boundActionCreators[key] = (...args) => dispatch(actionCreators[key](...args))
    return boundActionCreators
  }, {})
}

// 创建上下文对象，用于在组件中传递store
const StoreContext = createContext()

// 模拟实现 Provider 组件
export function Provider({ store, children }) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

// 模拟实现connect方法
export function connect(mapStateToProps, mapDispatchToProps) {
  // eslint-disable-next-line no-unused-vars
  return function (WrappedComponent) {
    return function (props) {
      const [_, forceUpdate] = useState(0)
      const { dispatch, getState, subscribe } = useContext(StoreContext)

      // 计算需要注入的公共状态和派发方法
      const stateProps = mapStateToProps?.(getState()) ?? {}

      let dispatchProps = {}

      if (typeof mapDispatchToProps === 'function') {
        dispatchProps = mapDispatchToProps(dispatch)
      } else if (Object.values(mapDispatchToProps).every(item => typeof item === 'function')) {
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch)
      }

      // 订阅store，当store发生变化时，强制更新组件
      useEffect(() => subscribe(() => forceUpdate(Date.now())), [subscribe])

      return (
        <WrappedComponent
          {...props}
          {...stateProps}
          {...dispatchProps}
        />
      )
    }
  }
}
```



---

----

```jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

// 模拟实现bindActionCreators => bindActionCreators(<action creators对象>, dispatch)
export function bindActionCreators(actionCreators, dispatch) {
  return Object.keys(actionCreators).reduce((boundActionCreators, key) => {
    boundActionCreators[key] = (...args) => dispatch(actionCreators[key](...args))
    return boundActionCreators
  }, {})
}

// 创建上下文对象，用于在组件中传递store
const StoreContext = createContext()

// 模拟实现 Provider 组件
export function Provider({ store, children }) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

// 模拟实现connect方法
export function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    const ConnectedComponent = function(props) {
      const [, forceUpdate] = useState(0)
      const store = useContext(StoreContext)

      if (!store) {
        throw new Error('Component must be wrapped with Provider')
      }

      const { dispatch, getState, subscribe } = store

      const stateProps = useMemo(
        () => mapStateToProps?.(getState()) ?? {},
        [getState()]
      )

      const dispatchProps = useMemo(() => {
        let props = {}
        if (typeof mapDispatchToProps === 'function') {
          props = mapDispatchToProps(dispatch)
        } else if (mapDispatchToProps && typeof mapDispatchToProps === 'object') {
          props = bindActionCreators(mapDispatchToProps, dispatch)
        }
        return props
      }, [dispatch])

      const handleStoreChange = useCallback(() => {
        forceUpdate(Date.now())
      }, [])

      useEffect(() => {
        const unsubscribe = subscribe(handleStoreChange)
        return () => unsubscribe()
      }, [subscribe, handleStoreChange])

      const mergedProps = useMemo(
        () => ({
          ...props,
          ...stateProps,
          ...dispatchProps
        }),
        [props, stateProps, dispatchProps]
      )

      return <WrappedComponent {...mergedProps} />
    }

    ConnectedComponent.displayName = `Connect(${
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`

    return ConnectedComponent
  }
}
```

