`v-model`绑定在`<select>`元素上，而不是`<option>`上



## 单选下拉列表

对于单选下拉列表，它的值会与选中的`<option>`的`value`属性对应。哪个`<option>`被选中，`<select>`的值就会更新为对应的`value`

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex12.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


::: details 原生实现伪代码

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex15.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::




## 多选下拉列表

对于多选下拉列表，`v-model`绑定的值是一个数组。当多个选项被选中时，对应的`option`的`value`值将会组成一个数组，绑定到相应的状态上

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex13.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



::: details 原生实现伪代码

<iframe src="https://codesandbox.io/embed/vz35l3?view=editor+%2B+preview&module=%2Findex16.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue表单处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::
