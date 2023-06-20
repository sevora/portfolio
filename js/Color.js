// an implementation t0 store rgba Color values and compare them
class Color {
  /**
   * The constructor for a color object.
   * @param {Number} r Red value ranging from 0-255.
   * @param {Number} g Green value ranging from 0-255.
   * @param {Number} b Blue value ranging from 0-255.
   * @param {Number} a Alpha value ranging from 0-255.
   */
  constructor(r, g, b, a) {
    this.rgba = new Uint8Array([r, g, b, a]);
  }

  /**
   * Use this to compare for equality between colors.
   * @param {Color} otherColor Another color object.
   * @returns a boolean value indicating whether the colors are the same.
   */
  equalTo(otherColor) {
    for (let index = 0; index < 3; ++index) {
      if (otherColor.rgba[index] != this.rgba[index]) return false;
    }
    return true;
  }

  /**
   * This allows for destructuring quickly.
   * @returns an array with the components of the color.
   */
  unpack() {
    // what the fuck, don't use unpacking operator it is slow as hell
    return [ this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3] ];
  }
}

export default Color;
