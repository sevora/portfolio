class MoveGenerator {
    static shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    static createSpan(character) {
        let span = document.createElement('span');
        span.style.position = "relative";
        span.innerText = character;
        return span;
    }

    constructor(rootElement) {
        let text = rootElement.innerText;
        rootElement.innerText = "";
        this.done = true;
        
        this.moveCharacters = [];

        for (let index = 0; index < text.length; ++index) {
            let character = text[index];
            let span = MoveGenerator.createSpan(character);
            this.moveCharacters.push( new MoveCharacter(span) );
            rootElement.appendChild(span);
        }

    }

    scatter() {
        for (let index = 0; index < this.moveCharacters.length; ++index) {
            this.moveCharacters[index].randomizePositionScreen();
        }
    }
    
    scatterOnParent() {
        let newPositions = [];
        let swaps = MoveGenerator.shuffle(Array.from(Array(this.moveCharacters.length).keys()));

        for (let index = 0; index < this.moveCharacters.length; ++index) {
            let moveCharacter = this.moveCharacters[index];
            let siblingCharacter = this.moveCharacters[swaps[index]];
            newPositions.push(moveCharacter.getDifferenceInPosition(siblingCharacter));
        }

        for (let index = 0; index < this.moveCharacters.length; ++index) {
            let { x, y } = newPositions[index];
            this.moveCharacters[index].setPosition(x, y);
        }

        this.done = false;
    }

    update() {
        let allDone = [];
        
        for (let index = 0; index < this.moveCharacters.length; ++index) {
            this.moveCharacters[index].update();
            allDone.push(this.moveCharacters[index].done);
        }

        if (allDone.every(x => x)) this.done = true;
    }
}