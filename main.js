// SHOP ===============================================

var currentUnit = null;
var shopOptions = [];

function populateOptions() {
    shopOptions = document.getElementById("shop-options").children;
}

function updateBorders() {
    if (currentUnit === null) return;

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

function placeUnit() {
    currentUnit = null;
    updateBorders();
}

// MAIN ===============================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

var mouseX = 0;
var mouseY = 0;

const heartIcon = new Image();
heartIcon.src = "Sprites/heart.png";
health = 200;

const enemies = [];

const speed = {
    slow: 1,
    normal: 2,
    fast: 4,
    faster: 8,
    superfast: 16,
    insane: 32,
    godspeed: 64
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
            ],
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function start() { 
    track["img"].src = track["sprite"];
    requestAnimationFrame(draw);
}

function checkWin() {
    if (health <= 0) {console.log("Lost"); health = 200;}
}

function draw() {
    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate enemy position and direction
    enemies.forEach(obj => {
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

    ctx.drawImage(track["img"], 0, 0);
    ctx.drawImage(heartIcon, 8, 0, 128, 128);
    ctx.font = "64px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`${health}`, 200, 80);

    requestAnimationFrame(draw);
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
    }
});

function spawnWave(amount, interval) {
    let counter = 0;

    let wave = setInterval(function() {
        // TODO - REPLACE WITH WAVE CONST
        enemies.push(new Enemy("takeoff", 4, speed.superfast, "Sprites/takeoff.jpg", 0, 256)); 
        counter++;

        if (counter >= amount) clearInterval(wave);
    }, interval)
}

document.getElementById("game").onclick = placeUnit;
addEventListener("mousemove", (e) => {getMousePos(e)});

populateOptions();
start();
