/**
 * A dictionary of works, as it is an object we have O(1) time complexity
 * and so it is slightly optimized and less code to write for searching.
 */
const works: { [id: string]: WorkHighlight } = {
    "blog": {
        title: "Blog",
        description: "A collection of stories I have working with tech. From nerdy talk about what I just made to my ideals and views, you can read about those here. Some entries are technical, some are just casual.",
        preview: "https://blog.ralphlouisgopez.com",
        github: "https://github.com/sevora/journey"
    },
    "bl0g.pro": {
        title: "bl0g.pro",
        description: "This is an experimental blog-site project with special effects meant to add some immersion. Currently not hosted.",
        github: "https://github.com/sevora/bl0g"
    },
    "cinelaya": {
        title: "Cinelaya",
        description: "A suite of tools to aid filmmakers bring their imagination into reality. This project, also a company, was founded by <a target=\"_blank\" href=\"https://www.linkedin.com/in/gil-ponce-6704389\">Gil Ponce</a>. I am the fullstack developer of the work-in-progress web application and is continuously adding features and optimizations into the site.",
        preview: "https://www.cinelaya.com"
    },
    "stmviz": {
        title: "stmviz",
        description: "This is a visualizer for the classic Gale-Shapley Algorithm as a submission on a competition. Implemented through a web-application and ES6. This is specifically designed to work on desktops.",
        preview: "https://visualizer.ralphlouisgopez.com",
        github: "https://github.com/sevora/stmviz"
    },
    "story": {
        title: "My Story",
        description: "This is a website that shows my personal story. It won\'t give off a professional vibe but rather something more homey. I used the theme of a watch as I like the concept of being able to show the past and the present. I optimized how it works as much as possible on both mobile and desktop.",
        preview: "https://story.ralphlouisgopez.com",
        github: "https://github.com/sevora/story"
    },
    "simple-calculator": {
        title: "Simple Calculator",
        description: "A simple calculator with the most basic of features made with Java 11 and JavaFX. What's good about this project is the fact that it is neatly organized and is easily extensible.",
        github: "https://github.com/sevora/simple-calculator"
    }
};

export default works;