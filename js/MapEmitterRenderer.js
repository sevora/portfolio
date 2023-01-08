import Queue from "./Queue.js";

class MapEmitterRenderer {
  constructor(imagePath, backgroundColor, windowElement, canvasElement) {
    this.data = null;
    this.targetData = null;

    this.map = null
    this.queue = null;

    this.path = imagePath;
    this.background = backgroundColor;

    this.window = windowElement;
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
  }

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
      this.data = context.getImageData(0, 0, targetWidth, targetHeight);
      context.clearRect(0, 0, targetWidth, targetHeight); // could be commented, maybe no performance gain here
      
      if (onLoadCallback) onLoadCallback();
    }

    image.src = this.path;
  }

  setup() {
    this._initializeTargetData();
    this._initializeMap();
    this._initializeQueue();
  }

  // flood-fill algorithm that's breadth-first
  update() {
    if (this.queue.isEmpty) {
      // check if all open spaces are actually gone, else get the closest one from the center
      // create a function from _initializeQueue, to reuse that new function here and there
      return;
    }

    let { height, width } = this.data;
    let index = this.queue.dequeue();
    let y = Math.floor(index / width);
    let x = index % width;

    // boundary checking
    // if okay, set to two, reflect on targetData, add neighbors to queue
  }

  render() {
    this.context.putImageData(this.targetData, 0, 0);
  }

  _initializeTargetData() {
    this.targetData = new ImageData(this.data.width, this.data.height);
    let { data : pixels } = this.targetData;

    // set the targetData to render the background color
    for (let index = 0; index < pixels.length/4; ++index) {
      let [ redValue, greenValue, blueValue ] = this.background;
      let current = index * 4;
      pixels[current] = redValue;
      pixels[current + 1] = greenValue;
      pixels[current + 2] = blueValue;
      pixels[current + 3] = 255; // alpha channel
    }
  }

  _initializeMap() {
    let { data : pixels } = this.data;

    this.map = new Uint8Array(pixels.length);
    let mapIndex = 0;

    // store a new map with only 0s and 1s where 0 means it is open
    // and 1 means it is a wall
    for (let index = 0; index < pixels.length/4; ++index) {
      let [ redValue, greenValue, blueValue ] = this.background;
      let current = index * 4;
      
      let red = pixels[current];
      let green = pixels[current + 1];
      let blue = pixels[current + 2];

      let isWall = 1;

      // if the pixel does not match the background color pixel 
      // then, it must not be a wall
      if (red != redValue || green != greenValue || blue != blueValue) {
        isWall = 0;
      }

      this.map[mapIndex] = isWall;
      ++mapIndex;
    }
  }

  _initializeQueue() {
    this.queue = new Queue();

    let openIndices = new Int32Array(this.map.length);
    let openIndicesIndex = 0;

    for (let index = 0; index < this.map.length; ++index) {
      if (this.map[index] == 0) openIndices[openIndicesIndex++] = index;
    }

    this.queue.enqueue( openIndices[Math.round( (openIndicesIndex - 1)/2 )] );
  }
}

export default MapEmitterRenderer;
