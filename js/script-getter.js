//API "Deck of Card": 'https://deckofcardsapi.com/'
$(function(){    
    let cardInfoObject;
    let cardArray;
    let cardOne;
    let cardTwo;
    let points=0;
    let click;
    let num=5;   //for click limit
    
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
        //limit to 5 clikcs
        .on('click', function(){
                $(this).data('click', --num);
                $('#open').html(`<span class="badge"> ${num}</span> DRAW CARDS`);
                click=$(this).data('click');
                if(click===0){
                    $(this).fadeOut();
                    $('#reload').delay(4000).fadeIn('fast');
                };
            }
        );
    
    //Reload the page from the chache
    $('#reload').on('click', function(){
        location.reload(false);
    })
    
    //FUNCTION DEFINITIONS
    let getCards=(json)=>{
        cardInfoObject=json.cards;
        cardOne=cardInfoObject[0];
        cardTwo=cardInfoObject[1];
        return;
    };
    
    let showCards=()=>{
        let cardHtml=card=>{
            return `
            <figure class="figure-getter">
                    <img class="card-img" src=${card.image} alt="${card.code}">
                    <figcaption>
                        <p class="label label-default">${card.suit}</p>
                        <p class="label label-info">${card.value}</p>
                    </figcaption>
                    </figure>`;
        };
        let firstCard=cardHtml(cardOne);
        let secondCard=cardHtml(cardTwo);
        $('#cardTable-getter').hide().html(firstCard + secondCard).delay(1500).fadeIn('slow');
    };
        
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
            $('#counter').hide().html(score).delay(3500).fadeIn('slow');
            $('#message, #cardTable-getter').delay(500).fadeOut('slow');
        }
    };
});