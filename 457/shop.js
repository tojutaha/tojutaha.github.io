import { ClickSound, Score } from "./main.js";
import { AbbreviateNumber } from "./utils.js";
import { UpdateUpgrades } from "./upgrades.js";

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
    }

    OnClick()
    {
        if (!this.locked) {
            if (this.affectsPPC)
                Score.pointsPerClick += this.bonus;
            else
                Score.pointsPerSecond += this.bonus;
            
            Score.totalPoints -= this.price;
            this.CalcNewPrice();
            UpdateShop(this);
            UpdateUpgrades();
            ClickSound.play();
        }
    }

    OnHover(button) 
    {
        //if (!button.disabled) button.style.backgroundColor = '#ff0000';
    }

    OnUnhover(button)
    {
        //if (!button.disabled) button.style.backgroundColor = '#00ff00';
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
    new Item("Upgrade PPC",          1,    2,     1,  true, false,    0, "textures/T_Icecube1.png"),
    new Item("Upgrade PPS",          1,    2,     1, false, false,    0, "textures/T_Icecube2.png"),
    new Item("Upgrade PPC++",       50,  100,    50,  true, true,   500, "textures/T_Snowball.png"),
    new Item("Upgrade PPS++",       50,  100,    50, false, true,  1000, "textures/T_Snowflake.PNG"),
    new Item("Upgrade PPC+++",     200,  2000,  200,  true, true,  2000, "textures/T_Snowflake.PNG"),
    new Item("Upgrade PPS+++",     200,  2000,  200, false, true,  4000, "textures/T_Icecube1.png"),
    new Item("Upgrade PPC++++",    400,  4000,  400,  true, true,  6000, "textures/T_Icecube2.png"),
    new Item("Upgrade PPS++++",    400,  4000,  400, false, true,  8000, "textures/T_Snowball.png"),
    new Item("Legendary PPS++++", 4000, 40000, 4000, false, true, 10000, "textures/T_Snowflake2.png"),
];

export let buttons = [];
export function InitializeShop()
{
    const buttonContainer = document.getElementById('buttonContainer');
    if (!buttonContainer) {
        console.log('Could not find element with Id: buttonContainer');
        return;
    }

    buttonContainer.innerHTML = "";
    buttons = [];

    items.forEach((item) => {

        const button = CreateButton(item);
        buttonContainer.appendChild(button);
        buttons.push(button);
    });

    UpdateUpgrades();
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

    // Set classes and attributes
    button.classList.add('shopButton');
    image.src = item.textureSrc;
    image.classList.add('shopButton-image');
    textContainer.classList.add('shopButton-content');
    nameText.classList.add('shopButton-nameText');
    priceText.classList.add('shopButton-priceText');
    amountText.classList.add('shopButton-amountText');

    item.locked = item.price > Score.totalPoints;
    const color = item.locked ? '#ff0000' : '#00ff00'
    button.disabled = item.locked;

    nameText.textContent = item.name;
    priceText.textContent = AbbreviateNumber(item.price) + " snowflakes";
    priceText.style.color = color;
    amountText.textContent = item.numOfPurchases > 0 ? "+" + item.numOfPurchases : item.numOfPurchases;

    // Append elements
    textContainer.appendChild(nameText);
    textContainer.appendChild(priceText);
    button.appendChild(image);
    button.appendChild(textContainer);
    button.appendChild(amountText);

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

            item.locked = item.price > Score.totalPoints;
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

