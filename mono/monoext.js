/*
 * Mono.js 扩展视图插件
 * 版本 22axdc.1
 */
monoversion.monoext = "22axdc.1"
// 视图插件设置(国际化)
var monoExtensionPreference = {
    internationalize: {
        failToLoadImage: "⚠️加载图片失败",
        retry: "重试"
    }
}
// monourl: redirect method
// 不要修改以下内容
class Binding {
    constructor(val, listeners) {
        this.type = this.constructor.name
        this.val = val; this.listeners = listeners ? listeners : []
        this.value = this.val
    }
    addListener(func) { this.listeners.push(func) }
    get value() { return this.val }
    set value(val) { this.val = val; for (let f of this.listeners) { f() } }
}
class BindedTinyView extends TinyView {
    constructor(properties) {
        super(properties)
        let thisview = this
        var isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';
        let handler = {
            set(target, key, value) {
                let v = isObject(value) ? new Proxy(value, handler) : value
                let r = Reflect.set(target, key, v);
                thisview.update()
                return r
            }
        }
        this.properties = new Proxy(this.properties, handler)
    }
}
class MonoNavigationBar extends View {
    constructor(title, properties, subviews) {
        super(subviews, properties)
        this.title = title
        let nbObj = this
        this.titleElement = new class extends TinyView {
            update() {
                this.domElement.innerHTML = nbObj.title
            }
        }({
            "NavigationBarTitle": "null",  // 匿名类标识符
            innerHTML: nbObj.title,
        })
        this.titleElement.parentNode = this
        this.subviews.push(this.titleElement)
        this.properties.tagName = "nav";
        this.properties.style = Object.assign(this.properties.style, {
            "background-color": "rgba(255,255,255,0.5)",
            "border-bottom": "1px solid #d0d0d0",
            //"box-shadow": "0 4px 15px rgba(200,200,200,0.55)",
            "backdrop-filter": "blur(20px)",
            "-webkit-backdrop-filter": "blur(20px)",
            "color": "black",
            "font-size": "17px",
            "top":0,
            "left":0,
            //"border-radius": "9px",
            //"margin": "15px",
            "margin-bottom": "0px",
            "padding-left": "20px",
            "padding-right": "20px",
            "padding-top": "15px",
            "padding-bottom": "15px",
            "position": "fixed",
            "position": "fixed",
            "width": "100%",
            "z-index": "99",
            "font-weight": "520",
        })
    }
}
NavigationBar = MonoNavigationBar
class MonoImage extends View {
    constructor(source, containerProperties, imgProperties) {
        let containerp = containerProperties ? containerProperties : {}
        let imgp = imgProperties ? imgProperties : {}
        super([], Object.assign({}, {
            style: {
                "padding": "12px",
                "padding-bottom": "0",
            }
        }, containerp))
        let thisview = this
        this.imgObj = new TinyView(Object.assign({}, {
            tagName: "img",
            attributes: {
                src: null
            },
            style: {
                "border-radius": "7px",
                "margin-bottom": "-5px",
                "width": "100%",
                "box-shadow": "0 6px 28px rgba(80,80,80,0.35)",
            }
        }, imgp))
        this.progObj = new TinyView({
            style: {
                "text-align": "center",
                display: "block"
            }
        })
        this.loadingObj = loadingView()
        this.retryFunc = function () {
            thisview.update()
        }
        this.retryBtnObj = new TinyView({
            tagName: "button",
            innerHTML: monoExtensionPreference.internationalize.retry,
            attributes: {
                onclick: this.retryFunc
            },
            style: {
                width: "100px",
                margin: "0 auto",
                display: "none"
            }
        })
        this.source = source
        this.subviews.push(this.imgObj)
        this.imgObj.parentNode = this
        this.subviews.push(this.loadingObj)
        this.loadingObj.parentNode = this
        this.subviews.push(this.progObj)
        this.progObj.parentNode = this
        this.subviews.push(this.retryBtnObj)
        this.retryBtnObj.parentNode = this
    }
    update() {
        super.updateProperties()
        this.loadingObj.update()
        this.retryBtnObj.update()
        monoBlobAjax.get(this.source, (xhr) => {
            this.imgObj.properties.attributes.src = window.URL.createObjectURL(xhr.response)
            this.imgObj.update()
            this.loadingObj.properties.style.display = "none"
            this.loadingObj.update()
            this.progObj.properties.style.display = "none"
            this.progObj.update()
            this.retryBtnObj.properties.style.display = "none"
            this.retryBtnObj.update()
        }, () => {
            this.loadingObj.properties.style.display = "none"
            this.loadingObj.update()
            this.progObj.properties.innerHTML = "- " + monoExtensionPreference.internationalize.failToLoadImage + " -"
            this.progObj.update()
            this.retryBtnObj.properties.style.display = "block"
            this.retryBtnObj.update()
        }, (e) => {
            this.retryBtnObj.properties.style.display = "none"
            this.retryBtnObj.update()
            this.progObj.properties.innerHTML = (e.loaded / e.total * 100).toFixed(2) + "%"
            this.progObj.update()
        })
    }
}
class MonoInlineButton extends TinyView {
    constructor(text, onclick) {
        super({
            innerHTML: text,
            attributes: {
                onclick: onclick,
            },
            style: {
                margin: "6px",
                "background-color": "#efefef",
                padding: "6px",
                "padding-left": "18px",
                "padding-right": "18px",
                display: "inline-block",
                "border-radius": "18px",
                color: "#0090ff",
                "-webkit-user-select": "none",
                "-webkit-tap-highlight-color": "transparent"
            }
        })
        this.properties.attributes.onmousedown = () => {
            this.domElement.style.transition = "background-color 0.1s cubic-bezier(0.17,0.73,0,1)"
            this.domElement.style["background-color"] = "#b0b0b0"
        }
        this.properties.attributes.ontouchstart = this.properties.attributes.onmousedown
        this.properties.attributes.onmouseup = () => {
            this.domElement.style.transition = "background-color 0.25s"
            this.domElement.style["background-color"] = "#efefef"
        }
        this.properties.attributes.ontouchend = this.properties.attributes.onmouseup
    }
}
class MonoButton extends MonoInlineButton {
    constructor(text, onclick) {
        super(text, onclick)
        this.properties.style = {
            "border-radius": "9px",
            "background-color": "#008fff",
            display: "inline-block",
            padding: "10px",
            "padding-left": "22px",
            "padding-right": "22px",
            color: "white",
            margin: "6px",
        }
        this.properties.attributes.onmousedown = () => {
            this.domElement.style.transition = "color 0.1s cubic-bezier(0.17,0.73,0,1)"
            this.domElement.style["color"] = "rgba(255,255,255,0.4)"
        }
        this.properties.attributes.ontouchstart = this.properties.attributes.onmousedown
        this.properties.attributes.onmouseup = () => {
            this.domElement.style.transition = "color 0.25s"
            this.domElement.style["color"] = "#ffffff"
        }
        this.properties.attributes.ontouchend = this.properties.attributes.onmouseup
    }
}
class MonoDialogButton extends TinyView {
    constructor(text, bold, onclick, decoration) {
        super({
            innerHTML: text,
            tagName: "th",
            style: {
                "border-left": decoration ? "1px solid #ccc" : "",
                "font-weight": bold ? "520" : "normal",
                padding: "11px",
                color: "#0090ff"
            },
            attributes: {
                onclick: onclick
            }
        })
        this.properties.attributes.onmousedown = () => {
            this.domElement.style["background-color"] = "#dfdfdf"
        }
        this.properties.attributes.ontouchstart = this.properties.attributes.onmousedown
        this.properties.attributes.onmouseup = () => {
            this.domElement.style["background-color"] = "rgba(0,0,0,0)"
        }
        this.properties.attributes.ontouchend = this.properties.attributes.onmouseup
    }
}
class MonoDialog {
    static new(parentMono, title, text, buttons) {
        let destroyPanel
        let buttonpanel = new View([], {
            tagName: "tr"
        })
        if (!buttons) {
            buttonpanel.append(new MonoDialogButton("OK", true, () => { destroyPanel(); }, false))
        } else {
            let first = 0
            for (let b of buttons) {
                b.onclick?0:b.onclick=()=>{}
                if (first == 0) {
                    first = 1
                    buttonpanel.append(new MonoDialogButton(b.text, b.bold, () => { b.onclick();destroyPanel();  }, false))
                } else {
                    buttonpanel.append(new MonoDialogButton(b.text, b.bold, () => { b.onclick();destroyPanel();  }, true))
                }
            }
        }
        buttonpanel.subviews[0].properties.style['border-bottom-left-radius'] = "10px"
            buttonpanel.subviews[buttonpanel.subviews.length - 1].properties.style['border-bottom-right-radius'] = "10px"
        let panel = new View([
            new TinyView({
                innerHTML: title,
                style: {
                    "margin-top": "-10px",
                    "margin-left": "20px",
                    "margin-right": "20px",
                    "margin-bottom": "24px",
                    "font-weight": "520",
                    "font-size": "18px",
                    "text-align": "center",
                    //"word-break": "break-all",
                    "word-wrap": "break-word"
                }
            }),
            text == null ?
                new TinyView({
                    style: {
                        "margin-bottom": "65px",
                    }
                }) :
                new TinyView({
                    innerHTML: text,//.substr(0, 500),
                    style: {
                        "margin-top": "-15px",
                        "margin-left": "20px",
                        "margin-right": "20px",
                        "margin-bottom": "65px",
                        "font-size": "16px",
                        "text-align": "center",
                        //"word-break": "break-all",
                        "word-wrap": "break-word"
                    }
                }),
            new View([
                new View([
                    buttonpanel
                ], {
                    tagName: "table",
                    style: {
                        width: "100%",
                        position: "fixed",
                        bottom: "0px",
                        "table-layout": "fixed",
                        "border-top": "1px solid #ccc",
                        "font-size": "18px",
                        "border-collapse": "collapse",
                    },
                    attributes: {
                        border: "0",
                        cellspacing: "0",
                        cellpadding: "0"
                    }
                })
            ], {
                style: {
                    position: "relative",
                    overflow: "hidden"
                }
            })
        ], {
            style: {
                position: "fixed",
                width: "280px",
                //height: "98px",
                "padding-top": "30px",
                "background-color": "rgba(255,255,255,0.8)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                "border-radius": "10px",
                "backdrop-filter": "blur(10px)",
                "-webkit-backdrop-filter": "blur(10px)",
                "transition": "all 0.5s cubic-bezier(0.17,0.73,0,1)",
                "user-select": "none",
                "-webkit-user-select": "none",
                opacity: "1"
            }
        })
        panel.attach(parentMono.topmost)
        parentMono.showTopmost()
        panel.domElement.style.transform = "translate(-50%,-50%) scale(1.18)"
        panel.domElement.style.opacity = "0"
        setTimeout(() => {
            panel.domElement.style.transform = "translate(-50%,-50%) scale(1)"
            panel.domElement.style.opacity = "1"
        }, 20)
        destroyPanel = () => {
            parentMono.hideTopmost();
            panel.domElement.style.opacity = "0"
            setTimeout(() => {
                panel.dispose()
            }, 350)
        }
    }
}
class MonoAudio extends TinyView {
    constructor(src) {
        super({
            attributes: {
                src: src,
                controls: "controls"
            },
            tagName: "audio",
            style: {
                margin: "15px",
                width: "93%"
            }
        })
    }
}
function loadingView() {
    return new TinyView({
        tagName: "div",
        innerHTML: ios_indicator_svg,
        style: {
            width: "25px",
            margin: "0 auto",
            display: "block"
        }
    })
}
class VerticalPadding extends TinyView{
    constructor(pixels){
        super({
            style:{
                height: pixels+"px"
            }
        })
    }
}
class ViewAdapter {
    static adapters = []
    static react() {
        for (let a of ViewAdapter.adapters) {
            if (window.innerWidth > a.min && window.innerWidth <= a.max) {
                a.func()
                return
            }
        }
        console.log("monoext: view adapter uncaught")
    }
}
window.addEventListener("resize", () => {
    ViewAdapter.react()
})


