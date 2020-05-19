const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// get the audio element
const audioElement = document.getElementById("endless-motion");

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);

const gainNode = audioContext.createGain();
track.connect(gainNode).connect(audioContext.destination)

const playButton = document.querySelector('button');

const volumeControl = document.querySelector('#volume');

volumeControl.addEventListener('input', function () {
    gainNode.gain.value = this.value;
}, false);

playButton.addEventListener('click', function () {

    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }

}, false);

const analyser = audioContext.createAnalyser();

const canvas = document.querySelector("canvas")
const canvasCtx = canvas.getContext("2d");
canvasCtx.clearRect(0, 0, 1000, 1000);

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
track.connect(analyser);

function drawOscilloscope() {
    let drawVisual = requestAnimationFrame(drawOscilloscope);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(20, 20, 20)';
    canvasCtx.fillRect(0, 0, 500, 500);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(50, 168, 82)';
    canvasCtx.beginPath();

    let sliceWidth = 500 * 1.0 / bufferLength;
    let x = 0;


    for (let i = 0; i < bufferLength; i++) {

        let v = dataArray[i] / 128.0;
        let y = v * 500 / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

}

drawOscilloscope();

document.addEventListener("DOMContentLoaded", function () {
    const element = document.getElementById("main")

});