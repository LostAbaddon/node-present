var result = {
	"name": "Hello Moto!",
	"nick": "Aloha Kosmos~"
};

var handler = (method, params, session) => {
	return result;
};

module.exports = handler;