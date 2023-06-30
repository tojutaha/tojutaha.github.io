import { v2 } from "./vector.js";
import { Terrain } from "./terrain.js";
import { SnowFlake } from "./snowflake.js";
import { snowParticles, CreateSnow, CreateFloatingText, DrawFloatingText, CreateSnowFlakeParticles, DrawSnowflakeParticles } from "./particles.js";
import { InitializeShop, UpdateShop, DrawShop, buttons } from "./shop.js";
import { UpdateUpgrades, DrawUpgrades } from "./upgrades.js";
import { RandomIntInRange, AbbreviateNumber, Clamp } from "./utils.js";
import { DrawStats } from "./stats.js";
import { Event, events } from "./event.js";

// Canvases
const clickCanvas = document.getElementById('canvas1');
const clickCtx = clickCanvas.getContext('2d');

const upgradesCanvas = document.getElementById('canvas2');
const upgradesCtx = upgradesCanvas.getContext('2d');

const shopCanvas = document.getElementById('canvas3');
const shopCtx = shopCanvas.getContext('2d');

const overlayCanvas = document.getElementById('overlay-canvas');
const overlayCtx = overlayCanvas.getContext('2d');

function resizeCanvases() {
    const canvases = document.querySelectorAll('.canvas-container canvas');
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 1; i < canvases.length; i++) {
        canvases[i].width = width/3;
        canvases[i].height = height;
    }

    overlayCanvas.width = width;
    overlayCanvas.height = height;

    InitializeShop(shopCanvas);
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();
InitializeShop(shopCanvas);

// Globals
let Score = {
    pointsPerSecond: 1,
    pointsPerClick: 1,
    pointsPerSecondMultiplier: 1,
    pointsPerClickMultiplier: 1,
    totalPoints: 0,
    allTimePoints: 0
}

let terrain = new Terrain();
let snowFlake = new SnowFlake({x: clickCanvas.width/2, y: clickCanvas.height/2});
// TODO: This is not quite right..
CreateSnow(clickCanvas, 50);
CreateSnow(shopCanvas, 50);

// Audio
// https://freesound.org/people/TheWilliamSounds/sounds/686557/
const ClickSound = new Audio('audio/click.mp3');
ClickSound.volume = 0.25;

// Mouse position
let mouseP = Object.create(v2);
window.addEventListener('mousemove', function(event) {
    mouseP = {x: event.clientX - clickCanvas.offsetLeft, 
              y: event.clientY - clickCanvas.offsetTop};
});

/* Click handlers */

// Snowflake canvas
function HandleMainClicks(event)
{    
    if (snowFlake.IsInRadius(mouseP)) {
        snowFlake.OnClick(clickCanvas);
        OnClick();
        CreateFloatingText(mouseP, AbbreviateNumber(Score.pointsPerClick));
        CreateSnowFlakeParticles(mouseP);
        ClickSound.play();
    }
}
clickCanvas.addEventListener('click', HandleMainClicks);

/* TODO: Do we need this?
// Upgrade canvas
function HandleUpgradeClicks(event)
{
}
upgradesCanvas.addEventListener('click', HandleUpgradeClicks);
*/

// Shop canvas
function HandleShopClicks(event)
{
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].rect.IsInRect(mouseP, shopCanvas)) {
            const button = buttons[i];
            if (button.OnClick(Score)) {
                ClickSound.play();
                UpdateUpgrades();
            }
        }
    }
}
shopCanvas.addEventListener('click', HandleShopClicks);

// Events
// Spawns snowflakes to random location and clicking them grants bonus.
// TODO: Real values for this.
let eventInterval = 1000;
setInterval(EventUpdate, eventInterval);
function EventUpdate()
{
    const random = RandomIntInRange(1, 100);
    if (random <= 33) { // 33% chance
        const maxEvents = 2; // Only allow 2 events to happen at same time
        if (events.length < maxEvents) {
            const minX = 200;
            // TODO: These should only be showing on top of click and upgrades.
            const maxX = overlayCanvas.width - 200;
            const minY = minX;
            const maxY = overlayCanvas.height - 200;
            const x = Clamp(Math.random() * overlayCanvas.width, minX, maxX);
            const y = Clamp(Math.random() * overlayCanvas.height, minY, maxY);

            // random id to determine which event was clicked,
            // so we can delete the one that was clicked.
            let ID = Math.floor(Math.random() * 1000) + 1;
            // Check that there is no element with same ID
            const hasDuplicateID = events.some(obj => obj.id === ID);
            while (hasDuplicateID) { // TODO: Do we want to use num of tries?
                ID = Math.floor(Math.random() * 1000) + 1;
            }

            events.push(new Event({x: x, y: y}, ID));

        }
    }
    eventInterval = Clamp(Math.random() * 5000, 1000, 10000);
    //console.log(eventInterval);
}

// Overlay canvas
function HandleOverlayClicks(event)
{
    // Check if theres any active events and handle them..
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (event.IsInRadius(mouseP)) {
            ClickSound.play();
            event.OnClick(mouseP, Score);
            return;
        }
    }

    // ..otherwise dispatch events to bottom canvases
    HandleMainClicks(event);
    HandleShopClicks(event);
    //HandleUpgradeClicks(event);
}
overlayCanvas.addEventListener('click', HandleOverlayClicks);

// Game loop
setInterval(GameUpdate, 100)
function GameUpdate()
{
    const value = ((Score.pointsPerSecond * Score.pointsPerSecondMultiplier) / 10);
    Score.totalPoints += value;
    Score.allTimePoints += value;

    document.title = AbbreviateNumber(Score.totalPoints) + ' snowflakes';

    UpdateShop(shopCanvas, Score.totalPoints);
}

function OnClick()
{
    const value = (Score.pointsPerClick * Score.pointsPerClickMultiplier);
    Score.totalPoints += value;
    Score.allTimePoints += value;
}

// Render loop
function Render()
{
    requestAnimationFrame(Render);
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    upgradesCtx.clearRect(0, 0, upgradesCanvas.width, upgradesCanvas.height);
    shopCtx.clearRect(0, 0, shopCanvas.width, shopCanvas.height);
    
    terrain.Draw(clickCanvas, clickCtx);
    
    for (let i = 0; i < snowParticles.length; i++) {
        snowParticles[i].Update(clickCanvas, clickCtx);
        snowParticles[i].Update(shopCanvas, shopCtx);
    }
    
    snowFlake.Draw(clickCtx);

    if (snowFlake.IsInRadius(mouseP)) {
        snowFlake.OnHovered(clickCanvas);
    } else {
        snowFlake.OnUnhovered(clickCanvas);
    }

    DrawSnowflakeParticles(clickCtx);
    
    DrawStats(clickCtx, clickCanvas, Score);
    
    DrawFloatingText(overlayCtx);

    DrawUpgrades(upgradesCanvas, upgradesCtx);
    DrawShop(shopCtx, shopCanvas, mouseP, Score);

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        event.Draw(overlayCtx, overlayCanvas);
        event.Update(overlayCtx, overlayCanvas);
    }
}

Render();
