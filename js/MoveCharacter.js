class MoveCharacter {

    static lerp(start, end, weight) {
        return (start + (end - start) * weight).toFixed(2);
    }

    static compare(x1, x2) {
        return x1 == x2;
    }

    constructor(element) {
        let { top, left } = element.getBoundingClientRect();

        this.element = element;
        this.goalY = top;
        this.goalX = left;
        this.done = true;
    }

    setGoal(x, y) {
        this.goalY = y;
        this.goalX = x;
        this.done = false;
    }

    setPosition(x, y) {
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
    }

    getPosition() {
        return { x: parseInt(this.element.style.left) || this.goalX, y: parseInt(this.element.style.top) || this.goalY }
    }

    getDifferenceInPosition(moveCharacter) {
        let box1 = moveCharacter.element.getBoundingClientRect();
        let box2 = this.element.getBoundingClientRect();

        return { x: box1.left - box2.left, y: box1.top - box2.top };
    }

    randomizePositionScreen() {
        let y = Math.floor(Math.random() * window.innerHeight).toFixed(2);
        let x = Math.floor(Math.random() * window.innerWidth).toFixed(2);
        this.setPosition(x, y);
    }

    update() {
        let { y, x } = this.getPosition();

        if (MoveCharacter.compare(y, this.goalY) && MoveCharacter.compare(x, this.goalX)) {
            y = this.goalY;
            x = this.goalX;
            this.done = true;
        }

        y = MoveCharacter.lerp(y, this.goalY, 0.6);
        x = MoveCharacter.lerp(x, this.goalX, 0.6);

        this.setPosition(x, y);
    }
}