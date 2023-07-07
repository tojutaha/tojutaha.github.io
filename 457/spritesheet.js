import { GetRadius } from "./utils.js";
import { v2 } from "./vector.js";

export class Spritesheet
{
    constructor(p, textureSrc, cols, rows)
    {
        this.p = { ...p };
        this.spritesheet = new Image();
        this.spritesheet.src = textureSrc;
        this.currentFrame = 0;
        this.cols = cols;
        this.rows = rows;
        this.frameWidth = this.spritesheet.width / cols;
        this.frameHeight = this.spritesheet.height / rows;
        this.totalFrames = cols * rows;
        this.fps = 30;
        this.animationSpeed = 1000 / this.fps;
    }

    PostInitialize()
    {
        this.frameWidth = this.spritesheet.width / this.cols;
        this.frameHeight = this.spritesheet.height / this.rows;
    }

    ResizeImage(ctx, canvas)
    {
        const scale = 1.5;
        const x = canvas.width / 2 - (this.frameWidth * scale) / 2;
        const y = canvas.height / 2 - (this.frameHeight * scale) / 2;
        ctx.translate(x, y);
        ctx.scale(scale, scale);
    }

    UpdateFrame(ctx, canvas)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const row = Math.floor(this.currentFrame / 8);
        const col = this.currentFrame % 8;

        ctx.save();
        this.ResizeImage(ctx, canvas);
        ctx.drawImage(this.spritesheet,
                      col * this.frameWidth,
                      row * this.frameHeight,
                      this.frameWidth, this.frameHeight,
                      0, 0,
                      this.frameWidth, this.frameHeight);
        ctx.restore();

        this.currentFrame++;
        if (this.currentFrame >= this.totalFrames) {
            this.currentFrame = 0;
        }

        //setTimeout(this.UpdateFrame, this.animationSpeed);
    }

    IsInRadius(ctx, mouseP)
    {
        const radius = GetRadius({ x: this.frameWidth * 0.75, y: this.frameHeight * 0.75});
        const center = { x: this.p.x, y: this.p.y };
        const distance = v2.dist.call(center, mouseP);
        
        /*
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI*2, false);
        ctx.fill();
        */

        return distance <= radius;
    }

    OnHovered(canvas)
    {
        /*
        const duration = 1000;
        const fps = 60;
        const increment = (this.size + this.TextureMaxSize) / (duration / fps);
        
        this.size += increment;

        if (this.size >= this.TextureMaxSize) {
            this.size = this.TextureMaxSize;
        }

        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
        */
    }

    OnUnhovered(canvas)
    {
        /*
        const duration = 250;
        const fps = 60;
        const decrement = (this.size - this.TextureSize) / (duration / fps);

        this.size -= decrement;

        if (this.size <= this.TextureSize) {
            this.size = this.TextureSize;
        }

        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
        */
    }

    OnClick(canvas)
    {
        /*
        this.size = this.TextureMinSize;
        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
        */
    }
}
