// ==UserScript==
// @name	Flickr surf
// @namespace	http://pierreandrews.net/
// @description Links to the surf page from a photo
// @version        0.1
// @identifier	http://pierreandrews.net/IMG/js/flickrsurf.user.js
// @date           2006-05-23
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com/photos/*
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

	var doclocation = new String(document.location);
	if(doclocation.match(/\/surf\/?$/)) {
		var previous = document.evaluate("/html/body/div[@id='Main']/table/tbody/tr/td[2]/a",
										  document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
										  ).singleNodeValue;
		var next = document.evaluate("/html/body/div[@id='Main']/table/tbody/tr/td[4]/a",
										  document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
										  ).singleNodeValue;
		if(previous) {
			var skipBack = document.evaluate("/html/body/div[@id='Main']/table/tbody/tr/td[1]/a[2]",
										  document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
										  ).singleNodeValue;
			if(skipBack) {
				var skipLogo = skipBack.previousSibling;
				var back = skipBack.parentNode.insertBefore(document.createElement('a'),skipLogo);
				back.parentNode.insertBefore(document.createTextNode(String.fromCharCode('8249')+' '),back);
				skipBack.parentNode.insertBefore(document.createElement('br'),skipLogo);
				back.href = previous.href+"/surf";
				back.innerHTML = "Previous";
			}
		}

		if(next) {
			var skipFor = document.evaluate("/html/body/div[@id='Main']/table/tbody/tr/td[5]/a[2]",
										  document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
										  ).singleNodeValue;
			if(skipFor) {
				var forw = skipFor.parentNode.insertBefore(document.createElement('a'),skipFor);
				skipFor.parentNode.insertBefore(document.createTextNode(' '+String.fromCharCode('8250')),skipFor);
				skipFor.parentNode.insertBefore(document.createElement('br'),skipFor);
				forw.href = next.href+"/surf";
				forw.innerHTML = "Next";
			}
		}
	} else {
		var slideshow = document.evaluate("/html/body/div[@id='Main']/table[@id='Photo']/tbody/tr/td[2]/div[2]/table/tbody/tr/td[3]/div/div/div[contains(@id,'slideshowLink_stream')]",                              
										  document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
										  ).singleNodeValue;
		if(slideshow) {
			var div = slideshow.appendChild(document.createElement('div'));
			div.className = 'showLink';
			div.style.display = 'block';
			var rootLocation = new String(document.location);
			rootLocation = rootLocation.replace(/(http:\/\/(www.)?flickr.com\/photos\/[^\/]+\/[0-9]+)\/?.*$/i,"$1");
			div.innerHTML = '<a href="'+rootLocation+'/surf/" title="surf from that photo">Surf</a>';
		}
	}

	
})();
