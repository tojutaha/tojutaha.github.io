import { Rect } from "./shapes.js";

export class Button
{
    constructor(width, height, x, y, item)
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
        this.item = item;
    }

    Draw(ctx, canvas, p, totalPoints)
    {
        this.enabled = totalPoints >= this.item.price ? true : false;

        ctx.fillStyle = this.rect.IsInRect(p, canvas) ? this.enabled ? this.validHoverColor : this.invalidHoverColor : this.basecolor;
        ctx.fillRect(this.rect.minX, this.rect.minY, this.width, this.height);

        ctx.fillStyle = "#000000";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.item.name, this.rect.minX + this.width / 2, this.rect.minY + this.height / 2);
    }

    OnClick(Score)
    {
        if (this.enabled) {
            if (this.item.affectsPPC)
                Score.pointsPerClick += this.item.bonus;
            else
                Score.pointsPerSecond += this.item.bonus;
            
            Score.totalPoints -= this.item.price;
            this.CalcNewPrice();
            return true;
        }
        return false;
    }
    
    CalcNewPrice()
    {
        this.item.numOfPurchases++;
        this.item.price = this.item.basePrice + (this.item.increment * this.item.numOfPurchases);
        this.item.bonus = this.item.baseBonus + (this.item.increment * this.item.numOfPurchases);
        console.log("Price: " + this.item.price);
        console.log("Bonus: " + this.item.bonus);
    }
}