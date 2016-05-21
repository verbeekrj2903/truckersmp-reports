// ==UserScript==
// @name         TruckersMP Reports Improved
// @description  Only for TruckersMP Admins
// @namespace    http://truckersmp.com/
// @version      2.0.0
// @author       CJMAXiK
// @icon         http://truckersmp.com/assets/images/favicon.png
// @match        *://truckersmp.com/*/reports/view/*
// @include      *://truckersmp.com/*/reports/view/*
// @homepageURL  https://openuserjs.org/scripts/cjmaxik/TruckersMP_Reports_Improved
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js
// @require      https://www.gstatic.com/firebasejs/live/3.0/firebase.js
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @connect      self
// @connect      steampowered.com
// @connect      steamcommunity.com
// @connect      jmdev.ca
// @connect      firebaseio.com
// @connect      firebaseapp.com
// @connect      appspot.com
// @connect      *
// @updateURL    https://openuserjs.org/meta/cjmaxik/TruckersMP_Reports_Improved.meta.js
// @noframes
// @copyright    2016, CJMAXiK (http://cjmaxik.ru/)
// ==/UserScript==
// ==OpenUserJS==
// @author       CJMAXiK
// ==/OpenUserJS==
/* jshint -W097 */

var version = "2.0.0";
console.log("TruckersMP Reports Improved INBOUND! Question - to @cjmaxik on Slack!");
$('body > div.wrapper > div.breadcrumbs > div > h1').append(' Improved <span class="badge" data-toggle="tooltip" title="by @cjmaxik">' + version + '</span> <a href="https://www.jmdev.ca/url/" target="_blank"><i class="fa fa-link" data-toggle="tooltip" title="URL Shortener"></i></a> <a href="#" data-toggle="modal" data-target="#script-settings"><i class="fa fa-cog" data-toggle="tooltip" title="Script settings"></i></a> <a href="http://bit.ly/BlameAnybody" target="_blank" id="version_detected" data-toggle="popover" data-trigger="focus" title="YAY! v.' + version + ' has been deployed!" data-content="Your handy-dandy script just updated! See what you get?"><i class="fa fa-question" data-toggle="tooltip" title="Changelog"></i></a>  <i class="fa fa-spinner fa-spin" id="loading-spinner"></i>');

