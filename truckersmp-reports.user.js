// ==UserScript==
// @name         TruckersMP Reports Improved
// @description  Only for TruckersMP Admins
// @namespace    http://truckersmp.com/
// @version      1.1.3
// @author       CJMAXiK
// @match        http://truckersmp.com/en_US/reports/view/*
// @homepageURL  https://openuserjs.org/scripts/cjmaxik/TruckersMP_Reports_Improved
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-storage-api/1.7.5/jquery.storageapi.min.js
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @copyright    2016, CJMAXiK (http://cjmaxik.ru/)
// ==/UserScript==
// ==OpenUserJS==
// @author       CJMAXiK
// ==/OpenUserJS==
/* jshint -W097 */
'use strict';
var $version = "1.1.3";
console.log("TruckersMP Reports Improved INBOUND! Question - to @cjmaxik on Slack!");
$('h1:contains("Reports")').append(" Improved (by @cjmaxik), v" + $version);

// ===== Bootstrapping =====
var now = moment();

var date_buttons = '<br>' +
	'<button type="button" class="btn btn-default plusdate" data-plus="1day">+1 day</button>' +
	'<button type="button" class="btn btn-default plusdate" data-plus="3day">+3</button>' +
	'<button type="button" class="btn btn-warning plusdate" data-plus="1week">+1 week</button>' +
	'<button type="button" class="btn btn-danger plusdate" data-plus="1month">+1 month</button>' +
	'<button type="button" class="btn btn-danger plusdate" data-plus="3month">+3</button>' +
	'<button type="button" class="btn btn-xs btn-link plusdate" data-plus="clear">NOW</button>';

$(date_buttons).insertAfter('label:contains("Time Limited")');
$('input[id="perma.false"]').prop("checked", true);

// ===== Links in content =====
$('.content').each(function(){
	var str = $(this).html();
	var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.\-]*(\?\S+[^\<\/p\>\n\ ])?)?)?)/ig;
	var replaced_text = str.replace(regex, "<a href='$1' target='_blank'>$1</a>");
	$(this).html(replaced_text);
});

// Perpetrator ID, Steam name, avatar & aliases
var steam_id = $('input[name="steam_id"]').val();
var storage = $.localStorage;
var steamapi = storage.get('SteamApi');

if (steamapi === "Kappa") {
	console.log(":O");
} else if (steamapi !== null && steamapi != "http://steamcommunity.com/dev/apikey") {
	$.ajax({
	    url: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + steamapi + "&format=json&steamids=" + steam_id,
	    xhr: function(){return new GM_XHR();},
	    type: 'GET',
	    success: function(val){
			var player_data = val;
			var steam_name = player_data.response.players[0].personaname;
			var steam_link = '<span id="steam_LOL"> aka <a href="http://steamcommunity.com/profiles/' + steam_id + '" target="_blank"><kbd>' + steam_name + '</kbd> <img src="'+ player_data.response.players[0].avatar + '"></a></span>';
			$(steam_link).insertAfter('tr:nth-child(2) > td:nth-child(2) > a');

			$.ajax({
		    	url: "http://steamcommunity.com/profiles/" + steam_id + "/ajaxaliases",
		    	xhr: function(){return new GM_XHR();},
		    	type: 'GET',
			    success: function(val){
					var steam_aliases = GM_getValue("aliases_data");
					var aliases = "";
					for(var key in steam_aliases) {
						aliases += '<kbd>' + steam_aliases[key].newname + '</kbd>   ';
					}
					aliases = '<tr><td>Aliases</td><td>'+ aliases +'</td></tr>';
					$(aliases).insertAfter('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2)');
				}
			});
	    }
	});

} else {
	var new_steamapi = prompt("If you want to use Steam integration, please paste your Steam Web API key below. If you don't, please type \"Kappa\". Copy link here, press Cancel, grab your API Key and BRB!", "http://steamcommunity.com/dev/apikey");
	storage.set('SteamApi', new_steamapi);
}

var perpetrator = $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > a').attr('href').replace('/user/', '');
if (perpetrator <= 2300) {
	var low_id = " <span class=\"badge badge-red\">Low ID!</span>";
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
		// http://wiki.greasespot.net/GM_xmlhttpRequest
		GM_xmlhttpRequest({
			method: this.type,
			url: this.url,
			headers: this.headers,
			data: this.data,
			onload: function(rsp) {
				// Populate wrapper object with returned data
				// including the Greasemonkey specific "responseHeaders"
				for (var k in rsp) {
					that[k] = rsp[k];
				}
				// now we call onreadystatechange
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