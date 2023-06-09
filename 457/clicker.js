import { Terrain } from "./terrain.js";
import { SnowMan } from "./snowman.js";

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

// Snowman click handler
function HandleClick(event)
{
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (snowMan.hitBox.IsInRect(x, y)) {
        OnClick();
        //console.log('Clicked coordinates (x, y):', x, y);
        //console.log('Hitbox boundaries:', snowMan.hitBox.minX, snowMan.hitBox.maxX, snowMan.hitBox.minY, snowMan.hitBox.maxY);
        //console.log('Inside the hitbox');
    }
}
canvas.addEventListener('click', HandleClick);

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

    DrawStats();
}

Render();