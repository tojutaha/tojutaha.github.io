export class Terrain
{
    constructor()
    {
        this.color = "#ffffff";
        this.height = 100;
        this.curve = 30;
    }

    Draw(canvas, ctx)
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - this.height);

        ctx.quadraticCurveTo(
            canvas.width / 2,
            canvas.height - this.height - this.curve,
            canvas.width,
            canvas.height - this.height
        );

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
}