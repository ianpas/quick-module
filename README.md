# 项目简介
这个项目主要是想解决以下三个问题：

* 使用typescript开发快应用
* 探索view层单元测试方案
* 改进快应用组件复用方式
  
最终项目的输出应该是一个命令行工具，类似tsc(typescript compiler)。

# 翻译流程

程序的输入为tsx文件，输出为ux和js文件，其中的翻译流程如下：

* 将tsx文件翻译为jsx文件，主要是处理组件命名：

   * 在jsx中处理引入组件的名字，将组件名，比如TodoItem变为todo-item，因为按照jsx的约定，自定义的组件要以大写字母开头，而且用连字符会报错。

   * 在import部分处理组件的名字，将组件名，比如TodoItem变为todo_item，因为快应用中组件名约定是类型todo-item。这里不使用连字符，而是使用下划线，是因为如果使用连字符，那么它就不是合法的标识符，生成的jsx就会有语法错误。
<br>

* 从jsx文件中提取js代码并生成对应的js文件。主要是移除template方法，还有就是删除import css和import ux的代码，因为js中不需要这些import，这些import是用于生成ux文件中的import标签（引入ux组件）和style标签（引入样式文件）的。
<br>

* 预处理jsx文件，将jsx中不符合快应用的写法，比如绑定回调函数的时候：onclick={this.handleClick} 翻译为 onclick="handleClick"。
<br>

* 从预处理后的jsx代码中提取template函数的返回部分，并使用这个字符串生成其所描述的vdom。
<br>

* 将vdom翻译成快应用中的template标签部分。

* 将import css和import ux部分的代码转换为快应用中引用样式和组件的标签。生成ux文件中的script标签，这个标签引用之前翻译生成的js文件。