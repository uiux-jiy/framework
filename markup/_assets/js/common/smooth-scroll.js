// ===========================================================================================
// Scroll Control Plugin (https://github.com/cferdinandi/smooth-scroll)
// ===========================================================================================
// 이동 시 스크롤 부드럽게
;(function(global, $) {
  var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 500,
    speedAsDuration: true
  });
})(window, window.jQuery);