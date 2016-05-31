const Server = require('ssh2').Server,
			connectionHandler = require('./lib/ssh/connection-handler');

const config = { hostKeys: [require('fs').readFileSync('keys/host_rsa.key')] };

let ssh = new Server(config);

ssh.on('connection', connectionHandler);

ssh.listen(4444, function(){
  console.log('Listening on port ' + this.address().port);
});
