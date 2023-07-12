import { items } from "./shop.js";
import { v2 } from "./vector.js";
import { Clamp } from "./utils.js";

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
            const textureHeight = 30;
            const textureWidth = textureHeight / aspectRatio;

            let xPos = 20;
            let yPos = 20;
            const maxItemsPerCol = 9;
            const amount = Clamp(item.numOfPurchases, 0, maxItemsPerCol * 2);
            for (let i = 0; i < amount; i++) {
                if (i >= maxItemsPerCol) {
                    xPos = 20 + (i - maxItemsPerCol) * 30;
                    yPos = 40 + textureHeight + 10;
                } else {
                    xPos = 10 + i * 30;
                    yPos = 20;
                }
                ctx.drawImage(item.texture, xPos, yPos, textureWidth, textureHeight);
            }
        }

    } else {
        items.forEach((item) => {
            UpdateUpgrades(item);
        });
    }
}

