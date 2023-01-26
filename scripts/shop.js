var currentShopUnit = null;
var shopOptions = [];
var currentUnit = null;

define(["./Units", "./Classes"], function () {
    const units =  require("./Units");
    const classes = require("./Classes");

    function createUnitOptions() {
        Object.entries(units.possibleUnits).forEach(unit => {
            let option = document.createElement("li");
            option.classList.add("unit-slot");
            option.id = unit[1].name;
            option.onclick = () => {shopAction(option.id)};
            option.onmousedown = () => {shopButtonAnimation(option.id)};
            option.onmouseleave = () => {undim(option.id)};
            option.style.backgroundColor = "#ff7979";
            option.style.backgroundImage = `url(${unit[1].spriteSource})`;
            option.innerHTML = `$${unit[1].cost}`;
            document.getElementById("shop-options").appendChild(option);
            shopOptions.push(option);
        });
    }

    function shopAction(id) {
        let elem = document.getElementById(id)
        elem.classList.remove("button-animation");
        currentUnit = classes.createUnit(id);
        currentShopUnit = elem;
        document.getElementById(id).style.filter = ("brightness(1)");
        updateBorders();
    }
        
    return {
        createUnitOptions: createUnitOptions,
        currentUnit: currentUnit,
    }
})

function updateBorders() {
    for (elem of shopOptions) {
        elem.style.borderColor = "black";
    }

    if (currentShopUnit === null) return;

    currentShopUnit.style.borderColor = "yellow";
}

function shopButtonAnimation(id) {
    let  elem = document.getElementById(id)
    elem.classList.add("button-animation");
    elem.style.filter = ("brightness(0.5)");
    updateBorders();
}

function undim(id) {
    document.getElementById(id).style.filter = ("brightness(1)");
}

