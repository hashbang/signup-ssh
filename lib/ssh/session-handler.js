const blessed = require('blessed'),
      contrib = require('blessed-contrib');

const renderScreen = require('../screen-renderer');

function noop(v) {}

function sessionHandler(accept, reject, user, stream) {
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

    session.once('shell', (accept, reject) => {
        // accept() returns a Channel for the interactive shell.
        stream = accept();

        // https://github.com/mscdex/ssh2/#pseudo-tty-settings
        stream.rows = rows || 24;
        stream.columns = cols || 80;
        stream.isTTY = true;
        stream.setRawMode = noop;
        stream.on('error', noop);

        // Render welcome screen
        renderScreen(stream, 'welcome', user);
    });
}

module.exports = sessionHandler;
