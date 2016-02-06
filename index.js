var blessed = require('blessed')
	, contrib = require('blessed-contrib')
	, Server = require('ssh2').Server;

var config = { privateKey: require('fs').readFileSync('keys/host_rsa.key'),};

function noop(v) {}

var ssh = new Server(config, function(client){
  var stream,
      name,
		  keys = [];

  client.on('authentication', function(ctx){

	  name = ctx.username;

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
			keys.push(ctx.key.data);
			ctx.reject();
		}

		if ( ctx.method === 'keyboard-interactive') {
			console.log('All methods exhausted, let them pass through');
			ctx.accept();
		}
  });

  client.on('ready', function(ctx){
    var rows,
        columns,
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
        stream.name = name;
        stream.rows = rows || 24;
        stream.columns = cols || 80;
        stream.isTTY = true;
        stream.setRawMode = noop;
        stream.on('error', noop);

        var screen1 = new blessed.screen({
          autoPadding: true,
          smartCSR: true,
          program: new blessed.program({
            input: stream,
            output: stream
          }),
		  dockBorders: true,
          terminal: term || 'ansi'
        });

        var grid = new contrib.grid({rows: 12, cols: 12, hideBorder: true, screen: screen1})

        screen1.title = 'Welcome to #!';
		var welcomeText = 'Welcome to #!. This network has three rules:\r\n\r\n1. When people need help, teach. Don\'t do it for them\r\n2. Don\'t use our resources for closed source projects\r\n3. Be excellent to each other\r\n \r\nWe are a diverse community of people who love teaching and learning.Putting a #! at the beginning of a \"script\" style program tells a computer that it needs to \"do something\" or \"execute\" this file. Likewise, we are a community of people that like to \"do stuff\".\r\n\r\nIf you like technology, and you want to learn to write your first program, learn to use Linux, or even take on interesting challenges with some of the best in the industry, you are in the right place.\r\n \r\nThe following will set you up with a \"shell\" account on one of our shared systems. From here you can run IRC chat clients to talk to us,\r\n access to personal file storage and web hosting, and a wide range of development tools. \r\n \r\nEverything should work perfectly, unless it doesn\'t\r\n \r\nPlease report any issues here: \r\n-> https:\/\/github.com\/hashbang\/hashbang.sh\/issues\/\r\n'
        var logo = grid.set(1, 1, 8, 8, blessed.box, { content: '    _  _     _ \r\n  _| || |_  | |\r\n |_  __  _| | |\r\n  _| || |_  | |\r\n |_  __  _| |_|\r\n   |_||_|   (_)\r\n' })
        var box = grid.set(1, 3, 8, 8, blessed.box, { content: welcomeText, scrollable: true, alwaysScroll: true, keys: true, vi: true, scrollbar: { ch: ' ', inverse: true } })
		var boxconfirm = grid.set(8, 1, 2, 10, blessed.text, { content: blessed.parseTags("{bold}Press 'Y' to continue or press 'Q' to quit.{/bold}"),  style: { bg: 'black', fg: 'green'}, padding: 2})

		box.focus();

        screen1.key(['escape', 'q', 'C-c'], function(ch, key) {
          stream.end();
        });

        screen1.key(['y', 'Y'], function(ch, key) {
          console.log('User pressed' + key);
        });

        screen1.render();
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
