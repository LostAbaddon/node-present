const Present = require('../');

Present('./config.json').onUpload((success, req, res, next) => {
	console.log('Upload!!!');
	console.log(success);
	console.log(req.files);
	res.send("Aloha Kosmos!!!");
});