## 网络请求方案

1. ajax
   + 只能用于浏览器，不支持node
   + 不支持promise => 需要手动封装
2. fetch
   + 用于替代ajax
   + 即可以在浏览器中使用，也可以在node中使用
   + 中断需要通过`AbortController`来实现
   + 无法直接设置超时时间，但可以通过`AbortController` 来模拟实现
3. axios
   + 第三方库
   + 浏览器基于ajax
   + node基于http模块



## 基本语法

1. fetch方法的返回结果是 Response实例

2. 在 `fetch` 中，只要服务器有反馈结果，无论状态码是多少，Promise 的状态都会是 `fulfilled`。

   只有在服务器没有任何反馈时，比如网络中断或请求超时，Promise 的状态才会是 `rejected`。

   而在 `axios` 中，只有服务器返回的状态码以 2 开头时，Promise 的状态才是 `fulfilled`，

   其他状态码都会被视为失败，Promise 的状态是 `rejected`。这是两者的本质区别。

```js
const <fetch promise实例> = fetch(<请求地址>, <配置对象>)
```

```js
// 1. response是一个Response实例对象
// 2. + 请求 httpbin1.org => 服务端不存在, 链接建立失败 => 报错
//    + 请求 httpbin.org/get => 返回200 => 正常执行
//    + 请求 httpbin.org/get1 => 返回404 => 返回结果异常，但链接建立成功 => 依旧是正常执行
const response = await fetch('https://httpbin.org/get')

// 可以获取请求状态和状态码
console.log(response.status, response.statusText)
// 请求状态码是否2xx 「 不包含3xx 」
console.log(response.ok)
// 是否方式了重定向
console.log(response.redirected)
// 请求url
console.log(response.url)
// 请求头 => Headers实例
console.log(response.headers)
// 请求体 「 是一个 ReadableStream（可读流） 」
console.log(response.body)
```

```js
async function fetchData() {
  const response = await fetch('https://httpbin.org/get')
  const res = await response.json()
  console.log(res)
}

fetchData()
```



### 配置对象

| 配置           | 说明                                   | 可选值 「 前面带*表示默认值 」                               |
| -------------- | -------------------------------------- | ------------------------------------------------------------ |
| method         | 请求方法                               | * GET , HEAD, DELETE, OPTIONS, POST, PUT, PATCH              |
| mode           | 跨域方式                               | no-cors, * cors, same-origin                                 |
| cache          | 是否使用浏览器缓存                     | * default, no-cache, reload, force-cache, only-if-cached     |
| credentials    | 是否携带资源凭证                       | * same-origin, include, omit                                 |
| headers        | 设置请求头                             | 普通对象 或 Header实例                                       |
| referrerPolicy | 用于设置`referrer`请求头对应的设置规则 |                                                              |
| body           | 请求体                                 | 只能用于支持请求主体的 HTTP 方法（如 `POST` 和 `PUT`）。<br />如果在不支持 `body` 的方法中使用它，比如 `GET` 请求，就会导致请求失败并报错 |
| signal         | 处理中断                               | 需要结合`AbortController`一起使用                            |



### credentials

`credentials` 有三个取值：

1. `same-origin`（默认值）：仅在同源请求中携带资源凭证。
2. `include`：无论是同源请求还是跨域请求，都会携带资源凭证。
3. `omit`：完全不携带资源凭证。



### cache

1. default：使用浏览器默认的缓存策略
2. no-cache:  每次请求都要验证缓存是否是最新的
   + 如果是则使用缓存，否则重新请求
3. reload: 禁用缓存
4. force-cache: 无论缓存是否过期，都强制使用缓存。如果缓存不存在，会请求新资源
5. only-if-cached: 强制使用缓存。如果缓存不存在，不会请求新资源



#### mode

用于控制是否允许跨域请求

+ cors => 允许跨域 「 完全允许 」+ 同源请求
+ no-cors => 允许跨域 「 只能是不会发生预检请求的跨域，且无法获取响应内容 」+ 同源请求
+ same-origin => 只能同源，不允许跨域



### body

#### 可取值

`body`可以传递的值类型

1. 普通文本字符串

   + 默认值
   + `Content-Type` 需要设置为 `text/plain` 「 不过一般为默认值，所以也可以不设 」

2. XML字符串

   + 基本不用
   + `Content-Type` 需要设置为`application/xml` 

3. JSON 字符串

   + `Content-Type` 需要设置为`application/json` 

4. URL 编码的字符串 

   +  例如: `key1=value1&key2=value2`

   + `Content-Type` 需要设置为 `application/x-www-form-urlencoded`

5. FormData对象数据

   + 用于提交 表单数据 或者 二进制数据「 文件 」
   + `Content-Type`的值会自动被设置为`multipart/form-data` 「 无需手动设置 」



#### 注意点

1. 在设置body时，不仅仅需要传递body，还需要设置正确的 `Content-Type`。 

   虽然不设置不会报错，但是为了方便后端解析，按规范推荐加上正确的`Content-Type`。

   只有确保 `Content-Type` 与 `body` 的数据格式一致，才能让服务器正确解析请求内容。

   同样在响应头中也存在`Content-Type`。这是服务端设置的，用于告诉客户端返回的数据格式

   

2. `fetch` 默认并没有提供类似 `axios` 中的 `params` 配置项，用于处理 `GET` 请求的问号传参（Query String）。如果我们需要通过问号传参将数据发送给服务器，就必须手动将参数拼接到 URL 的末尾

3. 如果body不是formData实例或普通字符串，会自动转换为字符串类型值后再进行传递。这是需要被禁止的



#### 解析方法

> 这些方法返回的实际上是一个 `Promise` 实例，而不是直接的结果值
>
> 因为需要等到所有数据加载完毕后，才能进行解析

- `json()`：将可读流解析为 JSON 对象。
- `text()`：将可读流解析为文本字符串。
- `formData()`：将可读流解析为表单数据。



`qs`是一个第三方库，可以将普通对象转换为urlencode格式字符串

```js
import qs from 'qs'

console.log(Qs.stringify({
  name: 'Klaus',
  age: 18,
  gender: 'male'
})) // name=Klaus&age=18&gender=male
```



```js
try {
  // 创建控制器
  const controller = new AbortController()

  // 通过signal关联控制器
  const response = await fetch('https://httpbin.org/get', {
    signal: controller.signal
  })

  // 中断请求
  // fetch没有超时时间设置，可以自己通过 AbortController 和 定时器 来模拟 timeout
  controller.abort()

  const res = await response.json()
  console.log(res)
} catch (e) {
  if (e.name === 'AbortError') {
    console.log('请求被中止')
  } else {
    console.log(e)
  }
}
```


