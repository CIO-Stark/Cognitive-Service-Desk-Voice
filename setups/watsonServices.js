(function () {
    "use strict";

    var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
    var watsonConversation = require("watson-developer-cloud/conversation/v1");

    var conversation = new watsonConversation({
        "username": JSON.parse(process.env.VCAP)["conversation"][0].credentials.username,
        "password": JSON.parse(process.env.VCAP)["conversation"][0].credentials.password,
        "version": "v1",
        "version_date": "2017-02-03",
        "workspace_id": process.env.workspace_id
    });



    var text_to_speech = new TextToSpeechV1({
        username: (JSON.parse(process.env.VCAP)["text_to_speech"][0].credentials.username),
        password: (JSON.parse(process.env.VCAP)["text_to_speech"][0].credentials.password)
    });


    module.exports.text_to_speech = text_to_speech; 
    module.exports.conversation = conversation;
}());