(function () {
    "use strict";

    module.exports = function (app, modules) {
    	var nlu = modules.nlu;

    //process text throug NLU directly
        app.post("/nlu/text", function (req, res) {
   			var text = req.body.text || false;
	        if(text){
	        	nlu.processText(text).then(function(data){
	        		res.send({
	        			status: true,
	        			data: data
	        		});
	        	}).catch(function(error){
	        		res.send({
	        			status: error
	        		});
	        	});
	        }
	        else{
	        	res.send({
	        		status: error
	        	});
	        }
	    });

    //process url throug NLU directly
        app.post("/nlu/url", function (req, res) {
   			var url = req.body.url || false;
	        if(url){
	        	nlu.processText(url).then(function(data){
	        		res.send({
	        			status: true,
	        			data: data
	        		});
	        	}).catch(function(error){
	        		res.send({
	        			status: false
	        		});
	        	});
	        }
	        else{
	        	res.send({
	        		status: false
	        	});
	        }
	    });
    };
}());