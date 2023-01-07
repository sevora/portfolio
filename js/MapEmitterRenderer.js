class MapEmitterRenderer {
  constructor(imagePath, backgroundColor, windowElement, canvasElement) {
    this.data = null;
    this.path = imagePath;
    this.background = backgroundColor;

    this.window = windowElement;
    this.canvas = canvasElement;
    
    this.context = canvasElement.getContext('2d');
  }

  loadAndStart() {
    let image = new Image();
    image.crossOrigin = '*';

    image.onload = () => {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      let { width, height } = image;
      let { innerWidth, innerHeight } = this.window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;

      /* Fit to screen
      let isLandscape = innerWidth > innerHeight;
      let aspectRatio = isLandscape ? innerHeight/innerWidth : innerWidth/innerHeight;

      width = isLandscape ? innerWidth : height * aspectRatio;
      height = isLandscape ? width * aspectRatio : innerHeight;
      */

      context.drawImage(image, 0, 0, width, height);
      this.data = context.getImageData(0, 0, width, height);
      context.clearRect(0, 0, width, height); // could be commented, depends on performance

      this._setup();
      this._loop();
    }

    image.src = this.path;
  }

  _setup() {
    console.log(this.data);
    this.context.putImageData(this.data, 0, 0);
  }

  _loop() {
    this.window.requestAnimationFrame( this._loop.bind(this) );
    this._update();
    this._render();
  }

  _update() {

  }

  _render() {

  }

}

export default MapEmitterRenderer;
