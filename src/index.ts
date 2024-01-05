// these are the DOM elements necessary for this site
const root: HTMLElement = document.querySelector(':root');
const activeTab: HTMLDivElement = document.querySelector('#active-tab');
const navigationLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#navigation-bar > a');

/**
 * This is the entrypoint of the program
 * where everything is put together.
 */
function main() {
    // the url may contain a hash which indicates the content's id that should be shown
    const contentId = window.location.hash;

    // we want to add the active tab and the first active navigation link
    activeTab.style.removeProperty('display');
    navigationLinks[0].classList.add('active');

    // here, we hook up the navigation links with setting the tab index
    navigationLinks.forEach( (link, index) => {
        const { hash } = link;

        link.addEventListener('click', (event) => {
            const target = event.target as HTMLAnchorElement;
           
            // here we set the values to make the navigation bar look right
            navigationLinks.forEach(link => link.classList.remove('active') );
            target.classList.add('active');
            root.style.setProperty('--active-tab-index', String(index) );

            // then of course we want to show the corresponding content
            setContent(hash);
        });

        // if the url has a hash we want to match the corresponding link
        if (hash === contentId) link.click();
    });
}

/**
 * Use this to set the content shown in the page.
 * @param contentId corresponds to the id property of the content element (has a class called content).
 */
function setContent(contentId: string) {
    const content = document.querySelector(`.content${contentId}`);
    document.querySelectorAll('.content').forEach(content => content.classList.add('hidden') );
    if (content) content.classList.remove('hidden');
}

// calls the main function when the page loads
window.addEventListener('load', main);