class MapWalkerRenderer {
  constructor(imagePath, canvasElement, { walkerSize, walkerSpeed }) {
    this.path = imagePath;
    this.data = null;
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
      context.drawImage(image, 0, 0, width, height);
      this.data = context.getImageData(0, 0, width, height);
      // context.clearRect(0, 0, width, height);

      this._setup();
      this._loop();
    }

    image.src = this.path;
  }

  _setup() {

  }

  _loop() {
    window.requestAnimationFrame( this._loop.bind(this) );
    this._update();
    this._render();
  }

  _update() {

  }

  _render() {

  }

}

export default MapWalkerRenderer;
