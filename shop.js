
//Copyright 2020, Austin Douglass, all rights reserved.

if(localStorage['dOwned'] == null) {
    localStorage["dOwned"] = "default";
}

var decksOwned = localStorage['dOwned'].split(","), currentDeck = localStorage['dstyle'] || "default";
var pMoney = parseInt(localStorage['pm']) || 0;
var deckCost = {"numbers" : 100, "quarantine" : 1000, "dog" : 10000,
                "animals" : 25000, "detective" : 50000, "egypt" : 75000,  "retro" : 100000, 
                "aliens" : 250000, "hiphop" : 500000, "winner" : 1000000};
var allDecks = Object.keys(deckCost);


document.getElementById("playermoney").innerHTML = "Your Money: $" + addCommas(pMoney.toString());
removeDecks();
displayShop();
displayPlayerDecks();

//adds commas to a string of numbers
function addCommas(money)   {
    if(money.length < 4)
        return money;
    var i, counter = 0;
    for(i = money.length-1; i >= 0; --i) {
        ++counter;
        if(counter-1 == 3)  {
            money = money.slice(0, i+1) + "," + money.slice(i+1);
            counter = 1;
        }
    }
    return money;
}

//removes decks that have previously been purchased
function removeDecks () {
    var i;
    for(i = 0; i < decksOwned.length; ++i)    {
        if(allDecks.includes(decksOwned[i])) {
            allDecks.splice(allDecks.indexOf(decksOwned[i]), 1);
        }
    }
}

//player clicked to buy a deck
function buyDeck(newDeck)    {
    if(pMoney < deckCost[newDeck])  {
        window.alert("You don't have enough money to purchase this item!");
        return;
    }
    pMoney -= deckCost[newDeck];
    localStorage['pm'] = pMoney.toString();
    document.getElementById("playermoney").innerHTML = "Your Money: $" + addCommas(pMoney.toString());
    localStorage['dOwned'] += "," + newDeck;
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
    document.getElementById("playerdecks").innerHTML = html;
}