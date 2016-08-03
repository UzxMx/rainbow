(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  var Profile = ZBW.Profile || {};
  ZBW.Profile = Profile;

  Profile.Selections = (function() {
    var init;
    var $dropdowns;

    function hideSelection() {
      $('.container-selection', $dropdowns).removeClass('visible');
    }

    init = function() {
      $dropdowns = $('.container-edit-account-info .dropdown');
      $('.container-title', $dropdowns).click(function(event) {
        event.stopPropagation();
        
        var $parent = $(this).parent();
        var $container_selection = $('.container-selection', $parent);

        if ($container_selection.hasClass('visible')) {
          $container_selection.removeClass('visible');
          return;
        }

        hideSelection();
        $container_selection.addClass('visible');        
      });

      $('.selection', $dropdowns).click(function() {
        event.stopPropagation();

        var $parent = $(this).parent().parent();

        hideSelection();
      });

      $(document).click(function() {
        hideSelection();
      });       
    };

    return {
      init:init
    };
  })();

  $(function() {
    Profile.Selections.init();
  });
})(jQuery);