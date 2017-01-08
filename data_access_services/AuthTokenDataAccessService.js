module.exports = function AuthTokenDataAccessService(config,
                                                q,
                                                db,
                                                helpersUtil,
                                                exceptionFac) {
    "use strict";
    var self = this;

    // Bind injected dependencies
    this.config = config;
    this.q = q.module;
    this.db = db.module;
    this.helpersUtil = helpersUtil;
    this.exceptionFac = exceptionFac;
    this.schema = self.db.Schema;

    this.createToken = function (user, token) {
        var insertToken = self.q.nbind(self.Token.insert, self.Token);
        var tokenDoc = {
            username: user.username,
            token: token
        };
        return insertToken(tokenDoc)
            .then(function(success) {
                if(success) {
                    return self.q.when({
                        username: user.username,
                        token: token,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role: user.role
                    });
                } else {
                    return self.q.when(null);
                }
            });

    };

    this.Token = self.db.model('vt_token', new self.schema({
        username: { type: String, required: true, unique: true },
        token: { type: String, required: true, unique: true},
        created_timestamp: { type: Date, required: true, default: Date.now }

    }));

};

module.exports.$inject = [
    'config',
    'q',
    'db',
    'helpersUtil',
    'exceptionFac'
];