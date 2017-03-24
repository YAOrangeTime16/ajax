//API "Deck of Card": 'https://deckofcardsapi.com/'
$(function(){
    $('#rules').on('click', function(){
        let toRules=$('.content_rule').offset().top;
        $('html, body').animate({scrollTop: toRules}, 'fast');
    });
    
    $('#games').on('click', function(){
        $('#block_of_gamelist').slideToggle(200);
    });
        
    $('#g1, #anchor_g1').on('click', function(){
        let toGetter=$('#getter').offset().top;
        $('html, body').animate({scrollTop:toGetter}, 'fast');
    });
    
    $('#g2, #anchor_g2').on('click', function(){
        let toTwentyone=$('#twentyone').offset().top;
        $('html, body').animate({scrollTop: toTwentyone}, 'fast');
    });
    
    $('#g3, #anchor_g3').on('click', function(){
        let toFivecard=$('#fivecard').offset().top;
        $('html, body').animate({scrollTop:toFivecard}, 'fast');
    });
    
    let cardInfoObject;
    let card1=$('#card1');
    let card2=$('#card2');
    let cardArray;
    let cardOne;
    let cardTwo;
    let points=0;
    let pointDisplay=$('#counter');
    let click;
    let num=5;
    
    
    //API
    $('#open').on('click', function(){
        $.ajax({
                method: 'GET',
                dataType: 'json',
                url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=2'
        })
        .then(getCards)
        .then(showCards)
        .then(addPoints)
        .then(showPoints);
    })
        //count the click number up to 5
        //after 5th click, the game is over and gained points should be displayed
        .on('click', function(){
        $(this).data('click', --num);
        $('#open').html(`<span class="badge"> ${num}</span> DRAW CARDS`);
        click=$(this).data('click');
        if(click===0){
            $(this).fadeOut();
            $('#card1, #card2, #message').delay(1100).fadeOut('slow', function(){
                $('#counter, #reload').fadeIn('slow');
            });
        }
        return;}
    );
    
    //Reload the page from the chache
    $('#reload').on('click', function(){
        location.reload(false);
    })
    
    //FUNCTION DEFINITIONS
    let getCards=function(json){
        cardInfoObject=json;
        cardOne=cardInfoObject.cards[0];
        cardTwo=cardInfoObject.cards[1];
        return;
    };
    
    let showCards=function(){
        card1.html(`<figure id="c1Fig">
                    <img class="card_img" src=${cardOne.image} alt="${cardOne.code}">
                    <figcaption>
                        <p class="label label-default">${cardOne.suit}</p>
                        <p class="label label-info">${cardOne.value}</p>
                    </figcaption>
                    </figure>`);
        card2.html(`<figure id="c2Fig">
                    <img class="card_img" src=${cardTwo.image} alt="${cardTwo.code}">
                    <figcaption>
                        <p class="label label-default">${cardTwo.suit}</p>
                        <p class="label label-info">${cardTwo.value}</p>
                    </figcaption>
                    </figure>`);
    }
    
    let addPoints = function(){
        if(cardOne.value===cardTwo.value){
            points+=30;
            $('#message').html("excellent!😆");
        } else if(cardOne.suit===cardTwo.suit){
            points+=10;
            $('#message').html("Good!😉");
        } else if(cardOne.value!==cardTwo.value){
            points+=1;
            $('#message').html("One Point😐");
        }
        return points;
    };
    
    let showPoints=function(yourPoint){
        pointDisplay.hide().delay(1000).html(yourPoint);
    };

});