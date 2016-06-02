const blessed = require('blessed'),
      contrib = require('blessed-contrib'),
      renderScreen = require('../screen-renderer'),
      auto = true;

module.exports = (screen, stream, user) => {
    var content = 'Account Review Screen';

    var contentArea = blessed.text({
        top: auto,
        width: 'shrink',
        height: '80%',
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

    screen.append(contentArea);
    contentArea.focus();
};
