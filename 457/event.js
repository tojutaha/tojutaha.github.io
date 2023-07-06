import { v2 } from "./vector.js";
import { GetRadius } from "./utils.js";
import { SnowFlake } from "./snowflake.js";
import { CreateFadingText } from "./particles.js";

export const silverSnowflakes = [];

export class SilverSnowflake extends SnowFlake
{
    constructor(p, id)
    {
        super(p);
        this.texture.src = 'textures/T_Snowflake2.png';
        this.id = id;
        this.size = 0;
        this.shouldGrow = true;
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
}

