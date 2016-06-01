const authHandler = require('./auth-handler'),
      sessionHandler = require('./session-handler');

function connectionHandler(client, clientInfo){
    var user = {};
    user.keys = [];
    user.clientInfo = clientInfo;

    client.on('authentication', (context) => {
        authHandler(context, user);
    });

    client.on('ready', () => {
        client.once('session', (accept, reject) => {
            sessionHandler(accept, reject, user);
        });
    });

    client.on('end', () => {
        console.log("Client disconnected");
    });

    client.on('error', (err) => {
        // what's an error?
    });

}

module.exports = connectionHandler;
