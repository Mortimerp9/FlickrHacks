// ==UserScript==
// @name	Flickr More Group Links
// @namespace	http://6v8.gamboni.org/
// @description Add more links to browse a group pool (random photos, leech, etc..)
// @version        0.3
// @identifier	http://6v8.gamboni.org/IMG/js/flickrmoregrouplinks.user.user.js
// @date           2006-08-25
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com/groups/*
// @exclude http://*flickr.com/groups/
// @exclude http://*flickr.com/groups
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
		name: "Flickr More Group Links",
		namespace: "http://6v8.gamboni.org/",
		description: "Add more links to browse a group pool (random photos, leech, etc..)",
		identifier: "http://6v8.gamboni.org/IMG/js/flickrmoregrouplinks.user.js",
		version: "0.3",								// version
		date: (new Date("2006-08-25"))		// update date
		.valueOf()
	};
	
	
	function M8_log() {
		if(unsafeWindow.console)
			unsafeWindow.console.log(arguments);
		else
			GM_log(arguments);
	}

	var flickrmoregrouplinks = function() {this.init();}

	flickrmoregrouplinks.prototype = {

		init: function() {
			var links = document.evaluate(
										 "//td[@class='Section']/p[@class='Links']",
										 document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
						  ).singleNodeValue;

			var a = links.getElementsByTagName('a');
			var id;
			var admin = false;
			for(var i=0;i<a.length;i++) {
				if(a[i].href.indexOf('?id=') >= 0)
					id = a[i].href.split('?id=')[1];
				if(a[i].href.indexOf('/admin/') >=0)
					admin = true;
			}
			if(id) {
				links.innerHTML += '<img width="1" height="11" alt="" src="/images/subnavi_dots.gif"/>';
				links.innerHTML += '<a href="http://www.krazydad.com/gustavog/FlickRandom.pl?group='+id+'">Random</a>';
				links.innerHTML += '<img width="1" height="11" alt="" src="/images/subnavi_dots.gif"/>';
				links.innerHTML += '<a href="http://www.flickrleech.net/group/'+id+'">Leech</a>';
				links.innerHTML += '<img width="1" height="11" alt="" src="/images/subnavi_dots.gif"/>';
				links.innerHTML += '<a href="http://www.flickr.com/groups/'+id+'/pool/'+unsafeWindow.global_nsid+'">Your Photos</a>';
				if(admin) {
					links.innerHTML += '<img width="1" height="11" alt="" src="/images/subnavi_dots.gif"/>';
					links.innerHTML += '<a href="http://flagrantdisregard.com/flickr/poolcleaner.php?group_id='+id+'">Pool Cleaner</a>';
				}
			}
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
									
									var flickrgp = new flickrmoregrouplinks();
		}, false);
	} catch (ex) {}
})();
