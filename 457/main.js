import { v2 } from "./vector.js";
import { snowParticles, CreateSnow, CreateFloatingText, DrawFloatingText, CreateSnowFlakeParticles, DrawSnowflakeParticles, DrawFadingText } from "./particles.js";
import { InitializeShop, UpdateShop } from "./shop.js";
import { RandomIntInRange, AbbreviateNumber, Clamp } from "./utils.js";
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

const scoreText = document.getElementById('scoreText');

// Calculate widths and heights for canvases and
// containers based on window dimensions.
function OnWindowResize() {
    const buttonContainer = document.getElementById('button-container');
    const width = window.innerWidth;

    //clickCanvas.width = 2 * (width / 3);
    clickCanvas.width = width * 0.8;
    clickCanvas.height = window.innerHeight;
    buttonContainer.style.width = `${width * 0.2}px`;
    buttonContainer.style.height = window.innerHeight;

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
// https://stackoverflow.com/questions/61453760/how-to-rapidly-play-multiple-copies-of-a-soundfile-in-javascript
const audioContext = new AudioContext();
// https://freesound.org/people/TheWilliamSounds/sounds/686557/
const audioFile = 'audio/click.mp3';

export const PlayAudio = async () => {
    const response = await fetch(audioFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;

    audioSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    audioSource.start();
}

// Mouse position
let mouseP = Object.create(v2);
window.addEventListener('mousemove', function(event) {
    mouseP = {x: event.clientX - clickCanvas.offsetLeft,
              y: event.clientY - clickCanvas.offsetTop};
});

/* Click handlers */
function HandleClicks(event)
{
    for (let i = 0; i < silverSnowflakes.length; i++) {
        const s = silverSnowflakes[i];
        if (s.IsInRadius(mouseP)) {
            PlayAudio();
            s.OnClick(mouseP, GameState);
            return;
        }
    }

    if (snowGlobe.IsInRadius(clickCtx, mouseP)) {
        snowGlobe.OnClick(clickCanvas);
        OnClick();
        CreateFloatingText(mouseP, AbbreviateNumber(GameState.pointsPerClick));
        CreateSnowFlakeParticles(mouseP);
        PlayAudio();
    }
}
clickCanvas.addEventListener('click', HandleClicks);

// Events
// Spawns silver snowflakes to random location and clicking them grants bonus.
let eventInterval = 5000;
setInterval(EventUpdate, eventInterval);
function EventUpdate()
{
    const random = RandomIntInRange(1, 100);
    if (random <= 33) { // 33% chance
        if (silverSnowflakes.length < 2) {
            const minX = 200;
            const maxX = clickCanvas.width - 200;
            const minY = minX;
            const maxY = clickCanvas.height - 200;
            const x = Clamp(Math.random() * clickCanvas.width, minX, maxX);
            const y = Clamp(Math.random() * clickCanvas.height, minY, maxY);

            // Random unique id to determine which event was clicked
            let ID = Math.floor(Math.random() * 1000) + 1;
            let hasDuplicatedID = true;
            for (let i = 0; i < 10; i++) {
                hasDuplicatedID = silverSnowflakes.some(obj => obj.id === ID);
                if (!hasDuplicatedID) {
                    silverSnowflakes.push(new SilverSnowflake({x: x, y: y}, ID));
                    break;
                }
                ID = Math.floor(Math.random() * 1000) + 1;
            }
        }
    }
    eventInterval = Clamp(Math.random() * 10000, 5000, 10000);
    //console.log(eventInterval);
}

// Game loop
setInterval(GameUpdate, 100)
function GameUpdate()
{
    const value = ((GameState.pointsPerSecond * GameState.pointsPerSecondMultiplier) / 10);
    GameState.totalPoints += value;
    GameState.allTimePoints += value;

    UpdateShop(null);

    document.title = AbbreviateNumber(GameState.totalPoints) + ' snowflakes';
    const totalText = AbbreviateNumber(GameState.totalPoints);
    const ppsText = AbbreviateNumber(GameState.pointsPerSecond);
    scoreText.innerText = `SNOWFLAKES: ${totalText} \n 
                          Snowflakes Per Second: ${ppsText}`;
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
    clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    requestAnimationFrame(Render);

    snowGlobe.UpdateFrame(clickCtx, clickCanvas);

    if (snowGlobe.IsInRadius(clickCtx, mouseP)) {
        snowGlobe.OnHovered(clickCanvas);
    } else {
        snowGlobe.OnUnhovered(clickCanvas);
    }

    for (let i = 0; i < snowParticles.length; i++) {
        snowParticles[i].Update(clickCanvas, clickCtx);
    }

    DrawSnowflakeParticles(clickCtx);

    DrawFloatingText(clickCtx);
    DrawFadingText(clickCtx);

    for (let i = 0; i < silverSnowflakes.length; i++) {
        const s = silverSnowflakes[i];
        s.Draw(clickCtx, clickCanvas);
        s.Update(clickCtx, clickCanvas);
    }
}

