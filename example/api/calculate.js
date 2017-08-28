var n = 1000; // 数量
var v = 100; // 总容量
var vs = []; // 容量组
var ns = []; // 耗时组

const init = () => {
	for (let i = 0; i < n; i ++) {
		// vs[i] = Math.random() * 10;
		vs[i] = Math.pow(Math.random(), 2) * 10;
		ns[i] = (1 - Math.random() * Math.random()) * 10;
		// ns[i] = Math.random() * 10;
		// ns[i] = 10 - vs[i];
	}
};

const cal = (p, verse) => {
	var pow = i => ns[i] * Math.pow(vs[i], p);
	var ps = [];
	for (let i = 0; i < n; i ++) {
		ps[i] = [i, pow(i)];
	}
	if (!!verse) {
		ps.sort((a, b) => a[1] - b[1]);
	}
	else {
		ps.sort((a, b) => b[1] - a[1]);
	}

	var c = [];
	var pv = 0;
	var pt = 0;

	ps.map(p => {
		var i = p[0];
		var pc = vs[i];
		var tpv = pv + pc;
		if (tpv <= v) {
			pv = tpv;
			pt += ns[i];
			c.push([i, pc, ns[i]]);
		}
	});
	console.log('POW: ' + p + ' | USE: ' + pv + ' : TOTAL: ' + pt);
	// console.log(c);
};

// init();
// for (let i = -1.25; i <= -0.7; i += 0.01) cal(i);