import { v2 } from "./vector.js";
import { AbbreviateNumber, GetRadius } from "./utils.js";
import { CreateFadingText } from "./particles.js";
import { PlayAudio, OnTimedEventStart, OnTimedEventStop,  eventContainer, timerText, existingIDs } from "./main.js";

export const silverSnowflakes = [];
let IsTimedEventActive = false;
let timeLeft = 30;
let timerInterval = null;

function StartTimer()
{
    IsTimedEventActive = true;
    OnTimedEventStart(timeLeft);
    eventContainer.style.display = 'flex';
    UpdateTimer();
}

function UpdateTimer()
{
    timerText.textContent = timeLeft;
    timeLeft--;

    if (timeLeft >= 0) {
        setTimeout(UpdateTimer, 1000);
    } else {
        timerText.textContent = 30;
        eventContainer.style.display = 'none';
        OnTimedEventStop();
        timeLeft = 30;
        IsTimedEventActive = false;
    }
}

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

    OnClick(ctx, canvas, p, GameState)
    {
        PlayAudio();

        // Only allow one timed event for now..
        if (IsTimedEventActive) {

            // If player has no points, give 2 points instead of zero.
            let bonus = 2;

            // otherwise give 20% of total points
            if (GameState.totalPoints > 0) {
                bonus = GameState.totalPoints * 0.2;
            }

            GameState.totalPoints += bonus;
            CreateFadingText(ctx, canvas, p, `+${AbbreviateNumber(bonus)}`);
            
        } else {
            StartTimer();
        }

        this.Delete();
    }

    Delete()
    {
        const success = existingIDs.delete(this.id);
        if (!success) {
            console.log("Could not find obj from Set");
        } else {
            const i = silverSnowflakes.findIndex(obj => obj.id === this.id);
            if (i > -1) {
                silverSnowflakes.splice(i, 1);
            } else {
                console.log("Could not find obj from Array");
            }
        }
    }

    Update()
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

    Draw(ctx)
    {
        if (this.texture && !this.timerActive) {
            ctx.drawImage(this.texture, this.p.x, this.p.y, 
                this.size, this.size);
        }
    }
}

