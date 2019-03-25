# 项目简介
这个项目主要是想解决以下三个问题：

* 使用typescript开发快应用
* 探索view层单元测试方案
* 改进快应用组件复用方式

# 使用命令行工具

```
  npm i -g quick-module
  qmc <options> 
```
qmc: quick module compiler
## 命令选项
```
Options:
  -V, --version                     output the version number
  -c, --compile <file_name>         compile tsx file
  -w, --watch <file_name/dir_name>  watch and compile tsx file
  -h, --help                        output usage information
```

## 示例

```
  qmc -c ./demo.tsx 翻译demo.tsx文件
  qmc -w ./demo.tsx 监控demo.tsx文件，有变动就翻译它
  qmc -w ./src 监控src目录下所有tsx文件，翻译变动的文件
```
# 使用类型定义
见 quick-types

# tsx文件示例

其实原有的写法，就是，属性全部写字符串，也是全部兼容的。以下描述的写法，是便于IDE提示和类型检查的写法。

```ts
import styles from "./main.css";

import TodoItem from "./todo-item/todo-item";

class Main implements QuickApp.IComponent
{
    props = {
      foo: 1
    }

    template()
    {
        return (
            <div class="main-page">
                <div class="input">
                    <input class="input-text" type="checkbox" onclick={this.handleInput}></input>
                    <TodoItem fooParam={this.props.foo}></TodoItem>
                </div>
            </div>
        );
    }

    handleInput(e: QuickApp.ClickEvent)
    {
        console.log(arguments);
    }
}

export default Main;
```

## 组件写法
采用class的语法，将原来的ux文件中的template写成类的一个方法，使用jsx的写法，标签的使用方式仍保留快应用的写法，不是React的写法，比如React中样式是className，但快应用中是class，在template方法中还是写class就可以了。

## 引用
引用样式、普通js或ts文件，组件，都采用统一的import语法。

## 数据模型
仍然是快应用的数据模型，比如访问props中的字段的时候，不采取省略this的写法，就按照正常访问对象的写法来写。

## 事件绑定
比如上面onclick，不是直接传字符串，而是直接this.handleInput

## 参数传递
传参的时候不需要改变参数名称，把本来驼峰命名的弄成连字符连接的，就按照实际参数名字来传。

## 指令
if和show保留原来写法，for改用map。

```ts
class Main
{
    private = {
        cities: [{ name: "", showSpots: false, spots: [{ name: "" }] }],
        showCityList: true
    }
    template()
    {
        return (
            <div class="main-page">
                <div class="city" if={this.private.showCityList === true}>
                    {
                        this.private.cities.map(city => (
                            <block>
                                <text>城市：{city.name}</text>
                                <block if={city.showSpots}>
                                    {
                                      city.spots.map(spot =>(
                                        <text if={spot}>景点：{spot.name}</text> 
                                      ))
                                    }
                                </block>
                            </block>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Main;
```

# 实现原理

主要是整个翻译的流程，这部分暂时没有写，之后会陆续添加。

# 开源许可证
MIT