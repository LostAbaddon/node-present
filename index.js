/**
 * Name:	Simple Web Server Entry
 * Desc:    简易服务器入口，自动获取参数文件并提供快捷的设置回调的入口
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.08.19
 *
 * config:
 * 		destination		保存的根路径
 * 		keeyname		是否保存原文件名
 * 		timely			是否追加时间信息，false不加，'folder'在分类路径下以时间为次目录，'postfix'在文件名后加时间为标记
 * 		classify		分类器，key是文件类型，value是分类目录
 */

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
		},
		onError: cb => {
			cbs.error = cb;
			return server;
		}
	};
	process.nextTick(() => {
		config.callbacks = Object.assign(config.callbacks || {}, cbs);
		present(config);
	});
	return server;
};

server.VERSION = '0.1.0';
server.AUTHOR = 'LostAbaddon';
server.DESCRIPTION = 'Simple Web Server';

module.exports = server;