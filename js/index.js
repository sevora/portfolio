import MapEmitterRenderer from "./MapEmitterRenderer.js";

const gradient = document.querySelector(".gradient-layer");
const canvas = document.querySelector(".cover-layer");
let mapEmitter = new MapEmitterRenderer("../images/background/pattern-original-large.png", [23, 23, 23], window, canvas);

let now = Date.now();
let then = now;
let fps = 60;

canvas.width = window.document.body.clientWidth;
canvas.height = window.document.body.clientHeight;

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

