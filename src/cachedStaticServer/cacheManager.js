/**
 * Name:	Cache Resource Manager
 * Desc:    缓存资源管理器
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.08.24
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
	}
	get mime () {
		return Mime.lookup(this.realpath);
	}
	get size () {
			var size = 0;
			this.chunks.map(chk => size += chk.length);
			return size;
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
		this.lookBeforeSave((path, content, result, event) => {
			var mime = content.mime;
			var has = self.config.mem.accept.some(m => m === mime || m === '*');
			result.canSave = has;
			if (!has) return false;
			var size = content.size;
			if (size >= self.config.mem.singleLimit) return false;
			if (size + self.storageTotalUsage >= self.config.mem.totalLimit) return false;
			return true;
		});
	}
	async save (key, value, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			var size = value.size;
			var result = { canSave: true };
			self.onBeforeSave(key, value, result);
			if (result.canSave) {
				let fullkey = self.config.prefix + key;
				self.storage[fullkey] = value;
				self.storageUsage[fullkey] = size;
				self.storageTotalUsage += size;
				self.onAfterSave(key, value, result);
			}
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
			// console.log('>>>>>>>>>', key);
			// console.log(value);
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
				self.storage[self.config.prefix + key] = null;
				delete self.storage[self.config.prefix + key];
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
				self.onAfterClear(result);
			}
			!!callback && callback();
			res();
		});
	}
}

module.exports = ResourceManager;
module.exports.ResourceCachePack = ResourceCachePack;