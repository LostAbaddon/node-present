// Strng Extends

String.prototype.prepadding = function (len, padding) {
	var str = this.toString();
	padding = padding || ' ';
	len = len || 0;
	var l = str.length;
	for (let i = l; i < len; i ++) str = padding + str;
	return str;
};

const KeySet = [];
(() => {
	for (let i = 0; i < 10; i ++) KeySet.push('' + i);
	for (let i = 65; i <= 90; i ++) KeySet.push(String.fromCharCode(i));
	for (let i = 97; i <= 122; i ++) KeySet.push(String.fromCharCode(i));
}) ();
String.random = (len) => {
	var rnd = "";
	for (let i = 0; i < len; i ++) {
		rnd += KeySet[Math.floor(KeySet.length * Math.random())];
	}
	return rnd;
};

// Object extends

Object.prototype.copy = function () {
	return Object.assign({}, this);
}
Object.prototype.extent = function (...targets) {
	var copy = Object.assign({}, this);
	targets.reverse();
	Object.assign(this, ...targets, copy);
}
Array.prototype.copy = function () {
	return this.map(ele => ele);
};