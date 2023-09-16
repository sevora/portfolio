import 'animate.css';
import InteractiveWatch from './InteractiveWatch';
import onViewportChange from './onViewportChange';

interface MouseState {
    previous: MouseEvent | null;
    current: MouseEvent | null;
    pressed: boolean;
}

const scrollable = document.querySelector('#scrollable')!;
const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d');
const watch = new InteractiveWatch();

let mouseState: MouseState = { previous: null, current: null, pressed: false };
let mouseEventLatest: MouseEvent | null = null;

let now = Date.now();
let then = now;
let fps = 30;

/**
 * 
 */
async function main() {
    scrollable.querySelector('#centerpoint')!.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });

    // all the images must have the same size and that the hands are centered
    // in place as if the watch and the other hands are simply invisible
    await watch.load({ 
        body: '/assets/watch/body.png',
        hour: '/assets/watch/hour.png',
        minute: '/assets/watch/minute.png',
        second: '/assets/watch/second.png'
    });

    setup();
    loop();
}

/**
 * 
 */
function setup() {
    // adjust the canvas according to the device's pixel ratio
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;
    watch.computeSizesFromCanvas(canvas);
}

/**
 * 
 */
function update() {
    // update the mouse state
    mouseState.previous = mouseState.current;
    mouseState.current = mouseEventLatest;
    
    if (mouseState.pressed && mouseState.previous && mouseState.current) {
        const canvasBoundingBox = canvas.getBoundingClientRect();
        const originX = (canvasBoundingBox.left + canvasBoundingBox.right)/2;
        const originY = (canvasBoundingBox.top + canvasBoundingBox.bottom)/2;

        const previousX = mouseState.previous.clientX - originX;
        const previousY =  mouseState.previous.clientY - originY
        const previousAngle = atan2(previousY, previousX);

        const currentX = mouseState.current.clientX - originX;
        const currentY =  mouseState.current.clientY - originY;
        const currentAngle = atan2(currentY, currentX);
        
        // convert to degrees, then limit it
        const totalAngle = (currentAngle - previousAngle) % 30;
        if (
            (scrollable.scrollTop > 0) ||
            (scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight)
        ) 
            scrollable.scrollTop += totalAngle;
        watch.applyVelocity(totalAngle);
    }

    watch.update();
}

function atan2(y: number, x: number) {
    const radians = Math.atan2(y, x);
    const degrees = (radians > 0 ? radians : (2 * Math.PI + radians)) * 360 / (2 * Math.PI);
    return degrees;
}

/**
 * 
 */
function render() {
    watch.render(context);
}

/**
 * 
 */
function loop() {
    window.requestAnimationFrame(loop);

    now = Date.now();
    const elapsed = now - then;
    const interval = 1000/fps;

    if (elapsed > interval) {
        then = now - (elapsed % interval);
        update();
        render();
    }
}

/**
 * 
 * @param value 
 * @param min 
 * @param max 
 * @returns 
 */
function limit(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
}

/**
 * 
 */
window.addEventListener('mouseup', () => {
    mouseState.previous = null;
    mouseState.current = null;
    mouseState.pressed = false;
    watch.applyVelocity(0);
});

/**
 * 
 */
window.addEventListener('mousedown', () => {
    mouseState.pressed = true;
});

/**
 * 
 */
window.addEventListener('mousemove', (event: MouseEvent) => {
    mouseEventLatest = event;
});

scrollable.addEventListener('wheel', (event: WheelEvent) => {
    event.preventDefault();
}, { passive: false })

main();