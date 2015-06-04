// ==UserScript==
// @name	Replace Smiley
// @namespace	http://pierreandrews.net/
// @description Replace replace img smiley by a text
// @version        0.1
// @identifier	http://pierreandrews.net/IMG/js/replacesmiley.user.js
// @date           2007-03-07
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com*
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
var TOTEXT = false;

(function () {

	//update information
	var SCRIPT = {
		name: "Replace Smiley",
		namespace: "http://pierreandrews.net/",
		description: "Replace smileys by an image, or replace img smiley by a text",
		identifier: "http://pierreandrews.net/IMG/js/replacesmiley.user.js",
		version: "0.1",								// version
		date: (new Date("2007-03-07"))		// update date
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



	function getObjectMethodClosure(object, method) {
		return function(arg) {
			return object[method](arg); 
		}
	}


	var replacesmiley = function() {this.init();}
	var smileys = {
		'1': {regexp:":-?\\)",replace:':)',Name:"happy",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/1.gif"},
		'2': {replace:':(',Name:"sad",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/2.gif"},
		'3': {replace:';)',Name:"winking",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/3.gif"},
		'4': {replace:':D',Name:"big grin",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/4.gif"},
		'5': {replace:';;)',Name:"batting eyelashes",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/5.gif"},
		'6': {replace:'>:D<',Name:"big hug",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/6.gif"},
		'7': {replace:':-/',Name:"confused",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/7.gif"},
		'8': {replace:':x',Name:"love struck",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/8.gif"},
		'9': {replace:':">',Name:"blushing",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/9.gif"},
		'10': {replace:':P',Name:"tongue",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/10.gif"},
		'11': {replace:':-*',Name:"kiss",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/11.gif"},
		'12': {replace:'=((',Name:"broken heart",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/12.gif"},
		'13': {replace:':-O',Name:"surprise",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/13.gif"},
		'14': {replace:'X(',Name:"angry",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/14.gif"},
		'15': {replace:':>',Name:"smug",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/15.gif"},
		'16': {replace:'B-)',Name:"cool",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/16.gif"},
		'17': {replace:':-S',Name:"worried",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/17.gif"},
		'18': {replace:'#:-S',Name:"whew!",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/18.gif"},
		'19': {replace:'>:)',Name:"devil",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/19.gif"},
		'20': {replace:':((',Name:"crying",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/20.gif"},
		'21': {replace:':))',Name:"laughing",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/21.gif"},
		'22': {replace:':|',Name:"straight face",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/22.gif"},
		'23': {replace:'/:)',Name:"raised eyebrow",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/23.gif"},
		'24': {replace:'=))',Name:"rolling on the floor",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/24.gif"},
		'25': {replace:'O:)',Name:"angel",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/25.gif"},
		'26': {replace:':-B',Name:"nerd",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/26.gif"},
		'27': {replace:'=;',Name:"talk to the hand",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/27.gif"},
		'101': {replace:':-c',Name:"call me - New!",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/101.gif"},
		'100': {replace:':)]',Name:"on the phone - New!",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/100.gif"},
		'102': {replace:'~X(',Name:"at wits' end - New!",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/102.gif"},
		'103': {replace:':-h',Name:"wave - New!",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/103.gif"},
		'104': {replace:':-t',Name:"time out - New!",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/104.gif"},
		'105': {replace:'8->',Name:"daydreaming - New!",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/105.gif"},
		'28': {replace:'|-)',Name:"sleepy",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/28.gif"},
		'29': {replace:'8-|',Name:"rolling eyes",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/29.gif"},
		'30': {replace:'L-)',Name:"loser",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/30.gif"},
		'31': {replace:':-&',Name:"sick",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/31.gif"},
		'32': {replace:':-$',Name:"don't tell anyone",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/32.gif"},
		'33': {replace:'[-(',Name:"not talking",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/33.gif"},
		'34': {replace:':O)',Name:"clown",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/34.gif"},
		'35': {replace:'8-}',Name:"silly",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/35.gif"},
		'36': {replace:'<:-P',Name:"party",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/36.gif"},
		'37': {replace:'(:|',Name:"yawn",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/37.gif"},
		'38': {replace:'=P~',Name:"drooling",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/38.gif"},
		'39': {replace:':-?',Name:"thinking",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/39.gif"},
		'40': {replace:'#-o',Name:"d'oh",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/40.gif"},
		'41': {replace:'=D>',Name:"applause",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/41.gif"},
		'42': {replace:':-SS',Name:"nailbiting",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/42.gif"},
		'43': {replace:'@-)',Name:"hypnotized",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/43.gif"},
		'44': {replace:':^o',Name:"liar",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/44.gif"},
		'45': {replace:':-w',Name:"waiting",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/45.gif"},
		'46': {replace:':-<',Name:"sigh",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/46.gif"},
		'47': {replace:'>:P',Name:"phbbbbt",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/47.gif"},
		'48': {replace:'<):)',Name:"cowboy",URL:"http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/48.gif"}
		};

	replacesmiley.prototype = {

		init: function() {
			if(TOTEXT) {
				foreach("//img[contains(@src,'http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/')]",function(node, i) {
					var smil = node.src.replace(/http:\/\/us.i1.yimg.com\/us.yimg.com\/i\/mesg\/emoticons7\/([0-9]+)\.gif/,"$1");
					var replace = smileys[smil];
					if(replace) {
						var txt = document.createElement('abbr');
						txt.innerHTML = replace.replace;
						txt.title = replace.Name;
						node.parentNode.insertBefore(txt,node);
						node.parentNode.removeChild(node);
					}
				}, document);
			} else {
				//NOT WORKING, anyone for an implementation?
				foreach("//text()",function(node, i) {
					s = node.data;
					for (key in smileys) {
						var p = smileys[key].regexp;//.replace(/([\(\)\[\]\\)\\*])/g,"\\$1");
						//M8_log(p);
						if(p) {
					var reg = new RegExp(p);
					M8_log(reg.toSource());
					s = s.replace(reg, "$1"+smileys[key].URL+"$2");
						}
					}
					node.data = s;
				},document);
			}

		   }
	}
	//======================================================================
	// launch
	/*try {
		window.addEventListener("load", function () {
									try {
										
										// update automatically (http://userscripts.org/scripts/show/2296)
										win.UserScriptUpdates.requestAutomaticUpdates(SCRIPT);
									} catch (ex) {} 
	*/
									var flickrgp = new replacesmiley();
									/*	}, false);
									} catch (ex) {}*/
})();
