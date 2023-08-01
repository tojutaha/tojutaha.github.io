/*
 * Kuvaus
 * Toteuta JavaScriptillä perinteinen hedelmäpeli, jossa on tavoitteena saada tiettyjä kuviosarjoja. Pelin vaatimukset ovat seuraavat:
 *
 * 1. Pelin alussa on käytössä rahaa x euroa.
 * 2. Pelissä on neljä arvottavaa rullaa.
 * 3. Pelissä voidaan asettaa panos, joka on minimissään 1€. Maksimiarvon voin miettiä itse.
 * 4. Kun painetaan Pelaa-painiketta arvotaan rullien paikalle kuvat. Erilaisia kuvia on viisi:
 *    - omena, päärynä, kirsikka, meloni, numero 7
 *    - tai voit itse keksiä sopivammat kuvat. Niiden määrä pitää olla kuitenkin vähintään 5.
 * 5. Kun kuvat on arvottu ohjelma kertoo, saadaanko sillä voittoa. 
 * 6. Jos ensimmäisen pyöräytyksen jälkeen ei saatu voittoa, voi käyttäjä lukita haluamansa rullat, ja painaa uudelleen Pelaa-painiketta. 
 *    Lukittuihin rulliin ei arvota uusia kuvia. Tämän jälkeen tarkistetaan voitto uudelleen. 
 *    Tämän jälkeen lukitut rullat vapautuvat ja seuraavalla Pelaa-painikkeen painalluksella kaikkiin rulliin arvotaan jälleen kuvat.
 * 7. Voitot määräytyvät seuraavasti:
 *    - neljä x 7 => voitto = 10 x panos
 *    - neljä x omena => voitto = 6 x panos
 *    - neljä x meloni => voitto = 5 x panos
 *    - neljä x päärymä => voitto = 4 x panos
 *    - neljä x kirsikka => voitto = 3 x panos
 *    - kolme kertaa 7 => voitto = 5 x panos
 * 8. Jokainen pelikierros kuluttaa panoksen verran peljaalla olevia rahoja. 
 *    Kierroksen voitoista tulee ilmoittaa pelaajalle ja voitot lisätään pelaajan käytössä olevaan rahamäärään.
 * 9. Pelijä ei voi jatkaa jos panos on suurempi kuin käytössä olevat rahat.
 *
*/

// Globals
const playButton = document.getElementById('playButton');
const betButton = document.getElementById('betButton');

const coinButton1 = document.getElementById('coinButton1');
const coinButton2 = document.getElementById('coinButton2');
const coinButton5 = document.getElementById('coinButton5');

let money = 0;
let bet = 1;
const maxBet = 10;
let winning = 0;

// Async load textures
const rollTextures = [];
function LoadTextures()
{
    const imageSrcs = [
        "textures/apple.png",
        "textures/cherries.png",
        "textures/grapes.png",
        "textures/watermelon.png",
        "textures/number-7.png",
    ];

    rollTextures.length = 0;

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
            rollTextures.push(image);
        });
    });

    return Promise.all(promises);
}

// Event listeners
playButton.addEventListener('click', function() {
    for (let i = 0; i < rolls.length; i++) {
        const rng = Math.floor(Math.random() * rollTextures.length);
        if (!rolls[i].isLocked) {
            rolls[i].img.src = rollTextures[rng].src;
        }
    }

    money += CheckWinnings();
});

betButton.addEventListener('click', function() {
    bet += 1;
    if (bet > maxBet) {
        bet = 1;
    }
    console.log(bet);
});

coinButton1.addEventListener('click', function() {
    money += 1;
    console.log("Money: ", money);
});

coinButton2.addEventListener('click', function() {
    money += 2;
    console.log("Money: ", money);
});

coinButton5.addEventListener('click', function() {
    money += 5;
    console.log("Money: ", money);
});

LoadTextures().then(() => {
    console.log("Successfully loaded all textures.");
    InitializeGame();
}).catch(error => {
    console.error("Error loading textures:", error);
});

let rolls = [];
function RollObject(index, img, button, isLocked) {
    this.index = index;
    this.img = img;
    this.button = button;
    this.isLocked = isLocked;

    this.ToggleLock = () => {
        this.isLocked = !this.isLocked;
        console.log(`Roll ${this.index} lock = ${this.isLocked}`);
    };
}

function InitializeGame()
{
    const images = document.querySelectorAll('.rolls-content .roll img');
    const buttons = document.querySelectorAll('.lockButton');
    for (let i = 0; i < images.length; i++) {
        const rng = Math.floor(Math.random() * rollTextures.length);
        rolls.push(new RollObject(i, images[i], buttons[i], false));
        buttons[i].addEventListener('click', rolls[i].ToggleLock);
    }
}

function CheckWinnings() {
    console.log("// TODO: CheckWinnings()");
    return 0;
}
