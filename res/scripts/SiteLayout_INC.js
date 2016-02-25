
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
    var fullheight = $(window).height();


    var navPanel = $('.nav-panel');
    var mainPanel = navPanel.find('.main-panel');
    var navTab = mainPanel.find('.nav.nav-tabs');
    var logoGroup = navPanel.find('.row:first');
    var rightPanel = $('.right-panel');
    var supplierPanel = rightPanel;

    var mainPanelHeight = fullheight - logoGroup.height();

    navPanel.css('height', fullheight);
    mainPanel.css('height', mainPanelHeight);
    navTab.css('height', mainPanelHeight);
    supplierPanel.css('height',fullheight);
}