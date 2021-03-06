module.exports = function UserDataAccessService(config,
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

    this.getUsers = function () {
        var getUsers = self.q.nbind(self.User.find, self.User);

        return getUsers({})
            .then(function(users) {
               if(users) {
                   return self.q.when(users);
               } else {
                   return self.q.when(null);
               }
            });

    };
    this.findUserByUsernameAndPassword = function(username, password) {
        var getUser = self.q.nbind(self.User.findOne, self.User);

        return getUser({
            username: username,
            password: password
        }).then(function(user) {
            if(user) {
                user = user.toObject();
                delete user.password;
                delete user.status;
                user.id = user._id.toString();
                delete user._id;
                return self.q.when(user);
            } else {
                return self.q.when(null);
            }
        });
    };

    this.User = self.db.model('vt_user', new self.schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        first_name: String,
        last_name: String,
        phone: String,
        status: Boolean,
        role: String

    }));

};

module.exports.$inject = [
    'config',
    'q',
    'db',
    'helpersUtil',
    'exceptionFac'
];