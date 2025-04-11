1. props 是只读对象 => 确保单向数据流 => 简化数据流向，方便后期维护

1. 通过 `Object.freeze` 实现只读冻结

1. 和`const` 一样, 限制的是props对象

   如果解构或者将某个属性赋值给另一个变量，将丢失只读特性
   
   + `let { name } = props` => 本质是组件内部定义了个局部变量`name`
   + 我们修改的其实是局部`name`属性值，而不是`props.name`对应的值
   + 所以并不违背props的只读特性



## 对象设置

> 是对对象规则的限制，不是对象成员规则的限制

+  `Object.freeze` 
  + 冻结对象
  + 不能改，不能增，不能删，不能劫持
  + 是浅层冻结
  + 通过`Object.isFrozen`检测对象是否被冻结
+ `Object.seal`
  + 密封对象 => 密封的意思就是把它封住，里面的东西你可以随意操作，但是你不能再往外进或者出。
  + 可修改，不可删除，不可新增，不能劫持
  + 通过`Object.isSealed`检测对象是否被密封
+ `Object.preventExtensions`
  + 阻止扩展 「 阻止新增属性 」
  + 不可新增，可修改，可删除，可数据劫持
  + 通过`Object.isExtensible`检测对象是否可扩展 「 可扩展返回true，否则返回false 」



即使限制了对象的规则，是否可以实际操作对应值还需要看对象成员规则的限制

例如，对象被密封了，理论上属性值是可以被修改的。但是如果对应属性的`writable`值为false时，对应的属性值也将无法被修改



## 规则校验

通过官方库[`prop-types`](https://www.npmjs.com/package/prop-types) => 早期和react核心库集成在一起, 后来因为职责分离，React15开始被拆分成了单独的包

```shell
pnpm add prop-types
```



### 默认值

**早期写法**

```jsx
function App(props) {
  return (
    <div>
      { props.name } --- { props.age }
    </div>
  )
}

// 设置默认值 => 如果传了值，那就以你传的值为主；如果没传值，那就以默认值为主
// 这是React18 及之前设置默认值的方法
App.defaultProps = {
  age: 18
}

export default  App
```

```jsx
// React18及以后 推荐使用解构默认值的方式设置默认值
function App({ name, age = 18 }) {
  return (
    <div>
      { name } --- { age }
    </div>
  )
}

export default  App
```





```jsx
// 导入类型工具对象 => 首字母大写 => 和普通对象进行区分
import PropTypes from 'prop-types';

function App(props) {
  return (
    <div>
      { props.name } --- { props.age }
    </div>
  )
}

// 默认值和类型校验 都通过静态属性 进行设置

// 类型校对 => propTypes是属性「 首字母小写 」
// 类型校验失败，prop依旧可以被获取并使用，只不过控制台会出现红色错误警告
App.propTypes = {
  // name 必须是字符串类型值，且是必传的
  name: PropTypes.string.isRequired,
  age: PropTypes.number
}

// 设置默认值 => 如果传了值，那就以你传的值为主；如果没传值，那就以默认值为主
// 这是
App.defaultProps = {
  age: 18
}

export default  App
```

```jsx
// 也可以通过函数结构的方式设置props的默认值
function App({ name, age = 18 }) {
  return (
    <div>
      { name } --- { age }
    </div>
  )
}

export default  App
```





```shell
optionalArray: PropTypes.array,
optionalBigInt: PropTypes.bigint,
optionalBool: PropTypes.bool,
optionalFunc: PropTypes.func, # 函数 是 func 不是 function
optionalNumber: PropTypes.number,
optionalObject: PropTypes.object,
optionalString: PropTypes.string,
optionalSymbol: PropTypes.symbol,

optionalNode: PropTypes.node, # 可以接收各种类型 「 字符串、数字、React 元素、数组、null、undefined等 」
optionalElement: PropTypes.element,  # 类型是JSX元素 「 用于对props.children属性进行校验 」

optionalEnum: PropTypes.oneOf(['News', 'Photos']), # 多个值中的任意一种
optionalUnion: PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.instanceOf(Message) # 传入值必须是Message的实例
]), # 多个类中的一种

optionalArrayOf: PropTypes.arrayOf(PropTypes.number), # 传入值必须是 number[]
```

> 自React19 开始 `prop-types`已经被官方移除，并推荐使用TypeScript来进行类型校对
>
> 1. 默认值使用ES6 解构 + 默认值
> 2. 类型校对 会静默失效





