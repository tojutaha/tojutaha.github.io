import { Terrain } from "./terrain.js";
import { SnowMan } from "./snowman.js";
import { SnowParticle, FloatingTextParticle, SnowFlake } from "./particles.js";
import { Button } from "./button.js";
import { upgrades } from "./upgrades.js";
import { AbbreviateNumber } from "./utils.js";

// Globals
let Score = {
    pointsPerSecond: 1,
    pointsPerClick: 1,
    totalPoints: 0
}

// Canvas
const canvas = document.getElementById('canvas');
canvas.width = 1024;
canvas.height = 768;
const ctx = canvas.getContext('2d');

// Terrain
let terrain = new Terrain();

// Snowman
let snowMan = new SnowMan(canvas);

// Snow particles
const snowParticles = [];
function CreateSnow()
{
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speed = Math.random() * 5 + 1;
        const size = Math.random() * 3 + 1;
        const color = `rbga(255, 255, 255, ${Math.random()})`;
        snowParticles.push(new SnowParticle(x, y, speed, size, color))
    }
}

// Floating text particles
const textParticles = [];
function CreateFloatingText(x, y, text)
{
    textParticles.push(new FloatingTextParticle(x, y, text));
}

function DrawFloatingText()
{
    for (let i = 0; i < textParticles.length; i++) {
        textParticles[i].Draw(ctx);
    }

    for (let i = textParticles.length - 1; i >= 0; i--) {
        const particle = textParticles[i];
        particle.Update();

        if (particle.alpha <= 0) {
            textParticles.splice(i, 1);
        }
    }
}

// Snowflake particles
const snowFlakes = [];
function CreateSnowFlakes(x, y)
{
    snowFlakes.push(new SnowFlake(x, y, ctx));
}

function DrawSnowflakes()
{
    for (let i = 0; i < snowFlakes.length; i++) {
        snowFlakes[i].Draw(ctx);
    }

    for (let i = snowFlakes.length - 1; i >= 0; i--) {
        const particle = snowFlakes[i];
        particle.Update();

        if (particle.alpha <= 0) {
            snowFlakes.splice(i, 1);
        }
    }
}

// Stats
function DrawStats()
{
    ctx.font = "normal 24px Arial";
    ctx.fillStyle = 'white';

    let scoreText = "Total Points: " + AbbreviateNumber(Score.totalPoints);
    let pointsPerSecondText = "Points Per Second: " + AbbreviateNumber(Score.pointsPerSecond);
    let pointsPerClickText = "Points Per Click: " + AbbreviateNumber(Score.pointsPerClick);

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';

    ctx.fillText(scoreText, 25, 25);
    ctx.fillText(pointsPerSecondText, 25, 50);
    ctx.fillText(pointsPerClickText, 25, 75);
}

// Mouse position
let mouseX;
let mouseY;
canvas.addEventListener('mousemove', function(event) {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;
});

// Click handler
function HandleClick()
{    
    if (snowMan.hitBox.IsInRect(mouseX, mouseY)) {
        OnClick();
        CreateFloatingText(mouseX, mouseY, AbbreviateNumber(Score.pointsPerClick));
        CreateSnowFlakes(mouseX, mouseY);
    }

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].rect.IsInRect(mouseX, mouseY)) {
            const button = buttons[i];
            const text = `+${AbbreviateNumber(button.upgrade.bonus)}`;
            if (button.OnClick(Score)) {
                CreateFloatingText(mouseX - buttonWidth, mouseY, text);
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
}

function OnClick()
{
    Score.totalPoints += Score.pointsPerClick;
}

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

    DrawFloatingText();
    DrawSnowflakes();
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].Draw(ctx, mouseX, mouseY, Score.totalPoints);
    }

    DrawStats();
}

CreateSnow();
Render();