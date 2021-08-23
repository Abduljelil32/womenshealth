(function($) {
    'use strict';

    $(document).ready(function() {
        initializeCarousels();
    });

    // keys correspond to carousel ids
    // e.g., <div class="slick" id="owh-homepage-carousel-1"> ... </div>
    var carouselConfigs = {
        'owh-homepage-carousel-1': {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true,
            centerMode: true,
            asNavFor: '#owh-homepage-carousel-2',
            autoplay: true,
            autoplaySpeed: 2000
        },
        'owh-homepage-carousel-2': {
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '#owh-homepage-carousel-1',
            dots: true,
            arrows: false,
            centerMode: true,
            focusOnSelect: true,
            responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
            ]
        },
        'content-page-carousel': {
            autoplay: false,
            arrows: false,
            dots: true
        }
    };

    function initializeCarousels() {
        var slickElements = document.getElementsByClassName('slick');

        // do nothing if no carousels exist
        if (slickElements.length < 1) return;

        // else initialize carousels
        for (var i = 0; i < slickElements.length; i++) {
            var el = slickElements[i];

            if (el.id !== undefined && el.id in carouselConfigs) {
                $(el).slick(carouselConfigs[el.id]);

                if (el.id === 'content-page-carousel') {
                    // remove h1 from page
                    $('main#main-content').removeClass('no-heading-block');
                    // Content Pages with Carousels must have their static headings replaced
                    removeStaticHeaderOnContentPages();
                }
            } else {
                $(el).slick(); // init with defaults
            }
        }
    }

    function removeStaticHeaderOnContentPages() {
        var landingPageHeaders = document.getElementsByClassName('landing-page-header');
        var staticNode = landingPageHeaders[0];
        if (staticNode !== undefined && landingPageHeaders.length > 1) {
            // staticNode is the first landing-page-header element on the page
            staticNode.remove();
        }
    }
})(jQuery);