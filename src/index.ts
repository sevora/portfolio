// these are the DOM elements necessary for this site
const root: HTMLElement = document.querySelector(':root');
const activeTab: HTMLDivElement = document.querySelector('#active-tab');
const navigationLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#navigation-bar > a');

const hash2Index: { [hash: string]: number } = {};

/**
 * This is the entrypoint of the program
 * where everything is put together.
 */
function main() {
    // remove smooth scrolling when js is enabled
    window.document.body.style.setProperty('scroll-behavior', 'auto');

    // when there's no hash, we want to use 'about'
    if (!window.location.hash) window.location.hash = 'about';

    // the url may contain a hash which indicates the content's id that should be shown
    const contentId = window.location.hash;

    // we want to add the active tab and the first active navigation link
    activeTab.style.removeProperty('display');
    navigationLinks[0].classList.add('active');

    // here, we hook up the navigation links with setting the tab index
    navigationLinks.forEach( (link, index) => {
        const { hash } = link;
        hash2Index[hash] = index;

        link.addEventListener('click', (event) => {
            // this is to prevent the automatic scroll to center but it also prevents changing URL
            event.preventDefault();
            const target = event.target as HTMLAnchorElement;

            // we need to push the history in order to change the URL
            history.pushState({ hash }, '', target.href);
            displayContent(hash);
        });

        // if the url has a hash we want to set the corresponding content
        if (hash === contentId) displayContent(hash);
    });
}

/**
 * Use this to set the navigation bar amd content shown in the page.
 * @param contentId corresponds to the id property of the content element (also a hash of its 
 * corresponding anchor tag and has a class called content).
 */
function displayContent(contentId: string) {
    // here we set the values to make the navigation bar look right
    const index = hash2Index[contentId];
    navigationLinks.forEach(link => link.classList.remove('active') );
    navigationLinks[index].classList.add('active');
    root.style.setProperty('--active-tab-index', String(index) );

    // here we show the right content
    const content = document.querySelector(`.content${contentId}`);
    document.querySelectorAll('.content').forEach(content => content.classList.add('hidden') );
    if (content) content.classList.remove('hidden');
}

// this is called whenever the back button is pressed
window.addEventListener('popstate', (event) => {
    if (!event.state) return;
    const hash: string = event.state.hash;
    if (hash) displayContent(hash);
});

// calls the main function when the page loads
window.addEventListener('load', main);