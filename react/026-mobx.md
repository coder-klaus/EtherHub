MobX 是一个简单且可扩展的状态管理工具。功能类似于redux

| redux                                                        | mobx                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Redux 强调“数据不可变”，即不能直接修改原数据，而是需要用新的数据替换旧数据。<br />这种不可变性可以提高数据的可预测性，但也增加了开发成本 | MobX 的数据是响应式的，通过 Proxy 实现，允许直接修改原数据。<br />修改数据后，视图会自动更新，开发体验更加轻松。 |
| 在处理异步操作时，Redux 通常需要依赖中间件，比如 redux-thunk 或 redux-saga | MobX 则无需额外的中间件，直接支持异步操作，使用起来更加方便。 |
| Redux 的强约束和明确的工作流程更适合大型多人协作的项目，因为统一的规则可以减少团队协作中的沟通成本<br />但也需要编写大量的样板代码「 模板代码 」 | MobX 的灵活性则更适合简单或规模较小的 React 项目。<br />如果项目规模不大，用 MobX 可以省去大量样板代码，提高开发效率。 |



## 版本

+ `MobX 4` => 使用Stage2版本的装饰器语法 + `Object.defineProperty` 来实现数据劫持
+ `MobX 5` => 使用Stage2版本的装饰器语法 + `Proxy` 来实现数据劫持
+ `MobX 6` => `Proxy` 来实现数据劫持 「 放弃使用装饰器语法 」



## 依赖库

1. `mobx` —— MobX 的核心库。
2. `mobx-react` 或 `mobx-react-lite` —— 用于连接 React 和 MobX 的库。
   + `mobx-react` => 即支持类组件，也支持函数组件
   + `mobx-react-lite` => 轻量版本的`mobx-react` => 只支持函数组件，不再执行类组件



## 核心概念

1. **observable**：用于定义状态。
   + 将状态通过`Proxy`进行劫持，实现响应式
2. **action**: 修改状态的方法 => 如果我们需要更新状态，就必须通过 `action` 来完成
   + redux中action是一个含有type属性的对象
   + 而mobx中的action必须是一个函数

3. **computed**: 状态对应的计算属性
   + 如果我们有一些状态，希望基于这些状态计算出新的值，就可以使用 `computed`
   + `computed` 也会对计算结果进行缓存，

总结来说，`action` 用于修改状态，状态更新后会触发计算属性的重新计算，最终页面会根据新的状态重新渲染。

+ 属性需要被定义为 `observable`，这样它才能成为可观察的状态
+ 方法需要被定义为 `action`，这样它才能安全地修改状态

**副作用**指的是那些不是由你直接触发的，而是因为你修改了状态后，系统根据状态的变化**自动间接触发**的哪些行为。所以在这里因为修改状态后导致组件自动更新，因此组件更新就可以被认为是对应的副作用

```js
// /src/store/counter.js
import { makeObservable, action, observable } from 'mobx';

// mobx 中状态是类
class Counter {
  count = 0;

  constructor() {
    // 使用 makeObservable 将状态变为可观察的「 响应式的 」
    makeObservable(this, {
      count: observable, // 将状态变成响应式的
      increment: action, // 指定方法为action方法
      decrement: action,
      reset: action,
    });
  }

  increment() {
    // mobx 状态经过了代理和劫持，无需考虑数据不可变性，直接修改即可
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

// 每new一次，就是全新的store实例，是独立的公共状态容器
// 所以直接导出实例，以实现单例模式。避免公共状态存储混乱
export default new Counter();
```

```jsx
import counterStore from './store/counter'
import { observer } from 'mobx-react'

// observer是一个高阶函数
// + 实现了参数组件和对应状态之间的关联 => 类似于connect => 功能是让组件变成响应式的，可以在状态更新时，自动使用最新状态重新渲染
// + 内部会自动对参数组件调用memo，无需在显示的调用memo
const App = observer(() => {
  return (
    <>
      <h1>{counterStore.count}</h1>
      {/*
        注意:
           + mobx中状态是通过类的属性和类的方法来定义的，所以必然会涉及到this问题
           + 调用时，action方法中的this必须是store实例，所以不能直接调用，需要使用箭头函数
      */}
      <button onClick={() => counterStore.increment()}>+</button>
      <button onClick={() => counterStore.decrement()}>-</button>
      <button onClick={() => counterStore.reset()}>reset</button>
    </>
  )
})

export default App
```



## 修正this指向

```js
import { makeObservable, action, observable } from 'mobx';

class Counter {
  count = 0;

  constructor() {
    // 调用<方法>.bound 后，方法中的this就是store实例
    // 此时在组件中使用时，就可以直接解构并使用
    makeObservable(this, {
      count: observable,
      increment: action.bound,
      decrement: action.bound,
      reset: action.bound,
    });
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

export default new Counter();
```

```jsx
import counterStore from './store/counter'
import { observer } from 'mobx-react'

const App = observer(() => {
  const { count, increment, decrement, reset } = counterStore
  return (
    <>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>
    </>
  )
})

export default App
```



## 计算属性

```js
import { makeObservable, action, observable, computed } from 'mobx';

class Counter {
  count = 0;

  constructor() {
    makeObservable(this, {
      count: observable,
      increment: action.bound,
      decrement: action.bound,
      reset: action.bound,
      // 标记为计算属性
      doubleCount: computed
    });
  }

  // 计算属性只能是getter方法
  // + 在首次使用时被计算一次
  // + 之后只有在依赖的值发生变化时，才会重新计算
  get doubleCount() {
    return this.count * 2;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

export default new Counter();
```

