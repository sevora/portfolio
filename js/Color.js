class Color {
  constructor(r, g, b, a) {
    this.rgba = new Uint8Array([r, g, b, a]);
  }

  equalTo(otherColor) {
    for (let index = 0; index < 3; ++index) {
      if (otherColor.rgba[index] != this.rgba[index]) return false;
    }
    return true;
  }

  unpack() {
    return [ this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3] ];
  }
}

export default Color;
