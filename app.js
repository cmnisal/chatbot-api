(function Main(){

  'use strict';

  var ConfigUtilClass = require('./utilities/ConfigUtil');
  var configUtil = new ConfigUtilClass();
  var config = configUtil.getConfig();

  if(config.clusteringEnabled) {
    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {
      console.log('info: Clustering for ' + numCPUs + ' CPU cores...');

      // Fork workers.
      for (var i = 0; i < numCPUs; i++) {
        console.log('info: Spawning worker ' + (i + 1) + '...');
        cluster.fork();
      }

      console.log('info: Clustering intialized with ' + numCPUs + ' worker processes.');

      cluster.on('exit', function (worker, code, signal) {
        console.log('Worker process with process id ' + worker.process.pid + ' terminated.');
      });
    } else {
      initializeWorkerProcess(config);
    }
  }
  else{
    console.log('info: Clustering is disabled.');
    initializeWorkerProcess(config);
  }

})();


function initializeWorkerProcess(config){
  var logger;
  var environmentDescriptor;
  try{
    var winston = require('winston');
    winston.emitErrs = true;

    var winstonTransports = [];
    if(config.loggerAppenders && config.loggerAppenders.length > 0){
      for(var i=0; i < config.loggerAppenders.length; i++){
        var appender = config.loggerAppenders[i];
        winstonTransports.push(new winston.transports[appender.type](appender.options));
      }
    }
    else{
      winstonTransports.push(new winston.transports.Console({
        level: 'silly',
        handleExceptions: true,
        json: false,
        colorize: true
      }));
    }

    logger = new winston.Logger({
      transports: winstonTransports,
      exitOnError: false
    });


    logger.info('Overriding Console.log...');
    process.console = logger;
    console.log = logger.debug;

    logger.info('Logger initialized.');
  }
  catch(e){
    console.log(e);
    throw new Error(e);
  }

  try{
    logger.info('Initializing IoC...');
    var intravenous = require('intravenous');
    var container = intravenous.create();
    container.register('config', config, 'singleton');
    container.register('logger', logger, 'singleton');

    var ConfigIocClass = require('./ConfigIoc');
    var configIoc = new ConfigIocClass();

    logger.info('Registering dependencies...');
    configIoc.compose(container);

    var q = container.get('q').module;

    var express = container.get('express').module;
    var app = express();

    var bodyParser  = container.get('body-parser').module;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({limit:(config.requestLimitKB)+"kb"}));

    var crossOriginMW = container.get('crossOriginMW');
    app.use(crossOriginMW.middleware);

    var configJson = config.apiRoutes;

    var ApiServerClass = require('./ApiServer');
    var apiServer = new ApiServerClass(app, container);
    apiServer.startApp();

    configJson =config.apiRoutes;


    logger.info('Initializing routes...');
    var RouteManagerClass = require('./RouteManager');
    var routeManager = new RouteManagerClass(app, container);

    routeManager.register(configJson);

    //var https = require('https');
    var http = container.get('http').module;


    logger.info('Creating http server...');
    var server  = http.createServer(app);

    var port = process.env.PORT || config.port;
    logger.info('Attempting to listen on port %s', port);

    server.listen(port);

    logger.info('Server is now listening on port %s using configuration setup for %s environment.', port, environmentDescriptor);

  }
  catch(e){
    logger.error('%s: %s [%s]', e.name, e.message, e.stack);
  }
}