// ===== Firebase =====
var config = {
    apiKey: "AIzaSyBvswUAgDHFFw6pthk6nr7A414XHzRFqUw",
    authDomain: "project-9116129543653340625.firebaseapp.com",
    databaseURL: "https://project-9116129543653340625.firebaseio.com",
    storageBucket: "project-9116129543653340625.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();

function writeUserData(steamapi, prefixes, reasons, postfixes, declines) {
    if (confirm("Do you really want to save this data into Cloud?")) {
        database.ref('admin/' + steamapi).remove();
        database.ref('admin/' + steamapi).set({
            prefixes: prefixes,
            reasons: reasons,
            postfixes: postfixes,
            declines: declines
        });
        alert("YAY! Remember to Save & Reload!");
        // alert(firebase.database().error());
    }
};

function readUserData(steamapi) {
    if (confirm("Do you really want to download data from Cloud? This action rewrite all current data!")) {
        database.ref('admin/' + steamapi).once('value').then(function(snapshot) {
            item = snapshot.val();
            if (item) {
                storage.setItem('OwnReasons', JSON.stringify(item));
                location.reload();
            } else {
                alert("Your Cloud is empty. Try to save some data :)");
            }
        });
    };
}

// ===== Bootstrapping =====
var now = moment.utc();

var date_buttons = '<br>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="3hrs">+3 hrs</button>     ' +
    '<button type="button" class="btn btn-default plusdate" data-plus="1day">+1 day</button>' +
    '<button type="button" class="btn btn-default plusdate" data-plus="3day">+3</button>     ' +
    '<button type="button" class="btn btn-warning plusdate" data-plus="1week">+1 week</button>     ' +
    '<button type="button" class="btn btn-danger plusdate" data-plus="1month">+1 month</button>' +
    '<button type="button" class="btn btn-danger plusdate" data-plus="3month">+3</button>' +
    '<button type="button" class="btn btn-xs btn-link plusdate" data-plus="clear">Current UTC time</button>';

$(date_buttons).insertAfter('#confirm-accept > div > div > form > div.modal-body > div:nth-child(5) > label:nth-child(4)');
$('input[id="perma.false"]').prop("checked", true);

// ===== Links in content =====
$('.content').each(function(){
    'use strict';
    var str = $(this).html();
    var regex = /((http|https):\/\/([\w\-.]+)\/([^< )\s,\[])+)/gi;
    var replaced_text = str.replace(regex, '<a href="$1" target="_blank" class="replaced">$1</a> <a href="#" class="jmdev_ca" data-link="$1"><i class="fa fa-link" data-toggle="tooltip" title="Click on me to get the shorter version to your clipboard"></i></a>');
    $(this).html(replaced_text);
});

$('a.replaced').each(function(index, el) {
    'use strict';
    var sub = $(this).text();
    if (sub.length > 60) {
        $(this).text(sub.substring(0, 40) + '...');
    }
});

// Perpetrator ID, Steam name, avatar & aliases
var steam_id = $('input[name="steam_id"]').val();
var storage = localStorage;
var steamapi = storage.getItem('SteamApi');
var last_version = storage.getItem('truckersmp-reports-last_version');
var OwnReasons = JSON.parse(storage.getItem('OwnReasons'));
var report_language = $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(7) > td:nth-child(2)').text().trim();

// ===== Versioning =====
if (version != last_version) {
    storage.setItem('truckersmp-reports-last_version', version);
    $('#version_detected').popover('show');
    $('#version_detected').popover('show');
    setTimeout(function() {
        'use strict';
        $('#version_detected').popover('hide');
    }, 4000);
    $('h3.popover-title').css('background-color', '#555').css('font-weight', 'bold');
} else {
    storage.setItem('truckersmp-reports-last_version', version);
}

// ===== Comment Language =====
// alert(report_language);
switch (report_language) {
    case 'English': comment = 'Thank you for the report :)'; break;
    case 'German': comment = 'Wir bedanken uns für deinen Report :)'; break;
    case 'Turkish': comment = 'Raporun için teşekkür ederim :)'; break;
    case 'Norwegian': comment = 'Takk for rapporten :)'; break;
    case 'Spanish': comment = 'Muchas gracias por tu reporte :)'; break;
    case 'Dutch': comment = 'Bedankt voor de report :)'; break;
    case 'Polish': comment = 'Dziękuję za report :)'; break;
    case 'Russian': comment = 'Спасибо за репорт :)'; break;
    case 'French': comment = 'Merci pour le rapport :)'; break;
    default: comment = 'Thank you for the report :)';
}
$('#confirm-accept > div > div > form > div.modal-body > div:nth-child(7) > textarea').val(comment);

// ==== OwnReasons buttons
var default_OwnReasons = JSON.stringify({
    prefixes: "Intentional",
    reasons: "Ramming, Blocking, Wrong Way, Insulting, Trolling, Reckless Driving, Offensive language, Griefing, Driving without lights, Overtaking at EP, |, Change your Steam name and make a ban appeal",
    postfixes: "// 1 m due to history, // 3 m due to history, |, // Perma due to history",
    declines: "Insufficient Evidence, No evidence, Only a kickable offence, Wrong ID, No offence, Already banned for this evidence"
});
if (!storage.OwnReasons) {
    storage.setItem('OwnReasons', default_OwnReasons);
    OwnReasons = default_OwnReasons;
}

var reason_buttons = construct_buttons(OwnReasons, false);
var decline_buttons = construct_buttons(OwnReasons, true);
$(reason_buttons).insertAfter('#confirm-accept > div > div > form > div.modal-body > div:nth-child(6) > input');
$(decline_buttons).insertAfter('#confirm-decline > div > div > form > div.modal-body > div > textarea');

// ==== Settings Modal =====
var settings_modal = '<div class="modal fade ets2mp-modal" id="script-settings" tabindex="-1">' +
    '<div class="modal-dialog">' +
        '<div class="modal-content">' +
            '<div class="modal-header">' +
                '<h2>Reports Improved Settings</h2>' +
            '</div>' +
            '<div class="modal-body">'+
                '<div class="form-group">'+
                    '<label for="steamapi_id">Steam Web API Key (<a href="http://jmdev.ca/url?l=12a81" target="_blank">how to get it?</a>)</label> <input class="form-control" name="steamapi_id" id="steamapi_id" placeholder="Paste it here or Kappa" type="text" value="' + steamapi + '">'+
                    'This key is needed for Steam integration AND Cloud sync (key is your credentials). If you don\'t want to use Steam integration, click on Kappa <img src="http://s019.radikal.ru/i600/1603/56/506aefc956d7.png" id="Kappa">' +
                '</div>'+
                '<hr>'+
                '<h3>Own Reasons Buttons <small>(use Comma <kbd>,</kbd> to split variants and Vertical slash <kbd>|</kbd> for separator)</small></h3>' +
                '<div class="form-group">'+
                    '<label for="plusreason-own-Prefixes">Prefixes</label> <textarea class="form-control" rows="2" id="plusreason-own-Prefixes" name="plusreason-own-Prefixes"></textarea>' +
                '</div>'+
                '<div class="form-group">'+
                   '<label for="plusreason-own-Reasons">Reasons</label> <textarea class="form-control" rows="3" id="plusreason-own-Reasons" name="plusreason-own-Reasons"></textarea>' +
                '</div>'+
                '<div class="form-group">'+
                   '<label for="plusreason-own-Postfixes">Postfixes</label> <textarea class="form-control" rows="3" id="plusreason-own-Postfixes" name="plusreason-own-Postfixes"></textarea>' +
                '</div>'+
                '<div class="form-group">'+
                   '<label for="plusreason-own-Declines">Declines</label> <textarea class="form-control" rows="3" id="plusreason-own-Declines" name="plusreason-own-Declines"></textarea>' +
                '</div>'+
            '</div>'+
            '<div class="modal-footer">'+
                '<div class="btn-toolbar pull-right">' +
                    '<button class="btn btn-danger" id="script-settings-submit">Save & Reload page</button>     '+
                    '<div class="btn-group">' +
                        '<button class="btn btn-primary" id="script-settings-write-data" data-toggle="tooltip" title="Save OwnReasons into Cloud"><i class="fa fa-cloud-upload"></i></button>'+
                        '<button class="btn btn-primary" id="script-settings-read-data" data-toggle="tooltip" title="Download OwnReasons from Cloud"><i class="fa fa-cloud-download"></i></button>'+
                    '</div>' +
                '</div>' +
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';

$(settings_modal).insertBefore('.footer-v1');

$('#plusreason-own-Prefixes').val(OwnReasons.prefixes);
$('#plusreason-own-Reasons').val(OwnReasons.reasons);
$('#plusreason-own-Postfixes').val(OwnReasons.postfixes);
$('#plusreason-own-Declines').val(OwnReasons.declines);

$('#script-settings-write-data').on('click', function(event) {
    'use strict';
    event.preventDefault();

    var new_prefixes = $('#plusreason-own-Prefixes').val().trim();
    var new_reasons = $('#plusreason-own-Reasons').val().trim();
    var new_postfixes = $('#plusreason-own-Postfixes').val().trim();
    var new_declines = $('#plusreason-own-Declines').val().trim();

    writeUserData(steamapi, new_prefixes, new_reasons, new_postfixes, new_declines);
})

$('#script-settings-read-data').on('click', function(event) {
    'use strict';
    event.preventDefault();
    readUserData(steamapi);
})

$('#script-settings-submit').on('click', function(event) {
    'use strict';
    event.preventDefault();
    // PlusReasons settings saving
    var new_OwnReasons = JSON.stringify({
        prefixes: $('#plusreason-own-Prefixes').val().trim(),
        reasons: $('#plusreason-own-Reasons').val().trim(),
        postfixes: $('#plusreason-own-Postfixes').val().trim(),
        declines: $('#plusreason-own-Declines').val().trim()
    });

    if (new_OwnReasons) {
        storage.setItem('OwnReasons', new_OwnReasons);
    }

    // Key checking & saving
    if (($('#steamapi_id').val().length == 32) || ($('#steamapi_id').val() == "Kappa")) {
        alert("Settings are saved!");
        storage.setItem('SteamApi', $('#steamapi_id').val());
        location.reload();
    } else {
        alert("Wrong API Key! Please change it or Kappa.");
    }
});
$('#Kappa').on('click', function(event) {
    'use strict';
    event.preventDefault();
    result = confirm("Are you sure? This is not funny!!!!! #blame" + $('body > div.wrapper > div.header > div.container > div > ul > li:nth-child(1) > a').html());
    if (result) {
        $('#steamapi_id').val("Kappa");
        storage.setItem('SteamApi', "Kappa");
        location.reload();
    }
});

if (steamapi === "Kappa") {
    console.log(":O");
    $("body > div.wrapper > div.breadcrumbs > div > h1").append("<kbd>#blame" + $('body > div.wrapper > div.header > div.container > div > ul > li:nth-child(1) > a').html()+"</kbd>");
    $("#loading-spinner").hide();
    $(function () {
        'use strict';
        $('[data-toggle="tooltip"]').tooltip();
    });
} else if (steamapi !== null && steamapi != "http://steamcommunity.com/dev/apikey") {
    $.ajax({
        url: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + steamapi + "&format=json&steamids=" + steam_id,
        xhr: function(){
            'use strict';
            return new GM_XHR();
        },
        type: 'GET',
        success: function(val){
            'use strict';
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
                    if (!$.isEmptyObject(steam_aliases)) {
                        for (var key in steam_aliases) {
                            aliases += '<kbd  data-toggle="tooltip" title="' + steam_aliases[key].timechanged + '">' + steam_aliases[key].newname + '</kbd>   ';
                        }
                        aliases = '<tr><td>Aliases</td><td>'+ aliases +'</td></tr>';
                        $(aliases).insertAfter('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2)');
                    };
                    $("#loading-spinner").hide();
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip()
                    });
                }
            });
        }
    });

} else {
    alert("Hello! Looks like this is your first try in Reports Improved! I'll open the settings for you...");
    $('#script-settings').modal('toggle');
}

