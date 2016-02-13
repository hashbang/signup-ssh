'use strict'

var Server = require('ssh2').Server,
	clientHandler = require('./utils/clienthandler.js');

var config = { privateKey: require('fs').readFileSync('keys/host_rsa.key'),};


var ssh = new Server(config)

ssh.on('connection', function(client, info) {
	clientHandler(client, info);
});

ssh.listen(4444, function(){
	console.log('Listening on port ' + this.address().port);
});
