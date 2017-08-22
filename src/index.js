/**
 * Name:	Simple Server
 * Desc:    简易服务器，通过配置文件实现静态资源获取、下载、上传、跳转以及WebAPI接口
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.08.19
 */

require('./core');

const Path = require('path');
const Express = require('express');

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

const DefaultConfig = {
	loglev: 1,
	port: ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') ? 80 : 8080),
	api: [ './api' ],
	forbid: [],
	redirect: {},
	download: ['./download'],
	root: ['./'],
	error: {}
};
const DefaultUploadConfig = {
	"destination": "./upload",
	"keepname": false,
	"timely": false
};
const server = config => {
	config = Object.assign(DefaultConfig, config);
	config.root = pathNormalize(config.root);
	config.api = config.api.map(path => [pathUrlize(path), pathNormalize(path)]);
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

	var logger = global.logger(config.loglev);
	var info = logger.info;
	var log = logger.log;
	var warn = logger.warn;
	var error = logger.error;

	var app = Express();

	if (app.enabled('x-powered-by')) app.use((req, res, next) => {
		res.setHeader('X-Powered-By', 'Present');
		next();
	});

	// WebAPI
	require('./apiloader')(app, config.api);

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

	// Upload Folder
	if (!!config.upload) {
		if (config.forbid.length === 0) config.forbid.push(config.upload.destination);
		config.upload = Object.assign(DefaultUploadConfig, config.upload);
		config.upload.classify = Object.assign(DefaultUploadConfig.classify, config.upload.classify);
		config.upload.url = config.upload.url || pathUrlize(config.upload.destination);
		require('./uploader')(app, config.upload, config.callbacks.upload);
	}
	
	// Static Folder
	config.root.map(path => app.use(require('./cachedStaticServer')(path)));

	// 404
	app.use(config.error["404"]);

	app.config = config;
	app.listen(config.port);

	log('Server Started...');
};

module.exports = server;