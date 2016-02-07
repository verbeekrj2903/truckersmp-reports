// ==UserScript==
// @name         TruckersMP Reports Improved
// @description  Only for TruckersMP Admins
// @namespace    http://truckersmp.com/
// @version      0.9.1
// @author       CJMAXiK
// @match        http://truckersmp.com/en_US/reports/view/*
// @updateURL    http://cjmaxik.ru/useless/wotrreports.js
// @require      http://momentjs.com/downloads/moment.min.js
// @run-at       document-end
// @grant        none
// @copyright    2016, CJMAXiK (http://cjmaxik.ru/)
// ==/UserScript==
// ==OpenUserJS==
// @author       CJMAXiK
// ==/OpenUserJS==
/* jshint -W097 */
'use strict';
console.log("WoTrMP Reports Improved INBOUND! Question - to @cjmaxik on Slack!");

// ===== Bootstrapping =====
var now = moment();

var date_buttons = '<br>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="1day">+1 day</button>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="3day">+3</button>' +
    '<button type="button" class="btn btn-primary plusdate" data-plus="1week">+1 week</button>' +
    '<button type="button" class="btn btn-warning plusdate" data-plus="1month">+1 month</button>' +
    '<button type="button" class="btn btn-danger plusdate" data-plus="3month">+3</button>' +
    '<button type="button" class="btn btn-xs btn-link plusdate" data-plus="clear">NOW</button>' +
    '<span>Questions - to @cjmaxik in Slack!</span>';

$(date_buttons).insertAfter('label:contains("Time Limited")');
$('input[id="perma.false"]').prop("checked", true);

// ===== Timing FTW! =====
$('.plusdate').on("click", function() {
    switch ($(this).data("plus")) {
        case '1day':
            now.add(1, 'd');
            break;
        case '3day':
            now.add(3, 'd');
            break;
        case '1week':
            now.add(1, 'w');
            break;
        case '1month':
            now.add(1, 'M');
            break;
        case '3month':
            now.add(3, 'M');
            break;
        case 'clear':
            now = moment();
            break;
    };
    $('#datetimeselect').val(now.format("YYYY/MM/DD HH:mm"));
});

