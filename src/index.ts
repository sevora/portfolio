import 'swiped-events';
import works from './works';

// these are the DOM elements necessary for this site
const root: HTMLElement = document.querySelector(':root');
const activeTab: HTMLDivElement = document.querySelector('#active-tab');
const navigationLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#navigation-bar > a');
const highlightLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#works > .content > a');
const highlightViewer: HTMLDivElement = document.querySelector('#highlight-viewer');
const highlightCover: HTMLDivElement = document.querySelector('#highlight-cover');

// these are the DOM elements for the highlight viewing
const imageElement: HTMLImageElement = highlightViewer.querySelector('img');
const titleElement: HTMLHeadingElement = highlightViewer.querySelector('h1');
const contentElement: HTMLParagraphElement = highlightViewer.querySelector('p');
const githubButton: HTMLAnchorElement = highlightViewer.querySelector('.github.button');
const previewButton: HTMLAnchorElement = highlightViewer.querySelector('.preview.button');

// these are extra state variables
let hashes: string[] = []; // stores the hash (or contentId) with its corresponding index
let isViewerOpen: boolean = false;
let lastScrollY: number = 0; // should contain the last scroll-y value
let lastIndex: number = 0;

/**
 * This is the entrypoint of the program
 * where everything is put together.
 */
function main() {
    // remove smooth scrolling when js is enabled
    window.document.body.style.setProperty('scroll-behavior', 'auto');

    // the url may contain a hash which indicates the content's id that should be shown
    let contentId = window.location.hash;
    let hasDisplayedPage = false;

    // we want to add the active tab and the first active navigation link
    activeTab.style.removeProperty('display');
    navigationLinks[0].classList.add('active');

    // here, we hook up the navigation links with setting the tab index
    navigationLinks.forEach((link, index) => {
        const { hash } = link;
        hashes.push(hash);

        link.addEventListener('click', event => {
            // this is to prevent the automatic scroll to center but it also prevents changing URL
            event.preventDefault();
            const target = event.currentTarget as HTMLAnchorElement;

            // we need to push the history in order to change the URL
            history.pushState(null, '', target.href);
            displayPage(index);
        });

        // if the url has a hash we want to set the corresponding content
        if (hash === contentId) {
            displayPage(index);
            hasDisplayedPage = true;
        }
    });

    // hook up the highlights so that they show in the highlight viewer
    highlightLinks.forEach((link) => {
        link.addEventListener('click', event => {
            const target = event.currentTarget as HTMLAnchorElement;
            const image: HTMLImageElement = target.querySelector('img');
            const highlight = works[target.id];

            // if there is no highlight object then we can't proceed
            if (!highlight) return;
            event.preventDefault();

            // otherwise we destructure
            const { title, description, github, preview } = highlight;

            // set the corresponding DOM elements
            imageElement.src = image.src;
            titleElement.innerHTML = title;
            contentElement.innerHTML = description;
            githubButton.href = github;
            previewButton.href = preview;

            // show or hide the corresponding buttons 
            githubButton.classList[github ? 'remove' : 'add']('hidden');
            previewButton.classList[preview ? 'remove' : 'add']('hidden');

            // show the viewer and add the cover
            displayViewer(true);
        });
    });

    // when we click the highlight cover we want to close the viewer
    highlightCover.addEventListener('click', event => {
        const target = event.currentTarget as HTMLDivElement;
        target.classList.add('hidden');
        displayViewer(false);
    });

    // when the highlight cover is activated we want to disable scroll by forcing the last y-position
    window.addEventListener('scroll', () => {
        if (!highlightCover.classList.contains('hidden')) {
            window.scrollTo({ top: lastScrollY, behavior: 'instant' });
            return;
        }

        lastScrollY = window.scrollY;
    });

    // we want to ensure a valid hash when a page has not been displayed
    if (!hasDisplayedPage) ensureValidHash();
    window.addEventListener('hashchange', ensureValidHash);
}

/**
 * Use this to ensure that the hash is valid. It automatically
 * sets the hash to the first valid hash.
 */
function ensureValidHash() {
    if (!window.location.hash || hashes.indexOf(window.location.hash) === -1)
        window.location.hash = hashes[0];

    // ofcourse, we have to display that page as well
    navigationLinks.forEach((link, index) => {
        if (link.href === window.location.hash) displayPage(index);
    });
}

/**
 * Use this to hide/display the highlight viewer
 * @param show a boolean indicating whether to show the viewer or not.
 */
function displayViewer(show: boolean) {
    const displayMethodKey: 'add' | 'remove' = show ? 'remove' : 'add';
    highlightCover.classList[displayMethodKey]('hidden');
    highlightViewer.classList[displayMethodKey]('hidden');
    isViewerOpen = show;
}

/**
 * Use this to set the navigation bar and content shown.
 * @param index the index that corresponds to an element with the content class 
 * according to document order.
 */
function displayPage(index: number) {
    lastIndex = index;

    navigationLinks.forEach(link => link.classList.remove('active'));
    navigationLinks[index].classList.add('active');
    root.style.setProperty('--active-tab-index', String(index));

    // here we show the right content which is done by hiding
    // all other content except for the targetContent
    const pages = document.querySelectorAll(`.page`);
    const target = pages[index];
    pages.forEach(page => {
        if (page === target)
            page.classList.remove('hidden')
        else
            page.classList.add('hidden')
    });

    // reset scroll to 0 when changing pages
    window.scrollTo(0, 0);
}

// this is called whenever the back button is pressed
window.addEventListener('popstate', () => {
    const index: number = hashes.indexOf(document.location.hash);

    if (index > -1) {
        displayViewer(false);
        displayPage(index);
    }
});

// this is called on mobile devices when they swipe left
document.addEventListener('swiped-left', () => {
    if (isViewerOpen) return; // do not allow swiping to other page when viewer is open
    const previousIndex = Math.max(0, lastIndex - 1);
    displayPage(previousIndex);

    // we also push that into the history to update it
    history.pushState(null, '', hashes[previousIndex]);
});

// this is called on mobile devices when they swipe right
document.addEventListener('swiped-right', () => {
    if (isViewerOpen) return;
    const nextIndex = Math.min(lastIndex + 1, hashes.length - 1);
    displayPage(nextIndex);

    // we also push that into the history to update it
    history.pushState(null, '', hashes[nextIndex]);
});

// calls the main function when the page loads
window.addEventListener('load', main);