const blessed = require('blessed'),
      contrib = require('blessed-contrib'),
      renderScreen = require('../screen-renderer'),
      auto = true;

module.exports = (screen, stream, user) => {


    screen.title = 'Welcome to #!';
    var welcomeText = 'Welcome to #!. This network has three rules:\r\n\r\n1. When people need help, teach. Don\'t do it for them\r\n2. Don\'t use our resources for closed source projects\r\n3. Be excellent to each other\r\n \r\nWe are a diverse community of people who love teaching and learning.Putting a #! at the beginning of a \"script\" style program tells a computer that it needs to \"do something\" or \"execute\" this file. Likewise, we are a community of people that like to \"do stuff\".\r\n\r\nIf you like technology, and you want to learn to write your first program, learn to use Linux, or even take on interesting challenges with some of the best in the industry, you are in the right place.\r\n \r\nThe following will set you up with a \"shell\" account on one of our shared systems. From here you can run IRC chat clients to talk to us,\r\n access to personal file storage and web hosting, and a wide range of development tools. \r\n \r\nEverything should work perfectly, unless it doesn\'t\r\n \r\nPlease report any issues here: \r\n-> https:\/\/github.com\/hashbang\/hashbang.sh\/issues\/\r\n';

    var contentArea = blessed.text({
        top: auto,
        width: 'shrink',
        height: '80%',
        content: welcomeText,
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
