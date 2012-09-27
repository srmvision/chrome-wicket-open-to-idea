if (document.body) {
	var selector = 'wktdbg';
	var rightclicked_item = null;

	var $feedback = $("#wktdbg .modal-footer p.info");

	var fbText = function(_txt, _timeout){
		$feedback.text(_txt);
		if (_timeout){
			setTimeout(function(){
				fbText('');
			}, _timeout);
		}
	}

	var sendToIde = function(_self, _host){
		var clazzName = $(_self).data('clazzName');
		console.log('Sending to your IDE = ' + clazzName);
		fbText('Sending to your IDE...');
	    $.ajax('http://'+_host, {data:{cn:clazzName}, method:'get', success:function(){
	    	fbText('Sent to your IDE !', 5000);
	    }, error: function(){
	    	fbText('Unable to send to your IDE !', 10000);
	    }});
	    return false;
	};
	var buildModal = function(_elt, _host){
		var $div = $("#wktdbg .modal-body p");
		if ($div.length == 0){
			$('<div class="modal hide" id="wktdbg"><div class="modal-header">'+
		  '<button type="button" class="close" data-dismiss="modal">×</button>'+
		  '<h3>Chrome Debug to IDE</h3>'+
		  '</div>'+
		  '<div class="modal-body">'+
		  '<p></p>'+
		  '</div>'+
		  '<div class="modal-footer">'+
		  '<p class="info"></p>' +
		  '<a href="#" class="btn btn-primary" data-dismiss="modal">Close</a>'+
		  '</div>'+
		  '</div>').appendTo(document.body);
		  $div = $("#wktdbg .modal-body p");
		}
		$div.children().remove();
		fbText('');
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
		$div.append($ul);
		$('#wktdbg').modal('show');
	};

	document.body.addEventListener("contextmenu", function(e) {
		rightclicked_item = e.srcElement;
	});
	document.body.addEventListener("click", function() {
	    rightclicked_item = null;
	});

	chrome.extension.onRequest.addListener(
				  function(request, sender, sendResponse) {
			  		var elements = $("["+selector+"]");
				  	if (elements.length){
				  		var $clicked = $(rightclicked_item);
					  	var elt = $clicked.parents('['+selector+']');
					  	if ($clicked.attr(selector)){
					  		elt.push(0, $clicked);
					  	}
						buildModal(elt, request.host);				  	
				  	}else{
				  		console.log(" ------ WICKET DEBUG : Nothing found ------");
				  	}
				});
}
