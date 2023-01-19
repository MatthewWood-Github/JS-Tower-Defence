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
    currentUnit = new Unit("Shanks", 1050, 1, 250, 1, "Sprites/Shanks01-outline-yellow.png");;
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
            ],
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
health = 200;

var mouseX = 0;
var mouseY = 0;

const unitSize = 192;
const placeAtFeetRatio = 1.3;
const unitAdjustedX = unitSize/2;
const unitAdjustedY = unitSize/1.3;

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
        target.health -= this.damage;
    }

    ability() {
        return;
    }

    queueListener() {
        
    }
}

class Enemy {
    constructor(name, health, speed, sprite, x, y) {
        this.name = name;
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
}

currentUnit = new Unit("Shanks", 1050, 1, 250, 1, "Sprites/Shanks01-outline-yellow.png");

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
}

function start() { 
    track["img"].src = track["sprite"];
    requestAnimationFrame(draw);
}

function checkWin() {
    if (health <= 0) {console.log("Lost"); health = 200;}
}

function drawCurrentUnit() {
    if (!(currentUnit === null)) {
        ctx.drawImage(currentUnit.sprite, mouseX - unitAdjustedX, mouseY - unitAdjustedY, unitSize, unitSize);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY - 48, currentUnit.range, 0, 2 * Math.PI);
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}

function drawUnits() {
    units.forEach(obj => {
        ctx.drawImage(obj.sprite, obj.x, obj.y, unitSize, unitSize);
    });
}

function drawHealth() {
    ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = "64px Arial";
    drawStrokedText(health, 200, 80);
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

    ctx.drawImage(track["img"], 0, 0);
    requestAnimationFrame(draw);
}

function spawnWave(amount, interval) {
    let counter = 0;

    let wave = setInterval(function() {
        // TODO - REPLACE WITH WAVE CONST
        enemies.push(new Enemy("takeoff", 4, speed.superfast, "Sprites/takeoff.jpg", 0, 256)); 
        counter++;

        if (counter >= amount) clearInterval(wave);
    }, interval)
}

addEventListener("keydown", (e) => {
    switch (e.key) {
        case ("r"):
            enemies.push(new Enemy("takeoff", 20, speed.superfast, "Sprites/takeoff.jpg", 0, 256));
            break;
        case ("e"):
            enemies.push(new Enemy("paul", 15, speed.faster, "Sprites/paul.jpg", 0, 256));
            break;
        case ("w"):
            enemies.push(new Enemy("greedo", 5, speed.normal, "Sprites/greedo.jpg", 0, 256));
            break;
        case ("q"):
            enemies.push(new Enemy("troll", 200, speed.slow, "Sprites/trollface.jpg", 0, 256));
            break;
        case ("m"):
            console.clear();
            console.table(enemies);
            break;    
        case ("t"):
            spawnWave(50 , 100);
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
    if (!(currentUnit === null))
    {
        console.log(`placed ${currentUnit.name}`);
        console.log(currentUnit);
        console.table(units);
        currentUnit.place(mouseX, mouseY);

        currentUnit = null;
        currentShopUnit = null;
    }
});

populateOptions();
start();