```js
import counterStore from './store/counter'
import { observer } from 'mobx-react'

const App = observer(() => {
  const { count, increment, decrement, reset, doubleCount } = counterStore
  return (
    <>
      <h1>{count}</h1>
      <h2>{doubleCount}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>
    </>
  )
})

export default App
```



## makeAutoObservable

`makeAutoObservable`是 `makeObservable` 的增强版:

- 它会自动将类实例的属性（例如 `count`）变为 observable。
- 它会将 getter（例如 `doubleCount`）变为 computed。
- 它会将方法（例如 `increment`、`decrement`、`reset`）绑定到实例上

```js
import { makeAutoObservable } from 'mobx';

class Counter {
  count = 0;
  reverseCount = 0;

  constructor() {
    // 当前实例和实例的第一层属性都会被转换为observable属性 「 不会进行深度转换 」
    makeAutoObservable(this, {
      reverseCount: false
    }, {
      autoBind: true
    })
  }

  get doubleCount() {
    return this.count * 2;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

export default new Counter();
```



```js
import counterStore from './store/counter'
import { observer } from 'mobx-react'
import { PureComponent } from 'react'

// 之所以不直接导出 observer(App) 是因为 React HMR插件在进行HMR时要求对应文件仅导出一个非匿名组件，否则其HMR功能可能会出现问题
const App = observer(class extends PureComponent {
  render() {
    return (
      <>
        <h1>{counterStore.count}</h1>
        <button onClick={counterStore.incrementAsync}>+</button>
      </>
    )
  }
})

export default App
```



## 自动监听

无论是`autorun`还是`reaction` 都只是浅层监听，并无法设置深度监听

### autorun

```js
import { autorun, makeAutoObservable } from 'mobx';

class Counter {
  count = 0;

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true
    })
  }

  get doubleCount() {
    return this.count * 2;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

const counter =  new Counter();

// 实现类似于watchEffect的效果
// 默认会自动执行一次，之后每次数据发生变化时都会自动触发 => 会自动收集依赖
// 只会监听浅层依赖
// + 如果监听counter => 只有counter的改变才会触发回调，counter.count的改变并不会触发回调
autorun(() => {
  console.log('counter.count', counter.count);
})

export default counter;
```



### reaction

```js
import { makeAutoObservable, reaction } from 'mobx';

class Counter {
  count = 0;

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true
    })
  }

  get doubleCount() {
    return this.count * 2;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

const counter =  new Counter();

// 类似于vue的watch 但是无法设置 immediate 和 deep
// 第一个是getter函数，函数可以返回 任何类型的值（包括数组、对象、基本属性等）
// + 会监听返回的observe属性，但是observ属性值如果是对象，其中的二层属性将不会被监听 「 deep的值为false 」
reaction(
  () => counter.count,
  (newValue, oldValue) => {
    console.log('counter.count', newValue, oldValue);
  }
)

export default counter;
```



## 异步处理

- MobX 的状态修改可以直接通过属性赋值（例如 `this.count++`）来完成，但如果需要将多次状态修改合并为一个事务（批处理更新），则需要通过 `action` 或 `runInAction` 来显式地声明事务。
- 在严格模式下（通过 `enforceActions: "always"` 开启），所有状态的修改必须通过 `action` 来完成。这是为了确保状态的修改是有意的，并且符合 MobX 的最佳实践。
- 在异步操作中，事务的作用尤为重要。因为异步操作的回调（例如 `setTimeout` 的回调）通常会在事务结束后执行，因此需要显式地开启一个新的事务（通过 `action` 或 `runInAction`）。

```js
import { makeAutoObservable } from 'mobx';

class Counter {
  count = 0;
  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true
    })
  }

  // 该方法会被自动识别为action
  increment() {
    this.count++;
  }

  // 异步更新方法
  incrementAsync() {
    setTimeout(() => {
     // 必须通过同步action来修改对应方法  
     this.increment()
    }, 1000)
  }
}

const counter =  new Counter();

export default counter;
```

```js
import { makeAutoObservable, runInAction } from 'mobx';

class Counter {
  count = 0;
  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true
    })
  }

  increment() {
    this.count++;
  }

  incrementAsync() {
    setTimeout(() => {
      runInAction(() => {
        this.count++
      })
    }, 1000)
  }
}

const counter =  new Counter();

export default counter;
```



## 模块化

MobX 支持多 store，每个模块都可以有自己的 store。最终，我们可以通过一个根 store 来统一管理这些子 store

::: code-group

```js [模块文件]
import { makeAutoObservable } from "mobx"

class User {
  age = 18
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  addAge() {
    this.age++
  }
}

export default new User()
```

```js [store/index.js => store出口文件]
import counterStore from './counter'
import userStore from './user'

/* 手动进行模块化管理 */
const store = {
  count: counterStore,
  user: userStore
}

export default store
```

```js [store/StoreContext.js]
import { createContext } from 'react'
import store from './index'

// 创建上下文 => 设置默认值
// 这样只要非 context的后代组件如果需要消费store时，就会自动采用对应默认值
export default createContext(store)
```

```js [组件]
import { useContext } from 'react'
import { observer } from 'mobx-react'
import StoreContext from '../store/StoreContext'

const User = observer(() => {
  const { user: { age, addAge } } = useContext(StoreContext)
  return (
    <>
      <h2>{age}</h2>
      <button onClick={addAge}>+</button>
    </>
  )
})

export default User
```

:::

