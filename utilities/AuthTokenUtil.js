module.exports = function AuthTokenUtil(
    config,
    q,
    nonce,
    jsonwebtoken,
    helpersUtil
){
    "use strict";

    var self = this;

    this.config = config;
    self.q = q.module;
    this.nonce = nonce.module;
    this.jsonwebtoken = jsonwebtoken.module;
    this.helpersUtil = helpersUtil;

    this.createToken = function(userId, authProviderId, authProviderUserId, userType){
        var createToken = self.q.nbind(self.jsonwebtoken.sign, self.jsonwebtoken);
        var userIdentity = {
            userId: userId,
            identityCreationDateTime: self.helpersUtil.getCurrentUTCDate(),
            authProviderId: authProviderId,
            authProviderUserId: authProviderUserId,
            userType: userType,
            nonce: self.nonce()
        };
        return createToken(userIdentity, self.config.security.authToken.secret, {
            expiresIn: self.config.security.authToken.expirationMins
        })
            .then(function(token) {
                return self.q.when(token);
            })
            .catch(function(err) {
                console.log(err);
            });

    };

};

module.exports.$inject = [
    'config',
    'q',
    'nonce',
    'jsonwebtoken',
    'helpersUtil'
];