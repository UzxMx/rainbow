(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  var ZBInfo = ZBW.ZBInfo || {};

  ZBInfo.SearchConditions = function() {
    var init, initSubConditions, initMainCondition;

    var $main_condition;
    var $container_conditions;

    function hideAllConditionSelection() {
      $('.container-selection', $container_conditions).removeClass('visible');
      $('.container-selection', $main_condition).removeClass('visible');
    }

    initSubConditions = function() {
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
    };

    initMainCondition = function() {
      $('.condition-selected, .icons-blue-dropdown', $main_condition).click(function() {
        console.log('clicked');
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

      $('.selection', $main_condition).click(function(event) {
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

        // show corresponding sub conditions panel
        var val = $(this).attr('data-value');
        $('.container-conditions.current').removeClass('current');
        $('.container-' + val + '-conditions').addClass('current');
      });      
    };

    init = function() {
      $main_condition = $('.container-search .condition-type');
      $container_conditions = $('.container-conditions');

      initSubConditions();
      initMainCondition();

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