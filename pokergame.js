/*
Reminder for things that will need to be done:
-selecting hold/draw
-selecting bet
-update for win
-update for lose
-update for draw
-display money / bet
-add cheat protection? (users can't easily read dealers card array)
    --not sure if this is worth doing as knowing the dealers cards do not guarantee any win
    --it really just helps prevents a big loss
-dont forget to clear hands and resetDeck after a round

deck layout:
card values will go from 1-6
deck will be 30 cards (5 cards per value)

*/

//current objective: change pointer for clickable images

var deck = resetDeck();
var dealersHand = [];
var dHandBackup = [];
var playersHand = [];
var pHandBackup = [];
var numberToCard = {0 : 'back-mountain.png', 1 : 'cross.png', 2 : 'club.png', 3 : 'spade.png', 
                    4 : 'heart.png', 5 : 'diamond.png', 6 : 'flame.png'};
var draw = 0;       //used to limit draws

var result = setHand(5, deck);
dealersHand = result[0];
deck = result[1];

result = setHand(5, deck);
playersHand = result[0];
deck = result[1];

displayCards(dealersHand, "dealercards", numberToCard);
displayCards(playersHand, "playercards", numberToCard);
drawButton();

//compareMatches - returns if the player won or lost through matches
function compareMatches(pvalue, dvalue)   {
    if(pvalue > dvalue) {
        return 'YOU WON';
    }
    else if(pvalue < dvalue)    {
        return 'YOU LOSE';
    }
    else    {
        return 'TIE';
    }
}

//whoWon - returns the player result by comparing matches
//need to check lengths of each for 0,1, and 2
function whoWon(pmatches, dmatches) {
    console.log('----whoWon----');
    console.log(pmatches);
    console.log(dmatches);
    //makes sure there is at least 1 match
    if(pmatches.length > 0 && dmatches.length == 0) {
        return 'YOU WON';
    }
    else if(pmatches.length == 0 && dmatches.length > 0)    {
        return 'YOU LOSE';
    }
    else if(pmatches.length == 0 && dmatches.length == 0)   {
        return 'TIE';
    }
    //compare highest matches amount
    var result = compareMatches(pmatches[0][0], dmatches[0][0]);
    if(result == 'TIE') {
        //compare highest match card value
        result = compareMatches(pmatches[0][1], dmatches[0][1]);
        if(result == 'TIE') {
            //makes sure there is at least 2 matches
            if(pmatches.length > 1 && dmatches.length == 1) {
                return 'YOU WON';
            }
            else if(pmatches.length == 1 && dmatches.length > 1)    {
                return 'YOU LOSE';
            }
            else if(pmatches.length == 1 && dmatches.length == 1)   {
                return 'TIE';
            }
            //compare second match amount
            result = compareMatches(pmatches[1][0], dmatches[1][0]);
            if(result == 'TIE') {
                //compare second match card value
                result = compareMatches(pmatches[1][1], dmatches[1][1]);
            }
        }
    }
    return result;
}

//determineWinner - checks matches for both hands and returns player game result
function determineWinner()   {
    //makes sure cant draw cards after hold
    ++draw;
    if(draw == 1)   {
        newDealerHand();
    }
    //dealersHand.sort();
    //playersHand.sort();
    dHandBackup = [...dealersHand];
    pHandBackup = [...playersHand];
    displayCards(dealersHand, "dealercards", numberToCard);
    displayCards(playersHand, "playercards", numberToCard);

    var i, j, pmatch = 1, dmatch = 1, dmatches = [], pmatches = [];

    for(i=0; i<dealersHand.length; ++i) {
        if(dealersHand[i] != -1 || playersHand[i] != -1)    {
            for(j=i+1; j<dealersHand.length; ++j)    {
                if(dealersHand[i] != -1 && dealersHand[i] == dealersHand[j])    {
                    dealersHand[j] = -1;
                    ++dmatch;
                }
                if(playersHand[i] != -1 && playersHand[i] == playersHand[j])    {
                    playersHand[j] = -1;
                    ++pmatch;
                }
            }
            
            if(dmatch > 1)  {
                if(!dmatches.length || dmatch > dmatches[0][0])    {
                    dmatches.unshift([dmatch, dealersHand[i]]);
                }
                else{
                    dmatches.push([dmatch, dealersHand[i]]);
                }
            }
            if(pmatch > 1)  {
                if(!pmatches.length || pmatch > pmatches[0][0])    {
                    pmatches.unshift([pmatch, playersHand[i]]);
                }
                else{
                    pmatches.push([pmatch, playersHand[i]]);
                }
            }

            if(dmatch)
                dealersHand[i] = -1;
            if(pmatch)
                playersHand[i] = -1;
            
            dmatch = 1;
            pmatch = 1;
        }
    }

    //print winner
    console.log(whoWon(pmatches, dmatches));

    playersHand = [...pHandBackup];
    dealersHand = [...dHandBackup];
}


