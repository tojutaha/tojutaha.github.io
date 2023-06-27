import { v2 } from "./vector.js";
import { Terrain } from "./terrain.js";
import { SnowFlake } from "./snowflake.js";
import { snowParticles, CreateSnow, CreateFloatingText, DrawFloatingText, CreateSnowFlakeParticles, DrawSnowflakeParticles } from "./particles.js";
import { InitializeShop, UpdateShop, DrawShop, buttons } from "./shop.js";
import { UpdateUpgrades, DrawUpgrades } from "./upgrades.js";
import { AbbreviateNumber } from "./utils.js";
import { DrawStats } from "./stats.js";

// Canvases
const clickCanvas = document.getElementById('canvas1');
const clickCtx = clickCanvas.getContext('2d');

const upgradesCanvas = document.getElementById('canvas2');
const upgradesCtx = upgradesCanvas.getContext('2d');

const shopCanvas = document.getElementById('canvas3');
const shopCtx = shopCanvas.getContext('2d');

function resizeCanvases() {
    const canvases = document.querySelectorAll('.canvas-container canvas');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvases.forEach(canvas => {
        canvas.width = width/3;
        canvas.height = height;
        //canvas.getContext('2d').scale(0.8, 0.8);
    });

    InitializeShop(shopCanvas);
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();
InitializeShop(shopCanvas);

// Globals
let Score = {
    pointsPerSecond: 1,
    pointsPerClick: 1,
    totalPoints: 0,
    allTimePoints: 0
}

let terrain = new Terrain();
let snowFlake = new SnowFlake({x: clickCanvas.width/2, y: clickCanvas.height/2});
// TODO: Tää ei oo ihan oikein... 
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

// Click handlers
function HandleMainClicks()
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

// TODO: Do we need this?
/*
function HandleUpgradeClicks()
{
}
upgradesCanvas.addEventListener('click', HandleUpgradeClicks);
*/

function HandleShopClicks()
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

// Game loop
setInterval(GameUpdate, 100)
function GameUpdate()
{
    Score.totalPoints += (Score.pointsPerSecond / 10); // Updating every 100ms
    Score.allTimePoints += (Score.pointsPerSecond / 10);

    document.title = AbbreviateNumber(Score.totalPoints) + ' snowflakes';

    UpdateShop(shopCanvas, Score.totalPoints);
}

function OnClick()
{
    Score.totalPoints += Score.pointsPerClick;
    Score.allTimePoints += Score.pointsPerClick;
}

// Render loop
function Render()
{
    requestAnimationFrame(Render);
    clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    upgradesCtx.clearRect(0, 0, upgradesCanvas.width, upgradesCanvas.height);
    shopCtx.clearRect(0, 0, shopCanvas.width, shopCanvas.height);
    
    terrain.Draw(clickCanvas, clickCtx);
    
    for (let i = 0; i < snowParticles.length; i++) {
        snowParticles[i].Update(clickCanvas, clickCtx);
    }
    
    for (let i = 0; i < snowParticles.length; i++) {
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
    
    DrawFloatingText(clickCtx);

    DrawUpgrades(upgradesCanvas, upgradesCtx);
    DrawShop(shopCtx, shopCanvas, mouseP, Score);
}

Render();
