ES5写法

```js
function asyncFn(count, resolve, reject) {
  if (count <= 0) {
    reject('count不能小于0')
  } else {
    // 使用定时器模拟异步请求
    setTimeout(() => {
      // 异步处理函数并不能马上得到对应的结果, 而是需要等待一定的时间后才会得到对应的处理结果
      // 因此需要传入回调函数，在异步任务处理完毕后，去执行回调函数中的逻辑
      resolve(count)
    }, 1000)
  }
}

asyncFn(100, count => console.log(count), err => {
  throw new Error(err)
})
```

这种设计没有统一官方规范，都是使用者自己定义

所以不同的人有不同的写法，为此社区存在[promises/A+](https://promisesaplus.com/) 规范用于对使用方式进行统一

自ES6开始，官方提供了Promise API，以提供官方异步解决方法



```js
// 异步任务的参数在函数参数列表中传入
function asyncFn(count = 0) {
  // 对应的成功和失败回调在异步函数内部返回一个Promise
  // 并在Promise中定义即可
  // resolve - 成功时候触发的回调
  // reject - 失败时候触发的回调
  return new Promise((resolve, reject) => {
    // Promise函数传入的回调被称之为executor函数
    // executor函数会在Promise执行的时候同步执行
    // 在executor函数内部再去编写对应的异步代码
    if ( count <= 0 ) {
      reject('count的值必须大于0')
    } else {
      setTimeout(() => {
        resolve(count)
      }, 3000)
    }
  })
}

// 当我们调用resolve回调函数时，会执行Promise对象的then方法传入的回调函数
// 当我们调用reject回调函数时，会执行Promise对象的catch方法传入的回调函数
// then方法 返回的也是一个Promise对象，所以可以进行链式调用
asyncFn(10)
  .then(count => console.log(count))
  .catch(err => { throw new Error(err) })
```



## 状态

![image.png](https://s2.loli.net/2022/06/30/ASmEnj4F8MBL7gu.png) 

Promise状态是单向不可逆的, 状态一旦改变就会被锁死，无法在进行任何修改

```js
function asyncFn(count = 0) {
  return new Promise((resolve, reject) => {
    resolve(count)
    console.log('-----')
    reject()

    /*
      =>
        ----
        10

      executor是同步执行的，所以会先输出 ----, 随后执行宏任务队列中的resolve方法，输出10
      Promise中的状态已经被转换，无法再次被改变，所以转换改变后的resolve和reject方法会静默失效
    */
  })
}

asyncFn(10).then(count => console.log(count))
           .catch(err => { throw new Error(err) })
```



## resolve不同值

+ 如果resolve传入一个普通的值(即基本数据类型和引用数据类型)，那么这个值会作为then回调的参数

+ 如果resolve中传入的是另外一个Promise，那么这个新Promise会决定原Promise的状态

+ 如果resolve中传入的是一个对象，并且这个对象有实现then方法(这种对象被称之为thenable对象)

  那么会执行该then方法，并且根据then方法的结果来决定Promise的状态

```js
function asyncFn() {
  return new Promise(resolve => {
    resolve([123, 222, 333])
  })
}

asyncFn().then(res => console.log(res)) // => [ 123, 222, 333 ]
```

```js
function asyncFn() {
  return new Promise(resolve => {
    resolve(new Promise((_, reject) => {
        reject('error message')
    }))
  })
}

asyncFn().then(res => console.log(res)).catch(err => console.log('error: ' + err))
// => error: error message
```

```js
function asyncFn() {
  return new Promise(resolve => {
    resolve({
      then(resolve, reject) {
        resolve('thenable msg')
      }
    })
  })
}

asyncFn().then(res => console.log(res)).catch(err => console.log('error: ' + err))
// => thenable msg
```





## 实例方法

### then

```js
function asyncFn() {
  return new Promise(resolve => {
    resolve('success')
  })
}

// then方法接受两个参数:
// 1. fulfilled的回调函数:当状态变成fulfilled时会回调的函数
// 2. reject的回调函数:当状态变成reject时会回调的函数
asyncFn().then(res => console.log(res), err => console.log(err)) // => success
```

```js
function asyncFn() {
  return new Promise(resolve => {
    resolve('success')
  })
}

// 多次调用，加入回调数组并依次回调
asyncFn().then(() => console.log('第一次调用'))
asyncFn().then(() => console.log('第二次调用'))
asyncFn().then(() => console.log('第三次调用'))
asyncFn().then(() => console.log('第四次调用'))
asyncFn().then(() => console.log('第五次调用'))
/*
  =>
    第一次调用
    第二次调用
    第三次调用
    第四次调用
    第五次调用
*/
```



`then`方法本身会将返回结果转换为一个新的`promise`实例, 对应规则和 `resolve`不同值 完全一致

```js
function asyncFn() {
  return new Promise(resolve => {
    resolve('success')
  })
}

// 1. 第一个then的状态是由asyncFn方法中的promise决定的

// 2. 第二个then方法的状态是由第一个then方法的状态所决定的
//    第一个then方法返回了undefined，所以返回的Promise实际等价于 Promise.resolve(undefined)
//    因此 第二个then方法的res的值为 undefined

// 3. 第三个then方法的状态是由第二个then方法的状态所决定的
//    第二个方法返回了 'then方法返回的结果'， 等价于 Promise.resolve('then方法返回的结果')
//    因此 第三个then方法的res的值为  'then方法返回的结果'
asyncFn().then(res => console.log(res)).then(res => {
  console.log(res)
  return 'then方法返回的结果'
}).then(res => console.log(res))
/*
  =>
    success
    undefined
    then方法返回的结果
*/
```



### catch

```js
function asyncFn() {
  return new Promise(resolve => {
    reject('error')
  })
}

asyncFn().then(res => console.log(res)).catch(err => console.log(err))
```

```js
function asyncFn() {
  return new Promise(resolve => {
    reject('error')
  })
}

// reject也可以多次回调，被纳入数组并被依次回调
asyncFn().catch(() => console.log('error 1'))
asyncFn().catch(() => console.log('error 2'))
asyncFn().catch(() => console.log('error 3'))
asyncFn().catch(() => console.log('error 4'))
asyncFn().catch(() => console.log('error 5'))
/*
  =>
    error 1
    error 2
    error 3
    error 4
    error 5
*/
```

```js
function asyncFn() {
  return new Promise(resolve => {
    resolve('success')
  })
}

asyncFn().then(() => {
  // 在then方法中抛出的异常，会被返回的Promise所捕获
  // 并将异常作为reject的参数被传入，即作为catch方法的参数被传入
  throw new Error('then中抛出的异常')
}).catch(err => console.log(err))
// catch方法返回的也是一个Promsie「 理论上也可以链式调用 」
.then(res => console.log(res))
/*
  =>
    Error: then中抛出的异常
    undefined
*/
```

```js
function asyncFn() {
  return new Promise((_, reject) => {
    reject('error')
  })
}

// promise抛出的异常会被逐个传递，直到被捕获处理或直接被浏览器捕获显示在控制台
asyncFn().then(res => console.log(res))
.then(res => console.log(res)).then(res => console.log(res))
.catch(err => console.log(err)) // => error
```

```js
function asyncFn() {
  return new Promise((_, reject) => {
    reject('error')
  })
}

// 每个promise调用链都是独立的，所以第一个链的错误只能被第一条链的catch捕获
// 因此建议每次调用时都在最后加上catch
asyncFn().then(res => console.log(res)) // error

asyncFn().then(res => console.log(res)).catch(err => console.log(err))
```

```js
function asyncFn() {
  return new Promise((_, reject) => {
    reject('error')
  })
}

// 普通try-catch只能捕获同步错误，所以本例依旧会在控制台抛出异常
// 如果需要捕获异步错误，需要使用catch或者 try-catch + await
try {
  asyncFn().then(res => console.log(res))
.then(res => console.log(res)).then(res => console.log(res))
} catch (err) {
  console.log(err)
}
```



### finally

+ 无论`promise`最终变成什么，都会调用`finally`
+ `finally`是无参的，返回值依旧是`promise`实例

```js
function asyncFn() {
  return new Promise((resovle, reject) => {
    resovle('success')
  })
}

// finally本身返回的也是一个promise
// 所以从理论角度来讲，可以一直链式下去
asyncFn().then(res => console.log(res))
  .catch(err => console.log(err))
  .finally(() => console.log('finally'))
```



## 静态方法