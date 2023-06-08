// Globals
let PointsPerSecond = 1;
let PointsPerClick = 1;
let TotalPoints = 0;

const canvas = document.getElementById('canvas');
canvas.width = 1024;
canvas.height = 768;
const ctx = canvas.getContext("2d");

// TODO: Snowman
const snowmanRadius = 50;
const snowmanColor = "#ffffff";
let snowmanX = canvas.width / 2;
let snowmanY = canvas.height / 2;

function DrawSnowman() {
    ctx.beginPath();
    ctx.arc(snowmanX, snowmanY, snowmanRadius, 0, Math.PI*2, false);
    ctx.fillStyle = snowmanColor;
    ctx.fill();
}

// Check if a point is inside snowman bounds
function IsInsideSnowman(x, y) {
    const dx = x - snowmanX;
    const dy = y - snowmanY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= (snowmanRadius);
}

// Snowman click handler
function HandleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (IsInsideSnowman(x, y)) {
        OnClick();
    }
}

function DrawStats() {

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

// Attach click events listener to the canvas
canvas.addEventListener('click', HandleClick);

// Render loop
function Render() {
    requestAnimationFrame(Render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawSnowman();
    DrawStats();
}

Render();

setInterval(Update, 1000)
function Update() {
    TotalPoints += PointsPerSecond;
}

function OnClick() {
    TotalPoints += PointsPerClick;
    console.log("Click");
}
