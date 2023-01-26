define(function () {
    return {
        createUnit: createUnit,
        createEnemy: createEnemy,
    }
});

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

function createUnit(id) {
    let currentUnit = null;
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

    return currentUnit;
}

function createEnemy(id) {
    let newEnemy = null;
    switch (id) {
        case ("takeoff"):
            newEnemy = new Enemy("Takeoff");
            break;
        case ("paul"):
            newEnemy = new Enemy("Paul");
            break;
        case ("greedo"):
            newEnemy = new Enemy("Greedo");
            break;
        case ("troll"):
            newEnemy = new Enemy("Troll");
            break; 
    }

    return newEnemy;
}