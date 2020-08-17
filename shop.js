
//Copyright 2020, Austin Douglass, all rights reserved.

//remember to store purchased decks!

var decksOwned = ["default"], currentDeck = localStorage['dstyle'] || "default";
var pMoney = 2500000; //parseInt(localStorage['pm']) || 0;
//every deck in the game (except default)
// var allDecks = ["numbers", "quarantine", "dog", "animals", "detective", "egypt", "retro",
//                 "aliens", "hiphop", "winner"];
var deckCost = {"numbers" : 100, "quarantine" : 1000, "dog" : 10000,
                "animals" : 25000, "detective" : 50000, "egypt" : 75000,  "retro" : 100000, 
                "aliens" : 250000, "hiphop" : 500000, "winner" : 1000000};
var allDecks = Object.keys(deckCost);


document.getElementById("playermoney").innerHTML = "Your Money: $" + pMoney.toString();
displayShop();
displayPlayerDecks();

//removes decks that have previously been purchased
function removeDecks () {
    
}

//player clicked to buy a deck
function buyDeck(newDeck)    {
    if(pMoney < deckCost[newDeck])  {
        window.alert("You don't have enough money to purchase this item!");
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
    var html = "", style = "style=\"cursor: pointer;\"", i;
    for(i=0; i<allDecks.length; ++i)    {
        if(!decksOwned.includes(allDecks[i]))   {
            html += "<div class='decks'><img src=\"images/decks/shop/" + allDecks[i] + "-buy.png\" onclick=\"buyDeck('";
            html += allDecks[i] + "')\" " + style + "></img></div>";
        }
        else    {
            html += "<div class='decks'><img src=\"images/decks/shop/" + allDecks[i] + "-purchased.png\"></img></div>";
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
            html += "<div class='decks'><img src=\"images/decks/shop/" + decksOwned[i] + "-use.png\" onclick=\"changeCurrentDeck('";
            html += decksOwned[i] + "')\" " + style + "></img></div>";
        }
        else    {
            html += "<div class='decks'><img src=\"images/decks/shop/" + decksOwned[i] + "-in-use.png\"></img></div>";
        }
    }
    //console.log(html);
    document.getElementById("playerdecks").innerHTML = html;
}