var perpetrator_id = $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > a').attr('href').replace('/user/', '');
if (perpetrator_id <= 2300) {
    var low_id = ' <span class="badge badge-red" data-toggle="tooltip" title="Be careful! Perpetrator ID seems to be an In-Game ID. Double-check Steam aliases!">Low ID - '+ perpetrator_id +'</span>';
} else {
    var low_id = ' <span class="badge badge-blue" data-toggle="tooltip" title="ID is legit">'+ perpetrator_id +'</span>';
}
$('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)').append(low_id);

// ===== Timing FTW! =====
$('.plusdate').on("click", function(event) {
    event.preventDefault();
    switch ($(this).data("plus")) {
        case '3hrs':
            now.add(3, 'h');
            break;
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
            now = moment.utc();
            break;
    }
    $('#datetimeselect').val(now.format("YYYY/MM/DD HH:mm"));
});

// ===== Reasons FTW =====
$('.plusreason').on('click', function(event) {
    event.preventDefault();
    var reason_val = $('input[name="reason"]').val();
    if ($(this).data('place') == 'before') {
        $('input[name="reason"]').val($(this).html() + ' ' + reason_val);
    } else {
        $('input[name="reason"]').val(reason_val + ' ' + $(this).html() + ' ');
    }
    $('input[name="reason"]').focus();
});

