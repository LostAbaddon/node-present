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

try {
	if (!!self) {
		self.onmessage = (data) => {
			self.postMessage(maxLoop(data.data));
		};
	}
}
catch (err) {}

module.exports = maxLoop;