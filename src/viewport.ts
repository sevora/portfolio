export type onViewportChangeCallback = (isInViewport: boolean, element: Element) => void;

// this adjusts the isElementInViewport function condition by a set amount
const ADJUST_TOP_HEIGHT_REQUIREMENT = 100;

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
           rectangle.top + ADJUST_TOP_HEIGHT_REQUIREMENT < (window.innerHeight || document.documentElement.clientHeight);
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

    /**
     * Creates an efficient viewport observer
     * @param parentElement The parent element of the elements to observe
     * @param query The query string so the children will be selected
     */
    constructor(parentElement: Element, query: string) {
        this.children = Array.from( parentElement.querySelectorAll(query) );
        
        for (let index = 0; index < this.children.length; ++index) {
            const child = this.children[index];
            if ( isElementInViewport(child) ) {
                this.anchorIndex = index;
                break;
            }
        }

        this.originalAnchorIndex = this.anchorIndex;
    }

    /**
     * Resets the anchorIndex to the originalAnchorIndex,
     * used when resetting scroll back to beginning
     */
    reset() {
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
            const currentElement = this.children[this.anchorIndex];
            
            callback(isElementInViewport(currentElement), currentElement);
            
            if (this.anchorIndex - 1 > 0) {
                const index = this.anchorIndex - 1;
                const previousElement = this.children[index];
                const isPreviousElementInViewport = isElementInViewport(previousElement);
                
                callback(isPreviousElementInViewport, previousElement);

                // automatically assume all other left-side neighbors to be false
                for (let i = 0; i < index; ++i) 
                    callback(false, this.children[i]);
                
                if (isPreviousElementInViewport) resultingAnchorIndex = index;
            }

            if (this.anchorIndex + 1 < this.children.length) {
                const index = this.anchorIndex + 1;
                const nextElement = this.children[index];
                const isNextElementInViewport = isElementInViewport(nextElement);
                
                callback(isNextElementInViewport, nextElement);
                
                // automatically assume all other right-side neighbors to be false
                for (let i = index + 1; i < this.children.length; ++i) 
                    callback(false, this.children[i]);
                
                if (isNextElementInViewport) resultingAnchorIndex = index;
            }

            // update the current anchor if resulting anchor has been determined
            if (resultingAnchorIndex > -1) 
                this.anchorIndex = resultingAnchorIndex;
        }
    }


}

export { onViewportChange, EfficientViewportObserver };