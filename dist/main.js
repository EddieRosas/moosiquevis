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

eval("const AudioContext = window.AudioContext || window.webkitAudioContext;\nconst audioContext = new AudioContext();\n\n// get the audio element\nconst audioElement = document.getElementById(\"endless-motion\");\n\n// pass it into the audio context\nconst track = audioContext.createMediaElementSource(audioElement);\n\nconst gainNode = audioContext.createGain();\ntrack.connect(gainNode).connect(audioContext.destination)\n\nconst playButton = document.querySelector('button');\n\nconst volumeControl = document.querySelector('#volume');\n\nvolumeControl.addEventListener('input', function () {\n    gainNode.gain.value = this.value;\n}, false);\n\nplayButton.addEventListener('click', function () {\n\n    // check if context is in suspended state (autoplay policy)\n    if (audioContext.state === 'suspended') {\n        audioContext.resume();\n    }\n\n    // play or pause track depending on state\n    if (this.dataset.playing === 'false') {\n        audioElement.play();\n        this.dataset.playing = 'true';\n    } else if (this.dataset.playing === 'true') {\n        audioElement.pause();\n        this.dataset.playing = 'false';\n    }\n\n}, false);\n\nconst analyser = audioContext.createAnalyser();\n\nconst canvas = document.querySelector(\"canvas\")\nconst canvasCtx = canvas.getContext(\"2d\");\ncanvasCtx.clearRect(0, 0, 1000, 1000);\n\nanalyser.fftSize = 2048;\nconst bufferLength = analyser.frequencyBinCount;\nconst dataArray = new Uint8Array(bufferLength);\ntrack.connect(analyser);\n\nfunction drawOscilloscope() {\n    let drawVisual = requestAnimationFrame(drawOscilloscope);\n    analyser.getByteTimeDomainData(dataArray);\n    canvasCtx.fillStyle = 'rgb(20, 20, 20)';\n    canvasCtx.fillRect(0, 0, 500, 500);\n    canvasCtx.lineWidth = 2;\n    canvasCtx.strokeStyle = 'rgb(50, 168, 82)';\n    canvasCtx.beginPath();\n\n    let sliceWidth = 500 * 1.0 / bufferLength;\n    let x = 0;\n\n\n    for (let i = 0; i < bufferLength; i++) {\n\n        let v = dataArray[i] / 128.0;\n        let y = v * 500 / 2;\n\n        if (i === 0) {\n            canvasCtx.moveTo(x, y);\n        } else {\n            canvasCtx.lineTo(x, y);\n        }\n\n        x += sliceWidth;\n    }\n\n    canvasCtx.lineTo(canvas.width, canvas.height / 2);\n    canvasCtx.stroke();\n\n}\n\ndrawOscilloscope();\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n    const element = document.getElementById(\"main\")\n\n});\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });