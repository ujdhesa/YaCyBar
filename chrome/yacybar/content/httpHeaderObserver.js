var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

/* Defining the http header observer */
var observer = {
	observe: function(subject,topic,data){
		if (topic == 'http-on-modify-request') {
		subject.QueryInterface(Components.interfaces.nsIHttpChannel);
			this.onModifyRequest(subject);
		}
	},
	
	onModifyRequest : function (oHttp) {
		// getting the URI
		// var uri = oHttp.URI.asciiSpec;
		var doIndexing = prefManager.getBoolPref("extensions.yacybar.indexControl");
		var proxyOn = (prefManager.getIntPref("network.proxy.type")==2); //this checks for ANY proxy, not just yacy ...
		if (doIndexing == null) {
			doIndexing = true;
		}
		if (!doIndexing && proxyOn) {
			if (oHttp != null) oHttp.setRequestHeader("X-YACY-Index-Control", "NO-INDEX" , true);
		}
	}
};

// registering the header observer
var origLoad = window.onload;
var origUnload = window.onunload;
window.onload = function startObserver(ev) {
	origLoad(ev);
	var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	observerService.addObserver(observer, "http-on-modify-request",   false);
	//observerService.addObserver(this, "http-on-examine-response", false);
	//observerService.addObserver(this, "tamper-data-on-load",      false);
}
window.onUnload = function stopObserver(ev) {
	var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	observerService.removeObserver(observer);
	origUnload(ev);
}
