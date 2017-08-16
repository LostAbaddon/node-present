var result = {
	"hello": "moto",
	"aloha": "kosmos"
};

var handler = (method, params, session) => {
	return result;
};

module.exports = handler;