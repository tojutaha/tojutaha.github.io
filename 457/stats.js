import { AbbreviateNumber } from "./utils.js";

export function DrawStats(ctx, Score)
{
    ctx.font = "normal 24px Arial";
    ctx.fillStyle = 'white';

    let scoreText = "Total Points: " + AbbreviateNumber(Score.totalPoints);
    let pointsPerSecondText = "Points Per Second: " + AbbreviateNumber(Score.pointsPerSecond);
    let pointsPerClickText = "Points Per Click: " + AbbreviateNumber(Score.pointsPerClick);
    let allTimePointsText = "All time points: " + AbbreviateNumber(Score.allTimePoints);

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';

    ctx.fillText(scoreText, 25, 25);
    ctx.fillText(pointsPerSecondText, 25, 50);
    ctx.fillText(pointsPerClickText, 25, 75);
    ctx.fillText(allTimePointsText, 25, 100);
}