//newDealerHand - checks for non matches and redraws those cards
function newDealerHand()    {
    dHandBackup = [...dealersHand];
    var i, j, draw, matches = 0;

    //card selection algorithm O(n^2) (but n should always be 5 in our game)
    for(i=0; i<dealersHand.length; ++i) {
        if(dealersHand[i] != -1)   {         //-1 signals that there is a match in this spot
            for(j=i+1; j<dealersHand.length; ++j)    {
                if(dealersHand[i] == dealersHand[j])    {
                    dealersHand[j] = -1;
                    ++matches;
                }
            }
            if(matches)
                dealersHand[i] = -1;
        }
        matches = 0;
    }

    //drawing new cards
    for(i=0; i<dealersHand.length; ++i)    {
        if(dealersHand[i] == -1)    
            dealersHand[i] = dHandBackup[i];
        else    {
            draw = Math.floor(Math.random()*deck.length);
            dealersHand[i] = deck[draw];
            deck.splice(draw, 1);
            deck.push(dHandBackup[i]);
        }
    }
}


//newHand - replaces players selected cards when clicking draw button
function newHand()  {
    ++draw;
    var i;
    for(i = 0; i < playersHand.length; ++i)  {
        if(playersHand[i] == 0) {
            draw = Math.floor(Math.random()*deck.length);
            playersHand[i] = deck[draw];
            deck.splice(draw, 1);
            deck.push(pHandBackup[i]);
        }
    }
    //possibly remove these in place for an endRound function of some sort (getting rid of drawB and hold case setup)
    newDealerHand();
    displayCards(dealersHand, "dealercards", numberToCard);
    displayCards(playersHand, "playercards", numberToCard);
    drawButton();
}

//drawButton - displays clickable button to hold / draw for player
function drawButton()   {
    var buttonHtml;
    if(checkForSelection(playersHand, playersHand.length))  {
        buttonHtml  = "<img src=\"images/ui/button-draw.png\" onclick=\"newHand()\" style=\"cursor: pointer;\"></img>";
    }
    else    {
        buttonHtml  = "<img src=\"images/ui/button-hold.png\" onclick=\"determineWinner()\" style=\"cursor: pointer;\"></img>";
    }
    document.getElementById("playerbutton").innerHTML  = buttonHtml;
}

//setHand - draws 5 random cards from the deck, returns list of 5 cards & new deck
function setHand(handSize, deck)  {
    var i, draw, hand = [];
    for(i = 0; i < handSize; ++i)  {
        draw = Math.floor(Math.random()*deck.length);
        hand.push(deck[draw]);
        deck.splice(draw, 1);
    }
    return [hand, deck];
}

//checkForSelection - returns true if a card is 0 (meaning selected by player)
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
    //if player has not selected card
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
function displayCards(cards, id, numberToCard)    {
    var i, cardImgs = "", cardType;
    for(i=0; i<cards.length; ++i)   {
        cardType = numberToCard[cards[i]];
        cardImgs += "<img src=\"images/cards/" + cardType + "\""; //></img>";
        if(id == "playercards" && draw == 0) {
            flipOnClick = " onclick=\"flipCard(" + i + ")\" style=\"cursor: pointer;\"></img>";
            cardImgs += flipOnClick;
        }
        else    {
            cardImgs += "></img>";
        }
    }
    document.getElementById(id).innerHTML = cardImgs;
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