# Mono.js Web Framework

Mono.js 是一个使用原生Javascript编写的动态前端框架，无需使用者编写html语句，仅需使用Javascript和CSS进行用户界面的构建。<br/>
<br/>
版本: 1.2(21a38b)<br/>
作者: jlywxy(jlywxy@outlook.com)<br/>
Demo: https://jlywxy.top/, https://atari.jlywxy.top/<br/>
<br/>
“一个无需编写html语句的前端框架”<br/>
```javascript
mono.app(
    new View([
        new View([ ]),
        new TinyView({
            innerHTML: "tinyview",
            style: {
                color: "green"
            }
        }),
    ],{
        style: { "background-color": "black" },
        attributes: { id: "view1", }
    }
));
```
## 1.1 "Mono"具有多重含义
### 1.1.1 所有影子树挂载在"单一"DOM节点上
"影子树"是Mono.js中的虚拟DOM树，其DOM节点挂载在html的monoapp节点。<br/>
### 1.1.2 "单"类节点的树
在Mono.js中，构成树的基本元素是TinyView(小视图)，可代表一个叶子节点的DOM元素。<br/>
TinyView还可以衍生为View(视图)，代表一个容器元素，可容纳其它View或TinyView及其衍生元素。<br/>
### 1.1.3 "一次性"提供动态页面的功能
Mono.js将包含大部分动态页面所需的功能，并提供精心设计的扩展视图(定制控件)，以构建完整的用户界面。<br/>
### 1.1.4 复杂过程"简单"化
对于某些复杂功能，Mono.js进行了高度封装，实现一句话调用，例如<br/>
使用MoveController呈现动画：`MoveController.set(对象,动画时长).moveTo(目的地,回调函数)`<br/>
使用MonoDialog呈现对话框：`MonoDialog.new(标题,内容,[{text: 按键文本,bold: 是否粗体,onclick:点击事件}])`<br/>
## 1.2 基本功能
Mono.js 0.1 至 1.2(21a38c) 已完成的技术特性：<br/>
* 文档树构建与动态维护、影子文档树<br/>
* 不会丢失数据的节点挂载、摘除和重新挂载<br/>
* 视图的数据绑定(Binding)<br/>
* 与使用旧版框架开发的Mono应用完全兼容<br/>
* 定制控件：导航栏(MonoNavigationBar)、按钮(MonoButton)、图像(MonoImage)、消息对话框(MonoDialog)<br/>
* 布局响应器(ViewAdapter)<br/>
* [BETA]Javascript控制下的css transition位置过渡动画(MoveController)与Cubic Bezier速度曲线<br/>

下一版本将要完成的技术特性：<br/>
* 定制控件：容器、媒体播放器(MonoAudio)<br/>
* Javascript控制下的更多类型的过渡动画<br/>
* 嵌入的WebAssembly加载器和基于WebAssembly的逻辑加密的视图<br/>
## 1.3 虚拟树语法
### 1.3.1 声明树
一个View节点就是一棵空的树：
```javascript
new View([

])
```
在其中加入子视图：
```javascript
new View([
    new View([

    ]),
    new TinyView(),
    new View([
        new View([

        ])  
    ])
])
```
为视图设置属性和样式：
```javascript
new View([
    new TinyView({
        innerHTML: "tinyview",
        style: {
            color: "white"
        }
    }),
],{
    style: {
        width: "90px",
        height: "30px",
        "background-color": "black"
    },
    attributes: {
        id: "view1",
        onclick: ()=>{ },
    }
})
```
就是这么简单👀。<br/><br/>
注意: 若视图无需嵌套子视图，建议使用TinyView以提升性能，还可以增加代码整洁度。
### 1.3.2 视图的命名
可以在声明树时为视图取名，也可以在树外部为其取名：
```javascript
var tinyview1;
new View([
    new View([

    ]),
    tinyview1 = new TinyView(),
])
```
等同于
```javascript
var tinyview1 = new TinyView();
new View([
    new View([

    ]),
    tinyview1
])
```
### 1.3.3 视图的挂载
在Mono.js中，将页面称作应用。应用只具有一个根视图节点，其初始化步骤为：
```javascript
mono.init()
mono.app(
    new View([ ]) // 根视图节点
)
```
在运行时，若想动态的挂载或解挂视图，可以使用`attach`和`detach`方法。需要注意的是`attach`方法要求父视图已挂载到其父视图上(根视图除外，在mono.app方法中已指定虚拟父节点)。
```javascript
mono.init()
var view=new View([])
mono.app(view)
var subview1=new View([])
subview1.attach(view)
subview1.detach()
```
若要将视图挂载到未挂载的父视图时，需使用append方法，不直接操作DOM树，因为未挂载的父视图没有DOM对象。
```javascript
mono.init()
var view=new View([])
mono.app(view)
var view2=new View([])
var view3=new View([])
view2.append(view3)  // view2未挂载
view2.attach(view)  // view2进行挂载
```
即：attach为动态挂载，append为静态挂载。
### 1.3.4 视图的更新
在运行时，修改Mono影子树的属性和样式并不会立即操作DOM树，这是为了提升性能。<br/>
`view.update()`更新所有属性、样式，<br/>
如果对象是TinyView则更新innerHTML，如果对象是View则更新其自身并调用其所有子视图的更新。<br/>
`view.updateProperties()`更新其自身的属性和样式<br/>
`view.updateStyle()`仅更新其自身的样式，用于响应式布局，<br/>
保护属性不变的同时改变样式。<br/>
需要注意的是，视图的挂载和解挂会立即操作DOM树。
### 1.3.5
未完待续 (TODO):
* 定制控件的使用
* 定制自己的控件
* 方法说明