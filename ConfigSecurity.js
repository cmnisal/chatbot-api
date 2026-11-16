module.exports = {
    secureEndpoints: true,
    apiCredentials: {
        vtourweb: {
            username: process.env.API_USERNAME,
            password: process.env.API_PASSWORD
        }
    },
    sessionSecret: process.env.SESSION_SECRET,
    authToken: {
        secret: process.env.AUTH_TOKEN_SECRET,
        expirationMins: 10000
    },
    socketAuthenticationTimeOut:10000
};
