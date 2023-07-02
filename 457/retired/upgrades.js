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
    
// Calculate item icon locations
export function UpdateUpgrades() {
    // TODO: Scale by canvas size??
    iconLocations = [];

    for (let i = 0; i < items.length; i++) {
        const amount = Clamp(items[i].numOfPurchases, 0, numOfColumns*2-1);
        for (let n = 0; n < amount; n++) {
            const row = Math.floor(n / numOfColumns);
            const col = n % numOfColumns;
            const x = xOffset + col * spacingX + (row > 0 ? 32 : 0);
            const y = i * itemSpacing + row * yOffset + 10;
            iconLocations.push({x, y}); 
        }
    }
}

export function DrawUpgrades(canvas, ctx)
{
    const width = canvas.width;
    const height = canvas.height;

    // Draw background
    for (let i = 0; i < width; i++) {
        let y = i * itemSpacing;
        const isEven = i % 2 === 0;
        ctx.fillStyle = isEven ? '#000000' : '#ffffff';
        ctx.fillRect(0, y, width, height);
    }

    // Draw the item icons
    // TODO: draw icon textures.
    ctx.fillStyle = "#00ffff";
    for (let i = 0; i < iconLocations.length; i++) {
        const p = iconLocations[i];
        ctx.fillRect(p.x, p.y, rectSize, rectSize);
    }
}
