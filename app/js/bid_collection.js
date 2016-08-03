(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  ZBW.BidCollection = function() {
    var init;

    init = function() {
      $container_collection = $('.container-collection');

      $('.container-collection .btn-manage').click(function() {
        $(this).removeClass('visible');
        $('.container-collection .btn-save').addClass('visible');

        $('.container-collection .item-checkbox').show();
      });

      $('.container-collection th .item-checkbox').change(function() {
        $('tbody .item-checkbox', $container_collection).prop('checked', $(this).is(':checked'));
      });
    };

    return {
      init: init
    };
  }();

  $(function() {
    ZBW.BidCollection.init();
  });
})(jQuery);