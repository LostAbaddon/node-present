var n = 10000; // 数量
var v = 300; // 总容量
var vs = []; // 容量组
var ns = []; // 耗时组
var poollimit = 1;

const init = () => {
	for (let i = 0; i < n; i ++) {
		// vs[i] = Math.random() * 10;
		vs[i] = Math.pow(Math.random(), 2) * 10;
		// ns[i] = (Math.random() + Math.random()) / 2 * 10;
		// ns[i] = Math.pow(Math.random(), 0.2) * 10;
		// ns[i] = Math.random() * 10;
		// ns[i] = 10 * Math.pow(1 - vs[i] / 10, 2) * Math.random() * Math.random();
		ns[i] = 10 - Math.pow((Math.random() + Math.random()) / 2, 5) * 10;
		// ns[i] = Math.sqrt(10 * vs[i]);
	}
};

const find2ndSameP = (inside, outside, pow) => {
	var totalV = 0, totalT = 0;
	inside.map(i => {
		totalV += vs[i];
		totalT += ns[i];
	});
	// 重整列外排序
	var index = outside.map(i => {
		var weight = ns[i] * Math.pow(vs[i], -2 - pow);
		return [weight, i];
	});
	index.sort((a, b) => b[0] - a[0]);
	index = index.map(i => i[1]);
	// 列内外交换
	var maxT = totalT, maxV = totalV;
	var result = inside;
	inside.map((i, ind) => {
		var vi = totalV - vs[i];
		var ti = totalT - ns[i];
		var list = inside.map(i => i);
		list.splice(ind, 1);
		index.map(j => {
			var vj = vs[j];
			var tj = ns[j];
			vj = vi + vj;
			tj = ti + tj;
			if (vj < v) {
				vi = vj;
				ti = tj;
				list.push(j);
			}
		});
		if (ti > maxT) {
			maxT = ti;
			maxV = vi;
			result = list;
		}
	});
	return [result, maxV, maxT];
};
const find2nd = (inside, outside, pow) => {
	var totalV = 0, totalT = 0;
	inside.map(i => {
		totalV += vs[i];
		totalT += ns[i];
	});
	// 重整列外排序
	var index = outside.map(i => {
		var weight = ns[i] * Math.pow(vs[i], -2 - pow);
		return [weight, i];
	});
	index = index.map(i => i[1]);
	if (index.length > poollimit) index.splice(poollimit, index.length);
	// 列内外交换
	var maxT = totalT, maxV = totalV;
	var result = inside;
	inside.map((i, ind) => {
		var vi = totalV - vs[i];
		var ti = totalT - ns[i];
		var list = inside.map(i => i);
		list.splice(ind, 1);
		index.map(j => {
			var vj = vs[j];
			var tj = ns[j];
			vj = vi + vj;
			tj = ti + tj;
			if (vj < v) {
				vi = vj;
				ti = tj;
				list.push(j);
			}
		});
		if (ti > maxT) {
			maxT = ti;
			maxV = vi;
			result = list;
		}
	});
	return [result, maxV, maxT];
};

const cal = (p, verse, smooth) => {
	var start = new Date().getTime();
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
			c.push(i);
		}
	});

	var cc = [];
	ps.map(p => !!(c.indexOf(p[0]) < 0) && cc.push(p[0]));

	if (!!smooth) {
		c = smooth(c, cc, p);
		pv = c[1];
		pt = c[2];
		c = c[0];
	}

	var end = new Date().getTime();
	console.log('POW: ' + p + ' | USE: ' + pv + ' : TOTAL: ' + pt + ' : LEN: ' + c.length + ' || TimeSpent: ' + (end - start));
	// console.log(c);
};

// init();
// for (let i = -1.5; i <= -0.5; i += 0.01) {
// 	console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
// 	cal(i);
// 	cal(i, false, find2ndSameP);
// 	poollimit = 1;
// 	cal(i, false, find2nd);
// 	poollimit = 100;
// 	cal(i, false, find2nd);
// }