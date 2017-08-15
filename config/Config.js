module.exports = {
    port: 3000,
    clusteringEnabled: false,
    keepAliveTimeoutSeconds: 120,
    requestLimitKB:"5120",
    compressionEnabled: false,

    data: {
        mainDataConnectionPool : {
            mongoConnectionUrl: 'mongodb://chat:chatapiuser@ds155631.mlab.com:55631/chat-api-db'
        }
    },
    conversation : {
        workspaceId : "d65554e3-473d-47c2-9cb7-bd55ff7500a9",
        username: "b6780ca5-ea15-4ad8-b69b-a90fa0739e02",
        password: "6OQE52IVjKCH",
        versionDate: "2017-05-26"
    },
    apiRoutes: require('yamljs').load('./api/swagger/swagger.yaml'),
    errors: require("../ConfigErrors"),
    security: require("../ConfigSecurity"),

    httpMethods:['get','post','put','delete']
};