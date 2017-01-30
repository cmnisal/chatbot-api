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

    this.saveToken = function (user, token) {
        var newTokenDoc = {
            userId : user.id,
            username: user.username,
            authToken: token,
            created_timestamp: Date.now()
        };
        var storedToken = new self.Token(newTokenDoc);
        var insertToken = self.q.nbind(storedToken.save, storedToken);
        return insertToken()
            .then(function(success) {
                if(success) {
                    return self.q.when({
                        userId: user.id,
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
    this.deleteTokenForUser = function(userId) {
      var deleteTokenForUser = self.q.nbind(self.Token.findOneAndRemove, self.Token);
      return deleteTokenForUser({
          userId: userId
      })
          .then(function(success) {
              if(success) {
                  return self.q.when(null);
              } else {
                  return self.q.when(null);
              }
          })
    };
    this.getToken = function(token) {
       var getTokenDoc = self.q.nbind(self.Token.findOne, self.Token);
        return getTokenDoc({
            authToken : token
        })
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
        authToken: { type: String, required: true, unique: true},
        created_timestamp: { type: Date, default: Date.now() }

    }));

};

module.exports.$inject = [
    'config',
    'q',
    'db',
    'helpersUtil',
    'exceptionFac'
];