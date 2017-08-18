const FS = require('fs');

const present = require('./src');

const server = config => {
	if (config instanceof String || typeof config === 'string') {
		try {
			config = JSON.parse(FS.readFileSync(config, 'utf8') || '{}');
		}
		catch (err) {
			config = {};
		}
	}
	config = Object.assign({}, config);

	var cbs = {};
	var server = {
		onUpload: cb => {
			if (cb instanceof Function || typeof cb === 'function') cbs.upload = cb;
			return server;
		}
	};
	process.nextTick(() => {
		config.callbacks = Object.assign(config.callbacks || {}, cbs);
		present(config);
	});
	return server;
};

server.VERSION = '0.0.1';
server.AUTHOR = 'LostAbaddon';
server.DESCRIPTION = 'Simple Web Server';

module.exports = server;