module.exports = function ConfigUtil() {

    var self = this;

    self.getConfig = function () {

        var environmentDescriptor;
        var config;
        console.log('info: Initializing configuration...');

        var baseConfig = require('../config/Config');

        console.log('info: Checking environment configuration indicator...');
        var env = process.env.MODJOUL_ENV;
        if (typeof(env) !== 'undefined' && env != null) {
            environmentDescriptor = env;
            console.log('info: Loading configuration override for ' + env + ' environment.');
            var envConfigOverride = require('../config/Config_' + env);
            if (!(envConfigOverride)) {
                throw new Error('The ' + env + ' environment configuration override is missing. Exiting...');
            }

            console.log('info: Merging configuration override for ' + env + ' environment...');
            var merge = require('merge');
            config = merge.recursive(true, baseConfig, envConfigOverride);
        }
        else {
            console.log('info: No environment indicator found. Continuing with the base configuration...');
            environmentDescriptor = 'base';
            config = baseConfig;
        }


        config.app = "api";
        console.log('info: Configuration initialized.');
        return config;
    };
};