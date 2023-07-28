/*
 * Sika-noppapeli
 *
 * Sikaa voi pelata yhdellä tai kahdella nopalla.
 * Toteuta, sekä yhden, että kahden nopan versiot.
 * Peliä pitää pystyä pelaamaan kahdella tai useammalla pelaajalla.
 * Mieluusti niin, että pelin alussa määritellään pelaajien määrä ja nimet.
 *
 *
 * * Säännöt - Sika yhdellä nopalla *
 *
 * Pelin tarkoitus on kerätä sata pistettä tai enemmän 
 * (pistemäärän voi sopia ennen peliä)
 * heittämällä noppaa ja laskemalla heittojen summa yhteen.
 *
 * Pelaaja heittää omalla vuorollaan noppaa niin pitkän kunnes
 * a) heittää ykkösen
 * b) päättää lopettaa heittämisen
 *
 * Jos pelaaja heittää ykkösen, hänen vuoronsa loppuu ja sen kierroksen
 * heittojen summa nollataan. Vuoro siirtyy seuraavalle pelaajalle.
 *
 * Jos pelaaja päättää lopettaa heittämisen ennen kuin hän heittää
 * ykkösen, heittojen summa lasketaan yhteen ja lisätään edellisen
 * kierroksen summaan. Tämän jälkeen vuoro siirtyy seuraavalle pelaajalle.
 *
 *
 * * Esimerkkejä pelitilanteista yhdellä nopalla *
 *
 * Esimerkki 1:
 * Ville heittää ensimmäisellä heitollaan kolme ja päättää jatkaa heittämistä.
 * Hän heittää tämän jälkeen vielä 6, 6, 4, 3, 5, 1
 * Koska hän heitti ykkösen, Villen vuoro päättyy ja hän ei saa tällä
 * heittovuorollaan yhtään pistettä.
 *
 * Esimerkki 2:
 * Mari heittää ensimmäisellä 6 ja päättää jatkaa heittämistä.
 * Mari heittää vielä silmäluvut 2, 4, 3, 4 ja lopettaa heittämisen.
 * Koska Mari itse päätti päättää vuoronsa sen sijaan, että vuoro olisi
 * loppunut ykköseen, saa Mari omalla vuorollaan yhteensä 19 pistettä.
 * (6 + 2 + 4 + 3 + 4 = 19)
 *
 *
 * * Säännöt - Sika kahdella nopalla *
 *
 * Sikaa voi pelata kahdella nopalla, jolloin säännöt muuttuvat hieman.
 * Kun heität tuplat, saat tuplapisteet (esim. kaksi kolmosta on 12 pisteen
 * arvoinen heitto). Kun heität kaksi ykköstä, saat 25 pistettä.
 * Kun heität vain toisella nopalla ykkösen, vuoro siirtyy seuraavalle
 * pelaajalle etkä saa saa pisteitä. Kun heität kolme tuplaa peräkkäin,
 * vuoro siirtyy seuraavalle pelaajalle etkä saa pisteitä.
 *
 *
 * http://www.javascriptkit.com/script/script2/dice.shtml
 *
 */

import { GameMode, GameModeTwoDices } from "./gamemode.js";
import { Player } from "./player.js";
import { SetupParticles, LoopParticles } from "./particles.js";

// Globals
export const dice1 = document.getElementById('dice1');
export const dice2 = document.getElementById('dice2');

export const menu = document.querySelector('.menu-container');
export const game = document.querySelector('.game-container');
const gameResultsContainer = document.querySelector('.gameresult-container');
const playerScoreContainer = document.querySelector('.playerScore-container');
const buttonContainer = document.querySelector('.button-container');

const playersSettings = document.getElementById('numOfPlayers');
let playerContainer = document.querySelector('.player-container');

const startButton = document.querySelector('.startButton');
const endButton = document.getElementById('endButton');
const rollButton = document.getElementById('rollButton');
const holdButton = document.getElementById('holdButton');

export const diceFaces = [];
const playerNameText = document.getElementById('name');
const totalScoreText = document.getElementById('totalScore');
const roundScoreText = document.getElementById('roundScore');
const prevRollsText = document.getElementById('previousRolls');

const maxScoreInput = document.getElementById('maxScore');
let maxScore = maxScoreInput.value;
const gameMode1 = new GameMode(maxScore);
const gameMode2 = new GameModeTwoDices(maxScore);
let gameMode = null;

// Event listeners
startButton.addEventListener('click', InitializeGame);
endButton.addEventListener('click', RestartGame);

