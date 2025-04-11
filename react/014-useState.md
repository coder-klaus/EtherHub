Hook组件 = 函数组件 + react hook api => 静态组件动态化



HOOK API 特点

1. 只能在函数中使用
2. 只能在函数顶层被同步调用



`useState` 允许我们在函数组件中使用状态

+ 一个状态，使用一个`useState`
+ 因为`useState`不支持像`setState`那样的部分状态更新

```jsx
import { useState } from "react"

function App() {
  // const [状态值, 状态更新方法] = useState(初始值)
  // 第一次渲染 状态值是初始值，状态更新方法是一个独立的函数
  // 后续渲染，状态值是之前更新后的值，但是每次状态更新方法都是全新的函数
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>add</button>
    </>
  )
}

export default App
```



类组件更新时，是走一系列生命周期钩子，然后调用render方法生成最新VDOM

函数组件更新时，是重新执行函数，创建一个新的执行上下文，并返回最新的VDOM



```js
let _currentState

// useState 实现伪代码
function useState(initialState) {
  if (_currentState === undefined) {
    _currentState = typeof initialState === 'function' ? initialState() : initialState
  }

  // 每次返回的状态更新方法都是新的方法
  function setState(newState) {
    if (Object.is(newState, _currentState)) return

    _currentState = typeof newState === 'function' ? newState(_currentState) : newState
    // 执行视图重新渲染逻辑
  }

  return [_currentState, setState]
}
```



```jsx
import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  function handleAdd() {
    setCount(count + 1)
    setTimeout(() => {
      // 界面显示1，控制台输出是0
      // 因为这个setTimeout是第一个渲染时的定时器，其对应上层作用域是第一次渲染的作用域，不是第二次渲染的作用域
      console.log(count)
    }, 1000)
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleAdd}>add</button>
    </>
  )
}

export default App
```



```jsx
import { useState } from "react"

function App() {
  const [age, setAge] = useState({
    name: 'Klaus',
    age: 23
  })

  function handleAdd() {
    // setCount不支持部分状态更新，所以需要浅拷贝原有状态并在其基础上进行修改
    setAge({
      ...count,
      age: count.age + 1
    })
  }

  return (
    <>
      <h1>{age}</h1>
      <button onClick={handleAdd}>add</button>
    </>
  )
}

export default App
```



`useState`的更新机制和`setState`中的更新机制是完全一致的

+ React18 => 全异步
+ 在 React 17 及以前，如果更新操作被放在合成事件或者生命周期函数中，它是异步的；但如果放在其他异步操作中，比如定时器或者手动绑定的事件中，它就是同步的。

如果一定要同步，也是通过`reactDOM`的`flushSync`方法



`useState`有内部优化机制，即如果新设置的状态值和旧的状态值完全一致，则会静默失效，因为没有更新的必要，也就是实现了类似PureComponent中SCU的逻辑 => 所以底层使用的还是浅比较

```jsx
import { useState } from "react"

function App() {
  const [count, setCount] = useState(10)

  function handleAdd() {
    setCount(10)
  }

  console.log('render')

  return (
    <>
      <h1>{count}</h1>
      {/* 点击按钮会发现，界面没有任何变化 => 如果状态值没有变化，更新就不会触发 */}
      <button onClick={handleAdd}>add</button>
    </>
  )
}

export default App
```

```jsx
import { useState } from "react"
import { flushSync } from "react-dom"

// 点击后，界面显示11, 控制台render输出2次
function App() {
  const [count, setCount] = useState(10)

  function handleAdd() {
    for (let i = 0; i < 10; i++) {
      flushSync(() => {
        // 无论循环多少次，这个count都是第一个闭包中的count值，也就是10
        setCount(count + 1)
      })
    }
  }

  // 点击后，count状态值由10变为11，控制台render输出1次
  // 后续发现新旧状态值一致，停止更新
  console.log('render')

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleAdd}>add</button>
    </>
  )
}

export default App
```

```jsx
import { useState } from "react"

// 点击后，界面显示20, 控制台render输出1次
function App() {
  const [count, setCount] = useState(10)

  function handleAdd() {
    for (let i = 0; i < 10; i++) {
      // 和 setState 一致, 可以传入函数
      // 函数的参数是上一次更改后的最新状态值
      setCount(count => count + 1)
    }
  }

  console.log('render')

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleAdd}>add</button>
    </>
  )
}

export default App
```

```jsx
const [total, setTotal] = useState(() => {
  // useState的初始值如果需要处理复杂的逻辑可以使用函数
  // 因为初始值设置只会在首次渲染时赋值，这就确保了重新渲染时无需执行重复冗余逻辑 => useState的初始值函数是惰性求值的
  let sum = 0

  for (let i = 0; i < 100; i++) {
    sum += i
  }

  // 需要返回新的状态值
  return sum
})
```











----

```jsx
import { useState } from "react"
import { flushSync } from "react-dom"

// 点击后，界面显示11, 控制台render输出2次
function App() {
  const [count, setCount] = useState(10)

  function handleAdd() {
    for (let i = 0; i < 10; i++) {
      flushSync(() => {
        // 无论循环多少次，这个count都是第一个闭包中的count值，也就是10
        setCount(count + 1)
      })
    }
  }

  // 点击后，count状态值由10变为11，控制台render输出1次
  // 后续发现新旧状态值一致，停止更新
  console.log('render')

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleAdd}>add</button>
    </>
  )
}

export default App
```

react fiber
