/**
 * @file
 * Functionality for content pages.
 */

(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.qaToggle = {
        attach: function () {
            // add expand all button
            if ($('.qa-container').length > 1) {
                var qa = { expanded: false };
                var expandAllBtn = document.createElement('button');
                expandAllBtn.className = 'usa-button';
                expandAllBtn.innerText = 'Expand All';

                $(expandAllBtn).on('click', function() {
                    qa.expanded = !qa.expanded;

                    if (qa.expanded) $('.qa-container').find('h2').addClass('expanded');
                    else $('.qa-container').find('h2').removeClass('expanded');

                    $('.qa-container').find('.answer').each(function(index, element) {
                        $(element).css('display', qa.expanded ? 'block' : 'none');
                    });

                    expandAllBtn.innerText = qa.expanded ? 'Collapse All' : 'Expand All';
                });

                var btnContainer = document.createElement('div');
                btnContainer.appendChild(expandAllBtn);
                btnContainer.style['text-align'] = 'right';
                btnContainer.style.padding = '1rem 0';
                $(btnContainer).insertBefore('.qa-wrapper');
            }

            if ($('.qa-container').length == 1) {
                $('.qa-container').find('h2').toggleClass('expanded');
                $('.qa-container').find('.answer').toggleClass('expanded');
            }
            $('.qa-container h2').click(function() {
                $(this).toggleClass('expanded');
                $(this).parent().find('.answer').toggle('expanded');
            });

            $('a').click(function(e) {
               if ($(this).attr('href') == '#references') {
                   // e.preventDefault();
                   redirectToReferences();
               }
            });

            var hash = window.location.hash.substring(1);
            if (hash.length) {
                if (hash == 'references') {
                    redirectToReferences();
                }
                else {
                    hash--;
                    var activeQuestion = $('.qa-container .paragraph').eq(hash);
                    if (activeQuestion.length) {
                        activeQuestion.find('h2').toggleClass('expanded');
                        activeQuestion.find('.answer').toggleClass('expanded');
                        $('.qa-container .paragraph')[hash].scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            }

            function redirectToReferences() {
                var lastQuestion = $('.qa-container:last-child');
                lastQuestion.find('h2').addClass('expanded');
                lastQuestion.find('.answer').addClass('expanded').removeAttr('style');
                $('.qa-container:last-child').find('h2')[0].scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    };

    Drupal.behaviors.bookmarkLink = {
        attach: function() {
            $('.bookmark-link').each(function(index, element) {
                $(element).on('click', function(event) {
                    event.preventDefault();

                    // repurposed code from Drupal 7 site
                    // might need improvements
                    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
                        window.sidebar.addPanel(document.title, window.location.href, '');
                    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
                        window.external.AddFavorite(location.href, document.title);
                    } else if (window.opera && window.print) { // Opera Hotlist
                        this.title = document.title;
                        return true;
                    } else { // webkit - safari/chrome
                        alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
                    }
                });
            });
        }
    };

    Drupal.behaviors.innerContentFooter = {
        attach: function() {
            $(window).resize(function() {
                resize();
            });
            $(document).ready(function() {
                resize();
            });
            function resize(){
                if ($(window).width() >= 1024) {
                    $('.inner-content-footer').appendTo('.usa-layout-docs__main');
                }
                else {
                    $('.inner-content-footer').insertAfter('.main-content');
                }
            }
        }
    };
    Drupal.behaviors.escapeLink = {
      attach: function() {
          $('.escape').click(function (e) {
              e.preventDefault();
              var currentUrl = window.location.pathname;
              history.replaceState(undefined, 'Home', '/');
              location.href = 'https://www.google.com';
          });
      }
    };
    Drupal.behaviors.externalLinkIndicator = {
        attach: function() {
            $('.usa-layout-docs__main a').each(function () {
                if ($(this).attr('href')) {
                    var href = $(this).attr('href');
                    var match1 = href.match(/\^*.gov/g);
                    var match2 = href.match(/\^*local/g);
                    var match3 = href.match(/\^*http/g);
                    var match4 = href.match(/\^*amazonaws.com/g);

                    if ((match1 == null && match2 == null && match3 != null && match4 == null && !$(this).hasClass('external-link'))) {
                        $(this).addClass('external-link').addClass('external-popup');
                    }
                }
            });
            $('.external-link').each(function () {
                if ($(this).next().hasClass("exit-disclaimer") == false) {
                    if ($(this).parents().hasClass("video-image-links")) {
                        $(this).attr('target', '_blank').append(' <img class="disclaimer" src="/themes/custom/owh_uswds/assets/img/new_window_icn.png">');
                    } else {
                        $(this).attr('target', '_blank').append(' <img class="disclaimer" src="/themes/custom/owh_uswds/assets/img/exit-disclaimer.png">');
                    }
                }
            });
            $('.external-popup').unbind().on('click', function () {
                return confirm('This website contains links to other federal and state agencies and private organizations. The Department of Health and Human Services (HHS) cannot attest to the accuracy of information provided by these nonfederal website links. Linking to nonfederal sites does not constitute an endorsement by HHS or any of its employees of the sponsors or the information and products presented on the sites. You will be subject to the destination site\u0027s privacy policy when you leave the OPA website.');
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
