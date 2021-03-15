document.addEventListener("DOMContentLoaded", () => {

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    let
        audio,
        audioContext,
        playButton,
        gainNode,
        track,
        analyser,
        bufferLength,
        dataArray;

    const fileInput = document.getElementById("file-input");

    playButton = document.getElementById("play-button");
    playButton.disabled = true;

    fileInput.onchange = () => {
        if (!audioContext || audioContext.state !== "running") {
            songUrl = URL.createObjectURL(fileInput.files[0]);
            audio = new Audio();
            console.log(audio);
            audio.src = songUrl;
            setup();
        }
    }

    let demoButton = document.getElementById("demo")

    demoButton.addEventListener("click", () => {
        audio = new Audio("https://raw.githubusercontent.com/EddieRosas/moosiquevis/master/dist/bensound-groovyhiphop.mp3");
        audio.crossOrigin = "anonymous";
        setup();
    })

    setup = () => {
        demoButton.disabled = true;
        playButton.disabled = false;
        fileInput.disabled = true;

        audioContext = audioContext || new AudioContext();
        analyser = ( analyser || audioContext.createAnalyser());
        track = audioContext.createMediaElementSource(audio);
        analyser.fftSize = 2048
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        track.connect(analyser);

        playButton.addEventListener('click', () => {

            // check if context is in suspended state (autoplay policy)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            // play or pause track depending on state
            if (playButton.dataset.playing === 'false') {
                audio.play();
                playButton.dataset.playing = 'true';
            } else if (playButton.dataset.playing === 'true') {
                demoButton.disabled = true;
                fileInput.disabled = true;
                audio.pause();
                playButton.dataset.playing = 'false';
            }

        }, false);

        gainNode = audioContext.createGain();
        track.connect(gainNode).connect(audioContext.destination)

        sunAnimation();
    }

    const canvas = document.querySelector("canvas");
    const canvasCtx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    drawSun = () => {
        centerX = WIDTH / 2;
        centerY = HEIGHT / 2;
        radius = 215;

        // body
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, 2 * Math.PI,  0);
        // canvasCtx.stroke();
        canvasCtx.fillStyle = "coral";
        canvasCtx.fill();
        canvasCtx.closePath();

        // left eye
        canvasCtx.beginPath();
        canvasCtx.arc(centerX - 100, centerY + 80, radius * .05, 0, 2 * Math.PI);
        // canvasCtx.stroke();
        canvasCtx.fillStyle = "black";
        canvasCtx.fill();
        canvasCtx.closePath();

        // right eye
        canvasCtx.beginPath();
        canvasCtx.arc(centerX + 100, centerY + 80, radius * .05, 0, 2 * Math.PI);
        // canvasCtx.stroke();
        canvasCtx.fillStyle = "black";
        canvasCtx.fill();
        canvasCtx.closePath();

        // smile
        canvasCtx.lineWidth = 2.5;
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY + 100, radius * .05, 0, Math.PI);
        canvasCtx.strokeStyle = "black";
        canvasCtx.stroke();
        canvasCtx.closePath();
    }

    drawRay = (x1, y1, x2, y2, width, frequency) => {
        let lineColor = "rgb(" + 200 + ", " + 170 + ", " + frequency + ")";

        canvasCtx.beginPath();
        canvasCtx.lineWidth = width;
        canvasCtx.moveTo(x1, y1);
        canvasCtx.lineTo(x2, y2);
        canvasCtx.strokeStyle = lineColor;
        canvasCtx.stroke();
        canvasCtx.closePath();
    }

    sunAnimation = () => {
        requestAnimationFrame(sunAnimation);

        let radius = 215
        let centerX = WIDTH / 2;
        let centerY = HEIGHT / 2;
        let gradient = canvasCtx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius * 2);
        gradient.addColorStop(1, "rgba(61, 124, 188, 0.84)");
        gradient.addColorStop(0, "rgba(200, 200, 200, .85)");
        canvasCtx.fillStyle = gradient
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.fill();

        drawSun();

        let rays = 128;
        let leg_width = 6.75;
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < rays; i++) {

            rads = Math.PI * 2 / rays;
            leg_height = dataArray[i] * 1.75;

            x = centerX + Math.cos(rads * i) * (radius);
            y = centerY + Math.sin(rads * i) * (radius);
            x_end = centerX + Math.cos(rads * i) * (radius + leg_height);
            y_end = centerY + Math.sin(rads * i) * (radius + leg_height);

            drawRay(x, y, x_end, y_end, leg_width, dataArray[i]);
        }
    }
});
