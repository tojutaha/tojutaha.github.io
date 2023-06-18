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