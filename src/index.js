/**
 * Name:	Simple Server
 * Desc:    A static web server, one can set the resource download folder, forbidden folder and WebAPI interface.
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.08.16
 */

const Path = require('path');
const Express = require('express');
const Css = require('./cachedStaticServer');
const Loader = require('./apiloader');

const Root = process.cwd();

const pathNormalize = path => {
	if (path instanceof String || typeof path === 'string') {
		if (!!path.match('^\/')) { // Start with /
			path = Path.normalize(path);
		}
		else {
			path = Path.normalize(Root + '/' + path);
		}
		path = path.replace(/\/?$/, '');
		return path;
	}
	else {
		return path.map(p => pathNormalize(p));
	}
};
const pathUrlize = path => {
	var urlpath = path.replace(/^\.*\/*/, '/');
	if (!urlpath.match(/^\//)) urlpath = '/' + urlpath;
	return urlpath;
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

const server = config => {
	config.loglev = config.loglev || 1; // 1: info; 2: log; 3: warn; 4: error
	config.port = config.port || 80;
	config.root = pathNormalize(config.root || [ "./" ]);
	config.download = config.download || [ "./download" ];
	config.api = (config.api || [ "./api" ]).map(path => [pathUrlize(path), pathNormalize(path)]);
	config.forbid = config.forbid || [];
	config.redirect = config.redirect || {};
	config.error = config.error || {};
	config.error["404"] = config.error["404"] || function (req, res) {
		error('No Such Page: ' + req.path);
		if (req.path === '/error/404.html') {
			res.status(404);
			res.send('<!doctype html><html><head><title>该页无法显示</title></head><body style="font-size:20px;font-weight:bold;text-align:center;">404 该页无法显示<br>' + req.path + '</body></html>');
		}
		else {
			res.redirect(404, '/error/404.html?path=' + req.path);
		}
	};

	var info = function () { if (config.loglev <= 1) {[].unshift.call(arguments, '[INFO  (' + timeNormalize() + ')]'); console.info.apply(console, arguments)} };
	var log = function () { if (config.loglev <= 2) {[].unshift.call(arguments, '[LOG   (' + timeNormalize() + ')]'); console.log.apply(console, arguments)} };
	var warn = function () { if (config.loglev <= 3) {[].unshift.call(arguments, '[WARN  (' + timeNormalize() + ')]'); console.warn.apply(console, arguments)} };
	var error = function () { if (config.loglev <= 4) {[].unshift.call(arguments, '[ERROR (' + timeNormalize() + ')]'); console.error.apply(console, arguments)} };

	var app = Express();
	// WebAPI
	Loader(config.api, app);
	// Forbidden Path
	config.forbid.map(path => {
		var urlpath = pathUrlize(path);
		app.use(urlpath, config.error["404"]);
	});
	// Redirect
	for (let path in config.redirect) {
		let urlpath = pathUrlize(path);
		let target = config.redirect[path];
		app.use(urlpath, (req, res, next) => {
			var query = '?';
			for (let key in req.query) {
				query += key + '=' + req.query[key];
			}
			var url = target + req.path.replace(/^\//, '') + query;
			res.redirect(url);
		});
	}
	// Download Folder
	config.download.map(path => {
		var dlpath = pathNormalize(path);
		var urlpath = pathUrlize(path);
		app.use(urlpath, (req, res, next) => {
			res.download(dlpath + req.path, err => {
				if (!!err) next();
			});
		});
	});
	// Static Folder
	config.root.map(path => app.use(Css(path)));
	// 404
	app.use(config.error["404"]);

	app.listen(config.port);

	log('Server Started...');
};

module.exports = server;