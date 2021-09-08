/*
 * Mono.js 应用
 * 版本 1.2(21a38c)
 */
mono.init()
// "信息"栏
var monoinfo = new View([
    new TinyView({
        innerHTML: "Mono.js Web框架演示<br><br>URL: " + window.location.href + "<br>",
        style: { padding: "10px", }
    }),
    new MonoInlineButton("hello", () => { helloindicator.properties.innerHTML = "hello"; helloindicator.update() }),
    helloindicator = new TinyView({ style: { "display": "inline-block" } }),
    new MonoInlineButton("this is", () => { thisisindicator.properties.innerHTML = "this is"; thisisindicator.update() }),
    thisisindicator = new TinyView({ style: { "display": "inline-block" } }),
    new MonoButton("mono.js", () => {
        MonoDialog.new("Mono.js", "Web Framework", [
            { text: "OK", bold: true, onclick: () => { } },
            { text: "Yes", bold: false, onclick: () => { } }
        ])
    }),
    new TinyView({
        innerHTML: "Mono.js 版本 1.2(21a38b)<br>",
        style: { padding: "10px", }
    }),
    image = new MonoImage("/appleevent2021_hero_endframe__8xosbwdvpaqe_large_2x.png"),
    audio = new MonoAudio("local-forecast.mp3")
], {
    style: {
        transition: "width 0.2s cubic-bezier(0.17,0.73,0,1)",
        margin: "0 auto",
        "margin-bottom": "30px"
    }
})
// "详情"栏
var monodetail = new View([
    new TinyView({
        innerHTML: "Mono.js 0.1 至 1.2(21a38c) 已完成的技术特性：<br>\
        (*)文档树构建与动态维护、影子文档树<br>\
        (*)不会丢失数据的节点挂载、摘除和重新挂载<br>\
        (*)视图的数据绑定(Binding)<br>\
        (*)与使用旧版框架开发的Mono应用完全兼容<br>\
        (*)定制控件：导航栏(MonoNavigationBar)、按钮(MonoButton)、图像(MonoImage)、消息对话框(MonoDialog)<br>\
        (*)布局响应器(ViewAdapter)<br>\
        (*)兼容性检查和缓存控制<br/>\
        (*)[BETA]Javascript控制下的css transition位置过渡动画(MoveController)与Cubic Bezier速度曲线<br>\
        <br>\
        下一版本将要完成的技术特性：<br>\
        ( )定制控件：容器、媒体播放器(MonoAudio)<br>\
        ( )Javascript控制下的更多类型的过渡动画<br>\
        ( )视图控制器(ViewController)<br>\
        ( )嵌入的WebAssembly加载器和基于WebAssembly的逻辑加密的视图<br>\
        <br>\
        "
    }),
    new View([
        new MonoInlineButton("+ 时间戳", () => {
            let t=new Date().getTime()
            new View([new MonoInlineButton(t,()=>{
                MonoDialog.new(new Date(parseInt(t)).toLocaleString(),null) 
            })], { style: { float: "left" } }).attach(side0)
        }),
        new MonoInlineButton("移动到底部", () => {
            let count = 0
            for (let i of side0.subviews) {
                if (!i) continue
                setTimeout(() => {
                    MoveController.set(i, 600).moveTo(side1)
                }, 150 * count)
                count++
            }
        }),
        new View([
            side0 = new View([

            ], {
                style: {
                    height: "150px",
                    width: "95%",
                    "border": "1px solid #a0a0a0",
                    "border-radius": "15px",
                    "overflow-y": "scroll",
                }
            }),
            side1 = new View([

            ], {
                style: {
                    width: "95%",
                    height: "300px",
                }
            })
        ]),
    ])
], {
    style: {
        margin: "0 auto",
    }
})
//应用接入点
mono.app(
    new View([
        new VerticalPadding(60),
        new MonoNavigationBar("Mono.js Web Framework"),
        panel = new View([
            new View([
                monoinfo, monodetail
            ])
        ], {
            style: {
                padding: "10px",
                "margin": "0 auto"
            }
        }),
    ], {
        style: { "color": "#303030", }
    })
)
// 布局响应器
// 移动设备
ViewAdapter.adapters.push(
    {
        _ident: "adapter_mobile", min: -Infinity, max: 600, func: () => {
            monoinfo.properties.style.width = "95%"
            monoinfo.properties.style.float = ""
            monoinfo.properties.style["margin-right"] = ""
            monoinfo.updateStyle()
            panel.properties.style.width = ""
            panel.updateStyle()
        }
    }
)
// 小型电脑
ViewAdapter.adapters.push(
    {
        _ident: "adapter_desktop1", min: 600, max: 1000, func: () => {
            monoinfo.properties.style.width = "260px"
            monoinfo.properties.style.float = "left"
            monoinfo.properties.style["margin-right"] = "30px"
            monoinfo.updateStyle()
            panel.properties.style.width = "600px"
            panel.updateStyle()
        }
    }
)
// 大型电脑
ViewAdapter.adapters.push(
    {
        _ident: "adapter_desktop2", min: 1000, max: Infinity, func: () => {
            monoinfo.properties.style.width = "320px"
            monoinfo.properties.style.float = "left"
            monoinfo.properties.style["margin-right"] = "90px"
            monoinfo.updateStyle()
            panel.properties.style.width = "1000px"
            panel.updateStyle()
        }
    }
)
ViewAdapter.react()