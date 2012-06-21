(function($){
  "use strict";

  var methods = {
    'init' : function(options){
      var settings = $.extend({
        before_open: null,
        after_open: null,
        before_close: null,
        after_close: null,
        'z-index': 1000,
        width: 300,
        opacity: 1,
        direction: 'left',
        autoOpen: false,
        modal_class: '__slide_modal_window',
        container: 'body'
      }, options);

      return this.each(function(){
        var $this = $(this),
            data = $this.data('slidemodal');

        if (! data ){
          data = $.extend(settings, data);
          $this.data('slidemodal', data);
          // Initialize modal window elements.
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
      return this.each(function(){
        var $this = $(this),
        data = $(this).data('slidemodal'),
        body_width   = $("body").innerWidth(),
        body_height  = $("body").innerHeight(),
        width        = body_width,
        slide_margin = 200,
        modal_left   = (body_width - data.width);

        if ($this.hasClass('slide_modal_open')) return;

        $this.css({
          width : width,
          height: body_height,
          'overflow-y': 'scroll',
          left: body_width+'px',
          opacity: data.opacity,
          'box-shadow': "-2px 0px 5px #eee",
          '-moz-box-shadow': "-2px 0px 5px #eee",
          '-webkit-box-shadow': "-2px 0px 5px #eee"
        }).show(50, function(){
          setTimeout(function(){
            $this.animate({left: modal_left+'px'},
            function(){
              $this.addClass('slide_modal_open');
              // Bind resizing method on resize.
              $(window).bind('resize.slidemodal',
                             $.proxy(methods.resize, $this));
              // Bind closing modal window method on click.
              $(data.container).
              bind('click.slidemodal',
                   function(e){
                     $(this).stop(true, true);
                     if (e.target !== $this[0])
                       $this.slide_modal('close');
                     e.preventDefault();
                   });
            });
          },0);
        });
      });
    },
    'close': function(){
      return this.each(function(){
        var $this = $(this),
            data  = $this.data('slidemodal'),
            body_width = $("body").innerWidth();

        $(data.container).unbind('click.slidemodal');

        if ($this.hasClass('slide_modal_open')) {
          // Call before_close.
          if (typeof data.after_close === 'function')
            data.before_close($this);
          // Close modal window.
          setTimeout(function(){
            $this.removeClass('slide_modal_open').
            animate({left: body_width+'px'},
                   function(){
                      // Bind resize method.
                      $(window).unbind('resize.slidemodal',
                                       methods.resize);
                      $this.hide(5, function(){
                        // Call after_close.
                        if (typeof data.before_close === 'function')
                          data.after_close($this);
                      });
                   });
          }, 0);
        }
      });
    },
    'resize' : function(){
      return this.each(function(){
        var $this = $(this),
        data  = $(this).data('slidemodal'),
        body_width  = $('body').innerWidth(),
        body_height = $('body').innerHeight();
        $this.css({
          width : data.width,
          height: body_height,
          left: (body_width - data.width)+'px'
        });
      });
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
        data = $.extend(data, options);
        $this.data('slidemodal', data);
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
