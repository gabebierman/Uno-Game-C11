import { CardColor, CardVal } from "./cardEnums";

function playCard(clickedCard, gameCard) {
    let reverseDirection = false;
    let skipTurn = false;
    let gameColor = gameCard.color;
    let drawCards = { draw: false, amount: 0 };
    let playedWild = false;

    //assuming validatePlayedCard has already been run and is true (allowed)

    if (clickedCard.color === CardColor.Black) {
        if (clickedCard.value === CardVal.Wild) {
            playedWild = true;
        } else {
            //card is wild + 4
            playedWild = true;
            drawCards.draw = true;
            drawCards.amount = 4;
        }
    } else {
        if (clickedCard.color === gameCard.color) {
            if (clickedCard.value === CardVal.Skip) {
                skipTurn = true;
            } else if (clickedCard.value === CardVal.Reverse) {
                reverseDirection = true;
            } else if (clickedCard.value === CardVal.DrawTwo) {
                drawCards.draw = true;
                drawCards.amount = 2;
            }
        }
        //if color doesn't match, val matches (already validated)
        else {
            //it's a number card, change game color
            gameColor = clickedCard.color;
        }
    }

    return { reverseDirection, skipTurn, gameColor, drawCards, playedWild };
}

export default playCard;
