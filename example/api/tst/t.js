var result = true;

var handler = (method, params, session, callback) => {
	callback(result);
};

module.exports = handler;