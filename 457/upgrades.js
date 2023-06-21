export class Upgrade
{
    // if affectsPPC is true, then the bonus will affect points per click,
    // otherwise it will affect points per second.
    constructor(name, basePrice, increment, baseBonus, affectsPPC)
    {
        this.name = name;
        this.basePrice = basePrice;
        this.price = basePrice;
        this.increment = increment;
        this.baseBonus = baseBonus;
        this.bonus = baseBonus;
        this.affectsPPC = affectsPPC;
        this.numOfPurchases = 0;
    }
}

export let upgrades = [
    new Upgrade("Upgrade PPC", 1, 2, 1, true),
    new Upgrade("Upgrade PPS", 50, 100, 50, false),
];

export function DrawUpgrades(canvas, ctx)
{
    const width = canvas.width;
    const height = 100;
    const segments = Math.ceil(canvas.width, width);
    
    for (let i = 0; i < segments; i++) {
        const y = i * height;
        
        const isEven = i % 2 === 0;
        const color = isEven ? '#000000' : '#ffffff';

        ctx.fillStyle = color;
        ctx.fillRect(0, y, width, height);
    }
}