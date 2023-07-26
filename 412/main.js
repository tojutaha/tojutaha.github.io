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
 * heittojen summa nollataan. Vuoro siirtyyy seuraavalle pelaajalle.
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

// Globals
export const dice1 = document.getElementById('dice1');
export const dice2 = document.getElementById('dice2');
export const menu = document.querySelector('.menu-container');
export const game = document.querySelector('.game-container');
const playersSettings = document.getElementById('numOfPlayers');
let playerContainer = document.querySelector('.player-container');
const startButton = document.querySelector('.startButton');
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

const playerNames = [];
let playersInitialized = false;
playersSettings.addEventListener('change', OnPlayerSettingsChanged);
function OnPlayerSettingsChanged()
{
    // TODO: Bug, all input fields check fails on some cases.
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
            break;
        case 2:
            gameMode = gameMode2;
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
function InitializeGame(e)
{
    e.preventDefault();

    // TODO: Wait for all textures finishes loading
    const imageSrcs = [
        "textures/d1.png",
        "textures/d2.png",
        "textures/d3.png",
        "textures/d4.png",
        "textures/d5.png",
        "textures/d6.png",
    ];

    imageSrcs.forEach(src => {
        let image = new Image();
        image.src = src;
        diceFaces.push(image);
    });

    if (playersInitialized) {

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

