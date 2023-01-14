import Color from "./Color.js";
import MapEmitterRenderer from "./MapEmitterRenderer.js";
import MapEmitter from "./MapEmitter.js";

const loader = document.querySelector(".loader-layer");
const content = document.querySelector(".content-layer");
// const gradient = document.querySelector(".gradient-layer");
const canvas = document.querySelector(".cover-layer");
const { clientWidth : width, clientHeight : height } = window.document.body;

let mapRenderer;
let scale;
let finalPath;

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
        scale: Math.max(2.0, devicePixelRatio),
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

  ({ scale, finalPath } = getPresets('screen-width'));

  mapRenderer = new MapEmitterRenderer(finalPath, window, canvas, { 
    sourceBackgroundColor: new Color(23, 23, 23, 255), 
    targetBackgroundColor: new Color(0, 0, 139, 255),
    targetForegroundColor: new Color(8, 22, 209, 255),
    targetActiveForegroundColor: new Color(0, 0, 0, 0)
  });

  now = Date.now();
  then = now;
  fps = 60;

  // this is for matching the DPI to keep the output crisp
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  mapRenderer.load(() => {
    setup();
    loop();
    document.addEventListener("click", handleClickScreen);
  });
}

/**
 *
 */
function setup() {
  // gradient.style.visibility = "visible";
  loader.style.display = "none";
  content.style.visibility = "visible";
  mapRenderer.setup();
  console.log(mapRenderer);
}

/**
 *
 */
function update() {
  mapRenderer.update();
}

/**
 *
 */
function render() {
  mapRenderer.render();
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

function handleClickScreen(event) {
  let x = event.pageX * scale;
  let y = event.pageY * scale;
  let spread = Math.max(50000 - mapRenderer.emitters.length * 10000, 10000);
  mapRenderer.createEmitter(x, y, 250, spread);
}

main();
