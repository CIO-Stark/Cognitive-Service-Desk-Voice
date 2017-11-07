(function () {
    "use strict";

    module.exports = function () {
        var request = modules.request;

        var conversationContext = {};
        /**
         * urls are set on main.script
         */
        var urls = {
            "feedback": "",
            "conversation": "",
            "extraOptions": ""
        };
        
        return {
            "setUrl": function (url, type) {
                urls[type] = url;
            },
            "getUrl": function (type) {
                return urls[type];
            },
            /**
             * Factory responsible for sending messages to conversation-provider which
             * acts as a layer between widget and Conversation API
             */
            "makeQuestion": function (question) {
                return new Promise(function (resolve, reject) {
                    var options = {
                        uri: "https://speechweb.cpqd.com.br/asr/api/beta1/recognize/8k",
                        headers: {
                                "Content-Type": "audio/wav",
                                "Accept": "application/json",
                                "Authorization": "Basic aWJtOnkzNHA5MQ=="
                },
                body: audioData
            };
                    
                    if (window.XMLHttpRequest) {
                        var xhttp = new window.XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState === 4) {
                                if (xhttp.status === 200) {
                                    var response;
                                    try {
                                        response = JSON.parse(xhttp.responseText);
                                    } catch (e) {
                                        response = xhttp.responseText;
                                    }
                                    if (response.context) {
                                        conversationContext = response.context;
                                    }
                                    console.log(conversationContext);
                                    resolve(response);
                                } else {
                                    reject(xhttp.responseText);
                                }
                            }
                        };

                        xhttp.open("POST", urls.conversation, true);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                        xhttp.send(["question=", question, "&context=", JSON.stringify(conversationContext)].join(""));
                    } else {
                        reject("AJAX Calls not supported on this browser");
                    }
                });
            },
            // feedbackStatus: positive / negative
            // feedbackObj: the whole conversation, intentions, etc
            "sendFeedback": function (feedbackStatus, feedbackObj) {
            	var self = this;
                return new Promise(function (resolve, reject) {
                    if (window.XMLHttpRequest) {
                        var xhttp = new window.XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState === 4) {
                                if (xhttp.status === 200) {
                                    resolve(JSON.parse(xhttp.responseText));
                                } else {
                                    reject(xhttp.responseText);
                                }
                            }
                        };
                        
                        if(feedbackObj){
                        	feedbackObj.browser = self.getBrowserName();
                        	feedbackObj.feedbackDate = new Date();
                        	feedbackObj.isMobile = isMobile.any() ? "mobile" : "desktop";
                        	if(feedbackStatus)
                        		feedbackObj.feedbackStatus = feedbackStatus; // feedback comes from frontEnd
                        	else feedbackObj.feedbackStatus = '-';
                        }
                        

                        xhttp.open("POST", urls.feedback, true);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                        console.log(["feedback=", JSON.stringify(feedbackObj), "&context=", conversationContext].join(""));
                        xhttp.send(["feedback=", JSON.stringify(feedbackObj), "&context=", JSON.stringify(conversationContext)].join(""));
                        

                    } else {
                        reject("AJAX Calls not supported on this browser");
                    }
                });
            },
            // increment widget use
            "sendUseIncrement": function () {
            	var self = this;
                return new Promise(function (resolve, reject) {
                    if (window.XMLHttpRequest) {
                        var xhttp = new window.XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState === 4) {
                                if (xhttp.status === 200) {
                                    resolve(JSON.parse(xhttp.responseText));
                                } else {
                                    reject(xhttp.responseText);
                                }
                            }
                        };
                        
                        var path = urls.conversation.split( '/' );
                        path = path[0] + '//' + path[2] + '/incrementUsers?module=hr_module';
                        
                        xhttp.open("POST", path, true);
                        //console.log(path);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                        xhttp.send();
                        

                    } else {
                        reject("AJAX Calls not supported on this browser");
                    }
                });
            },
            "saveLogin": function (info) {
                window.sessionStorage.setItem("info", JSON.stringify(info));
            },
            "getLogin": function () {
                try {
                    return JSON.parse(window.sessionStorage.getItem("info"));
                } catch(e) {
                    return null;
                }

            }
        };
    };


}());
