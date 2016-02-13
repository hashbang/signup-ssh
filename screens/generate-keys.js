var blessed = require('blessed')
, contrib = require('blessed-contrib')
, screenUtils = require('./screen-utils');

module.exports = function (stream, term) {
	var screen = screenUtils.screenFromStream(stream, term);

	var grid = new contrib.grid({rows: 12, cols: 12, hideBorder: true, screen: screen})

	screen.title = 'Please generate a ssh key!';
	var welcomeText = "It doesn't look like you have a SSH key.\r\nSSH keys are a way for your computer to securely identify to a remote server.\r\nWe need you to provide one so that we can verify who you are when you log in.\r\nHere's how to generate one:\r\n$ ssh-keygen -t rsa -b 4096 \"your_email@example.com\"\r\nJust hit enter when prompted to \"Enter a file in which to save the key\".\r\nWhen prompted, type in a secure passphrase.\r\nThis makes your account here secure even if your computer gets stolen.\r\nThen run\r\n$ ssh-add ~/.ssh/id_rsa\r\nto add your key to the SSH keychain, and type in your passphrase when prompted.\r\nCome back when you've got yourself a shiny new SSH key!";
	var box = grid.set(1, 2, 8, 8, blessed.box, { content: welcomeText, scrollable: true, alwaysScroll: true, keys: true, vi: true, scrollbar: { ch: ' ', inverse: true } })
	var boxconfirm = grid.set(8, 1, 2, 10, blessed.text, { content: blessed.parseTags("{bold}Press 'Q' to quit.{/bold}"),  style: { bg: 'black', fg: 'green'}, padding: 2})

	box.focus();

	screen.key(['escape', 'q', 'S-q', 'C-c'], function(ch, key) {
		stream.end();
	});

	screen.render();
}
