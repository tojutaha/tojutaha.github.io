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

            // TODO: Ei oo ihan oikein...
            const aspectRatio = canvas.width / canvas.height;
            console.log(aspectRatio);
            const textureHeight = 48;
            const textureWidth = textureHeight / aspectRatio;
            ctx.drawImage(item.texture, 20, 20, textureWidth, textureHeight);
        }

    } else {
        items.forEach((item) => {
            UpdateUpgrades(item);
        });
    }
}

