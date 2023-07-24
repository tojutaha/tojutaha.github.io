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
const dice = document.getElementById('dice');
export const menu = document.querySelector('.menu-container');
export const game = document.querySelector('.game-container');
const dicesSettings = document.getElementById('numOfDices');
const playersSettings = document.getElementById('numOfPlayers');
const startButton = document.querySelector('.startButton');
const rollButton = document.getElementById('rollButton');
const holdButton = document.getElementById('holdButton');

export const diceFaces = [];
export const playerNameText = document.getElementById('name');
export const totalScoreText = document.getElementById('totalScore');
export const roundScoreText = document.getElementById('roundScore');

let gameMode = null;

// Event listeners
startButton.addEventListener('click', InitializeGame);

dicesSettings.addEventListener('change', OnDiceSettingsChanged);
function OnDiceSettingsChanged()
{
    // TODO: Pick gamemode based on dicesSettings.value;
    gameMode = new GameMode(100);
}

playersSettings.addEventListener('change', OnPlayerSettingsChanged);
function OnPlayerSettingsChanged()
{
    //playersSettings.value;
    // TODO: Read values and number of players from menu
    gameMode.players.push(new Player("Pelaaja1"));
    gameMode.players.push(new Player("Pelaaja2"));
    gameMode.players.push(new Player("Pelaaja3"));
    gameMode.players.push(new Player("Pelaaja4"));
}

OnDiceSettingsChanged();
OnPlayerSettingsChanged();

rollButton.addEventListener('click', gameMode.Roll.bind(gameMode));
holdButton.addEventListener('click', gameMode.Hold.bind(gameMode));

export function UpdateGameState(name, totalScore, roundScore)
{
    playerNameText.textContent = name;
    totalScoreText.textContent = totalScore;
    roundScoreText.textContent = roundScore;
}

function InitializeGame()
{
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

    OnDiceSettingsChanged();
    OnPlayerSettingsChanged();

    UpdateGameState(gameMode.players[gameMode.currentPlayerIndex].name,
        gameMode.players[gameMode.currentPlayerIndex].totalScore,
        gameMode.players[gameMode.currentPlayerIndex].roundScore);

    menu.style.display = 'none';
    game.style.display = 'block';
}

