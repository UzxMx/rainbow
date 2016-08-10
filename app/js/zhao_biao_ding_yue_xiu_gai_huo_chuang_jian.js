(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  ZBW.BidsSubscribe = function() {
    var init;

    function initGenericSelections($rows) {
      $('.selection', $rows).click(function() {
        var $parent = $(this).parent();
        var selected = $(this).hasClass('selected');

        if ($parent.hasClass('selections-single') && !selected) {
          $('.selection.selected', $parent).removeClass('selected');
        }

        if (selected) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }
      });
    }

    function initProvinceSelections() {
      function areAllProvincesInRegionSelected($region) {
        var all_selected = true;

        $('.selection-second-level-group .selection', $region).each(function(index, element) {
            if (!$(element).hasClass('selected')) {
              all_selected = false;
              return false;
            }
        });

        return all_selected;
      }

      function areAllRegionsSelected() {
        var all_selected = true;

        $('.row-province .selections').each(function(index, element) {
          if (index != 0) {
            if (!areAllProvincesInRegionSelected($(element))) {
              all_selected = false;
              return false;
            }
          }
        });

        return all_selected;
      }

      function onAllSelectionChanged($element) {
        if ($element.hasClass('selected')) {
          $('.row-province .selection').removeClass('selected');
        } else {
          $('.row-province .selection').addClass('selected');
        }
      }

      function onRegionSelectionChanged($element) {
        if ($element.hasClass('selected')) {
          $('.selection', $element.parent()).removeClass('selected');
        } else {
          $('.selection', $element.parent()).addClass('selected');
        }

        if (areAllRegionsSelected()) {
          $('.row-province .selection-all').addClass('selected');
        } else {
          $('.row-province .selection-all').removeClass('selected');
        }
      }

      function onProvinceSelectionChanged($element) {
        if ($element.hasClass('selected')) {
          $element.removeClass('selected');
        } else {
          $element.addClass('selected');
        }

        var $region = $element.parent().parent();
        if (areAllProvincesInRegionSelected($region)) {
          $('.selection-first-level', $region).addClass('selected');
        } else {
          $('.selection-first-level', $region).removeClass('selected');
        }

        if (areAllRegionsSelected()) {
          $('.row-province .selection-all').addClass('selected');
        } else {
          $('.row-province .selection-all').removeClass('selected');
        }        
      }

      $('.row-province .selection').click(function() {
        if ($(this).hasClass('selection-all')) {
          onAllSelectionChanged($(this));
        } else if ($(this).hasClass('selection-first-level')) {
          onRegionSelectionChanged($(this));
        } else {
          onProvinceSelectionChanged($(this));
        }
      });
    }

    init = function() {
      var $rows = $('.row-type, .row-keywords-location, .row-search-method, .row-subscribe', $('.container-form'));
      initGenericSelections($rows);

      initProvinceSelections();
    };

    return {
      init: init
    };
  }();

  $(function() {
    ZBW.BidsSubscribe.init();
  });
})(jQuery);