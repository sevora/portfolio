export type onViewportChangeCallback = (isInViewport: boolean) => void

function isElementInViewport(element: HTMLElement) {
    const rectangle = element.getBoundingClientRect();
    return (
        rectangle.top >= 0 &&
        rectangle.left >= 0 &&
        rectangle.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rectangle.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

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