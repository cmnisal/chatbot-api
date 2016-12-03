module.exports = function ExceptionFac(
    config,
    exception,
    helpersUtil
){
    'use strict';

    var self = this;

    this.helpersUtil = helpersUtil;
    this.config = config;
    this.ExceptionClass = exception.class;
    this.createInstance = function(errorCode, httpStatusCode, formatValuesArray){
        var statusCode;
        if(typeof(httpStatusCode) === 'undefined' || httpStatusCode == null){
            statusCode = 500;
        }

        return new self.ExceptionClass(self.config, errorCode, httpStatusCode, formatValuesArray, self.helpersUtil);
    };
};

module.exports.$inject = [
    'config',
    'exception',
    'helpersUtil'
];