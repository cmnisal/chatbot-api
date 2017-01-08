module.exports = function ConfigIoc(){
    'use strict';

    this.compose = function(container) {

        var config = container.get('config');
        //BEGIN: NPM modules
        container.register('express', { module: require('express') }, 'singleton');
        container.register('body-parser', { module: require('body-parser') }, 'singleton');
		container.register('http', { module: require('http') }, 'singleton');
        container.register('q', { module: require('q') }, 'singleton');
        container.register('body-parser', { module: require('body-parser') }, 'singleton');
        container.register('jsonwebtoken', { module: require('jsonwebtoken') }, 'singleton');
        container.register('hashmap', { module: require('hashmap') }, 'singleton');
        container.register('compression', { module: require('compression') }, 'singleton');
        container.register('moment', { module: require('moment') }, 'singleton');
        container.register('url',{ module: require('url') }, 'singleton' );
        container.register('uuid',{ module: require('node-uuid') }, 'singleton' );
        container.register('lazyjs', { module: require('lazy.js') }, 'singleton');
        container.register('async', { module: require('async-q') }, 'singleton');
        container.register('crypto', { module: require('crypto') }, 'singleton');
        container.register('utf8',{ module: require('utf8') }, 'singleton' );
        container.register('base64',{ module: require('base-64') }, 'singleton' );
        container.register('db', { module : require('mongoose') }, 'singleton');
        //END: NPM modules

        //BEGIN: Clients
        container.register('restclient',{ module: require('restling') }, 'singleton' );
        //END: NPM modules

        //BEGIN: Data Connections
        container.get('db').module.connect(config.data.mainDataConnectionPool.mongoConnectionUrl);
        //END: Data Connections

        //BEGIN: Miscellaneous
        container.register('response', { class: require('./Response') }, 'singleton');
        container.register('exception', { class: require('./Exception') }, 'singleton');
        //END: Miscellaneous

        //BEGIN: Middleware
        container.register('crossOriginMW', require('./middleware/CrossOriginMW'), 'singleton');
        //END: Middleware

        //BEGIN: Factories
        container.register('yaml', require('yamljs'), 'singleton');
        container.register('responseFac', require('./ResponseFac'), 'singleton');
        container.register('exceptionFac', require('./ExceptionFac'), 'singleton');
        //END: Factories

        //BEGIN: Utilities
        container.register('helpersUtil', require('./utilities/HelpersUtil'), 'singleton');
        //END: Utilities

        //BEGIN: Data Access
        container.register('userDataAccessService', require('./data_access_services/UserDataAccessService'), 'singleton');
        container.register('authTokenDataAccessService', require('./data_access_services/AuthTokenDataAccessService'), 'singleton');
        //END: Data

        //BEGIN: Provider

        //END: Provider
    };
};