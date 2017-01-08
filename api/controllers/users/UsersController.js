module.exports = function UsersController(config,
                                          q,
                                          userDataAccessService,
                                          helpersUtil,
                                          exceptionFac) {
    "use strict";
    var self = this;

    // Bind injected dependencies
    this.config = config;
    this.q = q.module;
    this.userDataAccessService = userDataAccessService;
    this.helpersUtil = helpersUtil;
    this.exceptionFac = exceptionFac;

    this.get = function (req) {
        return self.userDataAccessService.getUsers()
            .then(function(users) {
                return self.q.when(users);
            });
    };


};

module.exports.$inject = [
    'config',
    'q',
    'userDataAccessService',
    'helpersUtil',
    'exceptionFac'
];