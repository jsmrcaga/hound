const qs = require('querystring');
const fishingrod = require('fishingrod');
let shortener = {};

shortener.bitly = function(link){
	return fishingrod.fish({
		https: true,
		host: 'api-ssl.bitly.com',
		path: '/v3/shorten?' + qs.stringify({
			longUrl: link,
			access_token: Config.shorteners.bitly.access_token
		})
	}).then(res => {
		try {
			let response = JSON.parse(res.response);
			if(response.status_code !== 200){
				throw new Error(response);
			}

			return response.data.url;
		} catch(e) {
			e.res = res.response;
			throw e;
		}
	}).catch(e => {
		console.error(e);
		throw e;
	});
};

module.exports = shortener;