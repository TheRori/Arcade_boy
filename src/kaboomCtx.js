import kaboom from "kaboom";


export const k = kaboom({
    global: false,
    touchToMouse: true,
    width: window.innerWidth,
    height: window.innerHeight,
    canvas: document.getElementById("game"),
    debug: false, // set to false once ready for production
});