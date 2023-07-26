import { Clamp } from "./utils.js";
import { menu, game } from "./main.js";

import { dice1, dice2, diceFaces, UpdateGameState } from "./main.js";

// Single dice gamemode.
export class GameMode
{
    constructor(maxScore)
    {
        this.maxScore = maxScore;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.previousRolls = [];
    }

    Reset(maxScore)
    {
        this.maxScore = maxScore;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.previousRolls = [];
    }

    Roll()
    {
        //console.log("Roll");
        //console.log(this.constructor.name);
        //console.log("MaxScore: ", this.maxScore);
        //console.log("Players len: ", this.players.length);
        //console.log("Player idx: ", this.currentPlayerIndex);
        //console.log("Rolls len: ", this.previousRolls.length);

        const i = Math.round(Math.random() * 5);
        dice1.src = diceFaces[i].src;
        const number = i + 1;
        this.previousRolls.push(number);

        if (number === 1) {
            this.players[this.currentPlayerIndex].roundScore = 0;
            this.ChangeToNextPlayer();
        } else {
            this.players[this.currentPlayerIndex].roundScore += number;

            UpdateGameState(this.players[this.currentPlayerIndex].name,
                Clamp(this.players[this.currentPlayerIndex].totalScore, 0, this.maxScore),
                this.players[this.currentPlayerIndex].roundScore);

            if (this.players[this.currentPlayerIndex].totalScore + this.players[this.currentPlayerIndex].roundScore >= this.maxScore) {
                this.players[this.currentPlayerIndex].totalScore += this.players[this.currentPlayerIndex].roundScore;
                // TODO: Show win screen??
                alert(`Player ${this.players[this.currentPlayerIndex].name} wins!`);
                // Refresh the page, so we dont get duplicate event listeners
                location.reload();
            }
        }
    }

    Hold()
    {
        //console.log("Hold");
        this.players[this.currentPlayerIndex].totalScore += this.players[this.currentPlayerIndex].roundScore;
        this.players[this.currentPlayerIndex].roundScore = 0;
        this.ChangeToNextPlayer();
    }

    ChangeToNextPlayer()
    {
        this.previousRolls = [];
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex > this.players.length - 1) {
            this.currentPlayerIndex = 0;
        }

        UpdateGameState(this.players[this.currentPlayerIndex].name,
            Clamp(this.players[this.currentPlayerIndex].totalScore, 0, this.maxScore),
            this.players[this.currentPlayerIndex].roundScore);
    }
}

// Two dice gamemode.
export class GameModeTwoDices extends GameMode
{
    Roll()
    {
        console.log("TODO: Two dice gamemode");
        super.Roll();
    }
}
