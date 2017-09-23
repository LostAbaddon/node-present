var CurrentQuest = null;
var CurrentPath = '';

var attachScript = path => {
	if (!path) return;
	if (path.substr(0, 1) !== '/') {
		path = CurrentPath + '/' + path;
	}
	try {
		importScripts(path);
	}
	catch (err) {
		console.error('Import Script Error:', path);
		__postError({
			type: 'import_script_error',
			msg: err.message,
			data: path
		});
	}
};
var init = (filelist, loglev) => {
	importScripts(CurrentPath + '/extend.js');
	importScripts(CurrentPath + '/datetime.js');
	importScripts(CurrentPath + '/threads/threadLogger.js');
	importScripts(CurrentPath + '/threads/threadTimer.js');

	setLogLev(loglev);

	filelist.map(path => {
		attachScript(path);
	});
};

this.finish = msg => {
	if (CurrentQuest === null) return;
	this.postMessage({
		action: 'complete',
		data: msg
	});
	CurrentQuest = null;
};
this.post = msg => {
	if (CurrentQuest === null) return;
	this.postMessage({
		quest: CurrentQuest,
		msg: msg
	});
};

// 与主线程通讯
this.onmessage = (data) => {
	data = data.data;
	if (data.action === 'init') {
		CurrentPath = data.path;
		init(data.filelist, data.loglev);
	}
	else if (data.action === 'attach') {
		attachScript(data.script);
	}
	else if (data.action === 'quest') {
		CurrentQuest = data.quest;
	}
	else if (data.action === 'message') {
	}
};