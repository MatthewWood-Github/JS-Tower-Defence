var highestZIndex = 20;

function createWaveText() {
    let messageContainer = document.createElement("div");
    messageContainer.classList.add("next-wave-messagebox");

    let header = document.createElement("div");
    header.classList.add("next-wave-message-footer");

    let footer = document.createElement("div");
    footer.classList.add("next-wave-message-footer");
    
    let message = document.createElement("div");
    message.classList.add("next-wave-message");
    message.innerHTML = `Wave: ${wave}`;

    let main = document.getElementById("main");

    messageContainer.appendChild(header);
    messageContainer.appendChild(message);
    messageContainer.appendChild(footer);

    main.appendChild(messageContainer);

    setTimeout(() => {
        document.getElementById("main").removeChild(messageContainer);
    }, 2500);
}

function millisecondsToDate(time) {
    let hours = time/1000 * 60 * 60;
    let minutes = time/1000 * 60;
    
}

function createOutcomeScreen(text, retryText) {
    let main = document.getElementById("main");

    let outcomeBox = document.createElement("div");
    outcomeBox.classList.add("win-message");

    let title = document.createElement("div");
    title.classList.add("win-title");
    title.innerHTML = text;

    let content = document.createElement("div");
    content.classList.add("win-content");
    let contentList = document.createElement("ul");
    let time = Date.now()
    let timeContent = document.createElement("ul");
    timeContent.innerHTML = millisecondsToDate(time - startTime);

    let next = document.createElement("div");
    next.classList.add("win-next");

    let retry = document.createElement("button");
    retry.classList.add("win-button");
    retry.innerHTML = retryText

    retry.onmousedown = () => {
        retry.classList.add("button-animation");
        retry.style.filter = ("brightness(0.5)");
    };

    retry.onmouseleave = () => {retry.style.filter = ("brightness(1)");}

    retry.onclick = () => {
        retry.style.filter = ("brightness(1)")
        restart();
    };

    let menu = document.createElement("button");
    menu.classList.add("win-button");
    menu.innerHTML = "Main Menu";
    menu.onmousedown = () => {
        menu.classList.add("button-animation");
        menu.style.filter = ("brightness(0.5)");
    };

    menu.onmouseleave = () => {menu.style.filter = ("brightness(1)");}

    menu.onclick = () => {
        menu.style.filter = ("brightness(1)")
        mainMenu();
    };

    let dim = document.createElement("div");
    dim.classList.add("endgame-focus");
    
    outcomeBox.appendChild(title);
    outcomeBox.appendChild(content);
    outcomeBox.appendChild(next);
    next.appendChild(retry);
    next.appendChild(menu);
    main.appendChild(dim);
    main.appendChild(outcomeBox);
    deleteUpgradeElements();
}

function showUnitUpgrade(unit) {
    let elem = document.createElement("div");
    elem.classList.add("upgrade-menu");
    elem.style.left = `${unit.x}px`;
    elem.style.top = `${unit.y}px`;
    elem.id = "upgrade";
    elem.onmouseenter = () => {elem.style.zIndex = ++highestZIndex};

    elem.appendChild(createTargetingButton(unit));
    elem.appendChild(createIcon("url('Sprites/damage-icon.png')", unit.damage));
    elem.appendChild(createIcon("url('Sprites/attack-speed.png')", unit.attackSpeed/1000));
    elem.appendChild(createIcon("url('Sprites/attack-range.png')", unit.range));
    elem.appendChild(createUpgradeButton(unit, elem));

    elem.style.zIndex = ++highestZIndex;

    document.getElementById("main").appendChild(elem);
}

function createIcon(sprite, stat) {
    let icon = document.createElement("div");
    icon.style.backgroundImage = sprite;
    icon.style.backgroundSize = "cover";

    icon.style.width = "1fr";
    icon.innerHTML = stat;
    return icon;
}

function createTargetingButton(unit) {
    let targetingButton = document.createElement("button");
    targetingButton.style.width = "2fr";
    targetingButton.style.backgroundColor = "#2d2d2d";
    targetingButton.style.color = "white";
    targetingButton.style.fontSize = "20px";
    targetingButton.innerHTML = unit.targeting;
    targetingButton.onclick = () => {
        unit.cycleTargeting();
        showUnitUpgrade(unit);
        document.getElementById("main").removeChild(elem);
    }
    return targetingButton;
}

function createUpgradeButton(unit, elem) {
    let upgradeButton = document.createElement("button");
    upgradeButton.style.width = "1fr";
    upgradeButton.style.backgroundImage = "url('Sprites/upgrade-icon.png')";
    upgradeButton.style.backgroundSize = "cover";
    upgradeButton.style.color = "white";
    upgradeButton.style.fontSize = "20px";
    let upgrades = possibleUnits[unit.name].upgrades;
    var costMenu = document.createElement("div");

    upgradeButton.onmouseenter = () => {
        costMenu.classList.add("show-cost");
        costMenu.style.left = `${unit.x + 175}px`;
        costMenu.style.top = `${unit.y - 45}px`;
        costMenu.style.zIndex = ++highestZIndex;
        if (unit.level >= Object.keys(possibleUnits[unit.name].upgrades).length) costMenu.innerHTML = "Max";
        else costMenu.innerHTML = `£${upgrades[unit.level+1].cost}`;

        document.getElementById("main").appendChild(costMenu)
    };

    upgradeButton.onmouseleave = () => {
        document.getElementById("main").removeChild(costMenu);
    };

    upgradeButton.onclick = () => {
        if (unit.level >= Object.keys(possibleUnits[unit.name].upgrades).length) return;
        
        if (money >= possibleUnits[unit.name].upgrades[unit.level+1].cost) {
            unit.upgrade()
            money -= possibleUnits[unit.name].upgrades[unit.level].cost;
            showUnitUpgrade(unit);
            document.getElementById("main").removeChild(costMenu);
            document.getElementById("main").removeChild(elem);
        };
    };

    return upgradeButton;
}

function deleteUpgradeElements() {
    let elems = document.querySelectorAll("#upgrade");
    let main = document.getElementById("main");
    console.log(elems);
    for (var x = 0; x < elems.length; x++) {
        main.removeChild(elems[x]);
    }
}