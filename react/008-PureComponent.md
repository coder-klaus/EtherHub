```jsx
import { Component } from 'react'

export default class App extends Component {
  state = {
    users: ['Alex', 'Steven', 'Jhon']
  }

  render() {
    const { users } = this.state

    return (
      <>
        <div>{users}</div>
        <button onClick={this.insertUser}>insert</button>
      </>
    )
  }

  insertUser = () => {
    this.state.users.push('Klaus')

    // Component 没有实现SCU，默认SCU返回true
    // 而setState在更新state同时会通知react更新界面
    // 所以即使state没有变化，react也会重新渲染
    this.setState({
      users: this.state.users
    })
  }
}
```

```jsx
import { PureComponent } from 'react'

// PureComponent 重写了shouldComponentUpdate => 如果显示编写SCU，会出现红色警告
// 会对props 和 state 的引用地址进行比较，改变了其中任意一个引用地址，SCU才会返回true
export default class App extends PureComponent {
  state = {
    users: ['Alex', 'Steven', 'Jhon']
  }

  render() {
    const { users } = this.state

    return (
      <>
        <div>{users}</div>
        <button onClick={this.insertUser}>insert</button>
      </>
    )
  }

  insertUser = () => {
    this.setState({
      users: [...this.state.users, 'Klaus']
    })
  }
}
```



在进行比较时，只会比较第一层的属性，这就是所谓的浅比较（shallow comparison）。它不会深入到对象的内部去看每一层的内容，而是只看第一层

```js
// 判断是否为对象 「 包含函数类型对象 」
function isObject(value) {
  return /^object|function$/.test(typeof value) && value !== null
}

function shallowEqual(obj1, obj2) {
  // 如果不是对象，直接比较值
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }

  // 如果两个对象的引用地址一致，直接返回true
  if (obj1 === obj2) {
    return true
  }

  const keys1 = Reflect.ownKeys(obj1)
  const keys2 = Reflect.ownKeys(obj2)

  // 如果两个对象的属性数量不一致，直接返回false
  if (keys1.length !== keys2.length) {
    return false
  }

  // 遍历obj1的属性，检查obj2中是否存在相同的属性
  for (let key of keys1) {
    // obj2中不存在obj1的属性，或者obj1和obj2的属性值不相等
    // Object.is() 用于比较两个值是否相等，与 === 的区别在于
    // 1. 可以正确比较NaN
    // 2. 可以正确比较正负0
    if (!Reflect.has(obj2, key) || !Object.is(obj1[key], obj2[key])) {
      return false
    }
  }
  return true
}
```

