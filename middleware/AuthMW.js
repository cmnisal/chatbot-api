module.exports = function AuthMW(config, jsonwebtoken, authTokenDataAccessService, helpersUtil)
{
    "use strict";

    var self = this;
    this.jwt = jsonwebtoken.module;
    this.config = config;
    this.helpersUtil = helpersUtil;
    this.authTokenDataAccessService = authTokenDataAccessService;

    this.middleware = function(req, res, next) {
        req.identity = {
            user: null,
            application: null
        };
        if(req.path !== '/' && req.path !== '/v1/auth/token' && self.config.security.secureEndpoints && req.method !== 'OPTIONS') {
            // check header or url parameters or post parameters for token
            var token = req.headers['x-user-token'] || req.query.userToken || req.body.userToken;

            // decode token
            if (token) {
                // verifies secret and checks exp
                self.jwt.verify(token, self.config.security.authToken.secret, function (err, decoded) {
                    if (err) {
                        req.identity.user = null;
                        next();
                    }
                    else {
                        // if everything is good, save to request for use in other routes
                        req.identity.user = decoded;
                        req.identity.user.identityCreationDateTime = self.helpersUtil.fromIso8601Date(req.identity.user.identityCreationDateTime);
                        req.identity.user.token = token;
                        if (decoded && decoded.userId && token) {

                            self.authTokenDataAccessService.getToken(token)
                                .then(function (token) {
                                    if (!token) {
                                        res.sendStatus(401);
                                    } else {
                                        next();
                                    }
                                });
                        }
                    }
                });
            } else {
                res.sendStatus(401);
            }
        } else {
            next();
        }
    };
};

module.exports.$inject = [
    'config',
    'jsonwebtoken',
    'authTokenDataAccessService',
    'helpersUtil'
];
