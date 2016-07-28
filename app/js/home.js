(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  var Home = ZBW.Home || {};
  ZBW.Home = Home;

  Home.ZBInfoTabs = (function() {
    var init;

    init = function() {
      var $zbinfo = $('.block-zbxx');

      $('.container-tabs .tab', $zbinfo).hover(function() {
        $('.content.current', $zbinfo).removeClass('current');
        $('.tab.selected').removeClass('selected');

        var name = $(this).attr('data-name');
        $(this).addClass('selected');
        $('.content-' + name, $zbinfo).addClass('current');
      }, function() {
      });
    };

    return {
      init: init
    };
  })();

  $(function() {
    ZBW.makeImgSlider('.header-img-slider .img-slider', 400.0 / 1200.0);

    Home.ZBInfoTabs.init();
  });
})(jQuery);