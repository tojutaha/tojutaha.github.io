import { Terrain } from "./terrain.js";
import { SnowMan } from "./snowman.js";
import { SnowParticle, FloatingTextParticle } from "./particles.js";

// Globals
let PointsPerSecond = 1;
let PointsPerClick = 1;
let TotalPoints = 0;

const canvas = document.getElementById('canvas');
canvas.width = 1024;
canvas.height = 768;
const ctx = canvas.getContext("2d");

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
function CreateFloatingText(x, y, text) {
    textParticles.push(new FloatingTextParticle(x, y, text));
}

function DrawFloatingText() {
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

// Stats
function DrawStats()
{
    ctx.font = "normal 24px Arial";
    ctx.fillStyle = 'white';

    let scoreText = "Total Points: " + TotalPoints;
    let pointsPerSecondText = "Points Per Second: " + PointsPerSecond;
    let pointsPerClickText = "Points Per Click: " + PointsPerClick;

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';

    ctx.fillText(scoreText, 25, 25);
    ctx.fillText(pointsPerSecondText, 25, 50);
    ctx.fillText(pointsPerClickText, 25, 75);
}

// Click handler
function HandleClick(event)
{
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (snowMan.hitBox.IsInRect(x, y)) {
        OnClick();
        CreateFloatingText(x, y, PointsPerClick);
        //console.log('Clicked coordinates (x, y):', x, y);
        //console.log('Hitbox boundaries:', snowMan.hitBox.minX, snowMan.hitBox.maxX, snowMan.hitBox.minY, snowMan.hitBox.maxY);
        //console.log('Inside the hitbox');
    }
}
canvas.addEventListener('click', HandleClick);

// Game loop
setInterval(GameUpdate, 1000)
function GameUpdate()
{
    TotalPoints += PointsPerSecond;
}

function OnClick()
{
    TotalPoints += PointsPerClick;
    console.log("Click");
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

    DrawStats();
}

CreateSnow();
Render();