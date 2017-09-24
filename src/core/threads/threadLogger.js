((global) => {
	const _log = console.log;
	const _error = console.error;
	const timeNormalize = global.Utils.getTimeString;
	const combine = (prefix, ...args) => {
		var result = args.map(a => {
			if (typeof a === 'number' || a instanceof Number) return '' + a;
			if (typeof a === 'string' || a instanceof String) return a;
			return JSON.stringify(a);
		});
		result = result.join(' ');
		return prefix + ' ' + result;
	};

	var loglev = 0;
	var console_info = function () {
		if (loglev <= 1) {
			[].unshift.call(arguments, '[INFO (T-' + thread.id + ' ' + timeNormalize() + ')]');
			_log(combine.apply(console, arguments));
		}
	};
	var console_log = function () {
		if (loglev <= 2) {
			[].unshift.call(arguments, '[LOG  (T-' + thread.id + ' ' + timeNormalize() + ')]');
			_log(combine.apply(console, arguments));
		}
	};
	var console_warn = function () {
		if (loglev <= 3) {
			[].unshift.call(arguments, '[WARN (T-' + thread.id + ' ' + timeNormalize() + ')]');
			_error(combine.apply(console, arguments));
		}
	};
	var console_error = function () {
		if (loglev <= 4) {
			[].unshift.call(arguments, '[ERROR(T-' + thread.id + ' ' + timeNormalize() + ')]');
			_error(combine.apply(console, arguments));
		}
	};
	console.info = console.log;
	console.warn = console.error;
	global.setLogLev = lv => {
		if (isNaN(lv)) return;
		loglev = lv;
		if (loglev < 1) {
			console.log = _log;
			console.log = _log;
			console.warn = _error;
			console.error = _error;
		}
		else {
			console.info = console_info;
			console.log = console_log;
			console.warn = console_warn;
			console.error = console_error;
		}
	};
}) (this);