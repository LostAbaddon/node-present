/**
 * Name:	API Loader
 * Desc:    自动加载API指定目录下的文件，作为WebAPI接口
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.08.16
 */

const FS = require('fs');

const Handlers = {};

const dealFilePath = (path, root, url) => {
	path = url + path.replace(root, '');
	if (path.substring(path.length - 5, path.length) === '/_.js') {
		path = path.substring(0, path.length - 5);
	}
	path = path.replace(/\/{(.*)}(\/|$)/gi, (match, tag) => '/:' + tag + '/');
	return path;
};
const createReloadableHandler = (path, handler) => {
	Handlers[path] = handler;
	return (method, params, session, callback) => {
		var hanlder = Handlers[path];
		if (!handler) return null;
		// console.log('xxxxxxxx', path);
		return handler(method, params, session, callback);
	};
};
const mountHandler = (path, root, url, handlers) => {
	var hanlder;
	try {
		handler = require(path);
	}
	catch (err) {
		return;
	}
	var url = dealFilePath(path, root, url);
	handlers[url] = createReloadableHandler(path, handler);
};
const searchFolder = (folder, root, url, handlers) => {
	var contents;
	try {
		contents = FS.readdirSync(folder);
	}
	catch (err) {
		return;
	}
	contents = contents.map(c => {
		var p = folder + '/' + c;
		var stat = FS.statSync(p);
		if (stat.isDirectory()) {
			if (!!c.match(/^{.*}$/)) return [p, 3, true];
			if (!!c.match(/[\(\)\[\]\*\?]/)) return [p, 2, true];
			return [p, 1, true];
		}
		else if (stat.isFile()) {
			if (p.substring(p.length - 5, p.length) === '/_.js') return [p, 4, false];
			return [p, 0, false];
		}
		else {
			return ['', 999];
		}
	});
	contents.sort((a, b) => a[1] - b[1]);
	contents.map(c => {
		if (c[1] >= 999) return;
		var p = c[0], type = c[2];
		if (type) {
			searchFolder(p, root, url, handlers);
		}
		else {
			mountHandler(p, root, url, handlers);
		}
	});
};
const loadHandler = (app, pathlist) => {
	var handlers = {};
	pathlist.map(p => {
		searchFolder(p[1], p[1], p[0], handlers);
	});
	Object.keys(handlers).map(path => {
		var handler = handlers[path];
		app.use(path, (req, res, next) => {
			var params = {};
			if (req.body instanceof String || typeof req.body === 'string') {
				let content;
				try {
					content = JSON.parse(req.body);
				}
				catch (err) {
					content = req.body;
				}
				req.body = { data: content };
			}
			else if (req.body instanceof Array || (!!req.body.map && !!req.body.some)) {
				req.body = { data: req.body };
			}
			Object.assign(params, req.body, req.params, req.query, req.cookies);
			handler(req.method, params, {}, result => {
				if (result === null || result === undefined) next();
				else res.json(result);
			});
		});
	});
};

module.exports = loadHandler;