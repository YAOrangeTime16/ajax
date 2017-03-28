//API "Deck of Card": 'https://deckofcardsapi.com/'
$(function(){    
    let cardInfoObject;
    let card1=$('#card1');
    let card2=$('#card2');
    let cardArray;
    let cardOne;
    let cardTwo;
    let points=0;
    let click;
    let num=5;   //for the limited click number
    
    //API
    $('#open').on('click', function(){
     $('.loading1').fadeIn('slow').delay(500).fadeOut('slow');
    }).on('click', function(){
        $.ajax({
                method: 'GET',
                dataType: 'json',
                url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=2'
        })
        .then(getCards)
        .then(showCards)
        .then(addPoints)
        .then(showFinalScore)
        .fail(err=>err);
    })
        //count the click number 5 down to 0
        .on('click', function(){
            $(this).data('click', --num);
            $('#open').html(`<span class="badge"> ${num}</span> DRAW CARDS`);
            //check the number of clicks
            click=$(this).data('click');
            //when clicks have happend 5 times, the game is over
            //collaborate with "showFinalScore" function
            if(click===0){
                $(this).fadeOut();
                $('#reload').delay(3000).fadeIn('fast');
            };
            }
        );
    
    //Reload the page from the chache
    $('#reload').on('click', function(){
        location.reload(false);
    })
    
    //FUNCTION DEFINITIONS
    let getCards=(json)=>{
        cardInfoObject=json;
        cardOne=cardInfoObject.cards[0];
        cardTwo=cardInfoObject.cards[1];
        return;
    };
    
    let showCards=()=>{
        card1.hide().delay(1500).fadeIn('slow')
            .html(`<figure id="c1Fig" class="col-md-12">
                    <img class="card-img" src=${cardOne.image} alt="${cardOne.code}">
                    <figcaption>
                        <p class="label label-default">${cardOne.suit}</p>
                        <p class="label label-info">${cardOne.value}</p>
                    </figcaption>
                    </figure>`);
        card2.hide().delay(1500).fadeIn('slow')
            .html(`<figure id="c2Fig" class="col-md-12">
                    <img class="card-img" src=${cardTwo.image} alt="${cardTwo.code}">
                    <figcaption>
                        <p class="label label-default">${cardTwo.suit}</p>
                        <p class="label label-info">${cardTwo.value}</p>
                    </figcaption>
                    </figure>`);
    }
    
    let addPoints = ()=>{
        if(cardOne.value===cardTwo.value){
            points+=30;
            $('#message').hide().delay(1500).fadeIn('slow')
                .html("30 points");
        } else if(cardOne.suit===cardTwo.suit){
            points+=10;
            $('#message').hide().delay(1500).fadeIn('slow')
                .html("10 points");
        } else if(cardOne.value!==cardTwo.value){
            points+=1;
            $('#message').hide().delay(1500).fadeIn('slow')
                .html("1 point");
        }
        return points;
    };
    
    let showFinalScore=(score)=>{
       if(click===0){  
            $('#counter').hide().delay(2500).fadeIn('slow').html(score);
            $('#card1, #card2, #message').delay(500).fadeOut('slow');
        }
    };
});