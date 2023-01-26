define(function () {
    return {
        possibleUnits: possibleUnits,
    }
});

const possibleUnits = {
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