Reflect 是一个内置对象，提供了一些与 Object 上的方法对应的静态方法。它的设计目的是为了更方便地操作对象。

```js
const obj = { a: 1 };
console.log(Reflect.get(obj, 'a')); // 输出: 1
Reflect.set(obj, 'b', 2);
console.log(obj.b); // 输出: 2
```

