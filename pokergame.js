/*
Reminder for things that will need to be done:
-display number cards
-create deck
-make drawing cards random
-selecting hold/draw
-selecting bet
-update for win
-update for lose
-update for draw
-display cards
-this is just to test change

deck layout:
card values will go from 1-6
deck will be 30 cards (5 cards per value)

*/

var deck = resetDeck();
var dealersHand = [];
var playersHand = [];

var result = setHand(5, deck);
dealersHand = result[0];
deck = result[1];

result = setHand(5, deck);
playersHand = result[0];
deck = result[1];

document.getElementById("dealercards").innerHTML = dealersHand.join(' ');
document.getElementById("playercards").innerHTML = playersHand.join(' ');

//setHand - draws 5 random cards from the deck, returns list of 5 cards & new deck
function setHand(handSize, deck)  { 
    console.log("--in setHand()--");
    console.log(deck.toString());

    var i, draw, hand = [];
    for(i = 0; i < handSize; ++i)  {
        draw = Math.floor(Math.random()*deck.length);
        hand.push(deck[draw]);
        deck.splice(draw, 1);
    }

    console.log("new hand: " + hand.toString());
    console.log(deck.toString());
    return [hand, deck];
}

//resetDeck - returns array of 5 numbers each
function resetDeck()    {
    return [1, 1, 1, 1, 1,
            2, 2, 2, 2, 2,
            3, 3, 3, 3, 3,
            4, 4, 4, 4, 4,
            5, 5, 5, 5, 5,
            6, 6, 6, 6, 6];
}