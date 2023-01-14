import Color from "./Color.js";
import MapEmitterRenderer from "./MapEmitterRenderer.js";

const loader = document.querySelector(".loader-layer");
const content = document.querySelector(".content-layer");
// const gradient = document.querySelector(".gradient-layer");
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
        finalPath: innerWidth > 480 ? `${basePath}/pattern-desktop.png` : `${basePath}/pattern-mobile.png`
      };
      break;
  }
}

/**
 *
 *
 */
function main() {
  // hide all the content
  // gradient.style.visibility = "hidden";
  loader.style.zIndex = "99";
  loader.style.display = "block";
  content.style.visibility = "hidden";

  let { scale, finalPath } = getPresets('screen-width');
  mapEmitter = new MapEmitterRenderer(finalPath, window, canvas, { 
    sourceBackgroundColor: new Color(23, 23, 23), 
    targetBackgroundColor: new Color(0, 0, 139),
    targetForegroundColor: new Color(0, 0, 255)
  });
  console.log(mapEmitter);

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
  // gradient.style.visibility = "visible";
  loader.style.display = "none";
  content.style.visibility = "visible";
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
