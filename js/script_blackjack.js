$(function(){
    let deckID;
    let points=0;
    let cardArray;
    let printToHtml="";
    let cardTable=$('#bj_cards');
    let btn_option=$('.optionalButton');
    let newCard;
    let result;
    
    //start game
    $('#open_bj').on('click', function(){
        $(this).fadeOut();
        $('.loading2').fadeIn('slow').delay(800).fadeOut('slow');
        $('.after_loading2').delay(2000).fadeIn();
    }).on('click', function(){
        $.ajax({
            method: 'GET',
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            dataType: 'json'
        })
        .done(getDeckId)
        .done(drawTwoCards);
    });
    
    
    let getDeckId=(res)=>{
        deckID=res.deck_id;
        return deckID;
    };
    
    let drawTwoCards=()=>{
        let drawTwoUrl=`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`;
        $.ajax({
            method: 'GET',
            url: drawTwoUrl,
            dataType: 'json'
        })
        .done(showHand)
        .done(countPoint);
    };

    let showHand=(res)=>{
        cardArray=res.cards;
        cardArray.map(card=>{
            printToHtml+=`<figure>
                            <img class="bj_img" src="${card.image}" alt="${card.code}">
                        </figure>`;
            console.log(printToHtml);
        });
        cardTable.hide().delay(1000).html(printToHtml);
        
        //Show Buttons at the same time
        let buttons=`<input class="btn btn-default" id="btn_drawone" type="button" value="Add One More Card">
                    <input class="btn btn-info" id="btn_done" type="button" value="Done">`;
        btn_option.hide().delay(1200).html(buttons);
        //Button functions
        $('#btn_drawone').on('click', drawOneMore);
        $('#btn_done')
        .on('click', showResult)
        .on('click', function(){
            $('#reload_bj').delay(2000).fadeIn('slow');
        })
    };
    
    $('#reload_bj').on('click', function(){
        location.reload(false);
    });
    
    //If the player has added cards, these functions should be called
    let drawOneMore=()=>{
        let drawOneUrl=`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
        $.ajax({
            method: 'GET',
            url: drawOneUrl,
            dataType: 'json'
        })
        .done(res=>{
            newCard=res.cards[0];
            cardArray.push(newCard);
            return cardArray;
        })
        .done(showFinalCards)
        .done(countFinalPoint);
    };
    
    let showFinalCards=()=>{
            let appendNew=`<figure>
                            <img class="bj_img" src="${newCard.image}" alt="${newCard.code}">
                        </figure>`;
        cardTable.append(appendNew);
    };
    
    let countPoint=()=>{
        cardArray.map(item=>{
            if(isNaN(item.value)){
                if (item.value==="ACE"){
                    points+=1;
                }else if(item.value==="JACK"){
                    points+=10;
                }else if(item.value==="QUEEN"){
                    points+=10;
                }else if(item.value==="KING"){
                    points+=10;
                }
            }else{
                points+=Number(item.value);
            };
            //Saving result message depending on player's score
            if(points===21){
                result='BLACKJACK';
            }else if(points>=22){
                result='Bust';
            } else {
                result=points;
            };
        });
    };
    
    let countFinalPoint=()=>{
        //Replacing picture cards with values and counting the score
        if(isNaN(newCard.value)){
            if (newCard.value==="ACE"){
                    points+=1;
            }else if(newCard.value==="JACK"){
                points+=10;
            }else if(newCard.value==="QUEEN"){
                points+=10;
            }else if(newCard.value==="KING"){
                points+=10;
            }
        }else{
            points+=Number(newCard.value);
        };  
        //Saving result message depending on player's score
        if(points===21){
           result='BLACKJACK';
        }else if(points>=22){
            result='Bust';
        } else {
            result=points;
        };
    };
    
    let showResult=()=>{
       $('.optionalButton, #bj_cards').fadeOut();
        $('#bj_counter').html(result).delay(700).fadeIn('slow');
    };
        
});