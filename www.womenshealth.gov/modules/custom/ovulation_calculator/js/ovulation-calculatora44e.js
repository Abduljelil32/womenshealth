(function() {
    'use strict';

    var CURRENT_DATE = new Date();
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // querySelector alias
    function q(selector) {
        return document.querySelector(selector);
    }

    function dateStamp(dateObj) {
        var month = MONTHS[dateObj.getMonth()];
        var date = dateObj.getDate().toString().length < 2 ? '0' + dateObj.getDate() : dateObj.getDate();
        var year = dateObj.getFullYear();
        return month + ' ' + date + ', ' + year;
    }

    function formatTime(date) {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function calculateFertileWindow(periodDateObj, menstrualLength) {
        var periodYear = periodDateObj.getFullYear();
        var periodDate = periodDateObj.getDate();
        var periodMonth = periodDateObj.getMonth();

        // default ovulation month & year to period month & year
        var ovulationDate = undefined;
        var ovulationMonth = periodMonth;
        var ovulationYear = periodYear;

        // calculate number of days in period month
        var daysInMonth = new Date(periodYear, periodMonth + 1, 0).getDate();

        // calculate ovulation date, month, & year
        if ((periodDate + menstrualLength) > daysInMonth) {
            // when date is in the next month
            ovulationDate = ((periodDate + menstrualLength) - daysInMonth) - 15;
            if (ovulationDate < 1) {
                ovulationDate += daysInMonth;
            } else {
                ovulationMonth += 1;
                if (ovulationMonth > 11) {
                    ovulationMonth = 0; // set to january if month > 11
                    ovulationYear += 1; // increment year
                }
            }
        } else {
            // else date is in the same month as period date
            ovulationDate = (periodDate + menstrualLength) - 15;
        }

        var ovulationDateObj = new Date(ovulationYear, ovulationMonth, ovulationDate);
        var windowStart = addDays(ovulationDateObj, -5); //  fertile window start is 5 days before

        return {
            start: windowStart,
            end: ovulationDateObj
        };
    }

    function generateGoogleCalendarLink(event) {
        var href = encodeURI([
            'https://www.google.com/calendar/render',
            '?action=TEMPLATE',
            '&text=' + (event.title || ''),
            '&dates=' + (event.start || ''),
            '/' + (event.end || ''),
            '&details=' + (event.description || ''),
            '&location=',
            '&sprop=&sprop=name:'
        ].join(''));

        return href;
    }

    function generateICSLink(event) {
        var href = encodeURI(
            'data:text/calendar;charset=utf8,' + [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                'URL:' + document.URL,
                'DTSTART:' + (event.start || ''),
                'DTEND:' + (event.end || ''),
                'SUMMARY:' + (event.title || ''),
                'DESCRIPTION:' + (event.description || ''),
                'LOCATION:',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\n')
        );

        return href;
    }

    try {
        var calculatorForm = q('#ovu-calc__form');
        var periodDateInput = q('#period-date');
        var menstrualLengthSelect = q('#menstrual-length');
        var calendarPickerContainer = q('#ovu-calc__calendar');

        var resetCalculatorBtn = q('#reset-calculator-btn');
        var calendarResultsContainer = q('#ovu-calc__calendar-result');
        var textResultsContainer = q('#ovu-calc__results');
        var calendarResults = undefined;

        // Default Input to current date
        periodDateInput.value = dateStamp(CURRENT_DATE);

        // Initialize Calendar Picker
        var min = new Date();
        var max = new Date();
        min.setMonth(min.getMonth() - 2);
        max.setMonth(max.getMonth() + 2);
        var calendarPicker = new TinyDatePicker(calendarPickerContainer, {
            mode: 'dp-permanent',
            min: min,
            max: max
        });

        // Calendar Picker event listeners
        calendarPicker.on({
            select: function(_, dp) {
                periodDateInput.value = dateStamp(dp.state.selectedDate);
            }
        });

        // Disable Month & Year Controls
        calendarPickerContainer.querySelector('.dp-cal-month').disabled = true;
        calendarPickerContainer.querySelector('.dp-cal-year').disabled = true;

        calculatorForm.addEventListener('submit', function(event) {
            // prevent form submission
            event.preventDefault();

            // show result containers
            calendarResultsContainer.style.display = 'block';
            textResultsContainer.style.display = 'block';
            q('#calendar-key').style.display = 'block';
            q('#results-social-links').style.display = 'block';

            // parse & calculate data
            var periodDateObj = new Date(periodDateInput.value);
            var menstrualLength = parseInt(menstrualLengthSelect.value);
            var fertileWindow = calculateFertileWindow(periodDateObj, menstrualLength);

            // update DOM
            // update results (right column)
            q('#result-period').innerText = dateStamp(periodDateObj);
            q('#result-menstrual').innerText = menstrualLength + ' days';
            q('#result-window').innerText = dateStamp(fertileWindow.start) + ' — ' + dateStamp(fertileWindow.end);
            q('#result-ovulation').innerText = dateStamp(fertileWindow.end);

            q('#email-results-link').href = 'mailto:?body='
                + 'If your last period started: ' + q('#result-period').innerText + '%0A ' 
                + 'If your menstrual cycle is: ' + q('#result-menstrual').innerText + '%0A '
                + 'Estimated fertile window: ' + q('#result-window').innerText + '%0A '
                + 'Estimated ovulation date: ' + q('#result-ovulation').innerText
                + '&subject=Ovulation%20Results'
            ;

            // calendar links
            var event = {
                start: formatTime(fertileWindow.start),
                end: formatTime(fertileWindow.end),
                title: 'Fertile Window',
                description: 'Your estimated fertile window is ' + q('#result-window').innerText
                    + '. Learn more at https://womenshealth.gov'
            };

            q('#google-calendar').href = generateGoogleCalendarLink(event);
            q('#apple-calendar').href = generateICSLink(event);
            q('#outlook-calendar').href = generateICSLink(event);

            // update calendar results (left column)
            calendarResults = new TinyDatePicker(q('#result-calendar'), {
                mode: 'dp-permanent',
                min: fertileWindow.start, // pass full Date object here; passing `date.toLocaleDateString()` breaks IE11 compatibility
                max: fertileWindow.end,
                hilightedDate: fertileWindow.end
            });

            // Disable Controls
            calendarResultsContainer.querySelector('.dp-cal-month').disabled = true;
            calendarResultsContainer.querySelector('.dp-cal-year').disabled = true;
            calendarResultsContainer.querySelector('.dp-next').style.display = 'none';
            calendarResultsContainer.querySelector('.dp-prev').style.display = 'none';

            // this disables all date buttons
            var allDays = calendarResultsContainer.querySelectorAll('.dp-day');
            for (var i = 0, len = allDays.length; i < len; i++) {
                var el = allDays[i];
                el.disabled = true;
            }

            calendarResults.off();
        });

        // on reset
        resetCalculatorBtn.addEventListener('click', function(event) {
            // hide result containers
            calendarResultsContainer.style.display = 'none';
            textResultsContainer.style.display = 'none';
            q('#calendar-key').style.display = 'none';
            q('#results-social-links').style.display = 'none';

            // destroy results calendar
            if (calendarResults !== undefined) {
                calendarResults.destroy();
                q('#result-calendar').innerHTML = ''; // clear calendar of any remaining HTML first
            };
        });
    } catch(e) {
        console.error('Unable to mount Ovulation Calculator component: ' + e);
    }
})();