module.exports = function ChatController(config,
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
        var hotelId = self.helpersUtil.fromModelVal(req.params.hotelId);

        if(!hotelId) {
            throw self.exceptionFac.createInstance('E0021', 400);
        }

        return self.hotelDataAccessService.getHotelById(hotelId)
            .then(function(hotel) {
                return self.q.when(hotel);
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