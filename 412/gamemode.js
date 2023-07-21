import { Clamp } from "./utils.js";
import { menu } from "./main.js";

import { diceFaces, playerNameText, totalScoreText, roundScoreText } from "./main.js";

// Single dice gamemode.
export class GameMode
{
    constructor(maxScore)
    {
        this.maxScore = maxScore;
        this.players = [];
        this.currentPlayerIndex = 0;
    }

    Roll()
    {
        const i = Math.round(Math.random() * 5);
        dice.src = diceFaces[i].src;
        const number = i + 1;

        if (number === 1) {
            this.players[this.currentPlayerIndex].roundScore = 0;
            roundScoreText.textContent = 0;
            this.ChangeToNextPlayer();
        } else {
            this.players[this.currentPlayerIndex].roundScore += number;
            roundScoreText.textContent = this.players[this.currentPlayerIndex].roundScore;

            if (this.players[this.currentPlayerIndex].totalScore + this.players[this.currentPlayerIndex].roundScore >= this.maxScore) {
                this.players[this.currentPlayerIndex].totalScore += this.players[this.currentPlayerIndex].roundScore;
                totalScoreText.textContent = Clamp(this.players[this.currentPlayerIndex].totalScore, 0, this.maxScore);
                alert(`Player ${this.players[this.currentPlayerIndex].name} wins!`);
                menu.style.display = 'block';
            }
        }
    }

    Hold()
    {
        this.players[this.currentPlayerIndex].totalScore += this.players[this.currentPlayerIndex].roundScore;
        totalScoreText.textContent = this.players[this.currentPlayerIndex].totalScore;
        this.players[this.currentPlayerIndex].roundScore = 0;
        this.ChangeToNextPlayer();
    }

    ChangeToNextPlayer()
    {
        //console.log("Round over");
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex > this.players.length - 1) {
            this.currentPlayerIndex = 0;
        }

        //console.log(this.currentPlayerIndex);

        playerNameText.textContent  = this.players[this.currentPlayerIndex].name;
        totalScoreText.textContent  = this.players[this.currentPlayerIndex].totalScore;
        roundScoreText.textContent  = this.players[this.currentPlayerIndex].roundScore;
    }
}

