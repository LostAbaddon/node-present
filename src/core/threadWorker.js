const timerPool = [];
const getStamp = () => new Date().getTime();
const dispatchTask = (task) => {
	var shouldStart = (timerPool.length === 0);
	timerPool.push(task);
};
this.setImmediate = cb => {
	var data = {
		tag: 0,
		func: cb,
		expire: getStamp(),
		keep: false,
		delay: true
	};
	dispatchTask(data);
};
this.setTimeout = (cb, delay) => {
	delay = (delay * 1) || 0;
	var data = {
		tag: 1,
		func: cb,
		expire: getStamp() + delay,
		keep: false,
		delay: true
	};
	dispatchTask(data);
};
this.setInterval = (cb, delay, delayMode) => {
	delay = (delay * 1) || 0;
	var data = {
		tag: 2,
		func: cb,
		expire: getStamp() + delay,
		keep: true,
		delay: !delayMode ? true : false
	};
	dispatchTask(data);
};

var CurrentQuest = null;
this.finish = msg => {
	console.log('Finish: ' + CurrentQuest);
	if (CurrentQuest === null) return;
	this.postMessage({
		action: 'complete',
		quest: CurrentQuest,
		msg: msg
	});
	CurrentQuest = null;
};
this.post = msg => {
	console.log('Post: ' + CurrentQuest);
	if (CurrentQuest === null) return;
	this.postMessage({
		quest: CurrentQuest,
		msg: msg
	});
};

// 与主线程通讯
this.onmessage = (data) => {
	data = data.data;
	console.log('Thread Get Message:');
	if (data.action === 'quest') {
		CurrentQuest = data.quest;
		// console.log('Mission Start >>>>');
		// console.log(data.data);
	}
	else if (data.action === 'message') {
		// console.log('Message Recieved >>>>');
		// console.log(data.data);
	}

	console.log('????');
	setTimeout(function () {
		console.log('xxxxxxxxxxxxxx');
		post('FuckSlowTheBitch!!!');
	}, 1000);
	// setTimeout(function () {
	// 	console.log('ssssssssssssss');
	// 	this.finish({
	// 		target: 'Slow',
	// 		title: 'Bitch',
	// 		action: 'Fuck'
	// 	});
	// }, 2000);
	console.log('!!!!');
};

// Main Code Part Below

console.log('Start Thread');
setImmediate(() => console.log(1));
console.log(2)
console.log('VVVVVVVVVVVVVVVVVVV');

// try {
// 	setTimeout(() => {
// 		console.log('XXXXXXXXXXoooooooooXXXXXXXXXX');
// 	}, 1000);
// }
// catch (err) {
// 	console.error(err.message);
// }

