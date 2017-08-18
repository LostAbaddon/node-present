global.reload = path => {
	path = require.resolve(path);
	var module = require.cache[path];
	if (module.parent) {
		module.parent.children.splice(module.parent.children.indexOf(module), 1);
	}
	delete require.cache[path];
};

const stringNormalize = (str, len, padding) => {
	str = str.toString();
	padding = padding || ' ';
	len = len || 0;
	var l = str.length;
	for (let i = l; i < len; i ++) str = padding + str;
	return str;
};
const timeNormalize = time => {
	time = time || new Date();
	var Y = time.getYear() + 1900;
	var M = time.getMonth() + 1;
	var D = time.getDate();
	var h = time.getHours();
	var m = time.getMinutes();
	var s = time.getSeconds();
	var ms = time.getMilliseconds();
	return stringNormalize(Y, 4, '0')
		+ '/' + stringNormalize(M, 2, '0')
		+ '/' + stringNormalize(D, 2, '0')
		+ ' ' + stringNormalize(h, 2, '0')
		+ ':' + stringNormalize(m, 2, '0')
		+ ':' + stringNormalize(s, 2, '0')
		+ '.' + stringNormalize(ms, 2, '0')
};
global.logger = loglev => {
	var info = function () { if (loglev <= 1) {[].unshift.call(arguments, '[INFO  (' + timeNormalize() + ')]'); console.info.apply(console, arguments)} };
	var log = function () { if (loglev <= 2) {[].unshift.call(arguments, '[LOG   (' + timeNormalize() + ')]'); console.log.apply(console, arguments)} };
	var warn = function () { if (loglev <= 3) {[].unshift.call(arguments, '[WARN  (' + timeNormalize() + ')]'); console.warn.apply(console, arguments)} };
	var error = function () { if (loglev <= 4) {[].unshift.call(arguments, '[ERROR (' + timeNormalize() + ')]'); console.error.apply(console, arguments)} };
	return {
		info: info,
		log: log,
		warn: warn,
		error: error
	}
};