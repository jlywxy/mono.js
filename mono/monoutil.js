/*
 * Mono.js 实用工具
 * 版本 22axd4
 */
monoversion.monoutil = "22axd4"
// importView产生的缓存, 字典格式{url: 脚本源码}
var importcache = {}
// 开启视图导入器缓存，减少延时。在开发阶段不要设置为true。
var enableimportcache = false

// 视图文件扩展名: *.monoview.js
function importView(url, callBack, error) {
    if (!enableimportcache || (enableimportcache && !importcache[url])) {
        monoAjax.get(url, (xhr) => {
            let viewobj = eval(xhr.responseText)
            importcache[url] = viewobj
            callBack(viewobj)
        }, (e) => {
            error(e)
        }, (p) => { })
    } else {
        callBack(importcache[url])
    }
}

class MoveController {
    constructor(target, duration) {
        this.target = target  // 目标动画对象
        this.duration = duration // 动画时长
        this.bezier_function = "cubic-bezier(0.17,0.73,0,1)"  // 动画速度曲线
        this.timer = null  // 完成定时器
        this.ticktimer = null  // 定位轮询定时器
        this.moving = false  // 动画状态标志位
        this.virtualTarget = null
    }
    static set(target, duration) {  //MoveController.set(target,dur).moveTo(dest)
        if (!target._mono_move_controller) {
            target._mono_move_controller = new MoveController(target, duration)
        } else {
            target._mono_move_controller.duration = duration
        }
        return target._mono_move_controller
    }
    moveTo(destination, callback) {
        if (!this.target.attached) return
        clearInterval(this.timer)  // 清除上一个动画的完成定时器
        if (!callback) callback = () => { }
        if (this.virtualTarget) this.virtualTarget.dispose()
        this.virtualTarget = new TinyView({ style: {} })
        //this.virtualTarget.properties.style["background-color"]="red"
        this.virtualTarget.properties.style["display"] = this.target.domElement.style["display"]
        this.virtualTarget.properties.style["float"] = this.target.domElement.style["float"]
        this.virtualTarget.properties.style.width = (this.target.size[0]) + "px"
        this.virtualTarget.properties.style.height = (this.target.size[1]) + "px"
        this.virtualTarget.attach(destination)  // 挂载虚拟对象到目标父容器
        this.target.properties.style["transition-timing-function"] = this.bezier_function
        this.target.properties.style.transition = "all " + ((this.duration) / 1000) + "s"
        this.target.updateProperties()  // 设置目标对象的动画
        this.target.domElement.style.left = (this.target.position[0]) + "px"
        this.target.domElement.style.top = (this.target.position[1]) + "px"  // 设置目标对象的样式
        this.target.domElement.style.position = "fixed"  // 从文档流解挂目标对象
        this.target.domElement.style.left = (this.virtualTarget.position[0] - this.target.domElement.style.marginLeft.replace("px", "")) + "px"
        this.target.domElement.style.top = (this.virtualTarget.position[1] - this.target.domElement.style.marginTop.replace("px", "")) + "px"  // 设置目的坐标，触发transition
        this.ticktimer = setInterval(() => {  // 轮询虚拟目标对象的新位置，改变动画方向
            try {
                this.target.domElement.style.left = (this.virtualTarget.position[0] - this.target.domElement.style.marginLeft.replace("px", "")) + "px"
                this.target.domElement.style.top = (this.virtualTarget.position[1] - this.target.domElement.style.marginTop.replace("px", "")) + "px"  // 设置目的坐标，触发transition
            } catch (e) { }
        }, 10)
        this.moving = true  // 改变标志位
        this.timer = setTimeout(() => {  // 动画完成时执行
            clearInterval(this.ticktimer)  // 停止定位轮询
            this.target.domElement.style.position = ""  // 挂载目标对象到文档流
            this.target.properties.style.transition = ""
            this.moving = false  // 改变标志位
            this.target.detach();  // 将目标对象从源父对象解挂
            destination.domElement.insertBefore(this.target.domElement, this.virtualTarget.domElement)  // 将目标对象的DOM对象插入到虚拟目标对象的DOM对象位置
            this.virtualTarget.dispose();  // 将虚拟目标对象销毁
            destination.append(this.target)
            this.target.update()
            callback()  //回调
        }, this.duration)
    }
}

// 以下均为旧方法, 已废弃但作为保持兼容性的备选项
function loadScript(url, callback) {
    loadScriptChain([url], callback)
}
function loadScriptChain(chain, callback) {
    loadScriptBundle(chain, callback, () => { })
}

monoAjax.post = (body, url, fn, err) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)) {
                fn(xhr);
            } else {
                err(url)
            }
        }
    };
    xhr.onerror = err
    xhr.send(body);
}

monoAjax.postJson = (body, url, fn, err) => {
    monoAjax.post(JSON.stringify(body), url, fn, err)
}