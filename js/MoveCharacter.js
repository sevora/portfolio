/**
 * A moving character that can be placed anywhere else
 * and would eventually get back to original position by updates.
 */
class MoveCharacter {

    /**
     * this returns a value between start and end according to weight,
     * 0.0 means return value is equal to start, 1.0 means return value is equal to end,
     * anything else is in between.
     * @param {*} start A number
     * @param {*} end A number
     * @param {*} weight A float ranging from 0.0 to 1.0
     * @returns a floating point value
     */
    static lerp(start, end, weight) {
        return (start + (end - start) * weight).toFixed(2);
    }

    /**
     * compares whether two numbers are similar
     * @param {*} x1 a number
     * @param {*} x2 a number
     * @returns boolean
     */
    static compare(x1, x2) {
        return x1 == x2;
    }

    /**
     * this is used to construct the moving character
     * @param {*} element DOM element containing a single text character (usually span element)
     */
    constructor(element) {
        let { top, left } = element.getBoundingClientRect();

        this.element = element;
        this.goalY = top;
        this.goalX = left;
        this.done = true;
    }

    /**
     * sets the moving character's goal, when update is called it will move
     * towards this goal
     * @param {*} x a number representing position on x-axis from left
     * @param {*} y a number representing position on y-axis from top
     */
    setGoal(x, y) {
        this.goalY = y;
        this.goalX = x;
        this.done = false;
    }

    /**
     * sets the character's current position
     * @param {*} x a number representing position on x-axis from left
     * @param {*} y a number representing position on y-axis from top
     */
    setPosition(x, y) {
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
    }

    /**
     * returns the position of the moving character in DOM
     * @returns an object { x, y } similar case with setGoal and setPosition params
     */
    getPosition() {
        return { x: parseInt(this.element.style.left) || this.goalX, y: parseInt(this.element.style.top) || this.goalY }
    }
    
    /**
     * computes the difference in position between this and another moving character
     * @param {*} moveCharacter another instance of the moving character
     * @returns an object { x, y } similar case with setGoal and setPosition params
     */
    getDifferenceInPosition(moveCharacter) {
        let box1 = moveCharacter.element.getBoundingClientRect();
        let box2 = this.element.getBoundingClientRect();

        return { x: box1.left - box2.left, y: box1.top - box2.top };
    }

    /**
     * randomizes the position of the 
     * character limited to the screen width and height
     */
    randomizePositionScreen() {
        let y = Math.floor(Math.random() * window.innerHeight).toFixed(2);
        let x = Math.floor(Math.random() * window.innerWidth).toFixed(2);
        this.setPosition(x, y);
        this.done = false;
    }

    /**
     * updates the character's position by a single frame
     */
    update() {
        let { y, x } = this.getPosition();

        if (MoveCharacter.compare(y, this.goalY) && MoveCharacter.compare(x, this.goalX)) {
            y = this.goalY;
            x = this.goalX;
            this.done = true;
        }

        y = MoveCharacter.lerp(y, this.goalY, 0.1);
        x = MoveCharacter.lerp(x, this.goalX, 0.1);

        this.setPosition(x, y);
    }
}