// import 'animate.css'; // we don't need to import this anymore
import InteractiveWatch from './InteractiveWatch';
import { EfficientViewportObserver } from './viewport';

// a vector interface
interface Vector {
    x: number;
    y: number
}

// a mouse state interface
interface MouseState {
    previous: Vector | null;
    current: Vector | null;
    pressed: boolean;
}

const SCROLL_DIFFERENCE_CHECK = 25;

const root = document.querySelector('#root')!;
const scrollable = document.querySelector('#scrollable')!;
const centerpoint = document.querySelector('#centerpoint')!;
const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d');
const watch = new InteractiveWatch();

let previousScrollTop: number = 0;
let mouseState: MouseState = { previous: null, current: null, pressed: false };
let mouseVectorLatest: Vector | null = null;

let now = Date.now();
let then = now;
let fps = isMobile() ? 60 : 120;

/**
 * This is the entrypoint of the program.
 */
async function main() {
    root.classList.remove('hidden');
    scrollable.querySelector('#centerpoint')!.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });

    // this allows us to handle scroll events efficiently for a lot of elements in a specific scenario
    const viewportObserver = new EfficientViewportObserver(scrollable, '[data-scroll-class]');

    // this handler automatically gives a boolean indicating if element is in viewport, and the element itself
    const handler = viewportObserver.onViewportChange((isInViewport, element: HTMLElement) => {
        const classes = element.dataset.scrollClass.split(' ');
        if (isInViewport) {
            element.classList.remove('hidden');
            element.classList.add(...classes);
            return
        }
        element.classList.add('hidden');
        element.classList.remove(...classes);
    });

    window.addEventListener('customscroll', handler, false);
    dispatchEvent( new CustomEvent('customscroll') );

    // this allows us to use smooth-scroll on anchor tags
    document.querySelectorAll('a.smooth-scroll').forEach((element: HTMLAnchorElement) => {

        // automatically binds click event listener for smooth scroll
        element.addEventListener('click', (event) => {
            event.preventDefault();
            
            const targetProperty = element.getAttribute('href');
            const targetElement: HTMLElement = document.querySelector(element.getAttribute('href'));
            
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            targetElement.focus({ preventScroll: true });
            viewportObserver.reset();

            // manually resetting the classes to show it as there is no callback for scrollIntoView
            centerpoint.classList.remove('hidden');
            centerpoint.classList.add(...(centerpoint as HTMLElement).dataset.scrollClass.split(' '));

            if (targetProperty === '#centerpoint') watch.resetRotation();
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
    // adjust the canvas to match device pixel ratio
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
    if (mouseState.pressed) {
        mouseState.previous = mouseState.current;
        mouseState.current = mouseVectorLatest;
    }

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
        
        // compute the change in angle 
        const deltaAngle = Math.floor(currentAngle - previousAngle);

        // if the change is not abrupt (less than 180) we can applu the rotation
        if (Math.abs(deltaAngle) < 180) {
            scrollable.scrollTop += deltaAngle;
            watch.applyRotation(deltaAngle);

            // minor optimization, ensures that customscroll is only ran whenever a set difference is met
            if (Math.abs(scrollable.scrollTop - previousScrollTop) >= SCROLL_DIFFERENCE_CHECK) {
                window.dispatchEvent( new CustomEvent('customscroll') );
                previousScrollTop = scrollable.scrollTop;
            }
        }
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
    return Math.atan2(y, x) / Math.PI * 180;
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

function isMobile() {
    let check = false;
    (function(a){ if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
};

/**
 * This is used to reset the mouse state.
 */
function resetMouseState() {
    mouseState.previous = null;
    mouseState.current = null;
    mouseState.pressed = false;
    mouseVectorLatest = null;
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
window.addEventListener('touchstart', () => {
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