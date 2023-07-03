import { items } from "./shop.js";
import { v2 } from "./vector.js";
import { Clamp } from "./utils.js";

<<<<<<< HEAD
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
=======
export let upgrades = [];
export function InitializeUpgrades()
{
    const upgradeContainer = document.getElementById('upgrades-container');
    if (!upgradeContainer) {
        console.log('Could not find element with id: upgrades-container');
        return;
    }

    upgradeContainer.innerHTML = "";
    upgrades = [];

    items.forEach((item, index) => {
        const upgrade = CreateUpgrade(item, index);
        upgradeContainer.appendChild(upgrade);
        upgrades.push(upgrade);
    });

    UpdateUpgrades(null);
}

function CreateUpgrade(item, index)
{
    // Create canvas elements
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set classes and attributes
    canvas.classList.add('upgrade-canvas');
    const color = index % 2 == 0 ? 'black' : 'white';
    canvas.style.background = color;
    const height = window.innerHeight / items.length;
    canvas.style.height = `${height}px`;
    item.canvas = canvas;

    return canvas;
}

export function UpdateUpgrades(item)
{
    if (item) {
        const upgrade = items.find((itm) => itm.name.includes(item.name));
        if (upgrade) {
            const canvas = upgrade.canvas;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const aspectRatio = canvas.width / canvas.height;
            console.log(canvas.width, canvas.heigh);
            const textureHeight = 48;
            const textureWidth = textureHeight / aspectRatio;
            ctx.drawImage(item.texture, 20, 20, textureWidth, textureHeight);
        }

    } else {
        items.forEach((item) => {
            UpdateUpgrades(item);
        });
>>>>>>> dev
    }
}

