var userdetails = require('../screens/userdetails.js'),
	generateKeysScreen = require('../screens/generate-keys.js');

function noop(v) {}

function clientHandler(client, clientInfo){
	var stream;
	var user = {};
	user.keys = [];

	function authHandler(ctx){

		user.name = ctx.username || 'guest';

		if (ctx.method === 'none') {
			// You need to generate ssh key message
			console.log(clientInfo.ip + ' => Client connecting using authmethod: none. Rejecting.');
			ctx.reject();
		}

		if (ctx.method === 'password') {
			// You need to generate ssh key message
			console.log(clientInfo.ip + ' => Client connecting using password');
			ctx.reject();
		}

		if (ctx.method === 'publickey') {
			console.log(clientInfo.ip + ' => Client connecting using pubkey');
			user.keys.push(ctx.key.algo + ' ' + ctx.key.data.toString('base64'));
			ctx.reject();
		}

		if (ctx.method === 'keyboard-interactive') {
			console.log(clientInfo.ip + ' => All methods exhausted, let them pass through');
			ctx.accept();
		}
	};

	function ioHandler(ctx){
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

				if (user.keys.length == 0) {
					console.log("user has no keys, tell them how to create some");
					generateKeysScreen(stream, term);
				} else {
					userdetails(stream, term, user);
				}
			}); //shell
		}); // session
	}; //ready

	client.on('authentication', authHandler);
	client.on('ready', ioHandler);
	client.on('end', function(){
		console.log(clientInfo.ip + " => Client disconnected");
	});

	client.on('error', function(err){
		// what's an error?
	});

}

module.exports = clientHandler;
