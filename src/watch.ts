import { loadImage } from './image';

// these are the components of the watch
type InteractiveWatchPart = "body" | "hour" | "minute" | "second";

// enumerated types from a part
type InteractiveWatchImagePaths = { [part in InteractiveWatchPart]: string; }
type InteractiveWatchImages = { [part in InteractiveWatchPart]: HTMLImageElement; }
type InteractiveWatchRotations = { [part in InteractiveWatchPart]: number }

class InteractiveWatch {
    // these are constants that is used by this class in order to properly compute values
    static DEGREES_PER_SECOND = 360/60;
    static DEGREES_PER_MINUTE = 360/60;
    static DEGREES_PER_HOUR = 360/12;

    // the rate of how much the clock resets per frame
    static RESET_TURN_RATE = 0.01;

    // the total number of turns the watch has
    totalTurn: number = 0;

    // these images must all have exactly the same dimensions
    images: InteractiveWatchImages = { body: new Image(), hour: new Image(), minute: new Image(), second: new Image() };
    rotations: InteractiveWatchRotations = { body: 0, hour: 0, minute: 0, second: 0 }

    // these are base values that will be captured and changed accordingly
    baseTurns: number = 0;
    baseHour: number = 0;

    // this is here to save computational power by storing the width and height that 
    // shouldn't change
    width: number = 0;
    height: number = 0;

    // refers to the velocity of the second-hand
    velocity: number = 0;

    // refers to if the watch is being reset
    isResetting: boolean = false;

    /**
     * Use this to load the watch part images.
     * @param paths the paths/URLs of each watch part
     */
    async load(paths: InteractiveWatchImagePaths) {
        for (const part in paths) {
            let partTyped = part as InteractiveWatchPart;
            this.images[partTyped] = await loadImage(paths[partTyped]);
        }
    }

    /**
     * Use this to precompute the sizes it will use for rendering.
     * @param canvas the canvas element from which it should be rendered from.
     */
    computeSizesFromCanvas(canvas: HTMLCanvasElement) {
        const { body } = this.images;
        const scale = Math.min(canvas.width/body.width, canvas.height/body.height);

        this.width = body.width * scale;
        this.height = body.height * scale;
    }

    /**
     * Use this to reset the rotation of the watch, 
     * should trigger rotation inverse direction to get to 0.
     * Can be instantaneous as well.
     */
    resetDial(instant?: true) {
        if (instant) {
            this.totalTurn = 0;
            this.isResetting = false;
            return;
        }

        this.isResetting = true;
        this.baseTurns = Math.abs(this.totalTurn);
    }

    /**
     * Use this to rotate the watch dial with animation.
     * @param unit how much to rotate.
     * @param adjustToOneSecondDegree by default, 1 unit = 1 degree. if set to true, 1 unit = 6 degrees
     */
    applyDial(unit: number, adjustToOneSecondDegree?: true) {
        this.velocity = unit * (adjustToOneSecondDegree ? 1 : 1/InteractiveWatch.DEGREES_PER_SECOND);
    }

    /**
     * This is the logical update of this object.
     * Must be called during the update stage.
     */
    update() {
        const { rotations } = this;

        if (this.isResetting) {
            let repetitions = 0;

            // when resetting, we use 1% of the base rotations per frame 
            while (repetitions < this.baseTurns * InteractiveWatch.RESET_TURN_RATE) {
                this.totalTurn -= Math.sign(this.totalTurn);

                // if it reaches 0, regardless of whether repetitions has been
                // met, the reset is done and we have to break the loop
                if (this.totalTurn === 0) {
                    this.isResetting = false;
                    break;
                }
                ++repetitions;
            }
        }

        // if it isn't resetting we can do this
        if (!this.isResetting) this.totalTurn += Math.floor(InteractiveWatch.DEGREES_PER_SECOND * this.velocity);
        
        // second hand reflects total turn
        rotations.second = this.totalTurn;

        // minute hand has snappy changes
        rotations.minute = Math.floor(rotations.second / InteractiveWatch.DEGREES_PER_SECOND / 60) * InteractiveWatch.DEGREES_PER_MINUTE;

        // hour hand has smooth changes
        rotations.hour = (rotations.minute / InteractiveWatch.DEGREES_PER_MINUTE / 60) * InteractiveWatch.DEGREES_PER_HOUR;
    
        // reset rotation of seconds to 0 when it reaches 12 hours total
        rotations.second %= InteractiveWatch.DEGREES_PER_SECOND * 60 * 60 * 12;
        this.velocity = Math.floor(this.velocity * 0.001);
    }

    /**
     * Use this to render the object into the canvas.
     * @param context the canvas context where it would be rendered on.
     */
    render(context: CanvasRenderingContext2D) {
        const { width, height } = this;
        const { canvas } = context;

        // clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height)

        for (const key in this.images) {
            const image = this.images[key as keyof InteractiveWatchImages];
            const rotation = this.rotations[key as keyof InteractiveWatchRotations];

            context.save();
            context.translate(canvas.width/2, canvas.height/2);
            context.rotate(rotation * Math.PI / 180);
            context.drawImage(image, 0, 0, image.width, image.height, -width/2, -height/2, width, height);
            context.restore();
        }

    }
}

export { InteractiveWatch };