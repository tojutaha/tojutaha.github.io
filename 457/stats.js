import { AbbreviateNumber } from "./utils.js";

export function DrawStats(ctx, canvas, Score)
{
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    //ctx.textAlign = 'start';
    //ctx.textBaseline = 'alphabetic';
    const x = canvas.width / 2;


    const scoreText = "SNOWFLAKES: " + AbbreviateNumber(Score.totalPoints);
    const pointsPerSecondText = "Snowflakes Per Second: " + AbbreviateNumber(Score.pointsPerSecond);
    const pointsPerClickText = "Snowflakes Per Click: " + AbbreviateNumber(Score.pointsPerClick);
    //const allTimePointsText = "All time Snowflakes: " + AbbreviateNumber(Score.allTimePoints);

    ctx.fillText(scoreText, x, 50);
    ctx.font = "normal 24px Arial";
    ctx.fillText(pointsPerSecondText, x, 75);
    ctx.fillText(pointsPerClickText, x, 100);
    //ctx.fillText(allTimePointsText, x, 100);
}
