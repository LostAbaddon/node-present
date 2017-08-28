/**
 * Name:	Cache Resource Manager
 * Desc:    缓存资源管理器
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.08.25
 */

const Mime = require('mime');

const DefaultConfig = {
	prefix: "",
	mem: {
		totalLimit: "-1",
		singleLimit: "-1",
		accept: ['text', 'javascript', 'json']
	}
};

const type2mime = type => {
	return Mime.types[type] || type;
};
const realSize = size => {
	var result = size * 1;
	if (!isNaN(result)) return result;
	var last = size.substring(size.length - 1, size.length);
	result = size.substring(0, size.length - 1) * 1;
	if (isNaN(result)) return 0;
	last = last.toLowerCase();
	if (last === 'k') {
		result *= 1024;
	}
	else if (last === 'm') {
		result *= 1024;
		result *= 1024;
	}
	else if (last === 'g') {
		result *= 1024;
		result *= 1024;
		result *= 1024;
	}
	else if (last === 't') {
		result *= 1024;
		result *= 1024;
		result *= 1024;
		result *= 1024;
	}
	else if (last === 'p') {
		result *= 1024;
		result *= 1024;
		result *= 1024;
		result *= 1024;
		result *= 1024;
	}
	return result;
};

class ResourceCachePack {
	constructor () {
		this.cached = false;
		this.path = '';
		this.realpath = '';
		this.stat = null;
		this.lastModified = null;
		this.etag = '';
		this.chunks = [];
		this.visit = 0;
		this._mime = '';
		this._size = 0;
		Object.defineProperty(this, '_mime', { enumerable: false });
		Object.defineProperty(this, '_size', { enumerable: false });
	}
	get mime () {
		if (this._mime === '') this._mime = Mime.lookup(this.realpath);
		return this._mime;
	}
	get size () {
		if (this._size === 0) {
			let size = 0;
			this.chunks.map(chk => size += chk.length);
			this._size = size;
		}
		return this._size;
	}
	get rate () {
		return this.size / (1 + Math.log(1 + this.visit));
	}
}
class ResourceManager extends global.Utils.EventManager {
	constructor (config) {
		super(['beforeSave', 'afterSave', 'beforeLoad', 'afterLoad', 'beforeDelete', 'afterDelete', 'beforeClear', 'afterClear']);
		var self = this;
		this.config = (config || {}).copy();
		this.config.extent(DefaultConfig);
		this.config.mem.extent(DefaultConfig.mem);
		this.config.mem.accept = this.config.mem.accept.map(type => type2mime(type));
		this.config.mem.totalLimit = realSize(this.config.mem.totalLimit);
		this.config.mem.singleLimit = realSize(this.config.mem.singleLimit);
		this.storage = {};
		this.storageUsage = {};
		this.storageTotalUsage = 0;
		Object.defineProperty(this, 'storage', { enumerable: false });
	}
	async save (key, value, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			var size = value.size;
			var result = { canSave: true };
			self.onBeforeSave(key, value, result);
			let fullkey = self.config.prefix + key;
			if (result.canSave) {
				self.storageUsage[fullkey] = size;
				self.storageTotalUsage += size;
				value.cached = true;
			}
			else {
				value.cached = false;
				self.storageUsage[fullkey] = 0;
			}
			self.storage[fullkey] = value;
			self.onAfterSave(key, value, result);
			!!callback && callback();
			res();
		});
	}
	async load (key, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			var result = { canLoad: true };
			self.onBeforeLoad(key, result);
			var value = null;
			if (result.canLoad) {
				value = self.storage[self.config.prefix + key];
				self.onAfterLoad(key, result);
			}
			!!callback && callback(value);
			res(value);
		});
	}
	async delete (key, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			var result = { canDelete: true };
			self.onBeforeDelete(key, result);
			if (result.canDelete) {
				let fullkey = self.config.prefix + key;
				if (!!self.storage[fullkey]) {
					self.storage[fullkey] = null;
					delete self.storage[fullkey];
					let size = self.storageUsage[fullkey];
					self.storageUsage[fullkey] = 0;
					delete self.storageUsage[fullkey];
					self.storageTotalUsage -= size;
				}
				self.onAfterDelete(key, result);
			}
			!!callback && callback();
			res();
		});
	}
	async clear (callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			var result = { canClear: true };
			self.onBeforeClear(result);
			if (result.canClear) {
				for (let key in self.storage) {
					self.storage[key] = null;
					delete self.storage[key];
				}
				self.storageUsage = {};
				self.storageTotalUsage = 0;
				self.onAfterClear(result);
			}
			!!callback && callback();
			res();
		});
	}
	arrange () {
		console.log('....');
		Object.keys(this.storage).map(c => {
			c = this.storage[c];
			if (c.cached) console.log(c.path, c.size, c.visit);
		});
	}
}

module.exports = ResourceManager;
module.exports.ResourceCachePack = ResourceCachePack;