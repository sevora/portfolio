import MoveGenerator from "./MoveGenerator";

// elements refer to the elements that should be scattered
let elements = document.querySelectorAll(".scatter-parent");
let generators = []; // has all the generators
let queue = [];      // has the generators in queue for queueing the updates

function main() {
    let particlesConfigPath = `assets/particlesjs-config${ window.innerWidth > 600 ? '' : '-mobile'}.json`;
    particlesJS.load('particles', particlesConfigPath);

    // first we generate and scatter all the moving text
    for (let index = 0; index < elements.length; ++index) {
        generators.push( new MoveGenerator(elements[index]) );
        generators[index].scatterOnParent();
    }

    // add an event listener for the scrolling
    document.body.addEventListener('scroll', function() { 
      updateGeneratorsOnView(true); 
    });

    // start the animation after a few milliseconds
    setTimeout(function() {
      updateGeneratorsOnView(false); 
    }, 1500);
}

/**
 * determines whether given element is in viewport
 * @param {HTMLElement} element DOM element
 * @returns boolean
 */
function isElementInViewport(element) {
    let rectangle = element.getBoundingClientRect();

    return (
        rectangle.top >= 0 &&
        rectangle.left >= 0 &&
        rectangle.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rectangle.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * this is specifically used as a callback for the queue
 * @param {MoveGenerator} generator a MoveGenerator instance
 * @returns null
 */
function queueCallback(generator) {
    queue.splice(0, 1);
    if (queue.length > 0) {
      queue[0].updateUntilDone(queueCallback);
    }
    return null;
}

/**
 * this updates the queue depending on if the elements with generators
 * are on view.
 */
function updateGeneratorsOnView(prioritizeNew) {
    // this is used so that the queue code isn't run again
    // unless the queue is empty (refer to last line in function)
    let runUpdate = queue.length == 0;

    for (let index = 0; index < generators.length; ++index) {
        let generator = generators[index];

        // optimization here with the order of conditions
        // checking if done is the fastest, checking if in queue prevents bloat in queue,
        // and finally checking if in viewport last
        if (!generator.isDone() && !queue.includes(generator) && isElementInViewport(generator.element)) {
            if (prioritizeNew) {
              queue.unshift(generator);
              continue;
            }
            queue.push(generator);
        }
    }
  
    // this one only runs the queue code if necessary
    if (queue.length > 0 && runUpdate) {
        queue[0].updateUntilDone(queueCallback);
    }
}

// wait for the whole window to load
window.onload = function() { 
    // reload to fix weird getClientBoundingRect
    if ( !sessionStorage.getItem('reload') ) { 
        sessionStorage.setItem('reload', '1');
        window.location.reload(); 
    }
    main(); 
}
