## useMemo

```jsx
import { useState, useMemo } from 'react'

function App() {
  const [num, setNum] = useState(0)
  const [double, setDouble] = useState(0)

  // 模拟计算属性 => 存在计算缓存
  // + 首次执行或依赖更新 => 重新计算值
  // + 其余情况，直接返回计算缓存值
  useMemo(() => setDouble(num * 2), [num])

  return (
    <>
      <div>{ num }</div>
      <div>{ double }</div>
      <button onClick={() => setNum(num + 1)}>+</button>
    </>
  )
}

export default App
```



## useCallback

`useCallback` 可以保证函数在组件更新时不会每次都重新创建。适用于函数类型props「属性值」，避免父组件更新导致新建函数引用，而导致子组件做出无意义更新  => 实现函数引用缓存

> 没有必要将所有函数都使用useCallback包裹，因为useCallback存在缓存查找功能，其所消耗的性能和新创建一个函数引用开销大差不差

```jsx
import { useState, useCallback, memo } from 'react'

// memo会自动对 props 进行浅比较，只有当 props 发生变化时，函数组件才会重新渲染。

// 如果同时使用memo和forwardRef需要memo(forwardRef(组件, ref))
// => 确保ref可以被正常传递
const Child = memo(({ handleClick }) => {
  console.log('Child Render')

  return <button onClick={handleClick}>Child</button>
})

function App() {
  const [num, setNum] = useState(0)

  // 无依赖，则不会重新渲染
  const handleClick = useCallback(() => {
    // 内部变量为第一个闭包中的变量值
    console.log('handleClick')
  }, [])

  return (
    <>
      <Child handleClick={handleClick} />
      <div>{ num }</div>
      <button onClick={() => setNum(num + 1)}>+</button>
    </>
  )
}

export default App
```



