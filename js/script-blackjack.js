$(function(){
    let deckID;
    let points=0;
    let cardArray;
    let printToHtml="";
    let cardTable=$('#bj-cards');
    let btn_option=$('.optionalButton');
    let newCard;
    let result;
    
/*================
  First AJAX call
  ================*/
    $('#open-bj').on('click', function(){
        $(this).fadeOut();
        $('.loading2').fadeIn('slow').delay(800).fadeOut('slow');
        $('.after-loading2').delay(2000).fadeIn();
    }).on('click', function(){
        $.ajax({
            method: 'GET',
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            dataType: 'json'
        })
        .done(getDeckId)
        .done(drawTwoCards)
        .fail(err=>err);
    });
    
    let getDeckId=res=>{
        deckID=res.deck_id;
        return deckID;
    };
    
    let setUrl=(id, numberOfCards)=>{
        return `https://deckofcardsapi.com/api/deck/${id}/draw/?count=${numberOfCards}`;
    };
    
    let setCardImage=cardObject=>{
        return `<figure>
                    <img class="bj-img" src="${cardObject.image}" alt="${cardObject.code}">
                </figure>`;
    };
    
/*================
  Second AJAX call
  ================*/
    
    //Draw cards based on the "deckID"
    let drawTwoCards=()=>{
        let drawTwoUrl=setUrl(deckID, 2);
        $.ajax({
            method: 'GET',
            url: drawTwoUrl,
            dataType: 'json'
        })
        .done(showHand)
        .done(addButtons)
        .done(countPoint)
        .fail(err=>err);
    };

    let showHand=res=>{
        cardArray=res.cards;
        cardArray.map(card=>{
            printToHtml+=setCardImage(card);
            return printToHtml;
        });
        cardTable.hide().delay(1200).fadeIn().html(printToHtml); 
    };
    
    let addButtons=()=>{
        //Show Buttons under player's hand
        let buttons=`<input class="btn btn-default" id="btn-drawone" type="button" value="Add One More Card">
                    <input class="btn btn-info" id="btn-done" type="button" value="Done">`;
        btn_option.hide().delay(1200).html(buttons);
        //Functions of the above buttons
        $('#btn-drawone')
            .on('click', drawOneMore);
        $('#btn-done')
            .on('click', showResult)
            .on('click', function(){
                $('#reload-bj').delay(2000).fadeIn('slow');
            });
    };
    
    let countPoint=()=>{
        cardArray.map(item=>{
            if(isNaN(item.value)){
                if (item.value==="ACE"){
                    points+=11;
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
    
    
/*================
  Third AJAX call
  ================*/
    //If the player adds a card, these functions should be called
    let drawOneMore=()=>{
        let drawOneUrl=setUrl(deckID, 1);
        $.ajax({
            method: 'GET',
            url: drawOneUrl,
            dataType: 'json'
        })
        .done(getFinalHand)
        .done(showFinalCards)
        .done(countFinalPoint);
    };
    
    let getFinalHand=res=>{
        newCard=res.cards[0];
        cardArray.push(newCard);
        return cardArray;
    };
    
    let showFinalCards=()=>{
        cardTable.append(setCardImage(newCard));
    };
    
    let countFinalPoint=()=>{
        //Replacing picture cards with values and counting the score
        if(isNaN(newCard.value)){
            if (newCard.value==="ACE"){
                    points+=11;
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
           result='Blackjack';
        }else if(points>=22){
            result='Bust';
        } else {
            result=points;
        };
    };
    
    let showResult=()=>{
       $('.optionalButton, #bj-cards').fadeOut();
        $('#bj-counter').html(result).delay(700).fadeIn('slow');
    };
    
    //Reload the page
    $('#reload-bj').on('click', function(){
        location.reload(false);
    });
        
});