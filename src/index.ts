import InteractiveWatch from './InteractiveWatch';

const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d');

const watch = new InteractiveWatch();

let now = Date.now();
let then = now;
let fps = 60;

async function main() {
    // all the images must have the same size
    // and that the hands are centered in place as if 
    // the watch and the other hands are simply invisible
    await watch.load({ 
        body: '/assets/watch/body.png',
        hour: '/assets/watch/hour.png',
        minute: '/assets/watch/minute.png',
        second: '/assets/watch/second.png'
    });
    setup();
    loop();
}

function setup() {

}

function update() {
    
}

function render() {
    watch.render(context);
}

function loop() {
    window.requestAnimationFrame(loop);

    now = Date.now();
    const elapsed = now - then;
    const interval = 1000/fps;

    if (elapsed > interval) {
        then = now - (elapsed % interval);
        update();
        render();
    }
}

main();