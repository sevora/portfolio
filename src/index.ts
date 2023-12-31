import Interpolator from './interpolate';

// these are the DOM elements necessary for this site
const root: HTMLElement = document.querySelector(':root');
const navigationLinks: HTMLAnchorElement[] = Array.from( document.querySelectorAll('#navigation-bar > a') );

// these are custom objects to make this site functional
const interpolator = new Interpolator(0, 0, 0, 10);

/**
 * This is the entrypoint of the program
 * where everything is put together.
 */
function main() {
    // we set the interpolator's callback to set the value in the css accordingly
    interpolator.callback = (value) => {
        root.style.setProperty('--active-tab-index', String(value));
    }

    // here, we hook up the navigation links with the interpolator
    navigationLinks.forEach( (anchor, index) => {
        anchor.addEventListener('click', () => {
            navigationLinks.forEach(anchor => anchor.classList.remove('active') );
            anchor.classList.add('active');
            
            interpolator.setRange(interpolator.endValue, index); // we set the range to where the interpolator was last and set the goal to the new index
            interpolator.run();

        });
    });
}

// calls the main function when the page loads
window.addEventListener('load', main);