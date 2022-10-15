import MoveCharacter from "./MoveCharacter";

/**
 * This class is used to generate multiple moving characters from a single
 * element and be able to control them from a single instance.
 */
class MoveGenerator {
    /**
     * accepts an array and returns a shuffled version of it, does not shuffle multidimensionally
     * @param {[]} array 
     * @returns array
     */
    static shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    /**
     * accepts a text character and returns a span DOM element version of it.
     * @param {string} character 
     * @returns 
     */
    static createSpanElement(character) {
        let span = document.createElement('span');
        span.style.position = "relative";
        span.innerText = character;
        return span;
    }

    /**
     * used to construct a moving character object from a single parent,
     * this could be used for example on paragraph elements.
     * @param {HTMLElement} rootElement a DOM element
     */
    constructor(rootElement) {
        this.element = rootElement;
        this.characters = [];
        this.timerID = null;
        this.done = true;

        let text = rootElement.innerText;
        rootElement.innerText = "";

        for (let index = 0; index < text.length; ++index) {
            let span = MoveGenerator.createSpanElement(text[index]);
            this.characters.push( new MoveCharacter(span) );
            rootElement.appendChild(span);
        }

    }

    /**
     * randomly scatters the moving characters in the DOM
     * all around the screen.
     */
    scatter() {
        for (let index = 0; index < this.characters.length; ++index) {
            this.characters[index].randomizePositionScreen();
        }

        this.done = false;
    }
    
    /**
     * randomly scatters the moving characters in the DOM
     * along their parent and with accordance to the positions
     * of their siblings.
     */
    scatterOnParent() {
        let positions = [];
        let swaps = MoveGenerator.shuffle(Array.from(Array(this.characters.length).keys()));

        // reset positions to original of (0, 0) since these are all relative
        for (let index = 0; index < this.characters.length; ++index) {
            this.characters[index].setPosition(0, 0);
        }

        // compute the random swapped positions of each, since these things are relative
        // it is computed through that getDifferenceInPosition method
        for (let index = 0; index < this.characters.length; ++index) {
            let character = this.characters[index];
            let sibling = this.characters[ swaps[index] ];

            positions.push( character.getDifferenceInPosition(sibling) );
        }

        // move all characters to respective random positions
        for (let index = 0; index < this.characters.length; ++index) {
            let character = this.characters[index];
            let { x, y } = positions[index];

            character.setPosition(x, y);
            character.done = false;
        }

        // set the state of this generator to not dne
        this.done = false;
    }

    /**
     * call this to update the characters in the generator by a single frame.
     * remember all the characters eventually get back to their original position (0, 0).
     */
    update() {
        let done = true;
        
        for (let index = 0; index < this.characters.length; ++index) {
            let character = this.characters[index];
            character.update();
            if (!character.done) done = false;
        }

        this.done = done;
    }

    /**
     * use this to call the update method until the generator
     * is done (a.k.a. all the characters are back in place)
     * @param {*} callback a function to call when the generator is done
     */
    updateUntilDone(callback) {
        // used an arrow function to preserve context
        this.timerID = setInterval( () => {
            this.update();

            if (this.done) {
                clearInterval(this.timerID);
                this.timerID = null;
                
                callback(this);
            }
        }, 10);

    }
}

export default MoveGenerator;
