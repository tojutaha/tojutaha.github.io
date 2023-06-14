export class SnowParticle
{
    constructor(x, y, speed, size, color)
    {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.color = color;
    }

    Draw(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    Update(canvas, ctx)
    {
        this.y += this.speed;
        if (this.y > canvas.height + this.size) {
            this.Reset(canvas);
        }
        this.Draw(ctx);
    }
    
    Reset(canvas)
    {
        this.x = Math.random() * canvas.width;
        this.y = -this.size;
        this.speed = Math.random() * 5 + 1;
        this.size = Math.random() * 3 + 1;
        this.color = `rgba(255, 255, 255 ${Math.random()})`;
    }
}