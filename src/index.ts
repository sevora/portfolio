import 'animate.css';
import { SCROLL_DIFFERENCE_CHECK } from './settings';
import { atan2 } from './math';
import { isMobile } from './mobile';
import { EfficientViewportObserver } from './viewport';
import { InteractiveWatch } from './watch';

// these are all the DOM
const root = document.querySelector('#root')!;
const scrollable = document.querySelector('#scrollable')!;
const centerpoint = document.querySelector('#centerpoint')!;
const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d');

// finally this is a scroll-related variable
let previousScrollTop: number = 0;

// these are mouse-state related variables
let mouseState: MouseState = { previous: null, current: null, pressed: false };
let mouseVectorLatest: Vector | null = null;

// these are game-loop related variables
let now = Date.now();
let then = now;
let fps = isMobile() ? 60 : 120;

// these are our custom objects
const watch = new InteractiveWatch();
const animationObserver = new EfficientViewportObserver(scrollable, '[data-scroll-class]', findCenterpoint);
const latestObserver = new EfficientViewportObserver(document, '#scrollable > *', findCenterpoint);

/**
 * This is the entrypoint of the program's game loop,
 * we can set up other things here as well related to the DOM.
 */
async function main() {            
    root.classList.remove('hidden');
    centerpoint.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });

    attachEventListeners();
    dispatchEvent( new CustomEvent('customscroll') );
    
    // this might take a while
    await watch.load({ 
        body: '/assets/watch/body.png', 
        hour: '/assets/watch/hour.png', 
        minute: '/assets/watch/minute.png', 
        second: '/assets/watch/second.png' 
    });

    canvas.classList.remove('hidden');

    // so we want to grab the attention of the user
    // with a turn animation
    canvas.classList.add('animate__animated');
    canvas.classList.add('animate__rotateIn');

    setup();
    loop();
}

/**
 * Setup code for canvas elements, where we setup 
 * canvas-related functionalities.
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

        // we compute the angle of the previous location of our touch/mouse
        const previousX = mouseState.previous.x - originX;
        const previousY =  mouseState.previous.y - originY
        const previousAngle = atan2(previousY, previousX);

        // we compute the angle of the current location of our touch/mouse
        const currentX = mouseState.current.x - originX;
        const currentY =  mouseState.current.y - originY;
        const currentAngle = atan2(currentY, currentX);
        
        const deltaAngle = Math.floor(currentAngle - previousAngle);

        // if the change is not abrupt (less than 180) we can applu the rotation
        if (Math.abs(deltaAngle) < 180) {
            scrollable.scrollTop += deltaAngle;
            watch.applyDial(deltaAngle);

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
 * This is where the render code is placed, where
 * objects are rendered unto the canvas.
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

/**
 * This is used to reset the mouse state.
 */
function resetMouseState() {
    mouseState.previous = null;
    mouseState.current = null;
    mouseVectorLatest = null;
    mouseState.pressed = false;
}

/**
 * Attach all the event listeners for this site.
 */
function attachEventListeners() {
    // this allows us to use smooth-scroll on anchor tags
    document.querySelectorAll('a.smooth-scroll').forEach((element: HTMLAnchorElement) => {

        // automatically binds click event listener for smooth scroll
        element.addEventListener('click', (event) => {
            event.preventDefault();

            // we get the target property and the actual element it is referring to
            const targetProperty = element.getAttribute('href');
            const targetElement: HTMLElement = document.querySelector( element.getAttribute('href') );
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            targetElement.focus({ preventScroll: true });
            
            // the following lines should only apply to the centerpoint
            if (targetProperty !== '#centerpoint') return;
            
            // manually resetting the classes to show it as there is no callback for scrollIntoView
            animationObserver.resetAnchor();
            latestObserver.resetAnchor();
            targetElement.classList.remove('hidden');
            targetElement.classList.add(...(targetElement as HTMLElement).dataset.scrollClass.split(' '));
            watch.resetDial();
        });
    });

     // this sets the mouse state to be pressed. 
    window.addEventListener('mousedown', () => {
        mouseState.pressed = true;
    });

    // his resets the mouse state to its default values 
    window.addEventListener('mouseup', () => {
        resetMouseState();
        watch.applyDial(0);
    });

    // This is fired when the mouse is moved, we simply save 
    // the latest mouse event.
    window.addEventListener('mousemove', (event: MouseEvent) => {
        mouseVectorLatest = { x: event.clientX, y: event.clientY };
    });

    // mobile devices use touch events instead, same logic, this is for touching down.    
    window.addEventListener('touchstart', () => {
        mouseState.pressed = true;
    }, { passive: false });

    // this is for stopping the touch.
    window.addEventListener('touchend', () => {
        resetMouseState();
        watch.applyDial(0);
    });

    // this is for when touching the screen
    window.addEventListener('touchmove', (event: TouchEvent) => {
        event.preventDefault();
        mouseVectorLatest = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: false })

    // This prevents scrolling normally on the scrollable content
    scrollable.addEventListener('wheel', (event: WheelEvent) => {
        event.preventDefault();
    }, { passive: false })

    // trigger resize event when orientation changes. 
    window.addEventListener('orientationchange', () => window.dispatchEvent(new Event('resize')) );

    // this is for our animation on custom scroll event
    window.addEventListener('customscroll', animationObserver.onViewportChange( (isInViewport, element: HTMLElement) => {
        const classes = element.dataset.scrollClass.split(' ');
        
        // if element is in viewport we make it visible and apply animation 
        if (isInViewport) {
            element.classList.remove('hidden');
            element.classList.add(...classes);
            return
        }

        // otherwise, we hide it and remove the animation classes
        element.classList.add('hidden');
        element.classList.remove(...classes);
    }), false);

    // we also ensure that the latest observer is updated everytime customscroll is dispatched
    window.addEventListener('customscroll', latestObserver.onViewportChange(() => null));

    // handle resizing by scrolling on the last viewed element
    window.addEventListener('resize', () => {
        latestObserver.getAnchor().scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    });
}

/**
 * This is used as a callback function for EfficientViewportObserver,
 * and it finds the index of the centerpoint.
 */
function findCenterpoint(elements: Element[]) {
    for (let index = 0; index < elements.length; ++index) {
        const element = elements[index];
        if (element === centerpoint) return index;
    }
    return -1;
}

/**
 * Call the main function when the 
 * page loads.
 */
window.addEventListener('load', main);