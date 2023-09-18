// default parameters
var canvasSize = 1000, // 画布尺寸
	modelName = '', // 模型编号
	modelScale = 1, // 缩放
	modelX = 0, // x坐标
	modelY = 0.1, // y坐标
	motionIdle = null,
	motionClick = null
var motionMgr = null

function animation() {
	if (motionMgr !== null && motionClick !== null) {
		motionMgr.startMotion(motionClick)
	}
}

function initModel(code = '', scale = 1, x = 0, y = 0, panzoomScale = 0.3) {
	if (code) {
		const bodySize = document.body.clientHeight > document.body.clientWidth ? document.body.clientWidth : document.body.clientHeight
		const canvasWrapSize = bodySize * 3 * panzoomScale
		canvas.width = bodySize * 3
		canvas.height = bodySize * 3
		canvasWrap.style.width = `${bodySize * 3}px`
		canvasWrap.style.height = `${bodySize * 3}px`
		canvasWrap.style.left = (document.body.clientWidth - canvasWrapSize) / 2 + 'px'
		canvasWrap.style.top = (document.body.clientHeight - canvasWrapSize) / 2 + 'px'
		modelScale = scale
		modelName = code
		modelX = x
		modelY = y

		loadBytes(getPath('/src/static/', 'MOC.' + code + '.json'), 'text', function(buf) {
			initLive2d('/src/static/', JSON.parse(buf))
		})
	}
}



function initLive2d(dir, model) {
	// declare global variables
	this.live2DModel = null
	this.requestID = null
	this.loadLive2DCompleted = false
	this.initLive2DCompleted = false
	this.loadedImages = []

	this.modelJson = model

	var canvas = document.getElementById('canvas')
	var canvasWrap = document.getElementById('canvasWrap')

	// the fun begins
	Live2D.init()
	init(dir, canvas)
}



function init(dir, canvas) {
	// try getting WebGl context
	var gl = getWebGLContext(canvas)
	if (!gl) {
		console.error('Failed to create WebGl context!')
		return
	}
	// pass WebGl context to Live2D lib
	Live2D.setGL(gl)

	// ------------------------
	// start of model rendering
	// ------------------------
	loadBytes(getPath(dir, modelJson.model), 'arraybuffer', function (buf) {
		live2DModel = Live2DModelWebGL.loadModel(buf)
		//document.getElementById('loading').remove()
	})

	// ------------------------
	// start loading textures
	// ------------------------
	var loadedCount = 0
	for (var i = 0; i < modelJson.textures.length; i++) {
		// create new image
		loadedImages[i] = new Image()
		loadedImages[i].src = getPath(dir, modelJson.textures[i])
		loadedImages[i].onload = function () {
			// check if all textures are loaded
			loadedCount++
			if (loadedCount == modelJson.textures.length) { loadLive2DCompleted = true }
		}
		loadedImages[i].onerror = function () {
			console.error('Failed to load texture: ' + modelJson.textures[i])
		}
	}

	// ------------------------
	// start loading motions
	// ------------------------
	motionMgr = new L2DMotionManager()
	loadBytes(getPath(dir, modelJson.motions.idle[0].file), 'arraybuffer', function (buf) {
		motionIdle = new Live2DMotion.loadMotion(buf)
		// remove fade in/out delay to make it smooth
		motionIdle._$eo = 0
		motionIdle._$dP = 0
	})
	if (modelJson.motions.attack) {
		loadBytes(getPath(dir, modelJson.motions.attack[0].file), 'arraybuffer', function (buf) {
			motionClick = new Live2DMotion.loadMotion(buf)
			// remove fade in/out delay to make it smooth
			motionClick._$eo = 0
			motionClick._$dP = 0
		})
	} else if (modelJson.motions.maxtouch) {
		loadBytes(getPath(dir, modelJson.motions.maxtouch[0].file), 'arraybuffer', function (buf) {
			motionClick = new Live2DMotion.loadMotion(buf)
			// remove fade in/out delay to make it smooth
			motionClick._$eo = 0
			motionClick._$dP = 0
		})
	}
	// ------------------------
	// ?loop every frame
	// ------------------------
	let _index_ = 1
	;(function tick() {
		// _index_ ++; if (_index_ > 15) return
		draw(gl)

		var requestAnimationFrame =
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame
		requestID = requestAnimationFrame(tick, canvas)
	})()
}


function draw(gl) {
	// clear canvas
	gl.clearColor(0.0, 0.0, 0.0, 0.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	// check if model and textures are loaded
	if (!live2DModel || !loadLive2DCompleted) return
	// check if first time drawign
	if (!initLive2DCompleted) {
		initLive2DCompleted = true

		// apply textures to the model
		for (var i = 0; i < loadedImages.length; i++) {
			var texture = getWebGLTexture(gl, loadedImages[i])
			live2DModel.setTexture(i, texture)
		}

		// reduce resources usage
		loadedImages = null

		// pass WebGl to model
		live2DModel.setGL(gl)
	}

	// something about model matrix
	var height = live2DModel.getCanvasHeight()
	var width = live2DModel.getCanvasWidth()
	var modelMatrix = new L2DModelMatrix(width, height)

	modelMatrix.setWidth(modelScale)
	modelMatrix.setCenterPosition(modelX, modelY)

	live2DModel.setMatrix(modelMatrix.getArray())

	// start idle animation
	if (motionMgr.isFinished()) {
		motionMgr.startMotion(motionIdle)
	}
	motionMgr.updateParam(live2DModel)

	// update and draw model
	live2DModel.update()
	live2DModel.draw()
}

// common helpers
function loadBytes(path, mime, callback) {
	const request = new XMLHttpRequest()
	request.open('GET', path, true)
	request.responseType = mime
	request.onload = function () {
		if (request.status == 200) {
			callback(request.response)
		} else {
			console.error('Failed to load (' + request.status + ') : ' + path)
		}
	}
	request.send(null)
}

function getPath(pathDir, file) {
	return pathDir + modelName + '/' + file
}

// WebGL helpers
function getWebGLContext(canvas) {
	// try different WebGl kits
	var kits = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl']
	var param = {
		alpha: true,
		premultipliedAlpha: true,
		// preserveDrawingBuffer: true,
	}

	for (var i = 0; i < kits.length; i++) {
		try {
			var ctx = canvas.getContext(kits[i], param)
			if (ctx) return ctx
		}
		catch (e) { }
	}
	return null
}

function getWebGLTexture(gl, img) {
	// create empty texture
	var texture = gl.createTexture()

	// a lot of WebGL things i dont understand
	if (live2DModel.isPremultipliedAlpha() == false) {
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
	}
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
	gl.generateMipmap(gl.TEXTURE_2D)
	gl.bindTexture(gl.TEXTURE_2D, null)

	return texture
}

