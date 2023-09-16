import 'animate.css';
import InteractiveWatch from './InteractiveWatch';
import onViewportChange from './onViewportChange';

interface Vector {
    x: number;
    y: number
}

interface MouseState {
    previous: Vector | null;
    current: Vector | null;
    pressed: boolean;
}

const scrollable = document.querySelector('#scrollable')!;
const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d');
const watch = new InteractiveWatch();

let mouseState: MouseState = { previous: null, current: null, pressed: false };
let mouseVectorLatest: Vector | null = null;

let now = Date.now();
let then = now;
let fps = 30;

/**
 * This is the entrypoint of the program.
 */
async function main() {
    scrollable.querySelector('#centerpoint')!.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });

    document.querySelectorAll('.smooth-scroll').forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelector(element.getAttribute('href')).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            watch.resetRotation();
        });
    });

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
 * Place your setup code here...
 */
function setup() {
    // adjust the canvas according to the device's pixel ratio
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;
    watch.computeSizesFromCanvas(canvas);
}

/**
 * This is the update code where logical update
 * steps happen.
 */
function update() {
    // update the current and previous mouse events
    mouseState.previous = mouseState.current;
    mouseState.current = mouseVectorLatest;
    
    // this is the logic to compute how much the angle of the watch has changed
    if (mouseState.pressed && mouseState.previous && mouseState.current && !watch.isResetting) {
        const canvasBoundingBox = canvas.getBoundingClientRect();
        const originX = (canvasBoundingBox.left + canvasBoundingBox.right)/2;
        const originY = (canvasBoundingBox.top + canvasBoundingBox.bottom)/2;

        const previousX = mouseState.previous.x - originX;
        const previousY =  mouseState.previous.y - originY
        const previousAngle = atan2(previousY, previousX);

        const currentX = mouseState.current.x - originX;
        const currentY =  mouseState.current.y - originY;
        const currentAngle = atan2(currentY, currentX);
        
        // convert to degrees, then limit it
        const totalAngle = (currentAngle - previousAngle) % 30;
        if ( (scrollable.scrollTop > 0) || (scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight) ) scrollable.scrollTop += totalAngle;
        watch.applyRotation(totalAngle);
    }

    // this must always be called to update the watch
    watch.update();
}

/**
 * @returns the angle (in degrees) from the X axis to a point.
 * @param y A numeric expression representing the cartesian y-coordinate.
 * @param x A numeric expression representing the cartesian x-coordinate.
 */
function atan2(y: number, x: number) {
    const radians = Math.atan2(y, x);
    const degrees = (radians > 0 ? radians : (2 * Math.PI + radians)) * 360 / (2 * Math.PI);
    return degrees;
}

/**
 * Place all your render code here...
 */
function render() {
    watch.render(context);
}

/**
 * This is the game loop which should call
 * update and render at the right time.
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

function resetMouseState() {
    mouseState.previous = null;
    mouseState.current = null;
    mouseState.pressed = false;
}

/**
 * This sets the mouse state to be pressed.
 */
window.addEventListener('mousedown', () => {
    mouseState.pressed = true;
});

/**
 * This resets the mouse state to its default values.
 */
window.addEventListener('mouseup', () => {
    resetMouseState();
    watch.applyRotation(0);
});

/**
 * This is fired when the mouse is moved, we simply save 
 * the latest mouse event.
 */
window.addEventListener('mousemove', (event: MouseEvent) => {
    mouseVectorLatest = { x: event.clientX, y: event.clientY };
});

/**
 * Mobile devices use touch events instead, same logic, this is for touching down.
 */
window.addEventListener('touchstart', (event: TouchEvent) => {
    event.preventDefault();
    mouseState.pressed = true;
}, { passive: false });

/**
 * This is for stopping the touch.
 */
window.addEventListener('touchend', () => {
    resetMouseState();
    watch.applyRotation(0);
});

/**
 * This is for when the touch is being moved.
 */
window.addEventListener('touchmove', (event: TouchEvent) => {
    event.preventDefault();
    mouseVectorLatest = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}, { passive: false })

/**
 * This prevents scrolling normally on the scrollable content.
 */
scrollable.addEventListener('wheel', (event: WheelEvent) => {
    event.preventDefault();
}, { passive: false })

window.addEventListener('load', main);