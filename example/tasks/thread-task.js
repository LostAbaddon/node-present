((global) => {
	var task = {
		quest: 'Science',
		worker: async opt => {
			console.log('Mission Start!!!');
			post('Aloha Kosmos~~~')
			console.log('Message Sent...');
			setTimeout(() => {
				global.finish('Fuck Slow The Bitch~~~');
			}, 1000);
			// return 'Fuck Bitch Slow~~~';
		},
		onmessage: msg => {
			console.log('Recieve A MSG~~~');
			console.log(msg);
		}
	};

	global.register(task);
}) (this);