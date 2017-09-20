const Thread = require('webworker-threads');
const MaxLoop = require('./fto');
const Max = 500000;
const Times = 20;
const Pool = 80;

var taskNormal = (times, cb) => {
	var tag = 'Normal';
	console.time(tag);
	for (var i = 0; i < times; i ++) {
		console.log(MaxLoop(Max));
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
		thread.eval('maxLoop(' + Max + ')', (err, data) => {
			console.log(data);
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
		worker.onmessage = (msg) => {
			console.log(msg.data);
			worker.terminate();
			count --;
			if (count === 0) {
				console.timeEnd(tag);
				!!cb && cb();
			}
		};
	}
};
var taskPool = (times, cb) => {
	var tag = 'Pool  ';
	console.time(tag);
	var pool = Thread.createPool(Pool);
	pool.load('./fto.js');
	var count = 0;
	for (var i = 0; i < times; i ++) {
		count ++;
		pool.any.eval('maxLoop(' + Max + ')', (err, data) => {
			console.log(data);
			count --;
			if (count === 0) {
				pool.destroy(true);
				console.timeEnd(tag);
				!!cb && cb();
			}
		});
	}
};

taskNormal(Times, () => {
	taskThread(Times, () => {
		taskWorker(Times, () => {
			taskPool(Times);
		});
	});
});