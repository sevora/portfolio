particlesJS.load('particles', 'assets/particlesjs-config.json');

let elements = document.querySelectorAll(".scatter-parent");
let generators = []

for (let index = 0; index < elements.length; ++index) {
    generators.push( new MoveGenerator(elements[index]) );
    generators[index].scatterOnParent();
}