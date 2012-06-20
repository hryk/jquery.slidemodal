(function($){
  "use strict";

  var methods = {
    'init' : function(options){
      var settings = $.extend({
        before_open: function(){},
        after_open: function(){},
        before_close: function(){},
        after_close: function(){},
        'z-index': 1000,
        width: 300,
        opacity: 1,
        direction: 'left',
        autoOpen: false
      }, options);

      this.each(function(){
        var $this = $(this);
        // Initialize modal Window
        $this.addClass('__slide_modal').
        css({
          'z-index': settings['z-index'],
          position: 'fixed',
          top: '0px',
          left: '0px',
          background: '#fff',
          display: 'none',
          opacity: settings.opacity
        });
      });
    },
    'open' : function(){

    },
    'close': function(){

    },
    'disable': function(){

    },
    'enable': function(){

    }
  };

  $.fn.slide_modal = function(method){
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof(method) === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error('Method ' + method + ' does not exist in jquery.slide_modal.');
      return this;
    }
  };

})(jQuery);

