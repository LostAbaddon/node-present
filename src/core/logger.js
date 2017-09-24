/**
 * Name:	Logger Extension
 * Desc:    日志记录拓展
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.09.23
 */

const timeNormalize = global.Utils.getTimeString;
global.logger = loglev => {
	var info = function () {
		if (loglev <= 1) {
			[].unshift.call(arguments, '[INFO (' + timeNormalize() + ')]');
			console.info.apply(console, arguments);
		}
	};
	var log = function () {
		if (loglev <= 2) {
			[].unshift.call(arguments, '[LOG  (' + timeNormalize() + ')]');
			console.log.apply(console, arguments);
		}
	};
	var warn = function () {
		if (loglev <= 3) {
			[].unshift.call(arguments, '[WARN (' + timeNormalize() + ')]');
			console.warn.apply(console, arguments);
		}
	};
	var error = function () {
		if (loglev <= 4) {
			[].unshift.call(arguments, '[ERROR(' + timeNormalize() + ')]');
			console.error.apply(console, arguments);
		}
	};
	return {
		info: info,
		log: log,
		warn: warn,
		error: error
	}
};