// ===== Decline FTW =====
$('.plusdecline').on('click', function(event) {
    event.preventDefault();
    var reason_val = $('#confirm-decline > div > div > form > div.modal-body > div > textarea').val();
    if ($(this).data('place') == 'before') {
        $('#confirm-decline > div > div > form > div.modal-body > div > textarea').val($(this).html() + ' ' + reason_val);
    } else {
        $('#confirm-decline > div > div > form > div.modal-body > div > textarea').val(reason_val + ' ' + $(this).html());
    }
    $('#confirm-decline > div > div > form > div.modal-body > div > textarea').focus();
});

$('button#reason_clear').on('click', function(event) {
    event.preventDefault();
    $('input[name="reason"]').val("");
});
$('button#decline_clear').on('click', function(event) {
    event.preventDefault();
    $('#confirm-decline > div > div > form > div.modal-body > div > textarea').val("");
});

// ===== Comments Nice Look =====
$(".comment > p").each(function(index, el) {
    $('<hr style="margin: 10px 0 !important;">').insertAfter(this);
    $(this).wrap("<blockquote></blockquote>");
});

// ===== URL Shortener =====
$('a.jmdev_ca').on('click', function(event) {
    event.preventDefault();
    $("#loading-spinner").show();

    var link = encodeURIComponent($(this).data("link"));
    var length = link.length;

    if (length < 27) {
        result = confirm("This URL is short enough. Do you really want it?");
        if (!result) {
            return false;
        }
    };

    $.ajax({
        url: "http://jmdev.ca/url/algo.php?method=insert&url=" + link,
        xhr: function(){return new GM_XHR();},
        type: 'GET',
        success: function(val) {
            GM_setClipboard('http://jmdev.ca/url/?l=' + val.result.url_short);
            GM_notification('This is a success message! Check your clipboard!');
        },
        error: function() {
            GM_notification('Looks like we have a problem with URL shortener...');
        },
        complete: function() {
            $("#loading-spinner").hide();
        }
    });
});

