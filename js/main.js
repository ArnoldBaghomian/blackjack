'use strict'
var sum = 0;


var deck = [];
var playerHand = [];
var dealerHand = [];
var playerCount = 0;
var playerAcesCount = 0;
var dealerCount = 0;
var dealerAcesCount = 0;
var transparentCard = 'cards/transparentCard.png';
var cardBack = 'cards/cardBack.png';
$(document).ready(play());


function play()
{
    init();
}




function init() {
    $('#Deal').on('click', dealPlayer);
    $('#Hit').on('click', hitPlayer);
    $('#Hit').hide();
    $('#Stand').on('click', standPlayer);
    ClearDealerHand();
    ClearPlayerHand();
    makeDeck();
}

function makeDeck()
{
    var suits = ['C','D','H','S']; // codes for the suits

    for(var i = 0; i < 52; ++i)
    {
        var e = {};  // make the next card
        e.suit = Math.floor(i/13);  // 0 = clubs, 1 = diamonds, 2 = hearts, 3 = spades
        e.pips = i%13 + 2;   // 0 .. 10 = value, 11 = j, 12 = q, 13 = k, 14 = A
        e.value = (i%13 > 9) ? 10 : i%13+2;  // point value of card
        if (e.pips===14)  // aces count for 11
            e.value = 11;
        e.url = "cards/"+(i%13).toString() + suits[e.suit]+".png";  // cards are images with simple file names
        e.dealt = false;  // 0 = not dealt, 1 = dealt
        deck.push(e);  // add card to deck

    };



}

function resetGame()  // mark all the cards not used
{
    deck.forEach(function(c)   // put all the cards back in the deck
    {
        c.used = false;
    });
    playerHand = []; // empty both hands
    dealerHand = [];
    clearDealerHand();
    clearPlayerHand();
}

function pickCard()   // pick a random card that has not been already dealt this hand
{
    do {
        var i = Math.floor(Math.random() * deck.length);
    } while (deck[i].dealt);

    deck[i].dealt = true;
    return deck[i];

}



function hitDealer()
{
    dealerHand.push(pickCard());

    if (dealerHand[dealerHand.length-1].pips === 14)  // it's an ace
        dealerAcesCount++;

    var image = $("table").find('tr:nth-child(2)').find('img').eq(dealerHand.length-1);//.setAttribute('src',dealerHand[dealerHand.length-1].url);

    if(dealerHand.length === 1)
       image[0].setAttribute('src',cardBack);
    else
       image[0].setAttribute('src',dealerHand[dealerHand.length-1].url);



    dealerCount = count(dealerHand);
    var acesCount = dealerAcesCount;
    while(dealerCount > 21 && acesCount > 0)   // aces can be one if need be
    {
        acesCount--;
        dealerCount -= 10;
    }

    if(dealerHand.length > 2)
    {
        if (dealerCount <= 21)
            $("#dealerCount").text("Dealer count is " + dealerCount);

        else
            $("#dealerCount").text("Dealer is bust " + dealerCount);
    }


}

function flipDealersCard()
{
    var image = $("table").find('tr:nth-child(2)').find('img').eq(0);
    image[0].setAttribute('src',dealerHand[0].url);

}

function delay(ms) {
    ms += new Date().getTime();
    var ms2 = new Date().getTime()
    while (ms2 < ms){
         ms2 = new Date().getTime();

    }
}


function hitPlayer(event)
{
    playerHand.push(pickCard());


    if (playerHand[playerHand.length-1].pips === 14)  // it's an ace
        playerAcesCount++;

    var image = $("table").find('tr:nth-child(4)').find('img').eq(playerHand.length-1);

    image[0].setAttribute('src',playerHand[playerHand.length-1].url);
    playerCount = count(playerHand);
    var acesCount = playerAcesCount;
    while(playerCount > 21 && acesCount > 0)   // aces can be one if need be
    {
        acesCount--;
        playerCount -= 10;
    }
    $("#playerCount").text("Player count is "+ playerCount);
    if(playerCount>21) {
        $("#playerCount").text("Player is bust " + playerCount);
        standPlayer(event);
    }

}

function dealPlayer(event)
{
    $(event.target).hide();
    $('#Hit').show();
    hitPlayer();
    hitDealer();
    hitPlayer();
    hitDealer();

}


function count(hand)
{
    return hand.reduce( function(prev,c)
    {
        return prev+ c.value;

    },0);

}


function ClearDealerHand() {
    $("table").find('tr:nth-child(2)').find('img').each(function () {


            $(this).attr('src',transparentCard);

    });
}

function ClearPlayerHand() {
    $("table").find('tr:nth-child(4)').find('img').each(function () {


        $(this).attr('src',transparentCard);

    });
}





function standPlayer(event)
{
    $('#Deal').hide();
    $('#Hit').hide();
    $('#Stand').hide();
    while(dealerCount<17) {
        hitDealer();
    }
    flipDealersCard();

    // have to update dealers score in case he won in 2 cards
    if (dealerCount <= 21)
        $("#dealerCount").text("Dealer count is " + dealerCount);

    else
        $("#dealerCount").text("Dealer is bust " + dealerCount);

    displayWinner();
}

function displayWinner()
{
    var announce = "";
    if (playerCount <= 21 && dealerCount > 21 )
     announce = "Player wins";
    else if (playerCount > 21 && dealerCount <= 21 )
        announce = "Dealer wins";
    else if (playerCount > 21 && dealerCount > 21)
        announce = "Draw";
    else if (playerCount > dealerCount )
        announce = "Player wins";
    else if (playerCount < dealerCount )
        announce = "Dealer wins";
    else
        announce = "Draw";

    $("#title").text(announce);
}


