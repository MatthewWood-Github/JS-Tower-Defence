var font = "slksrc";
var currentUnit = null;

var possibleUnits = {
    Valentine: {
        name: "Valentine",
        cost: 300,
        damage: 5,
        damageTarget: "AOE",
        damageTargetRange: 100,
        range: 350,
        attackSpeed: 4000,
        spriteSource: "Sprites/Valentine01-outline-green.png",
        maxNumber: 3,
        abilityCooldown: 0,
        upgrades: {
            1: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            2: {cost: 500, damage: 40, range: 25, attackSpeed: 400},
            3: {cost: 1000, damage: 50, range: 0, attackSpeed: 400},
            4: {cost: 2500, damage: 100, range: 0, attackSpeed: 400},
            5: {cost: 3750, damage: 200, range: 0, attackSpeed: 400}
        } //          9250          400 (2000)  400             2.2s
    },

    Shanks: {
        name: "Shanks",
        cost: 1550,
        damage: 200,
        damageTarget: "AOE",
        damageTargetRange: 100,
        range: 400,
        attackSpeed: 6500,
        spriteSource: "Sprites/Shanks01-outline-green.png",
        maxNumber: 1,
        abilityCooldown: 20000,
        stunLength: 5000,
        upgrades: {
            1: {cost: 2000, damage: 300, range: 0, attackSpeed: 600},
            2: {cost: 2500, damage: 500, range: 25, attackSpeed: 600},
            3: {cost: 4000, damage: 1600, range: 25, attackSpeed: 600},
            4: {cost: 6000, damage: 2400, range: 25, attackSpeed: 600},
            5: {cost: 10000, damage: 5000, range: 25, attackSpeed: 600}
        }
    },

    Perona: {
        name: "Perona",
        cost: 650,
        damage: 50,
        damageTarget: "Single",
        damageTargetRange: 100,
        range: 550,
        attackSpeed: 5000,
        spriteSource: "Sprites/Perona01-outline-green.png",
        maxNumber: 3,
        abilityCooldown: 0,
        slowFactor: 0.5,
        slowLength: 2000,
        upgrades: {
            1: {cost: 1000, damage: 50, range: 0, attackSpeed: 0},
            2: {cost: 1500, damage: 100, range: 0, attackSpeed: 200},
            3: {cost: 2500, damage: 300, range: 0, attackSpeed: 200},
            4: {cost: 3500, damage: 500, range: 25, attackSpeed: 400},
            5: {cost: 5000, damage: 500, range: 25, attackSpeed: 1000}
        } //          13500         2500       600               3s
    },

    Jotaro: {
        name: "Jotaro",
        cost: 300,
        damage: 5,
        damageTarget: "AOE",
        damageTargetRange: 100,
        range: 350,
        attackSpeed: 4000,
        spriteSource: "Sprites/Jotaro01-outline-green.png",
        maxNumber: 3,
        abilityCooldown: 0,
        upgrades: {
            1: {cost: 200, damage: 5, range: 25, attackSpeed: 200},
            2: {cost: 500, damage: 40, range: 25, attackSpeed: 400},
            3: {cost: 1000, damage: 50, range: 0, attackSpeed: 400},
            4: {cost: 2500, damage: 100, range: 0, attackSpeed: 400},
            5: {cost: 3750, damage: 200, range: 0, attackSpeed: 400}
        } //          9250          400 (2000)  400             2.2s
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

        upgrades: {health: 250, value: 50}
    },

    Paul: {
        name: "Paul",
        health: 150,
        speed: speed.fast,
        sprite: "Sprites/paul.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 100,

        upgrades: {health: 250, value: 50}
    },

    Greedo: {
        name: "Greedo",
        health: 50,
        speed: speed.slow,
        sprite: "Sprites/greedo.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 100,

        upgrades: {health: 150, value: 100}
    },

    Troll: {
        name: "Troll",
        health: 0,
        speed: speed.boss,
        sprite: "Sprites/trollface.jpg",
        x: startPos.x,
        y: startPos.y,
        value: 1000,

        upgrades: {health: 5500, value: 200}
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
        {enemy: "greedo", quantity: 3, interval: 400, timeout: 0},
        {enemy: "greedo", quantity: 3, interval: 400, timeout: 3000},
    ],
    2: [
        {enemy: "greedo", quantity: 3, interval: 500, timeout: 0},
        {enemy: "greedo", quantity: 6, interval: 500, timeout: 6000},
    ],
    3: [
        {enemy: "greedo", quantity: 6, interval: 300, timeout: 0},
        {enemy: "paul", quantity: 2, interval: 3000, timeout: 1000},
        {enemy: "greedo", quantity: 3, interval: 500, timeout: 6000},
    ],
    4: [{enemy: "greedo", quantity: 3, interval: 300, timeout: 0},
        {enemy: "paul", quantity: 1, interval: 4000, timeout: 1000},
        {enemy: "greedo", quantity: 3, interval: 300, timeout: 5000},
        {enemy: "paul", quantity: 1, interval: 4000, timeout: 5000},
        {enemy: "greedo", quantity: 3, interval: 300, timeout: 1000},
    ],
    5: [{enemy: "greedo", quantity: 6, interval: 300, timeout: 0},
        {enemy: "paul", quantity: 1, interval: 4000, timeout: 7000}, 
        {enemy: "troll", quantity: 1, interval: 5000, timeout: 1000},
        {enemy: "paul", quantity: 1, interval: 4000, timeout: 12000}, 
    ],
    6: [{enemy: "greedo", quantity: 12, interval: 300, timeout: 0},
        {enemy: "takeoff", quantity: 1, interval: 4000, timeout: 7000}, 
        {enemy: "troll", quantity: 2, interval: 10000, timeout: 1000},
        {enemy: "takeoff", quantity: 1, interval: 4000, timeout: 16000}, 
    ],
    7: [
        {enemy: "paul", quantity: 12, interval: 400, timeout: 0},
    ],
    8: [
        {enemy: "takeoff", quantity: 5, interval: 1000, timeout: 0},
        {enemy: "troll", quantity: 2, interval: 5000, timeout: 2000},
        {enemy: "takeoff", quantity: 5, interval: 1000, timeout: 15000},
    ],
    9: [
        {enemy: "takeoff", quantity: 5, interval: 1000, timeout: 0},
        {enemy: "troll", quantity: 2, interval: 5000, timeout: 1000},
        {enemy: "takeoff", quantity: 5, interval: 1000, timeout: 15000},
    ],
    10: [
        {enemy: "troll", quantity: 3, interval: 5000, timeout: 0},
    ]
}

