单选框（Radio Button 一旦被选中，无法直接取消，除非选择其他单选框。通常用于多个互斥选项的选择。



## 单个单选框

`v-model` 与 `value` 的匹配关系:

- 在 `input` 类型为 `radio` 的单选框中，`v-model` 的状态值会与 `value` 属性进行匹配。
- 当 `value` 属性的值与 `v-model` 状态值保持一致时，对应的单选框会被选中。
- 如果没有保持一致，则该单选框不会被选中。

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex3.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


默认绑定值:

- 如果单选框没有设置 `value` 属性值，那么默认绑定的状态值将会是 `null`。

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex4.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


::: details 原生实现伪代码

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex6.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::



## 单选框组

在 Vue 中，通过 `v-model` 绑定同一个状态值的多个单选框会组成一组，这一组中只能有一个单选框被选中。

每当选中一个单选框时，`v-model` 绑定的状态值会变成该单选框的 `value`

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex5.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



::: details 原生实现伪代码

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex7.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
:::

