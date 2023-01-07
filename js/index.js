import MapEmitterRenderer from "./MapEmitterRenderer.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let x = new MapEmitterRenderer("../images/background/pattern-original-large.png", [23, 23, 23], window, canvas);

x.loadAndStart();
