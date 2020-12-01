// ===========================================================================================
// Popup Plugin
// ===========================================================================================
// .popup - 팝업 버튼, 레이어 팝업 연결
(function(global, $) {
  var $popups = $('.popup').a11y_popup();
  // popup button class
  $('.popup-button').on('click', function(e) {
    var popName = $(this).attr('data-id');
    var Wsize = $(window).width();
    // popup open layer (data-id)
    $.popupId($popups, popName).open();
    e.preventDefault();
  });
})(window, window.jQuery);