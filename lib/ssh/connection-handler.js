const authHandler = require('./auth-handler'),
      sessionHandler = require('./session-handler');

function connectionHandler(client, clientInfo){
    var user = {},
        stream,
        screen;

    user.keys = [];
    user.clientInfo = clientInfo;
    user.name = '';
    user.inputData = {};

    client.on('authentication', (context) => {
        authHandler(context, user);
    });

    client.on('ready', () => {
        client.once('session', (accept, reject) => {
            sessionHandler(accept, reject, user, stream, screen);
        });
    });

    client.on('end', () => {
        console.log(clientInfo.ip + " => Disconnected");
    });

    client.on('error', (err) => {
        // what's an error?
    });

}

module.exports = connectionHandler;
