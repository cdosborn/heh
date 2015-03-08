var isOpen = false;

var ANIMATE = function(){


    if (commit_index == commit_list.length()-1){
        $('.left').hide();
    }
    else{
        $('.left').show();
    }
    if (commit_index == 0){
        $('.right').hide();
    }
    if (commit_index == 0){
        $('.right').show();
    }
}
