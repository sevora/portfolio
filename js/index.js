import MapWalkerRenderer from "./MapWalkerRenderer.js";

const canvas = document.querySelector("canvas");
let x = new MapWalkerRenderer("../images/background/pattern-original-large.png", canvas, {
  walkerSize: 100,
  walkerSpeed: 30
});

x.loadAndStart();
