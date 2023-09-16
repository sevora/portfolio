import loadImage from './loadImage';

//
type InteractiveWatchPart = "body" | "hour" | "minute" | "second";

//
type InteractiveWatchImagePaths = { [part in InteractiveWatchPart]: string; }
type InteractiveWatchImages = { [part in InteractiveWatchPart]: HTMLImageElement; }
type InteractiveWatchRotations = { [part in InteractiveWatchPart]: number }

class InteractiveWatch {
    //
    static DEGREES_PER_SECOND = 360/60;
    static DEGREES_PER_MINUTE = 360/60;
    static DEGREES_PER_HOUR = 360/12;

    // these images must all have exactly the same dimensions
    images: InteractiveWatchImages = { body: new Image(), hour: new Image(), minute: new Image(), second: new Image() };
    rotations: InteractiveWatchRotations = { body: 0, hour: 0, minute: 0, second: 0 }

    baseHour: number = 0;

    width: number = 0;
    height: number = 0;

    velocity: number = 0;

    /**
     * 
     * @param paths 
     */
    async load(paths: InteractiveWatchImagePaths) {
        for (const part in paths) {
            let partTyped = part as InteractiveWatchPart;
            this.images[partTyped] = await loadImage(paths[partTyped]);
        }
    }

    /**
     * 
     * @param canvas 
     */
    computeSizesFromCanvas(canvas: HTMLCanvasElement) {
        const { body } = this.images;
        const scale = Math.min(canvas.width/body.width, canvas.height/body.height);

        this.width = body.width * scale;
        this.height = body.height * scale;
    }

    /**
     * 
     * @param velocity 
     * @param adjustToOneSecondDegree - by default, 1 unit = 1 degree. if set to true, 1 unit = 6 degrees
     */
    applyVelocity(velocity: number, adjustToOneSecondDegree?: true) {
        this.velocity = velocity * (adjustToOneSecondDegree ? 1 : 1/InteractiveWatch.DEGREES_PER_SECOND);
    }

    /**
     * 
     */
    update() {
        const { rotations } = this;
        rotations.second += Math.floor(InteractiveWatch.DEGREES_PER_SECOND * this.velocity);
        
        // minute hand has snappy changes
        rotations.minute = Math.floor(rotations.second / InteractiveWatch.DEGREES_PER_SECOND / 60) * InteractiveWatch.DEGREES_PER_MINUTE;

        // hour hand has smooth changes
        rotations.hour = (rotations.minute / InteractiveWatch.DEGREES_PER_MINUTE / 60) * InteractiveWatch.DEGREES_PER_HOUR;
    
        // reset rotation of seconds to 0 when it reaches 12 hours total
        rotations.second %= InteractiveWatch.DEGREES_PER_SECOND * 60 * 60 * 12;
        this.velocity = Math.floor(this.velocity * 0.001);
    }

    /**
     * 
     * @param context 
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



export default InteractiveWatch;