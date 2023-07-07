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

        this.scale = 1.25;
        this.minScale = 1.0;
        this.maxScale = 1.5;
    }

    PostInitialize()
    {
        this.frameWidth = this.spritesheet.width / this.cols;
        this.frameHeight = this.spritesheet.height / this.rows;
    }

    ResizeImage(ctx, canvas)
    {
        const x = canvas.width / 2 - (this.frameWidth * this.scale) / 2;
        const y = canvas.height / 2 - (this.frameHeight * this.scale) / 2;
        ctx.translate(x, y);
        ctx.scale(this.scale, this.scale);
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
        const increment = (this.scale + this.maxScale) / this.animationSpeed;
        
        this.scale += increment;

        if (this.scale >= this.maxScale) {
            this.scale = this.maxScale;
        }
    }

    OnUnhovered(canvas)
    {
        const decrement = (this.scale - this.minScale) / this.animationSpeed;

        this.scale -= decrement;

        if (this.scale <= this.scale) {
            this.scale = this.scale;
        }
    }

    OnClick(canvas)
    {
        //this.scale = this.minScale;
    }
}
