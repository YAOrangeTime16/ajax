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
        $(this).delay(800).fadeOut('slow');
        $('.loading3').fadeIn('slow').delay(800).fadeOut('slow');
        $('#reload2').delay(1500).fadeIn();
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
    
    let getUrl=(id, how, numberOfCards)=>{
        return `https://deckofcardsapi.com/api/deck/${id}/${how}/?count=${numberOfCards}`;
    };
    
    //Draw five cards
    let playersHand=response=>{
        deckID=response.deck_id;
        deckUrl=getUrl(deckID, 'draw', 5);
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
            cardsHTML+=`<div class="col-xs-4 col-sm-4 col-md-2">
                            <label for="${card.code}">
                                <img class="poker-img" src='${card.image}' alt='${card.code}'></img>
                                <input id="${card.code}" type="checkbox" class="checkbox"  value="${card.code}">
                            </label>
                        </div>`;
            $('#poker-cards').html(cardsHTML).hide().delay(1000).fadeIn();
        });
        //Add a button to html
        let buttonToChange=`<input id="check-btn" type="button" value="Draw" class="btn btn-success">`;
        $('#btn-exchange').html(buttonToChange).hide().delay(1500).fadeIn();
        $('#check-btn')
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
        deckUrl=getUrl(deckID, 'draw', howManyChange);
        $.ajax({
            method: 'GET',
            url: deckUrl,
            dataType: 'json'
        })
        .done(getFinalHand)
        .done(adjustValueToPokerApi)
        .done(showFinalHand)
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
        finalCardsArray.sort((a,b)=>{
            let aCode=a.code;
            let bCode=b.code;
            if(aCode<bCode)return -1;
            if(aCode>bCode)return 1;
            return 0;
        });
        
        finalCardsArray.map(card=>{
            cardsHTML+=`<div class="col-xs-4 col-sm-4 col-md-2">
                            <img class="poker-img" src='${card.image}' alt='${card.code}'></img>
                        </div>`;
            $('#poker-cards').html(cardsHTML);
        });
    //A button to be added to the final hand
    let buttonForResult=`<input id="result-btn" type="button" value="Result" class="btn btn-success">`;
    $('#btn-exchange').html(buttonForResult);
    $('#result-btn').on('click', function(){
        $(this).hide();
        $('#poker-cards').fadeOut('fast');
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
        $('#pk-result').html(yourResult).hide().delay(1000).fadeIn('slow');
    };
});