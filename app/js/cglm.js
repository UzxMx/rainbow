(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  var ZBInfo = ZBW.ZBInfo || {};

  ZBInfo.SearchConditions = function() {
    var init;

    init = function() {
      var $container_conditions = $('.container-conditions');

      function hideAllConditionSelection() {
        $('.container-selection', $container_conditions).removeClass('visible');
      }

      $('.condition-selected, .container-icon', $container_conditions).click(function(event) {
        event.stopPropagation();
        
        var $parent = $(this).parent();
        var $container_selection = $('.container-selection', $parent);

        if ($container_selection.hasClass('visible')) {
          $container_selection.removeClass('visible');
          return;
        }

        hideAllConditionSelection();
        $container_selection.addClass('visible');
      });

      $('.selection', $container_conditions).click(function(event) {
        event.stopPropagation();

        var pos = parseInt($(this).attr('data-pos'));
        var $parent = $(this).parent().parent();

        $parent.attr('data-selected-pos', pos);
        $('.condition-selected', $parent).text($('.wrapper', $(this)).text());

        $('.selection.selected', $parent).removeClass('selected');

        if (pos != 0) {
          $(this).addClass('selected');
        }

        hideAllConditionSelection();
      });

      $(document).click(function() {
        hideAllConditionSelection();
      });
    };


    return {
      init: init
    };
  }();

  $(function() {
    ZBInfo.SearchConditions.init();
  });
})(jQuery);