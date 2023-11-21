export type onViewportChangeCallback = (isInViewport: boolean, element: Element) => void;

/**
 * Use this to determine whether an element is in viewpoer or not.
 * @param element an Element.
 * @returns a boolean indicating whether said Element is in the viewpoint.
 */
function isElementInViewport(element: Element) {
    const rectangle = element.getBoundingClientRect();
    
    return rectangle.bottom > 0 &&
           rectangle.right > 0 &&
           rectangle.left < (window.innerWidth || document.documentElement.clientWidth) &&
           rectangle.top < (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * Use this to create a handler that will only call the callback when element
 * is in viewport.
 * @param element an HTMLElement.
 * @param callback the callback function when element goes in/out of viewport.
 * @returns 
 */
function onViewportChange(element: Element, callback: onViewportChangeCallback) {
    let previousState: boolean;

    return () => {
        let currentState = isElementInViewport(element);
        if (currentState != previousState) {
            previousState = currentState;
            callback(currentState, element);
        }
    }
}

/**
 * Efficiently checks viewport by limiting the checks to 3 elements only, 
 * regardless of how many elements there are.
 */
class EfficientViewportObserver {
    children: Element[] = [];
    anchorIndex: number = -1;
    originalAnchorIndex: number = -1;
    previousStates: boolean[] = [];

    /**
     * Creates an efficient viewport observer
     * @param parentElement The parent element of the elements to observe
     * @param query The query string so the children will be selected
     */
    constructor(parentElement: Element | Document, query: string, matchAnchorIndex?: (elements: Element[]) => number) {
        this.children = Array.from( parentElement.querySelectorAll(query) );
        
        // we can use a matchAnchorIndex to get the anchor
        if (matchAnchorIndex) this.anchorIndex = matchAnchorIndex(this.children);
        if (this.anchorIndex === -1) this._computeAnchorIndex();
        
        this._initializePreviousStates();
        this.originalAnchorIndex = this.anchorIndex;
    }

    /**
     * Use this to assume an anchor index instead.
     * This works by checking which element is in the viewport
     * at the time of being called.
     */
    _computeAnchorIndex() {
        for (let index = 0; index < this.children.length; ++index) {
            const child = this.children[index];
            if ( isElementInViewport(child) ) {
                this.anchorIndex = index;
                break;
            }
        }
    }

    _initializePreviousStates() {
        for (let index = 0; index < this.children.length; ++index) {
            this.previousStates.push(false);
        }
    }

    /**
     * Use this to retrieve the anchor element.
     * @returns the element that is the anchor.
     */
    getAnchor() {
        return this.children[this.anchorIndex];
    }

    /**
     * Resets the anchorIndex to the originalAnchorIndex,
     * used when resetting scroll back to beginning
     */
    resetAnchor() {
        this.anchorIndex = this.originalAnchorIndex;
    }

    /**
     * Use this to create an efficient handler for viewport change on multiple elements.
     * @param callback a callback function called whenever the viewport changes.
     * @returns a handler function.
     */
    onViewportChange(callback: onViewportChangeCallback) {
        return () => {
            let resultingAnchorIndex = -1;

            // as you can see we go through all the elements we targeted
            for (let index = 0; index < this.children.length; ++index) {
                const element = this.children[index];

                // if the element is the anchor, we can assume that it is in the viewport
                if (index === this.anchorIndex) {
                    if (this.previousStates[index] !== true) {
                        callback(true, element);
                        this.previousStates[index] = true;
                    }

                    continue;
                }

                // if the element is a neighbor of anchor, we have to check if it is in the viewport
                if (index === this.anchorIndex - 1 || index === this.anchorIndex + 1) {
                    const isNeighborInViewport = isElementInViewport(element);

                    if (isNeighborInViewport) {
                        if (this.previousStates[index] !== isNeighborInViewport)
                            callback(isNeighborInViewport, element);

                        // of course, the neighbor found in the viewport is 
                        // going to be the next anchor
                        resultingAnchorIndex = index;
                    }
                    continue;
                }

                // every other element that is not the anchor, or its neighbors, is going
                // to be assumed to not be in the viewport
                if (this.previousStates[index] !== false) {
                    callback(false, element);
                    this.previousStates[index] = false;
                }
            }

            // update the anchor index to the new one if there's one 
            if (resultingAnchorIndex > -1) 
                this.anchorIndex = resultingAnchorIndex;
        }
    }


}

export { onViewportChange, EfficientViewportObserver };