// ===========================================================================================
// SVG 포맷 처리 실행 (https://github.com/iconic/SVGInjector)
// ===========================================================================================
;(function(global, doc, $) {
  var svgInjection = function() {
    var mySVGsToInject = doc.querySelectorAll('img.inject-svg');
    var injectorOptions = {
        evalScripts: 'once', // always, once, never
        pngFallback: 'images/icon-png/', // PNG 대체 폴더 설정
    };
    SVGInjector(
        mySVGsToInject,
        injectorOptions
    );
  };
  svgInjection();
})(window, document, window.jQuery);