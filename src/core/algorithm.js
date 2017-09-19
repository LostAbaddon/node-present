/**
 * Name:	Algorithm
 * Desc:    算法
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.09.20
 */

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

const ArrangePow = 0.9;
const arrangeRoom = (goods, sizeLimit) => {
	var start = new Date().getTime();
	var totalValue = 0, totalSize = 0, inside = [], outside = [];
	var room = goods.map(g => [g.value / Math.pow(g.size, ArrangePow), g.size, g]);
	room.sort((ga, gb) => gb[0] - ga[0]);
	room.map(g => {
		var v = g[0], s = g[1];
		var nextSize = totalSize + s;
		if (nextSize < sizeLimit) {
			totalSize = nextSize;
			totalValue += v;
			inside.push(g);
		}
	});
	room.map(g => !!(inside.indexOf(g) < 0) && outside.push(g));
	outside = outside.map(g => g[0] = g[2].value / Math.pow(g[1], 2 - ArrangePow));
	outside.sort((ga, gb) => gb[0] - ga[0]);

	return inside.map(g => g[2]);
};

module.exports.arrangeRoom = arrangeRoom;
global.Utils = global.Utils || {};
global.Utils.Algorithm = {
	arrangeRoom: arrangeRoom
};