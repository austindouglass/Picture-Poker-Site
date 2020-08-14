
//Copyright 2020, Austin Douglass, all rights reserved.

var deckTypes = ["default", "numbers"], currentDeck = localStorage['dstyle'] || "default";

displayPlayerDecks();

function changeCurrentDeck(newDeck)   {
    currentDeck = newDeck;
    displayPlayerDecks();
    localStorage['dstyle'] = newDeck;
}

function displayPlayerDecks()   {
    var i, html = "", style = "style=\"cursor: pointer;\"";
    for(i=0; i < deckTypes.length; ++i) {
        if(deckTypes[i] != currentDeck) {
            html += "<img src=\"images/decks/shop/" + deckTypes[i] + "-use.png\" onclick=\"changeCurrentDeck('";
            html += deckTypes[i] + "')\" " + style + "></img>";
        }
        else    {
            html += "<img src=\"images/decks/shop/" + deckTypes[i] + "-in-use.png\"></img>";
        }
    }
    //console.log(html);
    document.getElementById("playerdecks").innerHTML = html;
}

