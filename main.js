// SHOP ===============================================

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

// MAIN ===============================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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
        {enemy: "greedo", quantity: 6, interval: 300},
    ],
    3: [
        {enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "troll", quantity: 1, interval: 1000},
        {enemy: "greedo", quantity: 2, interval: 2000},
        {enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "jake", quantity: 1, interval: 3000},
    ],
    4: [],
    5: [],
    6: [],
    7: [
        {enemy: "troll", quantity: 1, interval: 1000},
        {enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "jake", quantity: 1, interval: 3000},
    ],
    8: [],
    9: [],
    10: [
        {enemy: "troll", quantity: 6, interval: 500},
        {enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "takeoff", quantity: 3, interval: 500},
        {enemy: "greedo", quantity: 6, interval: 300},
        {enemy: "takeoff", quantity: 3, interval: 500},
    ]
}

const enemies = [];
const units = [];

const speed = {
    boss: 0.5,
    slow: 1,
    normal: 2,
    fast: 4,
    faster: 8,
    superfast: 16,
    insane: 32,
    godspeed: 64,
}

const heartIcon = new Image();
heartIcon.src = "Sprites/heart.png";
var health = 200;
var money = 500;
var wave = 0;

var mouseX = 0;
var mouseY = 0;

const unitSize = 192;
const placeAtFeetRatio = 1.3;
const unitAdjustedX = unitSize/2;
const unitAdjustedY = unitSize/1.3;

const enemySize = 128;
const enemyAdjustedSize = enemySize/2;

// Classes ================================================================

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
}

class Jotaro extends Unit {
    attack(target) {
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
        this.progress = 0;
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

    kill() {
        if (this.health <= 0) {
            money += this.value;
            if (enemies[enemies.indexOf(this)] === this) {
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
}

currentUnit = null;

possibleUnits = {
    Shanks: {
        name: "Shanks",
        cost: 1050,
        damage: 200,
        range: 250,
        attackSpeed: 1800,
        spriteSource: "Sprites/Shanks01-outline-green.png"
    },

    Perona: {
        name: "Perona",
        cost: 530,
        damage: 30,
        range: 550,
        attackSpeed: 1100,
        spriteSource: "Sprites/Perona01-outline-green.png"
    },

    Jotaro: {
        name: "Jotaro",
        cost: 300,
        damage: 5,
        range: 350,
        attackSpeed: 2000,
        spriteSource: "Sprites/Jotaro01-outline-green.png"
    }
}

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

const startPos = {x: 0, y: 256};

const possibleEnemies = {
    Takeoff: {
        name: "Takeoff",
        health: 200,
        speed: speed.faster,
        sprite: "Sprites/takeoff.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 250
    },

    Paul: {
        name: "Paul",
        health: 150,
        speed: speed.fast,
        sprite: "Sprites/paul.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 100
    },

    Greedo: {
        name: "Greedo",
        health: 50,
        speed: speed.slow,
        sprite: "Sprites/greedo.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 100
    },

    Troll: {
        name: "Troll",
        health: 2000,
        speed: speed.boss,
        sprite: "Sprites/trollface.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 1000
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

// Methods ================================================================

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
}

function checkWin() {
    if (health <= 0) health = 200;
}

// Canvas ================================================================

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
    
    enemies.forEach(enemy => {
        let enemyCenterX = enemy.getAdjustedPosition().x;
        let enemyCenterY = enemy.getAdjustedPosition().y;

        let unitCenterX = unit.getAdjustedPosition().x;
        let unitCenterY = unit.getAdjustedPosition().y;

        let distance = Math.hypot(unitCenterX-enemyCenterX, unitCenterY-enemyCenterY)

        if (distance <= unit.range + enemyAdjustedSize) {
            unit.enemyQueue.push(enemy);
            
            ctx.beginPath();
            ctx.moveTo(unitCenterX, unitCenterY);
            ctx.lineTo(unit.enemyQueue[0].x, unit.enemyQueue[0].y);
            ctx.stroke(); 

            unit.attack(unit.enemyQueue[0]);
        }
    });
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
    drawStrokedText(money, 1436, 80);
}

function drawWave() {
    // ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = "64px Arial";
    drawStrokedText(wave, 350, 80);
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
        drawStrokedText(obj.health, obj.x + 64, obj.y - 32);

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

            if (obj.x == nextWaypoint.x) obj.progress++;
        }

        // If moving vertical
        else if (currentWaypoint.x == nextWaypoint.x) {
            let magnitude = obj.speed * Math.sign(differenceY)
            obj.moveVertical(magnitude);

            if (obj.y == nextWaypoint.y) obj.progress++;
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

// Gameloop ================================================================

function start() { 
    track["img"].src = track["sprite"];
    requestAnimationFrame(draw);
}

function spawnWave(wave) {
    waves[wave].forEach(enemySet => {
        let counter = 0;
        let spawn = setInterval(function() {
            console.table(enemies);
           
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
        case ("Escape"):
            currentUnit = null;
            currentShopUnit = null;
            updateBorders();
            break;
    }
});

addEventListener("mousemove", (e) => {getMousePos(e)});

function placeUnit() {
    if (!(currentUnit === null) && money >= currentUnit.cost)
    {
        money -= currentUnit.cost;
        currentUnit.place(mouseX, mouseY);

        currentUnit = null;
        currentShopUnit = null;
    }
}

canvas.addEventListener("mousedown", () => {
    placeUnit();
});

populateOptions();
start();
