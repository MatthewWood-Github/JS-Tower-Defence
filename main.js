/*
class unit {
    constructor(name, price, range, power, type)
} */

var selectedUnit = null;
var currentUnit = null;
var shopOptions = [];

var mouseX = 0;
var mouseY = 0;

function populateOptions() {
    shopOptions = document.getElementById("shop-options").children;
}

function updateBorders() {
    for (elem of shopOptions) {
        elem.style.borderColor = "black";
    }

    currentUnit.style.borderColor = "yellow";
}

function buttonAnimation(id) {
    elem = document.getElementById(id)
    elem.classList.remove("button-animation");
    void elem.offsetWidth;
    elem.classList.add("button-animation");
    currentUnit = elem;
    updateBorders();
    selectedUnit = createUnit()
}

function unitFollowMouse(event) {
    parent = document.getElementById("game");
    elem = selectedUnit;
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!(elem === null))
    {
        elem.style.left = `${mouseX - parent.offsetLeft - (elem.width/2.2)}px`;
        elem.style.top = `${mouseY - parent.offsetTop - (elem.height / 1.3)}px`;
    }
}

function placeUnit() {
    selectedUnit.style.zIndex = 4;
    selectedUnit = null;
    currentUnit = null;
    updateBorders();
}

function createUnit()
{
    parent = document.getElementById("game");
    elem = document.createElement("img");
    elem.src = "Shanks01-outline-green.png"
    elem.classList.add("canvas-unit");
    elem.draggable = false;
    
    elem.style.left = `${mouseX - parent.offsetLeft - (elem.width / 6)}px`;
    elem.style.top = `${mouseY - parent.offsetTop - (elem.height / 3.5)}px`;

    parent.appendChild(elem);

    return elem;
}
  
document.addEventListener("mousemove", unitFollowMouse);
document.getElementById('can-place').onclick = placeUnit;
document.addEventListener("keydown", () => {selectedUnit = createUnit()});

populateOptions();