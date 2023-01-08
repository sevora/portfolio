import MapEmitterRenderer from "./MapEmitterRenderer.js";

const gradient = document.querySelector(".gradient-layer");
const canvas = document.querySelector(".cover-layer");
let scale = window.devicePixelRatio;
let { clientWidth : width, clientHeight : height } = window.document.body;

let basePath = "../images/background";
let finalPath = width > 480 ? `${basePath}/pattern-desktop.png` : `${basePath}/pattern-mobile.png`;
let mapEmitter = new MapEmitterRenderer(finalPath, [23, 23, 23], window, canvas);

let now = Date.now();
let then = now;
let fps = 60;

canvas.width = width * scale;
canvas.height = height * scale;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

mapEmitter.load(() => {
    setup();
    loop();
});

function loop() {
    window.requestAnimationFrame(loop);

    now = Date.now();
    let elapsed = now - then;
    let interval = 1000 / fps;

    if (elapsed > interval) {
        then = now - (elapsed % interval);
        update();
        render();
    }
}

function setup() {
  gradient.style.visibility = "visible";
  mapEmitter.setup();
  console.log(mapEmitter);
}

function update() {
  mapEmitter.update();
}

function render() {
  mapEmitter.render();
}

