## 数据和状态

状态是一种特殊数据



状态需满足如下条件:

1. 参与界面渲染
2. 当数据改变时界面需要重新渲染



### 响应式状态

默认情况下，状态改变，需要手动通知数据进行重新渲染，「 React 」

但在某些特殊情况下，





## data

```md
@1 疑问：为哈在data中写的数据，在视图中可以直接访问？
 + 在data中构建的数据，会直接挂载到实例上，作为其私有属性
 + 所有在实例上挂载的属性，都可以直接在视图中使用！！
 
@2 疑问：为啥非要把数据写在data中？
 + 在data中编写的数据，是经过“数据劫持”的，它是响应式的数据「修改数据值，视图会自动更新」
 + 直接给实例设置的键值对「例如：vm.xxx=xxx」，不是响应式的！！
 真实项目中，建议把需要的数据都放在data并赋予初始值，让其成为响应式的数据！！
```

[![Edit 验证 Vue 数据响应性](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/j6jqdm) 





```md
先不说原理，先看表层特点
	+ 在data中写的数据，都会经历get/set的劫持处理「日后想判断一个数据是否为响应式的，就看其有没有被get/set劫持处理即可 --> 前提是在Vue2中」「 Vue3是proxy 」
	+ 所谓set劫持：就是当我们修改数据值的时候，会触发其set函数执行，在函数中不仅修改了数据值，而且还会通知视图重新渲染！
```

在控制台输出`vm`后，可以看到

![image-20241228144740825](https://s2.loli.net/2024/12/28/kbwTKoBjpHMGchz.png) 



整理到JS中

```md
/*
 对象成员的规则限制 
   Object.getOwnPropertyDescriptor([object], [key])
     查看对象某个私有成员的描述「查看规则限制」
     + configurable:true  是否可删除
     + enumerable:true  是否可枚举「可枚举：可以被for/in循环或者Object.keys迭代到的属性是可枚举的」
     + writable:true  是否可修改
     + value:10  成员的值
   Object.getOwnPropertyDescriptors([object])
     查看对象所有私有成员的规则描述！
 我们自己基于“常规手段”给对象设置的成员，其规则一般都是：可枚举、可删除、可修改的！
 但是浏览器内置的属性/方法，其规则一般都是：不可枚举、可删除、可修改的！
 ---------
 我们期望可以给现有成员修改规则，或者给对象新增一个成员（但是自己定义其规则）：Object.defineProperty
   Object.defineProperty([object],[key],{
     // 在这里可以设置相关的规则
   });
   关于规则的默认值「使用了defineProperty，但是我们还没有设置规则，其规则的默认值」
     + 成员之前不存在，我们是新增一个成员，则规则的默认值都是false
     + 成员之前存在，我们打算修改规则，没有改之前，成员之前的规则是啥还是啥
 ---------
 Object.defineProperty 还可以对对象中的某个成员做“数据劫持”！！
   + 一但成员被劫持(GET/SET)，在控制台输出的时候，成员的值显示“(...)”，对象下面有该成员的 get xxx/set xxx 标识；当点击...的时候，相当于获取成员值，会触发get劫持函数！！
   + 一但被劫持后，和规则中的 value & writable 属性相互冲突！！
---------
	Object.definePropertries可以定义多个
	只能获取自身属性，如果某个属性获取不了，则返回undefined
 */
```



```md
在“new Vue”阶段，Vue内部会处理很多事，其中有一件事：执行initState，在此方法执行中，又做了很多事情：
 initProps$1：初始属性
 initSetup
 initMethods：初始methods配置项中的信息
 initData：处理配置项中data中的数据信息的
 ...
------
initData中处理的事情
 + 把data中的数据挂载到实例上
 + 并且对data中的每一项数据进行数据劫持「基于 Object.defineProperty 进行GET/SET劫持，做劫持的目的是：当后续修改数据值的时候，会触发SET函数，在此函数中，不仅仅修改数据值，而且会通知视图更新，实现数据驱动视图的渲染，我们也把做了劫持的数据，称之为“响应式数据/状态”」
 + Vue内部会基于递归的方式，对data中的数据进行“深度”的监听和劫持「只处理对象(普通对象)和数组」
 + 如果对象被冻结了，那么其内部的每一个成员，将不再进行属性劫持
 + 对于新修改或者新增的内容，也要做数据劫持
 + 对于对象来讲，Vue会依次迭代其内部 “可枚举”、“非Symbol类型的” 的 “私有” 属性「因为其内部是基于Object.keys来获取对象的属性」，对每一个属性进行GET/SET劫持！ 
   --> 对于data这个对象，Vue内部也是基于Object.keys来获取其属性，所以，如果属性名是Symbol类型，或者属性是不可枚举的，则不会进行任何的处理「包含：不挂载到实例上、也不进行劫持」！！
 + 对于数组来讲，数组的每一项成员是数字索引，Vue内部并不会对每一项(也就是每个索引)做GET/SET劫持，它是给数组做了原型重定向，让数组先指向自己构建的原型对象「数组.__proto__ -> 自己构建的原型对象 -> Array.prototype」；
   在自己构建的原型对象上有7个方法：push/pop/shift/unshift/splice/sort/reverse
   我们以后基于这7个方法去修改数组中的信息，可以通知视图更新！！
 ----
 数据劫持的操作，发生在“new”这个阶段，此时在data中写的数据，才会被劫持；在“new”之后，手动设置的新对象成员，默认是不会被数据劫持的！！ ==> 建议：以后在项目开发中，所有需要的数据，先在data中进行声明（哪怕赋值初始值为null），最起码这样可以保证，这些数据先被劫持！！
 ---
 如果就不想事先在data中写好，就想后面慢慢加，我们可以基于 $set「Vue.prototype」 这个方法进行处理！！
   vm.$set([object], [key], [value])
   + 不能基于$set给vm实例对象和`vm.$data`设置属性
   		+ vm.$data本质也是挂载到vm上，所以也不可以
   		+ 静默失效
   + CASE1：对象&新增成员 --> 在新增成员的同时，给成员进行了GET/SET劫持，让其成为响应式数据，并且视图会立即更新一次！
   + CASE2：对象&修改之前的成员信息(此成员是非响应式的) --> 即便后续基于$set处理，也不会再让其变为响应式的了，而且即便改了值，视图也没有更新！
   + CASE3：数组 --> 基于$set进行操作，可以保证，按照索引修改数组信息的同时，让视图更新，但是不会对每一索引项做GET/SET劫持！！
   Vue.set === vm.$set // true
----
vm.$forceUpdate() 强制视图更新！！

面试题：有一个数组状态，我们想把第一项修改为1000，并且让视图更新，有哪些办法？
 @1 vm.arr.splice(0,1,1000)
 @2 vm.arr = ['我是新增的', ...vm.arr.slice(1)]
 		或者
    vm.arr.shift()
    vm.arr = [1000,...vm.arr]
 @3 vm.$set(vm.arr,0,1000)
 @4 vm.arr[0]=1000 后续一定要执行 vm.$forceUpdate()
 ....
```

[![Edit vue2 data拦截 伪代码](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/kkxgw4)

[![Edit Vue 数据响应性演示](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/8ktfd8) 

