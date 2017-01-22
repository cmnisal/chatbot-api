module.exports = function AuthController(config,
                                          q,
                                          userDataAccessService,
                                          authTokenDataAccessService,
                                          helpersUtil,
                                          authTokenUtil,
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
    this.authTokenUtil = authTokenUtil;
    this.encryptionUtil = encryptionUtil;
    this.exceptionFac = exceptionFac;

    this.post = function (req) {
        var username = self.helpersUtil.fromModelVal(req.body.username);
        var password = self.encryptionUtil.encryptSha256(req.body.password);
        return self.userDataAccessService.findUserByUsernameAndPassword(username, password)
            .then(function(user) {
                if(user) {
                    return self.authTokenUtil.createToken(user.id,
                        self.config.security.apiCredentials.vtourweb.password,
                        self.config.security.apiCredentials.vtourweb.username,
                        user.role)
                        .then(function(token) {
                            return self.authTokenDataAccessService.saveToken(user, token)
                                .then(function(tokenDoc) {
                                    if(tokenDoc) {
                                        user.token = token;
                                        return self.q.when(user);
                                    } else {
                                        throw self.exceptionFac.createInstance('E0002', 500);
                                    }
                                })
                                .catch(function(err) {
                                    console.log(err);
                                    throw self.exceptionFac.createInstance('E0002', 500);
                                })
                        });
                }
                 else {
                    throw self.exceptionFac.createInstance('E0001', 400);
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
    'authTokenUtil',
    'encryptionUtil',
    'exceptionFac'
];