// ==UserScript==
// @name         TruckersMP Reports Improved
// @description  Only for TruckersMP Admins
// @namespace    http://truckersmp.com/
// @version      1.3.2
// @author       CJMAXiK
// @match        *://truckersmp.com/*/reports/view/*
// @homepageURL  https://openuserjs.org/scripts/cjmaxik/TruckersMP_Reports_Improved
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-storage-api/1.7.5/jquery.storageapi.min.js
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @copyright    2016, CJMAXiK (http://cjmaxik.ru/)
// ==/UserScript==
// ==OpenUserJS==
// @author       CJMAXiK
// ==/OpenUserJS==
/* jshint -W097 */
'use strict';
var version = "1.3.2";
console.log("TruckersMP Reports Improved INBOUND! Question - to @cjmaxik on Slack!");
$('body > div.wrapper > div.breadcrumbs > div > h1').append(' Improved <span class="badge" data-toggle="tooltip" title="by @cjmaxik">' + version + '</span> <a href="#" data-toggle="modal" data-target="#script-settings"><i class="fa fa-cog" data-toggle="tooltip" title="Script settings"></i></a> <a href="http://bit.ly/BlameAnybody" target="_blank" id="version_detected" data-toggle="popover" data-trigger="focus" title="YAY! v.' + version + ' has been deployed!" data-content="Your handy-dandy script just updated! See what you get?"><i class="fa fa-question" data-toggle="tooltip" title="Changelog"></i></a> <i class="fa fa-spinner fa-spin" id="loading-spinner"></i>');

// ===== Bootstrapping =====
var now = moment();

var date_buttons = '<br>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="1day">+1 day</button>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="3day">+3</button>     ' +
    '<button type="button" class="btn btn-warning plusdate" data-plus="1week">+1 week</button>     ' +
    '<button type="button" class="btn btn-danger plusdate" data-plus="1month">+1 month</button>' +
    '<button type="button" class="btn btn-danger plusdate" data-plus="3month">+3</button>' +
    '<button type="button" class="btn btn-xs btn-link plusdate" data-plus="clear">Current time</button>';

var reason_buttons = '<br><div class="btn-group"><a class="btn btn-warning dropdown-toggle" data-toggle="dropdown" href="#">Prefixes <span class="caret"></span></a>' +
    '<ul class="dropdown-menu">' +
    '    <li><a href="#" class="plusreason" data-place="before">Intentional</a></li>' +
    '</ul></div>' +
    '     <div class="btn-group"><a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">Reasons <span class="caret"></span></a>' +
    '<ul class="dropdown-menu">' +
    '    <li><a href="#" class="plusreason" data-place="after">Ramming</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">Blocking</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">Wrong Way</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">Insulting</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">Trolling</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">Reckless driving</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">Offensive language</a></li>' +
    '</ul></div>' +
    '     <div class="btn-group"><a class="btn btn-danger dropdown-toggle" data-toggle="dropdown" href="#">Postfixes <span class="caret"></span></a>' +
    '<ul class="dropdown-menu">' +
    '    <li><a href="#" class="plusreason" data-place="after">// 1 m due to history</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">// 3 m due to history</a></li>' +
    '    <li><a href="#" class="plusreason" data-place="after">// Perma due to history</a></li>' +
    '</ul></div>' +
    '    <button type="button" class="btn btn-link" id="reason_clear">Clear</button>';

$(date_buttons).insertAfter('#confirm-accept > div > div > form > div.modal-body > div:nth-child(5) > label:nth-child(4)');
$('input[id="perma.false"]').prop("checked", true);

$(reason_buttons).insertAfter('#confirm-accept > div > div > form > div.modal-body > div:nth-child(6) > input');

// ===== Links in content =====
$('.content').each(function(){
    var str = $(this).html();
    var regex = /((http|https):\/\/([\w\-.]+)\/([^< )\s])+)/ig;
    var replaced_text = str.replace(regex, "<a href='$1' target='_blank'>$1</a>");
    $(this).html(replaced_text);
});

// Perpetrator ID, Steam name, avatar & aliases
var steam_id = $('input[name="steam_id"]').val();
var storage = $.localStorage;
var steamapi = storage.get('SteamApi');
var last_version = storage.get('last_version');

