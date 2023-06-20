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

export class FloatingTextParticle
{
    constructor(x, y, text)
    {
        this.x = x;
        this.y = y;
        this.text = text;
        this.alpha = 1;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * -3 - 1;
    }

    Update()
    {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;
    }
    
    Draw(ctx)
    {
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

export class SnowFlake
{
    constructor(x, y, ctx)
    {
        this.x = x;
        this.y = y;
        this.size = 64;
        this.alpha = 1;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * -2;
        this.texture = new Image(this.size, this.size);
        this.texture.src = "textures/T_Snowflake.png"
    }

    Update()
    {
        this.x -= this.vx;
        this.y -= this.vy;
        this.alpha -= 0.05;
    }
    
    Draw(ctx)
    {
        const rotation = Math.random() * Math.PI * 2;
        const centerX = this.x;
        const centerY = this.y;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.drawImage(this.texture, 
                      -this.size/2, 
                      -this.size/2, 
                      this.size, this.size);
        ctx.restore();
    }
}