
//Copyright 2020, Austin Douglass, all rights reserved.

/*
Reminder for things that will need to be done:
-shop
-add keyboard inputs?

deck layout:
card values will go from 1-6
deck will be 30 cards (5 cards per value)

colors:
bet yellow: rgb(255, 228, 0)
lose red: rgb(210, 43, 43)
button gray: rgb(189, 189, 189)

*/

//localStorage['pm'] = '100';

//current objective: work on shop and new decks

var dealersHand = [];
var dHandBackup = [];
var playersHand = [];
var pHandBackup = [];
var numberToCard = {0 : 'back.png', 1 : 'cross.png', 2 : 'spade.png', 3 : 'club.png', 
                    4 : 'heart.png', 5 : 'diamond.png', 6 : 'flame.png'};
var result, deck, draw, roundButton = false, pMoney = parseInt(localStorage['pm']) || 100, pBet, betMultiplier = 1;
var deckStyle = localStorage['dstyle'] || "default/";

$('body').css("background-image", "url('images/decks/" + deckStyle + "priority.png')");

window.onresize = resizingUI;

setupGame();

//adjustMoney - changes players money depending on round result and bet
function adjustMoney(answer)  {    
    if("YOU-WON" == answer) {
        pMoney += pBet*(betMultiplier*2);
    }
    else if("YOU-LOSE" == answer)   {
        pMoney -= pBet*betMultiplier;
    }
    localStorage['pm'] = pMoney.toString();
}

//raiseBet - increments bet multiplier and redisplays money
function raiseBet() {    
    ++betMultiplier;
    displayCards(playersHand, "playercards", numberToCard);
    drawButton();
}

//displayMoney - displays players money and bet amount
function displayMoney()    {
    var style = "<p style=\"text-align: center; color: rgb(255, 228, 0); font-size: 2em; -webkit-text-stroke: 1.5px black;\">";
    var html = style + "BET: $" + pBet*betMultiplier + "</p>";
    document.getElementById("playertext").innerHTML  = "Player:  $" + (pMoney);
    document.getElementById("playerbet").innerHTML  = html;
}

//resizingUI - when resizing window makes sure to display correct ui elements
function resizingUI()   {
    if(!roundButton)    {
        drawButton();
    }
    else{
        newRoundButton(result);
    }
    if(window.innerWidth >= 800)    {
        $('body').css("background-image", "url('images/decks/" + deckStyle + "priority.png')");
    }
    else{
        $('body').css("background-image", "none");
    }
}

//setupGame - sets core game components to be ready for starting game
function setupGame()    {
    betMultiplier = 1;
    if(pMoney < 10)
        pBet = 1;
    else
        pBet = parseInt(pMoney/10);
    roundButton = false;
    draw = 0;
    deck = resetDeck();
    result = setHand(5, deck);
    dealersHand = result[0];
    deck = result[1];

    result = setHand(5, deck);
    playersHand = result[0];
    deck = result[1];

    displayCards([0,0,0,0,0], "dealercards", numberToCard);
    displayCards(playersHand, "playercards", numberToCard);
    drawButton();
}

//newRoundButton - clicking button starts new round
function newRoundButton(answer)    {
    var style = "style=\"cursor: pointer; max-width: 60%; margin-left: 20%;\""
    if(window.innerWidth < 800) {
        style = "style=\"cursor: pointer; max-width: 100%;\""
    }
    document.getElementById("playertext").innerHTML  = "Player:  $" + pMoney;
    var buttonHtml = "<img src=\"images/ui/button-" + answer + ".png\" onclick=\"setupGame()\" " + style + "></img>";
    document.getElementById("playerbutton").innerHTML  = buttonHtml;
}

//compareMatches - returns if the player won or lost through matches
function compareMatches(pvalue, dvalue)   {
    if(pvalue > dvalue) {
        return 'YOU-WON';
    }
    else if(pvalue < dvalue)    {
        return 'YOU-LOSE';
    }
    else    {
        return 'TIE';
    }
}

