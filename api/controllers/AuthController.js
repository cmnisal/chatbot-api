module.exports = function AuthController(config,
                                          q,
                                          userDataAccessService,
                                          authTokenDataAccessService,
                                          helpersUtil,
                                          encryptionUtil,
                                          exceptionFac) {
    "use strict";
    var self = this;

    // Bind injected dependencies
    this.config = config;
    this.q = q.module;
    this.userDataAccessService = userDataAccessService;
    this.authTokenDataAccessService = authTokenDataAccessService;
    this.helpersUtil = helpersUtil;
    self.encryptionUtil = encryptionUtil;
    this.exceptionFac = exceptionFac;

    this.post = function (req) {
        var username = self.helpersUtil.fromModelVal(req.body.username);
        var password = self.encryptionUtil.encryptSha256(req.body.password);
        return self.userDataAccessService.findUserByUsernameAndPassword(username, password)
            .then(function(user) {
                if(user) {
                    
                } else {
                    self.exceptionFac.createInstance('E0001', 400);
                }
            });
    };


};

module.exports.$inject = [
    'config',
    'q',
    'userDataAccessService',
    'authTokenDataAccessService',
    'helpersUtil',
    'encryptionUtil',
    'exceptionFac'
];