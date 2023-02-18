import Color from "./Color.js";
import MapEmitter from "./MapEmitter.js";

class MapEmitterRenderer {
  constructor(imagePath, windowElement, canvasElement, { sourceBackgroundColor=new Color(0, 0, 0), targetBackgroundColor=new Color(0, 0, 0), targetForegroundColor=new Color(100, 100, 100), targetActiveForegroundColor=new Color(255, 255, 255) }) {
    this.sourceData = null;
    this.targetData = null;

    this.width = null;
    this.height = null;

    // 0 - part of the board (empty)
    // 1 - wall, not fillable
    // 2 to 255 - part of the board (filled)
    this.sourceMap = null;
    this.sourceMapIndices = null;

    this.sourcePath = imagePath;
    this.sourceBackgroundColor = sourceBackgroundColor;
    this.targetBackgroundColor = targetBackgroundColor;
    this.targetForegroundColor = targetForegroundColor;
    this.targetActiveForegroundColor = targetActiveForegroundColor;

    this.emitters = [];
    this.value = 2; // starts at 2

    this.window = windowElement;
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');

    this.isFinished = false;
  }

  /**
   * use to load the image from imagePath where its pixel data will be used.
   * @param {CallableFunction} onLoadCallback the callback function for when loading succeeds.
   */
  load(onLoadCallback) {
    let image = new Image();
    image.crossOrigin = '*';

    image.onload = () => {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      let { width : sourceWidth, height : sourceHeight } = image;
      let { width : targetWidth, height : targetHeight } = this.canvas;

      canvas.width = targetWidth;
      canvas.height = targetHeight; 

      let originX = sourceWidth / 2 - targetWidth / 2;
      let originY = sourceHeight / 2 - targetHeight / 2;

      context.drawImage(image, -originX, -originY);
      this.sourceData = context.getImageData(0, 0, targetWidth, targetHeight);
      this.width = targetWidth;
      this.height = targetHeight;
      context.clearRect(0, 0, targetWidth, targetHeight); // could be commented, maybe no performance gain here
      
      if (onLoadCallback) onLoadCallback();
    }

    image.src = this.sourcePath;
  }

  /**
   * Use to setup the MapEmitterRenderer for its initial state.
   * As you can see it does a variety of things.
   */
  setup() {
    this._initializeSourceMap();
    this._initializeSourceMapIndices();
    this._initializeTargetData();
  }

  /**
   * Use as an update step for the MapEmitterRenderer.
   */
  update() {
    for (let index = this.emitters.length-1; index >= 0; --index) {
      let emitter = this.emitters[index];
      let speed = (emitter.isConservative ? 0.10 : 0.20) * emitter.spreadLimit;

      for (let repeats = 0; repeats < speed; ++repeats) {
        emitter.update();
        if (emitter.isFinished) {
          this.emitters.splice(index, 1);
          break;
        }
      }
    }

    let { data : pixels } = this.targetData;
    let unfilled = this.targetForegroundColor.unpack();
    let filled = this.targetActiveForegroundColor.unpack();

    for (let index = 0; index < this.sourceMapIndices.length; ++index) {
      let targetDataIndex = this.sourceMapIndices[index];

      let sourceValue = this.sourceMap[targetDataIndex];
      let color = sourceValue == 0 ? unfilled : filled;
      let [ r, g, b, a ] = color; 

      let pixelIndex = targetDataIndex * 4;
      pixels[pixelIndex] = r;
      pixels[pixelIndex + 1] = g;
      pixels[pixelIndex + 2] = b;
      pixels[pixelIndex + 3] = a;
    }
  }

  /**
   * Use to render the map.
   */
  render() {
    this.context.putImageData(this.targetData, 0, 0);
  }

