declare global {
    interface Highlight {
        /**
         * The selector of the DOM element associated with the highlight.
         */
        selector: string;

        /**
         * The title of the highlight
         */
        title: string;

        /**
         * The description of the highlight.
         */
        description: string;

        /**
         * The preview url of the highlight if there is one.
         */
        preview?: string;

        /**
         * The Github url of the highlight if there is one.
         */
        github?: string
    }
}

export {}