/*
 * Mono.js 框架导入器
 * 版本 1.2(21a38c)
 */
monoversion = { monoimport: "21a38c" }
// ------------------------------------------------------- //

imports = [
    "/mono/mono.js",
    "/mono/monoutil.js",
    "/mono/monoext.js",
    "index.monoapp.js",  // Mono.js应用的文件名，可以修改
]

// ------------------------------------------------------- //

// 导入器设置(国际化)
var monoImporterPreference = {
    imports: imports,
    internationalize: {
        wait: "正在载入页面",
        loadPage: "正在载入页面<br><br><br>🌀正在载入文件: ",
        loadErr: "无法载入页面<br><br><br>⚠️未能载入文件: ",
        runtimeErr: "⚠️Mono.js 运行时错误",
        err: "错误类型",
        pos: "错误位置",
        showAlertAgain: "是否要再显示类似消息？",
    }
}

// 不要修改以下内容
alertstatus = 0
window.addEventListener("error", (e) => {
    let msg=e.message
    let col=e.colno
    let url=e.filename
    let line=e.lineno
    let t = monoImporterPreference.internationalize.runtimeErr + "\n\n" + monoImporterPreference.internationalize.err + ": " + msg + "\n" + "URL: " + url + "\n" + monoImporterPreference.internationalize.pos + ": " + line + ":" + col + "\n\n"
    if (alertstatus == 0 && !confirm(t + monoImporterPreference.internationalize.showAlertAgain)) {
        alertstatus = 1
    }
    console.log(t)
    document.body.innerHTML += t.replaceAll("\n", "<br>")
    oe()
})
document.getElementById("monoloading").style.display = "none"
var ios_indicator_svg = '<svg version="1.1" x="0px" y="0px" viewBox="0 0 2400 2400" xml:space="preserve"><g stroke-width="200" stroke-linecap="round" stroke="#000000" fill="none" id="spinner"><line x1="1200" y1="600" x2="1200" y2="100"/><line opacity="0.5" x1="1200" y1="2300" x2="1200" y2="1800"/><line opacity="0.917" x1="900" y1="680.4" x2="650" y2="247.4"/><line opacity="0.417" x1="1750" y1="2152.6" x2="1500" y2="1719.6"/><line opacity="0.833" x1="680.4" y1="900" x2="247.4" y2="650"/><line opacity="0.333" x1="2152.6" y1="1750" x2="1719.6" y2="1500"/><line opacity="0.75" x1="600" y1="1200" x2="100" y2="1200"/><line opacity="0.25" x1="2300" y1="1200" x2="1800" y2="1200"/><line opacity="0.667" x1="680.4" y1="1500" x2="247.4" y2="1750"/><line opacity="0.167" x1="2152.6" y1="650" x2="1719.6" y2="900"/><line opacity="0.583" x1="900" y1="1719.6" x2="650" y2="2152.6"/><line opacity="0.083" x1="1750" y1="247.4" x2="1500" y2="680.4"/><animateTransform attributeName="transform" attributeType="XML" type="rotate" keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667" values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199" dur="0.83333s" begin="0s" repeatCount="indefinite" calcMode="discrete"/></g></svg>'
var loading_logo = "<div style='width:25px;height:25px;float:left;;margin-right:-60px;margin-top:-2px;'>" + ios_indicator_svg + "</div>"
var loaderdiv, infodiv
function initloaderui() {
    loaderdiv = document.createElement("div")
    document.body.appendChild(loaderdiv)
    loaderdiv.innerHTML = "<div style='padding:30px;'><div id='monoloadinginfo' style='text-align:center;height:20px;width:80%;max-width:400px;min-width:100px;background-color:#EAEAEA;color:#303030;border-radius:9px;margin: 0 auto;padding:20px;'>" + loading_logo + monoImporterPreference.internationalize.wait + "</div></div>"
    infodiv = document.getElementById("monoloadinginfo")
    loaderdiv.style.display = "none"
    setTimeout(() => {
        try { loaderdiv.style.display = "block" } catch (e) { }
    }, 300)
}
initloaderui()
function printProgress(str) {
    try { infodiv.innerHTML = loading_logo + str } catch (e) { }
}
function urlTimestamp(url) {  // 为url添加时间戳，防止缓存
    if (url.indexOf("?") == -1) {
        return url + "?t=" + new Date().getTime()
    } else {
        return url + "&t=" + new Date().getTime()
    }
}
var monoBlobAjax = {
    get: function (url, fn, err, prog) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
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
        xhr.onprogress = prog
        xhr.responseType = "blob"
        xhr.send();
    },
}
var monoAjax = {
    get: function (url, fn, err, prog) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
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
        xhr.onprogress = prog
        xhr.send();
    },
}
function createScriptBlob(response, callback) {
    let obj_js = document.createElement("script");
    obj_js.src = window.URL.createObjectURL(response)
    document.body.appendChild(obj_js);
    obj_js.onload = () => {
        callback()
    }
}
class Collect {
    constructor(count, callback) {
        this.count = count
        this.callback = callback
        this.p = 0
    }
    collect() {
        this.p++
        if (this.p == this.count) {
            this.callback()
        }
    }
}
function loadScriptBundle(chain, callback, tickCallback) {
    let importedScripts = []
    let importedURLs = []
    let cbcount = 0
    let c = new Collect(chain.length, collect)
    for (let s of chain) {
        monoBlobAjax.get(s, (xhr) => {
            cbcount++
            let index = chain.indexOf(s)
            importedScripts[index] = xhr.response
            importedURLs[index] = s
            tickCallback((c.p / c.count * 100).toFixed(0) + "%")
            c.collect()
        }, (u) => {
            console.error("monoutil: chain error: " + u)
            callback(u)
        })
    }
    function collect() {
        let pt = 0
        let load = () => {
            createScriptBlob(importedScripts[pt], () => {
                if (pt < importedScripts.length - 1) {
                    pt++
                    load()
                } else {
                    console.log("monoutil: chain done")
                    callback()
                }
            })
        }
        load()
    }
}
var importsNoCache = []
for (let u of monoImporterPreference.imports) {
    if(localStorage.getItem("frameworkNotCompatible")=="true"){
        importsNoCache.push(urlTimestamp(u))
    }else{
        importsNoCache.push(u)
    }
}
loadScriptBundle(importsNoCache, (err) => {
    if (err) {
        // 加载错误
        printProgress(monoImporterPreference.internationalize.loadErr + err)
    } else {
        // 加载完成，移除指示器
        document.body.removeChild(loaderdiv)
    }
}, (u) => {
    // 加载完成每一个文件
    printProgress(monoImporterPreference.internationalize.loadPage + u)
})
printProgress(monoImporterPreference.internationalize.wait)