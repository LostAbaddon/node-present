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
const PoolLimit = 100;

const ThreadPool = {};
ThreadPool.addTask = (order, task) => {

};

ThreadPool.Thread = Thread;

module.exports.ThreadPool = ThreadPool;
global.Utils = global.Utils || {};
global.Utils.ThreadPool = ThreadPool;