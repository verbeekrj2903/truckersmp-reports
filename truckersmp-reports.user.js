// ==UserScript==
// @name         TruckersMP Reports Improved
// @description  Only for TruckersMP Admins
// @namespace    http://truckersmp.com/
// @version      1.0.1
// @author       CJMAXiK
// @match        http://truckersmp.com/en_US/reports/view/*
// @homepageURL  https://openuserjs.org/scripts/cjmaxik/TruckersMP_Reports_Improved
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-storage-api/1.7.5/jquery.storageapi.min.js
// @run-at       document-end
// @grant        none
// @copyright    2016, CJMAXiK (http://cjmaxik.ru/)
// ==/UserScript==
// ==OpenUserJS==
// @author       CJMAXiK
// ==/OpenUserJS==
/* jshint -W097 */
'use strict';
console.log("TruckersMP Reports Improved INBOUND! Question - to @cjmaxik on Slack!");

// ===== Bootstrapping =====
var now = moment();

var date_buttons = '<br>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="1day">+1 day</button>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="3day">+3</button>' +
    '<button type="button" class="btn btn-warning plusdate" data-plus="1week">+1 week</button>' +
    '<button type="button" class="btn btn-danger plusdate" data-plus="1month">+1 month</button>' +
    '<button type="button" class="btn btn-danger plusdate" data-plus="3month">+3</button>' +
    '<button type="button" class="btn btn-xs btn-link plusdate" data-plus="clear">NOW</button>' +
    '<span>Questions - to @cjmaxik in Slack!</span>';

$(date_buttons).insertAfter('label:contains("Time Limited")');
$('input[id="perma.false"]').prop("checked", true);

// Perpetrator ID, Steam name, avatar & aliases
var steam_id = $('input[name="steam_id"]').val();
var storage = $.localStorage;
var steamapi = storage.get('SteamApi');

if (steamapi === "Kappa") {
    console.log(":O");
} else if (steamapi != null && steamapi != "http://steamcommunity.com/dev/apikey") {
    $.ajax({
        url: "http://cjmaxik.ru/useless/steamapi.php?steamapi="+steamapi+"&steam_id="+steam_id,
        method: "GET",
        dataType: "JSONP"
    })
    .done(function(data, textStatus, jqXNR) {
        var steam_name = data.response.players[0].personaname;
        var steam_link = '<span id="steam_LOL"><a href="http://steamcommunity.com/profiles/' + steam_id + '" target="_blank"> - '+ steam_name +'</a></span>';
        var steam_aliases = data.response.players[0].aliases;
        var steam_avatar = '<img src="'+ data.response.players[0].avatar + '">';

        var aliases = "";
        for(var key in steam_aliases) {
            aliases += steam_aliases[key].newname + ', ';
        };
        var aliases = '<tr><td>Aliases</td><td>'+ aliases +'</td></tr>';

        $(steam_link).insertAfter('tr:nth-child(2) > td:nth-child(2) > a');
        $(aliases).insertAfter('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2)');
        $('span#steam_LOL').append(steam_avatar);
    });

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

