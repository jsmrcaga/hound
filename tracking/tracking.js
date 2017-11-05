const join = require('path').join;
const utils = require(join(__dirname, '../lib/utils'));
let tracking = {};

tracking.track = function(campaign, req, usr=null, pixel=false){
	let user = req.cookies['hound-user'] || usr || utils.genUUID();
	campaign.track(req.query.hound_ref, req.query.hound_source, req.query.hound_medium, req.query.hound_extra || null, user, pixel);
	return {
		uri: campaign.redir || req.query.redirect_uri || 'https://google.com',
		user: user,
	};
};

tracking.pixel = function(pixel, req){
	let campaign = DB.Campaigns.get(pixel.campaign);
	if(!campaign && req.query.redirect_uri){
		return req.query.redirect_uri;
	} else if(!campaign && !req.query.redirect_uri){
		return 'https://google.com';
	}


	let user = req.cookies['hound-user'] || utils.genUUID();
	pixel.track(user);
	return tracking.track(campaign, req, user, true);
};

module.exports = tracking;