import { v2 } from "./vector.js";
import { Terrain } from "./terrain.js";
import { SnowMan } from "./snowman.js";
import { snowParticles, CreateSnow, CreateFloatingText, DrawFloatingText, CreateSnowFlakes, DrawSnowflakes } from "./particles.js";
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
let snowMan = new SnowMan(clickCanvas);
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
    if (snowMan.hitBox.IsInRect(mouseP, clickCanvas)) {
        OnClick();
        CreateFloatingText(mouseP, AbbreviateNumber(Score.pointsPerClick));
        CreateSnowFlakes(mouseP);
        ClickSound.play();
    }
}
clickCanvas.addEventListener('click', HandleMainClicks);

// TODO: Do we need this?
function HandleUpgradeClicks()
{
    //console.log('Click!');
}
upgradesCanvas.addEventListener('click', HandleUpgradeClicks);

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
setInterval(GameUpdate, 1000)
function GameUpdate()
{
    Score.totalPoints += Score.pointsPerSecond;
    Score.allTimePoints += Score.pointsPerSecond;

    document.title = AbbreviateNumber(Score.totalPoints) + ' snowflakes';

    // TODO: Do we want to do this more frequantly?
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
    snowMan.Draw(clickCanvas, clickCtx);

    for (let i = 0; i < snowParticles.length; i++) {
        snowParticles[i].Update(clickCanvas, clickCtx);
    }

    for (let i = 0; i < snowParticles.length; i++) {
        snowParticles[i].Update(shopCanvas, shopCtx);
    }

    DrawSnowflakes(clickCtx);
    
    DrawStats(clickCtx, clickCanvas, Score);
    
    DrawFloatingText(clickCtx);

    DrawUpgrades(upgradesCanvas, upgradesCtx);
    DrawShop(shopCtx, shopCanvas, mouseP, Score);
}

Render();
