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
var dHandBackup = [];
var playersHand = [];
var pHandBackup = [];
var numberToCard = {0 : 'back-mountain.png', 1 : 'cross.png', 2 : 'club.png', 3 : 'spade.png', 
                    4 : 'heart.png', 5 : 'diamond.png', 6 : 'flame.png'};

var result = setHand(5, deck);
dealersHand = result[0];
deck = result[1];

result = setHand(5, deck);
playersHand = result[0];
deck = result[1];

//document.getElementById("dealercards").innerHTML = dealersHand.join(' ');
//document.getElementById("playercards").innerHTML = playersHand.join(' ');
displayCards(dealersHand, "dealercards", numberToCard);
displayCards(playersHand, "playercards", numberToCard);
drawButton();



function drawButton()   {
    var buttonHtml;
    if(checkForSelection(playersHand, playersHand.length))  {
        buttonHtml  = "<img src=\"images/ui/button-draw.png\" ></img>";
    }
    else    {
        buttonHtml  = "<img src=\"images/ui/button-hold.png\" ></img>";
    }
    document.getElementById("playerbutton").innerHTML  = buttonHtml;
}

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

//checkForSelection - returns true if a card is 0
function checkForSelection(cards, length)   {
    var i;
    for(i=0; i < length; ++i)   {
        if(cards[i] == 0)   {
            return true;
        }
    }
    return false;
}

//flipCard - flips cards to select for redraw
function flipCard(flipNum) {    
    if(!checkForSelection(playersHand, playersHand.length)) {
        pHandBackup = [...playersHand];
    }
    if(playersHand[flipNum])   {
        playersHand[flipNum] = 0;
    }
    else    {
        playersHand[flipNum] = pHandBackup[flipNum];
    }

    displayCards(playersHand, "playercards", numberToCard);
    drawButton();

}

//displayCards - converts number into displayable cards in html
//bug when clicking dealers cards it flips players cards ** change flip on click
function displayCards(cards, id, numberToCard)    {
    var i, cardImgs = "", cardType;
    //flipOnClick = "onclick=\"flipCard(" + cards.toString() + " ";
    for(i=0; i<cards.length; ++i)   {
        cardType = numberToCard[cards[i]];
        cardImgs += "<img src=\"images/cards/" + cardType + "\""; //></img>";
        if(id == "playercards") {
            flipOnClick = " onclick=\"flipCard(" + i + ")\"></img>";
            cardImgs += flipOnClick;
        }
        else    {
            cardImgs += "></img>";
        }
        //cardImgs += flipOnClick + i + "";
    }
    document.getElementById(id).innerHTML  = cardImgs;
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