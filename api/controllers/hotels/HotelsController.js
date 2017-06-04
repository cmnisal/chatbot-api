module.exports = function HotelsController(config,
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

    this.get = function (req) {
        return self.hotelDataAccessService.getHotels()
            .then(function(hotels) {
                return self.q.when(hotels);
            });
    };


};

module.exports.$inject = [
    'config',
    'q',
    'hotelDataAccessService',
    'helpersUtil',
    'exceptionFac'
];