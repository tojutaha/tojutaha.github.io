import { Terrain } from "./terrain.js";
import { SnowMan } from "./snowman.js";
import { snowParticles, CreateSnow, CreateFloatingText, DrawFloatingText, CreateSnowFlakes, DrawSnowflakes } from "./particles.js";
import { Button } from "./button.js";
import { upgrades } from "./upgrades.js";
import { AbbreviateNumber } from "./utils.js";
import { DrawStats } from "./stats.js";

// Canvas
const canvas = document.getElementById('canvas');
canvas.width = 1024;
canvas.height = 768;
const ctx = canvas.getContext('2d');

// Globals
let Score = {
    pointsPerSecond: 1,
    pointsPerClick: 1,
    totalPoints: 0,
    allTimePoints: 0
}

let terrain = new Terrain();
let snowMan = new SnowMan(canvas);
CreateSnow(canvas);

// Audio
// https://freesound.org/people/TheWilliamSounds/sounds/686557/
const ClickSound = new Audio('audio/click.mp3');
ClickSound.volume = 0.25;

// Mouse position
let mouseX;
let mouseY;
canvas.addEventListener('mousemove', function(event) {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;
});

// Buttons
const buttons = [];
const buttonWidth = 150;
const buttonHeight = 50;
const horizontalOffset = 870;
let verticalOffset = 30;
for (let i = 0; i < upgrades.length; i++) {
    buttons.push(new Button(buttonWidth, buttonHeight, horizontalOffset, verticalOffset, upgrades[i]));
    verticalOffset += 55;
}

// Click handler
function HandleClick()
{    
    if (snowMan.hitBox.IsInRect(mouseX, mouseY)) {
        OnClick();
        CreateFloatingText(mouseX, mouseY, AbbreviateNumber(Score.pointsPerClick));
        CreateSnowFlakes(mouseX, mouseY, ctx);
        ClickSound.play();
    }

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].rect.IsInRect(mouseX, mouseY)) {
            const button = buttons[i];
            const text = `+${AbbreviateNumber(button.upgrade.bonus)}`;
            if (button.OnClick(Score)) {
                CreateFloatingText(mouseX - buttonWidth, mouseY, text);
                ClickSound.play();
            }
        }
    }
}
canvas.addEventListener('click', HandleClick);

// Game loop
setInterval(GameUpdate, 1000)
function GameUpdate()
{
    Score.totalPoints += Score.pointsPerSecond;
    Score.allTimePoints += Score.pointsPerSecond;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    terrain.Draw(canvas, ctx);
    snowMan.Draw(canvas, ctx);

    for (let i = 0; i < snowParticles.length; i++) {
        snowParticles[i].Update(canvas, ctx);
    }

    DrawSnowflakes(ctx);
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].Draw(ctx, mouseX, mouseY, Score.totalPoints);
    }
    
    DrawStats(ctx, Score);
    
    DrawFloatingText(ctx);
}

Render();