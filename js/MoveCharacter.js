/**
 * A moving character that can be placed anywhere else
 * and would eventually get back to original position by updates.
 */
class MoveCharacter {

    /**
     * this returns a value between start and end according to weight,
     * 0.0 means return value is equal to start, 1.0 means return value is equal to end,
     * anything else is in between.
     * @param {number} start A number
     * @param {number} end A number
     * @param {number} weight A float ranging from 0.0 to 1.0
     * @returns a floating point value
     */
    static lerp(start, end, weight) {
        return (start + (end - start) * weight).toFixed(2);
    }

    /**
     * this is used to construct the moving character
     * @param {HTMLElement} element DOM element containing a single text character (usually span element)
     */
    constructor(element) {
        this.element = element;
        this.originY = 0;
        this.originX = 0;
        this.goalY = 0;
        this.goalX = 0;
        this.progress = 1.0;
        this.progressInterval = 0.2;
    }
    
    /**
     * sets the moving character's origin position where the character should be from
     * @param {number} x a number representing position on x-axis from left
     * @param {number} y a number representing position on y-axis from top
     * @returns {void}
     */
    setOrigin(x, y) {
        this.originY = y;
        this.originX = x;
        this.progress = 0.0;
        this.setPosition(x, y);
    }

    /**
     * sets the moving character's goal position, when update is called
     * it will gradually move towards this goal
     * @param {number} x a number representing position on x-axis from left
     * @param {number} y a number representing position on y-axis from top
     * @returns {void}
     */
    setGoal(x, y) {
        this.goalY = y;
        this.goalX = x;
        this.progress = 0.0;
    }

    /**
     * sets the character's current position
     * @param {number} x a number representing position on x-axis from left
     * @param {number} y a number representing position on y-axis from top
     * @returns {void}
     */
    setPosition(x, y) { 
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
    }
    
    /**
     * computes the difference in position between this and another moving character
     * @param {MoveCharacter} moveCharacter another instance of the moving character
     * @returns an object { x, y } similar case with setGoal and setPosition params
     */
    getDifferenceInPosition(moveCharacter) {
        let box1 = moveCharacter.element.getBoundingClientRect();
        let box2 = this.element.getBoundingClientRect();

        return { x: box1.left - box2.left, y: box1.top - box2.top };
    }

    /**
     * updates the moving character's current position by a single frame according
     * to the origin and goal position
     * @returns {void}
     */
    update() {
        let weight = Math.min(this.progress + this.progressInterval, 1.0);
        let y = MoveCharacter.lerp(this.originY, this.goalY, weight);
        let x = MoveCharacter.lerp(this.originX, this.goalX, weight);
        this.setPosition(x, y);
        this.progress = weight;
        this.progressInterval = Math.max(this.progressInterval * 0.8, 0.01);
    }

    /**
     * Determines if the moving character should be done moving.
     * returns {boolean}
     */
    isDone() {
      return this.progress >= 1.0;
    }
}

export default MoveCharacter;
