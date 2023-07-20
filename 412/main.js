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

import { Player } from "./player.js";

// Globals
const dice = document.getElementById('dice');
const diceFaces = [];
const dicesSettings = document.getElementById('numOfDices');
const playersSettings = document.getElementById('numOfPlayers');
const rollButton = document.getElementById('rollButton');
const holdButton = document.getElementById('holdButton');
let numOfDices = 1;
let numOfPlayers = 1;

// DEBUG only
const maxScore = 100;
let totalScore = 0;
let roundScore = 0;
const totalScoreText = document.getElementById('totalScore');
const roundScoreText = document.getElementById('roundScore');

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Event listeners
dicesSettings.addEventListener('change', OnDiceSettingsChanged);
function OnDiceSettingsChanged()
{
    numOfDices = dicesSettings.value;
}

playersSettings.addEventListener('change', OnPlayerSettingsChanged);
function OnPlayerSettingsChanged()
{
    numOfPlayers = playersSettings.value;
}

rollButton.addEventListener('click', Roll);
holdButton.addEventListener('click', Hold);

function InitializeGame()
{
    const imageSrcs = [
        "textures/d1.gif",
        "textures/d2.gif",
        "textures/d3.gif",
        "textures/d4.gif",
        "textures/d5.gif",
        "textures/d6.gif",
    ];

    imageSrcs.forEach(src => {
        let image = new Image();
        image.src = src;
        diceFaces.push(image);
    });

    totalScoreText.textContent = 0;
    roundScoreText.textContent = 0;
}
InitializeGame();

function Roll()
{
    const i = Math.round(Math.random() * 5);
    dice.src = diceFaces[i].src;
    const number = i + 1;

    if (number === 1) {
        roundScore = 0;
        roundScoreText.textContent = 0;
        console.log("ONE: Round over");
    } else {
        roundScore += number;
        roundScoreText.textContent = roundScore;

        if (totalScore + roundScore >= maxScore) {
            totalScore += roundScore;
            totalScoreText.textContent = Clamp(totalScore, 0, maxScore);
            alert("WIN");
            InitializeGame();
        }
    }
}

function Hold()
{
    totalScore += roundScore;
    totalScoreText.textContent = totalScore;
    roundScore = 0;
    console.log("HOLD: Round over");
}
