/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("document.addEventListener(\"DOMContentLoaded\", () => {\n\n    const AudioContext = window.AudioContext || window.webkitAudioContext;\n\n    let\n        audio,\n        audioContext,\n        playButton,\n        gainNode,\n        track,\n        analyser,\n        bufferLength,\n        dataArray;\n\n    const fileInput = document.getElementById(\"file-input\");\n\n    playButton = document.getElementById(\"play-button\");\n    playButton.disabled = true;\n\n    fileInput.onchange = () => {\n        if (!audioContext || audioContext.state !== \"running\") {\n            songUrl = URL.createObjectURL(fileInput.files[0]);\n            audio = new Audio();\n            console.log(audio);\n            audio.src = songUrl;\n            setup();\n        }\n    }\n\n    let demoButton = document.getElementById(\"demo\")\n\n    demoButton.addEventListener(\"click\", () => {\n        audio = new Audio(\"https://raw.githubusercontent.com/EddieRosas/moosiquevis/master/dist/bensound-allthat.mp3\");\n        audio.crossOrigin = \"anonymous\";\n        setup();\n    })\n\n    setup = () => {\n        demoButton.disabled = true;\n        playButton.disabled = false;\n        fileInput.disabled = true;\n\n        audioContext = audioContext || new AudioContext();\n        analyser = ( analyser || audioContext.createAnalyser());\n        track = audioContext.createMediaElementSource(audio);\n        analyser.fftSize = 2048\n        bufferLength = analyser.frequencyBinCount;\n        dataArray = new Uint8Array(bufferLength);\n        track.connect(analyser);\n\n        playButton.addEventListener('click', () => {\n\n            // check if context is in suspended state (autoplay policy)\n            if (audioContext.state === 'suspended') {\n                audioContext.resume();\n            }\n\n            // play or pause track depending on state\n            if (playButton.dataset.playing === 'false') {\n                audio.play();\n                playButton.dataset.playing = 'true';\n            } else if (playButton.dataset.playing === 'true') {\n                demoButton.disabled = true;\n                fileInput.disabled = true;\n                audio.pause();\n                playButton.dataset.playing = 'false';\n            }\n\n        }, false);\n\n        gainNode = audioContext.createGain();\n        track.connect(gainNode).connect(audioContext.destination)\n\n        sunAnimation();\n    }\n\n    const canvas = document.querySelector(\"canvas\");\n    const canvasCtx = canvas.getContext(\"2d\");\n    canvas.width = window.innerWidth;\n    canvas.height = window.innerHeight;\n\n    const WIDTH = canvas.width;\n    const HEIGHT = canvas.height;\n\n    drawSun = () => {\n        centerX = WIDTH / 2;\n        centerY = HEIGHT / 2;\n        radius = 215;\n\n        // body\n        canvasCtx.beginPath();\n        canvasCtx.arc(centerX, centerY, radius, 2 * Math.PI,  0);\n        // canvasCtx.stroke();\n        canvasCtx.fillStyle = \"coral\";\n        canvasCtx.fill();\n        canvasCtx.closePath();\n\n        // left eye\n        canvasCtx.beginPath();\n        canvasCtx.arc(centerX - 100, centerY + 80, radius * .05, 0, 2 * Math.PI);\n        // canvasCtx.stroke();\n        canvasCtx.fillStyle = \"black\";\n        canvasCtx.fill();\n        canvasCtx.closePath();\n\n        // right eye\n        canvasCtx.beginPath();\n        canvasCtx.arc(centerX + 100, centerY + 80, radius * .05, 0, 2 * Math.PI);\n        // canvasCtx.stroke();\n        canvasCtx.fillStyle = \"black\";\n        canvasCtx.fill();\n        canvasCtx.closePath();\n\n        // smile\n        canvasCtx.lineWidth = 2.5;\n        canvasCtx.beginPath();\n        canvasCtx.arc(centerX, centerY + 100, radius * .05, 0, Math.PI);\n        canvasCtx.strokeStyle = \"black\";\n        canvasCtx.stroke();\n        canvasCtx.closePath();\n    }\n\n    drawRay = (x1, y1, x2, y2, width, frequency) => {\n        let lineColor = \"rgb(\" + 200 + \", \" + 170 + \", \" + frequency + \")\";\n\n        canvasCtx.beginPath();\n        canvasCtx.lineWidth = width;\n        canvasCtx.moveTo(x1, y1);\n        canvasCtx.lineTo(x2, y2);\n        canvasCtx.strokeStyle = lineColor;\n        canvasCtx.stroke();\n        canvasCtx.closePath();\n    }\n\n    sunAnimation = () => {\n        requestAnimationFrame(sunAnimation);\n\n        let radius = 215\n        let centerX = WIDTH / 2;\n        let centerY = HEIGHT / 2;\n        let gradient = canvasCtx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius * 2);\n        gradient.addColorStop(1, \"rgba(61, 124, 188, 0.84)\");\n        gradient.addColorStop(0, \"rgba(200, 200, 200, .85)\");\n        canvasCtx.fillStyle = gradient\n        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);\n        canvasCtx.fill();\n\n        drawSun();\n\n        let rays = 128;\n        let leg_width = 6.75;\n        analyser.getByteFrequencyData(dataArray);\n\n        for (let i = 0; i < rays; i++) {\n\n            rads = Math.PI * 2 / rays;\n            leg_height = dataArray[i] * 1.75;\n\n            x = centerX + Math.cos(rads * i) * (radius);\n            y = centerY + Math.sin(rads * i) * (radius);\n            x_end = centerX + Math.cos(rads * i) * (radius + leg_height);\n            y_end = centerY + Math.sin(rads * i) * (radius + leg_height);\n\n            drawRay(x, y, x_end, y_end, leg_width, dataArray[i]);\n        }\n    }\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });