module.exports = {
    port: 3000,
    clusteringEnabled: false,
    keepAliveTimeoutSeconds: 120,
    requestLimitKB:"5120",
    compressionEnabled: false,

    data: {
        mainDataConnectionPool : {
            mongoConnectionUrl: 'mongodb://sa:spiritualadventurers@ds119768.mlab.com:19768/vtour'
        }
    },

    apiRoutes: require('yamljs').load('./api/swagger/swagger.yaml'),
    errors: require("../ConfigErrors"),

    httpMethods:['get','post','put','delete']
};