// ==UserScript==
// @name	Flickr Exif Info
// @namespace	http://6v8.gamboni.org/
// @description Select which exif info you want to see on the photo page
// @version        0.4
// @identifier	http://6v8.gamboni.org/IMG/js/flickrexifinfo.user.user.js
// @date           2008-04-07
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com/photos/*/*
// @include http://*flickr.com/photo_exif.gne?id=*
// @include http://*flickr.com/photos/*/*/meta*
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

	//This is an array to help in different conversion of the raw data.
	// you can map a exif value name as displayed by flickr
	// with:
	// - it's real name in the EXIF info
	// - it's unit
	// - the name of the EXIF info defining the unit
	// - a replacement regexp for when you add this info in the tags (%u in in the replacement will be replaced by the unit if any)
	// see the existing values to understand more.

	var MAPPING = {
		'Image Width': {map:'Pixel X-Dimension',direct_unit:'pixel'},
		'Image Height': {map:'Pixel Y-Dimension',direct_unit:'pixel'},
		'Y-Resolution': {indirect_unit:'Resolution Unit'},
		'X-Resolution': {indirect_unit:'Resolution Unit'},
		'ISO Speed' : {addtag:{regexp:/([0-9]+)/,replacement:'iso:$1'}},
		'Focal Length' : {addtag:{regexp:/([0-9]+) mm/,replacement:'$1mm'}},
		'Exposure' : {addtag:{regexp:/.*\(([\/0-9]+)\)/,replacement:'$1s'}},
	};


	//conversion for the units, I have no idea what the 0 and 1 stands for, but 2 is for dpi apparently :D
	var UNITS = new Array('?','?','dpi');


	//update information
	var SCRIPT = {
		name: "Flickr Exif Info",
		namespace: "http://6v8.gamboni.org/",
		description: "Select which exif info you want to see on the photo page",
		identifier: "http://6v8.gamboni.org/IMG/js/flickrexifinfo.user.js",
		version: "0.4",								// version
		date: (new Date("2008-04-07"))		// update date
		.valueOf()
	};

	function getObjectMethodClosure11(object, method,arg1) {
		return function(arg) {
			return object[method](arg,arg1);
		}
	}

	function M8_log() {
		if(console)
			console.log(arguments);
		else
			GM_log(arguments);
	}

	var flickrexifinfo = function() {this.init();}

	flickrexifinfo.prototype = {
		config: GM_getValue('ExifInfoConfig'),

		init: function() {
			if(document.location.pathname.indexOf("/meta") >= 0) {
				this.showConfigurationBoxes();
			} else {
				this.showMoreExif();
			}
		},

		showConfigurationBoxes: function() {
			var infos = document.evaluate(
										  "//table[@id='Inbox']/tbody/tr/td[1]/b",
										  document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			for(var i = 0; i < infos.snapshotLength; i++) {
				var exif = infos.snapshotItem(i);
				var name = exif.innerHTML.replace(/:$/,'');
				var check = document.createElement('input');
				check.type = 'checkbox';
				check.addEventListener('change',getObjectMethodClosure11(this,'addToConf',name),false);
				if(i == 0) {
					check.checked = true;
					check.disabled = true;
				} else if(this.config && (this.config.indexOf(','+name+',') >= 0)) {
					check.checked = true;
				}
				var td = document.createElement('td');
				td.style.width = '13px';
				td.appendChild(check);
				exif.parentNode.parentNode.insertBefore(td,exif.parentNode);
			}
		},

		addToConf: function(event, name) {
			var newConfig = this.config;
			if(!newConfig) newConfig = ',';
			if(event.target.checked) {
				newConfig += name+',';
			} else {
				newConfig = newConfig.replace(','+name+',',',');
			}
			this.config = newConfig;
			GM_setValue('ExifInfoConfig',this.config);
		},

		showMoreExif: function() {
			var moreLot = document.evaluate(
										 "//td[@class='RHS']/ul//li/a[@class='Plain']",
										 document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
										 );
			for(var i = 0; i < moreLot.snapshotLength; i++) {
				var more = moreLot.snapshotItem(i);
				if(more.innerHTML == "More properties") {
					var photoid = more.href.replace(/http:\/\/(www.)?flickr.com\/photos\/[^\/]*\/([0-9]+)\/meta/,'$2');
					if(this.config.length > 1) {
						var ul = document.createElement('ul');

						var self = this;
						var listener = {
							flickr_photos_getExif_onLoad: function(success, responseXML, responseText, params){
								var rsp = responseText.replace(/<\?xml.*\?>/,'');
								rsp = new XML(rsp);
								var finds = self.config.split(',');
								for(var i=0;i<finds.length;i++) {
									if(finds[i]) {
										var mapping = MAPPING[finds[i]];
										var map = null;
										if(mapping)
										map = mapping.map;
										var ex = '';
										if(!map) {
											ex = rsp..exif.(@label == finds[i]);
										}  else {
											ex = rsp..exif.(@label == map);
										}
										if(new String(ex.clean).length > 0)
											ex = ex.clean;
										else
											ex = ex.raw;
										if(new String(ex).length > 0) {
											var unit = '';
											if(mapping) {
												unit =  mapping.direct_unit;
												if(!unit && mapping.indirect_unit) {
													unit = UNITS[parseInt(rsp..exif.(@label == mapping.indirect_unit).raw)];
												}
											}
											var li = ul.appendChild(document.createElement('li'));
											li.className = 'Stats';
											li.innerHTML = '<b>'+finds[i]+':</b> '+ex;
											if(unit && new String(unit).length > 0)
												li.innerHTML += ' '+unit;
											if(document.getElementById('tagadderlink')) {
												var addtag = li.appendChild(document.createElement('a'));
												addtag.innerHTML = ' [+]';
												addtag.title ="add this as a tag";
												addtag.href="javascript:;";
												addtag.setAttribute('style','text-decoration:none;color: #C9C9C9;');
												addtag.addEventListener('click',getObjectMethodClosure11(self,'addtag',new Array(photoid,finds[i],ex,unit)),false);
											}
										}
									}
								}
								more.parentNode.appendChild(ul);
								var li = document.createElement('li');
								li.className = 'Stats';
								li.appendChild(more);
								ul.appendChild(li);
							}
						};

						unsafeWindow.F.API.callMethod('flickr.photos.getExif', {
								photo_id:photoid
									}, listener);

					}
					break;
				}
			}
		},

		addtag: function(evt,args) {
			var id =args[0];
			var title = args[1];
			var value = new String(args[2]);
			var unit = args[3];
			var mapping = MAPPING[title];
			if(mapping && mapping.addtag) {
				value = value.replace(mapping.addtag.regexp,mapping.addtag.replacement);
				if(unit) value.replace(/%u/g,unit);
			}
			unsafeWindow.tagrs_addTag(id,value);
		}
	}
	//======================================================================
	// launch
	try {
		window.addEventListener("load", function () {
									try {

										// update automatically (http://userscripts.org/scripts/show/2296)
										win.userScriptUpdates.requestAutomaticUpdates(SCRIPT);
									} catch (ex) {}

									var flickrgp = new flickrexifinfo();
		}, false);
	} catch (ex) {}
})();
