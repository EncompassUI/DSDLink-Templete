 $(document).ready(function () {
     TabToggle();
     SubTabToggle()
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
         $(this).closest('.nav-list').addClass('hidden');
         $('.nav-sublist').not('.nav-sublist:eq(' + index + ')').removeClass('active');
         $('.nav-sublist:eq(' + index + ')').addClass('active');
         g.preventDefault();
     });
     $('#subListBack').click(function(){
         $('.nav-sublist').removeClass('active');
         $('.nav-list').removeClass('hidden');
     });
 }