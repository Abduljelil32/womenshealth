(function($) {
    'use strict';

    $(document).ready(function() {
        // looks for map-wrapper defined in template:
        // /html/web/themes/custom/owh_uswds/templates/fields/field--node--field-blog-para-qa--content-page.html.twig
        var mapWrapper = document.getElementById('mapwrapper');
        if (mapWrapper !== undefined) initializeMap(mapWrapper);
    });

    function initializeMap(rootEl) {
        var initializeMapConfig = window.initializeMapConfig;
        var initializeMapInteraction = window.initializeMapInteraction;

        if (initializeMapConfig === undefined) {
            console.error('Unable to initialize map configuration script');
        }

        if (initializeMapInteraction === undefined) {
            console.error('Unable to initialize map interaction script');
        }

        // collect answer containers
        var regionSections = {};
        var regionContainers = document.getElementsByClassName('region-container');
        for (var i = 0; i < regionContainers.length; i++) {
            var container = regionContainers[i];

            // unhide collapsible container
            var answer = container.getElementsByClassName('answer')[0];
            answer.style.display = 'none';
            answer.className = answer.className + ' region-section';
            // save this answer section in object so we can hide/show it easily later
            // i + 1 is the region number
            regionSections[i + 1] = answer;

            // hide h2 collapsible button
            var h2 = container.getElementsByTagName('h2')[0];
            h2.style.display = 'none';
        }

        initializeMapConfig(regionSections, initializeMapInteraction);
    }
})(jQuery);