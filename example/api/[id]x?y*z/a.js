var result = {
	"hello": "moto",
	"aloha": "kosmos"
};

var handler = (method, params, session, callback) => {
	callback(result);
};

module.exports = handler;