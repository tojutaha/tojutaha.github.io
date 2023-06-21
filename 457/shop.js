import { Button } from "./button.js"

export class Item
{
    // if affectsPPC is true, then the bonus will affect points per click,
    // otherwise it will affect points per second.
    constructor(name, basePrice, increment, baseBonus, affectsPPC)
    {
        this.name = name;
        this.basePrice = basePrice;
        this.price = basePrice;
        this.increment = increment;
        this.baseBonus = baseBonus;
        this.bonus = baseBonus;
        this.affectsPPC = affectsPPC;
        this.numOfPurchases = 0;
    }
}

export let items = [
    new Item("Upgrade PPC", 1, 2, 1, true),
    new Item("Upgrade PPS", 50, 100, 50, false),
];

export const buttons = [];
export function InitializeShop(canvas)
{
    buttons.splice(0);
    const horizontalOffset = 5;
    let verticalOffset = 5;
    const buttonWidth = canvas.width - 15;
    const buttonHeight = 120;
    
    for (let i = 0; i < items.length; i++) {
        buttons.push(new Button(buttonWidth, buttonHeight, 
                     horizontalOffset, verticalOffset, items[i]));
        verticalOffset += buttonHeight + 5;
    }
}

export function DrawShop(ctx, canvas, mouseP, Score)
{
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].Draw(ctx, canvas, mouseP, Score.totalPoints);
    }
}