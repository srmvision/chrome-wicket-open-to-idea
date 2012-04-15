function createContextMenu(){
	var contextMenuActive = localStorage["context"];
	if (contextMenuActive){
		contextMenuActive = contextMenuActive.split(',');
		for (var i = contextMenuActive.length - 1; i >= 0; i--) {
			contextMenuActive[i]=contextMenuActive[i].trim();
			if (contextMenuActive[i].length == 0){
				contextMenuActive.splice(i, 1);
			}
		};
	}else{ 
		contextMenuActive = [ 'http://*/*', 'https://*/*' ];
	}
  	function onClickHandler(info, tab) {
  	  var settings = localStorage["host"] || 'localhost:10462';
	  chrome.tabs.sendRequest(tab.id, {host : settings});
	}
	chrome.contextMenus.removeAll();
	chrome.contextMenus.create({'title': "Wicket Debug This",
                              'documentUrlPatterns': contextMenuActive,
                              'contexts':['all'],
                              'onclick': onClickHandler});
}
if (chrome.contextMenus){
	createContextMenu();
}


