const authHandler = require('./auth-handler'),
      sessionHandler = require('./session-handler');

function connectionHandler(client, clientInfo){
    var user = {},
        stream = 1;
    user.keys = [];
    user.clientInfo = clientInfo;

    client.on('authentication', (context) => {
        authHandler(context, user);
    });

    client.on('ready', () => {
        client.once('session', (accept, reject) => {
            sessionHandler(accept, reject, user, stream);
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
