const authHandler = require('./auth-handler'),
      sessionHandler = require('./session-handler');

function connectionHandler(client, clientInfo){
	let user = {};
	user.keys = [];

	client.on('authentication', (context) => {
		authHandler(context, clientInfo, user);
	});

	client.on('ready', () => {
		client.once('session', (accept, reject) => {
            sessionHandler(accept, reject, user);
        });
	});

	client.on('end', () => {
		console.log("Client disconnected");
	});

	client.on('error', () => {
		// what's an error?
	});

}

module.exports = connectionHandler;
