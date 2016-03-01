// ==UserScript==
// @name         TruckersMP Reports Improved
// @description  Only for TruckersMP Admins
// @namespace    http://truckersmp.com/
// @version      1.5.0
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
"use strict";/**
 * construct_buttons - PlusReasons Constructor
 * @param  {object} OwnReasons   OwnReasons object
 * @return {string} html         HTML snippet
 */
function construct_buttons(OwnReasons,if_decline){function each_type(type,buttons){var place,color,change;"Prefixes"==type?(place="before",color="warning",change="reason"):"Reasons"==type?(place="after",color="default",change="reason"):"Postfixes"==type?(place="after",color="danger",change="reason"):"Declines"==type&&(place="after",color="info",change="decline");var snippet='<div class="btn-group"><a class="btn btn-'+color+' dropdown-toggle" data-toggle="dropdown" href="#">'+type+' <span class="caret"></span></a><ul class="dropdown-menu">';return buttons.forEach(function(item){snippet+="|"==item.trim()?'<li role="separator" class="divider"></li>':'<li><a href="#" class="plus'+change+'" data-place="'+place+'">'+item.trim()+"</a></li>"}),snippet+="</ul></div>     "}var html="<br>";if(if_decline){var declines=OwnReasons.declines.split(",");html+=each_type("Declines",declines),html+='<button type="button" class="btn btn-link" id="decline_clear">Clear</button>'}else{var prefixes=OwnReasons.prefixes.split(","),reasons=OwnReasons.reasons.split(","),postfixes=OwnReasons.postfixes.split(",");html+=each_type("Prefixes",prefixes),html+=each_type("Reasons",reasons),html+=each_type("Postfixes",postfixes),html+='<button type="button" class="btn btn-link" id="reason_clear">Clear</button>'}return html}/**
 * Queries Helper
 */
