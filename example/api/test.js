var result = {
	"name": "Hello Moto!xxxx",
	"nick": "Aloha Kosmos~xxxx"
};

var handler = (method, params, session, callback) => {
	callback(result);
};

module.exports = handler;