try {
	let thread = this.thread;
	console.log(111, thread.id);
	setTimeout(() => {
		console.log(113, thread.id);
	}, 1000);
	console.log(112, thread.id);
}
catch (err) {
	console.error(err.message);
}
console.log(Object.keys(this).join('; '));
console.log(Object.keys(this.thread).join('; '));

// Four Two One Loop

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
	time = time || 0;
	time ++;
	num = dealNum(num);
	if (num === 1) return time;
	else return findNum(num, time);
};

var maxLoop = max => {
	var n = 0, m = 0;
	for (var i = 1; i < max; i ++) {
		let t = findNum(i);
		if (t > n) {
			n = t;
			m = i;
		}
	}
	return [m, n];
};

if (!!this.postMessage) {
	this.onmessage = (data) => {
		this.postMessage(maxLoop(data.data));
	};
}
try {
	if (!!process) {
		process.on('message', msg => {
			if (msg.action !== 'maxloop') return;
			process.send({
				action: 'done',
				data: maxLoop(msg.data)
			});
		});
	}
}
catch (err) {}

module.exports = maxLoop;