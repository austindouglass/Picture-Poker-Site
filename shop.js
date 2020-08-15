
//Copyright 2020, Austin Douglass, all rights reserved.

//remember to store purchased decks!

var decksOwned = ["default"], currentDeck = localStorage['dstyle'] || "default";
var pMoney = 1000; //parseInt(localStorage['pm']) || 0;
var allDecks = ["numbers"]; //every deck in the game (except default)
var deckCost = {"default" : 0, "numbers" : 100};


document.getElementById("playermoney").innerHTML = "Your Money: $" + pMoney.toString();
displayShop();
displayPlayerDecks();

//player clicked to buy a deck
function buyDeck(newDeck)    {
    if(pMoney < deckCost[newDeck])  {
        window.alert("You don't have enough money to purchase this item!")
        return;
    }
    pMoney -= deckCost[newDeck];
    //localStorage['pm'] = pMoney.toString();
    document.getElementById("playermoney").innerHTML = "Your Money: $" + pMoney.toString();
    decksOwned.push(newDeck);
    displayShop();
    displayPlayerDecks();
}

//shows decks available for purchase
function displayShop()  {
    var html = "", style = "style=\"cursor: pointer;\"";
    for(i=0; i<allDecks.length; ++i)    {
        if(!decksOwned.includes(allDecks[i]))   {
            html += "<img src=\"images/decks/shop/" + allDecks[i] + "-buy.png\" onclick=\"buyDeck('";
            html += allDecks[i] + "')\" " + style + "></img>";
        }
        else    {
            html += "<img src=\"images/decks/shop/" + allDecks[i] + "-purchased.png\"></img>";
        }
    }
    document.getElementById("dailyshop").innerHTML = html;
}

//equips the deck clicked on by player in your decks section
function changeCurrentDeck(newDeck)   {
    currentDeck = newDeck;
    displayPlayerDecks();
    localStorage['dstyle'] = newDeck;
}

//shows your decks
function displayPlayerDecks()   {
    var i, html = "", style = "style=\"cursor: pointer;\"";
    for(i=0; i < decksOwned.length; ++i) {
        if(decksOwned[i] != currentDeck) {
            html += "<img src=\"images/decks/shop/" + decksOwned[i] + "-use.png\" onclick=\"changeCurrentDeck('";
            html += decksOwned[i] + "')\" " + style + "></img>";
        }
        else    {
            html += "<img src=\"images/decks/shop/" + decksOwned[i] + "-in-use.png\"></img>";
        }
    }
    //console.log(html);
    document.getElementById("playerdecks").innerHTML = html;
}

