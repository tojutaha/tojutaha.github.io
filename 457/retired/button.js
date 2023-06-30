import { Rect } from "./shapes.js";
import { AbbreviateNumber } from "./utils.js";

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

        ctx.fillStyle = "#00ffff";
        const iconWidth = 32;
        const iconHeight = 32;
        // TODO: Draw item texture?
        ctx.fillRect(this.rect.minX + 10, 
                     this.rect.minY + this.height / 2 - iconHeight,
                     64, 64);

        ctx.fillStyle = "#000000";
        ctx.font = "24px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        let x = this.rect.minX + 80;
        let y = this.rect.minY + 33;
        let text = this.item.name;
        ctx.fillText(text, x, y);

        y += 33;
        text = AbbreviateNumber(this.item.price) + " snowflakes";
        ctx.font = "16px Arial";
        ctx.fillText(text, x, y);

        ctx.textAlign = "right";
        ctx.font = "bold 36px Arial";
        x = this.rect.maxX - 20;
        y = this.rect.minY + this.height / 2;
        text = "x" + AbbreviateNumber(this.item.numOfPurchases);
        ctx.fillText(text, x, y);
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
    }
}
