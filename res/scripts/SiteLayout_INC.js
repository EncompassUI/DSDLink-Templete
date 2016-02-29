
$(document).ready(function () {
    //SetLayoutHeight();

    $(window).resize(function(){
       //SetLayoutHeight();
    });
  
});

function SetLayoutHeight() {
    var fullheight = $(window).height();
    var rightPanel = $('.right-panel');
    var contentheight = rightPanel.height();



    if(contentheight > fullheight){
        rightPanel.css('height',contentheight);
    }
    else{
        rightPanel.css('height',fullheight);
    }
}