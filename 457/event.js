import { v2 } from "./vector.js";
import { GetRadius } from "./utils.js";
import { SnowFlake } from "./snowflake.js";
import { CreateFloatingText } from "./particles.js";

export const events = [];

export class Event extends SnowFlake
{
    constructor(p, id)
    {
        super(p);
        this.id = id;
        this.size = 0;
        this.shouldGrow = true;
        //this.tintColor = '#0000ff';
    }

    OnClick(p, GameState)
    {
        CreateFloatingText(p, "TODO: Grant some bonus!!!");
        this.Delete();
    }

    Delete()
    {
        const i = events.findIndex(obj => obj.id === this.id);
        
        if (i > -1) {
            events.splice(i, 1);
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

        //this.p.x = (canvas.width - this.size) / 2;
        //this.p.y = (canvas.height - this.size) / 2;
    }

    Draw(ctx, canvas)
    {
        //ctx.fillStyle = this.tintColor;
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.globalCompositeOperation = 'destination-in';
        super.Draw(ctx, canvas);
        //ctx.globalCompositeOperation = 'source-over';
    }
}

