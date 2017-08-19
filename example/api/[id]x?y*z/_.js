var result = "Holy Shit!!!";

var handler = (method, params, session, callback) => {
	callback(result);
};

module.exports = handler;