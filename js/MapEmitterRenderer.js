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
      let { innerWidth : targetWidth, innerHeight : targetHeight } = this.window;

      canvas.width = sourceWidth;
      canvas.height = sourceHeight; 

      context.drawImage(image, 0, 0, sourceWidth, sourceHeight);
      this.data = context.getImageData(0, 0, sourceWidth, sourceHeight);
      this.targetData = new ImageData(targetWidth, targetHeight);
      context.clearRect(0, 0, sourceWidth, sourceHeight); // could be commented, maybe no performance gain here
      
      if (onLoadCallback) onLoadCallback();
    }

    image.src = this.path;
  }

  setup() {

  }

  update() {

  }

  render() {
    let originX = this.data.width / 2 - this.canvas.width / 2;
    let originY = this.data.height / 2 - this.canvas.height / 2;
    this.context.putImageData(this.data, -originX, -originY);
  }

}

export default MapEmitterRenderer;
