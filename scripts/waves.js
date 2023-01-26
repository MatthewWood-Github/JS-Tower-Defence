define(function () {
    return {
        track: track,
        waves: waves,
    }
});

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