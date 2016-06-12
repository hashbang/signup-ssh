const blessed = require('blessed'),
      contrib = require('blessed-contrib'),
      renderScreen = require('../screen-renderer'),
      auto = true;

module.exports = (screen, stream, user) => {
    var contentArea = blessed.box({
        top: auto,
        width: 'shrink',
        content: 'Welcome to #! account creation page.\nPress arrow keys to move up/down the fields. Press Return to change/insert text. Press Esc to exit the field. Press Ctrl+s to submit the form after you\'ve entered your details.',
        height: '100%-4',
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
        top: 6,
        height: '100%-8',
        width: '100%-1',
        vi: true
    });

    var userNameLabel = blessed.text({
        parent: form,
        content: 'Username:',
        top: 0
    });

    var username = blessed.textbox({
        parent: form,
        name: 'username',
        value: user.name,
        input: true,
        keys: true,
        top: 0,
        left: 12,
        height: 1,
        width: '80%',
        style: {
            fg: 'white',
            bg: 'black',
            focus: {
                bg: 'red',
                fg: 'white'
            }
        }
    });

    var userNameDescription = blessed.text({
        parent: form,
        content: 'Your username is your unique identifier. You\'ll use this to login to #! account and receive mail',
        left: 12,
        top: 1
    });

    var sshKeyLabel = blessed.text({
        parent: form,
        content: 'SSH Key:',
        top: 4
    });


    var sshKey = blessed.textarea({
        parent: form,
        name: 'ssh_keys',
        value: user.keys[0],
        input: true,
        keys: true,
        top: 4,
        left: 12,
        width: '80%',
        height: '100%-8',
        style: {
            fg: 'white',
            bg: 'black',
            focus: {
                bg: 'red',
                fg: 'white'
            }
        }
    });

    var sshKeyDescription = blessed.text({
        parent: form,
        content: 'This SSH key is used to setup passwordless authentication to #! shell servers. You can always add more SSH keys using hashbangctl tool from #! shell.',
        left: 12,
        top: '100%-4'
    });

    screen.append(contentArea);
    form.focus();

    form.on('submit', (data) => {
        renderScreen(screen, stream, 'account-review', data);
    });


    screen.key(['C-y', 'C-s'], (ch, key) => {
        form.submit();
    });
};
