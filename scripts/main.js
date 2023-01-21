currentUnit = null;

var possibleUnits = {
    Shanks: {
        name: "Shanks",
        cost: 1050,
        damage: 200,
        range: 250,
        attackSpeed: 1800,
        spriteSource: "Sprites/Shanks01-outline-green.png",
        maxNumber: 1,
        upgrades: {
            1: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            2: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            3: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            4: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            5: {cost: 200, damage: 5, range: 25, attackSpeed: 200}
        }
    },

    Perona: {
        name: "Perona",
        cost: 530,
        damage: 30,
        range: 550,
        attackSpeed: 1100,
        spriteSource: "Sprites/Perona01-outline-green.png",
        maxNumber: 3,
        upgrades: {
            1: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            2: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            3: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            4: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            5: {cost: 200, damage: 5, range: 25, attackSpeed: 200}
        }
    },

    Jotaro: {
        name: "Jotaro",
        cost: 300,
        damage: 5,
        range: 350,
        attackSpeed: 2000,
        spriteSource: "Sprites/Jotaro01-outline-green.png",
        maxNumber: 3,
        upgrades: {
            1: {cost: 200, damage: 5, range: 25, attackSpeed: 100},
            2: {cost: 500, damage: 10, range: 25, attackSpeed: 100},
            3: {cost: 1000, damage: 30, range: 0, attackSpeed: 100},
            4: {cost: 2500, damage: 50, range: 0, attackSpeed: 100},
            5: {cost: 3750, damage: 100, range: 0, attackSpeed: 200}
        }
    }
}

const startPos = {x: 0, y: 256};

const speed = {
    boss: 1,
    slow: 1,
    normal: 2,
    fast: 4,
    faster: 8,
    superfast: 16,
    insane: 32,
    godspeed: 64,
}

const possibleEnemies = {
    Takeoff: {
        name: "Takeoff",
        health: 200,
        speed: speed.faster,
        sprite: "Sprites/takeoff.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 250,

        upgrades: {health: 50, value: 50}
    },

    Paul: {
        name: "Paul",
        health: 150,
        speed: speed.fast,
        sprite: "Sprites/paul.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 100,

        upgrades: {health: 50, value: 50}
    },

    Greedo: {
        name: "Greedo",
        health: 50,
        speed: speed.slow,
        sprite: "Sprites/greedo.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 100,

        upgrades: {health: 50, value: 50}
    },

    Troll: {
        name: "Troll",
        health: 2000,
        speed: speed.boss,
        sprite: "Sprites/trollface.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 1000,

        upgrades: {health: 50, value: 50}
    }
}

const track = {
    img: new Image(),
    sprite: "Sprites/track.png",
    nodes: [{x: 0, y: 256}, // Start
            {x: 384, y: 256}, 
            {x: 384, y: 512},
            {x: 768, y: 512}, 
            {x: 768, y: 256}, 
            {x: 1152, y: 256}, 
            {x: 1152, y: 1024} // Terminal
            ]
}

const waves = {
    1: [
        {enemy: "greedo", quantity: 3, interval: 400},
    ],
    2: [
        {enemy: "greedo", quantity: 6, interval: 500},
    ],
    3: [
        {enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "paul", quantity: 1, interval: 3000},
    ],
    4: [{enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "paul", quantity: 2, interval: 4000},
        {enemy: "greedo", quantity: 1, interval: 5000},
        {enemy: "greedo", quantity: 1, interval: 5500},
        {enemy: "greedo", quantity: 1, interval: 6000},
        {enemy: "greedo", quantity: 1, interval: 6500},
        {enemy: "greedo", quantity: 1, interval: 7000},
    ],
    5: [{enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "paul", quantity: 2, interval: 4000},
        {enemy: "troll", quantity: 1, interval: 5000},
        {enemy: "greedo", quantity: 1, interval: 5000},
        {enemy: "greedo", quantity: 1, interval: 5500},
        {enemy: "greedo", quantity: 1, interval: 6000},
        {enemy: "greedo", quantity: 1, interval: 6500},
        {enemy: "greedo", quantity: 1, interval: 7000},
    ],
    6: [{enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "troll", quantity: 1, interval: 5000},
        {enemy: "takeoff", quantity: 1, interval: 10000},
    ],
    7: [
        {enemy: "troll", quantity: 1, interval: 1000},
        {enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "paul", quantity: 1, interval: 3000},
    ],
    8: [],
    9: [],
    10: [
        
    ]
}

const heartIcon = new Image();
heartIcon.src = "Sprites/heart.png";
var health = 200;
var money = 500;
var wave = 0;

var mouseX = 0;
var mouseY = 0;

