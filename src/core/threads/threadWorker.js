var CurrentQuest = null;
var CurrentPath = '';

var init = () => {
	importScripts(CurrentPath + '/threads/threadTimer.js');
};

this.finish = msg => {
	if (CurrentQuest === null) return;
	this.postMessage({
		action: 'complete',
		data: msg
	});
	CurrentQuest = null;
};
this.post = msg => {
	if (CurrentQuest === null) return;
	this.postMessage({
		quest: CurrentQuest,
		msg: msg
	});
};

// 与主线程通讯
this.onmessage = (data) => {
	data = data.data;
	if (data.action === 'init') {
		CurrentPath = data.data;
		init();
	}
	else if (data.action === 'quest') {
		CurrentQuest = data.quest;
	}
	else if (data.action === 'message') {
	}
};

// console.log('xxx 1');
// setTimeout(() => {console.log('xxx 2');}, 1000);
// setInterval(() => {console.log('xxx 3');}, 1000);
// setImmediate(() => {console.log('xxx 4');}, 1000);
// setTimeout(() => {
// 	console.log('xxx ooo');
// 	setImmediate(() => {
// 		console.log('xxx vvv');
// 		clearInterval(AllTimerTag);
// 	}, 1000);
// }, 5000);
