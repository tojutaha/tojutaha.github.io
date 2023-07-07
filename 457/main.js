import { v2 } from "./vector.js";
import { snowParticles, CreateSnow, CreateFloatingText, DrawFloatingText, CreateSnowFlakeParticles, DrawSnowflakeParticles, DrawFadingText } from "./particles.js";
import { InitializeShop, UpdateShop } from "./shop.js";
import { RandomIntInRange, AbbreviateNumber, Clamp } from "./utils.js";
import { DrawStats } from "./stats.js";
import { SilverSnowflake, silverSnowflakes } from "./event.js";
import { Spritesheet } from "./spritesheet.js";

// Globals
export let GameState = {
    pointsPerSecond: 1,
    pointsPerClick: 1,
    pointsPerSecondMultiplier: 1,
    pointsPerClickMultiplier: 1,
    totalPoints: 0,
    allTimePoints: 0
}

const clickCanvas = document.getElementById('click-canvas');
const clickCtx = clickCanvas.getContext('2d');

const overlayCanvas = document.getElementById('overlay-canvas');
const overlayCtx = overlayCanvas.getContext('2d');

// Calculate widths and heights for canvases and
// containers based on window dimensions.
function OnWindowResize() {
    const buttonContainer = document.getElementById('button-container');
    const upgradeContainer = document.getElementById('upgrades-container');
    const width = window.innerWidth;
    const height = window.innerHeight;

    clickCanvas.width = width / 3;
    clickCanvas.height = height;
    buttonContainer.style.width = `${width/3}px`;
    buttonContainer.style.height = height;
    upgradeContainer.style.width = `${width/3}px`;
    upgradeContainer.style.height = height;

    const overlayWidth = clickCanvas.width + width / 3;
    overlayCanvas.width = overlayWidth;
    overlayCanvas.height = height;

    InitializeShop();
}
window.addEventListener('resize', OnWindowResize);

OnWindowResize();
InitializeShop();
CreateSnow(clickCanvas, 50);

let snowGlobe = new Spritesheet({x: clickCanvas.width/2, y: clickCanvas.height/2}, "textures/spriteSheet2k.png", 8, 8);
snowGlobe.spritesheet.onload = function()
{
    snowGlobe.PostInitialize();
    Render();
}

// Audio
// https://freesound.org/people/TheWilliamSounds/sounds/686557/
export const ClickSound = new Audio('audio/click.mp3');
ClickSound.volume = 0.25;

// Mouse position
let mouseP = Object.create(v2);
window.addEventListener('mousemove', function(event) {
    mouseP = {x: event.clientX - clickCanvas.offsetLeft, 
              y: event.clientY - clickCanvas.offsetTop};
});

/* Click handlers */
function HandleClicks(event)
{    
    if (snowGlobe.IsInRadius(clickCtx, mouseP)) {
        snowGlobe.OnClick(clickCanvas);
        OnClick();
        CreateFloatingText(mouseP, AbbreviateNumber(GameState.pointsPerClick));
        CreateSnowFlakeParticles(mouseP);
        ClickSound.play();
    }
}
clickCanvas.addEventListener('click', HandleClicks);

// Events
// Spawns snowflakes to random location and clicking them grants bonus.
// TODO: Real values for this.
let eventInterval = 1000;
setInterval(EventUpdate, eventInterval);
function EventUpdate()
{
    const random = RandomIntInRange(1, 100);
    if (random <= 33) { // 33% chance
        if (silverSnowflakes.length < 2) {
            const minX = 200;
            const maxX = overlayCanvas.width - 200;
            const minY = minX;
            const maxY = overlayCanvas.height - 200;
            const x = Clamp(Math.random() * overlayCanvas.width, minX, maxX);
            const y = Clamp(Math.random() * overlayCanvas.height, minY, maxY);

            // random id to determine which event was clicked,
            // so we can delete the one that was clicked.
            let ID = Math.floor(Math.random() * 1000) + 1;
            // Check that there is no element with same ID
            const hasDuplicateID = silverSnowflakes.some(obj => obj.id === ID);
            while (hasDuplicateID) { // TODO: Do we want to use num of tries?
                ID = Math.floor(Math.random() * 1000) + 1;
            }

            silverSnowflakes.push(new SilverSnowflake({x: x, y: y}, ID));

        }
    }
    eventInterval = Clamp(Math.random() * 5000, 1000, 10000);
    //console.log(eventInterval);
}

// Overlay canvas
function HandleOverlayClicks(event)
{
    // Check if theres any active events and handle them..
    for (let i = 0; i < silverSnowflakes.length; i++) {
        const s = silverSnowflakes[i];
        if (s.IsInRadius(mouseP)) {
            ClickSound.play();
            s.OnClick(mouseP, GameState);
            return;
        }
    }

    // ..otherwise dispatch events to bottom canvases
    HandleClicks(event);
}
overlayCanvas.addEventListener('click', HandleOverlayClicks);

// Game loop
setInterval(GameUpdate, 100)
function GameUpdate()
{
    const value = ((GameState.pointsPerSecond * GameState.pointsPerSecondMultiplier) / 10);
    GameState.totalPoints += value;
    GameState.allTimePoints += value;

    UpdateShop(null);

    document.title = AbbreviateNumber(GameState.totalPoints) + ' snowflakes';
}

function OnClick()
{
    const value = (GameState.pointsPerClick * GameState.pointsPerClickMultiplier);
    GameState.totalPoints += value;
    GameState.allTimePoints += value;
}

// Render loop
function Render()
{
    requestAnimationFrame(Render);
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    
    for (let i = 0; i < snowParticles.length; i++) {
        snowParticles[i].Update(clickCanvas, clickCtx);
    }
    
    snowGlobe.UpdateFrame(clickCtx, clickCanvas);

    if (snowGlobe.IsInRadius(clickCtx, mouseP)) {
        snowGlobe.OnHovered(clickCanvas);
    } else {
        snowGlobe.OnUnhovered(clickCanvas);
    }

    DrawSnowflakeParticles(clickCtx);
    
    DrawStats(clickCtx, clickCanvas, GameState);
    
    DrawFloatingText(overlayCtx);
    DrawFadingText(overlayCtx);

    for (let i = 0; i < silverSnowflakes.length; i++) {
        const s = silverSnowflakes[i];
        s.Draw(overlayCtx, overlayCanvas);
        s.Update(overlayCtx, overlayCanvas);
    }
}

