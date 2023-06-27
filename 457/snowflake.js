import { v2 } from "./vector.js";
import { GetRadius, Clamp } from "./utils.js";

const TextureMaxSize = 384;
const TextureHalfSize = 300;
export class SnowFlake
{
    constructor(p)
    {
        this.p = { ...p };
        this.size = TextureMaxSize;
        v2.subtractS.call(this.p, this.size/2);
        this.texture = new Image(this.size, this.size);
        this.texture.src = "textures/T_Snowflake.PNG"
    }

    IsInRadius(mouseP)
    {
        const radius = GetRadius({x: this.size/2, y: this.size/2});
        const center = {x: this.p.x+this.size/2, y: this.p.y+this.size/2};
        const distance = v2.dist.call(center, mouseP);

        return distance <= radius;
    }

    OnHovered(canvas)
    {
        const duration = 250;
        const fps = 60;
        const decrement = (this.size - TextureHalfSize) / (duration / fps);

        this.size -= decrement;

        if (this.size <= TextureHalfSize) {
            this.size = TextureHalfSize;
        }

        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
    }
    
    OnUnhovered(canvas)
    {
        const duration = 250;
        const fps = 60;
        const increment = (this.size + TextureMaxSize) / (duration / fps);
        
        this.size += increment;

        if (this.size >= TextureMaxSize) {
            this.size = TextureMaxSize;
        }

        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
    }

    OnClick(canvas)
    {
        this.size = TextureMaxSize;
        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
    }
    
    Draw(ctx)
    {
        // TODO: Scale on window resize?
        if (this.texture) {
            ctx.drawImage(this.texture, this.p.x, this.p.y, 
                this.size, this.size);
        }
    }
}