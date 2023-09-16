let lists = [
    "m275_01",
    "m276_01",
]

let code = 'xm201_01'
initModel(code, 128, 2, 0.1, 0.5)

var _btn = document.createElement('button')
_btn.style.position = 'absolute'
_btn.style.left = 0
_btn.style.top = 0
_btn.style.zIndex = 111111111
_btn.innerHTML = '导出'
_btn.onclick = () => {
    getImg(code)
}
document.getElementsByTagName('body')[0].append(_btn)


function getImg(name = 'image') {
    var link = document.createElement('a')
    var imgData = canvas.toDataURL({
        format: 'png',
        quality: 1,
    })
    imgData.substr(22, imgData.length)
    var blob = dataURLtoBlob(imgData)
    var objurl = URL.createObjectURL(blob)
    link.download = `${name}.png`
    link.href = objurl
    link.click()
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), 
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type:mime})
}

const getAll = () => {
    let index = 0
    let tt = setInterval(() => {
        const name = lists[index]
        if (!name) {
            clearInterval(tt)
        } else {
            initModel(name, 128, 1.5, 0, 0.3)
            setTimeout(() => {
                getImg(name)
            }, 500)
        }
        index ++
    }, 2000)
}
