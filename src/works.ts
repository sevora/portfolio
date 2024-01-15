/**
 * A dictionary of works, as it is an object we have O(1) time complexity
 * and so it is slightly optimized (?) and less code to write for searching.
 */
const works: { [id: string]: Highlight } = {
    'aspire': {
        title: 'ASPIRE',
        description: 'A COVID risk-estimator web application. This was done mainly by a team in DLSU (De La Salle University) and I worked on optimizing or turning it into a custom single-page application. It is a web-application that computes the likelihood of viral spread (COVID) from given parameters such as location, activity, and so on.',
        github: 'https://github.com/sevora/covid-risk-estimator'
    },
    'blog': {
        title: 'Blog',
        description: 'A collection of stories I have working with tech. From nerdy talk about what I just made to my ideals and views, you can read about those here. Some entries are technical, some are just casual.',
        preview: 'https://blog.ralphlouisgopez.com',
        github: 'https://github.com/sevora/journey'
    },
    'cinelaya': {
        title: 'Cinelaya',
        description: 'A suite of tools to aid filmmakers bring their imagination into reality. This project, also a company, was founded by <a target="_blank" href="https://www.linkedin.com/in/gil-ponce-6704389">Gil Ponce</a>. I am the fullstack developer of the work-in-progress web application and is continuously adding features and optimizations into the site.',
        preview: 'https://workspace.cinelaya.com'
    },
    'deebait': {
        title: 'Deebait',
        description: 'This is a website made for 1-to-1 anonymous chat but with a twist. It it not currently working or hosted anymore. Users select a preference regarding a topic and get matched up with someone who has answers opposite to theirs. For example, cat lovers will get matched with dog lovers and so on. The point is for people to have a debate.',
        github: 'https://github.com/sevora/deebait'
    },
    'fairu': {
        title: 'Fairu',
        description: 'A file indexing web-application. Currently not hosted anywhere. Originally intended to index files in academia. It has a tagging function and a search feature. That\'s mostly about it. It also has a dashboard for admins to verify files.',
        github: 'https://github.com/sevora/fairu'
    },
    'stmviz': {
        title: 'stmviz',
        description: 'This is a visualizer for the classic Gale-Shapley Algorithm as a submission on a competition. Implemented through a web-application and ES6. This is specifically designed to work on desktops.',
        preview: 'https://visualizer.ralphlouisgopez.com',
        github: 'https://github.com/sevora/stmviz'
    },
    'story': {
        title: 'My Story',
        description: ' This is a website that shows my personal story. It won\'t give off a professional vibe but rather something more homey. I used the idea and the theme of a "watch" as I like the concept of being able to show the past and the present. Check it out to see what I mean. I optimized how it works as much as possible on both mobile and desktop.',
        preview: 'https://story.ralphlouisgopez.com',
        github: 'https://github.com/sevora/story'
    },
    'simple-calculator': {
        title: 'Simple Calculator',
        description: 'A simple calculator with the most basic of features made with Java 11 and JavaFX. What\'s good about this project is the fact that it is neatly organized and is easily extensible.',
        github: 'https://github.com/sevora/simple-calculator'
    }
};

export default works;