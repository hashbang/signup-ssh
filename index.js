var blessed = require('blessed')
	, contrib = require('blessed-contrib')
	, Server = require('ssh2').Server;

var config = { privateKey: require('fs').readFileSync('keys/host_rsa.key'),};

function noop(v) {}

var ssh = new Server(config, function(client){
  var stream,
      name;

  client.on('authentication', function(ctx){
    return ctx.accept();
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

        var screen = new blessed.screen({
          autoPadding: true,
          smartCSR: true,
          program: new blessed.program({
            input: stream,
            output: stream
          }),
          terminal: term || 'ansi'
        });

        var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})

        screen.title = 'Welcome to #!';
        var map = grid.set(0, 0, 4, 4, contrib.map, {label: 'World Map'})
        var box = grid.set(4, 4, 4, 4, blessed.box, {content: 'My Box'})

        screen.key(['escape', 'q', 'C-c'], function(ch, key) {
          stream.end();
        });

        screen.render();
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
