module.exports = {
    port: 3000,
    clusteringEnabled: false,
    keepAliveTimeoutSeconds: 120,
    requestLimitKB:"5120",
    compressionEnabled: false,

    data: {
        mainDataConnectionPool : {
            mongoConnectionUrl: process.env.MONGO_CONNECTION_URL
        }
    },
    conversation : {
        workspaceId : process.env.WATSON_WORKSPACE_ID,
        username: process.env.WATSON_USERNAME,
        password: process.env.WATSON_PASSWORD,
        versionDate: "2017-05-26"
    },
    apiRoutes: require('yamljs').load('./api/swagger/swagger.yaml'),
    errors: require("../ConfigErrors"),
    security: require("../ConfigSecurity"),

    httpMethods:['get','post','put','delete']
};