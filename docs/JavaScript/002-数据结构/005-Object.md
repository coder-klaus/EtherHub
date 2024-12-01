## Object

- **定义**：Object 类型是引用类型或复杂类型，保存的是数据在内存中的引用地址。

- **特点**：

  - 与原始类型不同，原始类型保存的是变量的数据值。
  - Object 可以表示一组数据，是多个相关变量的集合。

- **示例代码**：

  ```javascript
  // 使用花括号定义对象
  const user = {
    name: 'Klaus',
    age: 23
  };
  
  // 通过点语法获取对象属性
  console.log(user.name);
  
  // 通过中括号语法获取对象属性
  const key = 'name';
  console.log(user[key]);
  ```



### Null

- **定义**：Null 类型只有一个值，即 `null`，用于表示暂时未知的值。

- **使用**：

  - 通常用于初始化对象为空。
  - `null` 可以看作是一种特殊的对象。

- **示例代码**：

  ```javascript
  // 使用 null 初始化对象
  let obj = null;
  
  // 空对象初始化（不推荐）
  let obj = {};
  ```

- **注意事项**：

  1. `null` 指向的内存地址是 `0x0`，不会在堆内存中创建内容。
  2. 条件判断中，`null` 转为布尔值为 `false`，而 `{}` 转为 `true`，可能导致逻辑错误。
  3. 在JavaScript中，`null`被认为是特殊的对象，所以`typeof null => 'object'`