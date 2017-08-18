const FS = require('fs');
const Express = require('express');

const dealFilePaht = (path, root, url) => {
	path = url + path.replace(root, '');
	if (path.substring(path.length - 5, path.length) === '/_.js') {
		path = path.substring(0, path.length - 5);
	}
	path = path.replace(/\/{(.*)}(\/|$)/gi, (match, tag) => '/:' + tag + '/');
	return path;
};
const mountHandler = (path, root, url, handlers) => {
	var hanlder;
	try {
		handler = require(path);
	}
	catch (err) {
		return;
	}
	var url = dealFilePaht(path, root, url);
	handlers[url] = handler;
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
const loadHandler = (pathlist, app) => {
	var handlers = {};
	pathlist.map(p => {
		searchFolder(p[1], p[1], p[0], handlers);
	});
	Object.keys(handlers).map(path => {
		var handler = handlers[path];
		app.use(path, (req, res, next) => {
			var params = {};
			Object.assign(params, req.query, req.params);
			console.log('>>>>>>>>>>>>>>>>');
			console.log(req);
			console.log('<<<<<<<<<<<<<<<<');
			var result = handler(req.method, params, {});
			if (result === null || result === undefined) next();
			else res.json(result);
		});
	});
};

module.exports = loadHandler;