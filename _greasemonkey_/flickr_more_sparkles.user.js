// ==UserScript==
// @name	Flickr More Sparkles
// @namespace	http://6v8.gamboni.org/
// @description Add Sparkle lines for stats of individual photos
// @version        0.1
// @identifier	http://6v8.gamboni.org/IMG/js/flickr_more_sparkles.user.js
// @date           2008-12-10
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include *flickr.com/photos/*
// @exclude *flickr.com/photos/*/alltags*
// @exclude *flickr.com/photos/organize*
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
// Copyright (C) 2008 Pierre Andrews
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
		name: "Flickr More Sparkles",
		namespace: "http://6v8.gamboni.org/",
		description: "Add Sparkle lines for stats of individual photos",
		identifier: "http://6v8.gamboni.org/IMG/js/flickr_more_sparkles.user.js",
		version: "0.1",								// version
		date: (new Date("2008-12-10"))		// update date
		.valueOf()
	};


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
				if(!local) return string;
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


   function $x1(xpath, root) {
	 			var doc = root ? root.evaluate?root:root.ownerDocument : document;
		return document.evaluate(
								 xpath,
								 root||doc,
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



	function getObjectMethodClosure(object, method) {
		return function(arg) {
			return object[method](arg);
		}
	}


	var flickrmoresparkles = function() {this.init();}

	flickrmoresparkles.prototype = {

	localiser: new FlickrLocaliser({
									 'en-us' : {'photo_stats': 'Photo stats'},
									 'fr-fr':{},
									 defaultLang:'en-us'
									   }),

	  makeSpark: function(url, insert, withLink) {
		  GM_xmlhttpRequest({
			method:"GET",
							  url:url,
							  onload:function(details) {
								var start = details.responseText.indexOf("F.photoViews = {");
								var end = details.responseText.indexOf("</script>",start);
								var code = 	details.responseText.substring(start,end).replace("F.photoViews = {","").replace("foreGraph:","");
								code = code.substring(0,code.lastIndexOf("]"))+"]";
								var evaled = eval(code);
								var values = '';
								  var max = 0;
								var min = -1;
								for(i=0;i<evaled.length;i++) {
								  var val = parseInt(evaled[i].views);
								  if(min<0 || min>val)
									min = val;
								  if(max<val)
									max = val;
								  if(val > 0)
								  values += ','+val;
								  else
									values += ',0';
								}
								if(max>0) {
								values=values.substring(1);
								  var imgtxt = "<img src=\"http://chart.apis.google.com/chart?"
								  + "cht=ls"
								+ "&chds="+min+','+max
								  + "&chs=60x30"
								  + "&chd=t:"+values
								  + "&chco=0063DC"
								  + "&chls=1,1,0"
								  + "&chm=o,990000,0,60,4"
								  + "&chxt=r,x,y"
								  + "&chxs=0,990000,11,0,_|1,990000,1,0,_|2,990000,1,0,_"
								  + "&chxl=0:|"+val+"|1:||2:||"
								  + "&chxp=0,"+val
								  + "\">";
								  if(withLink) {
									insert.innerHTML += "<a href="+url+">"+imgtxt+"</a>";
								  } else  {
																		insert.innerHTML +=imgtxt;
								  }
								}
							  }
							});

	  },

	  init: function() {
		var statIT = $x1("//td[@class='RHS']/ul/li[3]/a");
		if(!statIT || statIT.innerHTML != "Photo stats") {
		 statIT = $x1("//td[@class='RHS']/ul/li[2]/a");
		}
		if(statIT && statIT.innerHTML == "Photo stats") {
		  var url = statIT.href;
		  this.makeSpark(url,statIT);
		} else if(document.title == "Flickr: Your Photostream"){
		  var self = this;
		  foreach("//p[@class='Activity']",function(el) {
					var ael = $x1("a",el);
					self.makeSpark(ael.href+"/stats",el,true);
				  });
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

									var flickrgp = new flickrmoresparkles();
		}, false);
	} catch (ex) {}
})();
