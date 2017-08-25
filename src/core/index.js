/**
 * Name:	Common Core
 * Desc:    辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2017.08.24
 *
 * 热更新require库
 * 字符串拓展、随机穿
 * 日志工具
 * 文件夹生成
 * 辅助工具
 * Object的copy与extent功能
 */

const FS = require('fs');
const Path = require('path');

global.Utils = global.Utils || {};

global.reload = path => {
	path = require.resolve(path);
	var module = require.cache[path];
	if (module.parent) {
		module.parent.children.splice(module.parent.children.indexOf(module), 1);
	}
	delete require.cache[path];
};

String.prototype.prepadding = function (len, padding) {
	var str = this.toString();
	padding = padding || ' ';
	len = len || 0;
	var l = str.length;
	for (let i = l; i < len; i ++) str = padding + str;
	return str;
};

const getDTMatch = (format, match, lim, def) => {
	if (isNaN(def)) def = lim;
	var temp = format.match(match);
	if (!temp) temp = def;
	else temp = temp.length;
	if (temp < lim) temp = lim;
	return temp;
}
const getDateString = (Y, M, D, link) => {
	link = link || '/';
	var temp = [];
	if (Y.length > 0) temp.push(Y);
	if (M.length > 0) temp.push(M);
	if (D.length > 0) temp.push(D);
	return temp.join(link);
};
const getTimeString = (h, m, s, ms, link) => {
	link = link || ':';
	var temp = [];
	if (h.length > 0) temp.push(h);
	if (m.length > 0) temp.push(m);
	if (s.length > 0) temp.push(s);
	var result = temp.join(link);
	if (ms.length > 0) result += '.' + ms;
	return result;
};
const timeNormalize = (time, format, datelink, timelink, combinelink) => {
	time = time || new Date();
	// format = format || 'YYYYMMDDhhmmssx';
	format = format || 'YYYYMMDDhhmmss';
	datelink = datelink || '/';
	timelink = timelink || ':';
	combinelink = combinelink || ' ';

	var Ys = getDTMatch(format, /Y/g, 0, 0);
	var Ms = getDTMatch(format, /M/g, 1, 0);
	var Ds = getDTMatch(format, /D/g, 1, 0);
	var hs = getDTMatch(format, /h/g, 0, 0);
	var mms = getDTMatch(format, /m/g, 0, 0);
	var ss = getDTMatch(format, /s/g, 0, 0);
	var mss = getDTMatch(format, /x/g, 0);

	var Y = (time.getYear() + 1900 + '').prepadding(Ys, '0');
	var M = (time.getMonth() + 1 + '').prepadding(Ms, '0');
	var D = (time.getDate() + '').prepadding(Ds, '0');
	var h = (time.getHours() + '').prepadding(hs, '0');
	var m = (time.getMinutes() + '').prepadding(mms, '0');
	var s = (time.getSeconds() + '').prepadding(ss, '0');
	var ms = (time.getMilliseconds() + '').prepadding(mss, '0');

	if (Ys === 0) Y = '';
	if (Ms === 0) M = '';
	if (Ds === 0) D = '';
	if (hs === 0) h = '';
	if (mms === 0) m = '';
	if (ss === 0) s = '';
	if (mss === 0) ms = '';

	var sDate = getDateString(Y, M, D, datelink);
	var sTime = getTimeString(h, m, s, ms, timelink);
	if (sTime.length === 0) return sDate;
	return sDate + combinelink + sTime;
};
global.Utils.getTimeString = timeNormalize;

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

const KeySet = [];
(() => {
	for (let i = 0; i < 10; i ++) KeySet.push('' + i);
	for (let i = 65; i <= 90; i ++) KeySet.push(String.fromCharCode(i));
	for (let i = 97; i <= 122; i ++) KeySet.push(String.fromCharCode(i));
}) ();
String.random = (len) => {
	var rnd = "";
	for (let i = 0; i < len; i ++) {
		rnd += KeySet[Math.floor(KeySet.length * Math.random())];
	}
	return rnd;
};

global.Utils.preparePath = async (path, cb) => {
	var has = FS.access(path, (err) => {
		if (!err) return cb(true);
		var parent = Path.parse(path).dir;
		global.Utils.preparePath(parent, (result) => {
			if (!result) return cb(false);
			FS.mkdir(path, (err) => {
				if (!err) return cb(true);
			});
		});
	});
};
global.Utils.preparePathSync = path => {
	var has;
	try {
		has = FS.accessSync(path);
		return true;
	}
	catch (err) {}
	var parent = Path.parse(path).dir;
	has = global.Utils.preparePathSync(parent);
	if (!has) return false;
	try {
		FS.mkdirSync(path);
	}
	catch (err) {
		return false;
	}
};

Object.prototype.copy = function () {
	return Object.assign({}, this);
}
Object.prototype.extent = function (...targets) {
	var copy = Object.assign({}, this);
	targets.reverse();
	Object.assign(this, ...targets, copy);
}
Array.prototype.copy = function () {
	return this.map(ele => ele);
};

require('./eventManager');