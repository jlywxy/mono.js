console.log("\
\n\
 * %cMono.js Web框架%c\n\
 * 版本 1.2(21a38c)\n\
 * 此框架的兼容性目前仅在Chrome、  \n   Safari和Firefox浏览器中测试过。\n\
 @ jlywxy https://github.com/jlywxy\
\n\
", 'font-weight: bold;', 'font-weight: normal;')
monoversion.mono = "21a38c"
function compatibilityCheck() {  // 版本检查
    let version = monoversion.mono
    if (monoversion.monoimport == version &&
        monoversion.monoutil == version &&
        monoversion.monoext == version) {
        localStorage.setItem("frameworkNotCompatible", "")
    }
    else {
        setTimeout(()=>window.location.reload(),3000)
        localStorage.setItem("frameworkNotCompatible", "true")
        setTimeout(()=>MonoDialog.new("框架版本不兼容","Framework version not compatible:" + JSON.stringify(monoversion)),500)
        //throw new Error("框架版本不兼容。Framework version not compatible:" + JSON.stringify(monoversion))
    }
}
var mono = {  // mono对象
    init() {  // 初始化mono
        compatibilityCheck()
        this.bodyElement = document.body
        this.styleElement = document.createElement("style")
        this.styleElement.id = "monostyle"
        document.head.appendChild(this.styleElement)
        this.bodyElement.style.margin = 0
        if (!document.getElementById("monoapp")) {
            console.log("mono: creating monoapp dom element")
            this.appElement = document.createElement("div")
            this.appElement.id = "monoapp"
            this.bodyElement.appendChild(this.appElement)
        } else {
            this.appElement = document.getElementById("monoapp")
        }
    },
    app(rootnode) {  // 应用接入点
        try { this.root.dispose() } catch (e) { }
        this.root = rootnode
        this.root.create()
        this.root.attachToDom(this.appElement)
        this.root.update()
        this.topmost = new View([
        ], {
            style: {
                position: "fixed", top: 0, left: 0, "z-index": 99, "background-color": "rgba(0,0,0,0)", width: "100%", height: "100%", display: "none",
                "transition": "background-color 0.8s cubic-bezier(0.17,0.73,0,1)"
            },
            attributes: {  // 禁止滚动事件从遮罩层向下传播
                ontouchmove: (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                },
                onwheel: (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }
        })
        this.topmost.create()
        this.topmost.attachToDom(this.appElement)
        this.topmost.update()
    },
    root: null,  // 根节点
    topmost: null,  // 遮罩层
    styleElement: null,  // 默认的样式DOM对象
    appElement: null,  // app DOM对象
    bodyElement: null,  // body DOM对象
}
function showTopmost() {  // 显示顶层遮罩背景
    mono.topmost.properties.style.display = "block"
    mono.topmost.update()
    setTimeout(() => {  // 隐藏顶层遮罩背景
        mono.topmost.properties.style["background-color"] = "rgba(0,0,0,0.4)"
        mono.topmost.update()
    }, 20)
}
function hideTopmost() {
    mono.topmost.properties.style["background-color"] = "rgba(0,0,0,0)"
    mono.topmost.update()
    setTimeout(() => {
        mono.topmost.properties.style.display = "none"
        mono.topmost.update()
    }, 200)

}
window.addEventListener("resize", () => {
    mono.topmost.properties.style.width = window.innerWidth + "px"
    mono.topmost.properties.style.height = window.innerHeight + "px"
    mono.topmost.update()
})
class TinyView {  // 小视图
    constructor(properties) {
        this.type = this.constructor.name
        this.properties = properties ? Object.assign(viewProperty(), properties) : viewProperty()
        this.parentNode = null
        this.tagName = this.properties.tagName ? this.properties.tagName : "div"
        this.created = false
    }
    create() {  // 创建DOM对象
        if (this.properties.oncreate && this.properties.oncreate() == false) return
        this.domElement = document.createElement(this.tagName)
        this.created = true
    }
    attach(rootnode) {  // 将对象挂载到新父对象
        if (this.properties.onattach && this.properties.onattach() == false) return
        if (!this.created) this.create()
        if (this.attached) this.detach()  // 若已挂载则先解挂
        this.parentNode = rootnode
        rootnode.subviews.push(this)
        rootnode.domElement.appendChild(this.domElement)
        this.update()
    }
    attachToDom(domnode) {  // 将DOM对象挂载到父DOM对象
        domnode.appendChild(this.domElement)
        this.parentNode = new Object()
    }
    detach() {  // 将对象从父对象上解挂
        if (this.attached == false) return
        if (this.properties.ondetach && this.properties.ondetach() == false) return
        this.domElement.parentNode.removeChild(this.domElement)
        let parentIndex = this.parentNode.subviews.indexOf(this);
        if (parentIndex != -1)
            delete this.parentNode.subviews[parentIndex]
        else
            console.log("mono: detaching from non-parent node")
    }
    detachFromDom() {
        this.domElement.parentNode.removeChild(this.domElement)
    }
    updateProperties() {  // 更新样式和属性
        if (this.properties.onupdateproperties && this.properties.onupdateproperties() == false) return
        this.updateStyle()
        let hattr = this.properties.attributes
        for (let key in hattr) {
            if (hattr[key]) this.domElement[key] = hattr[key]
        }
    }
    updateStyle() {  // 仅更新样式
        let style = this.properties.style
        if (style) {
            let styleString = ""
            for (let key in style) {
                styleString += key + ": " + style[key] + "; "
            }
            this.domElement.style = styleString
        } else {
            this.domElement.removeAttribute("style")
        }
    }
    update() {  // 更新内容和属性
        if (this.properties.onupdate && this.properties.onupdate() == false) return
        this.updateProperties()
        this.domElement.innerHTML = this.properties.innerHTML
    }
    dispose() {  // 销毁视图
        if (this.disposed) return
        if (this.properties.ondispose && this.properties.ondispose() == false) return
        this.detach()
        this.parentNode.remove(this)
        this.parentNode = null
        this.disposed = true
    }
    destructor() {
        this.dispose()
    }
    get layer() {  // 获得层数
        if (!this.attached) return null
        if (!this.parentNode) {
            return 0
        } else {
            return this.parentNode.layer + 1
        }
    }
    get position() {  // 获得绝对坐标
        if (!this.attached) return null
        return [
            this.domElement.getBoundingClientRect().x,
            this.domElement.getBoundingClientRect().y,
        ]
    }
    get size() {  // 获得实际长宽
        return [
            this.domElement.offsetWidth,
            this.domElement.offsetHeight
        ]
    }
    get attached() {
        if (this.parentNode) return true
        return false
    }
}
function query(view) {  // 获得视图的路径
    let identifier = ""
    let pt = view
    while (pt.parentNode != null) {
        identifier = pt.parentNode.subviews.indexOf(pt) + "." + identifier
        pt = pt.parentNode
    }
    return "monoquery-" + identifier.substr(0, identifier.length - 1)
}
function getQuery(identifier) {  // 从路径获得视图对象
    let rid = identifier.substr(10).split('.')
    let pt = mono.root
    for (let i = 0; i < rid.length; i++) {
        pt = pt.subviews[rid[i]]
    }
    return pt
}
function viewProperty() {
    return new ViewProperty()
}
class ViewProperty {  // 视图属性类定义
    tagName = null  // 标签名
    innerHTML = null  // 内部HTML语句
    style = {}  // 样式
    attributes = {  // 属性（html语句中尖括号内紧随标签名之后的部分）
        id: null,
        class: null,
    }
}
class View extends TinyView {  // 视图
    constructor(subviews, properties) {
        super(properties)
        this.subviews = (subviews ? subviews : [])
        for (let v of this.subviews) {
            v.parentNode = this
        }
    }
    create() {  // 创建DOM对象（包括子视图）
        super.create();
        for (let v of this.subviews) {
            if (!v) continue
            v.create();
            this.domElement.appendChild(v.domElement);
        }
    }
    dispose() {  // 销毁视图（包括子视图）
        for (let v of this.subviews) {
            if (!v) continue
            v.dispose()
        };
        super.dispose()
    }
    append(view) {  // 添加子视图（不进行创建和挂载）
        this.subviews.push(view)
        view.parentNode = this
    }
    remove(v) {  // 移除指定的子视图
        let i = this.subviews.indexOf(v)
        if (i != -1) { this.subviews.splice(i, 1) }
    }
    clear() {  // 清除所有子视图
        for (let v of this.subviews) {
            if (!v) continue
            v.dispose()
        }
    }
    update(onlythis) {  // 更新视图
        this.updateProperties()
        if (onlythis) return
        for (let v of this.subviews) {
            if (!v) continue
            v.update()
        }
    }
    tree() {  // 导出可视化树，已废弃
        let root = { node: this, child: [] }
        for (let v of this.subviews) {
            if (!v) continue
            if (!v.tree) root.child.push(v)
            else
                root.child.push(v.tree())
        }
        return root
    }
}
window.URL = window.URL || window.webkitURL
