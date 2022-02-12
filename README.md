# Mono.js Web Framework

Mono.js 是一个使用原生Javascript编写的动态前端框架，无需使用者编写html语句，仅需使用Javascript和CSS进行用户界面的构建。<br/>
<br/>
当前版本: 22axd4<br/>
作者: jlywxy(jlywxy@outlook.com)<br/>
Demo: https://jlywxy.top/<br/>
<br/>
“一个无需编写html语句的前端框架”<br/>
```javascript
mono.app(
    new View([
        new View([ ]),
        new TinyView({
            innerHTML: "Mono.js Web Framework",
            style: {
                color: "blue"
            }
        }),
    ],{
        style: { "background-color": "black" },
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
使用MoveController呈现动画：`MoveController.set(对象,动画时长).moveTo(目的地父对象,回调函数)`<br/>
使用MonoDialog呈现对话框：`MonoDialog.new(mono,标题,内容,[{text: 按键文本,bold: 是否粗体,onclick:点击事件}])`
<br/>
使用ViewAdapter注册响应式视图：`ViewAdapter.adapters.push({min:最小宽度,max:最大宽度,func:响应的函数})`
## 1.2 基本功能
Mono.js 0.1 至 22axd4 已完成的技术特性：<br/>
(*)文档树构建与动态维护、影子文档树<br/>
(*)不会丢失数据的节点挂载、摘除和重新挂载<br/>
(*)视图的数据绑定(Binding)<br/>
(*)与使用旧版框架开发的Mono应用完全兼容<br/>
(*)定制控件：导航栏(MonoNavigationBar)、按钮(MonoButton)、图像(MonoImage)、消息对话框(MonoDialog)、文本框和文本区域(Textbox, TextField)、列表(列表容器：List，列表按钮：ListButton，列表文本项：ListTextItem，列表项：ListItem)等<br/>
(*)布局响应器(ViewAdapter)<br/>
(*)兼容性检查和缓存控制<br/>
(*)[BETA]Javascript控制下的css transition位置过渡动画(MoveController)与Cubic Bezier速度曲线<br/>
(*)URL系统<br>
<br>
下一版本将要完成的技术特性：<br>
( )Javascript过渡动画<br>
( )视图控制器(ViewController)<br>
<br>
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
    style: { //javascript 对象 / JSON对象
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
以下是解释描述元素的所有声明式特性的例子：<br/>
```javascript
new View([
    viewcontents
],{
    style: {viewstyles},
    tagName: viewtag,
    attributes: {id: viewid, onclick: viewonclick}
})
```
其中viewcontents,viewstyles,viewtag,viewid等各元素的作用，等价于以下html元素声明中的同名元素：
```html
<viewtag id=viewid onclick=viewonclick style=viewstyles>
    viewcontents
</viewtag>
```
即tagName描述元素标签名称、attributes内的元素操纵tagName后'>'前所有属性，而且将style单独列出用以方便书写。<br/>
但以上元素并非完全等价，因为mono在渲染时会将viewstyles处理为css格式、viewcontents也将通过操作DOM挂载到此DOM元素上。<br/><br/>

注意: 若视图无需嵌套子视图，建议使用TinyView以提升性能，还可以增加代码整洁度（无子视图，仅显示文字和简单富文本内容）。
### 1.3.2 视图的命名
可以在声明树时为视图取名（不推荐），也可以在树外部为其取名：
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
var mono=new Mono(document)
mono.app(
    new View([ ]) // 根视图节点
)
```
在运行时，若想动态的挂载或解挂视图，可以使用`attach`和`detach`方法。当元素已挂载时，使用`attach`将从原父元素解挂后挂在到新的父元素上。
```javascript
var mono=new Mono(document)
var view=new View([])
mono.app(view)
var subview1=new View([])
subview1.attach(view)
subview1.detach()
```
若仅需要将视图添加进父视图的渲染列表而不使得DOM更新，则使用`append`方法。此方法适用于未挂载的视图（树外声明视图的情况）。
```javascript
var mono=new Mono(document)
var view=new View([])
mono.app(view)
var view2=new View([])
var view3=new View([])
view2.append(view3)  // view2未挂载
view2.attach(view)  // view2进行挂载
```
### 1.3.4 视图的更新
在运行时，修改Mono影子树的属性和样式并不会立即操作DOM树，这是为了提升性能。<br/>
`view.update()`更新所有属性、样式，<br/>
如果对象是TinyView则更新innerHTML，如果对象是View则更新其自身并调用其所有子视图的更新。<br/>
`view.updateProperties()`更新其自身的属性和样式<br/>
`view.updateStyle()`仅更新其自身的样式，用于响应式布局，<br/>
保护属性不变的同时改变样式。<br/>
需要注意的是，视图的挂载和解挂会立即操作DOM树。<br/>
一些setter会自动更新视图，例如TinyView及其派生类的`text`属性。<br/>
### 1.3.5 定制自己的控件
定制控件分为以下两种方式：
继承类和函数式
继承类需要重写构造函数和/或update(视图更新)函数:
```javascript
//从TinyView定制：
class YourView extends TinyView{
    constructor(args){
        super({ ... })
    }
    update(){
        this.innerHTML= ...
    }
}
//从View定制：
class YourView extends View{
    constructor(args){
        super([ ], { ... })
    }
    update(){
        ...
        super.update()
    }
}
```
函数式返回一个新的视图对象：
```javascript
function yourview(){
    let view=new View([ ... ],{ ... })
    view. ... = ...
    return view
}
```
### 1.3.6 定制控件的使用
* MonoDialog 模式对话框:<br/>
  弹出一个简单提示框： `MonoDialog.new(mono,标题，内容?)`)<br/>
  弹出一个可相应事件的、多按钮的提示框： `MonoDialog.new(mono,标题，内容?，[{text: 按钮1, onclick: 事件1}, {text: 按钮2, onclick: 事件2}])`)<br/>
* MonoButton/MonoInlineButton/ListButton 按钮: 
 `...Button(文字, 事件)`
* 未完待续
### 1.3.7
! Document TODO (未完待续):
* 方法说明
* 查找 Bug
## 2. 杂项
### 2.1 版本命名规则：
年(后两位数字) + 开发状态(Alpha=a,Beta=b,Release=r) + 十六进制日期(hex(0908)="38c")<br/>
21 + a + 38c<br/>
### 2.2 bugfixed
21a39e:<br/>
* 修复了TinyView的 `attached` getter(判断模式从TinyView的父对象的存在性变为DOM的父对象的存在性)
* 修改了TinyView的 `created` getter(判断模式从验证created成员属性值变为判断DOM对象的存在性)
* 修复了Mono新的声明模式之下MonoDialog的调用形式(参数第一位为Mono根对象)

22axd4:<br/>
* 修复了MonoDialog按键事件不响应的问题
* monoext模块增加了新控件：Text、TextHint、List、ListHint、Textbox、TextField、ListItem、ListTextItem
* TinyView增加text属性的getter和setter，无需手动更新
