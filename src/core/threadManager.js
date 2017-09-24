/**
 * Name:	Thread Manager
 * Desc:    辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.09.21
 *
 * 基于 WebWorker-Threads 的线程管理中心
 */

// 对WebWorker-Threads的拓展
const Thread = require('webworker-threads');
Thread._create = Thread.create;
Thread.create = () => {
	var thread = Thread._create();
	thread.call = (func, ...args) => {
		var cb = args.pop();
		args = JSON.stringify(args);
		args = args.substring(1, args.length - 1);
		return thread.eval("(" + func + ")(" + args + ")", cb);
	};
	return thread;
};
Thread._createPool = Thread.createPool;
Thread.createPool = n => {
	var pool = Thread._createPool(n);
	pool.any.call = (func, ...args) => {
		var cb = args.pop();
		args = JSON.stringify(args);
		args = args.substring(1, args.length - 1);
		return pool.any.eval("(" + func + ")(" + args + ")", cb);
	};
	pool.all.call = (func, ...args) => {
		var cb = args.pop();
		args = JSON.stringify(args);
		args = args.substring(1, args.length - 1);
		return pool.all.eval("(" + func + ")(" + args + ")", cb);
	};
	return pool;
};

// 线程池参数
const CPUCount = require('os').cpus().length;
const ThreadPerCPU = 10;
const PoolLimit = CPUCount * ThreadPerCPU;

const elfSoul = __dirname + '/threads/threadWorker.js';
const freeWorld = [];
const battleField = [];

// 封装的Worker类
class Deacon {
	constructor (soul, ghosts, loglev) {
		var ego = this;
		loglev = loglev || 0;
		var logger = global.logger(loglev);
		soul = soul || elfSoul;
		ego.soul = new Thread.Worker(soul);
		ego.soul.isfree = true;
		ego.soul.onmessage = msg => {
			msg = msg.data;
			if (!!ego.messager) {
				if (msg.action === 'complete') {
					ego.soul.isfree = true;
					var index = battleField.indexOf(ego);
					if (index >= 0) battleField.splice(index, 1);
					freeWorld.push(ego);
					if (!!ego.reaper) ego.reaper({
						quest: msg.quest,
						msg: msg.data
					});
					ego.messager = null;
					ego.reaper = null;
				}
				else if (msg.action === 'message') {
					if (!!ego.messager) ego.messager({
						quest: msg.quest,
						msg: msg.msg
					});
				}
			}
		};
		ego.soul.thread.on('error', err => {
			logger.error("Thread " + ego.soul.thread.id + " Error: (" + err.type + ")");
			logger.error(err.msg);
			logger.error(err.data);
		});
		ego.soul.postMessage({
			action: 'init',
			path: __dirname,
			filelist: ghosts,
			loglev: loglev
		});
		freeWorld.push(ego);
	}
	get isFree () {
		return this.soul.isfree;
	}
	dispatch (quest, data, messager, reaper) {
		this.messager = messager;
		this.reaper = reaper;
		this.soul.isfree = false;
		var index = freeWorld.indexOf(this);
		if (index >= 0) freeWorld.splice(index, 1);
		battleField.push(this);
		this.soul.postMessage({
			action: 'quest',
			quest: quest,
			data: data
		});
		return this;
	}
	submit (msg) {
		this.soul.postMessage({
			action: 'message',
			data: msg
		});
		return this;
	}
	suicide () {
		if (!this.soul.isfree) return false;
		this.soul.isfree = false;
		freeWorld.splice(freeWorld.indexOf(this), 1);
		this.soul.terminate();
		return true;
	}
	attach (script) {
		var len = script.length;
		if (script.indexOf('\n') >= 0 || script.substring(len - 3, len).toLowerCase() !== '.js') {
			this.soul.thread.eval(script);
		}
		else {
			this.soul.thread.load(script);
		}
	}
	onmessage (cb) {
		this.messager = cb;
		return this;
	}
	onfinish (cb) {
		this.reaper = cb;
		return this;
	}
}

var deacon = new Deacon(null, [ process.cwd() + '/../example/tasks/thread-task.js' ], 1);
deacon.dispatch('Science', { title: 'Fuck', target: 'SlowTheBitch' }, msg => {
	console.log('Messager >>>>');
	console.log(msg);
}, msg => {
	console.log('Reaper >>>>');
	console.log(msg);
}).submit('What The Fuck!!!');
setTimeout(() => {
	deacon.attach('console.log(CurrentQuest);report("What", "The", "Fuck");console.log("??????")');
}, 1000);

return;


var pool = [];
const ThreadPool = {
	get size () {
		return pool.length;
	}
};
ThreadPool.init = size => {
	if (isNaN(size)) size = PoolLimit;
	else {
		size = Math.floor(size);
		if (size > PoolLimit) size = PoolLimit;
		else if (size < 1) size = 1;
	}
	for (let i = 0; i < size; i ++) {
		let thread = Thread.create();
		pool.push(thread);
	}
};
ThreadPool.addTask = (order, task) => {

};

console.log(ThreadPool);

ThreadPool.Thread = Thread;

module.exports.ThreadPool = ThreadPool;
global.Utils = global.Utils || {};
global.Utils.ThreadPool = ThreadPool;