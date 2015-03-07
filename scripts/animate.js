var isOpen = false;

var ANIMATE = function(){


    $('.btn').click(function(){
        // if sidebar is open, and clicked again
        if(isOpen){
        }
        else {
            $('.timeline').show(500)
            //$('.timeline').css("display", "flex");
            isOpen = true
        }
    });
    $('#close').click(function(){
        // if sidebar is open, and clicked again
        if(isOpen){
            $('.timeline').hide("slow")
            //$('.timeline').css("display", "none");
            isOpen = false
        }
        else {


        }
    });


};
