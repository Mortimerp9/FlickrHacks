// ==UserScript==
// @name	 Flickr Easy Photo Post
// @namespace	http://pierreandrews.net/
// @description Remembers the photo you just visited on flickr and offers you an easy way to post them in a comment.
// @version        0.5
// @identifier	http://pierreandrews.net/IMG/js/flickreasyphotopost.user.js
// @date           2007-06-26
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com/photos/*/*
// @include http://*flickr.com/photos/*//*
// @include http://*flickr.com/groups/*/discuss*
// @include http://*flickr.com/groups_newtopic.gne*
// @exclude *flickr.com/photos/*/alltags*
// @exclude *flickr.com/photos/organize*
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

var MEMORY = 15;

(function () {

	//update information
	var SCRIPT = {
		name: " Flickr Easy Photo Post",
		namespace: "http://pierreandrews.net/",
		description: "Remembers the photo you just visited on flickr and offers you an easy way to post them in a comment.",
		identifier: "http://pierreandrews.net/IMG/js/flickreasyphotopost.user.js",
		version: "0.5",								// version
		date: (new Date("2007-06-26"))		// update date
		.valueOf()
	};
	
	
	function M8_log() {
		if(unsafeWindow.console)
			unsafeWindow.console.log(arguments);
		else
			GM_log(arguments);
	}

	/*
	  Xpath trickery, from:
	  http://ecmanaut.blogspot.com/2006/07/expressive-user-scripts-with-xpath-and.html
	 */
	function $x( xpath, root )
		{
			var doc = root ? root.evaluate?root:root.ownerDocument : document;
			var got = doc.evaluate( xpath, root||doc, null, 0, null ), next;
			var result = [];
			while( next = got.iterateNext() )
				result.push( next );
			return result;
		}


	function $x1(xpath) {
		return document.evaluate(
								 xpath,
								 document,
								 null,
								 XPathResult.FIRST_ORDERED_NODE_TYPE, null
								 ).singleNodeValue;
	}

	function foreach( xpath, cb, root )
	{
		var nodes = $x( xpath, root ), e = 0;
		for( var i=0; i<nodes.length; i++ )
			e += cb( nodes[i], i ) || 0;
		return e;
	}

	
	/***********************************************************************
	 * Flickr Localisation
	 **********************************************************************/

	var FlickrLocaliser = function(locals) {
		this.init(locals);
	}
	FlickrLocaliser.prototype = {
		selectedLang: undefined,
		localisations: undefined,
		getLanguage: function() {
			if(!this.selectedLang) {
				var langA = $x1("//p[@class='LanguageSelector']//a[contains(@class,'selected')]");
				if(langA) {
					var matches = /\/change_language.gne\?lang=([^&]+)&.*/.exec(langA.href);
					if(matches && matches[1]) {
						this.selectedLang = matches[1];
						return this.selectedLang;
					}
				}
				return false;
			} else return this.selectedLang;
		},

		init: function(locals) {
			this.localisations = locals;
		},

		localise: function(string, params) {
			if(this.localisations && this.getLanguage()) {
				var currentLang = this.localisations[this.selectedLang];
				if(!currentLang) currentLang = this.localisations[this.localisations.defaultLang];
				var local = currentLang[string];
				if(!local) {
					local = this.localisations[this.localisations.defaultLang][string];
				} 
				if(!local)
					return string;
				for(arg in params) {
					var rep = new RegExp('@'+arg+'@','g');
					local = local.replace(rep,params[arg]);
				}
				local =local.replace(/@[^@]+@/g,'');
				return local;
			} else return undefined;
		}

	}

	/*****************************Flickr Localisation**********************/


	function getObjectMethodClosure(object, method) {
		return function(arg) {
			return object[method](arg); 
		}
	}

	var localiser = new FlickrLocaliser({
				'en-us' : {
					'post' : 'Post a photo ...',
					'medium' : 'Medium',
					'small' : 'Small',
					'thumbnail' : 'Thumbnail',
					'square' : 'Square',
					'hide' : 'Hide thumbnails',
					'clear' :  "Clear EasyPhotoPost History"
				},
				'fr-fr' : {
					'post' : 'Ajouter une photo ...',
					'medium' : 'Moyen',
					'small' : 'Petite',
					'thumbnail' : 'Miniature',
					'square' : 'Carr&eacute;',
					'hide' : 'Cach&eacute; les miniatures',
					'clear' :  "Vider l'historique d'EasyPhotoPost"
				},
				'de-de': {
					// M
					'medium' : 'Mittel',
					// S
					'small' : 'Klein',
					'square' : 'Quadrat',
					// T
					'thumbnail' : 'Thumbnail'
				},
				'es-us': {
					// M
					'medium' : 'Mediano',
					// S
					'small' : 'Peque&ntilde;o',
					'square' : 'Cuadrato',
					// T
					'thumbnail' : 'Miniatura'
				},
				'it-it': {
					// M
					'medium' : 'Medie',
					// S
					'small' : 'Picolle',
					'square' : 'Quadrate',
					// T
					'thumbnail' : 'Miniature'
				},
				'ko-kr': {
					// M
					'medium' : '&#20013;&#31561;',
					// S
					'small' : '&#23567;&#22294;',
					'square' : '&#27491;&#26041;&#24418;',
					// T
					'thumbnail' : '&#32302;&#22294;'
				},
				'pt-br': {
					// M
					'medium' : 'M&eacute;dio',
					// S
					'small' : 'Pequeno',
					'square' : 'Quadrado',
					// T
					'thumbnail' : 'Miniatura'
				},
				'zh-hk': {
					// M
					'medium' : '&#20013;&#31561;',
					// S
					'small' : '&#23567;&#22294;',
					'square' : '&#27491;&#26041;&#24418;',
					// T
					'thumbnail' : '&#32302;&#22294;'
				},
				defaultLang: 'en-us'
		});
	
	var flickreasyphotopost = function() {this.init();}

	flickreasyphotopost.prototype = {	

		createCommenter: function() {
			var outerdiv = document.createElement('div');
			var show = outerdiv.appendChild(document.createElement('a'));
			show.href="javascript:;";
			var div = outerdiv.appendChild(document.createElement('div'));
			div.style.display = 'none';

			show.innerHTML = localiser.localise('post');
			show.addEventListener('click',function(evt) {
				show.style.display = 'none';
				div.style.display = '';
			},true);
			
			var choice = div.appendChild(document.createElement('div'));
			choice.setAttribute("style","margin-bottom:1em;text-align:center;");
			var form = choice.appendChild(document.createElement('form'));
			form.innerHTML = '<input type="radio" name="size" value="-" id="imgpost_medium"/><label for="imgpost_medium">'+localiser.localise('medium')+'</label>';
			form.innerHTML += '<input type="radio" name="size" value="m" id="imgpost_small" checked="true"/><label for="imgpost_small">'+localiser.localise('small')+'</label>';
			form.innerHTML += '<input type="radio" name="size" value="t" id="imgpost_thumb"/><label for="imgpost_thumb">'+localiser.localise('thumbnail')+'</label>';
			form.innerHTML += '<input type="radio" name="size" value="s" id="imgpost_square"/><label for="imgpost_square">'+localiser.localise('square')+'</label>';
			form.id= "imgpost_form";
			var ul = div.appendChild(document.createElement('ul'));
			ul.setAttribute("style","margin:0;list-style-type:none;");
			var i=0;
			var cnt = 0;
			for(i=0;i<MEMORY;i++) {
				var id = GM_getValue(i+".id");
				if(id != undefined && id != '') {
					cnt++;
					var li = ul.appendChild(document.createElement('li'));
					li.setAttribute("style","display:inline;margin:.5em;");
					var a = li.appendChild(document.createElement('a'));
					var img = a.appendChild(document.createElement('img'));
					img.src ='http://static.flickr.com/'+GM_getValue(i+".server")+'/'+id+'_'+
						GM_getValue(i+".secret")+'_s.jpg';
					img.alt=GM_getValue(i+".title");
					img.width="75";
					img.height="75";
					img.id="imgpost_"+i;
					a.href="javascript:;";
					a.addEventListener('click',function(evt) {
										   allTextAreas = $x('//textarea[@name="message"]',	document);
										   
										   var index = evt.target.id.replace('imgpost_','');
										   var size = '';
										   //										   var form = document.getElementById("imgpost_form");
										   for(var j = 0; j < form.elements.length; j++) {
											   if(form.elements[j].checked) {
												   if(form.elements[j].value == '-') size = '';
												   else size = '_'+form.elements[j].value;
												   break;
											   }
										   }
										   var name = GM_getValue(index+".ownername");
										   if(!name) {
											   name = GM_getValue(index+".ownerurl").replace('photos','').replace(/\//g,'');
										   }

										   var mesg = "&quot;"+GM_getValue(index+".title")+"&quot; by "+name+' <a href="http://pierreandrews.net/Flickr-Easy-Photo-Post.html">[?]</a>'+
"\n"+'<a href="http://www.flickr.com'+GM_getValue(index+".ownerurl")+GM_getValue(index+".id")+'/" title="Go to the photo page"><img src="http://static.flickr.com/'+GM_getValue(index+".server")+'/'+GM_getValue(index+".id")+'_'+GM_getValue(index+".secret")+size+'.jpg" alt="'+GM_getValue(index+".title")+'" alt="'+GM_getValue(index+".title")+' by '+name.replace(/<\/?b>/g,'')+'"/></a>';
										   for (var i = 0; i < allTextAreas.length; i++) {
											   thisTextArea = allTextAreas[i];
											   try{
												   thisTextArea.value = thisTextArea.value.substr(0,thisTextArea.selectionStart) 
												   + mesg
												   + thisTextArea.value.substr(thisTextArea.selectionStart);
											   } catch(e) {
												   /*  var iframe = $x1('//form//iframe',unsafeWindow.document);
													   M8_log(iframe.contentDocument.getSelection().focusOffset);*/
												   thisTextArea.value +=  mesg;
											   }
											   
										   }
										   
									   },true);
				}
			}
			var hide = div.appendChild(document.createElement('a'));
			hide.innerHTML = localiser.localise('hide');
			hide.addEventListener('click',function(evt) {
				show.style.display = '';
				div.style.display = 'none';
			},true);
			hide.href="javascript:;";

			if(cnt > 0)
			return outerdiv;
			else
			return null;
		},

		getOwnerName: function() {
			var uploadedBy = $x1("/html/body/div[@id='Main']/table[@id='Photo']/tbody/tr/td[2]/div[1]/a[1]/img[1]",
								 document.body);
			if(uploadedBy)
			return uploadedBy.parentNode.parentNode.getElementsByTagName('a').item(2).innerHTML;
			return '';
		},

		init: function() {
			if(unsafeWindow.page_photo_id) {
				var current_index = GM_getValue("current_index");
				if(!current_index) current_index = 0;
				var photo = unsafeWindow.global_photos[unsafeWindow.page_photo_id];
				var i = 0;
				var exist = false;
				for(i=0;i<MEMORY;i++) {
					if(GM_getValue(i+".id") == unsafeWindow.page_photo_id) {exist = true; break;}
				}
				if(!exist) {
					GM_setValue("current_index",(current_index+1)%MEMORY);
					GM_setValue(current_index+".id",unsafeWindow.page_photo_id);
					GM_setValue(current_index+".ownerurl",photo.ownersUrl);
					GM_setValue(current_index+".ownername",this.getOwnerName());
					GM_setValue(current_index+".server",photo.server);
					GM_setValue(current_index+".secret",photo.secret);
					GM_setValue(current_index+".title",photo.title);
				}

				//insert the commenter stuff.
				var arse = this.createCommenter();
				if(arse != null) {
					var allLinks, thisLink;
					allLinks = $x('//div[@id="DiscussPhoto"]/h3',
								  document);
					for (var i = 0; i < allLinks.length; i++) {
						thisLink = allLinks[i];
						thisLink.parentNode.insertBefore(arse, thisLink.nextSibling);
					}
				}
			} else if(document.location.pathname.indexOf('editcomment') >= 0) {
				var arse = this.createCommenter();
				if(arse != null) {
					thisLink = $x1('//td[@id=\'GoodStuff\']/h3',
								   document);	

					if(thisLink)
						thisLink.parentNode.insertBefore(arse, thisLink.nextSibling);
				}			
			} else if(document.location.pathname.indexOf('discuss/') >= 0) {
				var arse = this.createCommenter();		
				if(arse != null) {
					if(document.location.pathname.indexOf('edit') >= 0) {
						thisLink = $x1('//td[@id=\'GoodStuff\']/form/p[1]/textarea',
									   document);
						if(thisLink)
							thisLink.parentNode.insertBefore(arse, thisLink);
					} else {
						thisLink = $x1('//div[@id=\'DiscussTopic\']//td/h3',
									   document);
						if(thisLink)
							thisLink.parentNode.insertBefore(arse, thisLink.nextSibling);
					} 
				}
			} else if(document.location.pathname == "/groups_newtopic.gne") {
				var arse = this.createCommenter();		
				if(arse != null) {
					var arse = this.createCommenter();
					thisLink = $x1('//td[@id=\'GoodStuff\']/form/table/tbody/tr[2]/td[2]/textarea',
							   document);
					if(thisLink)
						thisLink.parentNode.insertBefore(arse, thisLink);
				}
			}
		}

	}

	var clear_history = function() {
		for(var i=0;i<MEMORY;i++) {
					GM_setValue("current_index",0);
					GM_setValue(i+".id",'');
					GM_setValue(i+".ownerurl",'');
					GM_setValue(i+".ownername",'');
					GM_setValue(i+".server",'');
					GM_setValue(i+".secret",'');
					GM_setValue(i+".title",'');
		}
	};
	GM_registerMenuCommand(localiser.localise('clear'), clear_history);
	
	
	//======================================================================
	// launch
		try {
		window.addEventListener("load", function () {
									try {
										
										// update automatically (http://userscripts.org/scripts/show/2296)
										win.UserScriptUpdates.requestAutomaticUpdates(SCRIPT);
									} catch (ex) {} 
									
	
		}, false);
	} catch (ex) {}
		var flickrgp = new flickreasyphotopost();
})();
