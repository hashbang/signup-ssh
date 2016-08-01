const Server = require('ssh2').Server,
      connectionHandler = require('./lib/ssh/connection-handler');

const config = { hostKeys: [require('fs').readFileSync('keys/host_rsa.key')] };

let ssh = new Server(config);
let port = (typeof process.env.PORT === 'undefined') ? 4444 : process.env.PORT;
console.log(process.env.PORT)

ssh.on('connection', connectionHandler);

ssh.listen(port, function(){
    console.log('Listening on port ' + this.address().port);
});
