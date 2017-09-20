/**
 * Name:	Thread Manager
 * Desc:    辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.09.20
 *
 * 基于 WebWorker-Threads 的线程管理中心
 */

var Thread = require('webworker-threads');
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



var dealNum = num => {
	var half = Math.floor(num / 2);
	if (half * 2 === num) {
		return half;
	}
	else {
		return num * 3 + 1;
	}
};
var findNum = (num, time) => {
	num = dealNum(num);
	if (time === 0) return num;
	else return findNum(num, time - 1);
};

var init = 9999999;
var time = 1000;
var loop = 1000;

var task1 = (cb) => {
	var tag = 'Task1';
	console.time(tag);
	for (let i = 0; i < time; i ++) {
		findNum(init, loop);
	}
	console.timeEnd(tag);
	cb();
};

var threadTask = cb => {
	var thread = Thread.create();
	thread.eval(dealNum).eval(findNum).call((loop, init) => {
		var result = findNum(init, loop);
		self.close();
		return result;
	}, loop, init, (err, data) => {
		thread.destroy();
		cb(data);
	});
};
var task2 = cb => {
	var tag = 'Task2';
	console.time(tag);
	var count = 0;
	for (let i = 0; i < time; i ++) {
		count ++;
		threadTask(() => {
			count --;
			if (count === 0) {
				console.timeEnd(tag);
				cb();
			}
		});
	}
};
var task3 = cb => {
	var tag = 'Task3';
	console.time(tag);
	var count = 0;
	var pool = Thread.createPool(4);
	pool.all.eval(dealNum).all.eval(findNum);
	for (let i = 0; i < time; i ++) {
		count ++;
		pool.any.call((loop, init) => {
			var result = findNum(init, loop)
			self.close();
			return result
		}, loop, init, (err, data) => {
			count --;
			if (count === 0) {
				pool.destroy(true);
				console.timeEnd(tag);
				cb();
			}
		});
	}
};

task1(() => {
	task2(() => {
		task3(() => {
			// task1(() => {});
			// task2(() => {});
			// task3(() => {});
		});
	});
});

return;



var pool = Thread.createPool(10);
var task = index => {
	console.log('God!!! ' + thread.id + ' | ' + index);
	thread.emit('signal', thread.id);
	return thread.id;
};
var cb = (err, data) => {
	if (!err) {
		console.log('xxxxx', data, 'P:' + pool.pendingJobs(), 'I:' + pool.idleThreads(), 'T:' + pool.totalThreads());
	}
	else {
		console.log('error', err, 'P:' + pool.pendingJobs(), 'I:' + pool.idleThreads(), 'T:' + pool.totalThreads());
	}
};
for (let i = 0; i < 100; i ++) pool.any.call(task, i, cb);

return;



// console.log(pool);
// return;



var Worker = require('webworker-threads').Worker;
 
var worker = new Worker(function () {
});
worker.onmessage = function (event) {
	// console.log("Worker said : " + event.data);
	console.log(event.data);
};