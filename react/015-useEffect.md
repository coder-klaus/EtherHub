`useEffect` => 在函数组件中模拟生命周期

在 React 中，异步请求通常放置在 `useEffect` 中，而不是直接写在函数组件的顶层作用域。这是因为函数组件的顶层代码会在每次组件渲染时执行。如果异步请求直接写在顶层作用域中，每次组件渲染都会触发这个请求，而请求的结果可能会更新组件的状态（通过 `setState`），状态更新又会导致组件重新渲染，从而形成一个循环，最终可能导致 **无限渲染**。

通过将异步请求放置在 `useEffect` 中，可以控制请求的触发时机，例如仅在组件挂载时或依赖项变化时进行请求，而不是在每次组件渲染时触发。这样既避免了无限渲染问题，也提高了性能和代码的可维护性。

```jsx
// componentDidMount 和 componentDidUpdate
// 组件挂载和更新都会执行
useEffect(() => {
  console.log('num', num)
  console.log(document.getElementById('num'))
})
```

```jsx
// 可以被多次调用，加入数组并被依次回调
useEffect(() => {
  console.log('num', num)
})

useEffect(() => {
  console.log('num', num)
})
```

```jsx
// 参数二 => 依赖数组
// 如果依赖数组为空，则只会在组件挂载时执行一次 => componentDidMount => 不推荐 「 eslint存在警告 」
// 如果依赖数组不为空，则会在组件挂载时执行一次，并且在依赖数组中的值发生变化时执行 => componentDidUpdate
useEffect(() => {
  console.log('num', num)
}, [])
```

```jsx
// 首次渲染 + x的值或y的值发生改变 「 进行浅比较 」
useEffect(() => {
  console.log(x, y)
}, [x, y])

// 首次渲染 + z的值发生改变
useEffect(() => {
  console.log('z', z)
}, [z])
```

```jsx
useEffect(() => {
  // 返回清理函数 「 cleanup 」
  // => 当组件更新之后，当前callback执行前，会先执行之前闭包返回的清理函数
  // => 即上一个闭包准备被释放的时候，会执行该cleanup函数
  return () => {
    // 首次渲染 => 不执行
    // 修改 x 的值 => 执行 「 获取结果是上一个闭包中x的值 」
    // 卸载组件 => 执行

    // 例如 点击按钮 让x的值变成1
    // 但是在清理函数中，输出的结果是0
    console.log(x)
  }
}, [x])
```



在执行函数的时候，通过`mountEffect`方法将所有的`effect回调`依次加入`effect`队列中。

等组件挂载完毕后，再通过`updateEffect`方法依次从effect队列中取出满足执行条件的回调并依次执行

注意: 是先执行上一个闭包中的cleanup函数，执行完cleanup函数后，在执行effect回调



```jsx
// useEffect只能返回清理函数或者undefined，也就是effect回调无法和async一起使用
useEffect(() => {
 (async function() {
  const res = await fetchData()
  console.log(res)
 })()
}, [])
```



```jsx
import { useState, useEffect, useLayoutEffect } from 'react'

function App() {
  const [num, setNum] = useState(0)

  useEffect(() => {
    console.log('useEffect')
  })

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
  })

  // 执行流程: DOM创建完成 => useLayoutEffect => 界面渲染 => useEffect
  // useLayoutEffect会在界面渲染之前，执行所有的同步操作 「 不包含异步操作 」
	// 如果在effect回调中存在操作DOM，或触发回流或重绘操作的，适合useLayoutEffect，其余适合useEffect
  return (
    <>
      <div>{ num }</div>
      <button onClick={() => setNum(num + 1)}>+</button>
    </>
  )
}

export default App
```







