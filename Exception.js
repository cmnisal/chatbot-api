var exception = function Exception(
    config,
    errorCode,
    httpStatusCode,
    formatValuesArray,
    helpersUtil
){
    'use strict';

    this.httpStatusCode = (httpStatusCode || 500);
    this.name = (errorCode || 'E0000');    
    this.message = helpersUtil.stringFormat(config.errors[this.name], formatValuesArray);
    this.stack = (new Error()).stack;
};

exception.prototype.toString = function() {
    var str = this.name + ': ' + this.message;

    if (this.stack !== undefined) {
        str += '\n' + this.stack.toString();
    }

    return str;
};

module.exports = exception;