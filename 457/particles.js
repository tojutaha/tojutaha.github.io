import { v2 } from "./vector.js";
export class SnowParticle
{
    constructor(p, speed, size, color)
    {
        this.p = { ...p };
        this.speed = speed;
        this.size = size;
        this.color = color;
    }

    Draw(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.size, 0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    Update(canvas, ctx)
    {
        this.p.y += this.speed;
        if (this.p.y > canvas.height + this.size) {
            this.Reset(canvas);
        }
        this.Draw(ctx);
    }
    
    Reset(canvas)
    {
        this.p = { x: Math.random() * canvas.width,
                   y: -this.size };
        this.speed = Math.random() * 5 + 1;
        this.size = Math.random() * 3 + 1;
        this.color = `rgba(255, 255, 255 ${Math.random()})`;
    }
}

export const snowParticles = [];
export function CreateSnow(canvas, amount)
{
    for (let i = 0; i < amount; i++) {
        const p = { x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height };
        const speed = Math.random() * 5 + 1;
        const size = Math.random() * 3 + 1;
        const color = `rbga(255, 255, 255, ${Math.random()})`;
        snowParticles.push(new SnowParticle(p, speed, size, color))
    }
}

export class FloatingTextParticle
{
    constructor(p, text)
    {
        this.p = { ...p };
        this.text = text;
        this.alpha = 1;
        this.v = { x: Math.random() * 2 - 1,
                   y: Math.random() * -3 - 1 };
    }

    Update()
    {
        v2.add.call(this.p, this.v);
        this.alpha -= 0.01;
    }
    
    Draw(ctx)
    {
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.fillText(this.text, this.p.x, this.p.y);
    }
}

const textParticles = [];
export function CreateFloatingText(p, text)
{
    textParticles.push(new FloatingTextParticle(p, text));
}

export function DrawFloatingText(ctx)
{
    for (let i = 0; i < textParticles.length; i++) {
        textParticles[i].Draw(ctx);
    }

    for (let i = textParticles.length - 1; i >= 0; i--) {
        const particle = textParticles[i];
        particle.Update();

        if (particle.alpha <= 0) {
            textParticles.splice(i, 1);
        }
    }
}

export class SnowFlakeParticle
{
    constructor(p)
    {
        this.p = { ...p };
        this.size = 64;
        this.alpha = 1;
        this.v = { x: Math.random() * 2 - 1,
                   y: Math.random() * -2 };
        this.texture = new Image(this.size, this.size);
        this.texture.src = "textures/T_Snowflake.PNG"
    }

    Update()
    {
        v2.subtractV2.call(this.p, this.v);
        this.alpha -= 0.05;
    }
    
    Draw(ctx)
    {
        if (this.texture) {
            const rotation = Math.random() * Math.PI * 2;
            ctx.save();
            ctx.translate(this.p.x, this.p.y);
            ctx.rotate(rotation);
            ctx.drawImage(this.texture, 
                        -this.size/2, 
                        -this.size/2, 
                        this.size, this.size);
            ctx.restore();
        }
    }
}

const snowFlakes = [];
export function CreateSnowFlakeParticles(p)
{
    snowFlakes.push(new SnowFlakeParticle(p));
}

export function DrawSnowflakeParticles(ctx)
{
    for (let i = 0; i < snowFlakes.length; i++) {
        snowFlakes[i].Draw(ctx);
    }

    for (let i = snowFlakes.length - 1; i >= 0; i--) {
        const particle = snowFlakes[i];
        particle.Update();

        if (particle.alpha <= 0) {
            snowFlakes.splice(i, 1);
        }
    }
}