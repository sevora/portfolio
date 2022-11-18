class CanvasViewport {
  static isElementInViewport(element) {
    let rectangle = element.getBoundingClientRect();

    return (
      rectangle.top >= -rectangle.height &&
      rectangle.bottom <= window.innerHeight + rectangle.height
    );
  }

  constructor(moveGenerators) {
    this.moveGenerators = moveGenerators;
    this.queueGenerator = [];

    // animation-frames related
    this.frameInterval = 1000 / 60;
    this.frameStartTime = 0; 
    this.frameTimeNow = 0; 
    this.frameThenTime = 0;
    this.isRunning = false;

    // DOM-elements and related values
    this.root = document.body;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.classList.add("canvas-viewport");

    // event listeners for the DOM-elements
    this.onResize();
    // window.addEventListener("resize", () => this.onResize() );
    this.root.addEventListener("scroll", () => this.onScroll() );

    // ran only once to support devices with different DPI
    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height; 
       
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  getWindowSize() {
    return [ window.innerWidth, document.body.scrollHeight ];
  }

  onResize(_event) {
    this.setSize(...this.getWindowSize());
  }

  onScroll(_event) {
    this.canvas.scrollTo(0, Math.min(this.root.scrollTop, this.height) );
  }

  instantiateDOM() {
    this.root.appendChild(this.canvas);
  }

  start() {
    this.frameThenTime = Date.now();
    this.frameStartTime = this.frameThenTime;
    this.isRunning = true;
    this.loop();
  }

  loop() {
    if (!this.isRunning) return;
    requestAnimationFrame( () => this.loop() );

    this.frameNowTime = Date.now();
    let elapsedTime = this.frameNowTime - this.frameThenTime;
    
    if (elapsedTime >= this.frameInterval) {
      this.frameThenTime = this.frameNowTime - (elapsedTime % this.frameInterval);
      this.update();
      this.render();
    }
  }

  update() {
    /*for (let moveGenerator of this.moveGenerators) {

      if (!moveGenerator.isDone() && 
          !this.queueGenerator.includes(moveGenerator) && 
          CanvasViewport.isElementInViewport(moveGenerator.element) ) {
          this.queueGenerator.push(generator);
      }

    }*/

  }

  render() {
    this.context.clearRect(0, 0, this.width, this.height);
    let hasRenderedElement = false;

    for (let moveGenerator of this.moveGenerators) {
      if ( !CanvasViewport.isElementInViewport(moveGenerator.element) ) {
        if (hasRenderedElement) break;
        continue;
      }
      moveGenerator.render(this.context);
      hasRenderedElement = true;
    }
  }

  stop() {
    this.isRunning = false;
  }

}

export default CanvasViewport;
