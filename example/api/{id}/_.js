var result = new Date();

var handler = (method, params, session, callback) => {
	callback(result);
};

module.exports = handler;