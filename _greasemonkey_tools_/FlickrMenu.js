//======================================================================
//                         Hack the Gamma menus
//                         make your own insertion/submenus, etc
// 
// you will need the FlickrLocaliser for this to work properly.
//
// see the flickrmoremenus.user.js script for a longuer example.
//======================================================================

/*
Example:
var menutool = new FlickrGammaMenu();

//1- insert a menu with subitems:
var userID = ...;
var yourphotos = 
				menutool.createMenuLink('http://www.flickr.com/photos/'+userId,"Your Photos",false,true)+
				menutool.createMenuLink('http://www.flickr.com/photos/'+userId+'/popular-interesting/',"Interesting Popular",true,false)+
				menutool.insertMenu(yourphotos,'candy_nav_menu_you',"Your Photos",'A Sub Menu ...',true);

//2- insert directly a menu item:
menutool.insertItem("http://www.flickr.com/people/"+this.userId+"/contacts/rev/",'candy_nav_menu_contacts',"People Search","Reverse Contacts",false,true);

*/

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



var FlickrGammaMenu = function() {
}


FlickrGammaMenu.prototype = {
	mapper: new FlickrLocaliser({
		'en-us' : {
			'Your Photos' : 'Your Photos',
				"Contact List" : "Contact List",
				'People Search' : 'People Search',
				'FlickrMail' : 'FlickrMail',
				'Your Archives' : 'Your Archives',
				'Your Sets' : 'Your Sets',
				'Calendar' : 'Calendar'
				},
			'fr-fr' : {
				'Your Photos' : 'Vos photos',
					"Contact List" : "Liste de contacts",
					'People Search' : 'Recherche de personnes',
					'FlickrMail' : 'FlickrMail',
					'Your Archives' : 'Vos archives',
					'Your Sets' : 'Vos albums',
					'Calendar' : 'Calendrier'
					},
				'it-it' : {
					'Your Photos' : 'Le tue foto',
						"Contact List" : "Lista contatti",
						'People Search' : 'Ricerca di persone',
						'FlickrMail' : 'FlickrMail',
						'Your Archives' : 'I tuoi archivi',
						'Your Sets' : 'I tuoi set',
						'Calendar' : 'Calendario'
						},
					'de-de' : {
						'Your Photos' : 'Ihre Fotos',
							"Contact List" : "Kontaktliste",
							'People Search' : 'Benutzer suchen',
							'FlickrMail' : 'FlickrMail',
							'Your Archives' : 'Ihre Archive',
							'Your Sets' : 'Ihre Alben',
							'Calendar' : 'Kalender'
							},
						'es-us' : {
							'Your Photos' : 'Tus fotos',
								"Contact List" : "Lista de contactos",
								'People Search' : 'BÃºsqueda de personas',
								'FlickrMail' : 'Flickrcorreo',
								'Your Archives' : 'Tus archivos',
								'Your Sets' : 'Tus Ã¡lbumes ',
								'Calendar' : 'Calendario'
								},
							'pt-br' : {
								'Your Photos' : 'Fotos',
									"Contact List" : "Lista de contatos",
									'People Search' : 'Busca de pessoas',
									'FlickrMail' : 'E-mail do Flickr',
									'Your Archives' : 'Arquivos',
									'Your Sets' : 'Ãlbuns',
									'Calendar' : 'CalendÃ¡rio'
									},
								'ko-kr' : {
									'Your Photos' : 'ë´ ì¬ì§',
										"Contact List" : "ì´ì ëª©ë¡",
										'People Search' : 'ì¬ë ì°¾ê¸°',
										'FlickrMail' : 'FlickrMail',
										'Your Archives' : 'ì§ëê¸ ë³´ê¸°',
										'Your Sets' : 'ì¸í¸',
										'Calendar' : 'ë¬ë ¥'
										},
									'zh-hk' : {
										'Your Photos' : 'ä½ çç¸ç',
											"Contact List" : "èªå·±äººåå",
											'People Search' : 'æå°ç¨æ¶',
											'FlickrMail' : 'FlickrMail',
											'Your Archives' : 'ä½ çè³æåº«',
											'Your Sets' : 'ä½ çç¸çé',
											'Calendar' : 'æ¥æ',
											},
										defaultLang: 'en-us'
														 }),

	//insert a new menu item in on of the main menus
	// href the link on that element or a javascript function to call
	// menu is the id of the main menu where to insert the new menu item (e.g. 'candy_nav_menu_you')
	// item is the item "title" before which to insert the new menu item (or to replacE) (e.g. 'Your Sets')
	// title is the title of your new item
	// replace is a boolean to know if we replace 'item' or just add a new one
	//
	//returns: the a element created
	insertItem: function(href,menu,item,title,replace,line_above) {

		var menu_you = document.getElementById(menu);
		var you_a = menu_you.getElementsByTagName('a');
		var your_set = '';	
		item = this.mapper.localise(item);
		for(var i=0;i<you_a.length;i++) {
			if( you_a[i].innerHTML == item ) {
				your_set = you_a[i];
				break;
			}
		}

		if(!your_set) {
			GM_log('impossible to find insertion point');
			return;
		}

		var batch = document.createElement('a');
		if(typeof(href) == "function") {
			batch.addEventListener("click",href,true);
			batch.href = 'javascript:;';
		} else
		batch.href = href;
		batch.innerHTML = title;
		if(line_above) batch.className = "menu_item_line_above";
		your_set.parentNode.insertBefore(batch, your_set);		
		if(replace) your_set.parentNode.removeChild(your_set);
			
		return batch;			
	},

	//remove a menu item
	// menu is the id of the main menu
	// item is the item innerHTML
	//returns: the element removed
	removeItem: function(menu,item) {
		var menu_you = document.getElementById(menu);
		var you_a = menu_you.getElementsByTagName('a');
		var your_set = '';
		for(var i=0;i<you_a.length;i++) {
			if( you_a[i].innerHTML == item ) {
				your_set = you_a[i];
				break;
			}
		}
		if(!your_set) {
			GM_log('impossible to find insertion point');
			return;
		}
		your_set.parentNode.removeChild(your_set);
		return your_set;
	},

	createMenuLink: function(href,title,line_above,first) {
		return '<a '+((first)?' style="padding-top:3px;"':'')+((line_above)?' class="menu_item_line_above"':'')+'" href="'+href+'">'+title+'</a>\n'
	},
		
	//insert a new menu:
	// innerHTML is the content of the menu (you should create that with createMenuLink calls)
	// menu is the id of the main menu where to insert the new menu item (e.g. 'candy_nav_menu_you')
	// item is the item "title" before which to insert the new menu item (or to replacE) (e.g. 'Your Sets')
	// title is the title of your new item
	// replace is a boolean to know if we replace 'item' or just add a new one
	insertMenu: function(innerHTML,menu,item,title,replace) {
			
		// insert pulldown menu, from .CK super batch edit script
		var menu_you = document.getElementById(menu);
		var you_a = menu_you.getElementsByTagName('a');
		var your_set = '';
		if(replace) item = this.mapper.localise(item);
		for(var i=0;i<you_a.length;i++) {
			if( you_a[i].innerHTML == item ) {
				your_set = you_a[i];
				break;
			}
		}

		if(!your_set) {
			GM_log('impossible to find insertion point');
			return;
		}
		var onclickHandler1 = function() {
			if( batch.clickat == 'body' ) {
				batch.clickat = null;
				return;
			}
			if( b_menu.style.display == 'none' ) {
				b_menu.style.display = 'inline';
			} else {
				b_menu.style.display = 'none';
			}
		}
		var batch = this.insertItem(onclickHandler1,menu,item,title,replace);
		var b_menu = document.createElement('div');
			
		batch.clickat = null;
		batch.onclickHandler1 = onclickHandler1;
		batch.onclickHandler2 = function() {
			batch.removeEventListener('click', batch.onclickHandler2, true);
			batch.addEventListener('click', batch.onclickHandler1, true);
			b_menu.style.display = 'none';
			batch.status = false;
		}
		batch.onclickHandler3 = function() {
			b_menu.style.display = 'none';
		}
		b_menu.style.display = 'none';
		b_menu.style.left = '70px';
		b_menu.style.marginTop = '-19px';
		b_menu.className = 'candy_menu';
		b_menu.innerHTML = innerHTML;

		batch.parentNode.insertBefore(b_menu, batch.nextSibling);			
			
		document.body.addEventListener('click', 
									   function() {
			if( b_menu.style.display == 'inline' ) {
				b_menu.style.display = 'none';
				batch.clickat = 'body';
			} else batch.clickat = null;
		}, true);

	}
}
