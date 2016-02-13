var blessed = require('blessed')
, contrib = require('blessed-contrib');

module.exports = {
	screenFromStream: function(stream, term) {
		return new blessed.screen({
			autoPadding: true,
			smartCSR: true,
			program: new blessed.program({
				input: stream,
				output: stream
			}),
			dockBorders: true,
			terminal: term || 'ansi'
		});
	},
};
