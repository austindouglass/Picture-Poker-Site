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

var deck = [];
var dealersHand = [1, 2, 3, 4, 5];
var playersHand = [6, 3, 2, 1, 0];

document.getElementById("dealercards").innerHTML = dealersHand.toString().replace(/,/g, ' ');
document.getElementById("playercards").innerHTML = playersHand.toString().replace(/,/g, ' ');