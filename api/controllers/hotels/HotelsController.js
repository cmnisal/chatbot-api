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

    this.post = function(req) {
        var name = self.helpersUtil.fromModelVal(req.body.name);
        var address = self.helpersUtil.fromModelVal(req.body.address);
        var phone = self.helpersUtil.fromModelVal(req.body.phone);
        var intro = self.helpersUtil.fromModelVal(req.body.intro);
        var url = self.helpersUtil.fromModelVal(req.body.url);

        if(!name || !address) {
            throw self.exceptionFac.createInstance('E0021', 400);
        }

        return self.hotelDataAccessService.addHotel({
            name: name,
            address: address,
            phone: phone,
            intro: intro,
            url: url
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