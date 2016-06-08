const blessed = require('blessed'),
      contrib = require('blessed-contrib'),
      renderScreen = require('../screen-renderer'),
      auto = true;

module.exports = (screen, stream, user) => {
    var content = 'Account Info Screen';
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

    // Main form elements
    var form = blessed.form({
        parent: contentArea,
        inputOnFocus: true,
        keys: true,
        left: 0,
        top: auto+3,
        width: '98%',
        height: auto+10,
        bg: 'green',
        content: 'Submit or cancel?'
    });

    var username = blessed.textbox({
        parent: form,
        name: 'username',
        value: user.name,
        input: true,
        keys: true,
        top: 0,
        left: 0,
        height: 1,
        width: '100%',
        style: {
            fg: 'white',
            bg: 'black',
            focus: {
                bg: 'red',
                fg: 'white'
            }
        }
    });


    var ssh_key = blessed.textarea({
        parent: form,
        name: 'ssh_keys',
        value: user.keys[0],
        input: true,
        keys: true,
        top: 2,
        left: 0,
        height: 5,
        width: '100%',
        style: {
            fg: 'white',
            bg: 'black',
            focus: {
                bg: 'red',
                fg: 'white'
            }
        }
    });

    screen.append(contentArea);
    form.focus();
};
