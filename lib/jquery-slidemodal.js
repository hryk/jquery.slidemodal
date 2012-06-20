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
        autoOpen: false,
        modal_class: '__slide_modal'
      }, options);

      this.each(function(){
        var $this = $(this),
            data = $this.data('slidemodal');

        if (! data ){
          $.extend(data, settings);
          // Initialize modal Window
          $this.addClass(data.modal_class).
            css({
            'z-index': data['z-index'],
            position: 'fixed',
            top: '0px',
            left: '0px',
            background: '#fff',
            display: 'none',
            opacity: data.opacity
          });
        }
      });
    },
    'open' : function(){

    },
    'close': function(){

    },
    'disable': function(){

    },
    'enable': function(){

    },
    'destroy': function(){
      return this.each(function(){
        var $this = $(this),
            data  = $(this).data('slidemodal');
        $(window).unbind('.slidemodal');
        $this.removeData('slidemodal');
      });
    },
    'option': function(options){
      return this.each(function(){
        var $this = $(this),
            data = $this.data('slidemodal');
        $.extend(data, options);
      });
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