//whoWon - returns the player result by comparing matches
function whoWon(pmatches, dmatches) {
    console.log('----whoWon----');
    console.log(dmatches);
    console.log(pmatches);
    //makes sure there is at least 1 match
    if(pmatches.length > 0 && dmatches.length == 0) {
        return 'YOU-WON';
    }
    else if(pmatches.length == 0 && dmatches.length > 0)    {
        return 'YOU-LOSE';
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
                return 'YOU-WON';
            }
            else if(pmatches.length == 1 && dmatches.length > 1)    {
                return 'YOU-LOSE';
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
    //player cannot draw cards after hold
    ++draw;
    if(draw == 1)   {
        newDealerHand();
    }
    //sort for easier to see matches after round
    dealersHand.sort();
    playersHand.sort();
    displayCards(dealersHand, "dealercards", numberToCard);
    displayCards(playersHand, "playercards", numberToCard);

    var i, pmatch, dmatch, dmatches = [], pmatches = [], playerDict = {}, dealerDict = {};

    //finds all matches for player and dealer
    for(i=0; i<dealersHand.length; ++i) {
        if(dealersHand[i] in dealerDict)    {
            ++dealerDict[dealersHand[i]];
            dmatch = dealerDict[dealersHand[i]];
            //if reaching end of dealer hand or there are no more matches for this card
            if(i+1 >= dealersHand.length || dealersHand[i] != dealersHand[i+1]) {
                if(!dmatches.length || dmatch > dmatches[0][0] || 
                    (dmatch == dmatches[0][0] && dealersHand[i] > dmatches[0][1]))    {
                    dmatches.unshift([dmatch, dealersHand[i]]);
                }
                else{
                    dmatches.push([dmatch, dealersHand[i]]);
                }
            }
        }
        else    {
            dealerDict[dealersHand[i]] = 1;
        }

        if(playersHand[i] in playerDict)    {
            ++playerDict[playersHand[i]];
            //if reaching end of player hand or there are no more matches for this card
            if(i+1 >= playersHand.length || playersHand[i] != playersHand[i+1]) {
                pmatch = playerDict[playersHand[i]];
                if(!pmatches.length || pmatch > pmatches[0][0] ||
                    (pmatch == pmatches[0][0] && playersHand[i] > pmatches[0][1]))    {
                    pmatches.unshift([pmatch, playersHand[i]]);
                }
                else{
                    pmatches.push([pmatch, playersHand[i]]);
                }
            }
        }
        else    {
            playerDict[playersHand[i]] = 1;
        }
    }

    result = whoWon(pmatches, dmatches);
    console.log(result);

    adjustMoney(result);

    roundButton = true;
    newRoundButton(result);
}


//newDealerHand - checks for non matches and redraws those cards
function newDealerHand()    {
    dHandBackup = [...dealersHand];
    var i, draw, card, dealerDict = {};

    //card selection algorithm O(N)
    for(i=0; i<dealersHand.length; ++i) {
        card = dealersHand[i];
        if(card in dealerDict && dealersHand[dealerDict[card]] == -1)    {
            //if there is a match undo card select for redraw
            dealersHand[dealerDict[card]] = dHandBackup[dealerDict[card]];
        }
        else{
            dealerDict[card] = i;   //remember card index in case there is a match
            dealersHand[i] = -1;    //-1 = select to redraw
        }
    }

    //drawing new cards
    for(i=0; i<dealersHand.length; ++i)    {
        if(dealersHand[i] == -1)    {
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
    newDealerHand();
    //displayCards(dealersHand, "dealercards", numberToCard);
    displayCards(playersHand, "playercards", numberToCard);
    drawButton();
}

//drawButton - displays clickable button to hold / draw for player
function drawButton()   {
    var buttonHtml, style = "style=\"cursor: pointer; max-width: 60%; margin-left: 20%;\""
    if(!draw && betMultiplier < 5 && window.innerWidth > 800)   {
        style = "style=\"cursor: pointer; max-width: 60%; margin-left: 14%;\"";
    }
    else if(window.innerWidth < 800) {
        style = "style=\"cursor: pointer; max-width: 100%;\""
    }
    if(checkForSelection(playersHand, playersHand.length))  {
        buttonHtml  = "<img src=\"images/ui/button-draw.png\" onclick=\"newHand()\" " + style + "></img>";
    }
    else    {
        buttonHtml  = "<img src=\"images/ui/button-hold.png\" onclick=\"determineWinner()\" " + style + "></img>";
    }
    if(!draw && betMultiplier < 5)   {
        if(window.innerWidth < 800) {
            style = "style=\"cursor: pointer; max-width: 40%;\"";
        }
        else
            style = "style=\"cursor: pointer; max-width: 25%;\"";
        buttonHtml += "<img src=\"images/ui/button-bet.png\" onclick=\"raiseBet()\" " + style + "></img>";
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
    //if player has no selected cards
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
        cardType = deckStyle + numberToCard[cards[i]];
        cardImgs += "<img src=\"images/decks/" + cardType + "\"";
        if(id == "playercards" && draw == 0) {
            flipOnClick = " onclick=\"flipCard(" + i + ")\" style=\"cursor: pointer;\"></img>";
            cardImgs += flipOnClick;
        }
        else    {
            cardImgs += "></img>";
        }
    }
    if(id == "playercards") {
        displayMoney();
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