/**
 * This is a Runnable. It allows us to execute code in a game-loop.
 * We can easily set the fps and even the execution inside its tick method.
 */
class Runnable {
    now = Date.now();
    then = this.now;

    fps: number;
    frameId: number;

    /**
     * Use this to construct a runnable.
     * @param fps the frames per second that the runnable should execute (defaults to 60).
     */
    constructor(fps?: number) {
        this.fps = fps || 60;
    }

    /**
     * Use this to start the runnable.
     */
    start() {
        this._loop();
    }

    /**
     * Use this to end the runnable.
     */
    stop() {
        window.cancelAnimationFrame(this.frameId);
    }

    /**
     * This is supposed to be a private method. As you can see,
     * this handles the game loop.
     */
    _loop() {
        this.frameId = window.requestAnimationFrame( this._loop.bind(this) );

        this.now = Date.now();
        const elapsed = this.now - this.then;
        const interval = 1000/this.fps;
    
        if (elapsed > interval) {
            this.then = this.now - (elapsed % interval);
            this.tick();   
        }
    }

    /**
     * Implement or override this method. Inside here is the code that will execute 
     * every set amount of time according to the fps.
     */
    tick() {
        throw new Error("Runnable objects tick method must be overriden or implemented");
    }
}

export default Runnable;