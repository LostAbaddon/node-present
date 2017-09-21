console.log('Start Thread');
try {
	setTimeout(() => {
		console.log('XXXXXXXXXXoooooooooXXXXXXXXXX');
	}, 1000);
}
catch (err) {
	console.error(err.message);
}

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