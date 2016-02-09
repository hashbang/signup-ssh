'use strict'

var Server = require('ssh2').Server;

var welcomeScreen = require('./screens/welcome.js');

var config = { privateKey: require('fs').readFileSync('keys/host_rsa.key'),};

function noop(v) {}

var ssh = new Server(config, function(client){
	var stream;
	var user = {};
	user.keys = [];

	client.on('authentication', function(ctx){

		user.name = ctx.username || 'guest';

		if (ctx.method === 'none') {
			// You need to generate ssh key message
			console.log('Client connecting using authmethod: none. Rejecting.');
			ctx.reject();
		}
		if (ctx.method === 'password') {
			// You need to generate ssh key message
			console.log('Client connecting using password');
			ctx.reject();
		}

		if ( ctx.method === 'publickey') {
			console.log('Client connecting using pubkey');
			user.keys.push(ctx.key.algo + ' ' + ctx.key.data.toString('base64'));
			ctx.reject();
		}

		if ( ctx.method === 'keyboard-interactive') {
			console.log('All methods exhausted, let them pass through');
			ctx.accept();
		}
	});

	client.on('ready', function(ctx){
		var rows,
		cols,
		term;

		client.once('session', function(accept, reject){
			var session = accept();

			session.once('pty', function(accept, reject, info){
				rows = info.rows;
				cols = info.cols;
				term = info.term;
				accept && accept();
			});

			session.on('window-change', function(accept, reject, info) {
				rows = info.rows;
				cols = info.cols;
				if (stream) {
					stream.rows = rows;
					stream.columns = cols;
					stream.emit('resize');
				}
				accept && accept();
			});

			session.once('shell', function(accept, reject){
				// accept() returns a Channel for the interactive shell.
				stream = accept();

				// https://github.com/mscdex/ssh2/#pseudo-tty-settings
				stream.name = user.name;
				stream.rows = rows || 24;
				stream.columns = cols || 80;
				stream.isTTY = true;
				stream.setRawMode = noop;
				stream.on('error', noop);

				welcomeScreen(stream, term);
			}); //shell
		}); // session
	}); //ready

	client.on('end', function(){
		console.log("Client disconnected");
	});

	client.on('error', function(err){
		// what's an error?
	});

});

ssh.listen(4444, function(){
	console.log('Listening on port ' + this.address().port);
});
