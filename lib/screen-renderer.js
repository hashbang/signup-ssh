const blessed = require('blessed'),
      contrib = require('blessed-contrib'),
      auto = true;

function renderScreen(screen, stream, screenName, user) {
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
                screen.destroy();
                renderScreen(screen, stream, 'welcome', user);
                screen.render();
            },
            'Account Info': function() {
                screen.destroy();
                renderScreen(screen, stream, 'account-info', user);
                screen.render();
            },
            'Select Server': function() {
                screen.destroy();
                renderScreen(screen, stream, 'server-select', user);
                screen.render();
            },
            'Confirm': function() {
                screen.destroy();
                renderScreen(screen, stream, 'account-review', user);
                screen.render();
            },
            'Guide': function() {
                screen.destroy();
                renderScreen(screen, stream, 'post-signup', user);
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

    require('./screens/'+ screenName)(screen, stream, user);

    screen.key(['q', 'C-c'], function(ch, key) {
        screen.destroy();
        stream.end();
    });

    screen.append(topBar);
    screen.render();
}

module.exports = renderScreen;
