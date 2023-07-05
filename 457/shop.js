import { ClickSound, GameState } from "./main.js";
import { AbbreviateNumber } from "./utils.js";
import { InitializeUpgrades, UpdateUpgrades } from "./upgrades.js";

export class Item
{
    // if affectsPPC is true, then the bonus will affect points per click,
    // otherwise it will affect points per second.
    constructor(name, basePrice, increment, baseBonus, 
                affectsPPC, locked, unlocksIn, textureSrc)
    {
        this.name = name;
        this.basePrice = basePrice;
        this.price = basePrice;
        this.increment = increment;
        this.baseBonus = baseBonus;
        this.bonus = baseBonus;
        this.affectsPPC = affectsPPC;
        this.numOfPurchases = 0;
        this.locked = locked;
        this.unlocksIn = unlocksIn;
        this.texture = new Image(64, 64);
        this.textureSrc = textureSrc;
        this.canvas = null;
        this.hoverWindow = null;
    }

    OnClick()
    {
        if (!this.locked) {
            if (this.affectsPPC)
                GameState.pointsPerClick += this.bonus;
            else
                GameState.pointsPerSecond += this.bonus;
            
            GameState.totalPoints -= this.price;
            this.CalcNewPrice();
            this.UpdateHoverWindow();
            UpdateShop(this);
            UpdateUpgrades(this);
            ClickSound.play();
        }
    }

    CalculateHoverWindowLocation()
    {
        const buttonContainer = document.getElementById('button-container');
        const style = getComputedStyle(this.hoverWindow);
        const windowWidth = parseInt(style.width, 10);
        const offset = windowWidth + 20;
        return window.innerWidth - buttonContainer.offsetWidth - offset;
    }

    UpdateHoverWindow()
    {
        const singleText = this.hoverWindow.querySelector('.hoverWindow-text-single');
        const allText = this.hoverWindow.querySelector('.hoverWindow-text-all');

        const single = AbbreviateNumber(this.bonus);
        const total = AbbreviateNumber(this.bonus * this.numOfPurchases);
        const type = this.affectsPPC ? 'per click' : 'per seconds';
        singleText.textContent = `Each ${this.name} produces ${single} snowflakes ${type}`;
        allText.textContent = `${this.numOfPurchases} ${this.name}s producing ${total} snowflakes ${type}`;
    }

    OnHover(button) 
    {
        // TODO: Bug, when clicking button that goes disabled,
        //       it doesnt hide the hover window.
        this.UpdateHoverWindow();
        const pos = this.CalculateHoverWindowLocation();
        this.hoverWindow.style.left = pos + 'px';
        this.hoverWindow.style.display = 'flex';
    }

    OnUnhover(button)
    {
        this.hoverWindow.style.display = 'none';
    }
    
    CalcNewPrice()
    {
        this.numOfPurchases++;
        this.price = this.basePrice + (this.increment * this.numOfPurchases);
        this.bonus = this.baseBonus + (this.increment * this.numOfPurchases);
    }
}

// TODO: Real items (json??)
export let items = [
    // Name, BasePrice, Increment, BaseBonus, affectsPPC, locked, unlocksIn, textureSrc:
    new Item("Upgrade PPC",          1,     2,    1,  true, false,     0, "textures/T_Icecube1.png"),
    new Item("Upgrade PPS",          1,     2,    1, false, false,     0, "textures/T_Icecube2.png"),
    new Item("Upgrade PPC++",       50,   100,   50,  true,  true,   500, "textures/T_Snowball.png"),
    new Item("Upgrade PPS++",       50,   100,   50, false,  true,  1000, "textures/T_Snowflake.PNG"),
    new Item("Upgrade PPC+++",     200,  2000,  200,  true,  true,  2000, "textures/T_Snowflake.PNG"),
    new Item("Upgrade PPS+++",     200,  2000,  200, false,  true,  4000, "textures/T_Icecube1.png"),
    new Item("Upgrade PPC++++",    400,  4000,  400,  true,  true,  6000, "textures/T_Icecube2.png"),
    new Item("Upgrade PPS++++",    400,  4000,  400, false,  true,  8000, "textures/T_Snowball.png"),
    new Item("Legendary PPC++++", 4000, 40000, 4000,  true,  true, 10000, "textures/T_Snowflake2.png"),
    new Item("Legendary PPS++++", 4000, 40000, 4000, false,  true, 10000, "textures/T_Snowflake2.png"),
];

