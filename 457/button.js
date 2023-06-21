import { Rect } from "./shapes.js";

export class Button
{
    constructor(width, height, x, y, upgrade)
    {
        this.width = width;
        this.height = height;
        const maxX = x + this.width;
        const maxY = y + this.height;
        this.rect = new Rect(x, maxX, y, maxY);
        this.basecolor = "#ffffff";
        this.validHoverColor = "#00ff00";
        this.invalidHoverColor = "#ff0000";
        this.clickColor = "#0000ff";
        this.enabled = false;

        // 

        this.upgrade = upgrade;
    }

    Draw(ctx, canvas, x, y, totalPoints)
    {
        this.enabled = totalPoints >= this.upgrade.price ? true : false;

        ctx.fillStyle = this.rect.IsInRect(x, y, canvas) ? this.enabled ? this.validHoverColor : this.invalidHoverColor : this.basecolor;
        ctx.fillRect(this.rect.minX, this.rect.minY, this.width, this.height);

        ctx.fillStyle = "#000000";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.upgrade.name, this.rect.minX + this.width / 2, this.rect.minY + this.height / 2);
    }

    OnClick(Score)
    {
        if (this.enabled) {
            if (this.upgrade.affectsPPC)
                Score.pointsPerClick += this.upgrade.bonus;
            else
                Score.pointsPerSecond += this.upgrade.bonus;
            
            Score.totalPoints -= this.upgrade.price;
            this.CalcNewPrice();
            return true;
        }
        return false;
    }
    
    CalcNewPrice()
    {
        this.upgrade.numOfPurchases++;
        this.upgrade.price = this.upgrade.basePrice + (this.upgrade.increment * this.upgrade.numOfPurchases);
        this.upgrade.bonus = this.upgrade.baseBonus + (this.upgrade.increment * this.upgrade.numOfPurchases);
        console.log("Price: " + this.upgrade.price);
        console.log("Bonus: " + this.upgrade.bonus);
    }
}