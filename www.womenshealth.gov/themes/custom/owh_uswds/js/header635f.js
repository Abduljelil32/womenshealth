(function($) {
    var helpline = $('#helpline')[0];
    var searchContainer = $('#search-container')[0];

    $('#helpline-activate-link').on('click', function() {
        $(searchContainer).addClass('search-container--hidden');
        $(helpline).removeClass('helpline--hidden');
    });

    $('#helpline-close-btn').on('click', function() {
        $(searchContainer).removeClass('search-container--hidden');
        $(helpline).addClass('helpline--hidden');
    })
})(jQuery);