var isOpen = false;

var main = function(){


    $('#get').click(function(){
        // if sidebar is open, and clicked again
        if(isOpen){
            $('#close').hide();
        }
        else {
            $('.timeline').show(500)
            //$('.timeline').css("display", "flex");
            isOpen = true
            $('#close').show();
        }
    });
    $('#close').click(function(){
        // if sidebar is open, and clicked again
        if(isOpen){
            $('.timeline').hide("slow")
            //$('.timeline').css("display", "none");
            isOpen = false
            $('#close').hide();
        }
        else {


        }
    });


};
$('.timeline').hide()

$(document).ready(main);