const heartIcon = new Image();
heartIcon.src = "Sprites/heart.png";
var health = 1500;
var money = 500;
var wave = 0;
var playing = true;
var startTime = Date.now();

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
var units = [];

function getNumberOfUnits(unit) {
    if (unit === null) return;
    let count = 0;
    units.forEach(obj => {
        if (obj.name == unit.name) count++
    })
    return count;
}

var enemiesKilled = 0;
var waveEnemiesKilled = 0;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// SHOP ===================================================================================

var currentShopUnit = null;
var shopOptions = [];

function populateOptions() {
    shopOptions = document.getElementById("shop-options").children;
    for (elem of shopOptions) {
        elem.innerHTML = `$${possibleUnits[elem.id].cost}`;
    }
}

function updateBorders() {
    for (elem of shopOptions) {
        elem.style.borderColor = "black";
    }

    if (currentShopUnit === null) return;

    currentShopUnit.style.borderColor = "yellow";
}

function shopButtonAnimation(id) {
    elem = document.getElementById(id)
    elem.classList.add("button-animation");
    elem.style.filter = ("brightness(0.5)");
    updateBorders();
}

function undim(id) {
    document.getElementById(id).style.filter = ("brightness(1)");
}

function shopAction(id) {
    createUnit(id);
    currentShopUnit = elem;
    document.getElementById(id).style.filter = ("brightness(1)")
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

        this.abilityCooldown = possibleUnits[name].abilityCooldown;
        this.lastAbility = 0;

        this.targetingOptions = ["First", "Last", "Strong", "Weak", "Close", "Far"];
        this.targetingIndex = 0;
        this.targeting = this.targetingOptions[this.targetingIndex];
        this.lastAttack = 0;
        this.damageTargetRange = possibleUnits[name].damageTargetRange;

        this.enemyQueue = [];
    }

    place(x, y) {
        this.x = x - unitAdjustedX;
        this.y = y - unitAdjustedY;
        currentShopUnit = null;
        updateBorders();
        units.unshift(this);
        showUnitUpgrade(this);
    }

    attack(target) {
        if (target === undefined) return;
        if (this.canAttack()) {
            this.lastAttack = Date.now();

            switch (possibleUnits[this.name].damageTarget) {
                case "Single":
                    this.attackSingle(target);
                    break;
                case "AOE":
                    this.attackAOE(target);
                    break;
            }
        }
    }

    attackSingle(target) {
        target.health-=this.damage;
        target.kill();
    }

    attackAOE(target) {
        let enemiesAttacked = [];
        for (var x = 0; x < enemies.length; x++) {
            let distance = Math.hypot(target.getAdjustedPosition().x - enemies[x].getAdjustedPosition().x,
                                      target.getAdjustedPosition().y - enemies[x].getAdjustedPosition().y);
            if (distance <= this.damageTargetRange && !enemiesAttacked.includes(enemies[x])) {
                enemiesAttacked.push(enemies[x]);
                enemies[x].health -= this.damage;
                if (enemies[x].health <= 0) {
                    enemies[x].kill();
                    x = -1;
                }
            }
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

    canUseAbility() {
        if  (this.lastAbility == 0) return true;
        if (Date.now() >= this.lastAbility + this.abilityCooldown) return true;
        else return false;
    }

    startAbilityTimer(ability, unit) {
        let cooldown = document.createElement("div");
        cooldown.classList.add("ability-cooldown");
        ability.appendChild(cooldown);
        let pixelpos = 0;

        let timer = setInterval(function() {
            if (unit.canUseAbility()) {ability.removeChild(cooldown); clearInterval(timer);};
            pixelpos += cooldown.offsetWidth/unit.abilityCooldown*1000;
            cooldown.style.left = `${pixelpos}px`;
        }, 1000);
    }

    getAdjustedPosition() {
        return {x: this.x + unitAdjustedX, y: this.y + unitAdjustedX}
    }

    getSortedEnemyQueue() {
        switch(this.targeting) {
            case "First":
            if (this.enemyQueue.length > 1) {
                let output = this.enemyQueue;
                output = output.sort((a, b) => {
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
                output = output.sort((a, b) => {
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

            case "Strong":
                if (this.enemyQueue.length > 1) {
                    let output = this.enemyQueue;
                    output = output.sort((a, b) => (a.health < b.health) ? 1 : -1);
                    return output;
                };
            break;

            case "Weak":
                if (this.enemyQueue.length > 1) {
                    let output = this.enemyQueue;
                    output = output.sort((a, b) => (a.health > b.health) ? 1 : -1);
                    return output;
                };
            break;

            case "Close":
                if (this.enemyQueue.length > 1) {
                    let output = this.enemyQueue;
                    output = output.sort((a, b) => (a.getDistanceToUnit(this) > b.getDistanceToUnit(this)) ? 1 : -1);
                    return output;
                };
            break;

            case "Far":
                if (this.enemyQueue.length > 1) {
                    let output = this.enemyQueue;
                    output = output.sort((a, b) => (a.getDistanceToUnit(this) < b.getDistanceToUnit(this)) ? 1 : -1);
                    return output;
                };
            break;

        }
        return this.enemyQueue;
    }

    cycleTargeting() {
        if (this.targetingIndex == this.targetingOptions.length-1) {
            this.targetingIndex = 0;
            this.targeting = this.targetingOptions[this.targetingIndex];
        }
        else {
            this.targeting = this.targetingOptions[++this.targetingIndex];
        };
    }

    upgrade() {
        let upgradeTier = possibleUnits[this.name].upgrades[++this.level];
        this.damage += upgradeTier.damage;
        this.range += upgradeTier.range;
        this.attackSpeed -= upgradeTier.attackSpeed;
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
            let enemiesAttacked = [];

            for (var x = 0; x < enemies.length; x++) {
                let distance = Math.hypot(target.getAdjustedPosition().x - enemies[x].getAdjustedPosition().x,
                                        target.getAdjustedPosition().y - enemies[x].getAdjustedPosition().y);
                if (distance <= this.damageTargetRange && !enemiesAttacked.includes(enemies[x])) {
                    enemiesAttacked.push(enemies[x]);
                };              
            }

            let attackRush = setInterval(function() {
                for (var i = 0; i < enemiesAttacked.length; i++) {
                    enemiesAttacked[i].health -= damagePerHit;
                }

                for (var y = 0; y < enemies.length; y++) {
                    if (enemies[y].health <= 0) {
                        enemies[y].kill();
                        y = -1;
                    }
                };  
                
                counter++;
                if (counter >= numberOfAttacks) clearInterval(attackRush);
            }, timeBetweenHits);
            
                        
        }
    }
}

class Perona extends Unit {
    attack(target) {
        if (target === undefined) return;
        if (this.canAttack() && target.stunned === false) {
            let damagePerHit = this.damage;
            this.lastAttack = Date.now();
            target.health -= damagePerHit;
            target.slow(possibleUnits[this.name].slowFactor, possibleUnits[this.name].slowLength)
            if (!(target === null)) target.kill();
        }
    }
}

class Shanks extends Unit {
    place(x, y) {
        super.place(x,y);
        let abilityBar = document.getElementById("ability-bar");
        let elem = document.createElement("div");
        elem.classList.add("ability");
        elem.style.backgroundImage = "url('Sprites/shanks-ability.png')";
        elem.onclick = () => {this.ability(elem, this)};
        abilityBar.appendChild(elem);
    }

    ability(elem, unit,) {
        if (unit.canUseAbility()) {
            unit.enemyQueue.forEach(enemy => {
                enemy.stun(possibleUnits[this.name].stunLength);
                enemy.health -= unit.damage;
                enemy.kill();
            });
            this.lastAbility = Date.now();
            unit.startAbilityTimer(elem, unit);
        };
    };
}

class Enemy {
    constructor(name) {
        this.name = name;
        this.maxHealth = possibleEnemies[name].health;
        this.health = possibleEnemies[name].health;
        this.maxSpeed = possibleEnemies[name].speed;
        this.speed = possibleEnemies[name].speed;
        this.slowed = false;
        this.stunned = false;
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
                enemiesKilled++;
                waveEnemiesKilled++;
            }
        } 
    }

    slow(magnitude, duration)
    {
        if (this.slowed == false && this.stunned == false) {
            this.speed *= magnitude;
            this.slowed = true;
            setTimeout(() => {this.speed = this.maxSpeed; this.slowed = false;}, duration);
        }
    }

    stun(duration)
    {
        this.stunned = true;
        this.speed = 0;
        setTimeout(() => {this.speed = this.maxSpeed; this.stunned = false;}, duration);
    }

    applyWaveMultiplier() {
        let upgradeTier = possibleEnemies[this.name].upgrades;
        this.health = Math.round(this.health + (upgradeTier.health * (wave-1)));
        this.value += upgradeTier.value * (wave-1);
    }

    getDistanceToUnit(unit) {
        return Math.hypot(unit.x-this.x, unit.y-this.y)
    }
}

// Unit Creation ===================================================================================

function createUnit(id) {
    switch (id) {
        case "Shanks":
            currentUnit = new Shanks("Shanks");
            break;
        case "Perona":
            currentUnit = new Perona("Perona");
            break;
        case "Jotaro":
            currentUnit = new Jotaro("Jotaro");
            break;
        case "Valentine":
            currentUnit = new Unit("Valentine");
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
    if (health <= 0) {
        health = 0;
        createOutcomeScreen("You Lost!", "Retry");
        playing = false;
        units = [];
    }
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
    ctx.font = `16px ${font}`;

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
    ctx.drawImage(heartIcon, 8, 28, 64, 64);
    ctx.font = `64px ${font}`;
    drawStrokedText(health, 170, 80);
}

function drawMoney() {
    // ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = `64px ${font}`;
    drawStrokedText(`$${money}`, 420, 80);
}

function drawWave() {
    // ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = `64px`;
    drawStrokedText(`Wave: ${wave}`, 1336, 80);
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
    ctx.font = `32px Arial`;
    enemies.forEach(obj => {
        // Replace with health bar
        if (debug === true) drawStrokedText(`${obj.health} ${obj.progress} ${Math.round(obj.getDistanceToNext())}`, obj.x + 64, obj.y - 32);
        else drawStrokedText(`${obj.health}`, obj.x + 64, obj.y - 32);
        
        // Sprite
        ctx.drawImage(obj.img, obj.x, obj.y, 128, 128);

        // Kill object at end
        if (obj.progress == track["nodes"].length-1) {
            enemies.splice(enemies.indexOf(obj), 1)
            if (playing === true) {
                health -= obj.health;
                waveEnemiesKilled++;
                checkWin();
            };
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
    gameManager();

    ctx.drawImage(track["img"], 0, 0);
    gameLoop = requestAnimationFrame(draw);
}

// Gameloop =====================================================================================

function start() { 
    track["img"].src = track["sprite"];
    gameLoop = requestAnimationFrame(draw);
}

function spawnWave(_wave) {
    if (playing === false) return;

    if (_wave > Object.keys(waves).length) { 
        wave = Object.keys(waves).length; 
        createOutcomeScreen("You Won!", "Replay"); 
        playing = false
        document.getElementById("next-wave").onclick = "";
    }
    
    waves[_wave].forEach(enemySet => {
        setTimeout(function() {
            let counter = 0;
            let spawn = setInterval(function() {
                createEnemy(enemySet.enemy);
                counter++;
    
                if (counter >= enemySet.quantity) clearInterval(spawn);
    
            }, enemySet.interval);
        }, enemySet.timeout);
    })
}

function getEnemiesLeft() {
    let output = {};
    Object.keys(waves).forEach(wave => {
        output[wave] = 0;
        waves[wave].forEach(enemySet => {
            output[wave] += enemySet.quantity;
        })
    })
    return output;
}

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

function gameManager() {
    if (waveEnemiesKilled >= getEnemiesLeft()[wave])
    {
        spawnWave(++wave);
        waveEnemiesKilled = 0;
        createWaveText();
    }
}

function restart() {
    location.reload();
}

function mainMenu() {
    return;
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
            createOutcomeScreen("You Lost!", "Retry");
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

var highestZIndex = 20;

function showUnitUpgrade(unit) {
    let elem = document.createElement("div");
    elem.classList.add("upgrade-menu");
    elem.style.left = `${unit.x}px`;
    elem.style.top = `${unit.y}px`;
    elem.onmouseenter = () => {elem.style.zIndex = ++highestZIndex};

    elem.appendChild(createTargetingButton(unit));
    elem.appendChild(createIcon("url('Sprites/damage-icon.png')", unit.damage));
    elem.appendChild(createIcon("url('Sprites/attack-speed.png')", unit.attackSpeed/1000));
    elem.appendChild(createIcon("url('Sprites/attack-range.png')", unit.range));
    elem.appendChild(createUpgradeButton(unit));

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

function createUpgradeButton(unit) {
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

canvas.addEventListener("mousedown", () => {
    placeUnit();
});

populateOptions();
start();
