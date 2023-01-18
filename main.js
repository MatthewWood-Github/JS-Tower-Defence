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
    selectedUnit = createUnit()
}

function placeUnit() {
    currentUnit = null;
    updateBorders();
}

// MAIN ===============================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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
}

var mouseX = 0;
var mouseY = 0;

enemies = [];

const track = {
    img: new Image(),
    sprite: "track.png",
    nodes: [[0, 256], [384, 256], [384, 512], [768, 512], [768, 256], [1152, 256], [1152, 1024]]
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function init() { 
    track["img"].src = track["sprite"];
    requestAnimationFrame(draw);
}

function draw() {
    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    enemies.forEach(obj => {
        ctx.drawImage(obj.img, obj.x, obj.y, 128, 128);
        if (obj.progress == track["nodes"].length-1) {
            enemies.splice(enemies.indexOf(obj), 1)
            return;
        }

        differenceX = track["nodes"][obj.progress+1][0] - track["nodes"][obj.progress][0];
        differenceY = track["nodes"][obj.progress+1][1] - track["nodes"][obj.progress][1];

        if (track["nodes"][obj.progress][1] == track["nodes"][obj.progress+1][1]) {
            if (differenceX >= 0) obj.x += obj.speed;
            if (differenceX < 0) obj.x -= obj.speed;
            
            if (obj.x == track["nodes"][obj.progress+1][0]) obj.progress++;
        }
        else if (track["nodes"][obj.progress][0] == track["nodes"][obj.progress+1][0]) {
            if (differenceY >= 0) obj.y += obj.speed;
            if (differenceY < 0) obj.y -= obj.speed;

            if (obj.y == track["nodes"][obj.progress+1][1]) obj.progress++;
        }
    });

    ctx.drawImage(track["img"], 0, 0)

    requestAnimationFrame(draw);
}

  
document.getElementById("game").onclick = placeUnit;
addEventListener("mousemove", (e) => {getMousePos(e)});

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

addEventListener("keydown", (e) => {
    switch (e.key) {
        case ("q"):
            enemies.push(new Enemy("greedo", 1, 4, "greedo.jpg", 0, 256));
            break;
        case ("w"):
            enemies.push(new Enemy("troll", 1, 2, "trollface.jpg", 0, 256));
            break;
        case ("e"):
            enemies.push(new Enemy("takeoff", 1, 32, "takeoff.jpg", 0, 256));
            break;
        case ("r"):
            enemies.push(new Enemy("shanks", 1, 8, "Shanks01.png", 0, 256));
            break;
        case ("t"):
            console.clear();
            console.table(enemies);
            break;    
        case ("y"):
            spawnWave(50 , 100);
            break;          
    }
});

populateOptions();
init();

function spawnWave(amount, interval) {
    let counter = 0;

    let wave = setInterval(function() {
        enemies.push(new Enemy("takeoff", 1, 16, "takeoff.jpg", 0, 256)); 
        counter++;

        if (counter > amount) clearInterval(wave);
    }, interval)
}



//sendWave(new Enemy("takeoff", 1, 2, "takeoff.jpg", 0, 256), 50);
