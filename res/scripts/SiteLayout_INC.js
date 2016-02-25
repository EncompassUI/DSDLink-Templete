
$(document).ready(function () {
    SetLayoutHeight();

    $(window).resize(function () {
        SetLayoutHeight();
    }).click(function (event) {
        if (event.button !== 2) {
            HideAllDivs(false);
        }
    });
});

function SetLayoutHeight() {
    var height = $(window).height();

    var navPanel = $('.nav-panel');

    navPanel.css('height', height);
}