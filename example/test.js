const http = require('http');

http.get({
	hostname: 'localhost',
	port: 8080,
	path: '/index.html'
}, (...args) => {
	console.log('>>>>>>>>>>>');
	console.log(args);
});