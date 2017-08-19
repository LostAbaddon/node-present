var result = [0, 1, 2, 3];

var handler = (method, params, session, callback) => {
	callback(result);
};

module.exports = handler;