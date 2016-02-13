var blessed = require('blessed')
, contrib = require('blessed-contrib')
, screenUtils = require('./screen-utils');

module.exports = function (stream, term) {
	var screen = screenUtils.screenFromStream(stream, term);

	var grid = new contrib.grid({rows: 12, cols: 12, hideBorder: true, screen: screen})

	screen.title = 'Please generate a ssh key!';
	var welcomeText = "Hey there! It doesn't look like you have a SSH key.\r\ninsert generation instructions :p";
	var box = grid.set(1, 3, 8, 8, blessed.box, { content: welcomeText, scrollable: true, alwaysScroll: true, keys: true, vi: true, scrollbar: { ch: ' ', inverse: true } })
	var boxconfirm = grid.set(8, 1, 2, 10, blessed.text, { content: blessed.parseTags("{bold}Press 'Q' to quit.{/bold}"),  style: { bg: 'black', fg: 'green'}, padding: 2})

	box.focus();

	screen.key(['escape', 'q', 'S-q', 'C-c'], function(ch, key) {
		stream.end();
	});

	screen.render();
}
