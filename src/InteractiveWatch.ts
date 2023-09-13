import loadImage from './loadImage';

//
type InteractiveWatchParts = "body" | "hour" | "minute" | "second";

//
type InteractiveWatchImagePaths = { [part in InteractiveWatchParts]: string; }

//
type InteractiveWatchImages = { [part in InteractiveWatchParts]: HTMLImageElement; }

class InteractiveWatch {
    // these must all have exactly the same sizes
    images: InteractiveWatchImages = { body: new Image(), hour: new Image(), minute: new Image(), second: new Image() };

    /**
     * 
     */
    async load(paths: InteractiveWatchImagePaths) {
        for (const part in paths) {
            let partTyped = part as InteractiveWatchParts;
            this.images[partTyped] = await loadImage(paths[partTyped]);
        }
    }
    
    /**
     * 
     * @param context 
     */
    render(context: CanvasRenderingContext2D) {
        const { body, hour, minute, second } = this.images;
        const { canvas } = context;

        const scale = Math.min(canvas.width/body.width, canvas.height/body.height);
        const scaledWidth = body.width * scale;
        const scaledHeight = body.height * scale;

        context.save();
        context.translate(canvas.width/2, canvas.height/2);
        context.drawImage(body, 0, 0, body.width, body.height, -scaledWidth/2, -scaledHeight/2, scaledWidth, scaledHeight);


        context.restore();
    }
}

export default InteractiveWatch;