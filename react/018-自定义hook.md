 函数的主要目的是将某些组件的逻辑提取出来，封装成一个可重用的函数

+ 本质内部使用的还是React HOOK api 

为了方便React和Lint工具进行识别我们自己定义的hook，自定义hook一般以`useXxxx`格式命名

+ 这是约定规则，不是强制规则

```jsx
import { memo, useState } from 'react'

// 自定义hooks，实现部分状态更新
// hook api只能在函数组件或自定义hook顶层作用域被同步调用
function useParticalState(initialState) {
  const [state, setState] = useState(initialState)

  const setPartialSetState = (partialState) => {
    setState(
      typeof partialState === 'function' ?
      ({ ...state, ...partialState(state) })
      : ({ ...state, ...partialState })
    )
  }

  return [state, setPartialSetState]
}

const App = memo(() => {
  const [state, setState] = useParticalState({
    name: '张三',
    age: 18
  })

  return (
    <div>
      <div>{ state.name }</div>
      <div>{ state.age }</div>
      <button onClick={() => setState({ name: '李四' })}>修改name</button>
      <button onClick={() => setState(({age}) => ({ age: age + 1 }))}>修改age</button>
    </div>
  )
})

export default App
```

