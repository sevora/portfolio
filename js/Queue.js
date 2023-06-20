// O(1) implementation of a Queue in JavaScript
// Copied from the internet by the way
class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }

  /**
   * Use to add elements in the queue.
   * @param {*} element The element to add in the queue.
   */
  enqueue(element) {
    this.elements[this.tail++] = element;
  }

  /**
   * Use to get the next element as defined on how a queue works.
   * @returns The oldest element in the queue, removed from the queue.
   */
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head++];
    return item;
  }

  /**
   * Use to get the next element without removal in the queue.
   * @returns the oldest element in the queue, but not removed.
   */
  peek() {
    return this.elements[this.head];
  }

  /**
   * Getter for the length of the queue, returns a Number.
   */
  get length() {
    return Math.max(this.tail - this.head, 0);
  }

  /**
   * Getter to check if the queue is empty or not, returns a boolean.
   */
  get isEmpty() {
    return this.length == 0;
  }
}

export default Queue;
