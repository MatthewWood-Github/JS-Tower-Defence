var font = "slksrc";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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

var currentUnit = null;

var enemiesKilled = 0;
var waveEnemiesKilled = 0;

function getNumberOfUnits(unit) {
    if (unit === null) return;
    let count = 0;
    units.forEach(obj => {
        if (obj.name == unit.name) count++
    })
    return count;
}


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

function skipWave() {
    if (wave >= Object.keys(waves).length) return;

    spawnWave(++wave);
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
            console.log(currentUnit);
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

function placeUnit() {
    if (currentUnit === null) return;

    if (money >= currentUnit.cost && getNumberOfUnits(currentUnit) < possibleUnits[currentUnit.name].maxNumber)
    {
        money -= currentUnit.cost;
        currentUnit.place(mouseX, mouseY);
        console.log(currentUnit);n
        //ui.showUnitUpgrade(currentUnit);

        currentUnit = null;
        currentShopUnit = null;
    }
}

canvas.addEventListener("mousedown", () => {
    placeUnit();
});

addEventListener("mousemove", (e) => {getMousePos(e)});

require(["./Shop", "./Waves",  "./UI"], function(shop, waves, ui) {
    shop.createUnitOptions();
    currentUnit = shop.currentUnit;

    function start() { 
        waves.track["img"].src = waves.track["sprite"];
        gameLoop = requestAnimationFrame(draw);
    }

    

    start();
})



