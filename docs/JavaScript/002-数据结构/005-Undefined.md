## undefined

`undefined` 类型只有一个值，就是 `undefined`。

当声明一个变量但未初始化时，它的默认值是 `undefined`。

访问对象中不存在的属性时，返回值也是 `undefined`。

```js
const und;
const unde = undefined;
console.log(und === unde); // 输出: true
```



**建议**：

- 在定义变量时，尽量对其进行初始化，而不是依赖默认的 `undefined`。
- 不推荐显式地将变量赋值为 `undefined`。



## `void` 操作符

- 在 ES3 之前，`undefined` 可以被重新赋值，因此为了确保获取 `undefined`，通常使用 `void 0`。
- `void` 表达式的结果永远是 `undefined`。
- 在现代浏览器中，这个问题已经不存在，`undefined` 不再是可变的。在代码中尽量避免使用 `undefined` 作为初始值，除非有明确的理由。

```javascript
let num = 0;
let bool = false;
let str = '';

// 不推荐的用法
let und = undefined; // 不推荐
```



## nullish值

`nullish`值有两个：

+ `undefined`
+ `null`