(function () {
    "use strict";

    module.exports = function (app, modules) {
        var twilio = require("twilio");
        var host = "https://portfolio-cognitive-service-desk-voice.mybluemix.net";
        
        
        var request = modules.request;
        var watsonServices = modules.watsonServices;
        //var sleep = require('sleep');
        var sleep = require('system-sleep');
        var utils = require('../helpers/utils');



        /**
         * returns best recognized transcription by the API docs
         * @param {*} text 
         */
        function getBestTranscriptionAlternative(text){
            if(text.hasOwnProperty("result-status") && text.result-status == 'RECOGNIZED')
                if(text.hasOwnProperty("alternatives") && text.alternatives.length)
                    return text.alternatives[0].text;
        }



        /**
         * By the Twilio API, anytime a call have its status changed, this method will be invoked
         */
        app.post("/conversationFlow/status", function (req, res) {
            // twilio attribute that indicates call completed (or other status)
            if(req.body.CallStatus && req.body.CallStatus == 'completed')
                console.log('Call finalizada'); // TODO

            console.log("Status Body", req.body);
            res.send({status: true});
        });



    /**
     * Initial API called by the Twilio phone service. This flow is called each time someone calls to the Twilio number
     * It is responsible for providing the right TwiML so Twilio can continue its conversation/flow/phone
     */
    app.post("/conversationFlow/welcome", function (req, res) {
        res.writeHead(200, {
            'Content-Type':'text/xml'
        });
        
        watsonServices.sendQuestion(req.body.question || 'hello', {}).then(
            function(watsonResponse){
                console.log("watsonResponse", watsonResponse);
                var resp = new twilio.TwimlResponse();
                
                if(watsonResponse.hasOwnProperty("output") && watsonResponse.output.text.length){
                    // converts watson response to audio file
                    watsonServices.watsonTTS(watsonResponse.output.text[0], watsonResponse.context.conversation_id)
                        .then(function(audioFile){
                            //resp.say({voice:'woman'}, watsonResponse.output.text[0]);
                            resp.play(req.protocol + '://' + req.get('host') + '/ttsAudios/' + audioFile);
                            //resp.say({voice:'woman'}, 'testing vivo application');

                            //persists the watson Conversation Context
                            session[watsonResponse.context.conversation_id] = watsonResponse.context;

                            resp.record({
                                action: host + "/conversationFlow/continue?action=action&conversationID=" + watsonResponse.context.conversation_id,
                                timeout: 30,
                                recordingStatusCallback: host + "/conversationFlow/callback?conversationID=" + watsonResponse.context.conversation_id,
                                recordingStatusCallbackMethod: "POST"                                       
                            });
                            
                            res.end(resp.toString());

                    }).catch(function(error){
                            resp.say({voice:'woman'}, 'Issues...');
                            res.end(resp.toString());
                    });
                
                }else{
                    resp.say({voice:'woman'}, 'Desculpe, nossos atendentes estão indisponíveis no momento.');
                    res.end(resp.toString());
                }
    
        
            }).catch(function(error){
                console.error("Error on watson conversation response", error.message);
                resp.say({voice:'woman'}, 'Issues...');
                res.end(resp.toString());
        });
    });


        /**
         * continue flow
         */
        var session = [];
        var calls = [];
        var stt = [];
        var audioStatus = {};
        var finalizingCall = {};
        app.post("/conversationFlow/continue", function (req, res) {
            console.log("Continue Body", req.body);
            res.writeHead(200, {
                'Content-Type':'text/xml'
            });

            // it was identified in the last flow that the call should be finalized
            if(req.query.conversationID && finalizingCall[req.query.conversationID]){
                console.log('Finalizing call for ', req.query.conversationID);
                delete finalizingCall[req.query.conversationID];
                var resp = new twilio.TwimlResponse();
                resp.hangup();
                res.end(resp.toString());
            }

            /**
             * if it contains a conversationID, means it is in an already started conversation
             * it (context, dialog level,etc ) must be sent back to watson in a existing conversation
             */
            var watsonContext = {};
            if(req.query.conversationID){
                watsonContext = session[req.query.conversationID];
            } 

            // hold call and its status for debug
            var call = {
                id: req.body.CallSid || req.body.id,
                url: req.body.RecordingUrl || req.body.url,
                duration: req.body.RecordingDuration || -1
            };
            calls.push(call);
            // if audio url is received for first time. But it is not ready until callBack url is sent
            // starting it with 0 and when the callback get called, it will add the right value
            if(!audioStatus[call.url])
                audioStatus[call.url] = 'waitingCallback';

            var i = 0;
            while(audioStatus[call.url] == 'waitingCallback'){
                console.log('waiting for audio:' + call.url + ':' + audioStatus[call.url]);
                sleep(200);
                if(i++ == 20){
                    genericError('TTS', '', req, res);; //TODO!
                    break;
                }
                //require('child_process').execSync("usleep 150");
            }
            console.log('Got callback', call.url);
            //remove the url from json array
            delete audioStatus[call.url];

                
            if(call.id && call.url){
                // download user speech
                utils.downloadAudio(call.url, call.id)
                    .then(utils.getAudioData) // get the saved speech
                    .then(utils.cpqdPost).then(
                            function(text){
                                text = JSON.parse(text);
                                var transcription = text;
                                stt.push({
                                    id: call.id,
                                    text: text
                                });
                                console.log("cpqd:", text);
                                if(transcription.hasOwnProperty("result-status") && transcription["result-status"] == 'RECOGNIZED'){
                                    if(transcription.hasOwnProperty("alternatives") && transcription.alternatives.length)
                                        transcription = transcription.alternatives[0].text;
                                } else if(transcription.hasOwnProperty("result-status") && transcription["result-status"] == 'NO_SPEECH'){
                                    transcription = 'xxxxx'; //this is a anythingElse node in Conversation API
                                }
                                console.log("transcription:", transcription);
                                /**
                                 * 
                                 */
                                // send transcription to watson Conversation
                                watsonServices.sendQuestion(transcription, watsonContext).then(
                                    function(watsonResponse){
                                        console.log("watsonResponse", watsonResponse);
                                        var resp = new twilio.TwimlResponse();
                                        
                                        if(watsonResponse.hasOwnProperty("output") && watsonResponse.output.text.length){
                                            // converts watson response text to audio file so it can be played to the phone
                                            watsonServices.watsonTTS(watsonResponse.output.text[0], watsonResponse.context.conversation_id)
                                                .then( 
                                                    function(audioFile){

                                                        // finalizing the call using the example of an intents == thanks
                                                        if(watsonResponse.hasOwnProperty("intents")){
                                                            for(var j in watsonResponse.intents)
                                                                if(watsonResponse.intents[j].intent == 'thanks'){
                                                                    finalizingCall[watsonResponse.context.conversation_id] = true;
                                                                }
                                                        }
                                                    

                                                        resp.play(req.protocol + '://' + req.get('host') + '/ttsAudios/' + audioFile);
                                                    
                                                        //persists the watson Conversation Context
                                                        session[watsonResponse.context.conversation_id] = watsonResponse.context;

                                                        resp.record({
                                                            action: host + "/conversationFlow/continue?action=action&conversationID=" + watsonResponse.context.conversation_id,
                                                            timeout: 30,
                                                            recordingStatusCallback: host + "/conversationFlow/callback?conversationID=" + watsonResponse.context.conversation_id,
                                                            recordingStatusCallbackMethod: "POST"
                                                        });
                                                        
                                                        console.log("Send on continue", resp.toString());
                                                        
                                                        res.end(resp.toString());

                                            }).catch(function(error){
                                                genericError('TTS', error, req, res);
                                                    
                                            });
                                        
                                        }else{
                                            genericError('no response from watson', '', req, res);
                                            
                                        }
                                
                                    }).catch(function(error){
                                        genericError('catch', error, req, res);
                                        
                                });


                            }).catch(function(error){ // cpqdPost
                                genericError('cpqdPost', error, req, res);
                                    
                            });
                    
            } else{
                genericError('else', '', req, res);
                
            }
        });


        /**
         * Called when Twilio calls the callback action
         */
        app.post("/conversationFlow/callback", function (req, res) {
            /**
             * if its a callback message, indicates the url is ready so default action will continue from there
             */            
            if(req.body.RecordingStatus && req.body.RecordingStatus == 'completed'){
                console.log('Im in callback url...', audioStatus[req.body.RecordingUrl]);
                console.log("1 : ", audioStatus);
                if(audioStatus[req.body.RecordingUrl])
                    audioStatus[req.body.RecordingUrl] = 1;
                
                console.log("2 : ", audioStatus);
                // callback waits for an empty response
                var resp = new twilio.TwimlResponse();
                res.end(resp.toString());
                //res.status(200).send('<Response/>');
            }
        });


        /**
         * Generic error msg for the different callbacks
         * @param {*} source 
         * @param {*} error 
         * @param {*} res 
         */
        function genericError(source, error, req, res){
            console.error(source, error.message ? error.message : error);
            var resp = new twilio.TwimlResponse();
            resp.play(req.protocol + '://' + req.get('host') + '/ttsAudios/' + 'tivemosUmProblema.wav');
            resp.record({
                action: host + "/conversationFlow/welcome",
                timeout: 30                                                        
            });
            res.end(resp.toString());
        }






        //get completed transcriptions
        app.get("/helpers/currentCalls", function(req, res){
           res.send({
                calls: calls,
                stt: stt
            });
        });


    };
}());