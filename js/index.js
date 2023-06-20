import Color from "./Color.js";
import MapEmitterRenderer from "./MapEmitterRenderer.js";

const loader = document.querySelector(".loader-layer");
const content = document.querySelector(".content-layer");
const gradient = document.querySelector(".gradient-layer");
const canvas = document.querySelector(".cover-layer");

/**
 * @type {MapEmitterRenderer}
 */
let mapRenderer; 
let { scale, finalPath, recommendedSpread } = getPresets('screen-width');

let now = Date.now();
let then = now;
let fps = 60;

let spawnNow, spawnThen;

/**
 * This is a helper function to quickly change settings.
 * @param {String} basis can be 'DPI' or 'screen-width'.
 * @returns an object with the values for scaling of canvas and finalPath of source image.
 */
function getPresets(basis) {
  let basePath = "../images/background";
  let { devicePixelRatio, innerWidth } = window;

  switch (basis) {
    case 'DPI':
      return {
        scale: devicePixelRatio,
        finalPath: devicePixelRatio > 1.0 ? `${basePath}/pattern-dpi-2x-3x.png` : `${basePath}/pattern-dpi-1x.png`,
        recommendedSpread: devicePixelRatio > 1.0 ? 27000 : 35000
      };
    case 'screen-width':
      return {
        scale: Math.max(2.0, devicePixelRatio),
        finalPath: innerWidth > 480 ? `${basePath}/pattern-desktop.png` : `${basePath}/pattern-mobile.png`,
        recommendedSpread: innerWidth > 480 ? 35000 : 27000
      };
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
 * The main function that is called initially
 * when the page loads.
 */
function main() {
  // show the loader
  loader.style.zIndex = "99";
  loader.style.display = "block";

  // this is for matching the DPI to keep the output crisp
  let { width, height } = getViewportSize();
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  mapRenderer = new MapEmitterRenderer(finalPath, window, canvas, { 
    sourceBackgroundColor: new Color(23, 23, 23, 255), 
    targetBackgroundColor: new Color(0, 0, 0, 255), // 139 255
    targetForegroundColor: new Color(20, 20, 20, 255), // (8, 22, 209, 255)
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
 * The setup step to call everything inside it once.
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
 * Update step to be called repeatedly based on the game-loop implementation.
 */
function update() {
  mapRenderer.update();

  if (spawnNow - spawnThen >= 1000) {
    for (let index = 0; index < 4; ++index) {
      mapRenderer.createRandomEmitter(200, 18000, true);
    }
    spawnThen = spawnNow;
  }

  spawnNow = Date.now();
  
}

/**
 * To be called after every update.
 */
function render() {
  mapRenderer.render();
}

/**
 * This is the game-loop implementation that calls update and render
 * at certain intervals.
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
 * This is called whenever the user clicks on any part
 * of the window.
 * @param {MouseEvent} event the mouse click event.
 */
function handleClick(event) {
  if (mapRenderer.emitters.length >= 20) return;
  let { width : sourceWidth, height : sourceHeight } = getViewportSize();
  let { pageX : sourceX, pageY : sourceY } = event;
  let { width : targetWidth, height : targetHeight } = canvas;
  let x = Math.floor( (sourceX/sourceWidth) * parseInt(targetWidth) );
  let y = Math.floor( (sourceY/sourceHeight) * parseInt(targetHeight) );
  mapRenderer.createEmitter(x, y, 250, recommendedSpread, false);
}

/**
 * This is called when the window is resized.
 * Not sophisticated.
 */
function handleResize(_event) {
  let { width, height } = getViewportSize();
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

main();
