// ==UserScript==
// @name	FlickrPoolDetails
// @namespace	http://pierreandrews.net/
// @description This script brings the "detailed view" feature to the group pool pages.
// @version        0.1
// @identifier	http://pierreandrews.net/IMG/js/flickrpooldetails.user.js
// @date           2006-12-04
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://www.flickr.com/groups/sciencegroup/pool/*
// ==/UserScript==

// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// --------------------------------------------------------------------
// Copyright (C) 2006 Pierre Andrews
// 
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// The GNU General Public License is available by visiting
//   http://www.gnu.org/copyleft/gpl.html
// or by writing to
//   Free Software Foundation, Inc.
//   51 Franklin Street, Fifth Floor
//   Boston, MA  02110-1301
//   USA


(function () {

	//update information
	var SCRIPT = {
		name: "FlickrPoolDetails",
		namespace: "http://pierreandrews.net/",
		description: "This script brings the 'detailed view' feature to the group pool pages.",
		identifier: "http://pierreandrews.net/IMG/js/flickrpooldetails.user.js",
		version: "0.1",								// version
		date: (new Date("2006-12-04"))		// update date
		.valueOf()
	};
	
function ce(tag,name){
    element = document.createElement(tag);
    element.setAttribute('name',name);
  return element;
};	

	function M8_log() {
		if(unsafeWindow.console)
			unsafeWindow.console.log(arguments);
		else
			GM_log(arguments);
	}

	function getObjectMethodClosure(object, method) {
		return function(arg) {
			return object[method](arg); 
		}
	}

	var flickrpooldetails = function() {this.init();}

	flickrpooldetails.prototype = {

		init: function() {
			if(document.location.hash == '#detail') this.showPoolDetails();
			this.insertButton();
		},

		insertButton: function() {
			var links = document.evaluate(
										 "//td[@class='Section']/p[@class='Links']",
										 document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
						  ).singleNodeValue;
			if(links) {
				links.innerHTML += '<img width="1" height="11" src="/images/subnavi_dots.gif" alt=""/>';
				var a1=document.createElement('A');
				a1.setAttribute('href','javascript:;');
				var txt1=document.createTextNode('Detail View');
				a1.appendChild(txt1);
				links.appendChild(a1);
				a1.addEventListener('click',getObjectMethodClosure(this,'showPoolDetails'));
			}
		},
		
		showPoolDetails: function(arg) {
			document.location.hash = '#detail';
			M8_log("ICI");
			var shots = document.evaluate(
												 "/html/body/div[@id='Main']/div[1]//img",
												 document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);  // Get all group
			
			var self = this;
			var listener = {
				flickr_photos_getInfo_onLoad: function(success, responseXML, responseText, params){
					if(success) {
						M8_log(responseText);
						/*self.photo[photo_id*1] = eval('('+responseText+')');
						  if(self.received++ > shots.snapshotLength) {
						  self.done();
						  }*/
					} else
					GM_log("error looking for group" + responseText);
				}
			};
			for(var i = 0; i < shots.snapshotLength; i++) { 
				var image = shots.snapshotItem(i);
				var matches = /\/([0-9]+)_(.*?)[_.]/.exec(image.src);
				if(matches) {
					id = matches[1]*1;
					secret = matches[2]+'';
					
					
				}				
			}
					unsafeWindow.F.API.callMethod('flickr.groups.pool.getInfo', {}, listener);
		},

		done: function() {
			M8_log(this.photos);
			/*			var subNavs = document.getElementById("SubNav");
						var table1=document.createElement('TABLE');
			table1.setAttribute('width','100%');
			table1.setAttribute('cellspacing','0');
			var tbody1=document.createElement('TBODY');
			table1.appendChild(tbody1);
			
			var shots = document.evaluate(
												 "/html/body/div[@id='Main']/div[1]//img",
												 document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);  // Get all group
			var tr1 = document.createElement('TR');
			tr1.setAttribute('valign','bottom')
			tbody1.appendChild(tr1);
			for(var i = 0; i < shots.snapshotLength; i++) { 
				var image = shots.snapshotItem(i);
				var matches = /\/([0-9]+)_/.exec(image.src);
				if(matches) {
					photo_id = matches[1];
					photo = this.photos[photo_id*1];
					var td1=document.createElement('TD');
					tr1.appendChild(td1);
					var div1=document.createElement('DIV');
					div1.className='StreamView';
					div1.innerHTML ='<p class="Photo">'+
'<a href="">'+
'<img width="240" height="180" alt="" src="http://static.flickr.com/1/127194972_8e6cbc4b37_m.jpg"/>'+
'</a>'+
'</p>'+
'<div class="Desc">'+
'<div id="description_div127194972" style="width: 240px;" title="Click to edit">'+
'See where this photo was taken at Yuan.CC Maps . Added to the Cream of the Crop pool as'+
'<a href="/photos/mortimer/127194972/">...</a>'+
'</div>'+
'</div>'+
'<p class="Privacy">'+
'<a title="Set privacy permissions for this photo" href="/photo_settings.gne?id=127194972&photos_url=%2Fphotos%2Fmortimer%2Fsets%2F72157594230473349%2Fdetail%2F">'+
'<img class="absmiddle" width="15" height="15" alt="This photo is public" src="/images/icon_public.gif"/>'+
'</a>'+
'<span class="ccIcn ccIcnSmall">'+
'<a href="/photo_license.gne?id=127194972">'+
'<img class="absmiddle last" width="15" height="15" alt="This photo is licensed" src="/images/icon_creative_commons.gif"/>'+
'</a>'+
'</span>'+
'This photo is'+
'<b>public</b>'+
'.'+
'<a class="Plain" title="Set privacy permissions for this photo" href="/photo_settings.gne?id=127194972&photos_url=%2Fphotos%2Fmortimer%2Fsets%2F72157594230473349%2Fdetail%2F">Change</a>'+
'?'+
'<br/>'+
'</p>'+
'<p class="Do">'+
'Uploaded on'+
'<a class="Plain" href="/photos/mortimer/archives/date-posted/2006/04/12/">Apr 12, 2006</a>'+
' | '+
'<a class="Plain" onclick="mini_map_open(this, 127194972, \'/photos/mortimer/127194972/map/\', \'your\', \'http://static.flickr.com/1/127194972_8e6cbc4b37_s.jpg\', new YGeoPoint(49.022223,5.872364), 16, \'Taken in <a><b>Hagéville, Lorraine<\/b><\/a>\'); return false" href="/photos/mortimer/127194972/map/?view=everyones">Map</a>'+
' | '+
'<a class="Plain" onclick="delete_photo(127194972); return false;" href="/photo_delete.gne?id=127194972&photos_url=%2Fphotos%2Fmortimer%2Fsets%2F72157594230473349%2Fdetail%2F">Delete</a>'+
'</p>'+
'<p class="Activity">'+
'<b>482</b>'+
'views /'+
'<a class="Plain" href="/photos/mortimer/127194972/">6 notes</a>'+
'/'+
'<a class="Plain" href="/photos/mortimer/127194972/">24 comments</a>'+
'</p>'+
'</div>';
				}
				if(i%3 == 0) {
					tr1 = document.createElement('TR');
					tr1.setAttribute('valign','bottom');
					tbody1.appendChild(tr1);
				}
			}

			subNavs.parentNode.insertBefore(table1,subNavs.nextSibling);*/
		}
		
	}
	//======================================================================
	// launch
	try {
		window.addEventListener("load", function () {
									try {
										
										// update automatically (http://userscripts.org/scripts/show/2296)
										win.UserScriptUpdates.requestAutomaticUpdates(SCRIPT);
									} catch (ex) {} 
									
									var flickrgp = new flickrpooldetails();
		}, false);
	} catch (ex) {}
})();
