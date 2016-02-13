var blessed = require('blessed')
, contrib = require('blessed-contrib')
, screenUtils = require('../utils/screen');

module.exports = function (stream, term, user) {
	var screen = screenUtils.screenFromStream(stream, term);

	var grid = new contrib.grid({rows: 12, cols: 12, hideBorder: true, screen: screen})

	screen.title = 'Create your account';
	var content = 'Hello ' + user.name + ',\n\nYou\'ve made it to the next step. Here is what we know about you so far.\n\nUsername:' + user.name + '\n' + 'Keys:\n' + user.keys[0];
	var logo = grid.set(1, 1, 8, 8, blessed.box, { content: '    _  _     _ \r\n  _| || |_  | |\r\n |_  __  _| | |\r\n  _| || |_  | |\r\n |_  __  _| |_|\r\n   |_||_|   (_)\r\n' })
	var box = grid.set(1, 3, 8, 8, blessed.box, { content: content, scrollable: true, alwaysScroll: true, keys: true, vi: true, scrollbar: { ch: ' ', inverse: true } })
	var boxconfirm = grid.set(8, 1, 2, 10, blessed.text, { content: blessed.parseTags("{bold}Press 'Y' to continue or press 'Q' to quit.{/bold}"),  style: { bg: 'black', fg: 'green'}, padding: 2})

	box.focus();

	screen.key(['escape', 'q', 'S-q', 'C-c'], function(ch, key) {
		stream.end();
	});

	screen.key(['y', 'S-y'], function(ch, key) {
		console.log('User pressed' + key);
	});

	screen.render();
}