  /**
   * Use this to create or spawn an emitter.
   * @param {Number} x The emitter's x-position.
   * @param {Number} y The emitter's y-position.
   * @param {Number} range How far is the range for the initial positions.
   * @param {Number} spread How far does it spread.
   * @param {Boolean} conservative Determines if the initial spread is conservative or not, conservative means less.
   */
  createEmitter(x, y, range, spread, conservative) {
    // this.value valid range is 2-255 only
    if (this.value > 255) {
      this.value = 2;
    } 

    let { sourceMap, width, height, value } = this;
    let emitter = new MapEmitter(sourceMap, width, height, { x, y, value, range, spread, conservative });

    // update this.value by 1 every time
    ++this.value;

    emitter.setup();
    this.emitters.push(emitter);
  }

   /**
   * Use this to create or spawn an emitter at a random location.
   * @param {Number} range How far is the range for the initial positions.
   * @param {Number} spread How far does it spread.
   * @param {Boolean} conservative Determines if the initial spread is conservative or not, conservative means less.
   */
  createRandomEmitter(range, spread, conservative) {
    let x = Math.floor(Math.random() * this.width);
    let y = Math.floor(Math.random() * this.height);
    this.createEmitter(x, y, range, spread, conservative);
  }

  /**
   * Treat as private, initializes the source map value which is a simplified
   * version of the pixel data. Pixel data contains 4 elements per pixel (rgba), this 
   * one only contains 1 element per pixel indicating their state in the map.
   */
  _initializeSourceMap() {
    let { data : pixels } = this.sourceData;

    this.sourceMap = new Uint8Array(Math.floor(pixels.length * 0.25));
    let mapIndex = 0;

    // store a new map with only 0s and 1s where 0 means it is open
    // and 1 means it is a wall
    for (let index = 0; index < pixels.length/4; ++index) {
      let current = index * 4;
      let color = new Color(pixels[current], pixels[current+1], pixels[current+2], pixels[current+3]);
      let isWall = 1;

      // if the pixel does not match the background color pixel 
      // then, it must not be a wall
      if (!this.sourceBackgroundColor.equalTo(color)) {
        isWall = 0;
      }

      this.sourceMap[mapIndex] = isWall;
      ++mapIndex;
    }
  }

  /**
   * Treat as private, this is for faster iterations by storing the non-walls aka
   * indices of the 0 elements in the source map.
   */
  _initializeSourceMapIndices() {
    let indices = new Uint32Array(this.sourceMap.length);
    let indicesIndex = 0;

    // store all indices that are not walls
    for (let index = 0; index < this.sourceMap.length; ++index) {
      // 1 means it is a wall, hence 0, 2, and other values aren't walls
      if (this.sourceMap[index] != 1) indices[indicesIndex++] = index;
    }

    // we then copy the values and place it accordingly
    this.sourceMapIndices = new Uint32Array(indicesIndex);
    for (let index = 0; index < indicesIndex; ++index) {
      this.sourceMapIndices[index] = indices[index];
    }
  }

  /**
   * Treat as private, this initializes the targetData which will be rendered
   * to the right pixel values for the source map to appear visually.
   */
  _initializeTargetData() {
    this.targetData = new ImageData(this.sourceData.width, this.sourceData.height);
    let { data : pixels } = this.targetData;
    let [ r1, g1, b1, a1 ] = this.targetBackgroundColor.unpack();
    let [ r2, g2, b2, a2 ] = this.targetForegroundColor.unpack();

    // set the targetData to render the backgroundColor
    for (let index = 0; index < pixels.length/4; ++index) {
      let current = index * 4;
      pixels[current] = r1;
      pixels[current + 1] = g1;
      pixels[current + 2] = b1;
      pixels[current + 3] = a1; // alpha channel
    }

    // set the targetData to show the pattern with foregroundColor
    for (let index = 0; index < this.sourceMapIndices.length; ++index) {
      let current = this.sourceMapIndices[index] * 4;
      pixels[current] = r2;
      pixels[current + 1] = g2;
      pixels[current + 2] = b2;
      pixels[current + 3] = a2;
    }
  }
}

export default MapEmitterRenderer;
