$(function(){

	var urls = [
		'http://localhost:8080/api/source1/data.json',
		'http://localhost:8080/api/source2/data.json',
		'http://localhost:8080/api/source5/data.json',		
		'http://localhost:8080/api/source3/data.json',
		'http://localhost:8080/api/source5/data.json',			
		'http://localhost:8080/api/source4/data.json'
	];
	var responseObj ={};

	function asyncRequest(){
		
		var main_prom = new $.Deferred;
		main_prom.done(function(){			
		 	generateView();
		});

		var promises = $.map(urls, function(url){
			return $.ajax({
				type: "POST",
		        url: url,
		        success: function (data) {
		        	var responseItem = parseResponse(data);		        	
		        	setProperties(responseObj, responseItem);		        			        			        	
		        },
		        complete: function(xhr, textStatus) {
        			logToFooter("Async request", url, xhr.status);
    			} 
			});	
		});			
		
		var testAllPromDone = function() {
		    if (promises.filter(function(prom) {
		        return /resolved|rejected/.test(prom.state());
		    }).length == promises.length) {
		        main_prom.resolve();
		    }
		};
		promises.forEach(function(prom) { prom.always(testAllPromDone); });
	}

	function syncRequest(u){		
		if (u == urls.length){
			return;
		} else {
			$.ajax({
				type: "POST",
		        url: urls[u],
		        success: function (data) {
		        	var responseItem = parseResponse(data);		        	
		        	setProperties(responseObj, responseItem);
		        	if (u == urls.length-1) {
		        		generateView();
		        	}		        		        	
		        },
		        complete: function(xhr, textStatus) {
        			logToFooter("Sync request", urls[u], xhr.status);
    			} 
			}).always(function(){							
				setTimeout(function(){					
					syncRequest(u+1);
				}, 2000);
			});			
		}			
	}

	function parseResponse(data){
		var jsonObj = JSON.parse(data);	
		return 	jsonObj;
	}

	function setProperties(responseObj, responseItem){
		for (var property in responseItem){
			if (property in responseObj){
				responseObj[property]+=responseItem[property];
			} else {
				responseObj[property] = responseItem[property];
			} 	        		
		}
		logProperties(responseObj);
	}

	function clearObj(responseObj){
		for (var property in responseObj) {
			delete responseObj[property];
		}
		return responseObj;
	}

	function logProperties(responseObj){
		var logString = "";
		for (var property in responseObj) {			
			logString += property+": "+ responseObj[property]+"; ";
		}		
		console.log(logString);
	}

/////////  Пользовательские события //////////////

	$(".async_request").on("click", function(){			
		clearObj(responseObj);
		console.log("async request sended");
		asyncRequest();
	});	


	$(".sync_request").on("click", function(){
		clearObj(responseObj);
		console.log("sync request sended")
		syncRequest(0);		
	});

	$(".clear_page").on("click", function(){		
		clearPage();
	});


//////////// Визуальное оформление ///////////////
	
	function generateView() {
		responseObj = sorting(responseObj);
		for (var property in responseObj) {
			var cell = $("#empty_cell").clone(true).removeAttr("id").removeAttr("style").addClass("cell");
			cell.find(".panel-heading").html(property);
			cell.find(".panel-body").html(responseObj[property]);
			$(".cell_table").append(cell);			
		}
	}

	function clearPage() {
		$(".cell").remove();
		$("#logger").html('');
	}

	function sorting(assocArr) {
		var sArr = [], tArr = [], n = 0;
		for (i in assocArr){
			tArr[n++] = i;
		}
		tArr = tArr.sort();
		for (var i=0, n = tArr.length; i<n; i++) {
			sArr[tArr[i]] = assocArr[tArr[i]];
		}
		return sArr;
	}

	function logToFooter(nameOfProcess, link, status) {
		if (status == 200) {
			status = "success";
		} else {
			status = "code " + status;
		}
		var logStr = "<p>"+nameOfProcess + " to "+ link + " was completed with " + status+"</p>";
		$("#logger").append(logStr);
	}


});




