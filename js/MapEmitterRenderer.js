class MapEmitterRenderer {
  constructor(imagePath, backgroundColor, windowElement, canvasElement) {
    this.data = null;
    this.targetData = null;

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
      this.targetData = new ImageData(targetWidth, targetHeight);
      context.clearRect(0, 0, targetWidth, targetHeight); // could be commented, maybe no performance gain here
      
      if (onLoadCallback) onLoadCallback();
    }

    image.src = this.path;
  }

  setup() {
    let pixels = this.targetData.data;
    for (let index = 0; index < pixels.length/4; ++index) {
      let [ redValue, greenValue, blueValue ] = this.background;
      let current = index * 4;
      pixels[current] = redValue;
      pixels[current + 1] = greenValue;
      pixels[current + 2] = blueValue;
      pixels[current + 3] = 255; // alpha channel
    }
  }

  update() {

  }

  render() {
    this.context.putImageData(this.data, 0, 0);
  }

}

export default MapEmitterRenderer;
