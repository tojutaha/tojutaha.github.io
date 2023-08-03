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
 * 8. Jokainen pelikierros kuluttaa panoksen verran pelaajalla olevia rahoja. 
 *    Kierroksen voitoista tulee ilmoittaa pelaajalle ja voitot lisätään pelaajan käytössä olevaan rahamäärään.
 * 9. Peliä ei voi jatkaa jos panos on suurempi kuin käytössä olevat rahat.
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
const maxBet = 5;
let canChangeBet = true;
let shuffling = false;

// Utils
function Clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

// Audio
const audio_coin = "audio/coin.wav";
const audio_bet1 = "audio/bet1.wav";
const audio_bet2 = "audio/bet2.wav";
const audio_bet3 = "audio/bet3.wav";
const audio_bet4 = "audio/bet4.wav";
const audio_bet5 = "audio/bet5.wav";
const audio_lock = "audio/lock.wav";
const audio_win = "audio/win.wav";
const audioContext = new AudioContext();
// https://stackoverflow.com/questions/61453760/how-to-rapidly-play-multiple-copies-of-a-soundfile-in-javascript
const PlayAudio = async (audioFile) =>
{
    const response = await fetch(audioFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5;

    audioSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    audioSource.start();
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
let rollArr = [0, 0, 0, 0];
playButton.addEventListener('click', function()
{
    if (!shuffling && money >= bet) {

        PlayAudio(audio_lock); // TODO: separate audio?
        rollCount++;

        shuffling = true;
        canChangeBet = false;
        betButton.style.boxShadow = 'none';

        money -= bet;

        for (let i = 0; i < rolls.length; i++) {
            const rng = Math.floor(Math.random() * rollTextures.length);
            if (!rolls[i].isLocked) {
                rolls[i].img.src = rollTextures[rng].src;
                rollArr[i] = rng;
            }
        }

        const winning = CheckWinnings(rollArr);

        if (rollCount % 2 !== 0 && winning <= 0) {
            ToggleCanLockRolls(true);
            timerHandle = setInterval(BlinkLockButtons, 500);
        } else if (rollCount % 2 === 0) {
            ToggleCanLockRolls(false);
            ToggleLockRolls(false);
            clearInterval(timerHandle);
        }

        if (winning !== 0) {
            winningsDisplay.textContent = winning;
            PlayAudio(audio_win);
        }

        money += winning;
        moneyDisplay.textContent = money;

        if (money < bet) {
            bet = Clamp(money, 1, maxBet);
            betDisplay.textContent = bet;
            PlayBetSound();
            winningsDisplay.textContent = 0;
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

    PlayBetSound();

});

coinButton1.addEventListener('click', function()
{
    money += 1;
    moneyDisplay.textContent = money;
    PlayAudio(audio_coin);
});

coinButton2.addEventListener('click', function()
{
    money += 2;
    moneyDisplay.textContent = money;
    PlayAudio(audio_coin);
});

coinButton5.addEventListener('click', function()
{
    money += 5;
    moneyDisplay.textContent = money;
    PlayAudio(audio_coin);
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
            PlayAudio(audio_lock);
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

function CheckWinnings(inputArray)
{
    let result = 0;

    const occurrences = {};
    for (const element of inputArray) {
        // Check if number exists in occurrences object,
        // If it exists, retrieve its current value. If not use zero. 
        // Then increment the count by one.
        occurrences[element] = (occurrences[element] || 0) + 1;
    }

    //console.log(inputArray);
    //console.log(Object.keys(occurrences));
    //console.log(Object.values(occurrences));

    // Check how many hits we got
    const uniqueElements = Object.keys(occurrences).length;
    if (uniqueElements === 1) {
        switch (Object.keys(occurrences)[0]) {
            case '0': // apple
                console.log("4 x apple");
                result = 6 * bet;
                break;
            case '1': // cherries
                console.log("4 x cherries");
                result = 3 * bet;
                break;
            case '2': // grapes
                console.log("4 x grapes");
                result = 4 * bet;
                break;
            case '3': // watermelon
                console.log("4 x watermelon");
                result = 5 * bet;
                break;
            case '4': // number 7
                console.log("4 x number 7");
                result = 10 * bet;
                break;
            default:
                break;
        }
    } else if (uniqueElements === 2) {
        // TODO: 3 x number 7 = 5 * bet
    }

    winningsDisplay.textContent = result;

    return result;
}

function PlayBetSound()
{
    switch(bet) {
        case 1:
            PlayAudio(audio_bet1);
            break;
        case 2:
            PlayAudio(audio_bet2);
            break;
        case 3:
            PlayAudio(audio_bet3);
            break;
        case 4:
            PlayAudio(audio_bet4);
            break;
        case 5:
            PlayAudio(audio_bet5);
            break;
    }
}
