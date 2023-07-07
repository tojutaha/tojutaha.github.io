import { v2 } from "./vector.js";
import { GetRadius } from "./utils.js";
import { CreateFadingText } from "./particles.js";

export const silverSnowflakes = [];

export class SilverSnowflake
{
    constructor(p, id)
    {
        this.p = { ...p };
        this.TextureMaxSize = 450;
        this.TextureSize = 384;
        this.TextureMinSize = 300;

        this.texture = new Image(this.size, this.size);
        this.texture.src = 'textures/T_Snowflake2.png';

        this.id = id;
        this.size = 0;
        this.shouldGrow = true;
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
        const duration = 1000;
        const fps = 60;
        const increment = (this.size + this.TextureMaxSize) / (duration / fps);
        
        this.size += increment;

        if (this.size >= this.TextureMaxSize) {
            this.size = this.TextureMaxSize;
        }

        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
    }
    
    OnUnhovered(canvas)
    {
        const duration = 250;
        const fps = 60;
        const decrement = (this.size - this.TextureSize) / (duration / fps);

        this.size -= decrement;

        if (this.size <= this.TextureSize) {
            this.size = this.TextureSize;
        }

        this.p.x = (canvas.width - this.size) / 2;
        this.p.y = (canvas.height - this.size) / 2;
    }

    OnClick(p, GameState)
    {
        CreateFadingText(p, "TODO: Grant some bonus!!!");
        this.Delete();
    }

    Delete()
    {
        const i = silverSnowflakes.findIndex(obj => obj.id === this.id);
        
        if (i > -1) {
            silverSnowflakes.splice(i, 1);
        } else {
            console.log("Could not find obj from array");
        }
    }

    Update(ctx, canvas)
    {
        if (this.shouldGrow) {
            const maxSize = 200;
            this.size += 0.1;
            if (this.size >= maxSize) {
                this.shouldGrow = false;
            }
        } else {
            this.size -= 0.1;
            if (this.size <= 0) {
                this.Delete();
            }
        }
    }

    Draw(ctx, canvas)
    {
        if (this.texture) {
            ctx.drawImage(this.texture, this.p.x, this.p.y, 
                this.size, this.size);
        }
    }
}