// ===== Versioning =====
if (version != last_version) {
    storage.set('last_version', version);
    $('#version_detected').popover('show');
} else {
    storage.set('last_version', version);
};

// ==== Settings Modal =====
var settings_modal = '<div class="modal fade ets2mp-modal" id="script-settings" tabindex="-1">' +
    '<div class="modal-dialog">' +
        '<div class="modal-content">' +
            '<div class="modal-header">' +
                '<h2>Reports Improved Settings</h2>' +
            '</div>' +
            '<div class="modal-body">'+
                '<div class="form-group">'+
                    '<label for="steamapi_id">Steam Web API Key (<a href="http://j.mp/1Slqt8b" target="_blank">how to get it?</a>)</label> <input class="form-control" name="steamapi_id" id="steamapi_id" placeholder="Paste it here or Kappa" type="text" value="' + steamapi + '">'+
                    'If you don\'t want to use Steam integration, click on Kappa <img src="http://www.rivsoft.net/content/icons/kappa_big.png" id="Kappa">' +
                '</div>'+
                '<hr>'+
                '<h4>Own PlusDate Buttons (piece of shiet, just forget about it)</h4>' +
                '<hr>'+
                '<h3>Own Reasons Buttons (stay tuned)</h3>' +
                '<div class="form-group">'+
                    '<label for="plusdate-own-buttons">Own code</label> <textarea class="form-control" rows="3" id="plusdate-own-buttons" name="plusdate-own-buttons" disabled>[{"type": "Reason", "text": "Insulting"},  {"type": "Prefix", "text": "Intensional"}, {"type": "Postfix", "text": "// FACK YOU"}]</textarea>' +
                '</div>'+
                '<div class="form-group clearfix">'+
                    '<div class="col-md-6 col-xs-12">' +
                    '   <h3>Syntax:</h3>' +
                    '   <p><kbd>[{"type": "Reason", "text": "LOLOLOL"}, ...]</kbd></p>' +
                    '   <table class="table table-striped table-bordered">' +
                    '     <tbody>'+
                    '       <tr>'+
                    '         <th>Key</th>'+
                    '         <th>Explanation</th>'+
                    '       </tr>'+
                    '       <tr>'+
                    '         <td><kbd>type</kbd></td>'+
                    '         <td>Type of text (see table ->). <b>Required</b>.</td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '         <td><kbd>text</kbd></td>'+
                    '         <td>Text LOL. <b>Required</b>.</td>'+
                    '       </tr>'+
                    '     </tbody>'+
                    '   </table>'+
                    '</div>' +
                    '<div class="col-md-6 col-xs-12">' +
                    '   <h3>"bit" variations: </h3>' +
                    '   <table class="table table-striped table-bordered">' +
                    '     <tbody>'+
                    '       <tr>'+
                    '         <th>Key</th>'+
                    '         <th>Explanation</th>'+
                    '       </tr>'+
                    '       <tr>'+
                    '         <td>Reason</td>'+
                    '         <td>Main text, placed after all the text + Space symbol</td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '         <td>Prefix</td>'+
                    '         <td>Placed before all the text + Space symbol</td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '         <td>Postfix</td>'+
                    '         <td>Like Reasons, but it is not main.</td>'+
                    '       </tr>'+
                    '     </tbody>'+
                    '   </table>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="modal-footer">'+
                '<button class="btn btn-default" data-dismiss="modal" type="button">Cancel</button> <button class="btn btn-danger" id="script-settings-submit">Save</button>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';
$(settings_modal).insertBefore('.footer-v1');
$('#script-settings-submit').on('click', function(event) {
    if (($('#steamapi_id').val().length == 32) || ($('#steamapi_id').val() == "Kappa")) {
        alert("Good choice!");
        storage.set('SteamApi', $('#steamapi_id').val());
        location.reload();
    } else {
        alert("Wrong Key!");
    }
});
$('#Kappa').on('click', function(event) {
    event.preventDefault();
    result = confirm("Are you sure? This is not funny!!!!! #blame" + $('body > div.wrapper > div.header > div.container > div > ul > li:nth-child(1) > a').html());
    if (result) {
        $('#steamapi_id').val("Kappa");
        storage.set('SteamApi', "Kappa");
        location.reload();
    }
});