var debug = true;

const unitSize = 192;
const placeAtFeetRatio = 1.3;
const unitAdjustedX = unitSize/2;
const unitAdjustedY = unitSize/1.3;

const enemySize = 128;
const enemyAdjustedSize = enemySize/2;
const enemyCollisionForgiveness = 20;

const enemies = [];
const units = [];

function getNumberOfUnits(unit) {
    if (unit === null) return;
    let count = 0;
    units.forEach(obj => {
        if (obj.name == unit.name) count++
    })
    return count;
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// SHOP ===================================================================================

var currentShopUnit = null;
var shopOptions = [];

function populateOptions() {
    shopOptions = document.getElementById("shop-options").children;
    for (elem of shopOptions) {
        elem.innerHTML = `£${possibleUnits[elem.id].cost}`;
    }
}

function updateBorders() {
    for (elem of shopOptions) {
        elem.style.borderColor = "black";
    }

    if (currentShopUnit === null) return;

    currentShopUnit.style.borderColor = "yellow";
}

function buttonAnimation(id) {
    elem = document.getElementById(id)
    elem.classList.remove("button-animation"); 
    void elem.offsetWidth;
    elem.classList.add("button-animation");
    createUnit(id);
    
    currentShopUnit = elem;
    updateBorders();
}

// Classes ===============================================================================

class Unit {
    constructor(name) {
        this.name = name;
        this.cost = possibleUnits[name].cost;
        this.damage = possibleUnits[name].damage;
        this.range = possibleUnits[name].range;
        this.attackSpeed = possibleUnits[name].attackSpeed;
        this.sprite = new Image();
        this.sprite.src = possibleUnits[name].spriteSource;
        this.sprite.zIndex = 2;
        this.level = 0;

        this.targeting = "First";
        this.lastAttack = 0;

        this.enemyQueue = [];
    }

    place(x, y) {
        this.x = x - unitAdjustedX;
        this.y = y - unitAdjustedY;
        currentShopUnit = null;
        updateBorders();
        units.unshift(this);
    }

    attack(target) {
        if (target === undefined) return;
        if (this.canAttack()) {
            this.lastAttack = Date.now();
            target.health -= this.damage;
            
            if (!(target === null)) target.kill();
        }
    }

    canAttack() {
        if (this.lastAttack == 0) return true;
        if (Date.now() >= this.lastAttack + this.attackSpeed) return true;
        else return false;
    }

    ability() {
        return;
    }

    getAdjustedPosition() {
        return {x: this.x + unitAdjustedX, y: this.y + unitAdjustedX}
    }

    getSortedEnemyQueue() {
        switch(this.targeting) {
            case "First":
            if (this.enemyQueue.length > 1) {
                let output = this.enemyQueue;
                output = output.sort((a, b)=> {
                    if (a.progress === b.progress){
                        return a.getDistanceToNext() < b.getDistanceToNext() ? -1 : 1
                    } 
                    else {
                        return a.progress > b.progress ? -1 : 1
                    }
                });
                return output;
            }
            break;

            case "Last":
            if (this.enemyQueue.length > 1) {
                let output = this.enemyQueue;
                output = output.sort((a, b)=> {
                    if (a.progress === b.progress){
                        return a.getDistanceToNext() > b.getDistanceToNext() ? -1 : 1
                    } 
                    else {
                        return a.progress < b.progress ? -1 : 1
                    }
                });
                return output;
            }
            break;
        }
        return this.enemyQueue;
    }

    upgrade() {
        let upgradeTier = possibleUnits[this.name].upgrades[this.level];
        this.damage += upgradeTier.damage;
        this.range += upgradeTier.range;
        this.attackSpeed -= upgradeTier.attackSpeed;
        this.level++;
    }
}

class Jotaro extends Unit {
    attack(target) {
        if (target === undefined) return;
        if (this.canAttack()) {
            let counter = 0;
            let numberOfAttacks = 5;
            let timeBetweenHits = 125;
            let damagePerHit = this.damage;
            this.lastAttack = Date.now();
            
            let attackRush = setInterval(function() {
                target.health -= damagePerHit;
                if (!(target === null)) target.kill();
                counter++;
                if (counter >= numberOfAttacks) clearInterval(attackRush);
            }, timeBetweenHits)
        }
    }
}

class Perona extends Unit {
    attack(target) {
        if (target === undefined) return;
        if (this.canAttack()) {
            let damagePerHit = this.damage;
            this.lastAttack = Date.now();
            target.health -= damagePerHit;
            target.slow(0.5, 5000)
            if (!(target === null)) target.kill();
        }
    }
}

class Enemy {
    constructor(name) {
        this.name = name;
        this.maxHealth = possibleEnemies[name].health;
        this.health = possibleEnemies[name].health;
        this.maxSpeed = possibleEnemies[name].speed;
        this.speed = possibleEnemies[name].speed;
        this.slowed = false;
        this.img = new Image();
        this.img.src = possibleEnemies[name].sprite;
        this.x = possibleEnemies[name].x;
        this.y = possibleEnemies[name].y;
        this.value = possibleEnemies[name].value;
        this.level = wave;
        this.progress = 0;

        this.applyWaveMultiplier();
    }

    moveHorizontal(magnitude) {
        this.x += magnitude;
    }

    moveVertical(magnitude) {
        this.y += magnitude;
    }

    getAdjustedPosition() {
        return {x: this.x + enemyAdjustedSize, y: this.y + enemyAdjustedSize};
    }

    getDistanceToNext() {
        let nextWaypoint = 0;
        if (this.progress == track["nodes"].length-1) {
            nextWaypoint = track["nodes"][this.progress];
        }
        else nextWaypoint = track["nodes"][this.progress+1];

        let distance = Math.hypot(nextWaypoint.x-this.x, nextWaypoint.y-this.y)
        return distance;
    }

    kill() {
        if (this.health <= 0) {
            if (enemies[enemies.indexOf(this)] === this) {
                money += this.value;
                enemies.splice(enemies.indexOf(this), 1);
            }
        } 
    }

    slow(magnitude, duration)
    {
        if (this.slowed == false) {
            this.speed *= magnitude;
            this.slowed = true;
            setTimeout(() => {this.speed = this.maxSpeed; this.slowed = false;}, duration);
        }
    }

    stun(duration)
    {
        this.speed *= magnitude;
        this.speed = 0;
        setTimeout(() => {this.speed = this.maxSpeed;}, duration);
    }

    applyWaveMultiplier() {
        let upgradeTier = possibleEnemies[this.name].upgrades;
        this.health = Math.round(this.health + (upgradeTier.health * (wave-1)));
        this.value += upgradeTier.value * (wave-1);
    }
}

// Unit Creation ===================================================================================

function createUnit(id) {
    switch (id) {
        case "Shanks":
            currentUnit = new Unit("Shanks");
            break;
        case "Perona":
            currentUnit = new Perona("Perona");
            break;
        case "Jotaro":
            currentUnit = new Jotaro("Jotaro");
            break;
    }
}

function createEnemy(id) {
        switch (id) {
            case ("takeoff"):
                enemies.push(new Enemy("Takeoff"));
                break;
            case ("paul"):
                enemies.push(new Enemy("Paul"));
                break;
            case ("greedo"):
                enemies.push(new Enemy("Greedo"));
                break;
            case ("troll"):
                enemies.push(new Enemy("Troll"));
                break; 
    }
}

// Methods =========================================================================================

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
}

