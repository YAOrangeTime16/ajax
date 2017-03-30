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
    
    $('.btn-up').on('click', function(){
        $('html,body').animate({ scrollTop: 0 },'fast');
    });
    
    $('.btn-down').on('click', function(){
        let toNext=$(this).offset().top;
        $('html,body').animate({ scrollTop: toNext + 90},'fast');
    });
    
});