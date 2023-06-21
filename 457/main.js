import { Terrain } from "./terrain.js";
import { SnowMan } from "./snowman.js";
import { snowParticles, CreateSnow, CreateFloatingText, DrawFloatingText, CreateSnowFlakes, DrawSnowflakes } from "./particles.js";
import { Button } from "./button.js";
import { upgrades, DrawUpgrades } from "./upgrades.js";
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
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// Globals
let Score = {
    pointsPerSecond: 1,
    pointsPerClick: 1,
    totalPoints: 0,
    allTimePoints: 0
}

let terrain = new Terrain();
let snowMan = new SnowMan(clickCanvas);
CreateSnow(clickCanvas);
CreateSnow(shopCanvas);

// Audio
// https://freesound.org/people/TheWilliamSounds/sounds/686557/
const ClickSound = new Audio('audio/click.mp3');
ClickSound.volume = 0.25;

// Mouse position
let mouseX;
let mouseY;
window.addEventListener('mousemove', function(event) {
    mouseX = event.clientX - clickCanvas.offsetLeft;
    mouseY = event.clientY - clickCanvas.offsetTop;
});

// Buttons
const buttons = [];
const buttonWidth = 150;
const buttonHeight = 50;
const horizontalOffset = 5;
let verticalOffset = 5;
for (let i = 0; i < upgrades.length; i++) {
    buttons.push(new Button(buttonWidth, buttonHeight, horizontalOffset, verticalOffset, upgrades[i]));
    verticalOffset += 55;
}

// Click handlers
function HandleMainClicks()
{    
    if (snowMan.hitBox.IsInRect(mouseX, mouseY, clickCanvas)) {
        OnClick();
        CreateFloatingText(mouseX, mouseY, AbbreviateNumber(Score.pointsPerClick));
        CreateSnowFlakes(mouseX, mouseY, clickCtx);
        ClickSound.play();
    }
}
clickCanvas.addEventListener('click', HandleMainClicks);

DrawUpgrades(upgradesCanvas, upgradesCtx);
function HandleUpgradeClicks()
{
    console.log('Click!');
}
upgradesCanvas.addEventListener('click', HandleUpgradeClicks);

function HandleShopClicks()
{
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].rect.IsInRect(mouseX, mouseY, shopCanvas)) {
            const button = buttons[i];
            const text = `+${AbbreviateNumber(button.upgrade.bonus)}`;
            if (button.OnClick(Score)) {
                ClickSound.play();
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
    //upgradesCtx.clearRect(0, 0, upgradesCanvas.width, upgradesCanvas.height);
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
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].Draw(shopCtx, shopCanvas, mouseX, mouseY, Score.totalPoints);
    }
    
    DrawStats(clickCtx, Score);
    
    DrawFloatingText(clickCtx);
}

Render();