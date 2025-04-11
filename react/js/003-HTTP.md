## 常见请求方式

1. GET => 获取值
2. POST => 新值值
3. PUT => 整体替换值
4. PATCH => 替换部分值
5. DELET => 删除值
6. OPTION
   + 探测服务器支持的 HTTP 方法
   + CORS（跨域资源共享）预检请求
7. HEAD 
   + 类似于 GET，但只返回响应头，不返回响应体。
   + 用于检查资源的元信息（如文件大小、类型等）。
8. CONNECT  =>  用于建立隧道连接（通常用于 HTTPS）=> 用于代理服务器 => web开发不用
9. TRACE => 回显服务器收到的请求，通常用于诊断 => web开发不用

如果一个api系统没有仅仅使用GET 和POST ，而是根据情况正确使用对应请求方式就可以被称之为`RESTful API`



## 预检请求

当浏览器发起跨域请求时，如果满足以下条件之一，浏览器会自动发送 OPTIONS 请求：

- 请求方法是非简单方法

  - 简单方法是GET、POST、HEAD
  - 其余都是非简单方法

- 请求头包含非简单头

  - 含有以下中任意一个就不是简单请求头
    - `Authorization`
    - `Content-Type`（值为 `application/json` 或`application/xml`）
    - 自定义头（如 `X-Requested-With`）

- 默认情况下，跨域请求不携带请求凭据，如果请求携带了请求凭据「 即`credentials: include` 」

  则是非简单请求，需要发送预检请求



示例流程：

1. 浏览器发送 OPTIONS 请求作为预检。
2. 服务器返回允许的跨域规则（通过 `Access-Control-Allow-*` 响应头）。
3. 如果规则允许，浏览器会继续发送实际请求（如 GET、POST 等）。



预检请求包含以下头：

- `Origin` => 请求源
- `Access-Control-Request-Method` => 请求方法
- `Access-Control-Request-Headers` => 携带的请求头

如果服务器允许该跨域请求，会返回以下头：

- `Access-Control-Allow-Origin` => 允许处理的客户端域名
  - `*`表示全部域名
  - 一般值是一个具体的域名 「 如 `https://www.example.com` 」
    - 如果需要根据不同开发环境返回不同的域名，需要后端根据情况设置对应响应头
- `Access-Control-Allow-Methods` => 该接口可以处理的的请求方法
- `Access-Control-Allow-Headers` => 该接口可以处理的请求头
- `Access-Control-Allow-Credentials` => 是否可以携带凭据
  - 当 `credentials: include` 被设置时，服务器必须明确返回 `Access-Control-Allow-Credentials: true`，否则请求会失败，即使其他跨域规则匹配。



## 请求凭据

请求凭据就是客户端传递给服务端可以用来证明用户信息的字段

常见的请求凭据包括

+ Cookie
  + 如自定义Cookie => `x-access-token` 「 自定义cookie以x开头 」
+ 访问令牌 「 **Access Token** 」
  + 其中之一就是 JWT 「 **JSON Web Token** 」
  + 传递方式为 `Authorization: Bearer <token>`
  + `Bearer` 是最常见的令牌类型，一般用于`OAuth`认证
+ 自定义请求头
  + 例如 `X-Auth-Token`

> 在现代浏览器中定义自定义请求头和自定义cookie不需要以`x`开头
>
> 但依旧推荐通过`x-xxx`的形式和内置cookie进行区分



## OAuth协议

OAuth是一种授权认证协议，它的核心目标是让用户能够安全地授权第三方应用访问自己的资源，而无需直接暴露用户名和密码。

1. **用户选择授权内容**：
   用户通过授权页面选择允许第三方应用访问的范围（比如读取某些数据、修改某些信息等）。这种授权范围通常被称为“权限范围”（Scope）。
2. **服务器生成 Token**：
   授权服务器根据用户的选择生成一个临时的访问凭据，通常是一个 **Access Token**，并将其传递给第三方应用。这个 Token 是访问用户资源的唯一凭证。
3. **第三方使用 Token 访问资源**：
   第三方应用使用这个 Token 向资源服务器（通常是用户数据所在的服务器）发起请求，获取用户授权范围内的资源。
4. **无需用户名和密码**：
   用户不需要直接提供用户名和密码给第三方应用，这样可以避免用户敏感信息泄露的风险。Token 具有时效性和权限范围，过期后需要重新授权，进一步增强了安全性。



## 常见http状态码

| 状态码  | 名称                  | 含义                                            |
| ------- | --------------------- | ----------------------------------------------- |
| **200** | OK                    | 请求成功，服务器返回所需数据。 「 GET 」        |
| **201** | Created               | 请求成功，资源已被创建。「 POST 」              |
| **204** | No Content            | 请求成功，但无返回内容。 「 OPTION 」           |
|         |                       |                                                 |
| **301** | Moved Permanently     | 资源永久移动到新的 URL。<br />会更新请求的URL   |
| **302** | Found                 | 资源临时移动到新的 URL。<br />不会更新请求的URL |
| **304** | Not Modified          | 资源未修改，可使用缓存。                        |
|         |                       |                                                 |
| **400** | Bad Request           | 请求无效，通常是由于语法错误或参数错误。        |
| **401** | Unauthorized          | 未授权，需提供认证信息。                        |
| **403** | Forbidden             | 服务器拒绝请求，权限不足。                      |
| **404** | Not Found             | 请求资源不存在。                                |
| **405** | Method Not Allowed    | 请求方法不被允许。                              |
|         |                       |                                                 |
| **500** | Internal Server Error | 服务器内部错误，无法处理请求。                  |
| **502** | Bad Gateway           | 服务器作为网关或代理时收到无效响应。            |
| **503** | Service Unavailable   | 服务器暂时不可用（如过载或维护中）。            |
| **504** | Gateway Timeout       | 服务器作为网关或代理时未及时响应。              |