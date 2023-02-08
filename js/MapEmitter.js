import Queue from "./Queue.js";

/**
 * This is an implementation of an emitter which uses a reference source map and 
 * manipulates that through a flood fill algorithm where the target value is 0 and 
 * changes it to this.value, and once it is complete, sets every this.value back to 0 
 */
class MapEmitter {
  constructor(sourceMap, sourceWidth, sourceHeight, { x=0, y=0, range=20, value=2, spread=100, conservative=false }) {
    this.x = x;         // integer (0-sourceWidth)
    this.y = y;         // integer (0-sourceHeight)
    this.value = value; // integer (0-255)
    this.range = range; // integer (0-sourceWidth)

    this.spreadCurrent = 0;
    this.spreadLimit = spread;
    this.spreadQueue = null;

    this.isConservative = conservative;
    this.isFilling = true;
    this.isFinished = false;

    this.map = sourceMap; // Uint8Array 
    this.width = sourceWidth;
    this.height = sourceHeight; 
  }

  /**
   * This sets up the MapEmitter by queing in the initial points.
   */
  setup() {
    this._initializeSpreadQueue(0);
  }

  /**
   * This is an update step that does a single step of the flood-fill algorithm.
   * @returns {void}
   */
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
    
  /**
   * from (x, y) we want to select spots from each of the 4 cardinal directions 
   * until a spot from each of the directions is found.
   * @param {Number} targetValue an integer representing a value in this.map.
   */
  _initializeSpreadQueue(targetValue) {
    this.spreadQueue = new Queue();

    let { x, y, width, height } = this;
    let index = y * width + x;
    let offset = 1;
    let complete = 0; // this is treated as an array using bit operators

    while (offset < this.range) {
      let top = index - width * offset;
      let bottom = index + width * offset;
      let left = index - offset;
      let right = index + offset;

      // boundary checking if the current element from the offset
      // is valid, it is valid if it is on the same row and column, 
      // it exists and is an empty space (equal to 0)

      if (top >= 0 && this.map[top] == targetValue && !(complete & 1)) {  // bit operator here checks 1st element of array if it exists
        this.spreadQueue.enqueue(top);
        if (this.isConservative) complete |= 1; // sets 1st element of array to true (or existing) only works if this.isConservative is true
      }

      if (bottom <= width * height - 1 && this.map[bottom] == targetValue && !(complete & 2)) {
        this.spreadQueue.enqueue(bottom);
        if (this.isConservative) complete |= 2;
      }

      if (Math.floor(left/width) == y && this.map[left] == targetValue && !(complete & 4)) {
        this.spreadQueue.enqueue(left);
        if (this.isConservative) complete |= 4;
      }

      if (Math.floor(right/width) == y && this.map[right] == targetValue && !(complete & 8)) {
        this.spreadQueue.enqueue(right);
        if (this.isConservative) complete |= 8;
      }

      ++offset;
    }

  }
}

export default MapEmitter;
