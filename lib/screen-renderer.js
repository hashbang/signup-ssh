const blessed = require('blessed'),
      contrib = require('blessed-contrib'),
      auto = true;

function renderScreen(stream, screenName, user) {
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

    // add common screen components
    var bottomBarMenu = blessed.listbar({
        parent: screen,
        bottom: 0,
        height: auto ? 'shrink' : 3,
        width: '100%',
        mouse: true,
        keys: true,
        autoCommandKeys: true,
        vi: true,
        style: {
            bg: 'magenta',
            item: {
                bg: 'red',
                hover: {
                    bg: 'blue'
                }
            },
            selected: {
                bg: 'blue'
            }
        },
        commands: {
            'Welcome': function() {
                screen.render();
            },
            'Account Info': function() {
                screen.render();
            },
            'Select Server': function() {
                screen.render();
            },
            'Confirm': function() {
                screen.render();
            },
            'Guide': function() {
                screen.render();
            }
        }
    });

    var topBar = blessed.box({
        top: '0',
        width: '100%',
        height: 'shrink',
        valign: 'middle',
        content: '{bold} Welcome to #! {/bold} - Sign Up',
        tags: true,
        style: {
            fg: 'white',
            bg: 'magenta'
        }
    });

    require('./screens/'+ screenName + '.js')(stream, screen);

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        stream.end();
    });

    screen.append(topBar);
    screen.render();
}

module.exports = renderScreen;
