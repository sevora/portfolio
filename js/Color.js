class Color {
  constructor(r, g, b) {
    this.rgb = new Uint8Array([r, g, b]);
  }

  equalTo(otherColor) {
    for (let index = 0; index < 3; ++index) {
      if (otherColor.rgb[index] != this.rgb[index]) return false;
    }
    return true;
  }

  unpack() {
    return [ this.rgb[0], this.rgb[1], this.rgb[2] ];
  }
}

export default Color;
