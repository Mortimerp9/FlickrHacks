// Flickr Scientist Photographers tools
// v0.2
// 2006-24-06
// Copyright (c) 2006, Pierre Andrews.
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// ==UserScript==
// @name	Flickr Scientist Photographers tools
// @namespace	http://pierreandrews.net/
// @description	tools for administrators of the scientist photographers group.
// @version        0.1
// @date           2006-19-06
// @creator        Pierre Andrews (mortimer.pa@free.fr)
// @include http://*flickr.com/groups/sciencegroup*
// ==/UserScript==

(function () {

	var PER_PAGE = 500;

	//======================================================================

	//update information
	var SCRIPT = {
		name: "Flickr Scientist Photographers tools",
		namespace: "http://pierreandrews.net/",
		description: "Tools for administrators of the scientist photographers group.",
		identifier: "http://pierreandrews.net/IMG/js/flickrscientistphotograp.user.js",
		version: "0.2",								// version
		date: (new Date(2006, 6, 24))		// update date
		.valueOf()
	};


	//======================================================================
	//to do the closure and get the right this.
	//adapted from http://persistent.info/greasemonkey/gmail.user.js

	function getObjectMethodClosure(object, method) {
		return function(arg) {
			return object[method](arg); 
		}
	}

	function getObjectMethodClosure0(object, method, arg) {
		return function() {
			return object[method](arg); 
		}
	}

	function getObjectMethodClosure01(object, method, arg,arg1) {
		return function() {
		    return object[method](arg,arg1); 
		}
	}
	function M8_log() {
		if(unsafeWindow.console)
			unsafeWindow.console.log(arguments);
		else
			GM_log(arguments);
	}

	var FlickrSPAdminTools = function() {this.init();}

	FlickrSPAdminTools.prototype = {
		votes: new Array(),
		voters: new Array(),
		imgSrc: new Array(),
		selectedPhotos: new Array(),
		removePhotosList: new Array(),
		removed: 0,

		init: function() {		   
			var threadTitle = document.evaluate(
												"//td[@id='GoodStuff']/h2",
												document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
												).singleNodeValue;
			var del = document.evaluate("//a[@class='Warning']",
										document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
										).singleNodeValue;
			if(threadTitle && del && del.innerHTML == "delete topic"  && (threadTitle.innerHTML.indexOf('Selection Week') >= 0 || threadTitle.innerHTML.indexOf('Selection week') >= 0 || threadTitle.innerHTML.indexOf('selection week') >= 0 ||  threadTitle.innerHTML.indexOf('Selection') >= 0)) {
				this.addVotingTool();
			}
			/*			var adminLink = document.evaluate(
						"//a[@href='/groups/sciencegroup/admin/']",
						document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
						).singleNodeValue;
						if(adminLink) {
						this.addCleanPoolTool(adminLink.parentNode);
						}*/
		},

		showHideDec: function(vote,voteDec) {
			if(vote.value!="x") voteDec.style.display = 'inline';
			else voteDec.style.display = 'none';
		},

		addVotingTool: function() {
			var message = document.evaluate(
											"//textarea[@name='message']",
											document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
											).singleNodeValue;
			if(message) {
				var images = document.evaluate(
											   "//table[@class='TopicReply']//td[@class='Said']/p//img",
											   document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
				for(var i = 0; i < images.snapshotLength; i++) {  
					var img = images.snapshotItem(i);
					var vote = document.createElement('select');
					var voteDec = document.createElement('select');
					var html = '';
					for(var j=1; j<10; j++) {
						html += '<option>'+j+"</option>\n";
					}
					vote.innerHTML = "<option>x</option>\n"+html+"<option>10</option>\n";
					voteDec.innerHTML = "<option>0</option>\n"+html;
					voteDec.style.display ='none';
					vote.addEventListener('change',getObjectMethodClosure01(this,'showHideDec',vote,voteDec),true);
					img.parentNode.parentNode.insertBefore(vote,img.parentNode);
					img.parentNode.parentNode.insertBefore(document.createTextNode('.'),img.parentNode);
					img.parentNode.parentNode.insertBefore(voteDec,img.parentNode);
					img.parentNode.parentNode.insertBefore(document.createElement('br'),img.parentNode);
					this.imgSrc.push(new Array(img.src.replace(/\.jpg/,'_t.jpg'),img.parentNode.href));
					this.votes.push(vote);
					this.votes.push(voteDec);
				}
				var button = document.createElement('button');
				button.innerHTML = "VOTE";
				button.type='button';
				button.className = 'Butt';
				var self = this;
				button.addEventListener('click',function() {
					var msg = '';
					for(var k = 0;k< self.votes.length;k=k+2) {
					    msg += (k/2+1)+'- '+self.votes[k].value;
					    if(self.votes[k+1].style.display == 'inline') msg+= '.'+self.votes[k+1].value;
					    msg+="\n";
					}
					message.value = msg;
					return false;
				},true);

				//For counting

				var buttonTotal = document.createElement('button');
				buttonTotal.innerHTML = "Make Total";
				buttonTotal.type='button';
				buttonTotal.className = 'Butt';
				var self = this;
				buttonTotal.addEventListener('click',function() {
					var paraphs = document.evaluate("//table[@class='TopicReply']//td[@class='Said']/p",
													document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
					var grades = new Array();
					var length = 0;
					for(var i = 0; i < paraphs.snapshotLength; i++) {  
						var paragraph = paraphs.snapshotItem(i);
						if(paragraph.innerHTML.indexOf('<img') < 0) {
							var lines = paragraph.innerHTML.split('<br>');
							var idx = 0;
							var cnt = false;
							for(var j = 0;j<lines.length;j++) {
								if(!grades[idx]) grades[idx] = new Array();
								if(matches = /^\s*([0-9]+-\s*)?([0-9x]+(.[0-9]+)?)\s*.*$/mi.exec(lines[j])) {
									var value = parseFloat(matches[2]);
									if(value != NaN || matches[2] == 'x' || matches[2] == 'X') {
										var cnt = true;
										var l = lines[j].replace(/^\s*[0-9]+-/,'');
										grades[idx++].push(value); 

									}
								}					    
							}
							if(cnt) {
								var author = document.evaluate("h4/a[2]",
															   paragraph.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
															   ).singleNodeValue;
								if(!author) author = document.evaluate("h4/a[1]",
																	   paragraph.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
																	   ).singleNodeValue;
								length++;
								self.voters.push(self.makeAuthorName(author.innerHTML));
							}
						}
					}
					var scores = new Array();
					for(var i=0; i < grades.length;i++) {
						if(grades[i].length > 0) {
							message.value += (i+1)+'- ';
							var tot = 0;
							var nan = 0;
							var line = '';
							for(var j=0; j<grades[i].length;j++) {
								line += ', '+self.voters[j]+' '+grades[i][j];
								if(isNaN(grades[i][j])) nan++;
								else {
									tot += grades[i][j];
								}
							}
							nan += length-grades[i].length;
							if(nan > 0) {
								M8_log((i+1)+"-"+tot+"/"+(grades[i].length-nan));
								var moy = tot/(grades[i].length-nan);
								line = line.replace(/NaN/g,moy);
								tot += moy*nan;
							}
							tot = parseInt(tot*100)/100;
							scores.push(new Array(tot,i));
							line = line.substr(1);
							message.value += line+' = '+tot+"\n";
						}
					}
					scores.sort(function(A, B) {
						var totA = A[0];
						var totB = B[0];
						return totB-totA;
					});
					var idx = 0;
					var last = scores[idx][0];
					var l =0;
					var places = new Array("First", "Second", "Third");
					message.value += "\n--------------------\n\n";

					while(l<3) {
						var sel = '';
						var img = '';
						while(scores[idx][0] == last) {
							sel += ' and '+(scores[idx][1]+1);
							img += '<a href="'+self.imgSrc[scores[idx][1]][1]+'"><img src="'+self.imgSrc[scores[idx][1]][0]+'"/></a>'+"\n";
							idx++;
						}
						if(idx < scores.length)
							last = scores[idx][0];
						else break;

						sel = sel.substr(4);
										 
						message.value +=places[l]+" Place: Image "+sel+" ("+scores[idx-1][0]+" points)\n";
						message.value += img+"\n";
						l++;
					}
				},true);
				message.parentNode.parentNode.insertBefore(buttonTotal,message.parentNode.nextSibling);
				message.parentNode.parentNode.insertBefore(button,message.parentNode.nextSibling);

			}		
		},

		//======================================================================
		// Pool cleaning bit
		//======================================================================
		
		addCleanPoolTool: function(links) {
			links.innerHTML += '<img width="1" height="11" alt="" src="/images/subnavi_dots.gif"/>';
			var clean = links.appendChild(document.createElement('a'));
			clean.innerHTML = "Clean Pool";
			clean.href = '#';
			clean.style.color = 'red';
			clean.addEventListener('click',getObjectMethodClosure(this,"cleanPool"),true);
		},

		cleanPool: function() {
			var back = document.body.appendChild(document.createElement('div'));
			back.id="poolCleaningBack";
			back.setAttribute('style',"position:absolute;background-color: black;opacity: 0.35; display: block; left: 0pt;");
			back.style.width = document.body.clientWidth+'px';
			back.style.height = document.body.clientHeight+'px';
			back.style.top = document.body.scrollTop+'px';
			var modal = document.body.appendChild(document.createElement('div'));
			modal.id="poolCleaning";
			modal.setAttribute('style',"position:absolute;background:white;border: 3px solid black;width: 300px;display: block; left: 442px;");
			modal.innerHTML = '<div style="padding:12px;background-color: #EEEEEE;clear:both;font-size: 14px;">Remove Photos that were not selected</div>';
			modal.style.top = document.body.scrollTop+(document.body.clientHeight/2)+'px';

			var dialog = modal.appendChild(document.createElement('div'));
			dialog.setAttribute('style',"padding: 18px 16px;clear:both;");
			var content = dialog.appendChild(document.createElement('div'));				
			content.innerHTML = "Fetching Photos";

			var caution = dialog.appendChild(document.createElement('div'));
			caution.style.margin = "1em";
			caution.style.paddingTop = "1em";
			caution.style.borderTop = "1px solid black"
			caution.innerHTML += '<strong>BEWARE</strong> This operation is not reversible and will remove any photo in the pool that has not been tagged with "SP selection" or posted since Monday.';
					
			var buttons = dialog.appendChild(document.createElement('div'));
			var ok = buttons.appendChild(document.createElement('button'));
			ok.type ='button';
			ok.disabled = true;
			ok.className='Butt';
			ok.innerHTML = '<img id="fgpe_pulser" src="http://www.flickr.com/images/pulser2.gif" style="vertical-align:middle;margin-right:4px;border:0px #ffffff" />';
			var cancel = buttons.appendChild(document.createElement('button'));
			cancel.type ='button';
			cancel.className = 'Butt';
			cancel.innerHTML = 'Cancel';

			cancel.addEventListener('click',function() {
				document.body.removeChild(back);
				document.body.removeChild(modal);
			},true);


			ok.addEventListener('click',getObjectMethodClosure01(this,'removePhotos',ok,content),true);

			modal.style.top = document.body.scrollTop+((document.body.clientHeight-modal.scrollHeight)/2)+'px';
			this.fetchGroupPhotos(ok,content);
		},

		
		fetchGroupPhotos: function(okButton,contentDiv) {
			
			var self = this;
			var listener = {
				flickr_groups_pools_getPhotos_onLoad: function(success, responseXML, responseText, params){
					if(success) self.process_taggedID(responseText,okButton,contentDiv);
					else {
						contentDiv.innerHTML = "There was an error fetching photos";
						M8_log(responseText);
					}
				}
			};
				
			unsafeWindow.F.API.callMethod('flickr.groups.pools.getPhotos', {tags:'spselection',group_id:"38873539@N00",per_page:PER_PAGE}, listener);

		},

		process_taggedID: function(rsp,okButton,contentDiv) {
			var rsp = rsp.replace(/<\?xml.*\?>/,'');
			rsp = new XML(rsp);
			if (rsp == null) {
				contentDiv.innerHTML = "There was an error fetching photos";
				M8_log(rsp);
			} else {	
				for each(photo in rsp..photo) {
					this.selectedPhotos.push(parseInt(photo.@id));
				}
				var self = this;
				var thisweekCnt = 0;
				var listener = {
					flickr_groups_pools_getPhotos_onLoad: function(success, responseXML, responseText, params){
						if(success) {
							var rsp = responseText.replace(/<\?xml.*\?>/,'');
							rsp = new XML(rsp);
							
							if (rsp == null) {
								contentDiv.innerHTML = "There was an error fetching photos";
								M8_log(rsp);
							} else {	
								var thisweek = new Date();
								thisweek = thisweek.getTime()
								//move to midnight
								+((24-thisweek.getHours())*3600+(60-thisweek.getMinutes())*60
								  //move to sunday
								  -thisweek.getDay()*3600*24)*1000;
								for each(photo in rsp..photo) {
									if(photo.@dateadded <= (thisweek/1000)) {
										if(self.selectedPhotos.indexOf(parseInt(photo.@id)) < 0) {
											self.removePhotosList.push(photo.@id);
										}
									} 
								}
								contentDiv.innerHTML = self.removePhotosList.length + ' photos found.';
								okButton.disabled = false;
								okButton.innerHTML = "Remove";
							}
						} else {
							contentDiv.innerHTML = "There was an error fetching photos";
							M8_log(responseText);
						}
					}
				};
				
				unsafeWindow.F.API.callMethod('flickr.groups.pools.getPhotos', {group_id:"38873539@N00",per_page:PER_PAGE}, listener);
			}
		},

		removePhotos: function(okButton,contentDiv) {
			contentDiv.innerHTML = "removing...";
			okButton.innerHTML = '<img id="fgpe_pulser" src="http://www.flickr.com/images/pulser2.gif" style="vertical-align:middle;margin-right:4px;border:0px #ffffff" />';
			var self = this;
			for(var i=0;i<this.removePhotosList.length;i++) {
				unsafeWindow.F.API.callMethod('flickr.groups.pools.remove', {group_id:"38873539@N00",photo_id:this.removePhotosList[i]}, {
					flickr_groups_pools_remove_onLoad: function(success, responseXML, responseText, params) {
						if(success) self.removed++;
						else M8_log("Cannot remove photo "+params['photo_id']+": " +responseText);
					}
				});
			}
			this.waitForAllRemove();
		},

		waitForAllRemove: function() {			
			if(this.removed >= this.removePhotosList.length) {
				document.body.removeChild(document.getElementById('poolCleaning'));
				document.body.removeChild(document.getElementById('poolCleaningBack'));
			} else {
				setTimeout(getObjectMethodClosure(this,'waitForAllRemove'),1000);
			}
		},
		
		makeAuthorName: function(name) {
			var sp = name.toLowerCase().replace(/(^[_'.]|['_.]$)/g,'').replace(/[_'.]/gi,' ');
			sp = sp.split(' ');
			if(sp.length > 1) {
				sp = sp[0].substr(0,1)+'.'+sp[1].substr(0,1)+'.';
			} else 
				sp = sp[0].substr(0,2);
			return sp;
		}
	}
		
	//======================================================================
	// launch
	try {
		window.addEventListener("load", function () {
			try {
				
				// update automatically (http://userscripts.org/scripts/show/2296)
				//win.UserScriptUpdates.requestAutomaticUpdates(SCRIPT);
			} catch (ex) {} 
			
			new FlickrSPAdminTools();
		}, false);
	} catch (ex) {}

})();
