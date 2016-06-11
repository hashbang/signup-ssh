const blessed = require('blessed'),
      contrib = require('blessed-contrib'),
      renderScreen = require('../screen-renderer'),
      auto = true;

module.exports = (screen, stream, user) => {
    var content = 'Server Select Screen';

    var contentArea = blessed.text({
        top: auto,
        width: 'shrink',
        height: '100%-6',
        content: content,
        padding: 1,
        scrollable: true,
        keys: true,
        vi: true,
        alwaysScroll: true,
        scrollbar: {
            bg: 'blue',
            fg: 'red'
        }
    });

    var map = contrib.map({
        parent: contentArea,
        label: 'Choose your primary server'
    });

    screen.append(contentArea);
    contentArea.focus();
};
