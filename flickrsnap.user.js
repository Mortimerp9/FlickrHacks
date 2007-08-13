// Flickr Snap
// v0.1
// 2006-05-09
// Copyright (c) 2006, Pierre Andrews.
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// ==UserScript==
// @name	Flickr Snap
// @namespace	http://6v8.gamboni.org/Flickr-Snap.html
// @description	Add thumbnails of flickr image where a link goes there.
// @source         http://6v8.gamboni.org/Flickr-Snap.html
// @identifier     http://6v8.gamboni.org/IMG/js/flickrsnap.user.js
// @version        0.1
// @date           2006-05-09
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include	*
// @exclude http://flickr.com*
// @exclude http://www.flickr.com*
// ==/UserScript==

(function () {

	var win = (unsafeWindow || window.wrappedJSObject || window);

	//update information
	var SCRIPT = {
		name: "Flickr Snap",
		namespace: "http://6v8.gamboni.org/Flickr-Snap.html",
		description: "Add thumbnails of flickr image where a link goes there.",
		source: "http://6v8.gamboni.org/Flickr-Snap.html",			// script homepage/description URL
		identifier: "http://6v8.gamboni.org/IMG/js/flickrsnap.user.js",
		version: "0.1",								// version
		date: (new Date(2006, 5, 09))		// update date
		.valueOf()
	};

	//======================================================================


	//======================================================================

	 // constants
	 // http status constants
	var OK = 200;
	
	// xmlhttprequest readystate
	var COMPLETE = 4;
	
	var DEBUG = false;

	//======================================================================
	//exception
	var procException =  function(msg, code, req) {
			this.msg = msg;
			this.code =code;
			this.req = req;
	};
		
	
	//======================================================================
	//to do the closure and get the right this.
	//adapted from http://persistent.info/greasemonkey/gmail.user.js

	function getObjectMethodClosure(object, method) {
		return function() {
			return object[method](); 
		}
	}

	function getObjectMethodClosure0(object, method,args) {
		return function() {
			return object[method](args); 
		}
	}

	function getObjectMethodClosure1(object, method) {
		return function(arg) {
			return object[method](arg); 
		}
	}

	
	function getObjectMethodClosure11(object, method,args3) {
		return function(arg) {
			return object[method](arg,args3); 
		}
	}

	function getObjectMethodClosure2(object, method) {
		return function(arg,arg2) {
			return object[method](arg,arg2); 
		}
	}
	function getObjectMethodClosure21(object, method,args3) {
		return function(arg,arg2) {
			return object[method](arg,arg2,args3); 
		}
	}
	

	//======================================================================

	
	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	/*
	 * Configurable variables. You may need to tweak these to be compatible with
	 * the server-side, but the defaults work in most cases.
	 */
	var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
	var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

	/*
	 * These are the functions you'll usually want to call
	 * They take string arguments and return either hex or base-64 encoded strings
	 */
	function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
	function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
	function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
	function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
	function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
	function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

	/*
	 * Perform a simple self-test to see if the VM is working
	 */
	function md5_vm_test()
	{
		return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
	}

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len)
	{
		/* append padding */
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var a =  1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d =  271733878;

		for(var i = 0; i < x.length; i += 16)
			{
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;

				a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
				d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
				c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
				b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
				a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
				d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
				c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
				b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
				a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
				d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
				c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
				b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
				a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
				d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
				c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
				b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

				a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
				d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
				c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
				b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
				a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
				d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
				c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
				b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
				a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
				d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
				c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
				b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
				a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
				d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
				c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
				b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

				a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
				d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
				c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
				b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
				a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
				d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
				c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
				b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
				a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
				d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
				c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
				b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
				a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
				d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
				c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
				b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

				a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
				d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
				c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
				b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
				a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
				d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
				c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
				b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
				a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
				d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
				c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
				b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
				a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
				d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
				c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
				b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

				a = safe_add(a, olda);
				b = safe_add(b, oldb);
				c = safe_add(c, oldc);
				d = safe_add(d, oldd);
			}
		return Array(a, b, c, d);

	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Calculate the HMAC-MD5, of a key and some data
	 */
	function core_hmac_md5(key, data)
	{
		var bkey = str2binl(key);
		if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

		var ipad = Array(16), opad = Array(16);
		for(var i = 0; i < 16; i++)
			{
				ipad[i] = bkey[i] ^ 0x36363636;
				opad[i] = bkey[i] ^ 0x5C5C5C5C;
			}

		var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
		return core_md5(opad.concat(hash), 512 + 128);
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
		return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	 * Convert a string to an array of little-endian words
	 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
	 */
	function str2binl(str)
	{
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz)
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
		return bin;
	}

	/*
	 * Convert an array of little-endian words to a string
	 */
	function binl2str(bin)
	{
		var str = "";
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < bin.length * 32; i += chrsz)
			str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
		return str;
	}

	/*
	 * Convert an array of little-endian words to a hex string.
	 */
	function binl2hex(binarray)
	{
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++)
			{
				str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
					hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
			}
		return str;
	}

	/*
	 * Convert an array of little-endian words to a base-64 string
	 */
	function binl2b64(binarray)
	{
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i += 3)
			{
				var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
					| (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
					|  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
				for(var j = 0; j < 4; j++)
					{
						if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
						else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
					}
			}
		return str;
	}



	//======================================================================


	//======================================================================
	//Simple calls to flickr REST API, from the batch enhancer script
	// needs the md5 and status_msg code above

	win.FlickrAPI = function(){;}
	
	win.FlickrAPI.prototype = {	// flickr api 
		
		init: function(api_key,shared_secret) {
			this.api_key = api_key;
			this.shared_secret = shared_secret;
			if(shared_secret) this.auth_token = GM_getValue('auth_'+this.api_key);
			
			if (this.shared_secret && !this.auth_token) {
				this.askForAuth();
				
			} 
		},

		askForAuth: function() {
			this.flickr_api_call("flickr.auth.getFrob",
				{api_sig: this.getMethodSig("flickr.auth.getFrob", {api_key: this.api_key})}, 
								 getObjectMethodClosure2(this,'frob_loaded'),
								 getObjectMethodClosure1(this,'frob_failed'));
		},

		frob_loaded: function(req, rsp) {

			this.frob = rsp..frob[0];
			if(DEBUG) GM_log("received Frob "+this.frob);
			var api_sig = this.getMethodSig(false, {api_key: this.api_key,frob:this.frob,perms:"read"});
			var url= "http://flickr.com/services/auth/?api_key="+this.api_key+"&perms=read&frob="+this.frob+"&api_sig="+api_sig;
			//Here, we need the status_msg code
			status_msg.msgbox2("This script needs to be authorized. <br>" +
							  "<b style=\"font-variant:small-caps;\">Click [<a onclick='window.open(\""+url+"\"); return false'>Step1</a>]</b>, " +
							  "follow the instructions in the popup window,<br> " +
							  "then return here click Step2.<br> " +
							  "Popup blockers may cause this not to work.<br>You'll only have to do this once.","Step2",getObjectMethodClosure1(this,'getToken'));
		},

		frob_failed: function(e) {
			status_msg.msgbox('Couldn\'t authorize, for whatever reason.');
		},
		
		token_loaded: function(req,rsp) {		
			status_msg.hide();
			var token = rsp..token[0];
			this.nsid = rsp..user.@nsid[0];		
			
			if(DEBUG) GM_log("authenticated with user "+this.nsid+": "+token);
			this.auth = token;

			GM_setValue('auth_'+this.api_key,""+token);
		},
		
		token_failed:function(e) {
			status_msg.msgbox('Couldn\'t authorize, for whatever reason.');
		},
		
		// set it all up
	
		getToken: function()
		{
			status_msg.show('authorizing...');
			var api_sig = this.getMethodSig("flickr.auth.getToken", {api_key: this.api_key,frob:this.frob});
			this.flickr_api_call("flickr.auth.getToken",
			{frob: this.frob,api_sig: api_sig},
								 getObjectMethodClosure2(this,'token_loaded'),
								 getObjectMethodClosure1(this,'token_failed'));
		},	

		do_req: function ( method, proc_request, url, referer, data ) {
			var headers = new Object();
			var details = {
				method    : method,
				onload    : function(d) { proc_request(d) },
				url       : url,
				header    : headers
			};

			if (referer != null)
				headers['Referer'] = referer;
			
			if (data != null) {
				headers['Content-Type'] = 'application/x-www-form-urlencoded';
				details['data']         = data;
			}
			
			GM_xmlhttpRequest( details );
		},
		
		
		
		// a proc just spins around waiting for the thing to succeed or fail
		// then calls a callback, if we got 200 OK message.
		make_proc: function (op_name, ok_cb, fail_cb) {
			
			return function(req) { 
				
				try {
					// init progress
					document.body.style.cursor = 'progress';
					
				if (req.readyState != COMPLETE) {
					return;
				}
					
					// if (alert_response) { alert(req.responseText); }
					
					if( req.status != OK ) {
						throw new procException( op_name + " request status was '" + req.status + "'", 0, req )
					}
					
					ok_cb(req);
					
				} catch(e) {
					
					// clean up progress
					document.body.style.cursor = 'default';
					
					
					if (e instanceof procException) {
						if( fail_cb != null )
							fail_cb( e );
						else {
							GM_log( e.msg );
							if (DEBUG) {
								GM_log(e.req.responseText);
							}
						}
					} else {
						throw(e);
					}
				}
				
				// clean up progress
				
				document.body.style.cursor = 'default';
			}
		},


		// this is wraps the spinning proc like above,
		// except it parses the flickr api response a little before deciding all is well,
		// and passing control to the all-is-well callback
		make_flickr_api_proc: function(op_name, ok_cb, fail_cb) {

			function parse_and_ok_cb(req) {
				if(DEBUG) GM_log(req.responseText);
				var rsp = req.responseText.replace(/<\?xml.*\?>/,'');
				var rsp = new XML(rsp);
				// var rsp = req.responseXML.getElementsByTagName('rsp').item(0);
				
				if (rsp == null) {
					throw new procException( "Could not understand Flickr's response.", 0, req );
				}
				
				var stat = rsp.@stat;
				if (stat == null) {
					throw new procException( "Could not find status of Flickr request", 0, req);
				}
				
				if (stat != 'ok') {
					if (stat == 'fail') {
						var err_node = rsp.err[0];
						var code = err_node.@code;
						var err_msg = err_node.@msg;
						throw new procException( err_msg, code, req );
					} else {
						throw new procException("Unknown error status: '" + stat + "'", 0, req)
					}
				}
				
				ok_cb(req, rsp);
			}
			
			return this.make_proc(op_name, parse_and_ok_cb, fail_cb);
		},

		getMethodSig: function(method, args)
		{
			var data = new Array();		
			var names = new Array();
			var sig = this.shared_secret;
			
			if(method) {
				data['method'] = method;	
				names.push('method');
			}
			for (var key in args) {
				data[key] = args[key];
				names.push(key);
			}		
			names.sort();
			for (i in names) {
				sig += names[i] + data[names[i]];
			}		
			return hex_md5(sig);
		},


		// construct a flickr api request, with method and args, 
		// if that worked, call callback with request object.
		flickr_api_call: function( method, args, ok_cb, fail_cb,with_auth) {
			
			var http_method = args['http_method'];
			http_method = ( http_method ? http_method : 'GET' );
			delete args['http_method'];

			args['api_key'] = this.api_key;
			
			if (this.shared_secret && with_auth && this.auth_token) {
				args['auth_token'] = this.auth_token;
				args['api_sig'] = this.getMethodSig(method, args);
			} else if(DEBUG) GM_log('not signing: ' + method);
			
			
			var url = 'http://www.flickr.com/services/rest/?method=' + encodeURIComponent(method);
			
			for (var key in args) {
				url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
			}
			if(DEBUG) GM_log(url);

			var proc = this.make_flickr_api_proc( method, ok_cb, fail_cb )
			
			this.do_req(http_method, proc, url, null, null)
		},

	}

	//======================================================================

	var MAX_DAY_COUNT = 5;
	var NUMBER_OF_LAST_PHOTOS = 8;
	
	win.FlickrSnap = function() {;}

		
	win.FlickrSnap.prototype = {
		init: function(key,secret) {
			this.api = new win.FlickrAPI();
			this.api.init(key,false);
			var auctionLinks = document.evaluate(
												 "/html/body//a",
												 document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);  // Get all group
			
			for(var i = 0; i < auctionLinks.snapshotLength; i++) {  // For each LINK...
				var al = auctionLinks.snapshotItem(i);
					this.processA(al);
			}  		
		},
		checkImage: function(link) {
			for(var i=0;i<link.childNodes.length;i++) {
				if(link.childNodes.item(i).nodeName == 'IMG') {
					return true;
				}
			}
		},
		processA: function(link) {
			if(matches = /^(http:\/\/)?(www\.)?flickr.com\/photos\/[^\/]+?\/([0-9]+)/i.exec(link.href)) {
				if(!this.checkImage(link)) { //the link is not on an image
					this.api.flickr_api_call('flickr.photos.getSizes',
						{ photo_id: matches[3], http_method: 'POST' },
											 getObjectMethodClosure21(this,'getSizes_done', link),
											 getObjectMethodClosure1(this,'request_failed'));
				}
			} else if(matches = /^(http:\/\/)?(www\.)?flickr.com\/photos\/[^\/]+?\/sets\/([0-9]+)/i.exec(link.href)) {
				if(!this.checkImage(link)) { //the link is not on an image
					this.api.flickr_api_call('flickr.photosets.getPhotos',
						{ photoset_id: matches[3], http_method: 'POST' },
											 getObjectMethodClosure21(this,'getSetPhotos_done', link),
											 getObjectMethodClosure1(this,'request_failed'));
				}

			}
		},
		request_failed: function(err) {
			GM_log(err.msg);
		},
		getSizes_done: function(req,rsp,link) {
			img = link.appendChild(document.createElement('IMG'));
			img.src = rsp..size.@source[0];
		},
		getSetPhotos_done: function(req,rsp,link) {
			var primary = rsp..photo.(@isprimary == '1');
			this.api.flickr_api_call('flickr.photos.getSizes',
				{ photo_id: primary.@id, http_method: 'POST' },
									 getObjectMethodClosure21(this,'getSizes_done', link),
									 getObjectMethodClosure1(this,'request_failed'));
		}
	}
		
	// update automatically (http://userscripts.org/scripts/show/2296)
	try {
		window.addEventListener("load", function () {
			try {
				win.UserScriptUpdates.requestAutomaticUpdates(SCRIPT);
			} catch (ex) {} 
			
			var flickrgp = new win.FlickrSnap();
			flickrgp.init( "e8c3239ff04c102ce2d6ed885bf99005");	
		}, false);
	} catch (ex) {}

})();
