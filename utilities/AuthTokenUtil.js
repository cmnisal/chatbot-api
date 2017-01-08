module.exports = function AuthTokenUtil(
    config,
    jsonwebtoken,
    helpersUtil
){
    "use strict";

    var self = this;

    this.config = config;
    this.jsonwebtoken = jsonwebtoken.module;
    this.helpersUtil = helpersUtil;

    this.createToken = function(userId, authProviderId, authProviderUserId, userType, nonce){
        var userIdentity = {
            userId: userId,
            identityCreationDateTime: self.helpersUtil.getCurrentUTCDate(),
            authProviderId: authProviderId,
            authProviderUserId: authProviderUserId,
            userType: userType,
            nonce: nonce
        };

        var token = self.jsonwebtoken.sign(userIdentity, self.config.security.authToken.secret, {
            expiresInMinutes: self.config.security.authToken.expirationMins
        });

        return token;
    };

};

module.exports.$inject = [
    'config',
    'jsonwebtoken',
    'helpersUtil'
];