var result = {
	"name": "Hello Moto!",
	"nick": "Aloha Kosmos~"
};

var handler = (method, params, session, callback) => {
	callback(result);
};

module.exports = handler;