var response = function Response(
    body,
    httpStatusCode

){
    'use strict';

    this.httpStatusCode = (httpStatusCode || 200);
    this.body = (body || null);
};

module.exports = response;