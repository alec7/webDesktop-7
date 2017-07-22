// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function($){
    var max = 0;
    $.fn.dt = function(k, v) {
        if(k!==undefined){
            if(v!==undefined){
                this.attr('data-'+k, v);
                this.data(k, v);
                return this;

            }
            return this.data(k)
        }else{
            return this.data()
        }
    };
    $.fn.recr = function(s) {
        return recr(this, s);
    };

    function recr(element, selector){
        if(max>10){
            max = 0;
            return element;
        }
        if(element.is(selector) || element.is('body'))
            return element;
        max++;
        return recr(element.parent(), selector);
    }
})(jQuery);

