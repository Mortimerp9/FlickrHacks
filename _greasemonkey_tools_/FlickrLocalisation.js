//FlickrLocalisation, script to help localise user script for Flickr
//version 0.4
//release 29 Jun 2007
//author: Pierre Andrews
// For reference: http://6v8.gamboni.org/Localising-Flickr-Greasemonkey.html
// and http://6v8.gamboni.org/Help-localise-Flickr-scripts.html

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

/*
This is a set of function to help localise greasemonkey script (or other user scripts) on Flickr.
The FlickrLocaliser will deal with finding the language used by the current user and translate your strings in the right language (as long as you provide the translations).

You have to initialise it with an object describing the translations of your static strings:
var	localiser = new FlickrLocaliser({
				'en-us' : {
					'loading':'Fetching page:@nbrpage@/@total@.',
						'showing':'Showing page:@page@/@total@.',
						'enable':'Enable Auto Page',
						'nophoto':'No more Photos',
						'nodiscussion': "No more Discussions",
						'noreply':'No more Replies',
						'notopic':'No more Topics',
						'nocomment':'No more Comments',
						'nopeople':'No more People',
						'nocontact':'No more Contacts'
						},
					'fr-fr':{
					'loading':'Chargement de la page:@nbrpage@/@total@.',
						'showing':'Page Actuelle:@page@/@total@.',
						'enable':'Activer l\'Auto Pagination',
						'nophoto':'Plus de Photos',
						'nodiscussion': "Plus de Discussions",
						'noreply':'Pas d\'autre r&eacute;ponse',
						'notopic':'Pas d\'autre sujet',
						'nocomment':'Pas d\'autre commentaire',
						'nopeople':'Pas d\'autre Membre',
						'nocontact':'Pas d\'autre Contact'
						},
						defaultLang:'en-us'
		});

The object contains fields for each language provided by your application. In this example: 'en-us', 'fr-fr' which point to an object pointing key values to translation strings. The key values are the same in each language, just the right hand side changes. Remember to use HTML entities for special characters.

The object also contains a field defaultLang which will be used when the user uses a language without translations.

To translate a string, use:
var message = localiser.localise('showing',{'page':(self.next_request-1),'total':self.nbr_page})

The first parameter is the key for the translation. The second is a list of parameters to replace in the localised string. The part of the localised string between @and@ will be replaced by the corresponding parameter value.

*/

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
			var langA = document.evaluate(
										  "//p[@class='LanguageSelector']//a[contains(@class,'selected')]",
										  document,
										  null,
										  XPathResult.FIRST_ORDERED_NODE_TYPE, null
										  ).singleNodeValue
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
			if(!local) return string;
			var toRet = local;
			while(matches = /@([^@]+)@/g.exec(local)) {
				if(matches[1]) {
					var arg = matches[1];
					var rep = new RegExp('@'+arg+'@','g');
					if(params[arg])
						toRet = toRet.replace(rep,params[arg]);
					else
						toRet = toRet.replace(rep,'');
				}
			}
			return toRet;
		} else return undefined;
	}

}

/*****************************Flickr Localisation**********************/