function checkWin() {
    if (health <= 0) health = 200;
}

// Canvas =========================================================================================

function drawRange(unit, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, unit.range, 0, 2 * Math.PI);
    ctx.fillStyle = "#00ff00a3";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.stroke();
}

function drawCurrentUnit() {
    if (!(currentUnit === null)) {
        ctx.drawImage(currentUnit.sprite, mouseX - unitAdjustedX, mouseY - unitAdjustedY, unitSize, unitSize);
        drawRange(currentUnit, mouseX, mouseY - 48);
    }
}

function detectRange(unit) {
    unit.enemyQueue = [];

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.font = "16px Arial";

    let unitCenterX = unit.getAdjustedPosition().x;
    let unitCenterY = unit.getAdjustedPosition().y;
    
    enemies.forEach(enemy => {
        let enemyCenterX = enemy.getAdjustedPosition().x;
        let enemyCenterY = enemy.getAdjustedPosition().y;

        let distance = Math.hypot(unitCenterX-enemyCenterX, unitCenterY-enemyCenterY)

        if (distance <= unit.range + enemyAdjustedSize) {
            if (!(unit.enemyQueue.includes(enemy))) unit.enemyQueue.push(enemy);
        }
    });

    let sorted = unit.getSortedEnemyQueue()[0];
    if (unit.getSortedEnemyQueue().length > 0 && debug === true) {
        ctx.beginPath();
        ctx.moveTo(unitCenterX, unitCenterY);
        ctx.lineTo(sorted.x + enemyAdjustedSize, sorted.y + enemyAdjustedSize);
        ctx.stroke(); 
    };

    unit.attack(sorted);
}

