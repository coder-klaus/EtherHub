传统的 CSS 样式优先级由以下几个因素决定：

- **重要性**（`!important`）
- **特异性**（选择器的权重）
- **源顺序**（样式在 CSS 文件中的定义顺序）

CSS 层在此基础上引入了一个新的维度：**层的优先级**

- **显式层优先级**：显式定义的层优先级高于匿名层。
- **层定义顺序**：显式层的优先级由其定义的先后顺序决定，后定义的层优先级更高。
- **选择器特异性**：在同一层中，选择器特异性仍然决定样式的优先级。
- **重要性**：`!important` 的优先级最高，会覆盖层的优先级。



常见的层级划分

- `reset` 层用于存放重置样式。
- `base` 层用于存放基础样式。「 设置元素的样式, 如`a`、`div` 」
- `components` 层用于存放组件样式。「 设置功能块的样式，如 `.card`、`.box` 」
- `theme` 层用于存放主题样式。



**定义 CSS 层**

```css
/* 同层，后面覆盖前面的，所以最终li颜色为红色 */
@layer reset {
  li {
    list-style: none;
  }
}

@layer base {
  li {
    color: skyblue;
  }
}

@layer theme {
  li {
    color: red;
  }
}
```



**匿名层**

```css
/*
  浏览器实现中，先设置具名层，再设置匿名层
  所以从表现上看，匿名层的样式优先级高于具名层
  最终li的文本颜色为红色
*/
li {
  color: red;
}

@layer base {
  li {
    color: black;
  }
}
```



**多层管理**

```css
/* 显示指定层级的优先级 */
/* 最终li字体颜色为 skyblue */
@layer reset, theme, base;

@layer reset {
  li {
    list-style: none;
  }
}

@layer base {
  li {
    color: skyblue;
  }
}

@layer theme {
  li {
    color: red;
  }
}
```



**嵌套层**

```css
/* 基础层 */
@layer base {
  /* 基础层中的嵌套层 */
  @layer typography {
    li {
      font-size: 16px;
      line-height: 1.5;
    }
  }

  @layer colors {
    li {
      color: skyblue;
      background: #f0f0f0;
    }
  }
}
```



**导入样式并分层**

```css
/* 导入样式，并对其进行层级管理 */
@import url('./style/reset.css') layer(base);
@import url('./style/theme.css') layer(theme);
```



**匿名显示层**

```css
@layer base {
    li {
      color: skyblue;
    }
  }

/* 匿名显示层，规则和普通命名层规则一致，但因为没有实际名称不好管理，所以不推荐使用 */
/* @layer <anonymous> */
@layer {
  li {
    color: red;
  }
 }
```





----

常见组名规则

为什么要layer

cotainer媒体查询

深拷贝