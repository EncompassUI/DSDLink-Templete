 $(document).ready(function () {

     (function ($) {
         $('.nav-tabs li a[role="tab"]').click(function (g) {
             var tab = $(this).closest('.nav-tabs'),
                 index = $(this).closest('li').index();

             tab.find('li').removeClass('active');
             $(this).closest('li').addClass('active');

             $('.tab-content').find('.tab-pane').not('.tab-pane:eq(' + index + ')').removeClass('active');
             $('.tab-content').find('.tab-pane:eq(' + index + ')').addClass('active');
             g.preventDefault();
         });
     })(jQuery);

 });