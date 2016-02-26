
$(document).ready(function () {
    SetLayoutHeight();

    $(window).resize(function(){
        SetLayoutHeight();
    });
  
});

function SetLayoutHeight() {
    var fullheight = $(window).height();
    var contentheight = $('.right-panel').height();

    var rightPanel = $('.right-panel');

    if(contentheight > fullheight){
        rightPanel.css('height',contentheight);
    }
    else{
        rightPanel.css('height',fullheight);
    }
}