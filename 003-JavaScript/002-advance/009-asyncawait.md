```js
function asyncFn(res) {
  return new Promise(resolve => {
    setTimeout(() => resolve(res), 2000)
  })
}

// 如果一个异步依赖之前异步的结果 传统写法会导致回调地狱
asyncFn('第一次调用').then(res => {
  console.log(res)
  asyncFn('第二次调用').then(res => {
    console.log(res)
    asyncFn('第三次调用').then(res => console.log(res))
  })
})
```



解决方法

```js
function asyncFn(res) {
  return new Promise(resolve => {
    setTimeout(() => resolve(res), 2000)
  })
}

// 利用promise的then方法依旧会返回一个新的promise的特性
// 可以将嵌套调用 转换为 链式调用
asyncFn('第一次调用').then(res => {
  console.log(res)
  return asyncFn('第二次调用')
}).then('第二次调用').then(res => {
  console.log(res)
  return asyncFn('第三次调用')
}).then(res => console.log(res))
```



此时可以使用生成器，将异步调用和同步操作抽离

```js
function asyncFn(res) {
  return new Promise(resolve => {
    setTimeout(() => resolve(res), 2000)
  })
}

// 利用生成器函数来处理异步方法
function* fetchData() {
  const res1 = yield asyncFn(10)
  const res2 = yield asyncFn(20)
  const res3 = yield asyncFn(30)

  console.log(res1 + res2 + res3) // => 60
}

const generator = fetchData()

// generator.next().value 就是asyncFn 返回的那个promise对象
generator.next().value
  .then(res => generator.next(res).value)
  .then(res => generator.next(res).value)
  .then(res => generator.next(res).value)
  .catch(err => console.error(err))
```



此时，调用异步方法的逻辑就变成了重复逻辑，可以封装为自动化函数

```js
function asyncFn(res) {
  return new Promise(resolve => {
    setTimeout(() => resolve(res), 2000)
  })
}

// 利用生成器函数来处理异步方法
function* fetchData() {
  const res1 = yield asyncFn(10)
  const res2 = yield asyncFn(20)
  const res3 = yield asyncFn(30)

  console.log(res1 + res2 + res3) // => 60
}

execGenerator(fetchData)

function execGenerator(fn) {
  if (typeof fn !== 'function') {
    throw new Error('fn is not a function')
  }

  const generator = fn()

  function exec(res) {
    const { value, done } = generator.next(res)

    if (done) return
    value.then(res => exec(res))
  }

  exec()
}
```



ES6, 提供了对应的语法糖写法 `async + await` 

「 `async + await` 本质就是`promise + generator`的语法糖写法 」

```js
function asyncFn(res) {
  return new Promise(resolve => {
    setTimeout(() => resolve(res), 2000)
  })
}

// 这段代码就是上述示例的语法糖写法
async function fetchData() {
  const res1 = await asyncFn(10)
  const res2 = await asyncFn(20)
  const res3 = await asyncFn(30)

  console.log(res1 + res2 + res3) // => 60
}

fetchData()
```





## 异步函数

使用了`async`关键字的函数被称之为异步函数

1. 只有异步函数内部才能使用`await`
2. 异步函数的返回值会被转换为新的promise实例
   + 返回普通值，使用`Promise.reslove`包裹
   + 返回`promise`, 结果由返回的promise状态决定
   + 返回thenable对象，结果由thenable对象决定

```js
async function foo() {
  throw new Error('this is a error')
}

// 异步函数返回值会转换为promise实例，所以可以使用catch捕获其异常
foo().then(res => console.log(res))
  .catch(res => console.log(res.message))
```



### await

1. `await`后面跟着的是`promise`实例
2. 如果`await`后边不是`promise`实例，则使用`Promise.reslove`转换为`promise`实例
3. `await`会暂停函数，直到后边的`promise`实例状态变为`fulfilled`

```js
function fun() {
  return new Promise(resolve => {
    setTimeout(() => resolve('success'), 1000)
  })
}

async function foo() {
  // await后边 如果是一个Promise, 会等待到 Promise有结果后，才会继续往后执行代码
  // 如果是resolved 则会把结果赋值给res
  // 如果是rejected 则会抛出对应的异常
  //  + 可以在异步函数中使用 try-catch进行捕获
  //  + 如果异步函数中没有捕获，因为异步函数返回一个promise
  //    所以可以在foo().catch() 中进行捕获
  //  + 如果依旧没有捕获对应的异常，会一层层向上传递
  //    最终交给浏览器进行处理，浏览器会将对应的错误输出在console中
  const res = await fun()
  console.log(res)
}

foo()
```



await关键字只能使用在async函数内部，或ES模块的顶层

`使用在async函数内部`

```js
async function main() {
  const asyncMsg = Promise.resolve('hello world!')
  console.log(asyncMsg) // => hello world!
}

main()
```



`在ES模块顶层使用`

因为顶层await只能使用在ES模块中，所以需要进行特殊设置 

这是因为默认情况下`package.json`中`type`属性的值为`commonjs`

`方式一: 在package.json中设置type: module`

`方式二: 将需要开启顶层await的模块的后缀设置mjs`

`index.mjs`

```js
const asyncMsg = await Promise.resolve('hello world!')
console.log(asyncMsg) // "hello world!"
```

