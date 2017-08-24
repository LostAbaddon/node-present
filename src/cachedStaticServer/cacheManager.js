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

class ResourceManager extends global.Utils.EventManager {
	constructor (config) {
		super(['beforeSave', 'afterSave', 'beforeLoad', 'afterLoad', 'beforeDelete', 'afterDelete', 'beforeClear', 'afterClear']);
		var self = this;
		this.config = (config || {}).copy();
		this.config.extent(DefaultConfig);
		this.config.mem.extent(DefaultConfig.mem);
		this.config.mem.accept = this.config.mem.accept.map(type => type2mime(type));
		this.storage = {};
		Object.defineProperty(this, 'storage', { enumerable: false });
		this.lookBeforeSave((path, content, result, event) => {
			var mime = Mime.lookup(path);
			var has = self.config.mem.accept.some(m => m === mime || m === '*');
			result.canSave = has;
		});
	}
	async save (key, value, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			var result = { canSave: true };
			self.onBeforeSave(key, value, result);
			if (result.canSave) {
				self.storage[self.config.prefix + key] = value;
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
			console.log('>>>>>>>>>', key);
			console.log(value);
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