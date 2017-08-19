/**
 * Name:	File Uploader
 * Desc:    将文件上传到指定目录
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.08.19
 *
 * config:
 * 		destination		保存的根路径
 * 		keeyname		是否保存原文件名
 * 		timely			是否追加时间信息，false不加，'folder'在分类路径下以时间为次目录，'postfix'在文件名后加时间为标记
 * 		classify		分类器，key是文件类型，value是分类目录
 */

const Path = require('path');
const Multer = require('multer');
const Mime = require('mime');

const uploader = (app, config, callback) => {
	var folderCreating = false;
	var waitForFolderCreating = (cb) => {
		if (!folderCreating) return cb();
		setTimeout(() => {
			waitForFolderCreating(cb);
		}, 0);
	};
	var storage = Multer.diskStorage({
		destination: function (req, file, next) {
			var filepath = config.destination + '/';
			if (config.timely === 'folder') {
				filepath += global.Utils.getTimeString(null, 'YYMMDD') + '/';
			}
			if (!!config.classify) {
				let mime = file.mimetype;
				Object.keys(config.classify).some((c) => {
					if (mime.indexOf(c) >= 0) {
						filepath += config.classify[c];
						return true;
					}
				});
			}
			waitForFolderCreating(() => {
				folderCreating = true;
				Utils.preparePath(filepath, (result) => {
					folderCreating = false;
					if (result) {
						next(null, filepath);
					}
					else {
						throw('Can\'t Create Upload Folder: ' + filepath);
					}
				});
			});
		},
		filename: function (req, file, next) {
			waitForFolderCreating(() => {
				var filename, ext;
				if (config.keepname) {
					ext = Path.extname(file.originalname);
					filename = file.originalname;
					filename = filename.substring(0, filename.lastIndexOf(ext));
					if (config.timely === 'postfix') {
						filename += '_' + global.Utils.getTimeString(null, 'YYMMDDhhmmss', '.', '.', '.');
					}
				}
				else {
					filename = String.random(32);
				}
				ext = Mime.extensions[file.mimetype];
				if (!ext) {
					ext = Path.extname(file.originalname);
				}
				else {
					ext = '.' + ext;
				}
				filename += ext;
				next(null, filename);
			});
		}
	});
	var multer = Multer({ storage: storage }).any();
	app.post(config.url, (req, res, next) => {
		multer(req, res, (err) => {
			if (!err) {
				res.status(200);
				callback(true, req, res);
			}
			else {
				res.status(404);
				callback(false, req, res);
			}
			res.end();
		});
	});
};

module.exports = uploader;