if (steamapi === "Kappa") {
    console.log(":O");
    $("body > div.wrapper > div.breadcrumbs > div > h1").append("<kbd>#blame" + $('body > div.wrapper > div.header > div.container > div > ul > li:nth-child(1) > a').html()+"</kbd>");
    $("#loading-spinner").remove();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
} else if (steamapi !== null && steamapi != "http://steamcommunity.com/dev/apikey") {
    $.ajax({
        url: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + steamapi + "&format=json&steamids=" + steam_id,
        xhr: function(){return new GM_XHR();},
        type: 'GET',
        success: function(val){
            var player_data = val;
            var steam_name = player_data.response.players[0].personaname;
            var steam_link = '<span id="steam_LOL"> aka <a href="http://steamcommunity.com/profiles/' + steam_id + '" target="_blank"><kbd>' + steam_name + '</kbd> <img src="'+ player_data.response.players[0].avatar + '" class="img-rounded"></a></span>';
            $(steam_link).insertAfter('tr:nth-child(2) > td:nth-child(2) > a');

            $.ajax({
                url: "http://steamcommunity.com/profiles/" + steam_id + "/ajaxaliases",
                xhr: function(){return new GM_XHR();},
                type: 'GET',
                success: function(val){
                    var steam_aliases = val;
                    var aliases = "";
                    for(var key in steam_aliases) {
                        aliases += '<kbd  data-toggle="tooltip" title="' + steam_aliases[key].timechanged + '">' + steam_aliases[key].newname + '</kbd>   ';
                    }
                    aliases = '<tr><td>Aliases</td><td>'+ aliases +'</td></tr>';
                    $(aliases).insertAfter('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2)');

                    // AFTER ALL!!!!!!!
                    $("#loading-spinner").remove();
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip()
                    })
                }
            });
        }
    });

} else {
    alert("Hello! Looks like this is your first try in Reports Improved! I'll open the settings for you...");
    $('#script-settings').modal('toggle');
}

var perpetrator = $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > a').attr('href').replace('/user/', '');
if (perpetrator <= 2300) {
    var low_id = ' <span class="badge badge-red" data-toggle="tooltip" title="Be careful! Perpetrator ID seems to be an In-Game ID. Double-check Steam aliases!">Low ID - '+ perpetrator +'</span>';
    $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)').append(low_id);
}

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
    }
    $('#datetimeselect').val(now.format("YYYY/MM/DD HH:mm"));
});

// ===== Reasons FTW =====
$('.plusreason').on('click', function() {
    var reason_val = $('input[name="reason"]').val();
    if ($(this).data('place') == 'before') {
        $('input[name="reason"]').val($(this).html() + ' ' + reason_val);
    } else {
        $('input[name="reason"]').val(reason_val + ' ' + $(this).html());
    }
});
$('button#reason_clear').on('click', function() {
    $('input[name="reason"]').val("");
});

// ===== Comments Nice Look =====
$(".comment > p").each(function(index, el) {
    $("<hr>").insertAfter(this);
    $(this).wrap("<blockquote></blockquote>");
});

function GM_XHR() {
    this.type = null;
    this.url = null;
    this.async = null;
    this.username = null;
    this.password = null;
    this.status = null;
    this.headers = {};
    this.readyState = null;

    this.abort = function() {
        this.readyState = 0;
    };

    this.getAllResponseHeaders = function(name) {
      if (this.readyState!=4) return "";
      return this.responseHeaders;
    };

    this.getResponseHeader = function(name) {
      var regexp = new RegExp('^'+name+': (.*)$','im');
      var match = regexp.exec(this.responseHeaders);
      if (match) { return match[1]; }
      return '';
    };

    this.open = function(type, url, async, username, password) {
        this.type = type ? type : null;
        this.url = url ? url : null;
        this.async = async ? async : null;
        this.username = username ? username : null;
        this.password = password ? password : null;
        this.readyState = 1;
    };

    this.setRequestHeader = function(name, value) {
        this.headers[name] = value;
    };

    this.send = function(data) {
        this.data = data;
        var that = this;
        GM_xmlhttpRequest({
            method: this.type,
            url: this.url,
            headers: this.headers,
            data: this.data,
            onload: function(rsp) {
                for (var k in rsp) {
                    that[k] = rsp[k];
                }
                that.onreadystatechange();
            },
            onerror: function(rsp) {
                for (var k in rsp) {
                    that[k] = rsp[k];
                }
            }
        });
    };
}