import Color from "./Color.js";
import MapEmitter from "./MapEmitter.js";
import Queue from "./Queue.js";

class MapEmitterRenderer {
  constructor(imagePath, windowElement, canvasElement, { 
    sourceBackgroundColor=new Color(0, 0, 0), 
    targetBackgroundColor=new Color(0, 0, 0),
    targetForegroundColor=new Color(255, 255, 255)
  }) {
    this.sourceData = null;
    this.targetData = null;

    this.width = null;
    this.height = null;

    // 0 - part of the board (empty)
    // 1 - wall, not fillable
    // 2 - part of the board (filled)
    this.sourceMap = null;
    this.sourceMapIndices = null;
    this.indexQueue = null;

    this.sourcePath = imagePath;
    this.sourceBackgroundColor = sourceBackgroundColor;
    this.targetBackgroundColor = targetBackgroundColor;
    this.targetForegroundColor = targetForegroundColor;

    this.emitters = [];

    this.window = windowElement;
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');

    this.isFinished = false;
  }

  /**
   * 
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
      // context.clearRect(0, 0, targetWidth, targetHeight); // could be commented, maybe no performance gain here
      
      if (onLoadCallback) onLoadCallback();
    }

    image.src = this.sourcePath;
  }

  /**
   * 
   */
  setup() {
    this._initializeSimpleMap();
    this._initializeSimpleMapIndices();
    this._initializeTargetData();
    this._initializeIndexQueue();
  }

  /**
   * 
   */
  // flood-fill algorithm that's breadth-first
  update() {
    /*
    if (this.isFinished) return;
    let scale = this.window.devicePixelRatio;
    let speed = Math.max(this.canvas.width, this.canvas.height);

    for (let times = 0; times < speed; ++times) {

      if (this.indexQueue.isEmpty) {
        let newIndex = this._getMiddlemostIndex();
        if (newIndex > -1) {
          this.indexQueue.enqueue(newIndex);
        } else {
          this.isFinished = true;
          break;
        }
        // check if all open spaces are actually gone, else get the closest one from the center
        // create a function from _initializeQueue, to reuse that new function here and there
      }

      let { height, width } = this;
      let index = this.indexQueue.dequeue();
      
      if (this.sourceMap[index] == 0) {
        this.sourceMap[index] = 2;
        this.targetData.data[index * 4 + 3] = 0; // alpha channel
        
        // top
        if (index >= width) this.indexQueue.enqueue(index - width);
        // left
        if (index % width != 0) this.indexQueue.enqueue(index - 1);
        // bottom
        if (index <= width * (height-1) + 1) this.indexQueue.enqueue(index + width);
        // right
        if (index % (width+1) != 0) this.indexQueue.enqueue(index + 1);
      }
    }

    // boundary checking
    // if okay, set to two, reflect on targetData, boundary check to add neighbors to queue
    */
  }

  /**
   * 
   */
  render() {
    this.context.putImageData(this.targetData, 0, 0);
  }

  /**
   *
   */
  spawnEmitterAt(x, y) {

  }

  /**
   * 
   */
  _initializeSimpleMap() {
    let { data : pixels } = this.sourceData;

    this.sourceMap = new Uint8Array(Math.floor(pixels.length * 0.25));
    let mapIndex = 0;

    // store a new map with only 0s and 1s where 0 means it is open
    // and 1 means it is a wall
    for (let index = 0; index < pixels.length/4; ++index) {
      let current = index * 4;
      let color = new Color(pixels[current], pixels[current+1], pixels[current+2]);
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
   *
   */
  _initializeSimpleMapIndices() {
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
   *
   */
  _getSimpleMapIndices(value) {
    let buffer = new Uint32Array(this.sourceMapIndices.length);
    let bufferIndex = 0;

    for (let index = 0; index < this.sourceMapIndices.length; ++index) {
      let simpleMapIndex = this.sourceMapIndices[index];
      let element = this.sourceMap[simpleMapIndex];
      if (element == value) buffer[bufferIndex++] = simpleMapIndex;
    }

    let result = new Uint32Array(bufferIndex);
    for (let index = 0; index < bufferIndex; ++index) {
      result[index] = buffer[index];
    }

    return result;
  }

  /**
   * 
   */
  _initializeTargetData() {
    this.targetData = new ImageData(this.sourceData.width, this.sourceData.height);
    let { data : pixels } = this.targetData;
    let [ r1, g1, b1 ] = this.targetBackgroundColor.unpack();
    let [ r2, g2, b2 ] = this.targetForegroundColor.unpack();

    // set the targetData to render the backgroundColor
    for (let index = 0; index < pixels.length/4; ++index) {
      let current = index * 4;
      pixels[current] = r1;
      pixels[current + 1] = g1;
      pixels[current + 2] = b1;
      pixels[current + 3] = 255; // alpha channel
    }

    // set the targetData to show the pattern with foregroundColor
    for (let index = 0; index < this.sourceMapIndices.length; ++index) {
      let current = this.sourceMapIndices[index] * 4;
      pixels[current] = r2;
      pixels[current + 1] = g2;
      pixels[current + 2] = b2;
    }
  }

  /**
   * 
   */
  _initializeIndexQueue() {
    this.indexQueue = new Queue();
    // this.indexQueue.enqueue( this._getMiddlemostIndex() );
  }

  /**
   * 
   */
  _getMiddlemostIndex() {
    let openIndices = this._getSimpleMapIndices(0);
    if (openIndices.length == 0) return -1;
    let middle = Math.round( (openIndices.length - 1) * 0.5 );
    return openIndices[middle];
  }
}

export default MapEmitterRenderer;
