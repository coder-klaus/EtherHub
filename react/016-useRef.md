hook组件可以通过 `useRef` 和 `createRef` 去获取DOM元素

+ `createRef` 
  + 函数组件每次更新，都是全新执行上下文，都是全新ref对象

  + 可以在类组件中使用，也可以在函数组件中使用

  + 适用于类组件，因为类组件更新只是执行render方法，不会重新新建实例对象

+ `useRef`
  +  函数组件每次更新，都是全新执行上下文, 但他们ref对象都是同一个
  + 只能在函数组件中使用，不能在类组件中使用


```jsx
import { PureComponent, useEffect, useRef } from 'react'

class ClassChild extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      num: 0
    }
  }

  render() {
    return (
      <div>ClassChild</div>
    )
  }
}
function App() {
  const childRef = useRef(null)

  useEffect(() => {
    console.log(childRef.current)
  }, [])

  return (
    <ClassChild ref={childRef} />
  )
}

export default App
```

```jsx
import { createRef, useRef, useEffect, useState } from 'react'

let pre1 = null
let pre2 = null

function App() {
  const ref1 = createRef(null)
  const ref2 = useRef(null)
  const [num, setNum] = useState(0)

  useEffect(() => {
    if (!pre1) {
      pre1 = ref1
      pre2 = ref2
    } else {
      console.log(ref1 === pre1) // false
      console.log(ref2 === pre2) // true
    }
  })

  return (
    <>
      <div ref={ref1}>div1</div>
      <div ref={ref2}>div2</div>
      <button onClick={() => setNum(num + 1)}>{num}</button>
    </>
  )
}

export default App
```

```jsx
import { forwardRef, useEffect, useRef } from 'react'

const Child = forwardRef(function(props, ref) {
  // 如果使用了forwardRef, ref参数将会从props中被移除
  // 如果没有使用forwardRef，ref参数会作为普通prop存在于props对象中
  console.log(props)
  return <div ref={ref}>Child</div>
})

function App() {
  const el = useRef(null)

  useEffect(() => {
    console.log(el.current)
  })

  return (
    <div>
      <Child ref={el} />
    </div>
  )
}

export default App
```

```jsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const Child = forwardRef(function(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      name: 'Klaus'
    }
  })

  return <div ref={ref}>Child</div>
})

function App() {
  const el = useRef(null)

  useEffect(() => {
    console.log(el.current) // {name: 'Klaus'}
  })

  return (
    <div>
      <Child ref={el} />
    </div>
  )
}

export default App
```

