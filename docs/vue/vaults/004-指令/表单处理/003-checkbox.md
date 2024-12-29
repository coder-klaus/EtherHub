复选框（Checkbox）即使只有一个，也可以被选中或取消。通常用于多个独立选项的选择。这是他和radio button最大的区别



## 单个复选框 

在 Vue 中，单个复选框（Checkbox）使用 `v-model` 绑定的状态值通常是布尔类型（`true` 或 `false`）。

当状态值为 `true` 时，复选框被勾选；为 `false` 时，复选框不被勾选。

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex8.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


如果绑定的状态值不是布尔类型，Vue 会自动将其转换为布尔类型，然后再进行后续处理。

理论上，对于单个单选框，value属性值其实可以省略不写。


<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex9.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


在Vue.js中，对于单选的`<input type="checkbox">`，可以使用`true-value`和`false-value`属性来控制其选中和未选中时对应的状态值。

```html
<input type="checkbox" v-model="isChecked" true-value="yes" false-value="no">
```

在这个例子中，如果checkbox被选中，`isChecked`的值将会是`"yes"`；如果未选中，`isChecked`的值将会是`"no"`。

这就允许你在选中和未选中时绑定自定义的值，而不仅仅是布尔值`true`和`false`。



::: details 原生实现伪代码

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex10.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::



## 复选框组

在 Vue 中，通过 `v-model` 绑定一组复选框时，通常使用数组来存储选中的值

如果对应复选框被选中，对应复选框的 `value` 值会被添加到数组中，表示选中的选项。

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex11.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



::: details 原生实现伪代码

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex14.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::