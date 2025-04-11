`this.setState(partialState, callback)`

+ partialState => react支持部分状态改变
+ callback => 状态和视图都更新完成后回调 => 换句话说，该回调比`componentDidUpdate`回调还要晚



```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
  state = {
    x: 0,
    y: 0,
    z: 0
  }

  render() {
    const { x, y, z } = this.state

    return (
      <>
        <div>{x} - {y} - {z}</div>
        <button onClick={() => this.change()}>change</button>
      </>
    )
  }

  change() {
    this.setState({
      x: 1
    }, () => {
      // 只有在指定的状态更新完成之后，才会触发该回调
      console.log('setState的回调') // 后输出
    })
  }

  componentDidUpdate() {
    // 任意状态改变，除非界面刷新后，都会触发该回调
    console.log('componentDidUpdate') // 先输出
  }
}

export default App
```

```jsx
import React, { Component } from 'react'

export class App extends Component {
  state = {
    x: 0,
    y: 0,
    z: 0
  }

  render() {
    const { x, y, z } = this.state

    return (
      <>
        <div>{x} - {y} - {z}</div>
        <button onClick={() => this.change()}>change</button>
      </>
    )
  }

  change() {
    this.setState({
      x: 1
    }, () => {
      // SCU返回false，状态和后续生命周期都不会被修改和回调
      // 但是setState的callback依旧会被执行 => 类似于vue的$nextTick
      console.log('setState的回调')
    })
  }

  shouldComponentUpdate() {
    return false
   }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }
}

export default App
```



`setState`是异步操作方法。如果`setState`是同步的话，必然需要状态修改后，执行整套UI更新流程，触发对应的生命周期。而短时间内多次触发`setState`，如果同步执行必然是十分耗费性能的。

在同一事件循环阶段内，所有的 `setState` 调用都会被收集起来，放入更新队列中等待处理。React 的批量更新机制会在当前事件循环阶段结束时，合并这些状态更新并触发一次统一的渲染。

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
  state = {
    count: 0
  }

  render() {
    return (
      <>
        <div>{ this.state.count }</div>
        <button onClick={() => this.add()}>add</button>
      </>
    )
  }

  add() {
    this.setState({
      count: this.state.count + 1
    })

    this.setState({
      count: this.state.count + 1
    })

    this.setState({
      count: this.state.count + 1
    })

    /*
      同步执行，遇到setState加入update
      最终得到如下updater 「 伪代码 」
      
      updater = [
        { count: this.state.count + 1},
        { count: this.state.count + 1},
        { count: this.state.count + 1}
      ]
      
      但此时this.state.count的值还没有更新，所以实际存入的任务分别为
      
      updater = [
        { count: 0 + 1},
        { count: 0 + 1},
        { count: 0 + 1}
      ]
      
      此时react才会对updater进行批处理「 patch updater 」
			所以点击按钮后，界面渲染的值为1，而不是3
    */
  }
}

export default App
```

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
  state = {
    count: 0
  }

  render() {
    return (
      <>
        <div>{ this.state.count }</div>
        <button onClick={() => this.add()}>add</button>
      </>
    )
  }

  add() {
    this.setState({
      count: this.state.count + 1
    })

    // 此时同步代码执行完毕，执行一次状态和界面更新

    setTimeout(() => {
      // 1s后，异步代码执行完毕，执行一次状态和界面更新
      this.setState({
        count: this.state.count + 1
      })
    }, 1000)

    // 所以最终界面渲染出的值为2，不是1
  }
}

export default App
```



在 React 18 中，不论是谁、不论在哪个地方执行 `setState`，它的状态更新都是异步的



在 React 18 之前，如果是在合成事件中，或者是在生命周期函数中，去操作 `setState`，它是异步的。

但是如果 `setState` 出现在其他异步操作中，比如说定时器或者手动获取 DOM 元素的事件绑定中，它是同步的

即React18之前，React自己管控中，`setState`是异步的，不是自己管控的时候，`setState`是同步的



## flushSync

```jsx
import React, { PureComponent } from 'react'

// flushSync是react-dom中的不是react中的，而是react-dom中的
import { flushSync } from 'react-dom'

export class App extends PureComponent {
  state = {
    x: 10,
    y: 5
  }

  render() {
    return (
      <>
        <button onClick={() => this.add()}>add</button>
      </>
    )
  }

  add() {
    this.setState({ x: this.state.x + 1 })

    // flushSync之前的状态更新和 flushSync回调中的状态更新 会被放入同一个状态更新队列
    // flushSync的回调执行完毕后，会立即刷新队列 => 立即触发一次同步更新，把所有的更新批处理完成
    // 所以flushSync之后可以获取到最新的状态值
    flushSync(() => {
      this.setState({ y: this.state.y + 1 })
    })

    console.log(this.state.x + this.state.y) // 17 => 不是15
  }
}

export default App
```

```jsx
import React, { PureComponent } from 'react'
import { flushSync } from 'react-dom'

export class App extends PureComponent {
  state = {
    x: 10,
    y: 5
  }

  render() {
    return (
      <>
        <button onClick={() => this.add()}>add</button>
      </>
    )
  }

  add() {
    this.setState({ x: this.state.x + 1 })
    this.setState({ y: this.state.y + 1 })

    // flushSync的回调是可以省略的
    flushSync()

    console.log(this.state.x + this.state.y) // 17
  }
}

export default App
```

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
  state = {
    count: 0
  }

  render() {
    console.log('render')

    return (
      <>
        <div>{ this.state.count }</div>
        <button onClick={() => this.add()}>add</button>
      </>
    )
  }

  add() {
    for (let i = 0; i < 20; i++) {
      // setState参数如果是函数，参数为状态更新后的最新state
      // setState方法需要返回需要修改的状态对象
      // 也就是说参数回调为 prevState => partialState
      // 所以本例中，点击按钮后，render只执行了一次，但是count的值变为了20
      this.setState(({ count }) => ({ count: count + 1 }))
    }
  }
}

export default App
```