const playerNames = [];
let playersInitialized = false;
playersSettings.addEventListener('change', OnPlayerSettingsChanged);
function OnPlayerSettingsChanged()
{
    // TODO: Bug, all input fields check fails on some cases.
    // TODO: Validate that input fields are not empty.
    // Store the old values, so we dont have to fill them over and over again..
    const inputValues = [];
    const playerInputs = playerContainer.querySelectorAll('.player-name');
    playerInputs.forEach(input => {
        inputValues.push(input.value.trim());
        //console.log(input.value.trim());
    });

    // Clear old elements
    while (playerContainer.firstChild) {
        playerContainer.removeChild(playerContainer.firstChild);
    }

    const p = document.createElement('p');
    p.innerText = "Anna pelaajien nimet:";
    playerContainer.appendChild(p);

    for (let i = 0; i < playersSettings.value; i++) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const br = document.createElement('br');

        label.innerText = `Pelaaja ${i + 1}: `;
        input.type = "text";
        input.classList.add('player-name');
        input.dataset.index = i;
        input.value = inputValues[i] || '';

        input.addEventListener('change', function(event) {
            const target = event.target;
            const index = parseInt(target.dataset.index);

            // Check whether the value is empty or not
            if (target.value.trim() !== '') {
                playerNames[index] = target.value.trim();
            } else {
                playerNames[index] = undefined;
            }

            // Check that all inputs are filled
            let filled = true;
            for (const name of playerNames) {
                if (name === undefined) {
                    filled = false;
                    break;
                }
            }

            if (filled) {
                console.log("all inputs were filled");
                playersInitialized = true;
            } else {
                console.log("not all inputs were filled");
                playersInitialized = false;
            }
        });

        playerContainer.appendChild(label);
        playerContainer.appendChild(input);
        playerContainer.appendChild(br);
    }

    //console.log("Length of names: ", playerNames.length);
}
OnPlayerSettingsChanged();

function CreateGameMode()
{
    const numOfDices = parseInt(document.getElementById('numOfDices').value);
    maxScore = maxScoreInput.value;

    switch (numOfDices) {
        case 1:
            gameMode = gameMode1;
            dice2.style.display = 'none';
            break;
        case 2:
            gameMode = gameMode2;
            dice2.style.display = 'inline-block';
            break;
    }

    rollButton.addEventListener('click', gameMode.Roll.bind(gameMode));
    holdButton.addEventListener('click', gameMode.Hold.bind(gameMode));

    gameMode.Reset(maxScore);
}

export function UpdateGameState(name, totalScore, roundScore)
{
    playerNameText.textContent = `Pelaajan ${name} vuoro`;
    totalScoreText.textContent = `Kokonaispisteet: ${totalScore}`;
    roundScoreText.textContent = `Kierrospisteet: ${roundScore}`;
    const prevRolls = `[ ${gameMode.previousRolls.join(', ')} ]`;
    prevRollsText.textContent = `Kierroksen heitot: ${prevRolls}`;
}

// Async load dice textures
function LoadTextures()
{
    const imageSrcs = [
        "textures/d1.png",
        "textures/d2.png",
        "textures/d3.png",
        "textures/d4.png",
        "textures/d5.png",
        "textures/d6.png",
    ];

    diceFaces.length = 0;

    const promises = imageSrcs.map(src => {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = src;
            image.onload = function () {
                resolve();
            };
            image.onerror = function () {
                reject(new Error(`Failed to load texture: ${src}`));
            };
            diceFaces.push(image);
        });
    });

    return Promise.all(promises);
}

let texturesLoaded = false;
LoadTextures().then(() => {
    texturesLoaded = true;
}).catch(error => {
    console.error("Error loading textures:", error);
});

function InitializeGame(e)
{
    e.preventDefault();

    //console.log(texturesLoaded);
    //console.log(playersInitialized);

    if (playersInitialized && texturesLoaded) {

        CreateGameMode();

        if (gameMode) {

            gameMode.players = [];

            for (let i = 0; i < playerNames.length; i++) {
                gameMode.players[i] = new Player(playerNames[i]);
            }

            //console.log("Length of players: ", gameMode.players.length);

            UpdateGameState(gameMode.players[gameMode.currentPlayerIndex].name,
                gameMode.players[gameMode.currentPlayerIndex].totalScore,
                gameMode.players[gameMode.currentPlayerIndex].roundScore);

            menu.style.display = 'none';
            game.style.display = 'block';
        } else {
            console.log("Unable to create game mode");
        }
    }
}

let particleInterval;
export function EndGame()
{
    // Clear old elements
    const paragraphs = playerScoreContainer.querySelectorAll('p');
    paragraphs.forEach((p) => {
        p.remove();
    });

    // Sort playes by total score
    const results = gameMode.players.sort((a, b) => b.totalScore - a.totalScore);

    // Create elements to show results
    const winner = results[0].name;
    const pWinner = document.createElement('p');
    pWinner.textContent = `Pelaaja ${winner} voitti!`;
    playerScoreContainer.appendChild(pWinner);

    for (let i = 0; i < results.length; i++) {
        const p = document.createElement('p');
        p.textContent = `${i+1}. ${results[i].name} - ${results[i].totalScore} pistettä`;
        playerScoreContainer.appendChild(p);
    }

    // Show results
    gameResultsContainer.style.display = 'block';

    // Play particles
    SetupParticles();
    particleInterval = setInterval(LoopParticles, 1/60); // 60fps
}

function RestartGame()
{
    // Clear particles
    clearInterval(particleInterval);

    // Refresh the page, so we dont get duplicate event listeners
    location.reload();
}

//EndGame();
