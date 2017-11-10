/**
 * Testes para API de respostas
 * mocha --debug-brk
 * attach
 */

require('dotenv').config()
var assert = require('assert');
var should = require('should');

var watsonServices = require('../helpers/watsonServices');

describe('Conversation - Basic', function () {
        this.timeout(15000);

        it('it should send and receive basic response from conversation', (done) => {

                watsonServices.sendQuestion("olá", {})
                        .then(function (dataResp) {
                                console.log(dataResp);
                                assert.equal(dataResp.output.text.length, true);

                                done();

                        }).catch(function (error) {
                                console.log("promisse error", error);
                                assert.equal(error, null);
                                done();

                        });

        });



});

