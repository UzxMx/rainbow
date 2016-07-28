(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  ZBW.makeImgSlider = function(selector, aspect_ratio) {
    var $slider = $(selector);
    var $parent = $slider.parent();
    var img_count;

    var slider_height = $parent.width() * aspect_ratio;
    $parent.css({
      'height': slider_height + 'px'
    });

    // add controls
    var html = '<div class="img-slider-controls"></div>';
    var $controls = $(html);
    $parent.append($controls);

    img_count = $('.img', $slider).length;
    for (var i = 0; i < img_count; ++i) {      
      if (i == 0) {
        html = '<span class="icons-slider-circle-current"></span>';
      } else {
        html = '<span class="icons-slider-circle"></span>';
      }
      var $control = $(html);
      $control.attr('data-position', i);
      $controls.append($control);
    }

    var startTimer, stopTimer, timer_handle;

    /**
     * slide function
     *
     * @position zero based
     */
    function slideTo(position) {
      var $current_img, $current_control;
      var $next_img, $next_control;

      position = parseInt(position) + 1;

      $current_img = $('.img.current', $slider);
      $current_control = $('.icons-slider-circle-current', $controls);
      $next_img = $('.img:nth-child(' + position + ')', $slider);
      $next_control = $('span:nth-child(' + position + ')', $controls);

      $current_img.animate({
        opacity: 0
      }, function() {
      });
      $next_img.animate({
        opacity: 1
      }, function() {
        $current_img.removeClass('current');
        $current_control.removeClass('icons-slider-circle-current').addClass('icons-slider-circle');

        $next_img.addClass('current');
        $next_control.removeClass('icons-slider-circle').addClass('icons-slider-circle-current');

        startTimer();
      });
    }

    // timer
    startTimer = function() {
      timer_handle = setTimeout(function() {
        var $current_control = $('.icons-slider-circle-current', $controls);
        var position = parseInt($current_control.attr('data-position'));
        slideTo((position + 1) % img_count);
      }, 3000);
    };

    stopTimer = function() {
      clearTimeout(timer_handle);
    };

    startTimer();

    // set click handler for controls
    $('span', $controls).click(function() {
      var $this = $(this);

      if ($this.hasClass('icons-slider-circle-current')) {
        return;
      }

      stopTimer();

      var position = parseInt($this.attr('data-position'));
      slideTo(position);
    });
  };

  ZBW.HeaderMenus = (function() {
    var init;

    init = function() {
      var $primary_menus = $('.header-menus .primary-menus');
      var $secondary_menus_container = $('.header-menus .container-secondary-menus');

      var timer_handle;

      function restoreMenus() {
        $('.menu.hovered', $primary_menus).removeClass('hovered');
        $('.secondary-menus.visible', $secondary_menus_container).removeClass('visible');
        
        var $selected = $('.menu.selected', $primary_menus);
        if ($selected.length == 0) {
          return;
        }
        var name = $selected.attr('data-name');
        $('.secondary-menus-' + name, $secondary_menus_container).addClass('visible');
      }

      $('.menu', $primary_menus).hover(function() {
        if (timer_handle) {
          clearTimeout(timer_handle);
        }

        restoreMenus();

        $(this).addClass('hovered');
        var name = $(this).attr('data-name');

        $('.secondary-menus.visible', $secondary_menus_container).removeClass('visible');
        $('.secondary-menus-' + name, $secondary_menus_container).addClass('visible');
      }, function() {
        timer_handle = setTimeout(restoreMenus, 100);
      });

      $('.header-menus .container-secondary-menus').hover(function() {
        if (timer_handle) {
          clearTimeout(timer_handle);
        }
      }, function() {
        timer_handle = setTimeout(restoreMenus, 100);
      });
    };

    return {
      init: init
    };
  })();

  $(function() {
    ZBW.HeaderMenus.init();
  });  
})(jQuery);