// ===== DateTime and Reason inputs checking =====
$('#confirm-accept > div > div > form').on('submit', function(event) {
    var time_check = $('#datetimeselect').val();
    var perm_check = $('input[id="perma.true"]').prop("checked");
    console.log(perm_check);
    var reason_check = $('#confirm-accept > div > div > form > div.modal-body > div:nth-child(6) > input').val();
    var error_style = {
        'border-color': '#a94442',
        '-webkit-box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)',
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)'
    }
    var normal_style = {
        'border-color': '',
        '-webkit-box-shadow': '',
        'box-shadow': ''
    }

    if (!time_check && !perm_check) {
        $('#datetimeselect').css(error_style);
        event.preventDefault();
    } else {
        $('#datetimeselect').css(normal_style);
    };

    if (!reason_check) {
        $('#confirm-accept > div > div > form > div.modal-body > div:nth-child(6) > input').css(error_style);
        event.preventDefault();
    } else {
        $('#confirm-accept > div > div > form > div.modal-body > div:nth-child(6) > input').css(normal_style);
    }
});

$('#confirm-decline > div > div > form').on('submit', function(event) {
    var comment_check = $('#confirm-decline > div > div > form > div.modal-body > div > textarea').val();
    var error_style = {
        'border-color': '#a94442',
        '-webkit-box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)',
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)'
    }
    var normal_style = {
        'border-color': '',
        '-webkit-box-shadow': '',
        'box-shadow': ''
    }

    if (!comment_check) {
        $('#confirm-decline > div > div > form > div.modal-body > div > textarea').css(error_style);
        event.preventDefault();
    } else {
        $('#confirm-decline > div > div > form > div.modal-body > div > textarea').css(normal_style);
    }
});

// ===== Dropdown enhancements =====
$('ul.dropdown-menu').css('top', '95%');

$(".dropdown").hover(
function() {
    $('.dropdown-menu', this).stop( true, true ).fadeIn("fast");
    $(this).toggleClass('open');
    $('b', this).toggleClass("caret caret-up");
},
function() {
    $('.dropdown-menu', this).stop( true, true ).fadeOut("fast");
    $(this).toggleClass('open');
    $('b', this).toggleClass("caret caret-up");
});

/**
 * construct_buttons - PlusReasons Constructor
 * @param  {object} OwnReasons   OwnReasons object
 * @return {string} html         HTML snippet
 */
function construct_buttons(OwnReasons, if_decline) {
    var html = '<br>';

    if (if_decline) {
        console.log(typeof OwnReasons);
        var declines = OwnReasons.declines.split(',');

        html += each_type('Declines', declines);
        html += '<button type="button" class="btn btn-link" id="decline_clear">Clear</button>';
    } else {
        console.log(typeof OwnReasons);
        var prefixes = OwnReasons.prefixes.split(',');
        var reasons = OwnReasons.reasons.split(',');
        var postfixes = OwnReasons.postfixes.split(',');

        html += each_type('Prefixes', prefixes);
        html += each_type('Reasons', reasons);
        html += each_type('Postfixes', postfixes);
        html += '<button type="button" class="btn btn-link" id="reason_clear">Clear</button>';
    }


    return html;

    function each_type(type, buttons) {
        var place, color, change;
        if (type == 'Prefixes') {
            place = 'before';
            color = 'warning';
            change = 'reason';
        } else if (type == 'Reasons'){
            place = 'after';
            color = 'default';
            change = 'reason';
        } else if (type == 'Postfixes'){
            place = 'after';
            color = 'danger';
            change = 'reason';
        } else if (type == 'Declines'){
            place = 'after';
            color = 'info';
            change = 'decline';
        }
        var snippet = '<div class="btn-group dropdown"><a class="btn btn-' + color + ' dropdown-toggle" data-toggle="dropdown" href="#">' +
            type + ' <span class="caret"></span></a><ul class="dropdown-menu">';

        buttons.forEach(function(item, i, arr) {
            if (item.trim() == '|') {
                snippet += '<li role="separator" class="divider"></li>';
            } else {
                snippet += '<li><a href="#" class="plus' + change + '" data-place="' + place + '">' + item.trim() + '</a></li>';
            }
        });

        snippet += '</ul></div>     ';
        return snippet;
    }
}

/**
 *
 * Queries Helper
 */
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
