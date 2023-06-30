import { Button } from "./button.js"

export class Item
{
    // if affectsPPC is true, then the bonus will affect points per click,
    // otherwise it will affect points per second.
    constructor(name, basePrice, increment, baseBonus, 
                affectsPPC, locked, unlocksIn)
    {
        this.name = name;
        this.basePrice = basePrice;
        this.price = basePrice;
        this.increment = increment;
        this.baseBonus = baseBonus;
        this.bonus = baseBonus;
        this.affectsPPC = affectsPPC;
        this.numOfPurchases = 0;
        this.locked = locked;
        this.unlocksIn = unlocksIn;
    }
}

// TODO: Real items
export let items = [
    new Item("Upgrade PPC", 1, 2, 1, true, false, 0),
    new Item("Upgrade PPS", 1, 2, 1, false, false, 0),
    new Item("Upgrade PPC++", 50, 100, 50, true, true, 500),
    new Item("Upgrade PPS++", 50, 100, 50, false, true, 1000),
    new Item("Upgrade PPC+++", 200, 2000, 200, true, true, 2000),
    new Item("Upgrade PPS+++", 200, 2000, 200, false, true, 4000),
    new Item("Upgrade PPC++++", 400, 4000, 400, true, true, 6000),
    new Item("Upgrade PPS++++", 400, 4000, 400, false, true, 8000),
    new Item("Legendary PPS++++", 4000, 40000, 4000, false, true, 10000),
];

export let buttons = [];
export function InitializeShop(canvas)
{
    buttons = [];
    const width = canvas.width;
    const height = 100;
    const spacingY = height + 5;
    
    for (let i = 0; i < items.length; i++) {
        if (!items[i].locked) {
            buttons.push(new Button(width, height, 
                0, i * spacingY, items[i]));
        }
    }
}

export function UpdateShop(canvas, allTimePoints)
{
    let count = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (allTimePoints >= item.unlocksIn) {
            item.locked = false;
            count++;
        }
    }

    if (count > 0 ) {
        InitializeShop(canvas);
    }
}

export function DrawShop(ctx, canvas, mouseP, Score)
{
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].Draw(ctx, canvas, mouseP, Score.totalPoints);
    }
}
