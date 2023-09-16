export type onViewportChangeCallback = (isInViewport: boolean) => void;

// this adjusts the isElementInViewport function condition by a set amount
const ADJUST_TOP_HEIGHT_REQUIREMENT = 100;

/**
 * Use this to determine whether an element is in viewpoer or not.
 * @param element an HTMLElement.
 * @returns a boolean indicating whether said HTMLElement is in the viewpoint.
 */
function isElementInViewport(element: HTMLElement) {
    const rectangle = element.getBoundingClientRect();

    return rectangle.bottom > 0 &&
           rectangle.right > 0 &&
           rectangle.left < (window.innerWidth || document.documentElement.clientWidth) &&
           rectangle.top + ADJUST_TOP_HEIGHT_REQUIREMENT < (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * Use this to create a handler that will only call the callback when element
 * is in viewport.
 * @param element an HTMLElement.
 * @param callback the callback function when element goes in/out of viewport.
 * @returns 
 */
function onViewportChange(element: HTMLElement, callback: onViewportChangeCallback) {
    let previousState: boolean;

    return () => {
        let currentState = isElementInViewport(element);
        if (currentState != previousState) {
            previousState = currentState;
            callback(currentState);
        }
    }
}

export default onViewportChange;