const DefaultConfig = {
	prefix: "Resource::",
};

class Manager {
	constructor (config) {
		this.config = Object.assign(config || {}, DefaultConfig);
		this.storage = {};
	}
	async save (key, value, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			self.storage[self.config.prefix + key] = value;
			!!callback && callback();
			res();
		});
	}
	async load (key, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			var value = self.storage[self.config.prefix + key];
			!!callback && callback(value);
			res(value);
		});
	}
	async delete (key, callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			self.storage[self.config.prefix + key] = null;
			delete self.storage[self.config.prefix + key];
			!!callback && callback();
			res();
		});
	}
	async clear (callback) {
		var self = this;
		// Use Memory Cache
		return new Promise((res, rej) => {
			for (let key in self.storage) {
				self.storage[key] = null;
				delete self.storage[key];
			}
			!!callback && callback();
			res();
		});
	}
}

module.exports = Manager;