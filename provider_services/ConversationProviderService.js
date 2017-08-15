module.exports = function ConversationProviderService(config,
                                                      q,
                                                      hotelDataAccessService,
                                                      helpersUtil,
                                                      exceptionFac) {
    "use strict";
    var self = this;

    // Bind injected dependencies
    this.config = config;
    this.q = q.module;
    this.hotelDataAccessService = hotelDataAccessService;
    this.helpersUtil = helpersUtil;
    this.exceptionFac = exceptionFac;

    this.init = function() {

    };


};

module.exports.$inject = [
    'config',
    'q',
    'hotelDataAccessService',
    'helpersUtil',
    'exceptionFac'
];