// ==UserScript==
// @name	Flickr Go To Reply
// @namespace	http://pierreandrews.net/
// @description add a link to find the comment box easily
// @version        0.1
// @identifier	http://pierreandrews.net/IMG/js/flickrgotoreply.user.js
// @date           2006-07-05
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com/photos/*/*
// 
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

	var discuss = document.getElementById('DiscussPhoto');
	if(discuss) {
		var title = discuss.getElementsByTagName('h3')[0];
		title.innerHTML += '<span style="font-size:75%;margin-left:1em;">(<a href="#reply">reply</a>)</span>';
	}

})();
