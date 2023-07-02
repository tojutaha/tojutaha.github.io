import { items } from "./shop.js";
import { v2 } from "./vector.js";
import { Clamp } from "./utils.js";

let iconLocations = [];
const rectSize = 32;
const spacingX = rectSize*2;
const xOffset = 10;
const yOffset = rectSize + 5;
const height = 100;
const itemSpacing = height + 5;
const numOfColumns = 10;
    
export function UpdateUpgrades() {

    // TODO: Broken now
    return;
    
    iconLocations = [];

    let scale = 1;

    for (let i = 0; i < items.length; i++) {
        const amount = Clamp(items[i].numOfPurchases, 0, numOfColumns*2-1);
        for (let n = 0; n < amount; n++) {
            const row = Math.floor(n / numOfColumns);
            const col = n % numOfColumns;
            const x = xOffset + col * spacingX + (row > 0 ? 32 : 0) * scale;
            const y = i * itemSpacing + row * yOffset + 10 * scale;
            iconLocations.push({x, y}); 
        }
    }
}

export function DrawUpgrades(canvas, ctx)
{
    ctx.fillStyle = "#00ffff";
    for (let i = 0; i < iconLocations.length; i++) {
        const p = iconLocations[i];
        ctx.fillRect(p.x, p.y, rectSize, rectSize);
    }
}

