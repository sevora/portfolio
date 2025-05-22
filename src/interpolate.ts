import Runnable from "./runnable";

/**
 * Allows us to interpolate values and run 
 */
class Interpolator {
    // these are the actual values we'll be using in an interpolation
    startValue: number;
    endValue: number;
    currentValue: number = 0;

    // these are the values from a simpler number line we'll be using in an interpolation
    progress: number;
    total: number;

    // an instance of a runnable
    runnable: Runnable;

    /**
     * Use this to create an interpolator.
     * @param startValue the value from which the interpolator should start (or a1)
     * @param endValue the value from which the interpolator should end up with (or b1)
     * @param progress this is the current progress of the interpolator according to the total (or a2)
     * @param total this is the value that the progress should reach up to (or b2)
     */
    constructor(startValue: number, endValue: number, progress: number, total: number) {
        this.startValue = startValue;
        this.endValue = endValue;
        
        this.progress = progress;
        this.total = total;

        this.runnable = new Runnable();

        this.runnable.tick = () => {
            // this is where you'll understand how the interpolation works
            const range = (this.endValue - this.startValue);
            this.callback( this.startValue + (range / this.total) * this.progress );
    
            // since this is inside a tick method, this should run until it is stopped
            if (this.progress < this.total)
                ++this.progress;
            else 
                this.runnable.stop();
            
        }
    }

    /**
     * Use this to set the range of an interpolator. Remember the current value in the callback 
     * goes from includes startValue-endValue (inclusive).
     * @param startValue the new start value or null to retain.
     * @param endValue the new end value or null to retain.
     */
    setRange(startValue: number | null, endValue: number | null) {
        if (startValue != null) this.startValue = startValue;
        if (endValue != null) this.endValue = endValue;
        this.progress = 0;
    }

    /**
     * Use this to run the interpolator. It will end automatically 
     * according to progress and total.
     */
    run() {
        this.runnable.start();
    }

    /**
     * This is the callback for when the interpolator is running.
     * @param _currentValue a value from startValue-endValue (inclusive)
     */
    callback(_currentValue: number) {
        throw new Error("Interpolator callback must be overriden or implemented")
    }
}

export default Interpolator;