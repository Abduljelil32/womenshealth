(function($) {
    $('.close').each(function(i, el) {
        $(el).on('click', function(ev) {
            ev.preventDefault();
            $('#contact-us-block__disclaimer').fadeOut({
                duration: 200,
                easing: 'linear',
                complete: function() {
                    $('#contact-us-block__disclaimer').remove();
                }
            });
        });
    });
})(jQuery);