module.exports = function ApiServer(
    expressApp,
    iocContainer
) {

    'use strict';

    var self = this;

    this.iocContainer = iocContainer;
    this.expressApp = expressApp;
    this.config = iocContainer.get('config');
    this.logger = iocContainer.get('logger');

    self.startApp = function() {

        //BEGIN FILE UPLOAD
        var path = require('path');
        var crypto  = require('crypto');
        //END: FILE UPLOAD


    };
};