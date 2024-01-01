// these are the DOM elements necessary for this site
const root: HTMLElement = document.querySelector(':root');
const navigationLinks: HTMLAnchorElement[] = Array.from( document.querySelectorAll('#navigation-bar > a') );

/**
 * This is the entrypoint of the program
 * where everything is put together.
 */
function main() {
    // here, we hook up the navigation links with the interpolator
    navigationLinks.forEach( (anchor, index) => {
        anchor.addEventListener('click', () => {
            navigationLinks.forEach(anchor => anchor.classList.remove('active') );
            anchor.classList.add('active');
            root.style.setProperty('--active-tab-index', String(index) );
        });
    });
}

// calls the main function when the page loads
window.addEventListener('load', main);