function drawUnits() {
    units.forEach(unit => {
        detectRange(unit);
        ctx.drawImage(unit.sprite, unit.x, unit.y, unitSize, unitSize);
        // drawStrokedText(unit.enemyQueue, unit.getAdjustedPosition().x, unit.y)
        // drawRange(unit, unit.getAdjustedPosition().x, unit.getAdjustedPosition().y);
    });
}

function drawHealth() {
    ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = "64px Arial";
    drawStrokedText(health, 200, 80);
}

function drawMoney() {
    // ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = "64px Arial";
    drawStrokedText(`£${money}`, 1336, 80);
}

function drawWave() {
    // ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = "64px Arial";
    drawStrokedText(`Wave: ${wave}`, 450, 80);
}

function drawStrokedText(text, x, y) {
    ctx.lineWidth = 8;
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
    ctx.strokeStyle = 'black';
    ctx.strokeText(text, x, y);
    
}

// Checkwin
function drawEnemies() {
    ctx.font = "32px Arial";
    enemies.forEach(obj => {
        // Replace with health bar
        if (debug === true) drawStrokedText(`${obj.health} ${obj.progress} ${Math.round(obj.getDistanceToNext())}`, obj.x + 64, obj.y - 32);
        else drawStrokedText(`${obj.health}`, obj.x + 64, obj.y - 32);
        

        // Sprite
        ctx.drawImage(obj.img, obj.x, obj.y, 128, 128);

        // Kill object at end
        if (obj.progress == track["nodes"].length-1) {
            enemies.splice(enemies.indexOf(obj), 1)
            health -= obj.health;
            checkWin();
            return;
        }

        let currentWaypoint = track["nodes"][obj.progress];
        let nextWaypoint = track["nodes"][obj.progress+1];

        let differenceX = nextWaypoint.x - currentWaypoint.x;
        let differenceY = nextWaypoint.y - currentWaypoint.y;

        // If moving horizontal
        if (currentWaypoint.y == nextWaypoint.y) {
            let magnitude = obj.speed * Math.sign(differenceX);
            obj.moveHorizontal(magnitude);

            if ((obj.x >= nextWaypoint.x && differenceX >= 0) || (obj.x <= nextWaypoint.x && differenceX <= 0)) obj.progress++;
        }

        // If moving vertical
        else if (currentWaypoint.x == nextWaypoint.x) {
            let magnitude = obj.speed * Math.sign(differenceY)
            obj.moveVertical(magnitude);

            if (obj.y >= nextWaypoint.y && differenceY >= 0 || obj.y <= nextWaypoint.y && differenceY <= 0) obj.progress++;
        }
    });
}

function draw() {
    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    
    drawCurrentUnit();
    drawUnits();
    drawEnemies();
    drawHealth();
    drawMoney();
    drawWave();

    ctx.drawImage(track["img"], 0, 0);
    requestAnimationFrame(draw);
}

// Gameloop =====================================================================================

function start() { 
    track["img"].src = track["sprite"];
    requestAnimationFrame(draw);
}

function spawnWave(wave) {
    waves[wave].forEach(enemySet => {
        let counter = 0;
        let spawn = setInterval(function() {
            createEnemy(enemySet.enemy);
            counter++;

            if (counter >= enemySet.quantity) clearInterval(spawn);

        }, enemySet.interval);
    })
}

addEventListener("keydown", (e) => {
    switch (e.key) {
        case ("r"):
            createEnemy("takeoff");
            break;
        case ("e"):
            createEnemy("paul");
            break;
        case ("w"):
            createEnemy("greedo");
            break;
        case ("q"):
            createEnemy("troll");
            break;
        case ("t"):
            spawnWave(++wave);
            break;   
        case ("m"):
            money += 10000;
            break;  
        case ("n"):
            showUnitUpgrade(units[0]);
            break; 
        case ("Escape"):
            currentUnit = null;
            currentShopUnit = null;
            updateBorders();
            break;
    }
});

addEventListener("mousemove", (e) => {getMousePos(e)});

function placeUnit() {
    if (currentUnit === null) return;

    if (money >= currentUnit.cost && getNumberOfUnits(currentUnit) < possibleUnits[currentUnit.name].maxNumber)
    {
        
        money -= currentUnit.cost;
        currentUnit.place(mouseX, mouseY);

        currentUnit = null;
        currentShopUnit = null;
    }
}

function showUnitUpgrade(unit) {
    elem = document.createElement("div");
    elem.classList.add("upgrade-menu");
    elem.style.left = `${unit.x}px`;
    elem.style.top = `${unit.y}px`;
    document.getElementById("main").appendChild(elem);
}

canvas.addEventListener("mousedown", () => {
    placeUnit();
});

populateOptions();
start();
