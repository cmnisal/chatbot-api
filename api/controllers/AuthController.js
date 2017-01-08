module.exports = function AuthController(config,
                                          q,
                                          authTokenDataAccessService,
                                          helpersUtil,
                                          exceptionFac) {
    "use strict";
    var self = this;

    // Bind injected dependencies
    this.config = config;
    this.q = q.module;
    this.authTokenDataAccessService = authTokenDataAccessService;
    this.helpersUtil = helpersUtil;
    this.exceptionFac = exceptionFac;

    this.post = function (req) {
        return self.userDataAccessService.getUsers()
            .then(function(users) {
                return self.q.when(users);
            });
    };


};

module.exports.$inject = [
    'config',
    'q',
    'authTokenDataAccessService',
    'helpersUtil',
    'exceptionFac'
];