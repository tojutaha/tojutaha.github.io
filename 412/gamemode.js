import { Clamp } from "./utils.js";
import { menu, game } from "./main.js";

import { dice1, dice2, diceFaces, UpdateGameState, EndGame } from "./main.js";

// Single dice gamemode.
export class GameMode
{
    constructor(maxScore)
    {
        this.maxScore = maxScore;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.previousRolls = [];
        this.doubleCounter = 0;
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
                this.players[this.currentPlayerIndex].totalScore = this.maxScore;
                EndGame();
            }
        }
    }

    Hold()
    {
        this.players[this.currentPlayerIndex].totalScore += this.players[this.currentPlayerIndex].roundScore;
        this.players[this.currentPlayerIndex].roundScore = 0;
        this.ChangeToNextPlayer();
    }

    ChangeToNextPlayer()
    {
        this.previousRolls = [];
        this,this.doubleCounter = 0;
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
        const i1 = Math.round(Math.random() * 5);
        const i2 = Math.round(Math.random() * 5);
        dice1.src = diceFaces[i1].src;
        dice2.src = diceFaces[i2].src;
        const number1 = i1 + 1;
        const number2 = i2 + 1;
        let score = number1 + number2;

        if (number1 === 1 && number2 === 1) {
            score = 25;
            this.doubleCounter++;
        } else if (number1 === 1 || number2 === 1) {
            this.players[this.currentPlayerIndex].roundScore = 0;
            this.ChangeToNextPlayer();
            return;
        } else if (number1 === number2) {
            score *= 2;
            this.doubleCounter++;
        } else {
            this.doubleCounter = 0;
        }

        if (this.doubleCounter >= 3) {
            this.players[this.currentPlayerIndex].roundScore = 0;
            this.ChangeToNextPlayer();
            return;
        }

        this.previousRolls.push(score);

        this.players[this.currentPlayerIndex].roundScore += score;

        UpdateGameState(this.players[this.currentPlayerIndex].name,
            Clamp(this.players[this.currentPlayerIndex].totalScore, 0, this.maxScore),
            this.players[this.currentPlayerIndex].roundScore);

        if (this.players[this.currentPlayerIndex].totalScore + this.players[this.currentPlayerIndex].roundScore >= this.maxScore) {
            this.players[this.currentPlayerIndex].totalScore = this.maxScore;
            EndGame();
        }
    }
}
