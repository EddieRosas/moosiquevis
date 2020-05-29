document.addEventListener("DOMContentLoaded", () => {

    // let modal = document.getElementsByClassName("modal")[0];
    // let modalContent = document.getElementsByClassName("modal-content")[0]

    

    // // I'm using "click" but it works with any event
    // clickToClose = () => {
    //     document.addEventListener('click', function (event) {
    //         debugger

    //         let isClickInside = modalContent.contains(event.target);

    //         if (!isClickInside) {
    //             modal.classList.add("hide");
    //             modalContent.classList.add("hide");
    //         }
    //     });
    // }
    
    // document.removeEventListener("click", clickToClose, false);
    
    // clickToClose();

    // let modalButton = document.getElementById("instructions");

    // modalButton.addEventListener("click", () => {
    //     modal.classList.remove("hide");
    //     modalContent.classList.remove("hide");
    //     clickToClose();
    // })

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    let 
        audio,
        audioContext,
        playButton,
        volumeControl,
        gainNode,
        track,
        analyser,
        bufferLength,
        dataArray;

    const fileInput = document.getElementById("file-input");

    fileInput.onchange = () => {
        if (!audioContext || audioContext.state !== "running") {
            songUrl = URL.createObjectURL(fileInput.files[0]);
            audio = new Audio();
            console.log(audio);
            audio.src = songUrl;
            setup();
        }
    }

    let demo = document.getElementById("demo") 

    demo.addEventListener("click", () => {
        audio = new Audio("/dist/demo_song.mp3");
        setup();
    })

    setup = () => {
        audioContext = audioContext || new AudioContext();
        analyser = ( analyser || audioContext.createAnalyser());
        track = audioContext.createMediaElementSource(audio);
        analyser.fftSize = 2048
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        track.connect(analyser);

        
        playButton = document.getElementById("play-button");

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
                audio.pause();
                playButton.dataset.playing = 'false';
            }

        }, false);

        volumeControl = document.querySelector('#volume');

        gainNode = audioContext.createGain();
        track.connect(gainNode).connect(audioContext.destination)

        volumeControl.addEventListener('input', () => {
            gainNode.gain.value = this.value;
        }, false);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        drawOscilloscope();
        sunAnimation();
    }

    const canvas = document.querySelector("canvas");
    const canvasCtx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    
    drawOscilloscope = () => {

        let drawVisual = requestAnimationFrame(drawOscilloscope);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(20, 20, 20)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(50, 168, 82)';
        canvasCtx.beginPath();

        let sliceWidth = WIDTH * 1.25 / bufferLength;
        let x = 0;


        for (let i = 0; i < bufferLength; i++) {

            let v = dataArray[i] / 128.0;
            let y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
    }

    drawSun = () => {
        centerX = WIDTH / 2;
        centerY = HEIGHT / 2;
        radius = 215;

        canvasCtx.fillStyle = "coral";
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, Math.PI,  0);
        canvasCtx.moveTo(centerX - radius, centerY);
        canvasCtx.bezierCurveTo(centerX - radius, centerY + 120, centerX - radius + 40, centerY + 150, centerX - 50, centerY + 200);
        canvasCtx.moveTo(centerX + radius, centerY);
        canvasCtx.bezierCurveTo(centerX + radius, centerY + 120, centerX + radius - 40, centerY + 150, centerX + 50, centerY + 200);
        canvasCtx.moveTo(centerX + 50, centerY + 200);
        canvasCtx.lineTo(centerX - 50, centerY + 200);
        canvasCtx.lineTo(centerX - radius, centerY);
        canvasCtx.lineTo(centerX + radius, centerY)
        canvasCtx.stroke();
        canvasCtx.fill();

        canvasCtx.beginPath();
        canvasCtx.arc(centerX - 100, centerY + 80, radius * .05, 0, 2 * Math.PI);
        canvasCtx.stroke();
        canvasCtx.fillStyle = "black";
        canvasCtx.fill();

        canvasCtx.beginPath();
        canvasCtx.arc(centerX + 100, centerY + 80, radius * .05, 0, 2 * Math.PI);
        canvasCtx.stroke();
        canvasCtx.fillStyle = "black";
        canvasCtx.fill();

        canvasCtx.lineWidth = 2.5;
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY + 100, radius * .05, 0, Math.PI);
        canvasCtx.stroke();

    }

    drawLeg = (x1, y1, x2, y2, width, frequency) => {
        let lineColor = "rgb(" + 200 + ", " + 170 + ", " + frequency + ")";

        canvasCtx.strokeStyle = lineColor;
        canvasCtx.lineWidth = width;
        canvasCtx.beginPath();
        canvasCtx.moveTo(x1, y1);
        canvasCtx.lineTo(x2, y2);
        canvasCtx.stroke();
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

        let legs = 128;
        let leg_width = 7;
        analyser.getByteFrequencyData(dataArray);
        
        for (let i = 0; i < legs; i++) {

            rads = Math.PI * 2 / legs;
            leg_height = dataArray[i] * 1.75;

            
            x = centerX + Math.cos(rads * i) * (radius);
            y = centerY + Math.sin(rads * i) * (radius);
            x_end = centerX + Math.cos(rads * i) * (radius + leg_height);
            y_end = centerY + Math.sin(rads * i) * (radius + leg_height);

    
            drawLeg(x, y, x_end, y_end, leg_width, dataArray[i]);

        }
        
    }

    // function spinner() {
    //     canvasCtx.translate(WIDTH / 2, HEIGHT / 2);
    //     function drawSpin() {
    //         canvasCtx.fillStyle = "rgba(255, 255, 255, .005)";
    //         canvasCtx.fillRect(-400, -400, WIDTH / 4 , HEIGHT / 4 );
    //         canvasCtx.beginPath();
    //         canvasCtx.fillStyle = 'hsla(25,100%,50%, 0.1)';
    //         canvasCtx.moveTo(0, 0);

    //         analyser.getByteFrequencyData(dataArray);
    //         let rotateAngle = 0.01; 
    //         for (let angle = 0; angle < 2 * Math.PI; angle += 0.01) {
    //             let x = WIDTH / 2 * Math.cos(4 * angle) * Math.cos(angle);
    //             let y = HEIGHT / 2 * Math.cos(4 * angle) * Math.sin(angle);
    //             canvasCtx.lineTo(x, y);
    //         }

    //         canvasCtx.fill();
    //         canvasCtx.rotate(rotateAngle);
    //         requestAnimationFrame(drawSpin);
    //     }

    //     drawSpin();
    // }


    
});