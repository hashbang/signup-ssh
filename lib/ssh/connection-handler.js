const authHandler = require('./auth-handler'),
sessionHandler = require('./session-handler');

function connectionHandler(client, clientInfo){
	let user = {};
	user.keys = [];

	client.on('authentication', (context) => {
		authHandler(context, clientInfo);
	});

	client.on('ready', () =>{
		client.once('session', sessionHandler);
	});

	client.on('end', function(){
		console.log("Client disconnected");
	});

	client.on('error', function(err){
		// what's an error?
	});

}

module.exports = connectionHandler;
