import MapEmitterRenderer from "./MapEmitterRenderer.js";

const canvas = document.querySelector("canvas");
let mapEmitter = new MapEmitterRenderer("../images/background/pattern-original-large.png", [23, 23, 23], window, canvas);

let now = Date.now();
let then = now;
let fps = 60;

function main() {
  onResize();
  window.addEventListener("resize", onResize);
  mapEmitter.load(loop);
}

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

function update() {

}

function render() {
  mapEmitter.render();
}

//
function onResize() {
  let { innerWidth, innerHeight } = window;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

//
main();
