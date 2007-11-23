// ==UserScript==
// @name	Flickr Refer Comment
// @namespace	http://6v8.gamboni.org/
// @description Auto comment the place where you come from
// @version        1.1
// @identifier	http://6v8.gamboni.org/IMG/js/flickrrefercomment.user.js
// @date           2007-11-23
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com/photos/*/*
// @exclude http://*flickr.com/photos/*/*#preview
// @exclude http://*flickr.com/photos/organize*
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
		name: "Flickr Refer Comment",
		namespace: "http://6v8.gamboni.org/",
		description: "auto comment the place where you come from",
		identifier: "http://6v8.gamboni.org/IMG/js/flickrrefercomment.user.js",
		version: "1.1",								// version
		date: (new Date(2007, 11, 23))		// update date
		.valueOf()
	};


	var DISCUSS = 0;
	var POOL = DISCUSS+1;
	var FELLOW = POOL+1;
	var RANDOM = FELLOW+1;
	var SET = RANDOM+1;
	var MAP = SET+1;

	var FlickrReferComment = function() {this.init();}

	FlickrReferComment.prototype = {

		init: function() {
			var referrer = document.referrer;
			if(referrer) {
				var matches;
				if(referrer.indexOf(document.location.pathname) >= 0) return //no need to add the comment if you just commented...
					
					if(referrer.indexOf('/discuss/') >= 0 && referrer.indexOf('/groups/') >= 0) {
						//we come from a group discussion
						this.resolveGroupName(DISCUSS,referrer,referrer);
					} else if(referrer.indexOf('/groups/') >= 0) {
						if(referrer.indexOf('/map') >= 0) {
							//we come from a group map
							this.resolveGroupName(MAP,referrer,referrer);
						} else {
							//we come from a group
							this.resolveGroupName(POOL,referrer,referrer);
						}
					}  else if(referrer.indexOf('/photos/friends') >= 0) {
						//we come from our contacts' last photos
						this.insertComment("Seen in my contacts' photos.",'');
					}  else if(referrer.indexOf('/photos/tags') >= 0) {
						//we come from our contacts' last photos
						this.insertComment("Seen in a tag search.",referrer);
					} else if(referrer.indexOf('/favorites') >= 0) {
						//we come from our favorites
						this.insertComment("Seen in someone's favorites.",referrer);
					} else if(referrer.indexOf('/archives') >= 0) {
						//we come from our favorites
						this.insertComment("Seen in your archives.",referrer);
					} else if(document.location.hash == "#in/nearby") {
						//we come from a nearby photo
						this.insertComment("Seen next to a nearby photo",referrer);
					} else if(matches = /\/sets\/([0-9]+)(\/map)?\/?/.exec(referrer)) {
						if(matches[2] == '/map') {
							//we come from a map
							this.resolveSetName(matches[1],referrer,MAP);
						} else {
							//we come from a set
							this.resolveSetName(matches[1],referrer,SET);
						}
					} else if(matches = /\/in\/set-([^\/]*\/?)/.exec(document.location.pathname)) {
						//we come from another photo in the same set.
						var set_url = document.location.pathname;
						set_url = set_url.replace(/photos\/([^\/]+)\/.*/,'http://www.flickr.com/photos/$1/sets/'+matches[1]);
						this.resolveSetName(matches[1],set_url);
					} else if((referrer.indexOf('/photos/') >= 0) && (matches = /(\/in\/pool-([^\/]*)\/?)/.exec(document.location.pathname))) {
						if(referrer.indexOf('/in/pool-') < 0)
							referrer += matches[1];
						//we come from a photo feed
						this.resolveGroupName(FELLOW,"http://www.flickr.com/groups/"+matches[2],referrer);
					} else if(matches = /\/photos\/([^\/]+)(\/map|\/[0-9]+)?\/?$/.exec(referrer) || document.location.pathname.indexOf("/in/photostream") >= 0) {
						if(matches[2] == '/map') {
							//we come from a map of the user photos
							this.insertComment("Seen on a map of your photos.",referrer);
						} else {
							var re = new RegExp("/photos/("+matches[1]+"|"+unsafeWindow.nextprev_currentContextID.replace('stream','')+")/");
							if(re.test(document.location.pathname) || document.location.pathname.indexOf("/in/photostream") >= 0) {
								//we come from the same user photo feed
								this.insertComment("Seen on your photo stream.",referrer);
							} else {
								//we come from someone else feed, it was therefore found in a comment.
								this.insertComment("Seen in some comments.",referrer);
							}
						}
					} else if(referrer.indexOf('/map') >= 0) {
						//we come from one of the maps
						this.insertComment("Seen on a map.",referrer);
					} 
				// Modifications by: Marcos Kuhns (http://www.kuhnsfam.com/)
					else if(referrer.indexOf('/places') >= 0) {
						//we come from places
						matches = /\/places\/(([^\/]+)\/?)*/.exec(referrer);
						if(matches && matches[2]) {
							this.insertComment("Seen on photos taken in "+decodeURI(matches[2]).replace('+', ' ')+".",referrer);
						} else {
							this.insertComment("Seen on the places page.",referrer);
						}
					} else if(referrer.indexOf('/interesting') >= 0 && referrer.indexOf('/explore') >= 0) {
						//we come from one of the interesting calendar
						this.insertComment("Seen in the interestingness archives.",referrer);
					} else if(referrer.indexOf('http://www.raum-fuer-notizen.de/explore/index.php?username=') >= 0) {
						//we come from the individual explore page
						this.insertComment("Seen on my individual explore page.",referrer);
					}  else if(referrer.indexOf('/explore') >= 0) {
						//we come from the explore page
						this.insertComment("Seen on the explore page.",referrer);
					} else if(referrer.indexOf('/search') >= 0) {
						//we come from a search
						this.insertComment("Found in a search.",referrer);
					} else if(referrer.indexOf('/photos_comments.gne') >= 0) {
						//we come from recent comments
						this.insertComment("Seen in my recent comments.",'');
					} else if(referrer.indexOf('interestingby.isaias.com.mx/pm.php') >= 0) {
						//we come from the popular finder at isaias
						this.insertComment("Found in your popular shots.",referrer);
					} else if(referrer.indexOf('bloglines.com/') >= 0) { 
						//we come from a rss reader site
						this.insertComment("Seen on a rss aggregator.","http://www.bloglines.com");
					}  else if(referrer.indexOf('krazydad.com/gustavog/FlickRandom.pl?group=') >= 0) {
						var groupid = referrer.replace(/http:\/\/(www.)?krazydad.com\/gustavog\/FlickRandom.pl\?group=/,'');
						this.resolveGroupName(RANDOM,groupid,referrer);
					} else if(referrer.indexOf('krazydad.com/gustavog/FlickRandom.pl') >= 0) {
						this.insertComment("Seen in a FlickrRandom selection of photos.",referrer);
					} else if(referrer.indexOf('flagrantdisregard.com/flickr/random.php') >= 0) {
						this.insertComment("Seen in FD's random photo browser.",referrer);
					} else if(referrer.indexOf('flagrantdisregard.com/flickr/fortune.php') >= 0) {
						this.insertComment("Seen in FD's fortune teller.",referrer);
					} else if(referrer.indexOf('flagrantdisregard.com/flickr/scout.php') >= 0) {
						this.insertComment("Seen in Flickr explore scout.",referrer);
					} else if(referrer.indexOf('houserdesign.com/flickr') >= 0) {
						this.insertComment("Seen on FlickrLeech.",referrer);
					} else if(referrer.indexOf('maps.yuan.cc/') >= 0) {
						this.insertComment("Seen on Yuan.CC Maps.",referrer);
					} else if(referrer.indexOf('webdev.yuan.cc/') >= 0) {
						this.insertComment("Seen on LfVr.",referrer);
					}  else if(referrer.indexOf('blog.flickr.com') >= 0) {
						this.insertComment("Seen on Flickr Blog.",referrer);
					} else if(referrer.indexOf('utata.org/spotlights') >= 0) {
						this.insertComment("Seen in the Utata spotlight.",referrer);
					} else if(referrer.indexOf('netomer.de/flickrtools/inspector') >= 0) {
						this.insertComment("Seen on Flickr Inspector.",referrer);
					} else if(referrer == "http://www.flickr.com/" || referrer == "http://flickr.com/" ||
							  referrer == "http://www.flickr.com" || referrer == "http://flickr.com") {
						this.insertComment("Seen on my Flickr home page.",'');
					} else if(referrer == "http://philmccluskey.com/projects/flickrfox/") {
						this.insertComment("Discovered using FlickrFox.",referrer);
					} else if(referrer.indexOf("http://16.gmodules.com/ig/") >= 0) {
						this.insertComment("Seen in my contacts' photos.",'');
					} else if(referrer.indexOf('flickr.com') < 0) {
						if(matches = /http:\/\/(www.)?([^\/]+).*/.exec(referrer)) {
							this.insertComment("Seen on "+matches[2],referrer);
						} else 
							this.insertComment("Seen on the Web.",referrer);
					} 
				//TODO: popular page, people page, favorites, home, last uploads
			} else {
				//we have no referer, but we can still try to guess
				if(matches = /\/in\/pool-([^\/]*)\/?/.exec(document.location.pathname)) {
					//we come from a group feed or something
					this.resolveGroupName(POOL,"http://www.flickr.com/groups/"+matches[1],"http://www.flickr.com/groups/"+matches[1]+'/pool');
				} else if(matches = /\/in\/set-([^\/]*)\/?/.exec(document.location.pathname)) {
					//we come from a group feed or something
					var set_url = document.location.pathname;
					set_url = set_url.replace(/photos\/([^\/]+)\/.*/,'http://www.flickr.com/photos/$1/sets/'+matches[1]);
					this.resolveSetName(matches[1],set_url,SET);
				}

			}
		},

		insertComment: function(comment, url) {
			var html = comment;
			if(url)
			html = '<a href="'+url+'" title="Seen on...">'+comment+'</a>';
			html = "\n\n--\n<i>"+html+"</i>"+
			' <em>(<a href="http://6v8.gamboni.org/Flickr-Add-referer-into-comments.html">?</a>)</em>';
			thisTextArea = document.evaluate(
											 "//div[@id='DiscussPhoto']/form/p[1]/textarea[@name='message']",
											 document,
											 null,
											 XPathResult.FIRST_ORDERED_NODE_TYPE, null
											 ).singleNodeValue;
			if(thisTextArea) {
				if(thisTextArea.value.indexOf(html) < 0) 
					thisTextArea.value += html;
				thisTextArea.selectionStart = thisTextArea.selectionEnd = 0;
			}
		},
		
		resolveGroupName: function(type,groupurl,referrer) {
			//Trick to do it using the flickr API with authentication already embeded in the page.
			var self = this;
			var listener = {
				flickr_urls_lookupGroup_onLoad: function(success, responseXML, responseText, params){
					if(success) {
						var rsp = responseText.replace(/<\?xml.*\?>/,'');
						rsp = new XML(rsp);
						var msg = 'Seen in '+rsp..groupname;
						switch(type) {
							case MAP: 
								msg = 'Seen on a map of '+rsp..groupname+' photos.';
								break;
							case DISCUSS:
								msg = 'Seen in a discussion of '+rsp..groupname+'.';
								break;
							case FELLOW:
								msg = "Seen next to a fellow photo of "+rsp..groupname+".";
								break;
						}
						
						self.insertComment(msg,referrer);
					} else
					GM_log("error looking for group"+referrer+':' + responseText+'.');
				},
				flickr_groups_getInfo_onLoad:function(success, responseXML, responseText, params){
					if(success) {
						var rsp = responseText.replace(/<\?xml.*\?>/,'');
						rsp = new XML(rsp);
						self.insertComment("Seen in random photos from "+rsp..name,referrer);
					} else
					GM_log("error looking for group"+groupurl+':' + responseText+'.');
				}
			};
			
			switch(type) {
				case RANDOM:
					unsafeWindow.F.API.callMethod('flickr.groups.getInfo', {
							group_id:groupurl				   
														  }, listener);
					break;
				case DISCUSS:
				case POOL:
				case MAP:
				case FELLOW:
					unsafeWindow.F.API.callMethod('flickr.urls.lookupGroup', {
							url:groupurl				   
														  }, listener);
			}
			
		}, 
		resolveSetName: function(id,referrer,type) {
			//Trick to do it using the flickr API with authentication already embeded in the page.
			var self = this;
			var listener = {
				flickr_photosets_getInfo_onLoad: function(success, responseXML, responseText, params){
					if(success) {
						var rsp = responseText.replace(/<\?xml.*\?>/,'');
						rsp = new XML(rsp);

						var msg = '';
						switch(type) {
							case MAP:
								msg = 'Seen on a map of your '+rsp..title+' set.';
								break;
							case SET:
							default:
								msg = 'Seen in your '+rsp..title+' set.';
								break;
						}
						
						self.insertComment(msg,referrer);
					} else
					GM_log("error looking for group" + responseText);
				}
			};
			
			unsafeWindow.F.API.callMethod('flickr.photosets.getInfo', {
				photoset_id:id				   
			}, listener);
			
		}, 
	}
		
	//======================================================================
	// launch
	try {
		window.addEventListener("load", function () {
									try {
										
										// update automatically (http://userscripts.org/scripts/show/2296)
										win.UserScriptUpdates.requestAutomaticUpdates(SCRIPT);
									} catch (ex) {} 
									
									var flickrgp = new FlickrReferComment();
		}, false);
	} catch (ex) {}
})();
