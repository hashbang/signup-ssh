const blessed = require('blessed'),
contrib = require('blessed-contrib');

function renderScreen(stream, screenName) {
  screen = new blessed.screen({
    autoPadding: true,
    smartCSR: true,
    program: new blessed.program({
      input: stream,
      output: stream
    }),
    dockBorders: true,
    terminal: term || 'ansi'
  });

  require('./screens/'+ screenName + '.js')(stream, screen);

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    stream.end();
  });

  screen.render();
}

module.exports = renderScreen;
