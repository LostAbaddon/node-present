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
	},
	interval: {
		"arrange": "1m",
		"checkout": "10m"
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
const realTime = time => {
	var result = time * 1;
	if (!isNaN(result)) return result;
	var last = time.substring(time.length - 1, time.length);
	result = time.substring(0, time.length - 1) * 1;
	if (isNaN(result)) return 0;
	last = last.toLowerCase();
	if (last === 's') {
		result *= 1000;
	}
	else if (last === 'm') {
		result *= 1000;
		result *= 60;
	}
	else if (last === 'h') {
		result *= 1000;
		result *= 60;
		result *= 60;
	}
	else if (last === 'd') {
		result *= 1000;
		result *= 60;
		result *= 60;
		result *= 24;
	}
	else if (last === 'y') {
		result *= 1000;
		result *= 60;
		result *= 60;
		result *= 24;
		result *= 365;
	}
	else if (last === 'c') {
		result *= 1000;
		result *= 60;
		result *= 60;
		result *= 24;
		result *= 365;
		result *= 100;
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
		this.created = 0;
		this.updated = 0;
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
		var now = new Date().getTime();
		var cnow = Math.ceil((now - this.created) / 1000 / 60); // 创建寿命，分钟为单位
		var unow = Math.ceil((now - this.updated) / 1000 / 60); // 访问寿命，分钟为单位
		if (cnow < 1) cnow = 1;
		if (unow < 1) unow = 1;
		var cpow = this.visit / cnow; // 单位时间访问量
		var upow = Math.log(1 + this.visit) / (unow < 1 ? 1 : unow); // 最近访问量指数
		var spow = this.size / 1024; // 体积指数，KB为单位
		var rate = (2 * upow + cpow) * spow;
		return rate;
	}
	delete () {
		this.stat = null;
		this.chunks = [];
		this._size = 0;
		this.cached = false;
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
		this.config.interval.extent(DefaultConfig.interval);
		this.config.interval.arrange = realTime(this.config.interval.arrange);
		this.config.interval.checkout = realTime(this.config.interval.checkout);
		this.storage = {};
		this.storageUsage = {};
		this.storageTotalUsage = 0;
		Object.defineProperty(this, 'storage', { enumerable: false });

		// Temp
		setTimeout(() => {
			this.arrange();
		}, this.config.interval.arrange);
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
			if (value.created === 0) value.created = new Date().getTime();
			if (value.created > (value.updated || 0)) value.created = value.updated
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
				if (!value) value = new ResourceManager.ResourceCachePack();
				value.updated = new Date().getTime();
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
					self.storage[fullkey].delete();
					let size = self.storageUsage[fullkey];
					self.storageUsage[fullkey] = 0;
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
					self.storage[key] = undefined;
				}
				self.storageUsage = {};
				self.storageTotalUsage = 0;
				self.onAfterClear(result);
			}
			!!callback && callback();
			res();
		});
	}
	async arrange () {
		console.time('Arrange');
		var map = [];
		Object.keys(this.storage).map(c => {
			var d = this.storage[c];
			map.push({
				key: c,
				value: d.rate,
				size: d.size / 1024 // 体积以KB为单位
			});
		});
		map = await global.Utils.Algorithm.arrangeRoom(map, this.config.mem.totalLimit / 1024);
		map.map(c => {
			var r = c.value, s = c.size;
			c = c.key;
			c = this.storage[c];
		});
		console.timeEnd('Arrange');
		setTimeout(() => {
			this.arrange();
		}, this.config.interval.arrange);
	}
}

module.exports = ResourceManager;
module.exports.ResourceCachePack = ResourceCachePack;