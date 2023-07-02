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
}

function CreateUpgrade(item, index)
{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.classList.add('upgrade-canvas');

    const color = index % 2 == 0 ? 'black' : 'white';
    canvas.style.background = color;

    const width = window.innerWidth / items.length;

    return canvas;
}

export function UpdateUpgrades(item)
{
    // TODO
    console.log("UpgradeUpgrades");
}
