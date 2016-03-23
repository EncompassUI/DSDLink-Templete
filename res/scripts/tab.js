$(document).ready(function () {
    document.body.addEventListener('touchstart', function () { });//...¿Õº¯Êý¼´¿É

    var isMobile = navigator.appVersion.indexOf("Mobile") != -1;

    if (!isMobile) {
        $('.form-wrapper:first').addClass('active');
        $('.nav-list .profile-tabpane:first').addClass('active');
    }

     TabToggle();
     SubTabToggle();
     ProfileSwitch();
     RegistBack();
});

 function TabToggle() {
     $('[role="tablist"] [role="tab"]').click(function (g) {
         var tab = $(this).closest('[role="tablist"]'),
             index = $(this).closest('li').index();

         tab.find('li').removeClass('active');
         $(this).closest('li').addClass('active');

         $('.tab-content').find('.tab-pane').not('.tab-pane:eq(' + index + ')').removeClass('active');
         $('.tab-content').find('.tab-pane:eq(' + index + ')').addClass('active');
         g.preventDefault();
     });

 };

 function SubTabToggle() {
     $('.sub-tabpane').click(function (g) {
         var index = $(this).index();
         
         $('.nav-sublist').not('.nav-sublist:eq(' + index + ')').removeClass('active');
         $('.nav-sublist:eq(' + index + ')').addClass('active');
         
//         setTimeout(function(){
             $(this).closest('.nav-list').delay(100).hide(1);
//         },60);
         
         g.preventDefault();
     });
     $('.subListBack').click(function () {
         $('.nav-sublist').removeClass('active');
         $('.nav-list').delay(200).show(1);
     });
 };

 function ProfileSwitch() {
     var isMobile = navigator.appVersion.indexOf("Mobile") != -1;

     $('.profile-tabpane').click(function () {
         var index = $(this).index(),
             tab = $(this).closest('.nav-list'),
             navPanel = $('.nav-panel');

         if (isMobile) {
             navPanel.hide();

         }
         else {
             tab.find('li').removeClass('active');
             $(this).addClass('active');
         }
         
         $('.form-wrapper').not('.form-wrapper:eq(' + index + ')').removeClass('active');
         $('.form-wrapper:eq(' + index + ')').addClass('active');
     });
 };

 function RegistBack() {
     var isMobile = navigator.appVersion.indexOf("Mobile") != -1,
         navPanel = $('.nav-panel');

     $('.btn-back').click(function () {
         var form = $(this).closest('.form-wrapper');

         form.removeClass('active');
         if (isMobile) {
             navPanel.show();
         }
     });
 }