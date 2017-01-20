module.exports = function EncryptionUtil(){
    "use strict";

    this.encryptSha256 = function(value){
        var crypto = require('crypto');
        return crypto.createHash('sha256').update(value).digest("hex");
    };
};