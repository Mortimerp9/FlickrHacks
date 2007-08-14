//======================================================================
//                         Hack the Buddy Icon menus
//                         make your own insertion
//======================================================================

//version 0.1
//release 14 August 2007
//author: Pierre Andrews

// --------------------------------------------------------------------
// Copyright (C) 2007 Pierre Andrews
// This script can be redistributed under the terms of the GNU LGPL, without
// modification of this licence and copyright notice. Attribution to the author should be
// kept at least in the source of the scripts.
// 
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// The GNU General Public License is available by visiting
//   http://www.gnu.org/copyleft/lgpl.html
// or by writing to
//   Free Software Foundation, Inc.
//   51 Franklin Street, Fifth Floor
//   Boston, MA  02110-1301
//   USA

var FlickrBuddyMenuTool = function() {};

FlickrBuddyMenuTool.prototype = {

	/**
	 * insertItem: insert a new item in the buddy menu, after the "Contacts" item.
	 *
	 *  param title: the title of the item, what will be shown to the user.
	 *  callback: a function to callback when the user clicks on that menu item. The user nsid will be passed to the callback as first parameter. The id will be passed as second parameter , the received click event will be passed as last parameter.
	 *  id: a unique id for this item, to know what item was clicked if you use the same callback for different items.
	 */
	insertItem: function(title, callback, id) {		
		var menu = document.getElementById('personmenu_contacts_link');
		if(menu) {
			var link =document.createElement('a');
			link.setAttribute('class','block');
			link.setAttribute('id','tag_person_link');
			link.setAttribute('href','javascript:;');
			link.addEventListener('click',function(ev) {
				var block = ev.target.parentNode;
				var matches = /messages_write\.gne\?to=([^"]*)"/.exec(block.innerHTML);
				if(matches) {
					callback(matches[1],id, ev);
				}			
			},true);
			link.textContent=title;
			
			menu.parentNode.insertBefore(link,menu.nextSibling);
		}
	}
}
