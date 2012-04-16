if (document.body) {
	var selector = 'wktdbg';
	var elements = $("["+selector+"]");
	var rightclicked_item = null;

	var sendToIde = function(_self, _host){
		var clazzName = $(_self).data('clazzName');
		console.log('Sending to your IDE = ' + clazzName);
	    $.ajax('http://'+_host, {data:{cn:clazzName}, method:'get', success:function(){
	    	
	    }});
	    return false;
	};
	var buildModal = function(_div, _elt, _host){
		_div.children().remove();
		_div.append($("<a href='#'><strong>CLOSE</strong></a>").bind('click', function(){
			_div.hide();
		}));
	  	var $ul = $("<ul>");
	  	for (var i = 0; i < _elt.length; i++) {
	  		var debugAttr = $(_elt[i]).attr(selector);
	  		var $li = $("<li>");
	  		var $a = $("<a>").attr('href', '#').bind('click', function(){
	  			sendToIde(this, _host);
	  		});
	  		$a.data('clazzName', debugAttr).append(debugAttr);
	  		$li.append($a);
	  		$ul.append($li);
	  	};
		_div.append($ul);
		$(document.body).append(_div);
		_div.show();
	};

	document.body.addEventListener("contextmenu", function(e) {
		rightclicked_item = e.srcElement;
	});
	document.body.addEventListener("click", function() {
	    rightclicked_item = null;
	});
	var $div = $("<div>").css({'background-color':'white',
							   'position':'absolute', 
							   'z-index':'40000',
							   'height':'300px',
							   'overflow':'auto'});
	chrome.extension.onRequest.addListener(
				  function(request, sender, sendResponse) {
				  	if (elements.length){
				  		var $clicked = $(rightclicked_item);
					  	var elt = $clicked.parents('['+selector+']');
					  	if ($clicked.attr(selector)){
					  		elt.push(0, $clicked);
					  	}
						buildModal($div, elt, request.host);				  	
				  	}else{
				  		console.log(" ------ WICKET DEBUG : Nothing found ------");
				  	}
				});
}
