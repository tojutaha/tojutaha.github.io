import { Clamp } from "./utils.js";
import { v2 } from "./vector.js";

export class SnowParticle
{
    constructor(p, speed, size)
    {
        this.p = { ...p };
        this.speed = speed;
        this.size = size;
        this.color = `rgba(255, 255, 255 ${Math.random()})`;
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
        this.speed = Math.random() * 2 + 1;
        this.size = Math.random() * 2 + 1;
    }
}

export const snowParticles = [];
export function CreateSnow(canvas, amount)
{
    for (let i = 0; i < amount; i++) {
        const p = { x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height };
        const speed = Math.random() * 2 + 1;
        const size = Math.random() * 2 + 1;
        snowParticles.push(new SnowParticle(p, speed, size))
    }
}

export class FloatingTextParticle
{
    constructor(p, text)
    {
        this.p = { ...p };
        this.text = text;
        this.alpha = 1;
        this.v = { x: Math.random() * 2,
                   y: Math.random() * -3 };
    }

    Update()
    {
        v2.add.call(this.p, this.v);
        this.alpha -= 0.01;
    }
    
    Draw(ctx)
    {
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.fillText(this.text, this.p.x, this.p.y);
    }
}

export class FadingTextParticle extends FloatingTextParticle
{
    constructor(p, text)
    {
        super(p, text);
        this.v = {x: 0, y: 0};
    }

    Update()
    {
        this.alpha -= 0.0025;
    }

    Draw(ctx)
    {
        ctx.font = `bold 40px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillText(this.text, this.p.x, this.p.y);
    }
}

const fadingTextParticles = [];
export function CreateFadingText(ctx, canvas, p, text)
{
    // Check that we dont draw outside of canvas
    const textWidth = ctx.measureText(text).width;
    const width = canvas.width;
    const height = canvas.height;

    const minTextX = textWidth;
    const minTextY = 40;
    const maxTextX = width - textWidth / 2;
    const maxTextY = height - 40;

    p.x = Clamp(p.x, minTextX, maxTextX);
    p.y = Clamp(p.y, minTextY, maxTextY);

    fadingTextParticles.push(new FadingTextParticle(p, text));
}

export function DrawFadingText(ctx)
{
    for (let i = 0; i < fadingTextParticles.length; i++) {
        fadingTextParticles[i].Draw(ctx);
    }

    for (let i = fadingTextParticles.length - 1; i >= 0; i--) {
        const particle = fadingTextParticles[i];
        particle.Update();

        if (particle.alpha <= 0) {
            fadingTextParticles.splice(i, 1);
        }
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
