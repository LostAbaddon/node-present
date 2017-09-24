const { fork } = require('child_process');
const Thread = require('webworker-threads');
require('../src/');
const ThreadPool = require('../src/core/threadManager');
// const MaxLoop = require('./fto');
const Max = 500000;
const Times = 20;
const Pool = 80;
const silence = true;

var taskNormal = (times, cb) => {
	var tag = 'Normal';
	console.time(tag);
	for (var i = 0; i < times; i ++) {
		let data = MaxLoop(Max);
		if (!silence) console.log(data);
	}
	console.timeEnd(tag);
	!!cb && cb();
};
var taskThread = (times, cb) => {
	var tag = 'Thread';
	console.time(tag);
	var count = 0;
	for (var i = 0; i < times; i ++) {
		count ++;
		let thread = Thread.create();
		thread.load('./fto.js');
		thread.emitSerialized('message', { data: Max });
		thread.on('message', msg => {
			if (!silence) console.log(msg);
			thread.destroy();
			count --;
			if (count === 0) {
				console.timeEnd(tag);
				!!cb && cb();
			}
		});
	}
};
var taskWorker = (times, cb) => {
	var tag = 'Worker';
	console.time(tag);
	var count = 0;
	for (var i = 0; i < times; i ++) {
		count ++;
		let worker = new Thread.Worker('./fto.js');
		worker.postMessage(Max);
		worker.onmessage = msg => {
			if (!silence) console.log(msg.data);
			worker.terminate();
			count --;
			if (count === 0) {
				console.timeEnd(tag);
				!!cb && cb();
			}
		};
	}
};
var taskPool = (times, pool, cb) => {
	if (typeof pool === 'function') {
		cb = pool;
		pool = Pool;
	}
	else if (isNaN(pool)) {
		pool = Pool;
	}
	var tag = 'Pool(' + pool + ')';
	console.time(tag);
	var pool = Thread.createPool(pool);
	pool.load('./fto.js');
	var count = 0;
	for (var i = 0; i < times; i ++) {
		count ++;
		pool.any.eval('maxLoop(' + Max + ')', (err, data) => {
			if (!silence) console.log(data);
			count --;
			if (count === 0) {
				pool.destroy(true);
				console.timeEnd(tag);
				!!cb && cb();
			}
		});
	}
};
var taskCluster = (times, pool, cb) => {
	if (typeof pool === 'function') {
		cb = pool;
		pool = Pool;
	}
	else if (isNaN(pool)) {
		pool = Pool;
	}
	if (pool < 0) {
		pool = times;
	}
	var calltask = () => {
		if (tasks <= 0) return;
		count ++;
		tasks --;
		var child = fork('./fto.js');
		child.on('message', msg => {
			if (msg.action !== 'done') return;
			if (!silence) console.log(msg.data);
			child.disconnect();
			count --;
			if (tasks > 0) {
				calltask();
			}
			else if (count === 0) {
				console.timeEnd(tag);
				!!cb && cb();
			}
		});
		child.send({
			action: 'maxloop',
			data: Max
		});
	};
	var tag = 'Cluster(' + pool + ')';
	console.time(tag);
	var count = 0;
	var tasks = times;
	for (var i = 0; i < pool; i ++) {
		calltask();
	}
};

return;

taskNormal(Times, () => {
	taskThread(Times, () => {
		taskWorker(Times, () => {
			taskPool(Times, 1, () => {
				taskPool(Times, 4, () => {
					taskPool(Times, 8, () => {
						taskPool(Times, 10, () => {
							taskPool(Times, 20, () => {
								taskCluster(Times, 1, () => {
									taskCluster(Times, 4, () => {
										taskCluster(Times, 8, () => {
											taskCluster(Times, 10, () => {
												taskCluster(Times, 20, () => {});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
});