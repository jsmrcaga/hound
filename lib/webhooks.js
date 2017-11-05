const fishingrod = require('fishingrod');
let webhooks = {};

webhooks.send = function(event, data){
	let hooks = DB.Webhooks.all();
	for(let hook of hooks){
		hook.data = {
			event_id: event,
			data: data
		};
		hook.headers = {
			'Content-Type': 'application/json'
		};

		fishingrod.fish(hook).then(res => {
			if(res.status >= 300 || res.status < 200){
				throw new Error('Error on hook');
			}
		}).catch(e => {
			console.error(e);
		});
	}
};

module.exports = webhooks;