function InitializeItems()
{
    const promises = items.map(item => {
        return new Promise((resolve, reject) => {
            item.texture.onload = function () {
                resolve();
            };
            item.texture.onerror = function() {
                reject(new Error(`Failed to load texture: ${item.textureSrc}`));
            };
            item.texture.src = item.textureSrc;
        });
    });

    return Promise.all(promises);
}

export let buttons = [];
export function InitializeShop()
{
    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) {
        console.log('Could not find element with Id: button-container');
        return;
    }

    // Construct the buttons and upgrades when we are sure that all
    // the textures are loaded.
    // TODO: Add loading screen? This can take a while.
    InitializeItems().then(() => {

    buttonContainer.innerHTML = "";
    buttons = [];

    items.forEach((item) => {

        const button = CreateButton(item);
        buttonContainer.appendChild(button);
        buttons.push(button);
    });

        InitializeUpgrades();

    }).catch(error => {
        console.error("Error loading textures:", error);
    });
}

function CreateButton(item)
{
    // Create button elements
    const button = document.createElement('button');
    const image = document.createElement('img');
    const textContainer = document.createElement('div');
    const nameText = document.createElement('div');
    const priceText = document.createElement('div');
    const amountText = document.createElement('span');

    // Hover window
    const hoverWindow = document.createElement('div');
    const hoverWindowContainer = document.createElement('div');
    const hoverWindowTextSingle = document.createElement('div');
    const hoverWindowTextAll = document.createElement('div');
    const hoverWindowImage = document.createElement('img');

    // Set classes and attributes
    button.classList.add('shopButton');
    image.src = item.textureSrc;
    image.classList.add('shopButton-image');
    textContainer.classList.add('shopButton-content');
    nameText.classList.add('shopButton-nameText');
    priceText.classList.add('shopButton-priceText');
    amountText.classList.add('shopButton-amountText');

    hoverWindow.classList.add('hoverWindow');
    hoverWindowContainer.classList.add('hoverWindow-content');
    hoverWindowTextSingle.classList.add('hoverWindow-text-single');
    hoverWindowTextAll.classList.add('hoverWindow-text-all');
    hoverWindowImage.classList.add('hoverWindow-image');

    item.locked = item.price > GameState.totalPoints;
    const color = item.locked ? '#ff0000' : '#00ff00'
    button.disabled = item.locked;

    const height = window.innerHeight / items.length;
    button.style.height = `${height}px`;

    nameText.textContent = item.name;
    priceText.textContent = AbbreviateNumber(item.price) + " snowflakes";
    priceText.style.color = color;
    amountText.textContent = item.numOfPurchases > 0 ? "+" + item.numOfPurchases : item.numOfPurchases;

    hoverWindowTextSingle.textContent = "";
    hoverWindowTextAll.textContent = "";
    hoverWindowImage.src = item.textureSrc;

    // Append elements
    textContainer.appendChild(nameText);
    textContainer.appendChild(priceText);

    button.appendChild(image);
    button.appendChild(textContainer);
    button.appendChild(amountText);
    button.appendChild(hoverWindow);

    hoverWindowContainer.appendChild(hoverWindowTextSingle);
    hoverWindowContainer.appendChild(hoverWindowTextAll);
    hoverWindow.appendChild(hoverWindowImage);
    hoverWindow.appendChild(hoverWindowContainer);

    item.hoverWindow = hoverWindow;

    // Set event listeners
    button.addEventListener('click', item.OnClick.bind(item));

    button.addEventListener('mouseenter', function() {
        item.OnHover(button);
    });

    button.addEventListener('mouseleave', function() {
        item.OnUnhover(button);
    });

    return button;
}

export function UpdateShop(item)
{
    if (item) {
        const button = buttons.find((btn) => btn.textContent.includes(item.name));
        if (button) {
            const priceText = button.querySelector('.shopButton-priceText');
            const amountText = button.querySelector('.shopButton-amountText');

            item.locked = item.price > GameState.totalPoints;
            const color = item.locked ? '#ff0000' : '#00ff00'
            button.disabled = item.locked;

            priceText.textContent = AbbreviateNumber(item.price) + " snowflakes";
            priceText.style.color = color;
            amountText.textContent = item.numOfPurchases > 0 ? "+" + item.numOfPurchases : item.numOfPurchases;
        }
    } else {
        items.forEach((item) => {
            UpdateShop(item);
        });
    }
}

