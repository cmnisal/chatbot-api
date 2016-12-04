module.exports = function RouteManager(expressApp,
                                       iocContainer) {
    'use strict';

    var self = this;

    this.iocContainer = iocContainer;
    this.expressApp = expressApp;
    this.config = iocContainer.get('config');
    this.logger = iocContainer.get('logger');
    this.q = iocContainer.get('q').module;
    this.serviceRoleMap = {};

    self.isSecurityOn = false;

    this.register = function (routeJson) {

        var basePath = routeJson['basePath'];
        for (var key in routeJson['paths']) {
            var controller = key;

            var routes = routeJson['paths'][key];
            for (var serviceName in routes) {
                if (self.config.httpMethods.indexOf(serviceName) > -1) {
                    var method = {};
                    method.route = basePath.concat(key).replace(/{/g, ':').replace(/}/g, '').split("?")[0];
                    method.name = serviceName;
                    method.requiresLogin = isContains('secured', routes[serviceName]['tags']);
                    method.exempt = isContains('exempt', routes[serviceName]['tags']);
                    if (routes[serviceName]['badge'] && Array.isArray(routes[serviceName]['badge'])
                        && routes[serviceName]['badge'].length == 1) {
                        method.badge = routes[serviceName]['badge'][0];
                    }

                    self.serviceRoleMap[method.name.toUpperCase().concat("|").concat(method.route.split("?")[0])] = routes[serviceName]['roles'] || null;


                    var controller = routes['x-swagger-router-controller'];
                    if (controller !== 'undefined' && controller != null && controller !== '') {
                        registerMethod(method, controller);
                    }
                }
            }


        }

    };

    function isContains(value, array) {
        for (var key in array) {
            if (array[key] === value) {
                return true;
            }
        }
        return false;
    }

    function registerRoute(route) {
        for (var i = 0; i < route.methods.length; i++) {
            var method = route.methods[i];
            registerMethod(method, route.controller);
        }
    }

    function registerMethod(method, controllerName) {
        self.logger.info('Registering %sController.%s with route %s: %s...', controllerName, method.name, method.name.toUpperCase(), method.route);
        var controllerClassName = controllerName + 'Controller';
        self.iocContainer.register(controllerClassName, require('./api/controllers/' + controllerClassName), 'unique');
        var controller = self.iocContainer.get(controllerClassName);
        var controllerMethod = controller[method.name];

        var authTokenValidatorFn = function (req, res, next) {
            if ((!(req.identity) || req.identity == null || !(req.identity.user) || req.identity.user == null) && req.path !== "/api/help") {
                res.sendStatus(401);
                res.end();
            }
            else {
                next();
            }
        };

        var commonResponseHeaderSetterFn = function (req, res, next) {
            if (self.config.keepAliveTimeoutSeconds <= 0) {
                res.set('Connection', 'close');
            }
            else {
                res.set('Keep-Alive', 'timeout=' + self.config.keepAliveTimeoutSeconds);
            }

            next();
        };

        var roleBasedAuthorizationFn = function(req, res, next) {
            var key = req.method.concat("|").concat(req.route.path);
            var supportedRoles = self.serviceRoleMap[key];

            if(!supportedRoles || supportedRoles.length==0 || isContains(req.user.role, supportedRoles)){
                next();
            } else{
                res.sendStatus(403);
                res.end();
            }
        };

        var controllerMethodParams;
        if (Array.isArray(controllerMethod)) {
            controllerMethodParams = controllerMethod;
            if (self.isSecurityOn) {
                if (method.requiresLogin === false && method.exempt == true) {
                    controllerMethodParams.splice(0, 0, method.route, commonResponseHeaderSetterFn);
                } else if (method.requiresLogin === false) {
                    controllerMethodParams.splice(0, 0, method.route, commonResponseHeaderSetterFn, self.passport.authenticate(['clientBasic', 'clientPassword'], {session: false}));
                } else {
                    controllerMethodParams.splice(0, 0, method.route, commonResponseHeaderSetterFn, self.passport.authenticate(['clientBasic', 'clientPassword'], {session: false}), authTokenValidatorFn);
                }
            }
            else {
                controllerMethodParams.splice(0, 0, method.route, commonResponseHeaderSetterFn);
            }
        }
        else {
            var controllerMethodWrapper = function (req, res) {
                try {
                    var responsePromise;
                    if (controllerMethod.length === 1) {
                        //Controller method returns a promise;
                        responsePromise = controllerMethod(req);
                    }
                    else {
                        //Controller method is a node syle function with a callback as the last parameter.
                        var controllerFn = self.q.nbind(controllerMethod, controller);
                        responsePromise = controllerFn(req, res);
                    }
                    responsePromise.then(function (result) {
                        var ResponseModelClass = require('./ResponseModel');
                        var ResponseClass = require('./Response');
                        if (result instanceof ResponseModelClass) {
                            res.status(result.status);
                            if (result.body == null) {
                                res.end();
                            } else {
                                res.json(result.body);
                            }
                        }
                        else if (result instanceof ResponseClass) {
                            res.status(result.httpStatusCode);
                            if (result.body == null) {
                                res.end();
                            } else {
                                res.json(result.body);
                            }
                        }
                        else {
                            res.status(200);
                            if (result == null) {
                                res.end();
                            } else {
                                res.json(result);
                            }
                        }
                    }).catch(function (err) {
                        handleError(err, res, controllerName, method.name);
                    }).done();
                }
                catch (e) {
                    handleError(e, res, controllerName, method.name);
                }
            };

            if (self.isSecurityOn) {
                if (method.requiresLogin === false) {
                    controllerMethodParams = [method.route, commonResponseHeaderSetterFn, controllerMethodWrapper];
                    controllerMethodParams = handleBadge(method.badge, controllerMethodParams);

                } else {
                    controllerMethodParams = [method.route, commonResponseHeaderSetterFn, self.passport.authenticate('accessToken', {session: false}),roleBasedAuthorizationFn, controllerMethodWrapper];
                }
            }
            else {
                controllerMethodParams = [method.route, commonResponseHeaderSetterFn, controllerMethodWrapper];
                controllerMethodParams = handleBadge(method.badge, controllerMethodParams);
            }
        }
        self.expressApp[method.name].apply(self.expressApp, controllerMethodParams);
    }

    function handleBadge(badge, controllerMethodParams) {
        if (badge == 'token') {
            controllerMethodParams.splice(2, 0, self.serverAuth.token(), self.serverAuth.errorHandler());
        }
        return controllerMethodParams;

    }

    function handleError(e, res, controllerName, methodName) {
        var error;
        var statusCode;
        if (typeof(e.httpStatusCode) !== 'undefined') {
            statusCode = e.httpStatusCode;
            error = {
                code: e.name,
                name: e.name,
                message: e.message,
                stack: e.stack
            };
        }
        else {
            statusCode = 500;
            error = {
                code: 'E0000',
                name: e.name,
                message: e.message,
                stack: e.stack
            };
        }

        if (statusCode === 500) {
            var errorCode = (error.code == null ? '' : '[' + error.code + ']');
            var errorName = (error.name == null ? '' : '[' + error.name + ']');
            var errorNameAndCode;
            if (errorCode === errorName) {
                errorNameAndCode = errorCode;
            }
            else {
                errorNameAndCode = errorCode + errorName;
            }

            self.logger.error('[%sController.%s]%s: %s [%s]', controllerName, methodName, errorNameAndCode, e.message, e.stack);
        }

        res.status(statusCode);
        res.json(error);
    }
};