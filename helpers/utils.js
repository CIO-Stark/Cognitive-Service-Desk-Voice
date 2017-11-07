(function () {
    "use strict";

    var fs = require("fs");
    var https = require("https");
    var http = require("http");
    var request = require("request-promise");
    

    /**
     * download from url audio 
     * In this case, twilio api records Audio in an specific url
     * @param {*} url 
     * @param {*} id 
     * @param {*} success 
     * @param {*} error 
     */
    var downloadAudio = function(url, id) {
        var path = "./calls/"+ id +".wav";
        var file = fs.createWriteStream(path);
        return new Promise(function(resolve, reject){
            
            if(url.indexOf('https') != -1)
                var request = https.get(url, function(response) {
                    response.pipe(file);
                    file.on('finish', function() {
                        file.close();
                        resolve(path);
                    });
                    }).on('error', function(err) { // Handle errors
                        fs.unlink(path);
                        reject(err);
                    });
            else
                var request = http.get(url, function(response) {
                    response.pipe(file);
                    file.on('finish', function() {
                        file.close();
                        resolve(path);
                    });
                    }).on('error', function(err) { // Handle errors
                        fs.unlink(path);
                        reject(err);
                    });
        });
    };

    //get local audio data
    var getAudioData = function(path){
        return new Promise(function(resolve, reject){
            fs.readFile(path, function(err, data){
                if(err)
                    reject(err);
                else
                    resolve(data);
                
            });
        });
        
    };



    /**
     * send audio to CPqD API and receive back the transcription
     */
    var cpqdPost = function(audioData){
        var options = {
            uri: "https://speechweb.cpqd.com.br/asr/api/beta1/recognize/8k",
            headers: {
                "Content-Type": "audio/wav",
                "Accept": "application/json",
                "Authorization": "Basic aWJtOnkzNHA5MQ=="
            },
            body: audioData
        };
        return new Promise(function(resolve, reject){
            request.post(options).then(function(text){
                //console.log("cpqdTranscription options: ", getBestTranscriptionAlternative(text));
                resolve(text);
            }).catch(function(err){
                reject(err);
            });
        });
    };



    module.exports = {
        downloadAudio: downloadAudio,
        getAudioData: getAudioData,
        cpqdPost: cpqdPost
    };
}());