import Color from "./Color.js";
import MapEmitterRenderer from "./MapEmitterRenderer.js";
import MapEmitter from "./MapEmitter.js";

const loader = document.querySelector(".loader-layer");
const content = document.querySelector(".content-layer");
const gradient = document.querySelector(".gradient-layer");
const canvas = document.querySelector(".cover-layer");

let mapRenderer;
let { scale, finalPath } = getPresets('screen-width');

let now = Date.now();
let then = now;
let fps = 60;

let spawnNow, spawnThen;

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
function getViewportSize() {
  let { clientWidth : width, clientHeight : height } = window.document.body;
  return { width, height };
}

/**
 *
 *
 */
function main() {
  // hide all the content and show the loader
  loader.style.zIndex = "99";
  loader.style.display = "block";
  gradient.style.display = "none";
  content.style.display = "none";

  // this is for matching the DPI to keep the output crisp
  let { width, height } = getViewportSize();
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  mapRenderer = new MapEmitterRenderer(finalPath, window, canvas, { 
    sourceBackgroundColor: new Color(23, 23, 23, 255), 
    targetBackgroundColor: new Color(0, 0, 139, 255),
    targetForegroundColor: new Color(8, 22, 209, 255),
    targetActiveForegroundColor: new Color(0, 0, 0, 0)
  });

  // the callback function is called once the mapRenderer finishes loading
  mapRenderer.load(() => {
    setup();
    loop();

    // add event listeners for interaction and window resizing
    document.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
  });
}

/**
 *
 */
function setup() {
  // hide the loader and show all content
  loader.style.display = "none";
  gradient.removeAttribute("style");
  content.removeAttribute("style");
  
  spawnNow = Date.now();
  spawnThen = spawnNow;

  mapRenderer.setup();
}

/**
 *
 */
function update() {
  mapRenderer.update();

  if (spawnNow - spawnThen >= 1500) {
    for (let index = 0; index < 3; ++index) {
      mapRenderer.createRandomEmitter(250, 25000, true);
    }
    spawnThen = spawnNow;
  }

  spawnNow = Date.now();
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

/**
 *
 */
function handleClick(event) {
  if (mapRenderer.emitters.length >= 20) return;
  let { width : sourceWidth, height : sourceHeight } = getViewportSize();
  let { pageX : sourceX, pageY : sourceY } = event;
  let { width : targetWidth, height : targetHeight } = canvas;
  let x = Math.floor( (sourceX/sourceWidth) * parseInt(targetWidth) );
  let y = Math.floor( (sourceY/sourceHeight) * parseInt(targetHeight) );
  mapRenderer.createEmitter(x, y, 250, 35000);
}

/**
 *
 */
function handleResize(event) {
  let { width, height } = getViewportSize();
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

main();
