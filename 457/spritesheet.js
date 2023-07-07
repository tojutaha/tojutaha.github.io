export class Spritesheet
{
    constructor(textureSrc, cols, rows)
    {
        this.spritesheet = new Image();
        this.spritesheet.src = textureSrc;
        this.currentFrame = 0;
        this.frameWidth = this.spritesheet.width / cols;
        this.frameHeight = this.spritesheet.height / rows;
        this.totalFrames = cols * rows;
        this.fps = 30;
        this.animationSpeed = 1000 / this.fps;
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
}
