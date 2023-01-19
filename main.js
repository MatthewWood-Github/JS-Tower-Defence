// SHOP ===============================================

var currentShopUnit = null;
var shopOptions = [];

function populateOptions() {
    shopOptions = document.getElementById("shop-options").children;
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
        {enemy: "paul", quantity: 1, interval: 2000},
    ],
    2: [
        {enemy: "greedo", quantity: 10, interval: 300},
        {enemy: "paul", quantity: 2, interval: 2000},
        {enemy: "troll", quantity: 1, interval: 4000},
    ],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: []
}

const enemies = [];
const units = [];

const speed = {
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
    constructor(name, cost, damage, range, attackSpeed, spriteSource, x, y) {
        this.name = name;
        this.cost = cost;
        this.damage = damage;
        this.range = range;
        this.attackSpeed = attackSpeed;
        this.sprite = new Image();
        this.sprite.src = spriteSource;
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
            target.kill();
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
                target.kill();
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
            target.speed /= 2;
            target.kill();
        }
    }
}

class Enemy {
    constructor(name, health, speed, sprite, x, y) {
        this.name = name;
        this.maxHealth = health;
        this.health = health;
        this.speed = speed;
        this.img = new Image();
        this.img.src = sprite;
        this.x = x;
        this.y = y;
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
            money += this.maxHealth;
            enemies.splice(enemies.indexOf(this), 1);
        } 
    }
}

currentUnit = null;

// Methods ================================================================

function createUnit(id) {
    switch (id) {
        case "Shanks":
            currentUnit = new Unit("Shanks", 1050, 1000, 250, 1800, "Sprites/Shanks01-outline-green.png");
            break;
        case "Perona":
            currentUnit = new Perona("Perona", 530, 200, 500, 1100, "Sprites/Perona01-outline-green.png");
            break;
        case "Jotaro":
            currentUnit = new Jotaro("Jotaro", 470, 5, 350, 1000, "Sprites/Jotaro01-outline-green.png");
            break;
    }
}

function createEnemy(id) {
        switch (id) {
            case ("takeoff"):
                enemies.push(new Enemy("takeoff", 200, speed.superfast, "Sprites/takeoff.jpg", 0, 256));
                break;
            case ("paul"):
                enemies.push(new Enemy("paul", 150, speed.faster, "Sprites/paul.jpg", 0, 256));
                break;
            case ("greedo"):
                enemies.push(new Enemy("greedo", 50, speed.normal, "Sprites/greedo.jpg", 0, 256));
                break;
            case ("troll"):
                enemies.push(new Enemy("troll", 2000, speed.slow, "Sprites/trollface.jpg", 0, 256));
                break; 
    }
}

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
            /*
            ctx.beginPath();
            ctx.moveTo(unitCenterX, unitCenterY);
            ctx.lineTo(enemyCenterX, enemyCenterY);
            ctx.stroke(); */

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

    // Checkwin
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

canvas.addEventListener("mousedown", () => {
    if (!(currentUnit === null) && money >= currentUnit.cost)
    {
        money -= currentUnit.cost;
        currentUnit.place(mouseX, mouseY);

        currentUnit = null;
        currentShopUnit = null;
    }
});

populateOptions();
start();