class VSpacer extends TinyView { constructor(height) { super({ style: { height: height + "px" } }) } }

class HSpacer extends TinyView { constructor(width) { super({ style: { width: width + "px" } }) } }

class HStack extends View{
    constructor(subviews){
        super([],{
            tagName: "table",
            style:{
                width: "100%",
                "border-collapse": "collapse",
            }
        })
        let trcontainer=new View([],{
            tagName: "tr"
        })
        for(let v of subviews){
            trcontainer.subviews.push(
                new View([v],{
                    tagName:"td"
                })
            )
        }
        this.subviews.push(trcontainer)
        this.trcontainer=trcontainer.subviews
    }
    update(){
        for(let v of this.trcontainer){
            v.properties.style.width=v.subviews[0].properties.style.width
        }
        super.update()
    }
}

class TextHint extends TinyView {
    constructor(text) { super({ innerHTML: text, style: { "font-size": "13px", "font-weight": "bold", "margin": "8px", "margin-left": "18px", "color": "#606060" } }) } set text(value) {
        this.properties.innerHTML = value
        this.update()
    }
    get text() {
        return this.properties.innerHTML
    }
}

class ListHint extends TinyView { constructor(text) { super({ innerHTML: text, style: { "font-size": "12px", "margin": "3px", "margin-left": "25px", "font-weight": "400", "color": "#808080" } }) } }

