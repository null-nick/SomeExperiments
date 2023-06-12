;(function ($, window, document, undefined) {
    'use strict';
    let $ripple = $('.js-ripple');

    $ripple.on('click.ui.ripple', function (e) {
        let $this = $(this);
        let $offset = $this.parent().offset();
        let $circle = $this.find('.c-ripple__circle');
        let x = e.pageX - $offset.left;
        let y = e.pageY - $offset.top;
        $circle.css({
            top: y + 'px',
            left: x + 'px' });
        $this.addClass('is-active');
    });
    $ripple.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (e) {
        $(this).removeClass('is-active');
    });
})(jQuery, window, document);