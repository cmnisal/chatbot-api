/**
 * The is the factory to generate response with custom http status code.
 *
 * @param config
 * @param response
 * @param helpersUtil
 * @constructor
 */
module.exports = function ResponseFac(
    config,
    response,
    helpersUtil
){
    'use strict';

    var self = this;

    this.helpersUtil = helpersUtil;
    this.config = config;
    this.ResponseClass = response.class;
    /**
     * Creates the response object.
     *
     * @param result
     * @param httpStatusCode
     * @returns {*|string}
     */
    this.createResponse = function(result, httpStatusCode){
        var statusCode;

        if(typeof(httpStatusCode) === 'undefined' || httpStatusCode == null){
            statusCode = 200;
        }

        return new self.ResponseClass(result, httpStatusCode);
    };
};

module.exports.$inject = [
    'config',
    'response',
    'helpersUtil'
];