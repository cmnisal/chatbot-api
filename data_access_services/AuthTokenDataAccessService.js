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

        var storedToken = new self.Token({
            userId : user._id,
            username: user.username,
            token: token
        });
        var insertToken = self.q.nbind(storedToken.save, storedToken);
        console.log("inserting token");
        return insertToken()
            .then(function(success) {
                if(success) {
                    console.log("inserted token");
                    return self.q.when({
                        userId: user._id,
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

    this.getToken = function(token) {
       var getTokenDoc = self.q.nbind(self.Token.findOne, self.Token);
        return getTokenDoc(ObjectId.fromString(token))
            .then(function(tokenDoc) {
                if(tokenDoc) {
                    return self.q.when(tokenDoc);
                } else {
                    return self.q.when(null);
                }

            })
    };

    this.Token = self.db.model('vt_token', new self.schema({
        userId: {type: String, required:true},
        username: { type: String, required: true },
        token: { type: String, required: true, unique: true},
        created_timestamp: { type: Date, default: Date.now }

    }));

};

module.exports.$inject = [
    'config',
    'q',
    'db',
    'helpersUtil',
    'exceptionFac'
];