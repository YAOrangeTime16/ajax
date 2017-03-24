(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function(){
    let deckID;
    let deckUrl;
    let cardsHTML="";
    let cardsArray;
    let getValue;
    let howManyChange;
    let discardPile;
    let finalCardsArray;
    let adjustedArray;
    let yourResult;
    
    //start a poker game
    //Get deck ID... in this case 1 deck is used for each play
    $('#start').on('click', function(){
        $(this).hide('slow');
        $('.loading3').fadeIn('slow').delay(800).fadeOut('slow');
        $('.after_loading3, #reload2').delay(1500).fadeIn();
    }).on('click', function(){
        $.ajax({
            method: 'GET',
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            dataType: 'json'
        })
        .done(playersHand)   //Second AJAX call
        .fail(err=>err);
    });
    
    //Reload the page from the chache
    $('#reload2').on('click', function(){
        location.reload(false);
    })

    //Draw five cards
    let playersHand=response=>{
        deckID=response.deck_id;
        deckUrl=`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=5`;
        $.ajax({
            method: 'GET',
            url: deckUrl,
            dataType: 'json'
        }).done(showPlayersHand)
        .fail(err=>err);
    };

    let showPlayersHand=res=>{
        cardsArray=res.cards;
        cardsArray.map(card=>{
            cardsHTML+=`<div class="col-xs-2 col-sm-2 col-md-2">
                            <label for="${card.code}">
                                <img class="poker_img" src='${card.image}' alt='${card.code}'></img>
                                <input id="${card.code}" type="checkbox" class="checkbox"  value="${card.code}">
                            </label>
                        </div>`;
            $('#poker_cards').html(cardsHTML);
        });
        //Add a button to html
        let buttonToChange=`<input id="check_btn" type="button" value="Draw" class="btn btn-success">`;
        $('#btn_exchange').html(buttonToChange);
        $('#check_btn')
        .on('click', checkSelectedCards)
        .on('click', discardCards)
        .on('click', addToDiscardPile)//Another AJAX call
        .on('click', drawFinalHand); //Another AJAX call
    };

    let checkSelectedCards=function(){
        let check=$.makeArray($('.checkbox'));
        getValue=check
            .filter(card=>card.checked)
            .map(selected=>selected.id);
        return getValue;
    };
    
    //discard the selected cards
    let discardCards=()=>{
        //remove selected cards from the "playershand"
        //add them to the "discard" pile as well
        let checkHowMany=cardsArray.length;
        getValue.map(val=>{
            for(let i=cardsArray.length-1; i>=0; i--){
                if(cardsArray[i].code==val){
                    cardsArray.splice(i,1);
                };
            };
            return cardsArray;
        })
        howManyChange=checkHowMany-cardsArray.length;
        console.log(`swapping ${howManyChange} cards`);
    };
    
    //Add discarded cards to the "discard" pile
    //<<base URL>>/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=<<Cards' codes>>
    let addToDiscardPile=()=>{
        let cardParam=getValue.join(',');
        let pileUrl=`https://deckofcardsapi.com/api/deck/${deckID}/pile/discard/add/?cards=${cardParam}`;
        discardPile=$.ajax({
            method: 'GET',
            url: pileUrl,
            dataType: 'json'
        })
        .done(res=>res)
        .fail(err=>err);
    };
    
    //Final AJAX call
    let drawFinalHand=()=>{
        //draw new cards as many as discarded cards
        deckUrl=`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${howManyChange}`;
        $.ajax({
            method: 'GET',
            url: deckUrl,
            dataType: 'json'
        })
        .done(getFinalHand)//get the player's final hand
        .done(adjustValueToPokerApi)//Adjusting the values to pokersolver API
        .done(showFinalHand)//send final hand to HTML
        .fail(err=>err);
    };
    
    //get the player's final hand
    let getFinalHand=function(res){
        let responseArray=res.cards;
        finalCardsArray=cardsArray.concat(responseArray);
        return finalCardsArray;
    };
    
    //send final hand to HTML
    let showFinalHand=res=>{
        cardsHTML="";
        //Sorting cards
        //ref: http://webdrawer.net/javascript/jssort.html (Japanese site)
        finalCardsArray.sort((a,b)=>{
            let aCode=a.code;
            let bCode=b.code;
            if(aCode<bCode)return -1;
            if(aCode>bCode)return 1;
            return 0;
        });
        
        finalCardsArray.map(card=>{
            cardsHTML+=`<div class="col-xs-2 col-sm-2 col-md-2">
                            <img class="poker_img" src='${card.image}' alt='${card.code}'></img>
                        </div>`;
            $('#poker_cards').html(cardsHTML);
        });
        //A button to be added to the final hand
        let buttonForResult=`<input id="result_btn" type="button" value="Result" class="btn btn-success">`;
        $('#btn_exchange').html(buttonForResult);
        
        $('#result_btn').on('click', function(){
            $(this).hide();
        })
            .on('click', getResult)
            .on('click', printResult);
    };
    
    //Adjusting the values to pokersolver API
    let adjustValueToPokerApi=()=>{
        adjustedArray=finalCardsArray.map(card=>{
            if(card.code==="0S"){
                card.code="TS";
            }else if(card.code==="0H"){
                card.code="TH";
            }else if(card.code==="0D"){
                card.code="TD"; 
            }else if(card.code==="0C"){
                card.code="TC"; 
            };
            return card.code;
        });
        return adjustedArray;
    };
    
    let getResult=()=>{
        let hand = Hand.solve(adjustedArray);
        yourResult=hand.name;
        return yourResult;
    };
    
    let printResult=()=>{
        $('#pk_result').hide().delay(800).html(yourResult).fadeIn('slow');
    };
});



//To change "prevObject" to an array
// http://qiita.com/kazu56/items/0d49adc864bed0ed4fa2 (Japanese Site)
//$.makeArray();
},{}]},{},[1]);