function GM_XHR(){this.type=null,this.url=null,this.async=null,this.username=null,this.password=null,this.status=null,this.headers={},this.readyState=null,this.abort=function(){this.readyState=0},this.getAllResponseHeaders=function(){return 4!=this.readyState?"":this.responseHeaders},this.getResponseHeader=function(name){var regexp=new RegExp("^"+name+": (.*)$","im"),match=regexp.exec(this.responseHeaders);return match?match[1]:""},this.open=function(type,url,async,username,password){this.type=type?type:null,this.url=url?url:null,this.async=async?async:null,this.username=username?username:null,this.password=password?password:null,this.readyState=1},this.setRequestHeader=function(name,value){this.headers[name]=value},this.send=function(data){this.data=data;var that=this;GM_xmlhttpRequest({method:this.type,url:this.url,headers:this.headers,data:this.data,onload:function(rsp){for(var k in rsp)that[k]=rsp[k];that.onreadystatechange()},onerror:function(rsp){for(var k in rsp)that[k]=rsp[k]}})}}var version="1.5.0";$("body > div.wrapper > div.breadcrumbs > div > h1").append(' Improved <span class="badge" data-toggle="tooltip" title="by @cjmaxik">'+version+'</span> <a href="#" data-toggle="modal" data-target="#script-settings"><i class="fa fa-cog" data-toggle="tooltip" title="Script settings"></i></a> <a href="http://bit.ly/BlameAnybody" target="_blank" id="version_detected" data-toggle="popover" data-trigger="focus" title="YAY! v.'+version+' has been deployed!" data-content="Your handy-dandy script just updated! See what you get?"><i class="fa fa-question" data-toggle="tooltip" title="Changelog"></i></a> <i class="fa fa-spinner fa-spin" id="loading-spinner"></i>');
// ===== Bootstrapping =====
var now=moment(),date_buttons='<br><button type="button" class="btn btn-default plusdate" data-plus="1day">+1 day</button><button type="button" class="btn btn-default plusdate" data-plus="3day">+3</button>     <button type="button" class="btn btn-warning plusdate" data-plus="1week">+1 week</button>     <button type="button" class="btn btn-danger plusdate" data-plus="1month">+1 month</button><button type="button" class="btn btn-danger plusdate" data-plus="3month">+3</button><button type="button" class="btn btn-xs btn-link plusdate" data-plus="clear">Current time</button>';$(date_buttons).insertAfter("#confirm-accept > div > div > form > div.modal-body > div:nth-child(5) > label:nth-child(4)"),$('input[id="perma.false"]').prop("checked",!0),
// ===== Links in content =====
$(".content").each(function(){var str=$(this).html(),regex=/((http|https):\/\/([\w\-.]+)\/([^< )\s])+)/gi,replaced_text=str.replace(regex,"<a href='$1' target='_blank'>$1</a>");$(this).html(replaced_text)});
// Perpetrator ID, Steam name, avatar & aliases
var steam_id=$('input[name="steam_id"]').val(),storage=$.localStorage,steamapi=storage.get("SteamApi"),last_version=storage.get("truckersmp-reports-last_version"),OwnReasons=storage.get("OwnReasons");
// ===== Versioning =====
version!=last_version?(storage.set("truckersmp-reports-last_version",version),$("#version_detected").popover("show")):storage.set("truckersmp-reports-last_version",version);
// ==== OwnReasons buttons
var default_OwnReasons={prefixes:"Intentional",reasons:"Ramming, Blocking, Wrong Way, Insulting, Trolling, Reckless Driving, Offensive language",postfixes:"// 1 m due to history, // 3 m due to history, // Perma due to history, |, Next time is ",declines:"Insufficient Evidence, Only a kickable offence, Wrong ID"};(!storage.isSet("OwnReasons")||storage.isEmpty("OwnReasons"))&&(storage.set("OwnReasons",default_OwnReasons),OwnReasons=default_OwnReasons);var reason_buttons=construct_buttons(OwnReasons,!1),decline_buttons=construct_buttons(OwnReasons,!0);$(reason_buttons).insertAfter("#confirm-accept > div > div > form > div.modal-body > div:nth-child(6) > input"),$(decline_buttons).insertAfter("#confirm-decline > div > div > form > div.modal-body > div > textarea");
// ==== Settings Modal =====
var settings_modal='<div class="modal fade ets2mp-modal" id="script-settings" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h2>Reports Improved Settings</h2></div><div class="modal-body"><div class="form-group"><label for="steamapi_id">Steam Web API Key (<a href="http://j.mp/1Slqt8b" target="_blank">how to get it?</a>)</label> <input class="form-control" name="steamapi_id" id="steamapi_id" placeholder="Paste it here or Kappa" type="text" value="'+steamapi+'">If you don\'t want to use Steam integration, click on Kappa <img src="http://www.rivsoft.net/content/icons/kappa_big.png" id="Kappa"></div><hr><h3>Own Reasons Buttons <small>(use Comma <kbd>,</kbd> symbol to split variants and Vertical slash <kbd>|</kbd> symbol for separator)</small></h3><div class="form-group"><label for="plusreason-own-Prefixes">Prefixes</label> <textarea class="form-control" rows="2" id="plusreason-own-Prefixes" name="plusreason-own-Prefixes"></textarea></div><div class="form-group"><label for="plusreason-own-Reasons">Reasons</label> <textarea class="form-control" rows="2" id="plusreason-own-Reasons" name="plusreason-own-Reasons"></textarea></div><div class="form-group"><label for="plusreason-own-Postfixes">Postfixes</label> <textarea class="form-control" rows="2" id="plusreason-own-Postfixes" name="plusreason-own-Postfixes"></textarea></div><div class="form-group"><label for="plusreason-own-Declines">Declines</label> <textarea class="form-control" rows="2" id="plusreason-own-Declines" name="plusreason-own-Declines"></textarea></div></div><div class="modal-footer"><button class="btn btn-default" data-dismiss="modal" type="button">Cancel</button> <button class="btn btn-danger" id="script-settings-submit">Save & Reload page</button></div></div></div></div>';$(settings_modal).insertBefore(".footer-v1"),$("#plusreason-own-Prefixes").val(OwnReasons.prefixes),$("#plusreason-own-Reasons").val(OwnReasons.reasons),$("#plusreason-own-Postfixes").val(OwnReasons.postfixes),$("#plusreason-own-Declines").val(OwnReasons.declines),$("#script-settings-submit").on("click",function(){
// PlusReasons settings saving
var new_OwnReasons={prefixes:$("#plusreason-own-Prefixes").val().trim(),reasons:$("#plusreason-own-Reasons").val().trim(),postfixes:$("#plusreason-own-Postfixes").val().trim(),declines:$("#plusreason-own-Declines").val().trim()};new_OwnReasons&&storage.set("OwnReasons",new_OwnReasons),
// Key checking & saving
32==$("#steamapi_id").val().length||"Kappa"==$("#steamapi_id").val()?(alert("Settings are saved!"),storage.set("SteamApi",$("#steamapi_id").val()),location.reload()):alert("Wrong API Key! Please change it or Kappa.")}),$("#Kappa").on("click",function(event){event.preventDefault(),result=confirm("Are you sure? This is not funny!!!!! #blame"+$("body > div.wrapper > div.header > div.container > div > ul > li:nth-child(1) > a").html()),result&&($("#steamapi_id").val("Kappa"),storage.set("SteamApi","Kappa"),location.reload())}),"Kappa"===steamapi?($("body > div.wrapper > div.breadcrumbs > div > h1").append("<kbd>#blame"+$("body > div.wrapper > div.header > div.container > div > ul > li:nth-child(1) > a").html()+"</kbd>"),$("#loading-spinner").remove(),$(function(){$('[data-toggle="tooltip"]').tooltip()})):null!==steamapi&&"http://steamcommunity.com/dev/apikey"!=steamapi?$.ajax({url:"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key="+steamapi+"&format=json&steamids="+steam_id,xhr:function(){return new GM_XHR},type:"GET",success:function(val){var player_data=val,steam_name=player_data.response.players[0].personaname,steam_link='<span id="steam_LOL"> aka <a href="http://steamcommunity.com/profiles/'+steam_id+'" target="_blank"><kbd>'+steam_name+'</kbd> <img src="'+player_data.response.players[0].avatar+'" class="img-rounded"></a></span>';$(steam_link).insertAfter("tr:nth-child(2) > td:nth-child(2) > a"),$.ajax({url:"http://steamcommunity.com/profiles/"+steam_id+"/ajaxaliases",xhr:function(){return new GM_XHR},type:"GET",success:function(val){var steam_aliases=val,aliases="";for(var key in steam_aliases)aliases+='<kbd  data-toggle="tooltip" title="'+steam_aliases[key].timechanged+'">'+steam_aliases[key].newname+"</kbd>   ";aliases="<tr><td>Aliases</td><td>"+aliases+"</td></tr>",$(aliases).insertAfter("body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2)"),$("#loading-spinner").remove(),$(function(){$('[data-toggle="tooltip"]').tooltip()})}})}}):(alert("Hello! Looks like this is your first try in Reports Improved! I'll open the settings for you..."),$("#script-settings").modal("toggle"));var perpetrator=$("body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > a").attr("href").replace("/user/","");if(2300>=perpetrator){var low_id=' <span class="badge badge-red" data-toggle="tooltip" title="Be careful! Perpetrator ID seems to be an In-Game ID. Double-check Steam aliases!">Low ID - '+perpetrator+"</span>";$("body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)").append(low_id)}
// ===== Timing FTW! =====
$(".plusdate").on("click",function(){switch($(this).data("plus")){case"1day":now.add(1,"d");break;case"3day":now.add(3,"d");break;case"1week":now.add(1,"w");break;case"1month":now.add(1,"M");break;case"3month":now.add(3,"M");break;case"clear":now=moment()}$("#datetimeselect").val(now.format("YYYY/MM/DD HH:mm"))}),
// ===== Reasons FTW =====
$(".plusreason").on("click",function(){var reason_val=$('input[name="reason"]').val();"before"==$(this).data("place")?$('input[name="reason"]').val($(this).html()+" "+reason_val):$('input[name="reason"]').val(reason_val+" "+$(this).html())}),
// ===== Decline FTW =====
$(".plusdecline").on("click",function(){var reason_val=$("#confirm-decline > div > div > form > div.modal-body > div > textarea").val();"before"==$(this).data("place")?$("#confirm-decline > div > div > form > div.modal-body > div > textarea").val($(this).html()+" "+reason_val):$("#confirm-decline > div > div > form > div.modal-body > div > textarea").val(reason_val+" "+$(this).html())}),$("button#reason_clear").on("click",function(){$('input[name="reason"]').val("")}),$("button#decline_clear").on("click",function(){$("#confirm-decline > div > div > form > div.modal-body > div > textarea").val("")}),
// ===== Comments Nice Look =====
$(".comment > p").each(function(){$("<hr>").insertAfter(this),$(this).wrap("<blockquote></blockquote>")});
