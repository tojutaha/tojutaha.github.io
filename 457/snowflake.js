import { Rect } from "./shapes.js";
import { v2 } from "./vector.js";
import { GetRadius } from "./utils.js";

export class SnowFlake
{
    constructor(p)
    {
        this.p = { ...p };
        this.size = 256;
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

    Draw(ctx)
    {
        // TODO: Animate
        if (this.texture) {
            ctx.drawImage(this.texture, this.p.x, this.p.y, 
                this.size, this.size);
        }
    }
}