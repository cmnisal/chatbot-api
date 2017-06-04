module.exports = function CrossOriginMW()
{
    "use strict";

    var self = this;

    this.middleware = function(req, res, next) {

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-user-token, X-IBM-Client-Id, X-IBM-Client-Secret');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    };
};

module.exports.$inject = [

];
