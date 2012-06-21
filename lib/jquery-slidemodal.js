(function($){
  'use strict';

  // parse option: e.g. full, 300, 300px, -100, -100px.
  var parse_modal_width = function(option){
    var pixel_pattern = /^(-{0,1}\d+)px$/;
    if (option === 'full') {
      return $('body').innerWidth();
    }
    else if ($.isNumeric(option)) {
      if (option < 0) {
        return $('body').innerWidth() + option;
      }
      else {
        return option;
      }
    }
    else if (pixel_pattern.test(option)) {
      var px_found = pixel_pattern.exec(option),
      px = px_found[1];
      if (px < 0) {
        return $('body').innerWidth() + parseInt(px, 10);
      }
      else {
        return px;
      }
    }
    else {
      return false;
    }
  };

  var init_modal_background = function(opts){
    // Insert modal background screen
    var background;
    if ($('#__slide_modal_background').length === 0) {
      background = $('<div id="__slide_modal_background"></div>').css({
        position: 'absolute',
        'z-index': opts['z-index'],
        top: 0,
        left: 0,
        width:  $('body').innerWidth(),
        height: $('body').innerHeight(),
        opacity: 0.8,
        background: '#fff',
        display: 'none'
      }).appendTo($('body'));
    }
    else {
      background = $('#__slide_modal_background');
    }
    return background;
  };

  // Methods
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

      settings.modal_background = init_modal_background({'z-index': (settings['z-index'] - 1)});

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
        modal_width  = parse_modal_width(data.width),
        modal_left   = (body_width - modal_width);

        if ($this.hasClass('slide_modal_open')) return;
        var open_modal = function(){
          $this.css({
            width : modal_width,
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
        };
        if (! data.modal_background.hasClass('open')){
          data.modal_background.
            css({height: $('body').innerHeight()}).
            fadeIn(200, open_modal);
        }
        else {
          open_modal();
        }
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
                        // there are no other modals, close background
                        if ($('.'+data.modal_class).length === 1)
                          data.modal_background.fadeOut(200);
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
        body_height = $('body').innerHeight(),
        modal_width  = parse_modal_width(data.width);

        $this.css({
          width : modal_width,
          height: body_height,
          left: (body_width - modal_width)+'px'
        });
        // Resize modal background
        data.modal_background.
          css({
          width: body_width,
          height: body_height
        });
      });
    },
    'disable': function(){
      // TODO
    },
    'enable': function(){
      // TODO
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
