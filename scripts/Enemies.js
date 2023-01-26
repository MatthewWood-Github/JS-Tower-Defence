define(function () {
    return {
        speed: speed,
        possibleEnemies: possibleEnemies,
        startPos: startPos,
    }
});

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