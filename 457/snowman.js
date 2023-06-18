import { Rect } from "./shapes.js";

export class SnowMan
{
    constructor(canvas)
    {
        this.radius = 100;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + this.radius * 2;
        
        const minX = this.x - this.radius;
        const minY = this.y - this.radius * 4.0;
        const maxX = minX + 200;
        const maxY = minY + 500;
        this.hitBox = new Rect(minX, maxX, minY, maxY);
    }

    Draw(canvas, ctx)
    {
        /*
        // Hitbox
        ctx.fillStyle = '#0000FF'
        ctx.fillRect(this.hitBox.minX, this.hitBox.minY,
                     200, 500);
        */

        // Body
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.radius*2.75, this.radius/1.5, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.radius*1.5, this.radius/1.25, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();

        // Arms
        ctx.strokeStyle = '#a16436';
        ctx.lineWidth = 10;

        const LstartX = canvas.width / 2 + this.radius/2;
        const LstartY = canvas.height / 2;
        const LendX = LstartX + 100;
        const LendY = LstartY - 75;
        ctx.beginPath();
        ctx.moveTo(LstartX, LstartY);
        ctx.lineTo(LendX, LendY);
        ctx.stroke();

        const RstartX = canvas.width / 2 - this.radius/2;
        const RstartY = canvas.height / 2;
        const RendX = RstartX - 100;
        const RendY = RstartY - 75;
        ctx.beginPath();
        ctx.moveTo(RstartX, RstartY);
        ctx.lineTo(RendX, RendY);
        ctx.stroke();

        // Buttons
        ctx.fillStyle = '#000000'
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.radius, 8, 0, Math.PI*2, false);
        ctx.arc(this.x, this.y - this.radius - 40, 8, 0, Math.PI*2, false);
        ctx.arc(this.x, this.y - this.radius - 80, 8, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.beginPath();
        ctx.arc(this.x - this.radius/4, this.y - this.radius*2.75, 7.5, 0, Math.PI*2, false);
        ctx.arc(this.x + this.radius/4, this.y - this.radius*2.75, 7.5, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.radius*2.3, 3, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x - 15, this.y - this.radius*2.35, 3, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y - this.radius*2.35, 3, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();

        // Hat
        ctx.fillRect(this.x - 70, this.y - this.radius*3.25, 140, 15);
        ctx.fillRect(this.x - 50, this.y - this.radius*4, 100, 75);

        // Nose
        ctx.fillStyle = '#FFA500'
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.radius*2.55, 7.5, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();

        // Scarf
        ctx.fillStyle = '#FF0000'
        ctx.fillRect(this.x - 50, this.y - this.radius*2.25, 100, 15);
    }
}