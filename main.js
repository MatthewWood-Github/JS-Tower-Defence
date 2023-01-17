/*
class unit {
    constructor(name, price, range, power, type)
} */

currentUnit = null;
shopOptions = [];

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
}

populateOptions();