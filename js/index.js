import MapEmitterRenderer from "./MapEmitterRenderer.js";

const gradient = document.querySelector(".gradient-layer");
const canvas = document.querySelector(".cover-layer");
const { clientWidth : width, clientHeight : height } = window.document.body;

let mapEmitter;
let now, then;
let fps;

/**
 *
 *
 */
function getPresets(basis) {
  let basePath = "../images/background";
  let { devicePixelRatio, innerWidth } = window;

  switch (basis) {
    case 'DPI':
      return {
        scale: devicePixelRatio,
        finalPath: devicePixelRatio > 1.0 ? `${basePath}/pattern-dpi-2x-3x.png` : `${basePath}/pattern-dpi-1x.png`,
      };
      break;
    case 'screen-width':
      return {
        scale: Math.max(2.5, devicePixelRatio),
        finalPath: innerWidth > 480 ? `${basePath}/pattern-desktop.png` : `${basePath}/pattern-mobile-v2.png`
      };
      break;
  }
}

/**
 *
 *
 */
function main() {
  let { scale, finalPath } = getPresets('screen-width');
  mapEmitter = new MapEmitterRenderer(finalPath, [23, 23, 23], window, canvas);

  now = Date.now();
  then = now;
  fps = 60;

  // this is for matching the DPI to keep the output crisp
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  mapEmitter.load(() => {
    setup();
    loop();
  });
}

/**
 *
 */
function setup() {
  gradient.style.visibility = "visible";
  mapEmitter.setup();
}

/**
 *
 */
function update() {
  mapEmitter.update();
}

/**
 *
 */
function render() {
  mapEmitter.render();
}

/**
 *
 */
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

main();
