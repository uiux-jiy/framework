// ===========================================================================================
// Accessibility Tabs Plugin
// ===========================================================================================
;(function($){
  'use strict';

  var defaults = {
    active_index: 0,
    active_class: "active"
  };

  function Tabs(el, options) {
    this.config = $.extend({}, defaults, options);
    this.$el = $(el);
    this.tabs = this.$el.find('.tab-list-group [role="tab"]');
    this.panels = this.$el.find('.tab-panel-group [role="tabpanel"]');
    this.active_class = this.config.active_class;
    this.hidden_class = this.config.hidden_class;
    this.active_index = this.config.active_index;
    this._init();
  }

  $.extend(Tabs.prototype, {
    _init: function() {
      var that = this;
      var active_class = this.active_class;
      var tabs_parent = this.tabs.parent();

      this.tabs.on("click", function(e) {
        e.preventDefault();
        var $this = $(this);
        tabs_parent.find("." + active_class).removeClass(active_class);
        $this.addClass(active_class);
        that.active_index = $this.index();
        that.activatePanel(that.active_index);
      });

      this.tabs.eq(this.active_index).trigger('click');
    },
    activatePanel: function(index) {
      this.panels
        .filter("." + this.active_class)
        .removeClass(this.active_class);
      this.panels.eq(index).addClass(this.active_class);
    }
  });

  $.uiTabs = function(selectors, options) {
    $(selectors).each(function() {
      $.data(this, "tabs", new Tabs(this, options));
    });
  };

})(window.jQuery);