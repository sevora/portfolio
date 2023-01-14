import Queue from "./Queue.js";

class MapEmitter {
  constructor(sourceMap, sourceWidth, sourceHeight, { x=0, y=0, range=20, value=2, spread=100 }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.range = range;

    this.spreadCurrent = 0;
    this.spreadLimit = spread;
    this.spreadQueue = null;

    this.isFilling = true;
    this.isFinished = false;

    this.map = sourceMap;
    this.width = sourceWidth;
    this.height = sourceHeight; 
  }

  /**
   *
   *
   */
  setup() {
    this._initializeSpreadQueue(0);
  }

  /**
   *
   */
  // flood-fill algorithm implementation, 
  // single-step only for animation
  update() {
    if (this.isFinished) return;

    if (this.spreadQueue.isEmpty || (this.isFilling && this.spreadCurrent >= this.spreadLimit)) {
      this._initializeSpreadQueue(this.value);
      this.isFilling = false;
    } 

    if (!this.isFilling && this.spreadQueue.isEmpty) {
      this.spreadCurrent = 0;
      this.isFinished = true;
      return;
    }

    let { height, width } = this;
    let index = this.spreadQueue.dequeue();
    let targetValue = this.isFilling ? 0 : this.value;
    let fillValue = this.isFilling ? this.value : 0;

    // boundary checking i.e. if the current cell has neighbors
    // the checks are for as follows: top, bottom, left, and right
    if (this.map[index] == targetValue  && 
        index >= width                  && 
        index <= width * (height-1)     &&
        (index + 1) % width != 0
        ) {

      this.map[index] = fillValue;

      this.spreadQueue.enqueue(index - width);
      this.spreadQueue.enqueue(index + width);
      this.spreadQueue.enqueue(index - 1);
      this.spreadQueue.enqueue(index + 1);

      if (this.isFilling) this.spreadCurrent++;
    }
  }
    
    // from (x, y) we want to select spots from each of the 4 cardinal directions 
    // until a spot from each of the directions is found
  _initializeSpreadQueue(targetValue) {
    this.spreadQueue = new Queue();

    let { x, y, width, height } = this;
    let index = y * width + x;
    let offset = 1;
    // let complete = 0;

    while (offset < this.range) {
      let top = index - width * offset;
      let bottom = index + width * offset;
      let left = index - offset;
      let right = index + offset;

      // boundary checking if the current element from the offset
      // is valid, it is valid if it is on the same row and column, 
      // it exists and is an empty space (equal to 0)
      if (top >= 0 && this.map[top] == targetValue) this.spreadQueue.enqueue(top);
      if (bottom <= width * height - 1 && this.map[bottom] == targetValue) this.spreadQueue.enqueue(bottom);
      if (Math.floor(left/width) == y && this.map[left] == targetValue) this.spreadQueue.enqueue(left);
      if (Math.floor(right/width) == y && this.map[right] == targetValue) this.spreadQueue.enqueue(right);

      /*
      if (top >= 0 && this.map[top] == targetValue && !(complete & 1)) {
        this.spreadQueue.enqueue(top);
        complete |= 1;
      }

      if (bottom <= width * height - 1 && this.map[bottom] == targetValue && !(complete & 2)) {
        this.spreadQueue.enqueue(bottom);
        complete |= 2;
      }

      if (Math.floor(left/width) == y && this.map[left] == targetValue && !(complete & 4)) {
        this.spreadQueue.enqueue(left);
        complete |= 4;
      }

      if (Math.floor(right/width) == y && this.map[right] == targetValue && !(complete & 8)) {
        this.spreadQueue.enqueue(right);
        complete |= 8;
      } */

      ++offset;
    }

  }
}

export default MapEmitter;
