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
 *    - neljä x päärynä => voitto = 4 x panos
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

const moneyDisplay = document.getElementById('money-display');
const betDisplay = document.getElementById('bet-display');
const winningsDisplay = document.getElementById('winnings-display');

let money = 10;
let bet = 1;
const maxBet = 10;
let canChangeBet = true;
let winning = 0;
let shuffling = false;

// Utils
function Clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

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
let timerHandle = null;
let rollCount = 0;
playButton.addEventListener('click', function()
{
    if (!shuffling && money >= bet) {

        rollCount++;

        shuffling = true;
        canChangeBet = false;
        betButton.style.boxShadow = 'none';

        money -= bet;

        for (let i = 0; i < rolls.length; i++) {
            const rng = Math.floor(Math.random() * rollTextures.length);
            if (!rolls[i].isLocked) {
                rolls[i].img.src = rollTextures[rng].src;
            }
        }

        const winning = CheckWinnings();
        if (rollCount % 2 !== 0 && winning <= 0) {
            ToggleCanLockRolls(true);
            timerHandle = setInterval(BlinkLockButtons, 500);
        } else if (rollCount % 2 === 0) {
            ToggleCanLockRolls(false);
            ToggleLockRolls(false);
            clearInterval(timerHandle);
        }

        if (winning !== 0) {
            // TODO: update winnings display
        }

        money += winning;
        moneyDisplay.textContent = money;

        if (money < bet) {
            bet = Clamp(money, 1, maxBet);
            betDisplay.textContent = bet;
        }

        shuffling = false;
        canChangeBet = true;
        betButton.style.boxShadow = `0px 0px 20px 10px cyan`;
    }
});

betButton.addEventListener('click', function()
{
    if (canChangeBet) {
        bet += 1;
        if (bet > maxBet) {
            bet = 1;
        }
        betDisplay.textContent = bet;
    }
});

coinButton1.addEventListener('click', function()
{
    money += 1;
    moneyDisplay.textContent = money;
});

coinButton2.addEventListener('click', function()
{
    money += 2;
    moneyDisplay.textContent = money;
});

coinButton5.addEventListener('click', function()
{
    money += 5;
    moneyDisplay.textContent = money;
});

LoadTextures().then(() => {
    console.log("Successfully loaded all textures.");
    InitializeGame();
}).catch(error => {
    console.error("Error loading textures:", error);
});

let rolls = [];
let rollButtons = [];
function RollObject(index, img, button, isLocked)
{
    this.index = index;
    this.img = img;
    this.button = button;
    this.isLocked = isLocked;
    this.canBeLocked = false;

    this.ToggleLock = () => {
        if (this.canBeLocked) {
            this.isLocked = !this.isLocked;
            const style = this.isLocked ? `0px 0px 20px 10px lightcoral` : 'none';
            this.button.style.boxShadow = style;
            console.log(`Roll ${this.index} lock = ${this.isLocked}`);
        }
    };
}

let lightsOn = true;
function BlinkLockButtons()
{
    for (let i = 0; i < rolls.length; i++) {
        if (!rolls[i].isLocked) {
            const style = lightsOn ? `0px 0px 20px 10px lightcoral` : 'none';
            rolls[i].button.style.boxShadow = style;
        }
    }
    lightsOn = !lightsOn;
}

function InitializeGame()
{
    const images = document.querySelectorAll('.rolls-content .roll img');
    const buttons = document.querySelectorAll('.lockButton');
    for (let i = 0; i < images.length; i++) {
        const rng = Math.floor(Math.random() * rollTextures.length);
        rolls.push(new RollObject(i, images[i], buttons[i], false));
        buttons[i].addEventListener('click', rolls[i].ToggleLock);
        rollButtons.push(buttons[i]);
    }

    ToggleCanLockRolls(false);
}

function ToggleLockRolls(isLocked)
{
    for (let i = 0; i < rolls.length; i++) {
        rolls[i].isLocked = isLocked;
        const style = isLocked ? `0px 0px 20px 10px lightcoral` : 'none';
        rolls[i].button.style.boxShadow = style;
    }
}

function ToggleCanLockRolls(canBeLocked)
{
    for (let i = 0; i < rolls.length; i++) {
        rolls[i].canBeLocked = canBeLocked;
    }
}

function CheckWinnings()
{
    // TODO:
    // - neljä x 7 => voitto = 10 x panos
    // - neljä x omena => voitto = 6 x panos
    // - neljä x meloni => voitto = 5 x panos
    // - neljä x päärynä => voitto = 4 x panos
    // - neljä x kirsikka => voitto = 3 x panos
    // - kolme kertaa 7 => voitto = 5 x panos

    let result = 0;
    winningsDisplay.textContent = result;

    return result;
}
