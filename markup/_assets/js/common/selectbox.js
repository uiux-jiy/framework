// ===========================================================================================
// SelectBox Style
// ===========================================================================================
(function(global, $) {
  var selectbox = $('select'),
      option_selected = $('select option[selected="selected"]');

  // 셀렉트박스 마우스 이벤트
  selectbox.click(function() {
    $(this).toggleClass('is-active');
  });

  // 셀렉트박스 키보드 이벤트
  selectbox.keydown(function(e) {
    if(e.keyCode == 13) {
      $(this).toggleClass("is-active");
    }
  });

  // 셀렉트박스 옵션 키보드 이벤트
  option_selected.keydown(function(e) {
    if(e.keyCode == 13) {
      $(this).toggleClass("is-active");
    }
  });

  // 셀렉트박스 옵션 이메일 속성 이벤트
  selectbox.change(function() {
    var $this = $(this),
        select_name = $this.children('option:selected').text();
    $this.siblings('label').children('input').val('')
      .attr('placeholder', select_name)
      .attr('aria-label', select_name);
  });

})(window, window.jQuery);