class Text extends TinyView {
    constructor(text) { super({ innerHTML: text, style: { "margin": "8px", "display": "inline-block" } }) }
    set text(value) {
        this.properties.innerHTML = value
        this.update()
    }
    get text() {
        return this.properties.innerHTML
    }
}
class Textbox extends TinyView {
    constructor(value, placeholder, action, password) {
        super({
            tagName: "input",
            attributes: {
                type: password ? "password" : "text",
                value: value ? value : "",
                placeholder: placeholder ? placeholder : "",
            },
            style: {
                "-webkit-appearance": "none",
                "border": "none",
                "font-size": "15px",
                "width": "100%",
                "outline": "none",
                "background-color": "rgba(0,0,0,0)"
            }
        })
        this.action = action ? action : () => { }
        this.properties.attributes.oninput = () => { this.action(this.domElement.value) }
    }
    get text() {
        return this.domElement.value
    }
    set text(value) {
        this.properties.attributes.value = value
        this.domElement.value = value
    }
}
class TextField extends View{
    constructor(textbox){
        super([textbox],{
            style:{
                "padding": "5px",
                "border-radius": "8px",
                "background-color": "white"
            }
        })
    }
}

class List extends View {
    constructor(content) {
        super(content, {
            style: {
                "background-color": "white",
                "border-radius": "8px",
                "margin": "8px",
                "margin-left": "15px",
                "margin-right": "15px",
                "padding-left": "15px",
                "overflow": "hidden"
            }
        })
    }
    update() {
        for (let i of this.subviews) {
            i.properties.style["border-bottom"] = "1px solid #ddd"
        }
        this.subviews[this.subviews.length - 1].properties.style["border-bottom"] = ""
        super.update()
    }
}
class ListTextItem extends TinyView {
    constructor(content) {
        super({
            innerHTML: content,
            style: {
                padding: "13px",
                "padding-left": "0",
                color: "#202020",
                "font-size": "15px",
            }
        })
    }
}
class ListButton extends View {
    constructor(text, onclick) {
        let background = new TinyView({
            style: {
                "margin-left": "-30px",
                "padding-right": "30px",
                "margin-top": "-13px",
                "width": "100%",
                "height": "43px",
                position: "absolute",
                "font-size": "15px"
            }
        })
        super([new TinyView({
            innerHTML: text,
            style: {
                position: "absolute",
                "z-index": 1,
            }
        }), background],
            {
                attributes: {
                    onclick: onclick,
                },
                style: {
                    position: "relative",
                    padding: "13px",
                    "padding-left": "0",
                    "padding-bottom": "30px",
                    color: "#0090ee",
                    "-webkit-user-select": "none",
                    "-webkit-tap-highlight-color": "transparent",
                    width: "100%",
                }
            })
        this.background = background
        this.properties.attributes.onmousedown = () => {
            this.background.domElement.style.transition = "background-color 0.1s cubic-bezier(0.17,0.73,0,1)"
            this.background.domElement.style["background-color"] = "#d0d0d0"
        }
        this.properties.attributes.ontouchstart = this.properties.attributes.onmousedown
        this.properties.attributes.onmouseup = () => {
            this.background.domElement.style.transition = "background-color 0.25s"
            this.background.domElement.style["background-color"] = "rgba(255,255,255,0)"
        }
        this.properties.attributes.ontouchend = this.properties.attributes.onmouseup
    }
}
class ListItem extends View {
    constructor(content) {
        super(content, {
            style: {
                color: "#202020",
                "font-size": "15px",
                "padding-top": "8px",
                "padding-bottom": "8px",
            }
        })
    }
}