((global) => {
	var task = {
		quest: 'Science',
		worker: async opt => {
			console.info('Mission Start!!!');
			post('Aloha Kosmos~~~')
			console.warn('Message Sent...');
			setTimeout(() => {
				global.finish('Fuck Slow The Bitch~~~');
			}, 1000);
			// return 'Fuck Bitch Slow~~~';
		},
		onmessage: msg => {
			console.info('Recieve A MSG~~~');
			console.log(msg);
		}
	};

	global.register(task);
}) (this);